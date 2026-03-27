"use client";

import { BarLineChart } from "@/components/charts/BarLineChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
import { BarLineChartPlayground } from "@/components/docs/playgrounds/BarLineChartPlayground";

const component = getComponent("bar-line-chart")!;

const basicBarData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 45200 },
  { month: "Mar", revenue: 48100 },
  { month: "Apr", revenue: 51800 },
  { month: "May", revenue: 49200 },
  { month: "Jun", revenue: 55400 },
];

const basicLineData = [
  {
    id: "Growth Rate",
    data: [
      { x: "Jan", y: 8.2 },
      { x: "Feb", y: 7.6 },
      { x: "Mar", y: 6.4 },
      { x: "Apr", y: 7.7 },
      { x: "May", y: -5.0 },
      { x: "Jun", y: 12.6 },
    ],
  },
];

const stackedBarData = [
  { month: "Jan", revenue: 42000, costs: 28000 },
  { month: "Feb", revenue: 45200, costs: 30100 },
  { month: "Mar", revenue: 48100, costs: 29800 },
  { month: "Apr", revenue: 51800, costs: 31200 },
  { month: "May", revenue: 49200, costs: 32400 },
  { month: "Jun", revenue: 55400, costs: 33100 },
];

const marginLineData = [
  {
    id: "Profit Margin",
    data: [
      { x: "Jan", y: 33.3 },
      { x: "Feb", y: 33.4 },
      { x: "Mar", y: 38.0 },
      { x: "Apr", y: 39.8 },
      { x: "May", y: 34.1 },
      { x: "Jun", y: 40.3 },
    ],
  },
];

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "stacked-bars", title: "Stacked Bars + Line", level: 2 },
  { id: "dual-axis", title: "Dual-Axis Labels", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function BarLineChartDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use BarLineChart when you need to overlay a rate or percentage on top of volume data
        — revenue bars with growth rate lines, sales volume with conversion percentage, or
        any dual-axis scenario. For bars only, use{" "}
        <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
          BarChart
        </a>
        . For lines only, use{" "}
        <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
          LineChart
        </a>
        .
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<BarLineChart
  barData={[{ month: "Jan", revenue: 42000 }, ...]}
  barKeys={["revenue"]}
  indexBy="month"
  lineData={[{ id: "Growth Rate", data: [{ x: "Jan", y: 8.2 }, ...] }]}
  title="Revenue & Growth"
  format={{ style: "currency", compact: true }}
  lineFormat={{ style: "percent", precision: 1 }}
/>`}
        >
          <div className="w-full max-w-2xl">
            <BarLineChart
              barData={basicBarData}
              barKeys={["revenue"]}
              indexBy="month"
              lineData={basicLineData}
              title="Revenue & Growth"
              format={{ style: "currency", compact: true }}
              lineFormat={{ style: "percent", precision: 1 }}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Stacked Bars + Line */}
      <DocSection id="stacked-bars" title="Stacked Bars + Line">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass multiple <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">barKeys</code> to
          stack (or group) bars. The line overlay uses the right Y-axis with its own scale.
        </p>
        <ComponentExample
          code={`<BarLineChart
  barData={monthlyData}
  barKeys={["revenue", "costs"]}
  indexBy="month"
  lineData={[{ id: "Profit Margin", data: marginData }]}
  title="Revenue, Costs & Margin"
  format={{ style: "currency", compact: true }}
  lineFormat={{ style: "percent", precision: 1 }}
  groupMode="stacked"
  legend
/>`}
        >
          <div className="w-full max-w-2xl">
            <BarLineChart
              barData={stackedBarData}
              barKeys={["revenue", "costs"]}
              indexBy="month"
              lineData={marginLineData}
              title="Revenue, Costs & Margin"
              format={{ style: "currency", compact: true }}
              lineFormat={{ style: "percent", precision: 1 }}
              groupMode="stacked"
              legend={{ position: "bottom", toggleable: true }}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Dual-Axis Labels */}
      <DocSection id="dual-axis" title="Dual-Axis Labels">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">yAxisLabel</code> and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">rightAxisLabel</code> to
          label each axis for clarity.
        </p>
        <CodeBlock
          code={`<BarLineChart
  barData={data}
  barKeys={["revenue"]}
  indexBy="month"
  lineData={lineData}
  yAxisLabel="Revenue ($)"
  rightAxisLabel="Growth (%)"
  format="currency"
  lineFormat="percent"
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
            <BarLineChart
              barData={[]}
              barKeys={["revenue"]}
              indexBy="month"
              lineData={[]}
              title="Revenue"
              loading
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <BarLineChart
              barData={[]}
              barKeys={["revenue"]}
              indexBy="month"
              lineData={[]}
              title="Revenue"
              error={{ message: "Failed to load data" }}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<BarLineChart barData={[]} barKeys={["revenue"]} indexBy="month" lineData={[]} loading />

// Error state
<BarLineChart barData={[]} barKeys={["revenue"]} indexBy="month" lineData={[]} error={{ message: "Failed" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter
        component={component}
        playground={<BarLineChartPlayground />}
      />
    </DocPageLayout>
  );
}
