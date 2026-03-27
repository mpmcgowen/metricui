"use client";

import { BulletChart } from "@/components/charts/BulletChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("bullet-chart")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "simple-data", title: "Simple Data Format", level: 2 },
  { id: "multiple-metrics", title: "Multiple Metrics", level: 2 },
  { id: "vertical", title: "Vertical Layout", level: 2 },
  { id: "custom-styling", title: "Custom Styling", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// Sample data — full format
const revenueData = [
  {
    id: "Revenue",
    ranges: [50000, 80000, 100000],
    measures: [72000],
    markers: [85000],
  },
];

const multiMetricData = [
  {
    id: "Revenue",
    ranges: [50000, 80000, 100000],
    measures: [72000],
    markers: [85000],
  },
  {
    id: "Users",
    ranges: [500, 800, 1000],
    measures: [680],
    markers: [750],
  },
  {
    id: "NPS",
    ranges: [30, 60, 100],
    measures: [74],
    markers: [80],
  },
];

// Sample data — simple format
const simpleData = [
  { label: "Revenue", value: 72000, target: 85000 },
  { label: "Users", value: 680, target: 750 },
  { label: "NPS", value: 74, target: 80, max: 100 },
];

export default function BulletChartDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use BulletChart to compare actual performance against targets with
        qualitative range bands. Ideal for OKR scorecards, KPI targets, and
        quota tracking. Supports full BulletDatum format and a simpleData
        shorthand, horizontal and vertical layouts, configurable range colors,
        and theme-aware styling. For single-value progress, use{" "}
        <a href="/docs/gauge" className="font-medium text-[var(--accent)] hover:underline">
          Gauge
        </a>{" "}
        or{" "}
        <a href="/docs/kpi-card" className="font-medium text-[var(--accent)] hover:underline">
          KpiCard
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass an array of bullet data with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">ranges</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">measures</code>, and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">markers</code> to render a bullet chart.
        </p>
        <ComponentExample
          code={`<BulletChart
  data={[
    {
      id: "Revenue",
      ranges: [50000, 80000, 100000],
      measures: [72000],
      markers: [85000],
    },
  ]}
  title="Revenue vs Target"
  format="currency"
  height={120}
/>`}
        >
          <div className="w-full max-w-2xl">
            <BulletChart
              data={revenueData}
              title="Revenue vs Target"
              format="currency"
              height={120}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Simple Data Format */}
      <DocSection id="simple-data" title="Simple Data Format">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">simpleData</code> for
          the common &quot;value vs target&quot; case. Ranges are auto-generated from zone
          percentages (default: [60, 80, 100] of max).
        </p>
        <ComponentExample
          code={`<BulletChart
  simpleData={[
    { label: "Revenue", value: 72000, target: 85000 },
    { label: "Users", value: 680, target: 750 },
    { label: "NPS", value: 74, target: 80, max: 100 },
  ]}
  title="Team Scorecard"
/>`}
        >
          <div className="w-full max-w-2xl">
            <BulletChart
              simpleData={simpleData}
              title="Team Scorecard"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Multiple Metrics */}
      <DocSection id="multiple-metrics" title="Multiple Metrics">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass multiple items in the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">data</code> array
          to compare several KPIs side by side. Height auto-calculates from item count.
        </p>
        <ComponentExample
          code={`<BulletChart
  data={[
    { id: "Revenue", ranges: [50000, 80000, 100000], measures: [72000], markers: [85000] },
    { id: "Users", ranges: [500, 800, 1000], measures: [680], markers: [750] },
    { id: "NPS", ranges: [30, 60, 100], measures: [74], markers: [80] },
  ]}
  title="Q4 Performance"
/>`}
        >
          <div className="w-full max-w-2xl">
            <BulletChart
              data={multiMetricData}
              title="Q4 Performance"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Vertical Layout */}
      <DocSection id="vertical" title="Vertical Layout">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">layout=&quot;vertical&quot;</code> for
          a column-oriented bullet chart. Useful when vertical space is plentiful and you want
          to read values top-to-bottom.
        </p>
        <ComponentExample
          code={`<BulletChart
  data={[
    { id: "Revenue", ranges: [50000, 80000, 100000], measures: [72000], markers: [85000] },
    { id: "Users", ranges: [500, 800, 1000], measures: [680], markers: [750] },
  ]}
  layout="vertical"
  title="Vertical Bullets"
  height={300}
/>`}
        >
          <div className="w-full max-w-2xl">
            <BulletChart
              data={[
                { id: "Revenue", ranges: [50000, 80000, 100000], measures: [72000], markers: [85000] },
                { id: "Users", ranges: [500, 800, 1000], measures: [680], markers: [750] },
              ]}
              layout="vertical"
              title="Vertical Bullets"
              height={300}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Styling */}
      <DocSection id="custom-styling" title="Custom Styling">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Customize <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">measureSize</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">markerSize</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">spacing</code>, and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">titlePosition</code> to
          tune the visual density and layout.
        </p>
        <ComponentExample
          code={`<BulletChart
  simpleData={[
    { label: "MRR", value: 85000, target: 100000, max: 120000 },
    { label: "NPS Score", value: 72, target: 80, max: 100 },
    { label: "Response Time", value: 120, target: 100, max: 200 },
  ]}
  title="SaaS Metrics"
  subtitle="Actuals vs targets"
  measureSize={0.3}
  markerSize={0.8}
  spacing={32}
  titlePosition="after"
/>`}
        >
          <div className="w-full max-w-2xl">
            <BulletChart
              simpleData={[
                { label: "MRR", value: 85000, target: 100000, max: 120000 },
                { label: "NPS Score", value: 72, target: 80, max: 100 },
                { label: "Response Time", value: 120, target: 100, max: 200 },
              ]}
              title="SaaS Metrics"
              subtitle="Actuals vs targets"
              measureSize={0.3}
              markerSize={0.8}
              spacing={32}
              titlePosition="after"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Data States */}
      <DocSection id="data-states" title="Data States">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Every component handles loading, empty, and error states.
          Pass individual props or use the grouped <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
            <BulletChart
              data={[]}
              title="Revenue"
              loading
              height={120}
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <BulletChart
              data={[]}
              title="Revenue"
              error={{ message: "Failed to load data" }}
              height={120}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<BulletChart data={[]} title="Revenue" loading />

// Error state
<BulletChart data={[]} title="Revenue" error={{ message: "Failed to load" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
