"use client";

import { BarChart } from "@/components/charts/BarChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { BarChartPlayground } from "@/components/docs/playgrounds/BarChartPlayground";

const component = getComponent("bar-chart")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "grouped-stacked", title: "Grouped & Stacked", level: 2 },
  { id: "horizontal", title: "Horizontal Layout", level: 2 },
  { id: "comparison", title: "Comparison Overlay", level: 2 },
  { id: "reference-lines", title: "Reference Lines & Thresholds", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// Sample data
const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 45200 },
  { month: "Mar", revenue: 48100 },
  { month: "Apr", revenue: 51800 },
  { month: "May", revenue: 49200 },
  { month: "Jun", revenue: 55400 },
];

const multiKeyData = [
  { channel: "Organic", visitors: 14200, conversions: 1420 },
  { channel: "Direct", visitors: 8900, conversions: 1120 },
  { channel: "Referral", visitors: 6700, conversions: 670 },
  { channel: "Social", visitors: 5400, conversions: 380 },
  { channel: "Email", visitors: 4100, conversions: 820 },
];

const threeKeyData = [
  { quarter: "Q1", organic: 12400, paid: 8200, referral: 4100 },
  { quarter: "Q2", organic: 15800, paid: 9600, referral: 5300 },
  { quarter: "Q3", organic: 18200, paid: 11400, referral: 6800 },
  { quarter: "Q4", organic: 22100, paid: 13200, referral: 8400 },
];

const horizontalData = [
  { category: "Enterprise Plan", signups: 142 },
  { category: "Professional Plan", signups: 287 },
  { category: "Starter Plan", signups: 523 },
  { category: "Free Trial", signups: 891 },
  { category: "Open Source", signups: 1240 },
];

const comparisonData = [
  { month: "Jan", revenue: 36000 },
  { month: "Feb", revenue: 38200 },
  { month: "Mar", revenue: 40100 },
  { month: "Apr", revenue: 42800 },
  { month: "May", revenue: 41200 },
  { month: "Jun", revenue: 45400 },
];

export default function BarChartDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use BarChart for categorical comparison — comparing values across
          discrete categories like months, channels, or products. Supports
          vertical and horizontal layouts, grouped/stacked/percent modes,
          comparison overlays, reference lines, and threshold bands. For
          time-series trends, use{" "}
          <a href="/docs/area-chart" className="font-medium text-[var(--accent)] hover:underline">
            AreaChart
          </a>{" "}
          or{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>{" "}
          instead.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<BarChart
  data={[
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 45200 },
    { month: "Mar", revenue: 48100 },
    { month: "Apr", revenue: 51800 },
    { month: "May", revenue: 49200 },
    { month: "Jun", revenue: 55400 },
  ]}
  keys={["revenue"]}
  indexBy="month"
  title="Monthly Revenue"
  format={{ style: "currency" }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <BarChart
                data={revenueData}
                keys={["revenue"]}
                indexBy="month"
                title="Monthly Revenue"
                format={{ style: "currency" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Grouped & Stacked */}
        <DocSection id="grouped-stacked" title="Grouped & Stacked">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            When you have multiple <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">keys</code>,
            use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">groupMode</code> to
            control how bars are arranged. Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">preset</code> for
            quick configuration, or set <code className="font-[family-name:var(--font-mono)] text-[12px]">layout</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">groupMode</code> individually.
          </p>
          <ComponentExample
            code={`<BarChart
  preset="grouped"
  data={multiKeyData}
  keys={["visitors", "conversions"]}
  indexBy="channel"
  title="Visitors vs Conversions"
  format={{ style: "number" }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <BarChart
                preset="grouped"
                data={multiKeyData}
                keys={["visitors", "conversions"]}
                indexBy="channel"
                title="Visitors vs Conversions"
                format={{ style: "number" }}
              />
            </div>
          </ComponentExample>
          <div className="mt-6">
            <ComponentExample
              code={`<BarChart
  preset="percent"
  data={threeKeyData}
  keys={["organic", "paid", "referral"]}
  indexBy="quarter"
  title="Channel Mix"
/>`}
            >
              <div className="w-full max-w-2xl">
                <BarChart
                  preset="percent"
                  data={threeKeyData}
                  keys={["organic", "paid", "referral"]}
                  indexBy="quarter"
                  title="Channel Mix"
                />
              </div>
            </ComponentExample>
          </div>
        </DocSection>

        {/* Horizontal Layout */}
        <DocSection id="horizontal" title="Horizontal Layout">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Horizontal bars are ideal for long category labels. The left margin auto-adjusts to fit
            the longest label. Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sort</code> prop
            to rank bars by value.
          </p>
          <ComponentExample
            code={`<BarChart
  preset="horizontal"
  data={horizontalData}
  keys={["signups"]}
  indexBy="category"
  title="Signups by Plan"
  sort="desc"
  format={{ style: "number" }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <BarChart
                preset="horizontal"
                data={horizontalData}
                keys={["signups"]}
                indexBy="category"
                title="Signups by Plan"
                sort="desc"
                format={{ style: "number" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Comparison Overlay */}
        <DocSection id="comparison" title="Comparison Overlay">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">comparisonData</code> to
            render a dashed outline showing a previous period alongside current bars. The comparison data
            must have the same shape and index values as the primary data.
          </p>
          <ComponentExample
            code={`<BarChart
  data={currentData}
  keys={["revenue"]}
  indexBy="month"
  comparisonData={previousPeriodData}
  title="Revenue: Current vs Previous"
  format={{ style: "currency" }}
/>`}
          >
            <div className="w-full max-w-2xl">
              <BarChart
                data={revenueData}
                keys={["revenue"]}
                indexBy="month"
                comparisonData={comparisonData}
                title="Revenue: Current vs Previous"
                format={{ style: "currency" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Reference Lines & Thresholds */}
        <DocSection id="reference-lines" title="Reference Lines & Thresholds">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">referenceLines</code> for
            targets or benchmarks, and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">thresholds</code> for
            colored value-axis bands (e.g. danger/warning zones).
          </p>
          <ComponentExample
            code={`<BarChart
  data={revenueData}
  keys={["revenue"]}
  indexBy="month"
  title="Revenue vs Target"
  format={{ style: "currency" }}
  referenceLines={[{
    axis: "y",
    value: 50000,
    label: "Target",
    color: "#EF4444",
    style: "dashed",
  }]}
  thresholds={[{
    from: 40000,
    to: 50000,
    color: "#F59E0B",
    label: "Warning zone",
  }]}
/>`}
          >
            <div className="w-full max-w-2xl">
              <BarChart
                data={revenueData}
                keys={["revenue"]}
                indexBy="month"
                title="Revenue vs Target"
                format={{ style: "currency" }}
                referenceLines={[{
                  axis: "y",
                  value: 50000,
                  label: "Target",
                  color: "#EF4444",
                  style: "dashed",
                }]}
                thresholds={[{
                  from: 40000,
                  to: 50000,
                  color: "#F59E0B",
                  label: "Warning zone",
                }]}
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
              <BarChart
                data={[]}
                keys={["revenue"]}
                indexBy="month"
                title="Revenue"
                loading
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
              <BarChart
                data={[]}
                keys={["revenue"]}
                indexBy="month"
                title="Revenue"
                error={{ message: "Failed to load data" }}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Loading state
<BarChart data={[]} keys={["revenue"]} indexBy="month" loading />

// Error state
<BarChart data={[]} keys={["revenue"]} indexBy="month" error={{ message: "Failed to load" }} />`}
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
            <BarChartPlayground />
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
