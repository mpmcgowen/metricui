"use client";

import { Dashboard } from "@/components/layout/Dashboard";
import { KpiCard } from "@/components/cards/KpiCard";
import { BarChart } from "@/components/charts/BarChart";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import type { PropDef } from "@/lib/docs/component-data";

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

// ---------------------------------------------------------------------------
// Props definitions (manual — Dashboard has no component-data entry yet)
// ---------------------------------------------------------------------------

const dashboardProps: PropDef[] = [
  { name: "children", type: "ReactNode", required: true, description: "Dashboard content. All MetricUI hooks are available inside." },
  { name: "theme", type: "string | ThemePreset", required: false, description: "Theme preset name or custom ThemePreset object." },
  { name: "colorScheme", type: '"light" | "dark" | "auto"', required: false, default: '"auto"', description: 'Color scheme. "auto" detects system preference.' },
  { name: "variant", type: "CardVariant", required: false, default: '"default"', description: "Default card variant applied to all cards." },
  { name: "locale", type: "string", required: false, default: '"en-US"', description: "BCP 47 locale string for number/date formatting." },
  { name: "currency", type: "string", required: false, default: '"USD"', description: "ISO 4217 currency code." },
  { name: "animate", type: "boolean", required: false, default: "true", description: "Global animation toggle. Set false to disable all transitions." },
  { name: "motionConfig", type: "MotionConfig", required: false, description: "Spring physics config for animations." },
  { name: "colors", type: "string[]", required: false, description: "Default series color palette for charts." },
  { name: "nullDisplay", type: '"dash" | "zero" | "blank" | "na"', required: false, default: '"dash"', description: "How null values display in cards and tables." },
  { name: "chartNullMode", type: '"gap" | "zero" | "connect"', required: false, default: '"gap"', description: "How charts handle null data points." },
  { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout toggle. Reduces padding across all components." },
  { name: "emptyState", type: "{ message?: string; icon?: ReactNode }", required: false, description: "Default empty state template shown when data is empty." },
  { name: "errorState", type: "{ message?: string }", required: false, description: "Default error state template." },
  { name: "loading", type: "boolean", required: false, default: "false", description: "Global loading toggle. Shows skeletons on all components." },
  { name: "texture", type: "boolean", required: false, default: "true", description: "Noise texture overlay on cards." },
  { name: "exportable", type: "boolean", required: false, default: "false", description: "Global export toggle. Enables export buttons on all components." },
  { name: "tooltipHint", type: "boolean", required: false, default: "true", description: "Show action hints in chart tooltips." },
  { name: "filters", type: "{ defaultPreset?, defaultComparison?, referenceDate? }", required: false, description: "Filter configuration object. Omit to skip FilterProvider entirely." },
  { name: "filters.defaultPreset", type: "PeriodPreset", required: false, description: "Initial period preset (e.g. \"7d\", \"30d\", \"90d\")." },
  { name: "filters.defaultComparison", type: "ComparisonMode", required: false, default: '"none"', description: "Initial comparison mode." },
  { name: "filters.referenceDate", type: "Date", required: false, default: "now", description: "Reference date for preset calculations." },
  { name: "maxDrillDepth", type: "number", required: false, default: "4", description: "Max drill-down nesting depth." },
  { name: "renderContent", type: "(ctx: DrillDownContext) => ReactNode", required: false, description: "Render function for reactive drill-down overlay content." },
];

// ---------------------------------------------------------------------------
// Related components
// ---------------------------------------------------------------------------

const relatedComponents = [
  { name: "MetricProvider", href: "/docs/metric-provider" },
  { name: "FilterProvider", href: "/docs/filter-bar" },
  { name: "CrossFilterProvider", href: "/docs/drill-down" },
  { name: "LinkedHoverProvider", href: "/docs/line-chart" },
  { name: "DrillDown.Root", href: "/docs/drill-down" },
];

export default function DashboardDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Layout
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
            All-in-one dashboard wrapper that replaces the 5-provider nesting
            pattern. One component sets up MetricProvider, FilterProvider,
            CrossFilterProvider, LinkedHoverProvider, and DrillDown.Root — every
            prop is optional, every hook works inside.
          </p>
        </div>

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
                to DrillDown.Overlay, but if you need the overlay placed elsewhere
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

        {/* Props */}
        <DocSection id="props" title="Props">
          <PropsTable props={dashboardProps} />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "Dashboard replaces the 5-provider nesting pattern: MetricProvider, FilterProvider, CrossFilterProvider, LinkedHoverProvider, and DrillDown.Root.",
              "Every prop is optional. A bare <Dashboard> still sets up all providers with sensible defaults.",
              "All hooks work inside: useMetricFilters(), useCrossFilter(), useLinkedHover(), useDrillDownAction(), useMetricConfig().",
              "Omit the filters prop to skip FilterProvider entirely — useful when you don't need date range filtering.",
              "For fine-grained control (multiple FilterProviders, custom overlay placement), compose the individual providers directly.",
              "The DrillDown.Overlay is rendered automatically inside Dashboard. Use renderContent to customize what appears when a drill-down opens.",
            ].map((note, i) => (
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

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <div className="flex flex-wrap gap-2">
            {relatedComponents.map((comp) => (
              <a
                key={comp.name}
                href={comp.href}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--accent)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
              >
                {comp.name}
              </a>
            ))}
          </div>
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
