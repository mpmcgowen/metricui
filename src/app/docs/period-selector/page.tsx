"use client";

import { useState } from "react";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { FilterProvider, useMetricFilters, PRESET_LABELS } from "@/lib/FilterContext";
import type { PeriodPreset, ComparisonMode, DateRange } from "@/lib/FilterContext";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "presets", title: "Custom Presets", level: 2 },
  { id: "custom-range", title: "Custom Range", level: 2 },
  { id: "comparison", title: "Comparison Toggle", level: 2 },
  { id: "dense", title: "Dense Mode", level: 2 },
  { id: "connected", title: "Connected (FilterProvider)", level: 2 },
  { id: "standalone", title: "Standalone (onChange)", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Connected example — shows FilterProvider + useMetricFilters
// ---------------------------------------------------------------------------

function ConnectedInner() {
  const filters = useMetricFilters();
  return (
    <div className="w-full max-w-xl space-y-4">
      <PeriodSelector comparison />
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          useMetricFilters() output
        </p>
        <p>
          <span className="text-[var(--foreground)]">preset:</span>{" "}
          {filters?.preset ? `"${filters.preset}"` : "null"}
        </p>
        <p>
          <span className="text-[var(--foreground)]">period.start:</span>{" "}
          {filters?.period ? filters.period.start.toLocaleDateString() : "null"}
        </p>
        <p>
          <span className="text-[var(--foreground)]">period.end:</span>{" "}
          {filters?.period ? filters.period.end.toLocaleDateString() : "null"}
        </p>
        <p>
          <span className="text-[var(--foreground)]">comparisonMode:</span>{" "}
          {`"${filters?.comparisonMode ?? "none"}"`}
        </p>
        {filters?.comparisonPeriod && (
          <p>
            <span className="text-[var(--foreground)]">comparisonPeriod:</span>{" "}
            {filters.comparisonPeriod.start.toLocaleDateString()} – {filters.comparisonPeriod.end.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Standalone example — fires onChange
// ---------------------------------------------------------------------------

function StandaloneExample() {
  const [log, setLog] = useState<string>("No selection yet");

  const handleChange = (period: DateRange, preset: PeriodPreset | null) => {
    if (preset) {
      setLog(`Preset: "${preset}" (${PRESET_LABELS[preset]})\nStart: ${period.start.toLocaleDateString()}\nEnd: ${period.end.toLocaleDateString()}`);
    } else {
      setLog(`Custom range\nStart: ${period.start.toLocaleDateString()}\nEnd: ${period.end.toLocaleDateString()}`);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <PeriodSelector onChange={handleChange} />
      <pre className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)] whitespace-pre-wrap">
        {log}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PeriodSelectorDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      {/* Hero — manual since PeriodSelector isn't in getComponent() yet */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Filters
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          PeriodSelector
        </h1>
        <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
          A date-range picker with preset periods, custom ranges, and comparison mode.
        </p>
      </div>

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use PeriodSelector to let users choose a time window for their dashboard.
        It&apos;s <strong>pure UI</strong> — it captures the user&apos;s selection and exposes it
        via context, but never touches, fetches, or filters your data. You read the
        active period and pass it to your own data-fetching logic. See the{" "}
        <a href="/docs/guides/filtering" className="font-medium text-[var(--accent)] hover:underline">
          Filtering guide
        </a>{" "}
        for the full architecture.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<FilterProvider>
  <PeriodSelector />
</FilterProvider>`}
        >
          <div className="w-full max-w-xl">
            <FilterProvider>
              <PeriodSelector />
            </FilterProvider>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Presets */}
      <DocSection id="presets" title="Custom Presets">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">presets</code> array
          to control which time periods appear. Available presets:{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">7d, 14d, 30d, 90d, month, quarter, ytd, year, all</code>.
        </p>
        <ComponentExample
          code={`<PeriodSelector presets={["7d", "14d", "30d", "90d", "year", "all"]} />`}
        >
          <div className="w-full max-w-xl">
            <FilterProvider>
              <PeriodSelector presets={["7d", "14d", "30d", "90d", "year", "all"]} />
            </FilterProvider>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Range */}
      <DocSection id="custom-range" title="Custom Range">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          By default, a &quot;Custom range&quot; option appears below the presets with date inputs.
          Disable it with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">allowCustom=&#123;false&#125;</code>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">With custom range (default)</p>
            <FilterProvider>
              <PeriodSelector presets={["7d", "30d"]} />
            </FilterProvider>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Without custom range</p>
            <FilterProvider>
              <PeriodSelector presets={["7d", "30d"]} allowCustom={false} />
            </FilterProvider>
          </div>
        </div>
        <CodeBlock
          code={`// With custom range (default)
<PeriodSelector allowCustom />

// Without custom range
<PeriodSelector allowCustom={false} />`}
          className="mt-4"
        />
      </DocSection>

      {/* Comparison Toggle */}
      <DocSection id="comparison" title="Comparison Toggle">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">comparison</code> to
          show a toggle button that cycles through comparison modes:{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">none → previous → year-over-year → none</code>.
          The comparison period is auto-computed from the active period.
        </p>
        <ComponentExample
          code={`<FilterProvider defaultPreset="30d">
  <PeriodSelector comparison />
</FilterProvider>`}
        >
          <div className="w-full max-w-xl">
            <FilterProvider defaultPreset="30d">
              <PeriodSelector comparison />
            </FilterProvider>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Dense Mode */}
      <DocSection id="dense" title="Dense Mode">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dense</code> prop
          reduces padding and font sizes. Also inherits from <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">MetricProvider</code>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Normal</p>
            <FilterProvider defaultPreset="30d">
              <PeriodSelector comparison />
            </FilterProvider>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Dense</p>
            <FilterProvider defaultPreset="30d">
              <PeriodSelector comparison dense />
            </FilterProvider>
          </div>
        </div>
        <CodeBlock
          code={`<PeriodSelector dense />
// or via MetricProvider
<MetricProvider dense>
  <PeriodSelector /> {/* inherits dense */}
</MetricProvider>`}
          className="mt-4"
        />
      </DocSection>

      {/* Connected (FilterProvider) */}
      <DocSection id="connected" title="Connected (FilterProvider)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Wrap your dashboard in a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterProvider</code>.
          Any component can then call <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useMetricFilters()</code> to
          read the active period, comparison mode, and dimension filters. Select a preset below to see
          the context values update live.
        </p>
        <ComponentExample
          code={`import { FilterProvider, useMetricFilters } from "metricui";
import { PeriodSelector } from "metricui";

function Dashboard() {
  return (
    <FilterProvider defaultPreset="30d">
      <PeriodSelector comparison />
      <MyChart />
    </FilterProvider>
  );
}

function MyChart() {
  const filters = useMetricFilters();
  // filters.period  → { start: Date, end: Date }
  // filters.preset  → "30d" | null
  // filters.comparisonMode → "none" | "previous" | "year-over-year"
  // filters.comparisonPeriod → { start: Date, end: Date } | null
  // Use these to fetch/filter your data
  return <div>...</div>;
}`}
        >
          <FilterProvider>
            <ConnectedInner />
          </FilterProvider>
        </ComponentExample>
      </DocSection>

      {/* Standalone (onChange) */}
      <DocSection id="standalone" title="Standalone (onChange)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> without
          a FilterProvider for simple use cases where you just need the selected dates.
        </p>
        <ComponentExample
          code={`<PeriodSelector
  onChange={(period, preset) => {
    console.log(period.start, period.end, preset);
    // Fetch data for this range
  }}
/>`}
        >
          <StandaloneExample />
        </ComponentExample>
      </DocSection>

      {/* Props Table */}
      <DocSection id="props" title="Props">
        <DataTable
          data={[
            { prop: "presets", type: "PeriodPreset[]", default: '["7d","30d","90d","month","quarter","ytd"]', description: "Which preset periods to show in the dropdown." },
            { prop: "allowCustom", type: "boolean", default: "true", description: "Show the custom date-range inputs." },
            { prop: "comparison", type: "boolean", default: "false", description: "Show the comparison toggle button." },
            { prop: "comparisonOptions", type: "ComparisonMode[]", default: '["previous","year-over-year"]', description: "Which comparison modes to cycle through." },
            { prop: "onChange", type: "(period, preset) => void", default: "\u2014", description: "Standalone callback. Fires when a period is selected." },
            { prop: "onComparisonChange", type: "(mode, period) => void", default: "\u2014", description: "Standalone callback for comparison mode changes." },
            { prop: "dense", type: "boolean", default: "false", description: "Compact mode. Falls back to MetricProvider." },
            { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes." },
            { prop: "id", type: "string", default: "\u2014", description: "HTML id." },
            { prop: "data-testid", type: "string", default: "\u2014", description: "Test id." },
          ]}
          columns={[
            { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
            { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
            { key: "default", header: "Default", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
            { key: "description", header: "Description" },
          ]}
          dense
          variant="ghost"
        />
      </DocSection>

      {/* Notes */}
      <DocSection id="notes" title="Notes">
        <ul className="space-y-2">
          {[
            "PeriodSelector is UI only \u2014 it tells you what the user selected, but it does not filter your data. You bring the data; the filter tells you what range to fetch.",
            "Without a FilterProvider, PeriodSelector still works via onChange. Context is optional.",
            "Comparison periods are auto-computed. \"previous\" shifts the range backward by its own duration. \"year-over-year\" shifts it back one year.",
            "PeriodSelector uses forwardRef and passes through id, data-testid, and className.",
            "Dense mode can be set per-component or inherited from MetricProvider.",
            "The dropdown closes on outside click and on preset selection.",
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

      {/* Related */}
      <DocSection id="related" title="Related">
        <ul className="space-y-2">
          {[
            { name: "FilterProvider", desc: "Context provider that holds the active filter state. Wrap your dashboard in this." },
            { name: "useMetricFilters()", desc: "Hook to read the active period, comparison, and dimension filters from the nearest FilterProvider." },
            { name: "KpiCard", desc: "Reads the active period to show comparison data." },
            { name: "MetricProvider", desc: "Global config. PeriodSelector inherits dense mode from here." },
          ].map((item) => (
            <li key={item.name} className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>
                <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">{item.name}</code>
                {" \u2014 "}{item.desc}
              </span>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPageLayout>
  );
}
