"use client";

import { useState, useMemo } from "react";
import { StatGroup } from "@/components/cards/StatGroup";
import type { StatItem } from "@/components/cards/StatGroup";
import {
  Toggle,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";
import {
  DollarSign,
  Users,
  MousePointerClick,
  Eye,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

const sampleDatasets: Record<string, { label: string; stats: StatItem[] }> = {
  revenue: {
    label: "Revenue Metrics (4 stats)",
    stats: [
      {
        label: "Total Revenue",
        value: 142800,
        previousValue: 128400,
        format: "currency",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        label: "Active Users",
        value: 3200,
        previousValue: 2710,
        format: "number",
        icon: <Users className="h-3 w-3" />,
      },
      {
        label: "Conversion Rate",
        value: 4.2,
        previousValue: 3.4,
        format: "percent",
        icon: <MousePointerClick className="h-3 w-3" />,
      },
      {
        label: "Avg. Order Value",
        value: 84.6,
        previousValue: 78.2,
        format: "currency",
        icon: <TrendingUp className="h-3 w-3" />,
      },
    ],
  },
  marketing: {
    label: "Marketing KPIs (3 stats)",
    stats: [
      {
        label: "Impressions",
        value: 2400000,
        previousValue: 2100000,
        format: "number",
        icon: <Eye className="h-3 w-3" />,
      },
      {
        label: "Click-through Rate",
        value: 3.8,
        previousValue: 3.2,
        format: "percent",
        icon: <MousePointerClick className="h-3 w-3" />,
      },
      {
        label: "Cost per Click",
        value: 1.24,
        previousValue: 1.48,
        invertTrend: true,
        format: { style: "currency", compact: false, precision: 2 },
        icon: <DollarSign className="h-3 w-3" />,
      },
    ],
  },
  server: {
    label: "Server Health (6 stats)",
    stats: [
      {
        label: "Uptime",
        value: 99.97,
        previousValue: 99.91,
        format: "percent",
        icon: <Server className="h-3 w-3" />,
      },
      {
        label: "CPU Usage",
        value: 42,
        previousValue: 38,
        invertTrend: true,
        format: "percent",
        icon: <Cpu className="h-3 w-3" />,
      },
      {
        label: "Memory Usage",
        value: 67,
        previousValue: 72,
        invertTrend: true,
        format: "percent",
        icon: <HardDrive className="h-3 w-3" />,
      },
      {
        label: "Avg. Response Time",
        value: 142,
        previousValue: 168,
        invertTrend: true,
        format: { style: "number", compact: false, suffix: "ms" },
        icon: <Clock className="h-3 w-3" />,
      },
      {
        label: "Requests / sec",
        value: 1240,
        previousValue: 1180,
        format: "number",
        icon: <Zap className="h-3 w-3" />,
      },
      {
        label: "Error Rate",
        value: 0.12,
        previousValue: 0.18,
        invertTrend: true,
        format: "percent",
        icon: <Server className="h-3 w-3" />,
      },
    ],
  },
  legacy: {
    label: "Legacy format (string values + change)",
    stats: [
      { label: "Total Pageviews", value: "1.2M", change: 14.2 },
      { label: "Bounce Rate", value: "34.7%", change: -2.3 },
      { label: "Avg. Session", value: "4m 32s", change: 8.1 },
      { label: "Pages / Session", value: "3.8", change: 5.4 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function StatGroupPlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("revenue");

  // --- Core ---
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [variant, setVariant] = useState("default");
  const [dense, setDense] = useState(false);
  const [columnsOverride, setColumnsOverride] = useState("auto");
  const [loading, setLoading] = useState(false);

  // --- Format ---
  const [formatStyle, setFormatStyle] = useState("none");

  // --- Derived ---
  const dataset = sampleDatasets[datasetKey] ?? sampleDatasets.revenue;
  const stats = dataset.stats;

  const groupFormat = useMemo(() => {
    if (formatStyle === "none") return undefined;
    return formatStyle as "currency" | "number" | "percent";
  }, [formatStyle]);

  const columns = columnsOverride === "auto" ? undefined : (Number(columnsOverride) as 1 | 2 | 3 | 4 | 5 | 6);

  // --- Code gen ---
  const codeLines: string[] = [];
  codeLines.push(`<StatGroup`);
  codeLines.push(`  stats={[`);
  for (const s of stats) {
    const parts: string[] = [`label: "${s.label}"`];
    parts.push(`value: ${typeof s.value === "string" ? `"${s.value}"` : s.value}`);
    if (s.previousValue !== undefined) parts.push(`previousValue: ${s.previousValue}`);
    if (s.change !== undefined) parts.push(`change: ${s.change}`);
    if (s.invertTrend) parts.push(`invertTrend: true`);
    if (s.format) {
      if (typeof s.format === "string") {
        parts.push(`format: "${s.format}"`);
      } else {
        const fParts = Object.entries(s.format)
          .map(([k, v]) => `${k}: ${typeof v === "string" ? `"${v}"` : v}`)
          .join(", ");
        parts.push(`format: { ${fParts} }`);
      }
    }
    if (s.icon) parts.push(`icon: <Icon />`);
    codeLines.push(`    { ${parts.join(", ")} },`);
  }
  codeLines.push(`  ]}`);
  if (title) codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  if (dense) codeLines.push(`  dense`);
  if (columns !== undefined) codeLines.push(`  columns={${columns}}`);
  if (groupFormat) codeLines.push(`  format="${groupFormat}"`);
  if (loading) codeLines.push(`  loading`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col">
        {/* Live Preview */}
        <div className="px-2 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-4xl">
              <StatGroup
                stats={stats}
                title={title || undefined}
                subtitle={subtitle || undefined}
                variant={variant as "default" | "outlined" | "ghost" | "elevated"}
                dense={dense}
                columns={columns}
                format={groupFormat}
                loading={loading}
              />
          </div>

          {/* Code */}
          <div className="mt-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Code
            </p>
            <CodePreview code={codeLines.join("\n")} />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full flex-shrink-0 overflow-y-auto border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the component update in real time
          </p>
        </div>

        {/* Data */}
        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={setDatasetKey}
            options={[
              { label: "Revenue Metrics (4)", value: "revenue" },
              { label: "Marketing KPIs (3)", value: "marketing" },
              { label: "Server Health (6)", value: "server" },
              { label: "Legacy format (strings)", value: "legacy" },
            ]}
            description="Switch between sample datasets"
          />
        </ControlSection>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} placeholder="Group heading" />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} placeholder="Subtitle text" />
          <Toggle
            label="dense"
            value={dense}
            onChange={setDense}
            description="Denser layout with smaller text"
          />
          <Toggle
            label="loading"
            value={loading}
            onChange={setLoading}
            description="Show skeleton placeholders"
          />
        </ControlSection>

        {/* Layout */}
        <ControlSection title="Layout">
          <Select
            label="columns"
            value={columnsOverride}
            onChange={setColumnsOverride}
            options={[
              { label: "auto (match stat count)", value: "auto" },
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
              { label: "6", value: "6" },
            ]}
            description="Override responsive grid columns"
          />
        </ControlSection>

        {/* Format */}
        <ControlSection title="Format" defaultOpen={false}>
          <Select
            label="Group format"
            value={formatStyle}
            onChange={setFormatStyle}
            options={[
              { label: "none (per-stat formats)", value: "none" },
              { label: "currency", value: "currency" },
              { label: "number", value: "number" },
              { label: "percent", value: "percent" },
            ]}
            description="Default format for all stats (per-stat overrides win)"
          />
        </ControlSection>

        {/* Theming */}
        <ControlSection title="Theming" defaultOpen={false}>
          <Select
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { label: "default", value: "default" },
              { label: "outlined", value: "outlined" },
              { label: "ghost", value: "ghost" },
              { label: "elevated", value: "elevated" },
            ]}
          />
        </ControlSection>
      </div>
    </div>
  );
}
