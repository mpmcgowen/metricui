"use client";

import { useState } from "react";
import { FilterTags } from "@/components/filters/FilterTags";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("filter-tags")!;

const tocItems: TocItem[] = [
  { id: "full-filter-setup", title: "Full Filter Setup", level: 2 },
  { id: "interactive", title: "Interactive Controls", level: 2 },
  { id: "custom-labels", title: "Custom Labels", level: 2 },
  { id: "exclude", title: "Exclude Fields", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
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
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

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

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
