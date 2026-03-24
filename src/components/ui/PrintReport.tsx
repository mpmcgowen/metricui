"use client";

import { useMetricFilters } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { buildFilterMetadata } from "@/lib/export";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PrintReportConfig {
  /** Report title. Auto-derived from DashboardHeader if not set. */
  title?: string;
  /** Subtitle or description line */
  subtitle?: string;
  /** Logo URL — rendered in the header */
  logo?: string;
  /** Show KPI summary table at top of print. Default: true */
  summary?: boolean;
  /** Show chart descriptions as visible captions. Default: true */
  captions?: boolean;
  /** Footer template. Supports {filters}, {date}, {title}. Default: auto-generated */
  footer?: string;
  /** Show QR code linking to live dashboard. Default: false */
  qrCode?: boolean | string;
}

// ---------------------------------------------------------------------------
// Print Header — auto-generated report header, hidden on screen
// ---------------------------------------------------------------------------

export function PrintHeader({
  title = "Dashboard Report",
  subtitle,
  logo,
}: {
  title?: string;
  subtitle?: string;
  logo?: string;
}) {
  const filters = useMetricFilters();
  const cf = useCrossFilter();
  const filterMeta = buildFilterMetadata(
    filters ? { period: filters.period, dimensions: filters.dimensions } : undefined,
    cf?.selection ?? null,
  );
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mu-print-header">
      <div>
        {logo && <img src={logo} alt="" style={{ height: 32, marginBottom: 8 }} />}
        <div className="mu-print-header-title">{title}</div>
        {subtitle && <div style={{ fontSize: "10pt", color: "#6b7280", marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div className="mu-print-header-meta">
        <div>{date}</div>
        {filterMeta && <div style={{ marginTop: 4 }}>{filterMeta}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Print Footer — fixed to bottom of every printed page, hidden on screen
// ---------------------------------------------------------------------------

export function PrintFooter({
  text,
  title = "Dashboard Report",
}: {
  text?: string;
  title?: string;
}) {
  const filters = useMetricFilters();
  const cf = useCrossFilter();
  const filterMeta = buildFilterMetadata(
    filters ? { period: filters.period, dimensions: filters.dimensions } : undefined,
    cf?.selection ?? null,
  );
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const resolved = text
    ? text
        .replace("{title}", title)
        .replace("{filters}", filterMeta || "No filters")
        .replace("{date}", date)
    : `${title}${filterMeta ? ` · ${filterMeta}` : ""} · Printed ${date}`;

  return (
    <div className="mu-print-footer">
      {resolved}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Print Caption — rendered below a chart, visible only in print
// ---------------------------------------------------------------------------

export function PrintCaption({ text }: { text: string }) {
  return (
    <p className="mu-print-caption">{text}</p>
  );
}
