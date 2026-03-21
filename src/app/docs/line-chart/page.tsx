"use client";

import { LineChart } from "@/components/charts/LineChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { LineChartPlayground } from "@/components/docs/playgrounds/LineChartPlayground";

const component = getComponent("line-chart")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "multi-series", title: "Multi-Series", level: 2 },
  { id: "comparison", title: "Comparison Overlay", level: 2 },
  { id: "reference-lines", title: "Reference Lines & Thresholds", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const usersData = [
  {
    id: "Users",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [820, 930, 1040, 1190, 1350, 1420, 1580, 1720, 1890, 2050, 2310, 2540][i],
    })),
  },
];

const multiSeriesData = [
  {
    id: "Desktop",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [4200, 4500, 4800, 5100, 4900, 5500, 5800, 6200, 5900, 6500, 7100, 7800][i],
    })),
  },
  {
    id: "Mobile",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [3800, 4000, 4100, 3900, 4200, 4400, 4300, 4600, 4500, 4800, 4700, 5000][i],
    })),
  },
  {
    id: "Tablet",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [1200, 1400, 1800, 2200, 2800, 3200, 3600, 4100, 3900, 4500, 5200, 5800][i],
    })),
  },
];

const revenueData = [
  {
    id: "Revenue",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [42000, 45000, 48000, 51000, 49000, 55000, 58000, 62000, 59000, 65000, 71000, 78000][i],
    })),
  },
];

const comparisonPrev = [
  {
    id: "Revenue",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [36000, 38000, 40000, 42000, 41000, 45000, 48000, 50000, 48000, 52000, 56000, 60000][i],
    })),
  },
];

export default function LineChartDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use LineChart for clean trend visualization without filled areas. It is a thin wrapper
          around AreaChart with area fill disabled and points enabled by default. Supports reference
          lines, threshold bands, comparison overlays, and all the same formatting options. For
          filled area visualization, use{" "}
          <a href="/docs/area-chart" className="font-medium text-[var(--accent)] hover:underline">
            AreaChart
          </a>{" "}
          instead.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<LineChart
  data={[{
    id: "Users",
    data: [
      { x: "Jan", y: 820 },
      { x: "Feb", y: 930 },
      { x: "Mar", y: 1040 },
      // ...
    ],
  }]}
  title="Active Users"
  format={{ style: "number", compact: true }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <LineChart
                data={usersData}
                title="Active Users"
                format={{ style: "number", compact: true }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Multi-Series */}
        <DocSection id="multi-series" title="Multi-Series">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass multiple series to compare trends side by side. The legend is automatically shown
            for multi-series data and supports toggling individual series on and off.
          </p>
          <ComponentExample
            code={`<LineChart
  data={[
    { id: "Desktop", data: [...] },
    { id: "Mobile", data: [...] },
    { id: "Tablet", data: [...] },
  ]}
  title="Traffic by Device"
  format={{ style: "number", compact: true }}
  pointSize={4}
/>`}
          >
            <div className="w-full max-w-2xl">
              <LineChart
                data={multiSeriesData}
                title="Traffic by Device"
                format={{ style: "number", compact: true }}
                pointSize={4}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Comparison Overlay */}
        <DocSection id="comparison" title="Comparison Overlay">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">comparisonData</code>{" "}
            to render a dashed overlay of a previous period. The comparison lines use 50% opacity
            so the current period stays prominent.
          </p>
          <ComponentExample
            code={`<LineChart
  data={currentPeriod}
  comparisonData={previousPeriod}
  title="Revenue vs Last Year"
  format={{ style: "currency" }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <LineChart
                data={revenueData}
                comparisonData={comparisonPrev}
                title="Revenue vs Last Year"
                format={{ style: "currency" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Reference Lines & Thresholds */}
        <DocSection id="reference-lines" title="Reference Lines & Thresholds">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add horizontal or vertical{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">referenceLines</code>{" "}
            for targets and benchmarks. Use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">thresholds</code>{" "}
            to highlight Y-axis ranges.
          </p>
          <ComponentExample
            code={`<LineChart
  data={revenueData}
  title="Revenue with Target"
  format={{ style: "currency" }}
  referenceLines={[
    { axis: "y", value: 60000, label: "Target", color: "#EF4444", style: "dashed" },
  ]}
  thresholds={[
    { from: 40000, to: 55000, color: "#F59E0B", label: "Warning zone" },
  ]}
/>`}
          >
            <div className="w-full max-w-2xl">
              <LineChart
                data={revenueData}
                title="Revenue with Target"
                format={{ style: "currency" }}
                referenceLines={[
                  { axis: "y", value: 60000, label: "Target", color: "#EF4444", style: "dashed" },
                ]}
                thresholds={[
                  { from: 40000, to: 55000, color: "#F59E0B", label: "Warning zone" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Data States */}
        <DocSection id="data-states" title="Data States">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Every component handles loading, empty, error, and stale states.
            Pass individual props or use the grouped{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
              <LineChart data={[]} title="Users" loading />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
              <LineChart
                data={[]}
                title="Users"
                error={{ message: "Failed to load data" }}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Loading state
<LineChart data={[]} title="Users" loading />

// Error state
<LineChart data={[]} title="Users" error={{ message: "Failed to load" }} />`}
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
            <LineChartPlayground />
          </div>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
