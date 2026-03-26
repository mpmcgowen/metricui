"use client";

import { useState } from "react";
import { FilterTags } from "@/components/filters/FilterTags";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "full-filter-setup", title: "Full Filter Setup", level: 2 },
  { id: "interactive", title: "Interactive Controls", level: 2 },
  { id: "custom-labels", title: "Custom Labels", level: 2 },
  { id: "exclude", title: "Exclude Fields", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Region & plan options
// ---------------------------------------------------------------------------

const regionOptions = [
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
  { value: "apac", label: "APAC" },
  { value: "latam", label: "LATAM" },
];

const planOptions = [
  { value: "free", label: "Free" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

// ---------------------------------------------------------------------------
// Full Filter Setup — live demo
// ---------------------------------------------------------------------------

function FullFilterSetup() {
  return (
    <FilterProvider defaultPreset="30d">
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <PeriodSelector presets={["7d", "30d", "90d"]} comparison />
          <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
          <DropdownFilter label="Region" options={regionOptions} field="region" multiple showAll />
          <DropdownFilter label="Plan" options={planOptions} field="plan" multiple showAll />
        </div>
        <FilterTags />
        <FilterStateDisplay />
      </div>
    </FilterProvider>
  );
}

function FilterStateDisplay() {
  const filters = useMetricFilters();
  const dims = filters?.dimensions ?? {};
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        Active filter state
      </p>
      <p>
        <span className="text-[var(--foreground)]">preset:</span>{" "}
        {filters?.preset ?? "none"}
      </p>
      <p>
        <span className="text-[var(--foreground)]">comparison:</span>{" "}
        {filters?.comparisonMode ?? "none"}
      </p>
      <p>
        <span className="text-[var(--foreground)]">dimensions:</span>{" "}
        {Object.keys(dims).length > 0 ? JSON.stringify(dims) : "{}"}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive controls playground
// ---------------------------------------------------------------------------

function InteractivePlayground() {
  const [dismissible, setDismissible] = useState(true);
  const [clearAll, setClearAll] = useState(true);
  const [maxVisible, setMaxVisible] = useState(0);
  const [showPeriod, setShowPeriod] = useState(true);
  const [showComparison, setShowComparison] = useState(true);

  return (
    <FilterProvider defaultPreset="30d" defaultComparison="previous">
      <div className="w-full space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <ToggleControl label="Dismissible" value={dismissible} onChange={setDismissible} />
          <ToggleControl label="Clear All" value={clearAll} onChange={setClearAll} />
          <ToggleControl label="Show Period" value={showPeriod} onChange={setShowPeriod} />
          <ToggleControl label="Show Comparison" value={showComparison} onChange={setShowComparison} />
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-medium text-[var(--muted)]">maxVisible</label>
            <input
              type="range"
              min={0}
              max={5}
              value={maxVisible}
              onChange={(e) => setMaxVisible(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-[11px] font-medium text-[var(--foreground)]">{maxVisible || "all"}</span>
          </div>
        </div>

        {/* Set up some dimensions to see tags */}
        <div className="flex flex-wrap items-center gap-3">
          <DropdownFilter label="Region" options={regionOptions} field="region" multiple showAll dense />
          <DropdownFilter label="Plan" options={planOptions} field="plan" multiple showAll dense />
        </div>

        {/* FilterTags preview */}
        <FilterTags
          dismissible={dismissible}
          clearAll={clearAll}
          maxVisible={maxVisible}
          showPeriod={showPeriod}
          showComparison={showComparison}
        />
      </div>
    </FilterProvider>
  );
}

// ---------------------------------------------------------------------------
// Custom labels example
// ---------------------------------------------------------------------------

function CustomLabelsExample() {
  return (
    <FilterProvider defaultPreset="30d">
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownFilter label="Region" options={regionOptions} field="region" multiple showAll dense />
          <DropdownFilter label="Plan" options={planOptions} field="plan" multiple showAll dense />
        </div>
        <FilterTags labels={{ region: "Market", plan: "Tier" }} />
      </div>
    </FilterProvider>
  );
}

// ---------------------------------------------------------------------------
// Exclude example
// ---------------------------------------------------------------------------

function ExcludeExample() {
  return (
    <FilterProvider defaultPreset="30d">
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownFilter label="Region" options={regionOptions} field="region" multiple showAll dense />
          <DropdownFilter label="Plan" options={planOptions} field="plan" multiple showAll dense />
        </div>
        <FilterTags exclude={["_period", "plan"]} />
        <p className="text-xs text-[var(--muted)]">
          Period and Plan chips are hidden via <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">exclude={`{["_period", "plan"]}`}</code>
        </p>
      </div>
    </FilterProvider>
  );
}

// ---------------------------------------------------------------------------
// Toggle control (reusable)
// ---------------------------------------------------------------------------

function ToggleControl({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] font-medium text-[var(--muted)]">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-4 w-7 rounded-full transition-colors ${value ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${value ? "translate-x-3" : ""}`} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FilterTagsDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Filters
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            FilterTags
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
            Context-driven filter chips that automatically display active filters from FilterProvider.
            Renders removable chips for the active period, comparison mode, and dimension filters.
          </p>
        </div>

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Drop <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">{`<FilterTags />`}</code> anywhere
          inside a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterProvider</code> and it
          automatically shows chips for every active filter. No props required &mdash; it reads from FilterContext.
          Users can dismiss individual filters or clear all at once.
        </p>

        {/* Full Filter Setup */}
        <DocSection id="full-filter-setup" title="Full Filter Setup">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            A complete filter bar with PeriodSelector, SegmentToggle, DropdownFilter, and FilterTags.
            Interact with the controls above &mdash; tags appear and disappear automatically.
          </p>
          <ComponentExample
            code={`import {
  FilterProvider,
  PeriodSelector,
  DropdownFilter,
  SegmentToggle,
  FilterTags,
} from "metricui";

function Dashboard() {
  return (
    <FilterProvider defaultPreset="30d">
      <div className="flex gap-3">
        <PeriodSelector presets={["7d", "30d", "90d"]} comparison />
        <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
        <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
      </div>
      <FilterTags />
      {/* Tags auto-appear when filters are active */}
    </FilterProvider>
  );
}`}
          >
            <FullFilterSetup />
          </ComponentExample>
        </DocSection>

        {/* Interactive Controls */}
        <DocSection id="interactive" title="Interactive Controls">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with dismissible, clearAll, maxVisible, showPeriod, and showComparison toggles.
            Select some regions and plans in the dropdowns to see tags appear.
          </p>
          <InteractivePlayground />
        </DocSection>

        {/* Custom Labels */}
        <DocSection id="custom-labels" title="Custom Labels">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Override the default field-name labels with custom display names using the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">labels</code> prop.
          </p>
          <ComponentExample
            code={`<FilterTags labels={{ region: "Market", plan: "Tier" }} />`}
          >
            <CustomLabelsExample />
          </ComponentExample>
        </DocSection>

        {/* Exclude */}
        <DocSection id="exclude" title="Exclude Fields">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Hide specific tags with the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">exclude</code> prop.
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">&quot;_period&quot;</code> for
            the period tag and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">&quot;_comparison&quot;</code> for
            the comparison tag.
          </p>
          <ComponentExample
            code={`<FilterTags exclude={["_period", "plan"]} />`}
          >
            <ExcludeExample />
          </ComponentExample>
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "exclude", type: "string[]", default: "\u2014", description: "Fields to exclude from display. Use '_period' and '_comparison' for built-in tags." },
              { prop: "include", type: "string[]", default: "\u2014", description: "Whitelist — if set, only these fields show." },
              { prop: "labels", type: "Record<string, string>", default: "\u2014", description: "Custom labels for dimension fields. Default: capitalized field name." },
              { prop: "formatPeriod", type: "(range, preset) => string", default: "preset label or date range", description: "Custom period formatter." },
              { prop: "formatDimension", type: "(field, values) => string", default: 'joins with ", "', description: "Custom dimension value formatter." },
              { prop: "dismissible", type: "boolean", default: "true", description: "Show dismiss buttons on each chip." },
              { prop: "clearAll", type: "boolean", default: "true", description: "Show 'Clear all' button when multiple filters active." },
              { prop: "clearAllLabel", type: "string", default: '"Clear all"', description: "Label for the clear all button." },
              { prop: "onClear", type: "(field: string) => void", default: "\u2014", description: "Callback when a specific filter is cleared." },
              { prop: "onClearAll", type: "() => void", default: "\u2014", description: "Callback when all filters are cleared." },
              { prop: "maxVisible", type: "number", default: "0 (no limit)", description: "Max visible chips before collapsing. Shows '+N more' button." },
              { prop: "showPeriod", type: "boolean", default: "true", description: "Show the period filter as a tag." },
              { prop: "showComparison", type: "boolean", default: "true", description: "Show the comparison mode as a tag." },
              { prop: "dense", type: "boolean", default: "false", description: "Compact mode. Falls back to MetricProvider." },
              { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes." },
              { prop: "classNames", type: "{ root?, chip?, clearAll? }", default: "\u2014", description: "Sub-element class overrides." },
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
              "FilterTags reads from FilterContext automatically \u2014 no manual wiring needed. Just place it inside a FilterProvider.",
              "It renders nothing when no filters are active. No empty state to worry about.",
              "Period and comparison tags use special keys '_period' and '_comparison' for exclude/include.",
              "Dismiss buttons call clearDimension() / setPeriod() / setComparisonMode() on the FilterContext.",
              "Clear all calls filterContext.clearAll() which resets to the FilterProvider defaults.",
              "maxVisible collapses overflow into a '+N more' button that expands when clicked.",
              "Dense mode can be set per-component or inherited from MetricProvider.",
              "FilterTags uses forwardRef and passes through id, data-testid, className, and classNames.",
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
              { name: "PeriodSelector", desc: "Date-range picker with presets and comparison toggle." },
              { name: "DropdownFilter", desc: "Single or multi-select dropdown for dimension filtering." },
              { name: "SegmentToggle", desc: "Pill-style toggle for switching between segments." },
              { name: "useMetricFilters()", desc: "Hook to read the active period, comparison, and dimension filters." },
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
