"use client";

import { Radar } from "@/components/charts/Radar";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "multiple-series", title: "Multiple Series", level: 2 },
  { id: "custom-fill", title: "Custom Fill Opacity", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const singleTeamData = [
  { skill: "Frontend", score: 92 },
  { skill: "Backend", score: 78 },
  { skill: "DevOps", score: 65 },
  { skill: "Design", score: 84 },
  { skill: "Testing", score: 71 },
  { skill: "Documentation", score: 58 },
];

const multiTeamData = [
  { skill: "Frontend", alpha: 92, beta: 68, gamma: 75 },
  { skill: "Backend", alpha: 78, beta: 90, gamma: 82 },
  { skill: "DevOps", alpha: 65, beta: 85, gamma: 60 },
  { skill: "Design", alpha: 84, beta: 52, gamma: 70 },
  { skill: "Testing", alpha: 71, beta: 77, gamma: 88 },
  { skill: "Documentation", alpha: 58, beta: 62, gamma: 45 },
];

const productData = [
  { feature: "Performance", product: 88 },
  { feature: "Usability", product: 76 },
  { feature: "Reliability", product: 92 },
  { feature: "Security", product: 84 },
  { feature: "Scalability", product: 70 },
  { feature: "Cost Efficiency", product: 62 },
];

export default function RadarDocs() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Radar</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Radar</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Compare multiple dimensions on a radial axis. Each spoke represents a metric,
            and each series forms a polygon showing its profile across all dimensions.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Radar for multi-dimensional comparison — team skill profiles, product feature
          scores, competitive analysis. Works best with 5-8 dimensions and 1-3 series.
          For two-variable correlation, use{" "}
          <a href="/docs/scatter-plot" className="font-medium text-[var(--accent)] hover:underline">
            ScatterPlot
          </a>
          ; for ranked comparison, use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<Radar
  data={[
    { skill: "Frontend", score: 92 },
    { skill: "Backend", score: 78 },
    { skill: "DevOps", score: 65 },
    { skill: "Design", score: 84 },
    { skill: "Testing", score: 71 },
    { skill: "Documentation", score: 58 },
  ]}
  index="skill"
  categories={["score"]}
  title="Team Skills Assessment"
  height={350}
/>`}
          >
            <div className="w-full max-w-lg">
              <Radar
                data={singleTeamData}
                index="skill"
                categories={["score"]}
                title="Team Skills Assessment"
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Multiple Series */}
        <DocSection id="multiple-series" title="Multiple Series">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass multiple <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> to
            overlay several series. A legend is shown automatically for multi-series data.
          </p>
          <ComponentExample
            code={`<Radar
  data={[
    { skill: "Frontend", alpha: 92, beta: 68, gamma: 75 },
    { skill: "Backend", alpha: 78, beta: 90, gamma: 82 },
    { skill: "DevOps", alpha: 65, beta: 85, gamma: 60 },
    { skill: "Design", alpha: 84, beta: 52, gamma: 70 },
    { skill: "Testing", alpha: 71, beta: 77, gamma: 88 },
    { skill: "Documentation", alpha: 58, beta: 62, gamma: 45 },
  ]}
  index="skill"
  categories={["alpha", "beta", "gamma"]}
  title="Team Comparison"
  height={380}
/>`}
          >
            <div className="w-full max-w-lg">
              <Radar
                data={multiTeamData}
                index="skill"
                categories={["alpha", "beta", "gamma"]}
                title="Team Comparison"
                height={380}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Fill Opacity */}
        <DocSection id="custom-fill" title="Custom Fill Opacity">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Adjust <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">fillOpacity</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">borderWidth</code> to
            control the visual density. Lower opacity works better for overlapping series.
          </p>
          <ComponentExample
            code={`<Radar
  data={productData}
  index="feature"
  categories={["product"]}
  title="Product Feature Scores"
  fillOpacity={0.5}
  borderWidth={3}
  dotSize={8}
  gridLevels={4}
  height={350}
/>`}
          >
            <div className="w-full max-w-lg">
              <Radar
                data={productData}
                index="feature"
                categories={["product"]}
                title="Product Feature Scores"
                fillOpacity={0.5}
                borderWidth={3}
                dotSize={8}
                gridLevels={4}
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "DataRow[]", default: "[]", description: "Flat rows with an index dimension + numeric category columns." },
              { prop: "index", type: "string", default: "—", description: "Column name for the dimension labels (spokes)." },
              { prop: "categories", type: "Category[]", default: "—", description: "Metric columns to compare. Each becomes a series polygon." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Series colors." },
              { prop: "format", type: "FormatOption", default: "—", description: "Format for value labels and tooltips." },
              { prop: "fillOpacity", type: "number", default: "0.25", description: "Fill opacity for each series area." },
              { prop: "borderWidth", type: "number", default: "2", description: "Border width for each series." },
              { prop: "dotSize", type: "number", default: "6", description: "Dot size at each vertex." },
              { prop: "gridLevels", type: "number", default: "5", description: "Number of concentric grid levels." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "auto", description: "Legend configuration. Shown for multi-series." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering." },
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
              "Best with 5-8 dimensions. Fewer than 4 creates an odd polygon; more than 10 becomes hard to read.",
              "Keep series to 1-3 for clarity. Overlapping polygons with high fillOpacity can obscure each other.",
              "Data values should be on the same scale across dimensions (e.g. 0-100) for meaningful comparison.",
              "The gridLevels prop controls the number of concentric rings in the background grid.",
              "Built on @nivo/radar — all Nivo theming and tooltip conventions apply.",
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
            {["ScatterPlot", "BarChart", "HeatMap", "Bump"].map((name) => (
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
