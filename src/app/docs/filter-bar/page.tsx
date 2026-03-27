"use client";

import { FilterBar } from "@/components/filters/FilterBar";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("filter-bar")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "with-badge", title: "With Badge", level: 2 },
  { id: "sticky-mode", title: "Sticky Mode", level: 2 },
  { id: "collapsible", title: "Collapsible", level: 2 },
  { id: "connected", title: "Connected (FilterProvider)", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
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
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

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

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
