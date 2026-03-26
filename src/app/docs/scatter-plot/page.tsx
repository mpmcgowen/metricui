"use client";

import { ScatterPlot } from "@/components/charts/ScatterPlot";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "node-sizing", title: "Node Sizing", level: 2 },
  { id: "multiple-series", title: "Multiple Series", level: 2 },
  { id: "reference-lines", title: "Reference Lines", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const accountData = [
  { account: "Acme Corp", mrr: 12400, seats: 45 },
  { account: "Globex Inc", mrr: 8200, seats: 28 },
  { account: "Initech", mrr: 15600, seats: 62 },
  { account: "Umbrella Ltd", mrr: 6800, seats: 18 },
  { account: "Stark Industries", mrr: 22100, seats: 95 },
  { account: "Wayne Enterprises", mrr: 18400, seats: 74 },
  { account: "Cyberdyne", mrr: 9500, seats: 32 },
  { account: "Oscorp", mrr: 11200, seats: 41 },
  { account: "LexCorp", mrr: 14800, seats: 55 },
  { account: "Wonka Inc", mrr: 7300, seats: 22 },
  { account: "Dunder Mifflin", mrr: 5400, seats: 15 },
  { account: "Pied Piper", mrr: 19800, seats: 82 },
  { account: "Hooli", mrr: 24600, seats: 110 },
  { account: "Prestige Worldwide", mrr: 3200, seats: 8 },
  { account: "Sterling Cooper", mrr: 10700, seats: 38 },
];

const multiSeriesData = [
  { id: "Enterprise", data: [
    { x: 120, y: 22000 }, { x: 95, y: 18400 }, { x: 74, y: 15600 },
    { x: 62, y: 12400 }, { x: 110, y: 24600 },
  ]},
  { id: "Mid-Market", data: [
    { x: 45, y: 8200 }, { x: 38, y: 7300 }, { x: 32, y: 6800 },
    { x: 28, y: 5400 }, { x: 41, y: 9500 },
  ]},
  { id: "SMB", data: [
    { x: 15, y: 3200 }, { x: 18, y: 4100 }, { x: 12, y: 2800 },
    { x: 22, y: 5100 }, { x: 8, y: 1900 },
  ]},
];

export default function ScatterPlotDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>ScatterPlot</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">ScatterPlot</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Visualize relationships between two numeric variables. Each point represents a data record
            plotted by its x and y values. Supports flat-row mode (index + categories) and native
            Nivo series format.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use ScatterPlot to explore correlations — MRR vs seats, revenue vs headcount, spend vs
          conversion rate. Supports multiple series, node sizing, reference lines, cross-filtering,
          and drill-down. For categorical comparison use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>
          ; for time-series trends use{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="MRR vs Seats"
  xFormat="currency"
  yFormat="number"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="MRR vs Seats"
                xFormat="currency"
                yFormat="number"
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Node Sizing */}
        <DocSection id="node-sizing" title="Node Sizing">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">nodeSize</code> prop
            to control dot size in pixels.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="Large Nodes"
  nodeSize={14}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="Large Nodes"
                nodeSize={14}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Multiple Series */}
        <DocSection id="multiple-series" title="Multiple Series">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass Nivo-native series data with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">id</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">data</code> arrays to
            render multiple colored series with a legend.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={[
    { id: "Enterprise", data: [{ x: 120, y: 22000 }, ...] },
    { id: "Mid-Market", data: [{ x: 45, y: 8200 }, ...] },
    { id: "SMB", data: [{ x: 15, y: 3200 }, ...] },
  ]}
  title="Accounts by Segment"
  xFormat="number"
  yFormat="currency"
  height={350}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={multiSeriesData}
                title="Accounts by Segment"
                xFormat="number"
                yFormat="currency"
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Reference Lines */}
        <DocSection id="reference-lines" title="Reference Lines">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add horizontal or vertical reference lines for targets or thresholds.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="MRR vs Seats — with Target"
  xFormat="currency"
  height={300}
  referenceLines={[
    { axis: "x", value: 15000, label: "Target MRR", color: "#EF4444", style: "dashed" },
  ]}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="MRR vs Seats — with Target"
                xFormat="currency"
                height={300}
                referenceLines={[
                  { axis: "x", value: 15000, label: "Target MRR", color: "#EF4444", style: "dashed" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "ScatterPlotDatumInput[] | DataRow[]", default: "[]", description: "Nivo series or flat rows. Flat rows use index + categories." },
              { prop: "index", type: "string", default: "—", description: "X-axis field name (flat-row mode)." },
              { prop: "categories", type: "Category[]", default: "—", description: "Y-axis field(s) — each becomes a series (flat-row mode)." },
              { prop: "xFormat", type: "FormatOption", default: "—", description: "Format for x-axis values." },
              { prop: "yFormat", type: "FormatOption", default: "—", description: "Format for y-axis values." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "subtitle", type: "string", default: "—", description: "Card subtitle." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Series colors." },
              { prop: "nodeSize", type: "number", default: "8", description: "Dot size in pixels." },
              { prop: "referenceLines", type: "ReferenceLine[]", default: "—", description: "Horizontal or vertical reference lines." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration. Shown for multi-series data." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering on click." },
              { prop: "drillDown", type: "true | function", default: "—", description: "true for auto table, or custom render function." },
              { prop: "xAxisLabel", type: "string", default: "—", description: "X-axis label text." },
              { prop: "yAxisLabel", type: "string", default: "—", description: "Y-axis label text." },
            ]}
            columns={[
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "default", header: "Default", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "Flat-row mode: pass data as DataRow[], set index for x-axis and categories for y-axis fields. Each category becomes a series.",
              "Nivo-native mode: pass an array of { id, data: [{ x, y }] } objects. index and categories are ignored.",
              "Reference lines support axis: 'x' or 'y', with optional label, color, and style ('solid' | 'dashed').",
              "Cross-filtering emits the series id by default. Override with crossFilter={{ field: 'myField' }}.",
              "Built on @nivo/scatterplot — all Nivo theming and tooltip conventions apply.",
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
        </DocSection>

        {/* Related */}
        <DocSection id="related" title="Related">
          <ul className="flex flex-wrap gap-2">
            {["LineChart", "BarChart", "HeatMap", "Radar"].map((name) => (
              <li key={name}>
                <a
                  href={`/docs/${name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}`}
                  className="inline-block rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
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
