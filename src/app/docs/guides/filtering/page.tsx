"use client";

import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "philosophy", title: "Philosophy", level: 2 },
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "filter-provider", title: "FilterProvider", level: 2 },
  { id: "reading-filters", title: "Reading Filters", level: 2 },
  { id: "wiring-data", title: "Wiring to Your Data", level: 2 },
  { id: "comparisons", title: "Comparison Periods", level: 2 },
  { id: "dimensions", title: "Dimension Filters", level: 2 },
  { id: "without-provider", title: "Without a Provider", level: 2 },
  { id: "cross-filtering", title: "Cross-Filtering", level: 2 },
  { id: "cross-filter-setup", title: "Setup", level: 3 },
  { id: "cross-filter-reading", title: "Reading State", level: 3 },
  { id: "cross-filter-behavior", title: "Behavior", level: 3 },
];

export default function FilteringGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">Filtering</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          MetricUI filter components are pure UI. They capture what the user selected —
          a date range, a comparison mode, a dimension value — and expose it via context.
          They never touch, fetch, or transform your data.
        </p>

        <DocSection id="philosophy" title="Philosophy">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Most dashboard frameworks try to own your data pipeline — fetching, caching,
            filtering, and re-rendering. MetricUI doesn&apos;t. Your data comes from your API,
            your database, your state management. MetricUI&apos;s job is to:
          </p>
          <ol className="mt-4 space-y-2">
            {[
              "Give users a clean UI to select filters (period, comparison, dimensions)",
              "Store those selections in a React context",
              "Let you read the selections and pass them to your own data-fetching logic",
              "Render whatever data you give it",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-[var(--muted)]">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[11px] font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This means MetricUI works with any backend, any data layer, any state manager.
            REST, GraphQL, tRPC, Supabase, raw SQL — doesn&apos;t matter. The filter components
            are a UI layer, not a data layer.
          </p>
        </DocSection>

        <DocSection id="architecture" title="Architecture">
          <CodeBlock
            code={`FilterProvider          ← Holds filter state (period, comparison, dimensions)
  ├── PeriodSelector    ← UI: user picks a date range
  ├── YourDashboard     ← Reads filters via useMetricFilters()
  │   ├── KpiCard       ← You pass data based on the active period
  │   ├── AreaChart     ← You pass data based on the active period
  │   └── DataTable     ← You pass data based on the active period
  └── (future filters)  ← Dimension filters, search, etc.`}
            language="text"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The arrow of data flows one way: <strong>user selects → context updates → you
            fetch → components render</strong>. MetricUI never fetches for you.
          </p>
        </DocSection>

        <DocSection id="filter-provider" title="FilterProvider">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Wrap your dashboard in a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterProvider</code> to
            enable filter state. It&apos;s separate from <code className="font-[family-name:var(--font-mono)] text-[13px]">MetricProvider</code> —
            MetricProvider handles theming/formatting, FilterProvider handles filter state.
          </p>
          <CodeBlock
            code={`import { MetricProvider, FilterProvider, PeriodSelector } from "metricui";

function App() {
  return (
    <MetricProvider theme="indigo">
      <FilterProvider defaultPreset="30d">
        <PeriodSelector comparison />
        <Dashboard />
      </FilterProvider>
    </MetricProvider>
  );
}`}
          />
          <DataTable
            data={[
              { prop: "defaultPreset", type: "PeriodPreset", description: 'Initial period preset (e.g. "30d", "quarter", "ytd")' },
              { prop: "children", type: "ReactNode", description: "Your dashboard content" },
            ]}
            columns={[
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        <DocSection id="reading-filters" title="Reading Filters">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Call <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useMetricFilters()</code> from
            any component inside a FilterProvider to read the current filter state.
          </p>
          <CodeBlock
            code={`import { useMetricFilters } from "metricui";

function Dashboard() {
  const filters = useMetricFilters();

  // filters.period          → { start: Date, end: Date } | null
  // filters.preset          → "30d" | "quarter" | null (null = custom range)
  // filters.comparisonMode  → "none" | "previous" | "year-over-year"
  // filters.comparisonPeriod → { start: Date, end: Date } | null
  // filters.dimensions      → Record<string, string[]>

  // Actions:
  // filters.setPeriod(range, preset?)
  // filters.setPreset("7d")
  // filters.setCustomRange(startDate, endDate)
  // filters.setComparisonMode("previous")
  // filters.setDimension("region", ["US", "EU"])
  // filters.clearDimension("region")
  // filters.clearAll()
}`}
          />
        </DocSection>

        <DocSection id="wiring-data" title="Wiring to Your Data">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is where you connect MetricUI filters to your data layer. Read the active
            period from the context, pass it to your fetch, render the result:
          </p>
          <CodeBlock
            code={`import { useMetricFilters, KpiCard, AreaChart } from "metricui";
import useSWR from "swr"; // or React Query, or fetch, or anything

function Dashboard() {
  const filters = useMetricFilters();
  const period = filters?.period;

  // Your data fetching — MetricUI doesn't care how you do it
  const { data, isLoading, error } = useSWR(
    period ? \`/api/metrics?start=\${period.start.toISOString()}&end=\${period.end.toISOString()}\` : null
  );

  return (
    <>
      <KpiCard
        title="Revenue"
        value={data?.revenue ?? 0}
        format="currency"
        loading={isLoading}
        error={error ? { message: error.message } : undefined}
      />
      <AreaChart
        data={data?.revenueOverTime ?? []}
        title="Revenue Over Time"
        format="currency"
        loading={isLoading}
      />
    </>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Notice: MetricUI components receive <em>the result</em> of your fetch. They don&apos;t
            know about your API, your database, or your caching strategy. The filter context
            is just a React state that tells you what the user wants to see.
          </p>
        </DocSection>

        <DocSection id="comparisons" title="Comparison Periods">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            When the user enables comparison mode (via PeriodSelector&apos;s comparison toggle),
            the context auto-computes a comparison period:
          </p>
          <DataTable
            data={[
              { mode: "previous", logic: "Shifts the range backward by its own duration", example: "Last 30d → the 30 days before that" },
              { mode: "year-over-year", logic: "Shifts the range back one year", example: "Mar 1-31, 2026 → Mar 1-31, 2025" },
              { mode: "none", logic: "No comparison", example: "—" },
            ]}
            columns={[
              { key: "mode", header: "Mode", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
              { key: "logic", header: "Logic" },
              { key: "example", header: "Example" },
            ]}
            dense
            variant="ghost"
          />
          <CodeBlock
            code={`const filters = useMetricFilters();

if (filters?.comparisonPeriod) {
  // Fetch comparison data too
  const compData = await fetch(
    \`/api/metrics?start=\${filters.comparisonPeriod.start.toISOString()}&end=\${filters.comparisonPeriod.end.toISOString()}\`
  );
}`}
            className="mt-4"
          />
        </DocSection>

        <DocSection id="dimensions" title="Dimension Filters">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            FilterProvider also holds dimension filters (region, plan, status, etc.) as a
            key-value map. Set them programmatically — UI components for dimension filtering
            are coming soon.
          </p>
          <CodeBlock
            code={`const filters = useMetricFilters();

// Set a dimension filter
filters?.setDimension("region", ["US", "EU"]);

// Read it
filters?.dimensions.region  // → ["US", "EU"]

// Clear it
filters?.clearDimension("region");

// Clear everything
filters?.clearAll();`}
          />
        </DocSection>

        <DocSection id="without-provider" title="Without a Provider">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            FilterProvider is optional. PeriodSelector works standalone with an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> callback
            for simple cases where you don&apos;t need shared context:
          </p>
          <CodeBlock
            code={`<PeriodSelector
  onChange={(period, preset) => {
    // period.start, period.end — use these to fetch
  }}
/>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use FilterProvider when multiple components need to read the same filter state.
            Use onChange when you just need a date picker in one spot.
          </p>
        </DocSection>

        {/* ── Cross-Filtering ────────────────────────────────────────── */}

        <DocSection id="cross-filtering" title="Cross-Filtering">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Cross-filtering captures click selections from charts and tables into a shared
            context. When a user clicks &ldquo;Chrome&rdquo; in a bar chart, the selection is
            stored — your code reads it, filters your data, and the charts re-render with
            the filtered data. Same philosophy as FilterProvider: MetricUI handles the signal,
            you handle the data.
          </p>
        </DocSection>

        <DocSection id="cross-filter-setup" title="Setup" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Three pieces: a provider, the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">crossFilter</code> prop
            on clickable components, and your data filtering logic:
          </p>
          <CodeBlock
            code={`import {
  CrossFilterProvider,
  useCrossFilteredData,
  BarChart,
  DonutChart,
} from "metricui";

function App() {
  return (
    <CrossFilterProvider>
      <Dashboard />
    </CrossFilterProvider>
  );
}

function Dashboard() {
  // One line — filters data when a selection is active
  const chartData = useCrossFilteredData(allData, "browser");

  return (
    <>
      {/* Source chart: keeps full data so user sees what they clicked */}
      <BarChart
        data={allData}
        index="browser"
        categories={["visitors"]}
        crossFilter
      />
      {/* Sibling charts: get filtered data */}
      <DonutChart
        data={chartData}
        index="browser"
        categories={["revenue"]}
        crossFilter
      />
    </>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">crossFilter</code> prop
            tells a component to call <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">crossFilter.select()</code> when
            clicked. <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useCrossFilteredData</code> reads
            the selection and returns filtered data — one line per chart. For advanced
            multi-filter scenarios, use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useCrossFilter()</code> directly.
          </p>
        </DocSection>

        <DocSection id="cross-filter-reading" title="Reading Cross-Filter State" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useCrossFilter()</code> from
            any component inside a CrossFilterProvider:
          </p>
          <CodeBlock
            code={`import { useCrossFilter } from "metricui";

function Dashboard() {
  const cf = useCrossFilter();

  // cf.isActive        → true when something is selected
  // cf.selection.field → "browser"
  // cf.selection.value → "Chrome"
  // cf.clear()         → deselect
  // cf.select(...)     → programmatic selection
}`}
          />
          <DataTable
            data={[
              { prop: "selection", type: "{ field, value } | null", description: "Current selection or null" },
              { prop: "isActive", type: "boolean", description: "True when a selection is active" },
              { prop: "select(sel)", type: "(sel) => void", description: "Set or toggle a selection" },
              { prop: "clear()", type: "() => void", description: "Clear the current selection" },
            ]}
            columns={[
              { key: "prop", header: "Property", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        <DocSection id="cross-filter-behavior" title="Behavior" level={3}>
          <div className="space-y-3">
            {[
              { label: "Toggle", desc: "Clicking the same value again deselects it" },
              { label: "Escape key", desc: "Press Escape to clear the selection from anywhere" },
              { label: "Signal only", desc: "The crossFilter prop only emits clicks into context — it never changes the chart's data or appearance" },
              { label: "No provider", desc: "Without a CrossFilterProvider, the crossFilter prop is silently ignored — safe to leave on" },
              { label: "Stable colors", desc: "DonutChart remembers color assignments — filtering won't change a slice's color" },
              { label: "Drill-down priority", desc: "When both drillDown and crossFilter are set on the same component, drillDown wins. The click opens the drill panel instead of emitting a cross-filter signal" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 text-[14px] leading-relaxed text-[var(--muted)]">
                <span className="mt-0.5 flex-shrink-0 font-semibold text-[var(--foreground)]">{item.label}:</span>
                {item.desc}
              </div>
            ))}
          </div>
        </DocSection>
      </div>

      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
