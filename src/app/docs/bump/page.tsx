"use client";

import { Bump } from "@/components/charts/Bump";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-line-width", title: "Custom Line Width", level: 2 },
  { id: "start-end-labels", title: "Start & End Labels", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const rankingData = [
  { quarter: "Q1", "Product A": 1, "Product B": 3, "Product C": 2, "Product D": 4 },
  { quarter: "Q2", "Product A": 2, "Product B": 1, "Product C": 3, "Product D": 4 },
  { quarter: "Q3", "Product A": 1, "Product B": 2, "Product C": 4, "Product D": 3 },
  { quarter: "Q4", "Product A": 3, "Product B": 1, "Product C": 2, "Product D": 4 },
];

export default function BumpDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Charts</span>
            <span>/</span>
            <span>Bump</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Bump</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Visualize how rankings change over time. Each line represents a series, and its
            vertical position at each x-tick shows its rank. Lines cross as positions swap,
            making it easy to spot trend leaders and laggards.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Bump for competitive rankings — product performance over quarters, team
          standings over sprints, feature adoption over releases. Supports flat-row mode
          (auto-ranking by value) and Nivo-native series format. For absolute value trends
          use{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>
          ; for categorical comparison use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass flat rows with an <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> column
            and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> for
            each series. Values represent rank positions (1 = top).
          </p>
          <ComponentExample
            code={`<Bump
  data={[
    { quarter: "Q1", "Product A": 1, "Product B": 3, "Product C": 2, "Product D": 4 },
    { quarter: "Q2", "Product A": 2, "Product B": 1, "Product C": 3, "Product D": 4 },
    { quarter: "Q3", "Product A": 1, "Product B": 2, "Product C": 4, "Product D": 3 },
    { quarter: "Q4", "Product A": 3, "Product B": 1, "Product C": 2, "Product D": 4 },
  ]}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Product Rankings by Quarter"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Product Rankings by Quarter"
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Line Width */}
        <DocSection id="custom-line-width" title="Custom Line Width">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lineWidth</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pointSize</code> props
            to control line thickness and dot size.
          </p>
          <ComponentExample
            code={`<Bump
  data={rankingData}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Thick Lines"
  lineWidth={5}
  pointSize={12}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Thick Lines"
                lineWidth={5}
                pointSize={12}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Start & End Labels */}
        <DocSection id="start-end-labels" title="Start & End Labels">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Bump automatically displays start and end labels for each series, making it easy
            to identify lines without needing a separate legend. Labels are colored to match
            their series. Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">legend={"{false}"}</code> to
            rely solely on labels.
          </p>
          <ComponentExample
            code={`<Bump
  data={rankingData}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Rankings with Labels Only"
  legend={false}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Rankings with Labels Only"
                legend={false}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "BumpSeries[] | DataRow[]", default: "[]", description: "Nivo series or flat rows. Flat rows use index + categories (auto-ranked)." },
              { prop: "index", type: "string", default: "\u2014", description: "X-axis field name (flat-row mode)." },
              { prop: "categories", type: "Category[]", default: "\u2014", description: "Series field(s) \u2014 each becomes a ranked line (flat-row mode)." },
              { prop: "title", type: "string", default: "\u2014", description: "Card title." },
              { prop: "subtitle", type: "string", default: "\u2014", description: "Card subtitle." },
              { prop: "format", type: "FormatOption", default: "\u2014", description: "Format for value labels and tooltips." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Series colors." },
              { prop: "lineWidth", type: "number", default: "3", description: "Line thickness in px." },
              { prop: "pointSize", type: "number", default: "8", description: "Point dot size in px." },
              { prop: "pointBorderWidth", type: "number", default: "2", description: "Point border width in px." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration. Shown for multi-series data." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "\u2014", description: "Enable cross-filtering on series click." },
              { prop: "drillDown", type: "true | function", default: "\u2014", description: "true for auto table, or custom render function." },
              { prop: "drillDownMode", type: '"slide-over" | "modal"', default: '"slide-over"', description: "Drill-down panel mode." },
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
              "Start and end labels are always shown by default, colored to match each series. Set legend={false} to rely solely on labels.",
              "Inactive lines fade to 25% opacity on hover, making the active series stand out.",
              "Cross-filtering emits the series id by default. Override with crossFilter={{ field: 'myField' }}.",
              "Built on @nivo/bump \u2014 all Nivo theming and tooltip conventions apply.",
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
            {["LineChart", "BarChart", "Radar", "HeatMap"].map((name) => (
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
