"use client";

import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";
import { KpiCard } from "@/components/cards/KpiCard";
import { BarChart } from "@/components/charts/BarChart";
import { MetricProvider } from "@/lib/MetricProvider";
import { MetricGrid } from "@/components/layout/MetricGrid";

const component = getComponent("export")!;

const sampleBarData = [
  { region: "North America", revenue: 142800 },
  { region: "Europe", revenue: 98700 },
  { region: "Asia Pacific", revenue: 76400 },
  { region: "Latin America", revenue: 34200 },
];

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "live-demo", title: "Live Demo", level: 2 },
  { id: "global-setup", title: "Global Setup", level: 2 },
  { id: "per-component-override", title: "Per-Component Override", level: 2 },
  { id: "exportable-config-type", title: "ExportableConfig Type", level: 2 },
  { id: "export-behavior", title: "Export Behavior", level: 2 },
  { id: "filenames", title: "Filenames", level: 2 },
  { id: "filter-metadata", title: "Filter Metadata", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function ExportDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* Overview */}
        <DocSection id="overview" title="Overview">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The Export system adds a small download icon to any card or chart. Clicking it
            opens a dropdown with three actions:
          </p>
          <ul className="space-y-2">
            {[
              "Save as image — captures a 4x DPI PNG using modern-screenshot (handles oklch, color-mix, lab CSS).",
              "Download CSV — exports the component's source data as a CSV file with filter metadata.",
              "Copy to clipboard — copies the image (charts) or formatted value (KPI cards) to the clipboard.",
            ].map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            CardShell automatically renders ExportButton when export is enabled — you
            rarely need to import it directly.
          </p>
        </DocSection>

        {/* Live Demo */}
        <DocSection id="live-demo" title="Live Demo">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Hover over any component below to reveal the export button. Click it to open
            the dropdown with Save as image, Download CSV, and Copy to clipboard.
          </p>
          <ComponentExample
            code={`<MetricProvider theme="indigo" exportable>
  <MetricGrid>
    <KpiCard title="Revenue" value={142800} format="currency" />
    <KpiCard title="Accounts" value={1248} format="number" />
    <BarChart
      data={salesByRegion}
      index="region"
      categories={["revenue"]}
      title="Revenue by Region"
      format="currency"
    />
  </MetricGrid>
</MetricProvider>`}
          >
            <MetricProvider theme="indigo" exportable>
              <MetricGrid>
                <KpiCard title="Revenue" value={142800} format="currency" />
                <KpiCard title="Accounts" value={1248} format="number" />
                <BarChart
                  data={sampleBarData}
                  index="region"
                  categories={["revenue"]}
                  title="Revenue by Region"
                  format="currency"
                  height={240}
                />
              </MetricGrid>
            </MetricProvider>
          </ComponentExample>
        </DocSection>

        {/* Global Setup */}
        <DocSection id="global-setup" title="Global Setup">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable export on every component by setting{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">exportable</code>{" "}
            on MetricProvider. All KpiCards, charts, and DataTables will show the export
            button.
          </p>
          <CodeBlock
            code={`import { MetricProvider } from "metricui";

<MetricProvider theme="emerald" exportable>
  {/* All components now show export buttons */}
  <KpiCard title="Revenue" value={142800} format="currency" />
  <AreaChart data={data} index="month" categories={["revenue"]} />
  <DataTable data={rows} columns={cols} />
</MetricProvider>`}
          />
        </DocSection>

        {/* Per-Component Override */}
        <DocSection id="per-component-override" title="Per-Component Override">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Override the global setting on any individual component. Set{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">exportable=&#123;false&#125;</code>{" "}
            to disable on a specific component, or pass a config object to customize.
          </p>
          <CodeBlock
            code={`{/* Global export is on, but disable for this card */}
<KpiCard title="Internal Score" value={87} exportable={false} />

{/* Global export is off, but enable for just this chart */}
<AreaChart
  data={data}
  index="month"
  categories={["revenue"]}
  exportable
/>

{/* Override CSV data with custom rows */}
<BarChart
  data={chartData}
  index="region"
  categories={["sales"]}
  exportable={{ data: customCsvRows }}
/>

{/* KPI cards export the raw numeric value by default (142800, not "142.8K"). */}
{/* Override with { data } to add context columns: */}
<KpiCard
  title="Revenue"
  value={142800}
  format="currency"
  exportable={{ data: [{ revenue: 142800, period: "Q1 2026", region: "US" }] }}
/>`}
          />
        </DocSection>

        {/* ExportableConfig Type */}
        <DocSection id="exportable-config-type" title="ExportableConfig Type">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">exportable</code>{" "}
            prop accepts a union type:
          </p>
          <CodeBlock
            code={`type ExportableConfig = boolean | { data: Record<string, unknown>[] };

// true  — auto-export (charts export source data, KPIs export single value)
// false — disable export on this component
// { data: rows[] } — override with custom CSV data`}
          />
          <div className="mt-4">
            <DataTable
              data={[
                { value: "true", behavior: "Auto-export. Charts export their source data array. KPI cards export a single-row value. DataTables export all rows." },
                { value: "false", behavior: "Disable export on this component, even if MetricProvider has exportable enabled." },
                { value: "{ data: rows[] }", behavior: "Enable export with custom CSV data. The rows you provide are used instead of the component's source data." },
              ]}
              columns={[
                { key: "value", header: "Value", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
                { key: "behavior", header: "Behavior" },
              ]}
              dense
              variant="ghost"
            />
          </div>
        </DocSection>

        {/* Export Behavior */}
        <DocSection id="export-behavior" title="Export Behavior">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Each export action works differently depending on the component type:
          </p>
          <DataTable
            data={[
              { action: "Save as image", charts: "4x DPI PNG of the full card (title + chart + legend)", kpi: "4x DPI PNG of the card", table: "4x DPI PNG of the visible table" },
              { action: "Download CSV", charts: "Source data array as CSV with filter metadata header", kpi: "Single row: title, value, comparisons", table: "All rows as CSV with filter metadata header" },
              { action: "Copy to clipboard", charts: "Image copied to clipboard (PNG)", kpi: "Formatted value string copied as text", table: "Image copied to clipboard (PNG), falls back to CSV text" },
            ]}
            columns={[
              { key: "action", header: "Action", render: (v) => <span className="font-medium text-[var(--foreground)]">{String(v)}</span> },
              { key: "charts", header: "Charts" },
              { key: "kpi", header: "KPI Cards" },
              { key: "table", header: "DataTable" },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Image capture uses the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">modern-screenshot</code>{" "}
            library which correctly handles modern CSS features like{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">oklch()</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">color-mix()</code>, and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">lab()</code>{" "}
            that html2canvas cannot.
          </p>
        </DocSection>

        {/* Filenames */}
        <DocSection id="filenames" title="Filenames">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Exported files get clean, human-readable filenames that include context:
          </p>
          <CodeBlock
            code={`// Pattern: "Title — Filters — Date.ext"

"Revenue — US, EU — Mar 24, 2026.png"
"Monthly Signups — Pro — Mar 24, 2026.csv"
"Conversion Funnel — Mar 24, 2026.png"`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The title comes from the component&apos;s{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">title</code>{" "}
            prop. Active filter selections are included automatically. Special characters
            are stripped for filesystem safety.
          </p>
        </DocSection>

        {/* Filter Metadata */}
        <DocSection id="filter-metadata" title="Filter Metadata">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            CSV exports include a metadata header comment with the active filter context
            at the time of export. This makes it easy to know exactly what slice of data
            was exported.
          </p>
          <CodeBlock
            code={`# Period: Mar 1, 2026 – Mar 24, 2026 · Region: US, EU · Exported Mar 24, 2026, 2:30 PM

month,revenue,users
Jan,142800,3200
Feb,156200,3450
Mar,168400,3800`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The metadata includes the active period, dimension filters, and cross-filter
            selection. It is built automatically from FilterContext and CrossFilterContext.
          </p>
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            ExportButton is typically auto-rendered by CardShell. If you need to render it
            manually, import it from{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">@/components/ui/ExportButton</code>.
          </p>
          <PropsTable props={component.props} />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {component.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI Insights analysis. See the <a href="/docs/ai-insights" className="font-medium text-[var(--accent)] hover:underline">AI Insights guide</a> for details.
            </li>
          </ul>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
