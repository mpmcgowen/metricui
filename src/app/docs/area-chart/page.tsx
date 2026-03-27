"use client";

import { AreaChart } from "@/components/charts/AreaChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
import { AreaChartPlayground } from "@/components/docs/playgrounds/AreaChartPlayground";

const component = getComponent("area-chart")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "stacked", title: "Stacked Areas", level: 2 },
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

const revenueData = [
  {
    id: "Revenue",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [42000, 45000, 48000, 51000, 49000, 55000, 58000, 62000, 59000, 65000, 71000, 78000][i],
    })),
  },
];

const stackedData = [
  {
    id: "Organic",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [1200, 1400, 1800, 2200, 2800, 3200, 3600, 4100, 3900, 4500, 5200, 5800][i],
    })),
  },
  {
    id: "Paid",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [800, 900, 1100, 1400, 1200, 1600, 1800, 2000, 1900, 2200, 2400, 2600][i],
    })),
  },
  {
    id: "Referral",
    data: monthLabels.map((m, i) => ({
      x: m,
      y: [400, 500, 600, 700, 650, 800, 900, 1000, 950, 1100, 1200, 1300][i],
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

export default function AreaChartDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use AreaChart to visualize time-series data with filled areas that emphasize volume and
        trends. It supports gradient fills, stacking, dual Y-axis, comparison overlays, reference
        lines, and threshold bands. For clean lines without area fills, use{" "}
        <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
          LineChart
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<AreaChart
  data={[{
    id: "Revenue",
    data: [
      { x: "Jan", y: 42000 },
      { x: "Feb", y: 45000 },
      { x: "Mar", y: 48000 },
      // ...
    ],
  }]}
  title="Revenue Over Time"
  format={{ style: "currency" }}
/>`}
        >
          <div className="w-full max-w-2xl">
            <AreaChart
              data={revenueData}
              title="Revenue Over Time"
              format={{ style: "currency" }}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Stacked Areas */}
      <DocSection id="stacked" title="Stacked Areas">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass multiple series and enable{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">stacked</code>{" "}
          to stack areas. Use{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">stackMode=&quot;percent&quot;</code>{" "}
          to normalize to 100%.
        </p>
        <ComponentExample
          code={`<AreaChart
  data={trafficData}
  stacked
  title="Traffic Sources"
  format={{ style: "number", compact: true }}
/>`}
        >
          <div className="w-full max-w-2xl">
            <AreaChart
              data={stackedData}
              stacked
              title="Traffic Sources"
              format={{ style: "number", compact: true }}
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
          code={`<AreaChart
  data={currentPeriod}
  comparisonData={previousPeriod}
  title="Revenue vs Last Year"
  format={{ style: "currency" }}
/>`}
        >
          <div className="w-full max-w-2xl">
            <AreaChart
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
          to highlight Y-axis ranges (e.g., danger zones, target bands).
        </p>
        <ComponentExample
          code={`<AreaChart
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
            <AreaChart
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
            <AreaChart data={[]} title="Revenue" loading />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <AreaChart
              data={[]}
              title="Revenue"
              error={{ message: "Failed to load data" }}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<AreaChart data={[]} title="Revenue" loading />

// Error state
<AreaChart data={[]} title="Revenue" error={{ message: "Failed to load" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter
        component={component}
        playground={<AreaChartPlayground />}
      />
    </DocPageLayout>
  );
}
