"use client";

import { useState } from "react";
import { DrillDown, useDrillDown, useDrillDownAction } from "@/components/ui/DrillDown";
import { BarChart } from "@/components/charts/BarChart";
import { KpiCard } from "@/components/cards/KpiCard";
import { DataTable } from "@/components/tables/DataTable";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("drill-down")!;

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "zero-config", title: "Zero-Config DrillDown", level: 2 },
  { id: "custom-content", title: "Custom Content", level: 2 },
  { id: "modal-mode", title: "Modal Mode", level: 2 },
  { id: "nested-drills", title: "Nested Drills", level: 2 },
  { id: "render-content", title: "Reactive Content (renderContent)", level: 2 },
  { id: "hooks", title: "Hooks", level: 2 },
  { id: "tooltip-hints", title: "Tooltip Hints", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const revenueByRegion = [
  { region: "US", revenue: 142000, accounts: 812 },
  { region: "EU", revenue: 98000, accounts: 634 },
  { region: "APAC", revenue: 67000, accounts: 421 },
  { region: "LATAM", revenue: 31000, accounts: 198 },
];

const accountDetail = [
  { account: "Acme Corp", region: "US", revenue: 24500, plan: "Enterprise", mrr: 2042 },
  { account: "TechFlow", region: "US", revenue: 18200, plan: "Pro", mrr: 1517 },
  { account: "Globex", region: "EU", revenue: 15800, plan: "Enterprise", mrr: 1317 },
  { account: "Initech", region: "EU", revenue: 12400, plan: "Pro", mrr: 1033 },
  { account: "DataViz", region: "APAC", revenue: 9800, plan: "Pro", mrr: 817 },
  { account: "Nexus AI", region: "APAC", revenue: 8100, plan: "Starter", mrr: 675 },
  { account: "SolaTech", region: "LATAM", revenue: 6200, plan: "Starter", mrr: 517 },
  { account: "CloudNine", region: "US", revenue: 21300, plan: "Enterprise", mrr: 1775 },
  { account: "Eureka", region: "EU", revenue: 11200, plan: "Pro", mrr: 933 },
  { account: "Pacifica", region: "APAC", revenue: 7400, plan: "Starter", mrr: 617 },
];

// ---------------------------------------------------------------------------
// Zero-config demo
// ---------------------------------------------------------------------------

function ZeroConfigDemo() {
  return (
    <DrillDown.Root>
      <div className="w-full max-w-xl">
        <BarChart
          data={revenueByRegion}
          index="region"
          categories={["revenue"]}
          title="Revenue by Region"
          height={240}
          drillDown
          tooltipHint
        />
      </div>
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Custom content demo
// ---------------------------------------------------------------------------

function CustomContentDemo() {
  return (
    <DrillDown.Root>
      <div className="w-full max-w-xl">
        <BarChart
          data={revenueByRegion}
          index="region"
          categories={["revenue", "accounts"]}
          title="Revenue by Region"
          height={240}
          drillDown={(event) => {
            const regionAccounts = accountDetail.filter(
              (a) => a.region === event.indexValue,
            );
            return (
              <MetricGrid>
                <KpiCard
                  title="Accounts"
                  value={regionAccounts.length}
                  format="number"
                />
                <KpiCard
                  title="Total Revenue"
                  value={regionAccounts.reduce((s, a) => s + a.revenue, 0)}
                  format="currency"
                />
                <DataTable
                  data={regionAccounts}
                  columns={[
                    { key: "account", header: "Account" },
                    { key: "plan", header: "Plan" },
                    { key: "revenue", header: "Revenue", format: "currency", align: "right", sortable: true },
                    { key: "mrr", header: "MRR", format: "currency", align: "right", sortable: true },
                  ]}
                  title={`${event.indexValue} accounts`}
                  dense
                />
              </MetricGrid>
            );
          }}
          tooltipHint="Click to view accounts"
        />
      </div>
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Modal mode demo
// ---------------------------------------------------------------------------

function ModalModeDemo() {
  return (
    <DrillDown.Root>
      <div className="w-full max-w-xl">
        <BarChart
          data={revenueByRegion}
          index="region"
          categories={["revenue"]}
          title="Revenue by Region"
          height={240}
          drillDown
          drillDownMode="modal"
          tooltipHint
        />
      </div>
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Nested drill demo
// ---------------------------------------------------------------------------

function NestedDrillDemo() {
  const openDrill = useDrillDownAction();

  return (
    <div className="w-full max-w-xl">
      <BarChart
        data={revenueByRegion}
        index="region"
        categories={["revenue"]}
        title="Revenue by Region"
        height={240}
        drillDown={(event) => {
          const regionAccounts = accountDetail.filter(
            (a) => a.region === event.indexValue,
          );
          return (
            <div className="space-y-4">
              {regionAccounts.map((acct) => (
                <button
                  key={acct.account}
                  onClick={() =>
                    openDrill(
                      { title: acct.account, field: "account", value: acct.account },
                      <div className="space-y-4">
                        <MetricGrid>
                          <KpiCard title="Revenue" value={acct.revenue} format="currency" />
                          <KpiCard title="MRR" value={acct.mrr} format="currency" />
                          <KpiCard title="Plan" value={acct.plan} />
                        </MetricGrid>
                      </div>,
                    )
                  }
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-left transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--foreground)]">{acct.account}</span>
                    <span className="text-sm text-[var(--muted)]">${acct.revenue.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{acct.plan} plan</span>
                </button>
              ))}
            </div>
          );
        }}
        tooltipHint="Click to drill into region"
      />
    </div>
  );
}

function NestedDrillWrapper() {
  return (
    <DrillDown.Root>
      <NestedDrillDemo />
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// renderContent demo
// ---------------------------------------------------------------------------

function RenderContentDemo() {
  const [liveData, setLiveData] = useState(revenueByRegion);

  return (
    <DrillDown.Root
      renderContent={(trigger) => {
        const region = String(trigger.value);
        const regionAccounts = accountDetail.filter((a) => a.region === region);
        const totalRevenue = regionAccounts.reduce((s, a) => s + a.revenue, 0);
        return (
          <MetricGrid>
            <KpiCard title="Region" value={region} />
            <KpiCard title="Total Revenue" value={totalRevenue} format="currency" />
            <KpiCard title="Accounts" value={regionAccounts.length} format="number" />
          </MetricGrid>
        );
      }}
    >
      <div className="w-full max-w-xl space-y-3">
        <BarChart
          data={liveData}
          index="region"
          categories={["revenue"]}
          title="Revenue by Region (Live)"
          height={240}
          drillDown
          tooltipHint
        />
        <button
          onClick={() =>
            setLiveData((prev) =>
              prev.map((r) => ({
                ...r,
                revenue: r.revenue + Math.round(Math.random() * 5000 - 2500),
              })),
            )
          }
          className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Simulate data update
        </button>
      </div>
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Hooks demo
// ---------------------------------------------------------------------------

function HooksDemoInner() {
  const drill = useDrillDown();
  const openDrill = useDrillDownAction();

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() =>
            openDrill(
              { title: "US Details", field: "region", value: "US" },
              <MetricGrid>
                <KpiCard title="Revenue" value={142000} format="currency" />
                <KpiCard title="Accounts" value={812} format="number" />
              </MetricGrid>,
            )
          }
          className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Open US drill
        </button>
        <button
          onClick={() =>
            openDrill(
              { title: "EU Details", field: "region", value: "EU", mode: "modal" },
              <MetricGrid>
                <KpiCard title="Revenue" value={98000} format="currency" />
                <KpiCard title="Accounts" value={634} format="number" />
              </MetricGrid>,
            )
          }
          className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Open EU drill (modal)
        </button>
      </div>
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          useDrillDown() state
        </p>
        <p><span className="text-[var(--foreground)]">isOpen:</span> {String(drill?.isOpen ?? false)}</p>
        <p><span className="text-[var(--foreground)]">depth:</span> {drill?.depth ?? 0}</p>
        <p><span className="text-[var(--foreground)]">breadcrumbs:</span> [{drill?.breadcrumbs.map((b) => b.title).join(", ") ?? ""}]</p>
      </div>
    </div>
  );
}

function HooksDemo() {
  return (
    <DrillDown.Root>
      <HooksDemoInner />
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Tooltip hint demo
// ---------------------------------------------------------------------------

function TooltipHintDemo() {
  return (
    <DrillDown.Root>
      <div className="w-full max-w-xl space-y-6">
        <BarChart
          data={revenueByRegion}
          index="region"
          categories={["revenue"]}
          title="Default hint (tooltipHint={true})"
          height={200}
          drillDown
          tooltipHint
        />
        <BarChart
          data={revenueByRegion}
          index="region"
          categories={["revenue"]}
          title="Custom hint string"
          height={200}
          drillDown
          tooltipHint="Click to see breakdown"
        />
      </div>
    </DrillDown.Root>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DrillDownDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* Overview */}
      <DocSection id="overview" title="Overview">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The DrillDown system is composed of three pieces: a{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">DrillDown.Root</code>{" "}
          wrapper that provides context and renders the overlay portal, a{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">drillDown</code>{" "}
          prop on chart components that wires up click-to-drill, and hooks ({" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useDrillDown</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useDrillDownAction</code>
          ) for programmatic control.
        </p>
        <CodeBlock
          code={`import { DrillDown, useDrillDownAction } from "metricui";

function Dashboard() {
  return (
    <DrillDown.Root>
      <BarChart
        data={data}
        index="region"
        categories={["revenue"]}
        drillDown          // true = auto-table
        tooltipHint        // "Click to drill down"
      />
    </DrillDown.Root>
  );
}`}
        />
      </DocSection>

      {/* Zero-Config DrillDown */}
      <DocSection id="zero-config" title="Zero-Config DrillDown">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">drillDown={"{true}"}</code>{" "}
          to any chart. Clicking a bar, slice, or point opens a slide-over with an auto-generated detail
          table showing filtered rows, summary KPIs, and search.
        </p>
        <ComponentExample
          code={`<DrillDown.Root>
  <BarChart
    data={revenueByRegion}
    index="region"
    categories={["revenue"]}
    title="Revenue by Region"
    drillDown
    tooltipHint
  />
</DrillDown.Root>`}
        >
          <ZeroConfigDemo />
        </ComponentExample>
      </DocSection>

      {/* Custom Content */}
      <DocSection id="custom-content" title="Custom Content">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass a function to{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">drillDown</code>{" "}
          to render custom content. The function receives the click event and returns a ReactNode.
          Use MetricGrid, KpiCards, DataTable, or any component inside.
        </p>
        <ComponentExample
          code={`<DrillDown.Root>
  <BarChart
    data={revenueByRegion}
    index="region"
    categories={["revenue", "accounts"]}
    title="Revenue by Region"
    drillDown={(event) => {
      const regionAccounts = accounts.filter(
        (a) => a.region === event.indexValue,
      );
      return (
        <MetricGrid>
          <KpiCard title="Accounts" value={regionAccounts.length} />
          <KpiCard title="Total Revenue"
            value={regionAccounts.reduce((s, a) => s + a.revenue, 0)}
            format="currency"
          />
          <DataTable
            data={regionAccounts}
            columns={[
              { key: "account", header: "Account" },
              { key: "plan", header: "Plan" },
              { key: "revenue", header: "Revenue", format: "currency" },
            ]}
            dense
          />
        </MetricGrid>
      );
    }}
    tooltipHint="Click to view accounts"
  />
</DrillDown.Root>`}
        >
          <CustomContentDemo />
        </ComponentExample>
      </DocSection>

      {/* Modal Mode */}
      <DocSection id="modal-mode" title="Modal Mode">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">drillDownMode=&quot;modal&quot;</code>{" "}
          to open the drill content in a centered modal instead of the default slide-over panel.
          The modal is capped at 85vh height and 3xl width.
        </p>
        <ComponentExample
          code={`<DrillDown.Root>
  <BarChart
    data={revenueByRegion}
    index="region"
    categories={["revenue"]}
    drillDown
    drillDownMode="modal"
    tooltipHint
  />
</DrillDown.Root>`}
        >
          <ModalModeDemo />
        </ComponentExample>
      </DocSection>

      {/* Nested Drills */}
      <DocSection id="nested-drills" title="Nested Drills">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Drill levels stack up to 4 deep. Inside drill content, use{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useDrillDownAction()</code>{" "}
          to open sub-drills. Breadcrumbs appear automatically for navigation, and Escape goes back one level.
        </p>
        <ComponentExample
          code={`function NestedDrill() {
  const openDrill = useDrillDownAction();

  return (
    <BarChart
      data={revenueByRegion}
      index="region"
      categories={["revenue"]}
      drillDown={(event) => {
        const regionAccounts = accounts.filter(
          (a) => a.region === event.indexValue,
        );
        return (
          <div className="space-y-4">
            {regionAccounts.map((acct) => (
              <button
                key={acct.account}
                onClick={() =>
                  openDrill(
                    { title: acct.account, field: "account", value: acct.account },
                    <KpiCard title="Revenue" value={acct.revenue} format="currency" />,
                  )
                }
              >
                {acct.account}
              </button>
            ))}
          </div>
        );
      }}
    />
  );
}`}
        >
          <NestedDrillWrapper />
        </ComponentExample>
      </DocSection>

      {/* Reactive Content (renderContent) */}
      <DocSection id="render-content" title="Reactive Content (renderContent)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">DrillDown.Root</code>{" "}
          accepts a{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">renderContent</code>{" "}
          prop — a function called on every render with the active trigger. This is useful when the drill
          content should react to live data changes (e.g., real-time dashboards). Return{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">null</code>{" "}
          to fall through to the stored content.
        </p>
        <ComponentExample
          code={`<DrillDown.Root
  renderContent={(trigger) => {
    const region = String(trigger.value);
    const regionAccounts = accounts.filter((a) => a.region === region);
    const totalRevenue = regionAccounts.reduce((s, a) => s + a.revenue, 0);
    return (
      <MetricGrid>
        <KpiCard title="Region" value={region} />
        <KpiCard title="Total Revenue" value={totalRevenue} format="currency" />
        <KpiCard title="Accounts" value={regionAccounts.length} format="number" />
      </MetricGrid>
    );
  }}
>
  <BarChart
    data={liveData}
    index="region"
    categories={["revenue"]}
    drillDown
    tooltipHint
  />
</DrillDown.Root>`}
        >
          <RenderContentDemo />
        </ComponentExample>
      </DocSection>

      {/* Hooks */}
      <DocSection id="hooks" title="Hooks">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Two hooks provide full programmatic control over the drill-down system.
        </p>

        <div className="mb-6 space-y-4">
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <h4 className="mb-1 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--accent)]">
              useDrillDownAction()
            </h4>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              Returns an{" "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">openDrill(trigger, content)</code>{" "}
              function. Use it in click handlers, buttons, or any event to imperatively open a drill level.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <h4 className="mb-1 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--accent)]">
              useDrillDown()
            </h4>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              Returns the full drill-down state:{" "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">
                {"{ isOpen, depth, breadcrumbs, back, close, goTo, open, activeContent, activeTrigger }"}
              </code>.
              Use it to build custom navigation, conditionally render UI based on drill state, or close drills programmatically.
            </p>
          </div>
        </div>

        <ComponentExample
          code={`import { useDrillDown, useDrillDownAction } from "metricui";

function MyComponent() {
  const drill = useDrillDown();
  const openDrill = useDrillDownAction();

  return (
    <div>
      <button onClick={() =>
        openDrill(
          { title: "US Details", field: "region", value: "US" },
          <KpiCard title="Revenue" value={142000} format="currency" />,
        )
      }>
        Open US drill
      </button>

      <p>isOpen: {String(drill?.isOpen)}</p>
      <p>depth: {drill?.depth}</p>
      <p>breadcrumbs: [{drill?.breadcrumbs.map(b => b.title).join(", ")}]</p>
    </div>
  );
}`}
        >
          <HooksDemo />
        </ComponentExample>
      </DocSection>

      {/* Tooltip Hints */}
      <DocSection id="tooltip-hints" title="Tooltip Hints">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">tooltipHint</code>{" "}
          prop adds an action hint to chart tooltips so users know they can click to drill.
          Pass <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--muted)]">true</code> for
          the default &quot;Click to drill down&quot; text, or pass a custom string.
        </p>
        <ComponentExample
          code={`{/* Default hint */}
<BarChart drillDown tooltipHint />

{/* Custom hint text */}
<BarChart drillDown tooltipHint="Click to see breakdown" />`}
        >
          <TooltipHintDemo />
        </ComponentExample>
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
