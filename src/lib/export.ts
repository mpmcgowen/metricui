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
 */
export async function captureElementAsPng(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const scale = window.devicePixelRatio || 2;
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });

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
