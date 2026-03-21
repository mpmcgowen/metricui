"use client";

import { useState } from "react";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import type { DropdownOption } from "@/components/filters/DropdownFilter";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

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
  { id: "related", title: "Related", level: 2 },
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
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Filters
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            DropdownFilter
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
            A single or multi-select dropdown for dimension filtering. Supports search, grouped options,
            count badges, and FilterContext integration.
          </p>
        </div>

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

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Prop</th>
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Type</th>
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Default</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)]">Description</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  { prop: "label", type: "string", def: "(required)", desc: "Label shown on the trigger button." },
                  { prop: "options", type: "DropdownOption[] | string[]", def: "(required)", desc: "Options to display. Pass string[] as shorthand." },
                  { prop: "value", type: "string | string[]", def: "\u2014", desc: "Controlled selected value(s)." },
                  { prop: "defaultValue", type: "string | string[]", def: "\u2014", desc: "Default value for uncontrolled mode." },
                  { prop: "onChange", type: "(value) => void", def: "\u2014", desc: "Change handler. Receives string (single) or string[] (multiple)." },
                  { prop: "multiple", type: "boolean", def: "false", desc: "Allow multiple selections." },
                  { prop: "searchable", type: "boolean", def: "auto", desc: "Show search input. Default: true when > 8 options." },
                  { prop: "searchPlaceholder", type: "string", def: '"Search..."', desc: "Placeholder text for search input." },
                  { prop: "field", type: "string", def: "\u2014", desc: "FilterContext field name. Reads/writes to dimensions." },
                  { prop: "showAll", type: "boolean", def: "true (multi)", desc: "Show 'All' option that clears selection." },
                  { prop: "allLabel", type: "string", def: '"All"', desc: "Label for the All option." },
                  { prop: "maxHeight", type: "number", def: "280", desc: "Max height of dropdown in px." },
                  { prop: "dense", type: "boolean", def: "false", desc: "Compact mode. Falls back to MetricProvider." },
                  { prop: "className", type: "string", def: "\u2014", desc: "Additional CSS classes." },
                  { prop: "classNames", type: "{ root?, trigger?, dropdown?, option?, search? }", def: "\u2014", desc: "Sub-element class overrides." },
                  { prop: "id", type: "string", def: "\u2014", desc: "HTML id." },
                  { prop: "data-testid", type: "string", def: "\u2014", desc: "Test id." },
                ].map((row) => (
                  <tr key={row.prop} className="border-b border-[var(--card-border)]/50">
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)]">{row.prop}</td>
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px]">{row.type}</td>
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px]">{row.def}</td>
                    <td className="py-2">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "DropdownFilter is UI only \u2014 it captures the user\u2019s selection and exposes it via context or onChange, but never filters your data.",
              "Without a FilterProvider, DropdownFilter still works via onChange. Context is optional.",
              "Search is auto-enabled when there are more than 8 options. Override with the searchable prop.",
              "The 'All' option is shown by default in multiple mode. It clears all selections.",
              "Grouped options are rendered with section headers. Set the group property on each DropdownOption.",
              "DropdownFilter uses forwardRef and passes through id, data-testid, className, and classNames.",
              "Dense mode can be set per-component or inherited from MetricProvider.",
              "The dropdown closes on outside click and on single-select option click.",
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
              { name: "SegmentToggle", desc: "Pill-style toggle for switching between segments. Better for 2\u20136 options." },
              { name: "PeriodSelector", desc: "Date-range picker with presets and comparison toggle." },
              { name: "FilterProvider", desc: "Context provider that holds the active filter state. Wrap your dashboard in this." },
              { name: "useMetricFilters()", desc: "Hook to read the active period, comparison, and dimension filters from the nearest FilterProvider." },
              { name: "MetricProvider", desc: "Global config. DropdownFilter inherits dense mode from here." },
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
      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
