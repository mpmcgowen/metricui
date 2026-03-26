"use client";

import { Bump } from "@/components/charts/Bump";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-line-width", title: "Custom Line Width", level: 2 },
  { id: "point-sizes", title: "Point Sizes", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data — product rankings over quarters
// ---------------------------------------------------------------------------

const rankingData = [
  { quarter: "Q1 2024", slack: 1, teams: 2, zoom: 3, discord: 4, meet: 5 },
  { quarter: "Q2 2024", slack: 1, teams: 3, zoom: 2, discord: 5, meet: 4 },
  { quarter: "Q3 2024", slack: 2, teams: 1, zoom: 3, discord: 4, meet: 5 },
  { quarter: "Q4 2024", slack: 3, teams: 1, zoom: 2, discord: 5, meet: 4 },
  { quarter: "Q1 2025", slack: 2, teams: 1, zoom: 4, discord: 3, meet: 5 },
  { quarter: "Q2 2025", slack: 1, teams: 2, zoom: 4, discord: 3, meet: 5 },
];

const teamStandings = [
  { id: "Alpha", data: [
    { x: "Sprint 1", y: 1 }, { x: "Sprint 2", y: 2 }, { x: "Sprint 3", y: 1 },
    { x: "Sprint 4", y: 3 }, { x: "Sprint 5", y: 2 }, { x: "Sprint 6", y: 1 },
  ]},
  { id: "Beta", data: [
    { x: "Sprint 1", y: 3 }, { x: "Sprint 2", y: 1 }, { x: "Sprint 3", y: 2 },
    { x: "Sprint 4", y: 1 }, { x: "Sprint 5", y: 1 }, { x: "Sprint 6", y: 3 },
  ]},
  { id: "Gamma", data: [
    { x: "Sprint 1", y: 2 }, { x: "Sprint 2", y: 3 }, { x: "Sprint 3", y: 3 },
    { x: "Sprint 4", y: 2 }, { x: "Sprint 5", y: 3 }, { x: "Sprint 6", y: 2 },
  ]},
];

const compactRanking = [
  { month: "Jan", product_a: 1, product_b: 2, product_c: 3 },
  { month: "Feb", product_a: 2, product_b: 1, product_c: 3 },
  { month: "Mar", product_a: 2, product_b: 3, product_c: 1 },
  { month: "Apr", product_a: 3, product_b: 2, product_c: 1 },
  { month: "May", product_a: 1, product_b: 3, product_c: 2 },
  { month: "Jun", product_a: 1, product_b: 2, product_c: 3 },
];

export default function BumpDocs() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Bump</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Bump</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Show how rankings change over time. Each series is a smooth curve connecting
            its rank at each time step, making it easy to spot rises, falls, and crossovers.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Bump for ranking data — product standings, team leaderboards, competitive
          position tracking. Works best with 3-8 series over 4-12 time steps. For absolute
          value trends, use{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>
          ; for multi-dimensional comparison, use{" "}
          <a href="/docs/radar" className="font-medium text-[var(--accent)] hover:underline">
            Radar
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Flat-row mode: pass <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> for
            the x-axis and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> for
            the ranked series. Values represent rank positions (1 = top).
          </p>
          <ComponentExample
            code={`<Bump
  data={[
    { quarter: "Q1 2024", slack: 1, teams: 2, zoom: 3, discord: 4, meet: 5 },
    { quarter: "Q2 2024", slack: 1, teams: 3, zoom: 2, discord: 5, meet: 4 },
    { quarter: "Q3 2024", slack: 2, teams: 1, zoom: 3, discord: 4, meet: 5 },
    { quarter: "Q4 2024", slack: 3, teams: 1, zoom: 2, discord: 5, meet: 4 },
    { quarter: "Q1 2025", slack: 2, teams: 1, zoom: 4, discord: 3, meet: 5 },
    { quarter: "Q2 2025", slack: 1, teams: 2, zoom: 4, discord: 3, meet: 5 },
  ]}
  index="quarter"
  categories={["slack", "teams", "zoom", "discord", "meet"]}
  title="Communication App Rankings"
  height={350}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["slack", "teams", "zoom", "discord", "meet"]}
                title="Communication App Rankings"
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Line Width */}
        <DocSection id="custom-line-width" title="Custom Line Width">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Adjust <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lineWidth</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pointBorderWidth</code> for
            visual weight. Nivo-native series format is also supported.
          </p>
          <ComponentExample
            code={`<Bump
  data={[
    { id: "Alpha", data: [
      { x: "Sprint 1", y: 1 }, { x: "Sprint 2", y: 2 },
      { x: "Sprint 3", y: 1 }, { x: "Sprint 4", y: 3 },
      { x: "Sprint 5", y: 2 }, { x: "Sprint 6", y: 1 },
    ]},
    { id: "Beta", data: [...] },
    { id: "Gamma", data: [...] },
  ]}
  title="Sprint Rankings"
  lineWidth={5}
  pointBorderWidth={3}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={teamStandings}
                title="Sprint Rankings"
                lineWidth={5}
                pointBorderWidth={3}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Point Sizes */}
        <DocSection id="point-sizes" title="Point Sizes">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Control the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pointSize</code> to
            make rank positions more or less prominent.
          </p>
          <ComponentExample
            code={`<Bump
  data={compactRanking}
  index="month"
  categories={["product_a", "product_b", "product_c"]}
  title="Product Rankings"
  pointSize={14}
  lineWidth={4}
  height={280}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={compactRanking}
                index="month"
                categories={["product_a", "product_b", "product_c"]}
                title="Product Rankings"
                pointSize={14}
                lineWidth={4}
                height={280}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "BumpSeries[] | DataRow[]", default: "[]", description: "Nivo { id, data: [{ x, y }] } format or flat rows with index + categories." },
              { prop: "index", type: "string", default: "—", description: "Column for x-axis labels (flat format)." },
              { prop: "categories", type: "Category[]", default: "—", description: "Category columns — each becomes a ranked series (flat format)." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Series colors." },
              { prop: "format", type: "FormatOption", default: "—", description: "Format for value labels and tooltips." },
              { prop: "lineWidth", type: "number", default: "3", description: "Width of each ranking line." },
              { prop: "pointSize", type: "number", default: "8", description: "Size of points at each position." },
              { prop: "pointBorderWidth", type: "number", default: "2", description: "Border width of each point." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration. Shown for multi-series." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering on series click." },
              { prop: "drillDown", type: "true | function", default: "—", description: "true for auto table, or custom render function." },
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
              "Flat-row mode: values represent rank positions (1 = top). Each category column becomes a series. The component auto-converts to Nivo format.",
              "Nivo-native mode: pass BumpSeries[] with { id, data: [{ x, y }] }. The y values are rank positions.",
              "Best with 3-8 series. More than 8 creates visual clutter; fewer than 3 loses the comparative value.",
              "Rank values should be positive integers. Ties (same rank at a time step) are rendered but may overlap visually.",
              "Built on @nivo/bump — all Nivo theming and tooltip conventions apply.",
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
            {["LineChart", "Radar", "BarChart", "HeatMap"].map((name) => (
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

      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
