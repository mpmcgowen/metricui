"use client";

import { FilterBar } from "@/components/filters/FilterBar";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "with-badge", title: "With Badge", level: 2 },
  { id: "sticky-mode", title: "Sticky Mode", level: 2 },
  { id: "collapsible", title: "Collapsible", level: 2 },
  { id: "connected", title: "Connected (FilterProvider)", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Dropdown options for demos
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
// Connected example — shows FilterProvider + useMetricFilters
// ---------------------------------------------------------------------------

function ConnectedInner() {
  const filters = useMetricFilters();
  const regionValues = filters?.dimensions?.["region"] ?? [];
  const planValues = filters?.dimensions?.["plan"] ?? [];
  return (
    <div className="w-full space-y-4">
      <FilterBar
        tags
        badge={<>1,204 accounts</>}
      >
        <FilterBar.Primary>
          <PeriodSelector presets={["7d", "30d", "90d"]} />
          <DropdownFilter
            label="Region"
            options={regionOptions}
            field="region"
            multiple
            showAll
          />
        </FilterBar.Primary>
        <FilterBar.Secondary>
          <DropdownFilter
            label="Plan"
            options={planOptions}
            field="plan"
            multiple
            showAll
          />
        </FilterBar.Secondary>
      </FilterBar>
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          useMetricFilters() output
        </p>
        <p>
          <span className="text-[var(--foreground)]">dimensions.region:</span>{" "}
          {regionValues.length > 0 ? `["${regionValues.join('", "')}"]` : "[]"}
        </p>
        <p>
          <span className="text-[var(--foreground)]">dimensions.plan:</span>{" "}
          {planValues.length > 0 ? `["${planValues.join('", "')}"]` : "[]"}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FilterBarDocs() {
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
            FilterBar
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
            A container for dashboard filters with auto FilterTags, badge slot, collapsible accordion,
            and optional frosted-glass sticky mode. Organise filters into primary and secondary groups
            with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Primary</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Secondary</code>.
          </p>
        </div>

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use FilterBar as the single home for all dashboard filters. Drop DropdownFilter,
          PeriodSelector, and SegmentToggle inside, and FilterBar handles layout, tag display,
          collapse/expand, and the &quot;Clear all&quot; button automatically. It must be inside a{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterProvider</code>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Drop filter components directly as children. Without{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Primary</code> /{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Secondary</code>,
            all children go into the primary row.
          </p>
          <ComponentExample
            code={`<FilterProvider>
  <FilterBar>
    <PeriodSelector presets={["7d", "30d", "90d"]} />
    <DropdownFilter
      label="Region"
      options={regions}
      field="region"
      multiple
      showAll
    />
  </FilterBar>
</FilterProvider>`}
          >
            <FilterProvider>
              <FilterBar>
                <PeriodSelector presets={["7d", "30d", "90d"]} />
                <DropdownFilter
                  label="Region"
                  options={regionOptions}
                  field="region"
                  multiple
                  showAll
                />
              </FilterBar>
            </FilterProvider>
          </ComponentExample>
        </DocSection>

        {/* With Badge */}
        <DocSection id="with-badge" title="With Badge">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">badge</code> prop
            accepts any ReactNode and renders it as an accent-colored pill in the header row.
            Use it for record counts, last-updated timestamps, or status text.
          </p>
          <ComponentExample
            code={`<FilterBar badge={<>1,204 active accounts</>}>
  <PeriodSelector presets={["7d", "30d", "90d"]} />
  <DropdownFilter label="Region" options={regions} field="region" multiple />
</FilterBar>`}
          >
            <FilterProvider>
              <FilterBar badge={<>1,204 active accounts</>}>
                <PeriodSelector presets={["7d", "30d", "90d"]} />
                <DropdownFilter
                  label="Region"
                  options={regionOptions}
                  field="region"
                  multiple
                  showAll
                />
              </FilterBar>
            </FilterProvider>
          </ComponentExample>
        </DocSection>

        {/* Sticky Mode */}
        <DocSection id="sticky-mode" title="Sticky Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sticky</code> to
            pin the FilterBar to the top of the viewport when scrolling. It applies a frosted-glass
            backdrop blur with a 12px offset from the top edge.
          </p>
          <CodeBlock
            code={`<FilterBar sticky badge={<>1,204 accounts</>}>
  <FilterBar.Primary>
    <PeriodSelector presets={["30d", "90d", "quarter"]} comparison />
    <DropdownFilter label="Region" options={regions} field="region" multiple />
  </FilterBar.Primary>
</FilterBar>`}
          />
          <p className="mt-3 text-[13px] text-[var(--muted)]">
            Sticky mode is best demonstrated in full-page dashboards. See the{" "}
            <a href="/demos/saas" className="font-medium text-[var(--accent)] hover:underline">
              SaaS demo
            </a>{" "}
            for a live example.
          </p>
        </DocSection>

        {/* Collapsible */}
        <DocSection id="collapsible" title="Collapsible">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            FilterBar is collapsible by default. Click the header to expand or collapse the filter
            controls. When collapsed, active filters are shown as compact tags in the header row. Use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">defaultCollapsed</code> to
            start in collapsed state, or set{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">collapsible=&#123;false&#125;</code> to
            disable collapse entirely.
          </p>
          <ComponentExample
            code={`<FilterBar defaultCollapsed>
  <PeriodSelector presets={["7d", "30d", "90d"]} />
  <DropdownFilter label="Region" options={regions} field="region" multiple />
</FilterBar>`}
          >
            <FilterProvider>
              <FilterBar defaultCollapsed>
                <PeriodSelector presets={["7d", "30d", "90d"]} />
                <DropdownFilter
                  label="Region"
                  options={regionOptions}
                  field="region"
                  multiple
                  showAll
                />
              </FilterBar>
            </FilterProvider>
          </ComponentExample>
        </DocSection>

        {/* Connected (FilterProvider) */}
        <DocSection id="connected" title="Connected (FilterProvider)">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            FilterBar reads from FilterContext to display active filter tags and counts.
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Primary</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Secondary</code> to
            split filters into two groups. Secondary filters are hidden behind a &quot;+N more&quot; toggle.
          </p>
          <ComponentExample
            code={`import { FilterProvider, useMetricFilters } from "metricui";
import { FilterBar, PeriodSelector, DropdownFilter } from "metricui";

function Dashboard() {
  return (
    <FilterProvider>
      <FilterBar
        tags
        badge={<>1,204 accounts</>}
      >
        <FilterBar.Primary>
          <PeriodSelector presets={["7d", "30d", "90d"]} />
          <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
        </FilterBar.Primary>
        <FilterBar.Secondary>
          <DropdownFilter label="Plan" options={plans} field="plan" multiple showAll />
        </FilterBar.Secondary>
      </FilterBar>
      <MyContent />
    </FilterProvider>
  );
}

function MyContent() {
  const filters = useMetricFilters();
  const regions = filters?.dimensions?.region ?? [];
  return <div>Active regions: {regions.join(", ")}</div>;
}`}
          >
            <FilterProvider>
              <ConnectedInner />
            </FilterProvider>
          </ComponentExample>
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "children", type: "ReactNode", default: "(required)", description: "Filter components. Optionally wrap in FilterBar.Primary / FilterBar.Secondary." },
              { prop: "sticky", type: "boolean", default: "false", description: "Stick to the top of the viewport with frosted-glass backdrop blur and 12px offset." },
              { prop: "tags", type: "boolean | FilterTagsProps", default: "true", description: "Show active filter tags below the controls. Pass an object to customise FilterTags props." },
              { prop: "badge", type: "ReactNode", default: "\u2014", description: "Accent pill in the header row. Use for record counts, status text, etc." },
              { prop: "collapsible", type: "boolean", default: "true", description: "Enable expand/collapse accordion on the header click." },
              { prop: "defaultCollapsed", type: "boolean", default: "false", description: "Start in collapsed state. Active filters show as compact tags in the header." },
              { prop: "dense", type: "boolean", default: "false", description: "Compact mode. Falls back to MetricProvider." },
              { prop: "variant", type: "CardVariant", default: "\u2014", description: "Visual variant. Falls back to MetricProvider." },
              { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes on the root element." },
              { prop: "classNames", type: "{ root?, controls?, tags?, summary? }", default: "\u2014", description: "Sub-element class overrides." },
              { prop: "id", type: "string", default: "\u2014", description: "HTML id." },
              { prop: "position", type: '"inline"', default: '"inline"', description: "Layout position mode." },
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

          <h3 className="mt-8 mb-3 text-sm font-semibold text-[var(--foreground)]">Sub-components</h3>
          <DataTable
            data={[
              { component: "FilterBar.Nav", description: "Slot for embedding DashboardNav inside the FilterBar. Renders above the filter controls." },
              { component: "FilterBar.Primary", description: "Slot for primary (always-visible) filters. Renders children in a flex-wrap row." },
              { component: "FilterBar.Secondary", description: "Slot for secondary filters, hidden behind a \"+N more\" toggle button." },
            ]}
            columns={[
              { key: "component", header: "Component", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
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
              "FilterBar must be inside a FilterProvider. It reads context to display active filter counts and tags.",
              "Without FilterBar.Primary / FilterBar.Secondary slots, all children render in the primary row.",
              "The collapsed header shows active filters as compact FilterTags. Expand to see full controls.",
              "The \"Clear all\" button appears automatically when any filters are active. It clears dimensions, period, and cross-filter.",
              "Sticky mode uses backdrop-blur-xl with 80% card-bg opacity for the frosted-glass effect.",
              "Tags are shown by default (tags={true}). Pass false to hide, or a FilterTagsProps object to customise.",
              "Dense mode can be set per-component or inherited from MetricProvider.",
              "FilterBar uses forwardRef and passes through id, data-testid, className, and classNames.",
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
              { name: "DropdownFilter", desc: "Single or multi-select dropdown for dimension filtering. Drop inside FilterBar." },
              { name: "PeriodSelector", desc: "Date-range picker with presets and comparison toggle. Drop inside FilterBar." },
              { name: "SegmentToggle", desc: "Pill-style toggle for switching between segments. Drop inside FilterBar." },
              { name: "FilterTags", desc: "Displays active filters as dismissible tags. FilterBar renders these automatically." },
              { name: "FilterProvider", desc: "Context provider that holds the active filter state. Wrap your dashboard in this." },
              { name: "useMetricFilters()", desc: "Hook to read the active period, comparison, and dimension filters from the nearest FilterProvider." },
              { name: "MetricProvider", desc: "Global config. FilterBar inherits dense and variant from here." },
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
