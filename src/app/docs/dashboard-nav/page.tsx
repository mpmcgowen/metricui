"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Dashboard } from "@/components/layout/Dashboard";
import { FilterBar } from "@/components/filters/FilterBar";
import { KpiCard } from "@/components/cards/KpiCard";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "tab-mode", title: "Tab Mode", level: 2 },
  { id: "scroll-mode", title: "Scroll Mode", level: 2 },
  { id: "inside-filter-bar", title: "Inside FilterBar", level: 2 },
  { id: "badges", title: "Badges", level: 2 },
  { id: "keyboard-navigation", title: "Keyboard Navigation", level: 2 },
  { id: "url-sync", title: "URL Sync", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Tab definitions for demos
// ---------------------------------------------------------------------------

const overviewTabs = [
  { value: "overview", label: "Overview" },
  { value: "revenue", label: "Revenue" },
  { value: "customers", label: "Customers" },
  { value: "settings", label: "Settings" },
];

const badgeTabs = [
  { value: "alerts", label: "Alerts", badge: 12 },
  { value: "users", label: "Users", badge: 1489, badgeFormat: "compact" as const },
  { value: "tasks", label: "Tasks", badge: "NEW" },
];

const scrollTabs = [
  { value: "section-metrics", label: "Metrics" },
  { value: "section-charts", label: "Charts" },
  { value: "section-table", label: "Table" },
];

// ---------------------------------------------------------------------------
// Interactive tab-mode demo
// ---------------------------------------------------------------------------

function TabModeDemo() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full max-w-3xl">
      <Dashboard>
        <DashboardNav
          tabs={overviewTabs}
          value={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-4">
          {activeTab === "overview" && (
            <MetricGrid columns={3}>
              <KpiCard title="Total Revenue" value={128400} format={{ style: "currency" }} />
              <KpiCard title="Active Users" value={3842} format="compact" />
              <KpiCard title="Churn Rate" value={0.024} format={{ style: "percent" }} />
            </MetricGrid>
          )}
          {activeTab === "revenue" && (
            <KpiCard title="Monthly Revenue" value={42800} format={{ style: "currency" }} />
          )}
          {activeTab === "customers" && (
            <KpiCard title="Total Customers" value={1204} format="compact" />
          )}
          {activeTab === "settings" && (
            <div className="rounded-lg border border-[var(--card-border)] p-6 text-sm text-[var(--muted)]">
              Settings panel content goes here.
            </div>
          )}
        </div>
      </Dashboard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-mode demo
// ---------------------------------------------------------------------------

function ScrollModeDemo() {
  return (
    <div className="w-full max-w-3xl">
      <DashboardNav
        tabs={scrollTabs}
        mode="scroll"
        sticky
      />
      <div className="mt-4 space-y-8">
        <div id="section-metrics">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Metrics</h3>
          <MetricGrid columns={2}>
            <KpiCard title="MRR" value={84200} format={{ style: "currency" }} />
            <KpiCard title="ARR" value={1010400} format={{ style: "currency" }} />
          </MetricGrid>
        </div>
        <div id="section-charts">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Charts</h3>
          <div className="rounded-lg border border-[var(--card-border)] p-6 text-sm text-[var(--muted)]">
            Chart content placeholder.
          </div>
        </div>
        <div id="section-table">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Table</h3>
          <div className="rounded-lg border border-[var(--card-border)] p-6 text-sm text-[var(--muted)]">
            Table content placeholder.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterBar.Nav demo
// ---------------------------------------------------------------------------

function FilterBarNavDemo() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full max-w-3xl">
      <FilterBar>
        <FilterBar.Nav>
          <DashboardNav
            tabs={overviewTabs}
            value={activeTab}
            onChange={setActiveTab}
          />
        </FilterBar.Nav>
      </FilterBar>
      <div className="mt-4">
        {activeTab === "overview" && (
          <KpiCard title="Total Revenue" value={128400} format={{ style: "currency" }} />
        )}
        {activeTab === "revenue" && (
          <KpiCard title="Monthly Revenue" value={42800} format={{ style: "currency" }} />
        )}
        {activeTab === "customers" && (
          <KpiCard title="Total Customers" value={1204} format="compact" />
        )}
        {activeTab === "settings" && (
          <div className="rounded-lg border border-[var(--card-border)] p-6 text-sm text-[var(--muted)]">
            Settings panel content goes here.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardNavDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            Layout
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            DashboardNav
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
            Tabbed navigation for switching dashboard views or smooth-scrolling
            to page sections. Supports controlled and uncontrolled modes, URL
            sync, live badges, keyboard navigation, and nests cleanly inside{" "}
            <a href="/docs/filter-bar" className="font-medium text-[var(--accent)] hover:underline">
              FilterBar
            </a>{" "}
            via the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Nav</code> slot.
          </p>
        </div>

        {/* Overview */}
        <DocSection id="overview" title="Overview">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            DashboardNav renders a horizontal tab strip with a sliding underline
            indicator. In <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">tabs</code> mode
            (default), use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code> /{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> to control
            which content panel is visible. In{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">scroll</code> mode, clicking
            a tab smooth-scrolls to the matching section ID and an
            IntersectionObserver keeps the active tab in sync as the user scrolls.
          </p>
          <ComponentExample
            code={`<DashboardNav
  tabs={[
    { value: "overview", label: "Overview" },
    { value: "revenue", label: "Revenue" },
    { value: "customers", label: "Customers" },
    { value: "settings", label: "Settings" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>`}
          >
            <div className="w-full max-w-3xl">
              <DashboardNav tabs={overviewTabs} />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Tab Mode */}
        <DocSection id="tab-mode" title="Tab Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The default mode. Use controlled{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code> /{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> to
            conditionally render content below the nav. Click the tabs to swap
            the content panel.
          </p>
          <ComponentExample
            code={`const [activeTab, setActiveTab] = useState("overview");

<Dashboard>
  <DashboardNav
    tabs={tabs}
    value={activeTab}
    onChange={setActiveTab}
  />
  {activeTab === "overview" && (
    <MetricGrid columns={3}>
      <KpiCard title="Total Revenue" value={128400} format={{ style: "currency" }} />
      <KpiCard title="Active Users" value={3842} format="compact" />
      <KpiCard title="Churn Rate" value={0.024} format={{ style: "percent" }} />
    </MetricGrid>
  )}
  {activeTab === "revenue" && <KpiCard title="Monthly Revenue" value={42800} />}
</Dashboard>`}
          >
            <TabModeDemo />
          </ComponentExample>
        </DocSection>

        {/* Scroll Mode */}
        <DocSection id="scroll-mode" title="Scroll Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">mode=&quot;scroll&quot;</code> and
            give each page section an <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">id</code> that
            matches the tab <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code>.
            Clicking a tab smooth-scrolls to the section, and the active tab
            updates automatically via IntersectionObserver as the user scrolls.
            Pair with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sticky</code> for
            a fixed nav that stays in view.
          </p>
          <ComponentExample
            code={`<DashboardNav
  tabs={[
    { value: "section-metrics", label: "Metrics" },
    { value: "section-charts", label: "Charts" },
    { value: "section-table", label: "Table" },
  ]}
  mode="scroll"
  sticky
/>

<div id="section-metrics">...</div>
<div id="section-charts">...</div>
<div id="section-table">...</div>`}
          >
            <ScrollModeDemo />
          </ComponentExample>
        </DocSection>

        {/* Inside FilterBar */}
        <DocSection id="inside-filter-bar" title="Inside FilterBar">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Nest DashboardNav inside the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Nav</code> slot
            to render it as the top row of the filter bar. Filters sit below in{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">FilterBar.Primary</code>.
            This keeps navigation and filtering in a single, cohesive bar.
          </p>
          <ComponentExample
            code={`<FilterBar>
  <FilterBar.Nav>
    <DashboardNav
      tabs={tabs}
      value={activeTab}
      onChange={setActiveTab}
    />
  </FilterBar.Nav>
  <FilterBar.Primary>
    <PeriodSelector presets={["7d", "30d", "90d"]} />
    <DropdownFilter label="Region" dimension="region" options={regions} />
  </FilterBar.Primary>
</FilterBar>`}
          >
            <FilterBarNavDemo />
          </ComponentExample>
        </DocSection>

        {/* Badges */}
        <DocSection id="badges" title="Badges">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Each tab can display a live badge. Numeric badges are formatted
            through the format engine (e.g., 1489 becomes &quot;1.5K&quot; with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">badgeFormat: &quot;compact&quot;</code>).
            String badges render as-is.
          </p>
          <ComponentExample
            code={`<DashboardNav
  tabs={[
    { value: "alerts", label: "Alerts", badge: 12 },
    { value: "users", label: "Users", badge: 1489, badgeFormat: "compact" },
    { value: "tasks", label: "Tasks", badge: "NEW" },
  ]}
/>`}
          >
            <div className="w-full max-w-3xl">
              <DashboardNav tabs={badgeTabs} />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Keyboard Navigation */}
        <DocSection id="keyboard-navigation" title="Keyboard Navigation">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            DashboardNav implements full ARIA tablist keyboard navigation:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Arrow Right / Arrow Down — move to the next tab",
              "Arrow Left / Arrow Up — move to the previous tab",
              "Home — jump to the first tab",
              "End — jump to the last tab",
            ].map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <code className="font-[family-name:var(--font-mono)] text-[13px]">{item}</code>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Focus moves automatically and the corresponding{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> fires,
            keeping keyboard and pointer interactions in parity.
          </p>
        </DocSection>

        {/* URL Sync */}
        <DocSection id="url-sync" title="URL Sync">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">syncUrl</code> param
            name to persist the active tab in the URL search params. The
            component reads the initial value from the URL on mount, and updates
            it via <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">history.replaceState</code> on
            each tab change, making dashboards deep-linkable and shareable.
          </p>
          <CodeBlock
            code={`// URL will update to ?view=revenue when the tab is clicked
<DashboardNav
  tabs={tabs}
  syncUrl="view"
  value={activeTab}
  onChange={setActiveTab}
/>`}
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "tabs", type: "DashboardNavTab[]", default: "(required)", description: "Array of tab definitions. Each tab has value, label, and optional icon, badge, and badgeFormat." },
              { prop: "value", type: "string", default: "\u2014", description: "Controlled active tab value." },
              { prop: "defaultValue", type: "string", default: "First tab", description: "Default active tab for uncontrolled usage." },
              { prop: "onChange", type: "(value: string) => void", default: "\u2014", description: "Callback fired when the active tab changes." },
              { prop: "mode", type: '"tabs" | "scroll"', default: '"tabs"', description: 'In "tabs" mode, use value/onChange to swap content. In "scroll" mode, clicking scrolls to the matching section ID.' },
              { prop: "syncUrl", type: "string", default: "\u2014", description: "URL search param name. Persists the active tab in the URL for deep-linking." },
              { prop: "sticky", type: "boolean", default: "false", description: "Stick to the viewport top with frosted-glass backdrop blur." },
              { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size variant controlling text, padding, and icon sizing." },
              { prop: "dense", type: "boolean", default: "false", description: "Compact layout. Falls back to MetricProvider config." },
              { prop: "variant", type: "CardVariant", default: "\u2014", description: "Visual variant. Falls back to MetricProvider config." },
              { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes on the root element." },
              { prop: "id", type: "string", default: "\u2014", description: "HTML id attribute." },
              { prop: "data-testid", type: "string", default: "\u2014", description: "Test id for testing frameworks." },
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

          <h3 className="mt-8 mb-3 text-sm font-semibold text-[var(--foreground)]">DashboardNavTab</h3>
          <DataTable
            data={[
              { prop: "value", type: "string", default: "(required)", description: "Unique identifier for the tab." },
              { prop: "label", type: "string", default: "(required)", description: "Display text." },
              { prop: "icon", type: "ReactNode", default: "\u2014", description: "Icon rendered before the label." },
              { prop: "badge", type: "number | string", default: "\u2014", description: "Badge value. Numbers are formatted; strings render as-is." },
              { prop: "badgeFormat", type: "FormatOption", default: "\u2014", description: "Format option for numeric badges (e.g., \"compact\", { style: \"percent\" })." },
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
              "DashboardNav uses forwardRef and passes through id, data-testid, and className.",
              "In scroll mode, an IntersectionObserver highlights the section currently in view. A 1-second lock prevents the observer from overriding the active tab immediately after a click-to-scroll.",
              "The sliding underline indicator animates with a 200ms cubic-bezier transition.",
              "Sticky mode applies frosted-glass styling (backdrop-blur-xl, 80% card-bg opacity) and sticks to the viewport top with z-index 31.",
              "When dense is true and size is \"md\", the component automatically downsizes to \"sm\" for compact layouts.",
              "Badge formatting uses the same format engine as KpiCard. Pass badgeFormat: \"compact\" for abbreviated numbers.",
              "Full ARIA tablist semantics: role=\"tablist\" on the container, role=\"tab\" and aria-selected on each button.",
              "Works both standalone and inside FilterBar.Nav. When inside FilterBar, omit the sticky prop — FilterBar handles sticking.",
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
              { name: "Dashboard", desc: "Top-level layout wrapper. Use as the parent container around DashboardNav and content panels." },
              { name: "FilterBar", desc: "Filter bar with slots. Nest DashboardNav inside FilterBar.Nav for integrated nav + filters." },
              { name: "MetricGrid", desc: "Responsive grid for KPI cards and chart panels. Place below DashboardNav for tab content." },
              { name: "KpiCard", desc: "Metric display card. Common content inside DashboardNav tab panels." },
              { name: "MetricProvider", desc: "Global config. DashboardNav inherits dense and variant from MetricProvider." },
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
