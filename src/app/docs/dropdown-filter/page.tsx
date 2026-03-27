"use client";

import { useState } from "react";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import type { DropdownOption } from "@/components/filters/DropdownFilter";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("dropdown-filter")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "multi-select", title: "Multi-Select", level: 2 },
  { id: "searchable", title: "Searchable", level: 2 },
  { id: "grouped", title: "Grouped Options", level: 2 },
  { id: "connected", title: "Connected (FilterProvider)", level: 2 },
  { id: "interactive", title: "Interactive Controls", level: 2 },
  { id: "standalone", title: "Standalone (onChange)", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Region options
// ---------------------------------------------------------------------------

const regionOptions: DropdownOption[] = [
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
  { value: "apac", label: "APAC" },
  { value: "latam", label: "LATAM" },
];

// ---------------------------------------------------------------------------
// Plan options with counts
// ---------------------------------------------------------------------------

const planOptions: DropdownOption[] = [
  { value: "free", label: "Free", count: 8421 },
  { value: "starter", label: "Starter", count: 2156 },
  { value: "pro", label: "Pro", count: 1089 },
  { value: "enterprise", label: "Enterprise", count: 312 },
];

// ---------------------------------------------------------------------------
// 20+ searchable options
// ---------------------------------------------------------------------------

const countryOptions: DropdownOption[] = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "pl", label: "Poland" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "au", label: "Australia" },
  { value: "nz", label: "New Zealand" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "ca", label: "Canada" },
  { value: "ar", label: "Argentina" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
];

// ---------------------------------------------------------------------------
// Grouped options
// ---------------------------------------------------------------------------

const groupedRegions: DropdownOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "mx", label: "Mexico", group: "Americas" },
  { value: "br", label: "Brazil", group: "Americas" },
  { value: "gb", label: "United Kingdom", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "es", label: "Spain", group: "Europe" },
  { value: "jp", label: "Japan", group: "Asia-Pacific" },
  { value: "kr", label: "South Korea", group: "Asia-Pacific" },
  { value: "au", label: "Australia", group: "Asia-Pacific" },
  { value: "in", label: "India", group: "Asia-Pacific" },
];

// ---------------------------------------------------------------------------
// Connected example — shows FilterProvider + useMetricFilters
// ---------------------------------------------------------------------------

function ConnectedInner() {
  const filters = useMetricFilters();
  const regionValues = filters?.dimensions?.["region"] ?? [];
  return (
    <div className="w-full max-w-xl space-y-4">
      <DropdownFilter
        label="Region"
        options={regionOptions}
        field="region"
        multiple
        showAll
      />
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          useMetricFilters() output
        </p>
        <p>
          <span className="text-[var(--foreground)]">dimensions.region:</span>{" "}
          {regionValues.length > 0 ? `["${regionValues.join('", "')}"]` : "[]"}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Standalone example
// ---------------------------------------------------------------------------

function StandaloneExample() {
  const [log, setLog] = useState<string>("No selection yet");

  return (
    <div className="w-full max-w-xl space-y-4">
      <DropdownFilter
        label="Region"
        options={regionOptions}
        onChange={(value) => {
          setLog(`Selected: ${JSON.stringify(value)}`);
        }}
      />
      <pre className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)] whitespace-pre-wrap">
        {log}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive playground
// ---------------------------------------------------------------------------

function InteractivePlayground() {
  const [multiple, setMultiple] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [dense, setDense] = useState(false);

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <ToggleControl label="Multiple" value={multiple} onChange={setMultiple} />
        <ToggleControl label="Searchable" value={searchable} onChange={setSearchable} />
        <ToggleControl label="Show All" value={showAll} onChange={setShowAll} />
        <ToggleControl label="Dense" value={dense} onChange={setDense} />
      </div>
      {/* Preview */}
      <DropdownFilter
        label="Region"
        options={regionOptions}
        multiple={multiple}
        searchable={searchable}
        showAll={showAll}
        dense={dense}
      />
    </div>
  );
}

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

export default function DropdownFilterDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use DropdownFilter to let users filter by a dimension — region, plan, status, etc.
        It&apos;s <strong>pure UI</strong> — it captures the user&apos;s selection and exposes it
        via context, but never touches, fetches, or filters your data. You read the
        active selection and pass it to your own data-fetching logic. See the{" "}
        <a href="/docs/guides/filtering" className="font-medium text-[var(--accent)] hover:underline">
          Filtering guide
        </a>{" "}
        for the full architecture.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          A simple single-select dropdown. Click an option to select it — the dropdown closes automatically.
        </p>
        <ComponentExample
          code={`<DropdownFilter
  label="Region"
  options={[
    { value: "us", label: "US" },
    { value: "eu", label: "EU" },
    { value: "apac", label: "APAC" },
    { value: "latam", label: "LATAM" },
  ]}
/>`}
        >
          <DropdownFilter label="Region" options={regionOptions} />
        </ComponentExample>
      </DocSection>

      {/* Multi-Select */}
      <DocSection id="multi-select" title="Multi-Select">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">multiple</code> to
          allow selecting more than one option. The dropdown stays open while selecting. Count badges show
          how many items belong to each option.
        </p>
        <ComponentExample
          code={`<DropdownFilter
  label="Plan"
  options={[
    { value: "free", label: "Free", count: 8421 },
    { value: "starter", label: "Starter", count: 2156 },
    { value: "pro", label: "Pro", count: 1089 },
    { value: "enterprise", label: "Enterprise", count: 312 },
  ]}
  multiple
  showAll
/>`}
        >
          <DropdownFilter label="Plan" options={planOptions} multiple showAll />
        </ComponentExample>
      </DocSection>

      {/* Searchable */}
      <DocSection id="searchable" title="Searchable">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Search is enabled automatically when there are more than 8 options, or you can force it
          with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">searchable</code>.
          The search input filters by label and value.
        </p>
        <ComponentExample
          code={`<DropdownFilter
  label="Country"
  options={countries}  // 24 countries
  searchable
/>`}
        >
          <DropdownFilter label="Country" options={countryOptions} searchable />
        </ComponentExample>
      </DocSection>

      {/* Grouped Options */}
      <DocSection id="grouped" title="Grouped Options">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">group</code> property
          on each option to organize them under section headers.
        </p>
        <ComponentExample
          code={`<DropdownFilter
  label="Region"
  options={[
    { value: "us", label: "United States", group: "Americas" },
    { value: "ca", label: "Canada", group: "Americas" },
    { value: "gb", label: "United Kingdom", group: "Europe" },
    { value: "de", label: "Germany", group: "Europe" },
    { value: "jp", label: "Japan", group: "Asia-Pacific" },
    { value: "au", label: "Australia", group: "Asia-Pacific" },
  ]}
  multiple
  searchable
/>`}
        >
          <DropdownFilter label="Region" options={groupedRegions} multiple searchable />
        </ComponentExample>
      </DocSection>

      {/* Connected (FilterProvider) */}
      <DocSection id="connected" title="Connected (FilterProvider)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          When you set the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">field</code> prop,
          DropdownFilter reads and writes to FilterContext dimensions. Any component can read the active value via{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useMetricFilters().dimensions[field]</code>.
        </p>
        <ComponentExample
          code={`import { FilterProvider, useMetricFilters, DropdownFilter } from "metricui";

function Dashboard() {
  return (
    <FilterProvider>
      <DropdownFilter
        label="Region"
        options={regions}
        field="region"
        multiple
        showAll
      />
      <MyContent />
    </FilterProvider>
  );
}

function MyContent() {
  const filters = useMetricFilters();
  const regions = filters?.dimensions?.region ?? [];
  // Use regions to fetch/filter data
  return <div>Regions: {regions.join(", ")}</div>;
}`}
        >
          <FilterProvider>
            <ConnectedInner />
          </FilterProvider>
        </ComponentExample>
      </DocSection>

      {/* Interactive Controls */}
      <DocSection id="interactive" title="Interactive Controls">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Experiment with multiple, searchable, showAll, and dense toggles.
        </p>
        <InteractivePlayground />
      </DocSection>

      {/* Standalone (onChange) */}
      <DocSection id="standalone" title="Standalone (onChange)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> without
          a FilterProvider for simple use cases where you just need the selected value.
        </p>
        <ComponentExample
          code={`<DropdownFilter
  label="Region"
  options={regions}
  onChange={(value) => {
    console.log("Selected:", value);
    // Fetch data for this selection
  }}
/>`}
        >
          <StandaloneExample />
        </ComponentExample>
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
