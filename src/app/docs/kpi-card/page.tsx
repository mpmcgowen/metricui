"use client";

import { KpiCard } from "@/components/cards/KpiCard";
import { DollarSign } from "lucide-react";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
import { KpiCardPlayground } from "@/components/docs/playgrounds/KpiCardPlayground";

const component = getComponent("kpi-card")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "comparisons", title: "Comparisons & Sparklines", level: 2 },
  { id: "goals", title: "Goal Progress", level: 2 },
  { id: "conditional", title: "Conditional Formatting", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function KpiCardDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use KpiCard when you need to display a single key metric prominently. It&apos;s the
        core building block of MetricUI dashboards — combining value display, trend comparison,
        sparklines, goal tracking, and conditional formatting in one component. For showing
        multiple metrics in a dense row, use{" "}
        <a href="/docs/stat-group" className="font-medium text-[var(--accent)] hover:underline">
          StatGroup
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<KpiCard
  title="Revenue"
  value={142300}
  format="currency"
  icon={<DollarSign />}
/>`}
        >
          <div className="w-full max-w-sm">
            <KpiCard
              title="Revenue"
              value={142300}
              format="currency"
              icon={<DollarSign className="h-3.5 w-3.5" />}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Comparisons & Sparklines */}
      <DocSection id="comparisons" title="Comparisons & Sparklines">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">comparison</code> object
          to show period-over-period change. Add a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sparkline</code> for
          inline trend visualization. You can pass an array of comparisons to show multiple periods.
        </p>
        <ComponentExample
          code={`<KpiCard
  title="Monthly Revenue"
  value={142300}
  format="currency"
  comparison={{ value: 128500 }}
  comparisonLabel="vs last month"
  sparkline={{
    data: [98, 105, 110, 108, 120, 135, 142],
    type: "line",
    interactive: true,
  }}
/>`}
        >
          <div className="w-full max-w-sm">
            <KpiCard
              title="Monthly Revenue"
              value={142300}
              format="currency"
              comparison={{ value: 128500 }}
              comparisonLabel="vs last month"
              sparkline={{
                data: [98, 105, 110, 108, 120, 135, 142],
                type: "line",
                interactive: true,
              }}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Goal Progress */}
      <DocSection id="goals" title="Goal Progress">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">goal</code> prop
          adds a progress bar showing progress toward a target. Configure labels, colors, and what info to display.
        </p>
        <ComponentExample
          code={`<KpiCard
  title="Conversion Rate"
  value={4.2}
  format="percent"
  goal={{
    value: 5,
    label: "Q1 Target",
    showProgress: true,
    showTarget: true,
    showRemaining: true,
  }}
/>`}
        >
          <div className="w-full max-w-sm">
            <KpiCard
              title="Conversion Rate"
              value={4.2}
              format="percent"
              goal={{
                value: 5,
                label: "Q1 Target",
                showProgress: true,
                showTarget: true,
                showRemaining: true,
              }}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Conditional Formatting */}
      <DocSection id="conditional" title="Conditional Formatting">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">conditions</code> to
          color the value based on thresholds. Rules are evaluated top-to-bottom — first match wins.
          Supports simple operators (<code className="font-[family-name:var(--font-mono)] text-[12px]">above</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">below</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">between</code>) and compound rules (<code className="font-[family-name:var(--font-mono)] text-[12px]">and</code>/<code className="font-[family-name:var(--font-mono)] text-[12px]">or</code>).
        </p>
        <ComponentExample
          code={`<KpiCard
  title="Server Uptime"
  value={99.7}
  format="percent"
  conditions={[
    { when: "above", value: 99.5, color: "emerald" },
    { when: "between", min: 99, max: 99.5, color: "amber" },
    { when: "below", value: 99, color: "red" },
  ]}
/>`}
        >
          <div className="w-full max-w-sm">
            <KpiCard
              title="Server Uptime"
              value={99.7}
              format="percent"
              conditions={[
                { when: "above", value: 99.5, color: "emerald" },
                { when: "between", min: 99, max: 99.5, color: "amber" },
                { when: "below", value: 99, color: "red" },
              ]}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Data States */}
      <DocSection id="data-states" title="Data States">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Every component handles loading, empty, error, and stale states.
          Pass individual props or use the grouped <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
            <KpiCard title="Revenue" value={0} format="currency" loading />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <KpiCard
              title="Revenue"
              value={0}
              format="currency"
              error={{ message: "Failed to load data" }}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<KpiCard title="Revenue" value={0} loading />

// Error state
<KpiCard title="Revenue" value={0} error={{ message: "Failed to load" }} />

// Grouped state prop
<KpiCard title="Revenue" value={0} state={{ loading: isLoading, error }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter
        component={component}
        playground={<KpiCardPlayground />}
      />
    </DocPageLayout>
  );
}
