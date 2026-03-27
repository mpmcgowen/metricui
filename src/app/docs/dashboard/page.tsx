"use client";

import { Dashboard } from "@/components/layout/Dashboard";
import { KpiCard } from "@/components/cards/KpiCard";
import { BarChart } from "@/components/charts/BarChart";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("dashboard")!;

const tocItems: TocItem[] = [
  { id: "before-after", title: "Before & After", level: 2 },
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "with-filters", title: "With Filters", level: 2 },
  { id: "full-featured", title: "Full Featured", level: 2 },
  { id: "individual-providers", title: "Individual Providers", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const revenueData = [
  { month: "Jan", revenue: 38200 },
  { month: "Feb", revenue: 42100 },
  { month: "Mar", revenue: 45800 },
  { month: "Apr", revenue: 51200 },
  { month: "May", revenue: 48900 },
  { month: "Jun", revenue: 55400 },
];

export default function DashboardDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Dashboard as the outermost wrapper for any MetricUI dashboard. It replaces
        the 5-provider nesting pattern with a single flat component — every prop is optional,
        every hook works inside. For fine-grained control (e.g., two FilterProviders), compose
        the individual providers directly.
      </p>

      {/* Before & After */}
      <DocSection id="before-after" title="Before & After">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Without <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">Dashboard</code>,
          you need to nest five providers manually. The wrapper collapses all of that into a single component.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Before (5 providers)
            </p>
            <CodeBlock
              code={`<MetricProvider theme="emerald" exportable>
  <FilterProvider defaultPreset="30d">
    <CrossFilterProvider>
      <LinkedHoverProvider>
        <DrillDown.Root>
          <DashboardHeader title="Sales" />
          <MetricGrid>
            <KpiCard title="Revenue" value={142800} format="currency" />
            <BarChart data={data} keys={["revenue"]} indexBy="month" />
          </MetricGrid>
          <DrillDown.Overlay />
        </DrillDown.Root>
      </LinkedHoverProvider>
    </CrossFilterProvider>
  </FilterProvider>
</MetricProvider>`}
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              After (1 wrapper)
            </p>
            <CodeBlock
              code={`<Dashboard theme="emerald" filters={{ defaultPreset: "30d" }} exportable>
  <DashboardHeader title="Sales" />
  <MetricGrid>
    <KpiCard title="Revenue" value={142800} format="currency" />
    <BarChart data={data} keys={["revenue"]} indexBy="month" />
  </MetricGrid>
</Dashboard>`}
            />
          </div>
        </div>
      </DocSection>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The simplest Dashboard — just a theme and some content. Every prop is
          optional; omit{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">filters</code>{" "}
          and FilterProvider is skipped entirely.
        </p>
        <ComponentExample
          code={`<Dashboard theme="emerald">
  <KpiCard title="Revenue" value={142800} format="currency" />
</Dashboard>`}
        >
          <div className="w-full max-w-2xl">
            <Dashboard theme="emerald">
              <KpiCard title="Revenue" value={142800} format="currency" />
            </Dashboard>
          </div>
        </ComponentExample>
      </DocSection>

      {/* With Filters */}
      <DocSection id="with-filters" title="With Filters">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass the{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">filters</code>{" "}
          prop to enable FilterProvider. The{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useMetricFilters()</code>{" "}
          hook and filter components like PeriodSelector become available inside.
        </p>
        <ComponentExample
          code={`<Dashboard
  theme="indigo"
  filters={{ defaultPreset: "30d", defaultComparison: "previous" }}
>
  <KpiCard title="Active Users" value={8420} format="number" />
  <KpiCard title="Conversion Rate" value={0.034} format="percent" />
</Dashboard>`}
        >
          <div className="w-full max-w-2xl">
            <Dashboard
              theme="indigo"
              filters={{ defaultPreset: "30d", defaultComparison: "previous" }}
            >
              <MetricGrid>
                <KpiCard title="Active Users" value={8420} format="number" />
                <KpiCard title="Conversion Rate" value={0.034} format="percent" />
              </MetricGrid>
            </Dashboard>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Full Featured */}
      <DocSection id="full-featured" title="Full Featured">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Combine theme, filters, export, dense layout, and multiple component
          types. All MetricUI components inherit the Dashboard configuration
          automatically.
        </p>
        <ComponentExample
          code={`<Dashboard
  theme="rose"
  filters={{ defaultPreset: "30d" }}
  exportable
  dense
>
  <MetricGrid>
    <KpiCard title="Revenue" value={142800} format="currency" />
    <KpiCard title="Orders" value={1284} format="number" />
    <KpiCard title="AOV" value={111.21} format="currency" />
    <BarChart
      data={revenueData}
      keys={["revenue"]}
      indexBy="month"
      title="Monthly Revenue"
      format={{ style: "currency" }}
    />
  </MetricGrid>
</Dashboard>`}
        >
          <div className="w-full max-w-2xl">
            <Dashboard
              theme="rose"
              filters={{ defaultPreset: "30d" }}
              exportable
              dense
            >
              <MetricGrid>
                <KpiCard title="Revenue" value={142800} format="currency" />
                <KpiCard title="Orders" value={1284} format="number" />
                <KpiCard title="AOV" value={111.21} format="currency" />
                <BarChart
                  data={revenueData}
                  keys={["revenue"]}
                  indexBy="month"
                  title="Monthly Revenue"
                  format={{ style: "currency" }}
                  height={280}
                />
              </MetricGrid>
            </Dashboard>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Individual Providers */}
      <DocSection id="individual-providers" title="Individual Providers">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Dashboard covers 90% of use cases, but sometimes you need
          fine-grained control. Use the individual providers when you need:
        </p>
        <ul className="mb-4 space-y-2">
          <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong>Two FilterProviders</strong> — e.g. a main dashboard filter
              and a separate modal with its own date range.
            </span>
          </li>
          <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong>Custom renderContent</strong> — the Dashboard passes{" "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">renderContent</code>{" "}
              to the drill-down overlay panel, but if you need the overlay placed elsewhere
              in the tree, compose manually.
            </span>
          </li>
          <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              <strong>Partial provider stacks</strong> — e.g. MetricProvider +
              LinkedHoverProvider only, without cross-filter or drill-down.
            </span>
          </li>
        </ul>
        <CodeBlock
          code={`// Example: two independent filter scopes
<MetricProvider theme="emerald">
  <FilterProvider defaultPreset="30d">
    <MainDashboard />
  </FilterProvider>

  <FilterProvider defaultPreset="7d">
    <ComparisonPanel />
  </FilterProvider>
</MetricProvider>`}
        />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
