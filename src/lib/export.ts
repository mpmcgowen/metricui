"use client";

// ---------------------------------------------------------------------------
// Export utilities — PNG capture, CSV generation, clipboard, file naming
// ---------------------------------------------------------------------------

/**
 * Generate a clean, human-readable filename from context.
 * Pattern: "Title — Filters — Date.ext"
 */
export function exportFilename(
  title: string,
  ext: string,
  filters?: string,
): string {
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const parts = [title, filters, date].filter(Boolean).join(" — ");
  // Sanitize for filesystem
  const clean = parts.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, " ").trim();
  return `${clean}.${ext}`;
}

/**
 * Capture a DOM element as a PNG blob using html2canvas.
 * Embeds fonts inline and resolves CSS variables before capture.
 */
export async function captureElementAsPng(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const scale = window.devicePixelRatio || 2;

  // Track all temporary changes to restore after capture
  const cleanup: (() => void)[] = [];

  // 1. Embed fonts inline so html2canvas can render them
  const fontStyle = await embedFonts(element);
  if (fontStyle) {
    element.prepend(fontStyle);
    cleanup.push(() => fontStyle.remove());
  }

  // 2. Resolve CSS variables on SVG elements
  element.querySelectorAll("svg *").forEach((el) => {
    const svgEl = el as SVGElement;
    const computed = getComputedStyle(svgEl);
    for (const attr of ["fill", "stroke", "color"] as const) {
      const attrVal = svgEl.getAttribute(attr);
      const inline = svgEl.style.getPropertyValue(attr);
      if ((attrVal && attrVal.includes("var(")) || (inline && inline.includes("var("))) {
        const original = svgEl.style.getPropertyValue(attr);
        svgEl.style.setProperty(attr, computed.getPropertyValue(attr));
        cleanup.push(() => original ? svgEl.style.setProperty(attr, original) : svgEl.style.removeProperty(attr));
      }
    }
  });

  // 3. Resolve fonts on SVG text elements
  element.querySelectorAll("svg text").forEach((el) => {
    const textEl = el as SVGTextElement;
    const computed = getComputedStyle(textEl);
    const origFamily = textEl.style.fontFamily;
    const origSize = textEl.style.fontSize;
    textEl.style.fontFamily = computed.fontFamily;
    textEl.style.fontSize = computed.fontSize;
    cleanup.push(() => { textEl.style.fontFamily = origFamily; textEl.style.fontSize = origSize; });
  });

  // 4. Resolve ALL inline styles with color-mix/var/color() (html2canvas can't parse them)
  const allEls = [element, ...element.querySelectorAll("*")] as HTMLElement[];
  const colorProps = ["color", "background-color", "border-color", "outline-color", "box-shadow", "outline", "background", "border"] as const;
  for (const el of allEls) {
    const computed = getComputedStyle(el);
    for (const prop of colorProps) {
      const raw = el.style.getPropertyValue(prop);
      if (raw && (raw.includes("color-mix") || raw.includes("var(") || raw.includes("color("))) {
        const resolved = computed.getPropertyValue(prop);
        el.style.setProperty(prop, resolved);
        cleanup.push(() => el.style.setProperty(prop, raw));
      }
    }
  }

  // 5. Hide UI elements
  element.classList.add("mu-exporting");
  cleanup.push(() => element.classList.remove("mu-exporting"));

  try {
    // Temporarily suppress console errors from html2canvas parsing unsupported CSS color functions
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("unsupported color function")) return;
      origError.apply(console, args);
    };

    const canvas = await html2canvas(element, {
      scale,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });

    console.error = origError;

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      }, "image/png");
    });
  } finally {
    // Restore everything
    for (const fn of cleanup) fn();
  }
}

/**
 * Embed all page fonts as base64 @font-face rules.
 * Uses document.fonts API + stylesheet scanning to find font URLs,
 * fetches them, and injects inline rules so html2canvas can use them.
 */
async function embedFonts(element: HTMLElement): Promise<HTMLStyleElement | null> {
  // Collect unique font families used in the element
  const fontFamilies = new Set<string>();
  const allElements = [element, ...element.querySelectorAll("*")];
  for (const el of allElements) {
    const computed = getComputedStyle(el as Element);
    const family = computed.fontFamily;
    if (family) {
      for (const f of family.split(",")) {
        const name = f.trim().replace(/["']/g, "");
        if (name && !isGenericFont(name)) fontFamilies.add(name);
      }
    }
  }

  if (fontFamilies.size === 0) return null;

  // Strategy 1: Use document.fonts API to find loaded FontFace objects
  const fontFaceCss: string[] = [];
  const processedUrls = new Set<string>();

  if ("fonts" in document) {
    for (const face of document.fonts) {
      const family = face.family.replace(/["']/g, "").trim();
      if (!fontFamilies.has(family)) continue;

      // FontFace doesn't expose the URL directly, but we can try
      // to find it from the CSS source
      const cssSource = (face as unknown as { src?: string }).src;
      if (!cssSource) continue;

      const urlMatch = String(cssSource).match(/url\(["']?([^"')]+)["']?\)/);
      if (!urlMatch || processedUrls.has(urlMatch[1])) continue;
      processedUrls.add(urlMatch[1]);

      try {
        const response = await fetch(urlMatch[1]);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
        const format = urlMatch[1].includes(".woff2") ? "woff2" : urlMatch[1].includes(".woff") ? "woff" : "truetype";
        fontFaceCss.push(`@font-face { font-family: "${family}"; src: url(${base64}) format("${format}"); font-weight: ${face.weight || "400"}; font-style: ${face.style || "normal"}; }`);
      } catch { /* skip */ }
    }
  }

  // Strategy 2: Scan stylesheets for @font-face rules
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!(rule instanceof CSSFontFaceRule)) continue;
        const family = rule.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
        if (!fontFamilies.has(family)) continue;
        const src = rule.style.getPropertyValue("src");
        if (!src) continue;
        const urlMatch = src.match(/url\(["']?([^"')]+)["']?\)/);
        if (!urlMatch || processedUrls.has(urlMatch[1])) continue;
        processedUrls.add(urlMatch[1]);

        try {
          const response = await fetch(urlMatch[1]);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          const format = urlMatch[1].includes(".woff2") ? "woff2" : urlMatch[1].includes(".woff") ? "woff" : "truetype";
          const weight = rule.style.getPropertyValue("font-weight") || "400";
          const style = rule.style.getPropertyValue("font-style") || "normal";
          fontFaceCss.push(`@font-face { font-family: "${family}"; src: url(${base64}) format("${format}"); font-weight: ${weight}; font-style: ${style}; }`);
        } catch { /* skip */ }
      }
    } catch { /* cross-origin — skip */ }
  }

  // Strategy 3: Scan all <style> and <link> tags in <head> for @font-face with matching families
  if (fontFaceCss.length === 0) {
    const styleEls = document.querySelectorAll("style");
    for (const styleEl of styleEls) {
      const text = styleEl.textContent ?? "";
      // Match @font-face blocks
      const faceRegex = /@font-face\s*\{[^}]*\}/g;
      let match;
      while ((match = faceRegex.exec(text)) !== null) {
        const block = match[0];
        // Check if this font-face is for a family we need
        const familyMatch = block.match(/font-family:\s*["']?([^;"']+)["']?/);
        if (!familyMatch) continue;
        const family = familyMatch[1].trim();

        // Check against our needed families (Next.js uses generated class names as family)
        // Also check if any needed family is a substring (Next.js might use __DM_Sans_xxxxx)
        let needed = fontFamilies.has(family);
        if (!needed) {
          for (const f of fontFamilies) {
            if (family.includes(f) || f.includes(family)) { needed = true; break; }
          }
        }
        if (!needed) continue;

        const urlMatch = block.match(/url\(["']?([^"')]+)["']?\)/);
        if (!urlMatch || processedUrls.has(urlMatch[1])) continue;
        processedUrls.add(urlMatch[1]);

        try {
          const response = await fetch(urlMatch[1]);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          const format = urlMatch[1].includes(".woff2") ? "woff2" : "truetype";
          // Reconstruct the @font-face with embedded data
          const newBlock = block.replace(/url\(["']?[^"')]+["']?\)/, `url(${base64})`);
          fontFaceCss.push(newBlock);
        } catch { /* skip */ }
      }
    }
  }

  if (fontFaceCss.length === 0) return null;

  const style = document.createElement("style");
  style.textContent = fontFaceCss.join("\n");
  return style;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function isGenericFont(name: string): boolean {
  return ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded"].includes(name.toLowerCase());
}

/**
 * Generate CSV content from tabular data.
 * Values are formatted through the provided formatter if given.
 */
export function generateCsv(
  data: Record<string, unknown>[],
  columns?: { key: string; header?: string; format?: ((v: unknown) => string) | undefined }[],
  metadata?: string,
): string {
  if (data.length === 0) return "";

  // Auto-detect columns if not provided
  const cols: { key: string; header?: string; format?: (v: unknown) => string }[] =
    columns ?? Object.keys(data[0]).map((key) => ({ key, header: key }));

  const lines: string[] = [];

  // Metadata line (filter context)
  if (metadata) {
    lines.push(`# ${metadata}`);
    lines.push("");
  }

  // Header row
  lines.push(cols.map((c) => csvEscape(c.header ?? c.key)).join(","));

  // Data rows
  for (const row of data) {
    lines.push(
      cols.map((c) => {
        const val = row[c.key];
        if (val == null) return "";
        if (c.format) return csvEscape(c.format(val));
        if (typeof val === "number") return String(val);
        return csvEscape(String(val));
      }).join(","),
    );
  }

  return lines.join("\n");
}

function csvEscape(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Download a blob or string as a file.
 */
export function downloadFile(content: Blob | string, filename: string, mimeType?: string) {
  const blob = typeof content === "string"
    ? new Blob([content], { type: mimeType ?? "text/csv;charset=utf-8" })
    : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy an image blob to clipboard.
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a filter context string for export metadata.
 */
export function buildFilterMetadata(
  filters?: { period?: { start: Date; end: Date } | null; dimensions?: Record<string, string[]> },
  crossFilter?: { field: string; value: string | number } | null,
): string {
  const parts: string[] = [];

  if (filters?.period) {
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    parts.push(`Period: ${fmt(filters.period.start)} – ${fmt(filters.period.end)}`);
  }

  if (filters?.dimensions) {
    for (const [field, values] of Object.entries(filters.dimensions)) {
      if (values.length > 0) {
        const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1");
        parts.push(`${label}: ${values.join(", ")}`);
      }
    }
  }

  if (crossFilter) {
    const label = crossFilter.field.charAt(0).toUpperCase() + crossFilter.field.slice(1).replace(/([A-Z])/g, " $1");
    parts.push(`${label}: ${crossFilter.value}`);
  }

  if (parts.length === 0) return "";

  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  return `${parts.join(" · ")} · Exported ${date}`;
}
