"use client";

import { Gauge } from "@/components/charts/Gauge";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
import { GaugePlayground } from "@/components/docs/playgrounds/GaugePlayground";

const component = getComponent("gauge")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "thresholds", title: "Thresholds", level: 2 },
  { id: "target-comparison", title: "Target & Comparison", level: 2 },
  { id: "arc-styles", title: "Arc Styles", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function GaugeDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Gauge when you need to show a single value&apos;s position within a range
        — CPU usage, NPS score, budget utilization, or any metric with clear
        min/max bounds. For simple numeric KPIs without a range context, use{" "}
        <a href="/docs/kpi-card" className="font-medium text-[var(--accent)] hover:underline">
          KpiCard
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<Gauge
  value={73}
  title="CPU Usage"
  format="percent"
/>`}
        >
          <div className="w-full max-w-2xl">
            <Gauge
              value={73}
              title="CPU Usage"
              format="percent"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Thresholds */}
      <DocSection id="thresholds" title="Thresholds">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">thresholds</code> array
          to color zones on the arc. Each threshold defines a start value and color. The fill arc
          auto-picks the color of the zone the current value falls in.
        </p>
        <ComponentExample
          code={`<Gauge
  value={73}
  title="CPU Usage"
  format="percent"
  thresholds={[
    { value: 0, color: "#10b981" },
    { value: 60, color: "#f59e0b" },
    { value: 85, color: "#ef4444" },
  ]}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Gauge
              value={73}
              title="CPU Usage"
              format="percent"
              thresholds={[
                { value: 0, color: "#10b981" },
                { value: 60, color: "#f59e0b" },
                { value: 85, color: "#ef4444" },
              ]}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Target & Comparison */}
      <DocSection id="target-comparison" title="Target & Comparison">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Add a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">target</code> tick
          mark on the arc and a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">comparison</code> badge
          below the gauge to show period-over-period change.
        </p>
        <ComponentExample
          code={`<Gauge
  value={67500}
  min={0}
  max={100000}
  title="Budget Utilization"
  format="currency"
  target={80000}
  targetLabel="Target"
  comparison={{ value: 58200 }}
  comparisonLabel="vs last quarter"
/>`}
        >
          <div className="w-full max-w-2xl">
            <Gauge
              value={67500}
              min={0}
              max={100000}
              title="Budget Utilization"
              format="currency"
              target={80000}
              targetLabel="Target"
              comparison={{ value: 58200 }}
              comparisonLabel="vs last quarter"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Arc Styles */}
      <DocSection id="arc-styles" title="Arc Styles">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Choose between 270° (default, gap at bottom) and 180° (semicircle) arcs using
          the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">arcAngle</code> prop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">270° arc (default)</p>
            <Gauge
              value={72}
              min={-100}
              max={100}
              title="NPS Score"
              format="number"
              thresholds={[
                { value: -100, color: "#ef4444" },
                { value: 0, color: "#f59e0b" },
                { value: 50, color: "#10b981" },
              ]}
              showMinMax
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">180° arc (semicircle)</p>
            <Gauge
              value={72}
              min={-100}
              max={100}
              title="NPS Score"
              format="number"
              arcAngle={180}
              thresholds={[
                { value: -100, color: "#ef4444" },
                { value: 0, color: "#f59e0b" },
                { value: 50, color: "#10b981" },
              ]}
              showMinMax
            />
          </div>
        </div>
        <CodeBlock
          code={`// 270° arc (default)
<Gauge value={72} arcAngle={270} />

// 180° semicircle
<Gauge value={72} arcAngle={180} />`}
          className="mt-4"
        />
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
            <Gauge value={undefined} title="CPU Usage" format="percent" loading />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Empty</p>
            <Gauge value={undefined} title="CPU Usage" format="percent" empty={{ message: "No data available" }} />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<Gauge value={undefined} title="CPU Usage" loading />

// Empty state
<Gauge value={undefined} title="CPU Usage" empty={{ message: "No data" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter
        component={component}
        playground={
          <GaugePlayground />
        }
      />
    </DocPageLayout>
  );
}
