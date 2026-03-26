"use client";

import { HeatMap } from "@/components/charts/HeatMap";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { HeatMapPlayground } from "@/components/docs/playgrounds/HeatMapPlayground";

const component = getComponent("heat-map")!;

const basicData = [
  { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }] },
  { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }] },
  { id: "Wed", data: [{ x: "9am", y: 18 }, { x: "10am", y: 62 }, { x: "11am", y: 85 }] },
];

const correlationData = [
  { id: "Revenue", data: [{ x: "Revenue", y: 1.0 }, { x: "Users", y: 0.85 }, { x: "Bounce", y: -0.64 }] },
  { id: "Users", data: [{ x: "Revenue", y: 0.85 }, { x: "Users", y: 1.0 }, { x: "Bounce", y: -0.52 }] },
  { id: "Bounce", data: [{ x: "Revenue", y: -0.64 }, { x: "Users", y: -0.52 }, { x: "Bounce", y: 1.0 }] },
];

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "labels-formatting", title: "Labels & Formatting", level: 2 },
  { id: "diverging-scale", title: "Diverging Color Scale", level: 2 },
  { id: "simple-data", title: "Simple Data Shorthand", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function HeatMapDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use HeatMap when you need to show patterns across two categorical axes
          — day/hour activity grids, server response time matrices, or correlation tables.
          For single-axis trends over time, use{" "}
          <a href="/docs/area-chart" className="font-medium text-[var(--accent)] hover:underline">
            AreaChart
          </a>{" "}
          or{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>{" "}
          instead.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<HeatMap
  data={[
    { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }] },
    { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }] },
    { id: "Wed", data: [{ x: "9am", y: 18 }, { x: "10am", y: 62 }, { x: "11am", y: 85 }] },
  ]}
  title="Weekly Activity"
/>`}
          >
            <div className="w-full max-w-2xl">
              <HeatMap
                data={basicData}
                title="Weekly Activity"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Labels & Formatting */}
        <DocSection id="labels-formatting" title="Labels & Formatting">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">enableLabels</code> to
            show formatted values inside each cell. Combine with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">format</code> for
            number formatting and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">borderRadius</code> for
            rounded cells.
          </p>
          <ComponentExample
            code={`<HeatMap
  data={activityData}
  title="User Activity"
  subtitle="Sessions by day and hour"
  format="number"
  enableLabels
  borderRadius={6}
  height={320}
/>`}
          >
            <div className="w-full max-w-2xl">
              <HeatMap
                data={basicData}
                title="User Activity"
                subtitle="Sessions by day and hour"
                format="number"
                enableLabels
                borderRadius={6}
                height={320}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Diverging Color Scale */}
        <DocSection id="diverging-scale" title="Diverging Color Scale">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Switch to <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">colorScale=&quot;diverging&quot;</code> for
            data with a meaningful midpoint (like correlations from -1 to 1). Combine with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">forceSquare</code> for
            symmetric matrices.
          </p>
          <ComponentExample
            code={`<HeatMap
  data={correlationData}
  title="Metric Correlations"
  colorScale="diverging"
  enableLabels
  forceSquare
/>`}
          >
            <div className="w-full max-w-2xl">
              <HeatMap
                data={correlationData}
                title="Metric Correlations"
                colorScale="diverging"
                enableLabels
                forceSquare
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Simple Data Shorthand */}
        <DocSection id="simple-data" title="Simple Data Shorthand">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">simpleData</code> for
            a flat object format that gets converted to the series format automatically.
          </p>
          <CodeBlock
            code={`// Instead of the full series format, use simpleData:
<HeatMap
  simpleData={{
    Mon: { "9am": 12, "10am": 45, "11am": 78 },
    Tue: { "9am": 23, "10am": 56, "11am": 92 },
  }}
  title="Weekly Activity"
/>`}
          />
        </DocSection>

        {/* Data States */}
        <DocSection id="data-states" title="Data States">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Every component handles loading, empty, and error states.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
              <HeatMap data={[]} title="Activity" loading />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
              <HeatMap data={[]} title="Activity" error={{ message: "Failed to load data" }} />
            </div>
          </div>
          <CodeBlock
            code={`// Loading state
<HeatMap data={[]} title="Activity" loading />

// Error state
<HeatMap data={[]} title="Activity" error={{ message: "Failed to load" }} />`}
            className="mt-4"
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

        {/* Data Shape */}
        {component.dataShape && (
          <DocSection id="data-shape" title="Data Shape">
            <CodeBlock code={component.dataShape} language="typescript" />
          </DocSection>
        )}

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
          </ul>
        </DocSection>

        {/* Playground */}
        <DocSection id="playground" title="Playground">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with every prop interactively. Adjust the controls on the right to see the
            component update in real time.
          </p>
          <div className="rounded-xl border border-[var(--card-border)]">
            <HeatMapPlayground />
          </div>
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
