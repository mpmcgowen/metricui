"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Dashboard } from "@/components/layout/Dashboard";
import { FilterBar } from "@/components/filters/FilterBar";
import { KpiCard } from "@/components/cards/KpiCard";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("dashboard-nav")!;

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "tab-mode", title: "Tab Mode", level: 2 },
  { id: "scroll-mode", title: "Scroll Mode", level: 2 },
  { id: "inside-filter-bar", title: "Inside FilterBar", level: 2 },
  { id: "badges", title: "Badges", level: 2 },
  { id: "keyboard-navigation", title: "Keyboard Navigation", level: 2 },
  { id: "url-sync", title: "URL Sync", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
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
        <ComponentHero component={component} />

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
          <PropsTable props={component.props} />
        </DocSection>

        {/* Data Shape */}
        {component.dataShape && (
          <DocSection id="data-shape" title="Data Shape">
            <CodeBlock code={component.dataShape} language="typescript" />
          </DocSection>
        )}

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {component.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI Insights analysis. See the <a href="/docs/ai-insights" className="font-medium text-[var(--accent)] hover:underline">AI Insights guide</a> for details.
            </li>
          </ul>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
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
