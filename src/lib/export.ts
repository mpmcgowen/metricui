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
 * Capture a DOM element as a PNG blob.
 *
 * Strategy: find the SVG inside the element (Nivo charts render as SVG),
 * serialize it with inline styles, and render to canvas. Falls back to
 * capturing the full element if no SVG is found.
 */
export async function captureElementAsPng(element: HTMLElement): Promise<Blob> {
  const scale = window.devicePixelRatio || 2;

  // Hide export UI during capture
  element.classList.add("mu-exporting");

  try {
    // Try SVG-direct capture first (best quality for charts)
    const svg = element.querySelector("svg");
    if (svg) {
      return await captureSvgAsPng(svg, element, scale);
    }

    // Fallback: capture the full element via html2canvas
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });

    return canvasToBlob(canvas);
  } finally {
    element.classList.remove("mu-exporting");
  }
}

/**
 * Capture an SVG element as a high-quality PNG.
 * Inlines computed styles so the rendered image matches the screen.
 */
async function captureSvgAsPng(svg: SVGElement, container: HTMLElement, scale: number): Promise<Blob> {
  const rect = container.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // Clone the SVG and inline all computed styles
  const clone = svg.cloneNode(true) as SVGElement;
  inlineStyles(svg, clone);

  // Set explicit dimensions on the clone
  clone.setAttribute("width", String(svgRect.width));
  clone.setAttribute("height", String(svgRect.height));

  // Get computed background color from the container
  const bgColor = getComputedStyle(container).backgroundColor;

  // Serialize to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  // Render full container width (includes title, subtitle, padding)
  const canvas = document.createElement("canvas");
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  // Draw background
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Position SVG within the container (offset from container top-left)
      const offsetX = svgRect.left - rect.left;
      const offsetY = svgRect.top - rect.top;
      ctx.drawImage(img, offsetX, offsetY, svgRect.width, svgRect.height);
      URL.revokeObjectURL(url);

      // Also capture the title/header text as an overlay
      // For now, add title as text on the canvas
      const titleEl = container.querySelector("[class*='uppercase']") as HTMLElement;
      const subtitleEl = container.querySelector("[class*='mu-chart-subtitle']") as HTMLElement;

      if (titleEl) {
        const titleStyle = getComputedStyle(titleEl);
        ctx.font = `${titleStyle.fontWeight} ${titleStyle.fontSize} ${titleStyle.fontFamily}`;
        ctx.fillStyle = titleStyle.color;
        const titleRect = titleEl.getBoundingClientRect();
        ctx.fillText(titleEl.textContent ?? "", titleRect.left - rect.left, titleRect.top - rect.top + parseFloat(titleStyle.fontSize));
      }

      if (subtitleEl) {
        const subStyle = getComputedStyle(subtitleEl);
        ctx.font = `${subStyle.fontWeight} ${subStyle.fontSize} ${subStyle.fontFamily}`;
        ctx.fillStyle = subStyle.color;
        const subRect = subtitleEl.getBoundingClientRect();
        ctx.fillText(subtitleEl.textContent ?? "", subRect.left - rect.left, subRect.top - rect.top + parseFloat(subStyle.fontSize));
      }

      canvasToBlob(canvas).then(resolve).catch(reject);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Recursively inline computed styles from source to clone.
 * This ensures the SVG renders identically when serialized.
 */
function inlineStyles(source: Element, clone: Element) {
  const computed = getComputedStyle(source);
  const cloneEl = clone as SVGElement | HTMLElement;

  // Key SVG-relevant properties
  const props = [
    "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap",
    "stroke-linejoin", "opacity", "font-family", "font-size", "font-weight",
    "text-anchor", "dominant-baseline", "letter-spacing", "color",
  ];

  for (const prop of props) {
    const val = computed.getPropertyValue(prop);
    if (val) {
      cloneEl.style.setProperty(prop, val);
    }
  }

  const sourceChildren = source.children;
  const cloneChildren = clone.children;
  for (let i = 0; i < sourceChildren.length && i < cloneChildren.length; i++) {
    inlineStyles(sourceChildren[i], cloneChildren[i]);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
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
