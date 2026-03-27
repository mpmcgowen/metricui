"use client";

import { Waterfall } from "@/components/charts/Waterfall";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("waterfall")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "subtotals", title: "With Subtotals", level: 2 },
  { id: "custom-colors", title: "Custom Colors", level: 2 },
  { id: "no-connectors", title: "Without Connectors", level: 2 },
  { id: "quarterly-changes", title: "Quarterly Changes", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// --- Sample data ---

const mrrBridgeData = [
  { label: "Starting MRR", value: 85000, type: "value" as const },
  { label: "New Sales", value: 28400, type: "value" as const },
  { label: "Expansion", value: 12600, type: "value" as const },
  { label: "Churn", value: -8200, type: "value" as const },
  { label: "Contraction", value: -3100, type: "value" as const },
  { label: "Ending MRR", value: 0, type: "total" as const },
];

const subtotalData = [
  { label: "Revenue", value: 120000, type: "value" as const },
  { label: "Services", value: 34000, type: "value" as const },
  { label: "Gross Income", value: 0, type: "subtotal" as const },
  { label: "Salaries", value: -62000, type: "value" as const },
  { label: "Marketing", value: -18000, type: "value" as const },
  { label: "Rent", value: -9500, type: "value" as const },
  { label: "Operating Income", value: 0, type: "subtotal" as const },
  { label: "Tax", value: -13000, type: "value" as const },
  { label: "Net Income", value: 0, type: "total" as const },
];

const customColorData = [
  { label: "Q1 Target", value: 50000, type: "value" as const },
  { label: "Outperformance", value: 8200, type: "value" as const, color: "#6366f1" },
  { label: "Seasonality", value: -3400, type: "value" as const },
  { label: "New Market", value: 12800, type: "value" as const, color: "#6366f1" },
  { label: "Refunds", value: -2100, type: "value" as const },
  { label: "Q1 Actual", value: 0, type: "total" as const },
];

const budgetData = [
  { label: "Budget", value: 200000, type: "value" as const },
  { label: "Personnel", value: -82000, type: "value" as const },
  { label: "Equipment", value: -34000, type: "value" as const },
  { label: "Software", value: -21000, type: "value" as const },
  { label: "Travel", value: -8500, type: "value" as const },
  { label: "Remaining", value: 0, type: "total" as const },
];

const quarterlyData = [
  { label: "Q1", value: 120000, type: "value" as const },
  { label: "Q2", value: 45000, type: "value" as const },
  { label: "Q3", value: -30000, type: "value" as const },
  { label: "Q4", value: 65000, type: "value" as const },
  { label: "FY Total", value: 0, type: "total" as const },
];

export default function WaterfallDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Waterfall for sequential change analysis — showing how an initial
        value is affected by a series of positive and negative changes.
        Perfect for P&L breakdowns, MRR bridges, and budget analysis. Supports
        subtotals, totals, connector lines, per-bar color overrides, and
        custom positive/negative/total colors. For categorical comparison, use{" "}
        <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
          BarChart
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass an array of items with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">label</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code>, and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">type</code>.
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">type: &quot;total&quot;</code> for
          the final computed sum.
        </p>
        <ComponentExample
          code={`<Waterfall
  data={[
    { label: "Starting MRR", value: 85000, type: "value" },
    { label: "New Sales", value: 28400, type: "value" },
    { label: "Expansion", value: 12600, type: "value" },
    { label: "Churn", value: -8200, type: "value" },
    { label: "Contraction", value: -3100, type: "value" },
    { label: "Ending MRR", value: 0, type: "total" },
  ]}
  title="MRR Bridge"
  format="currency"
  connectors
  height={320}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Waterfall
              data={mrrBridgeData}
              title="MRR Bridge"
              format="currency"
              connectors
              height={320}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* With Subtotals */}
      <DocSection id="subtotals" title="With Subtotals">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">type: &quot;subtotal&quot;</code> to
          insert intermediate running-total markers. Great for P&L statements where you need
          gross income before expenses.
        </p>
        <ComponentExample
          code={`<Waterfall
  data={[
    { label: "Revenue", value: 120000, type: "value" },
    { label: "Services", value: 34000, type: "value" },
    { label: "Gross Income", value: 0, type: "subtotal" },
    { label: "Salaries", value: -62000, type: "value" },
    { label: "Marketing", value: -18000, type: "value" },
    { label: "Rent", value: -9500, type: "value" },
    { label: "Operating Income", value: 0, type: "subtotal" },
    { label: "Tax", value: -13000, type: "value" },
    { label: "Net Income", value: 0, type: "total" },
  ]}
  title="P&L Breakdown"
  format="currency"
  connectors
  height={360}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Waterfall
              data={subtotalData}
              title="P&L Breakdown"
              format="currency"
              connectors
              height={360}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Colors */}
      <DocSection id="custom-colors" title="Custom Colors">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Override colors per-bar with the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">color</code> property
          on individual data items, or set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">positiveColor</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">negativeColor</code>, and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">totalColor</code> globally.
        </p>
        <ComponentExample
          code={`<Waterfall
  data={[
    { label: "Q1 Target", value: 50000 },
    { label: "Outperformance", value: 8200, color: "#6366f1" },
    { label: "Seasonality", value: -3400 },
    { label: "New Market", value: 12800, color: "#6366f1" },
    { label: "Refunds", value: -2100 },
    { label: "Q1 Actual", value: 0, type: "total" },
  ]}
  title="Q1 Revenue Bridge"
  format="currency"
  positiveColor="#10b981"
  negativeColor="#f43f5e"
  totalColor="#8b5cf6"
  height={320}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Waterfall
              data={customColorData}
              title="Q1 Revenue Bridge"
              format="currency"
              positiveColor="#10b981"
              negativeColor="#f43f5e"
              totalColor="#8b5cf6"
              height={320}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Without Connectors */}
      <DocSection id="no-connectors" title="Without Connectors">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">connectors=&#123;false&#125;</code> to
          hide the dashed connector lines between bars for a cleaner look.
        </p>
        <ComponentExample
          code={`<Waterfall
  data={[
    { label: "Budget", value: 200000 },
    { label: "Personnel", value: -82000 },
    { label: "Equipment", value: -34000 },
    { label: "Software", value: -21000 },
    { label: "Travel", value: -8500 },
    { label: "Remaining", value: 0, type: "total" },
  ]}
  title="Budget Allocation"
  format="currency"
  connectors={false}
  height={320}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Waterfall
              data={budgetData}
              title="Budget Allocation"
              format="currency"
              connectors={false}
              height={320}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Quarterly Changes */}
      <DocSection id="quarterly-changes" title="Quarterly Changes">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Show how periodic changes contribute to a final total. Each bar represents
          the delta for that period, and the total bar shows the cumulative result.
        </p>
        <ComponentExample
          code={`<Waterfall
  data={[
    { label: "Q1", value: 120000 },
    { label: "Q2", value: 45000 },
    { label: "Q3", value: -30000 },
    { label: "Q4", value: 65000 },
    { label: "FY Total", type: "total" },
  ]}
  title="Quarterly Revenue"
  format="currency"
  connectors
  height={320}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Waterfall
              data={quarterlyData}
              title="Quarterly Revenue"
              format="currency"
              connectors
              height={320}
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
            <Waterfall
              data={[]}
              title="Revenue Bridge"
              loading
              height={280}
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
            <Waterfall
              data={[]}
              title="Revenue Bridge"
              error={{ message: "Failed to load data" }}
              height={280}
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state
<Waterfall data={[]} title="Revenue Bridge" loading />

// Error state
<Waterfall data={[]} title="Revenue Bridge" error={{ message: "Failed to load" }} />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
