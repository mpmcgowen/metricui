"use client";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { ImportStatement } from "@/components/docs/ImportStatement";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "status-badges", title: "Status Badges", level: 2 },
  { id: "back-navigation", title: "Back Navigation", level: 2 },
  { id: "breadcrumbs", title: "Breadcrumbs", level: 2 },
  { id: "actions-slot", title: "Actions Slot", level: 2 },
  { id: "dense-mode", title: "Dense Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

export default function DashboardHeaderDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Layout
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            DashboardHeader
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
            A full-width header bar with title, live status badge, breadcrumbs, back navigation,
            and an actions slot. The &quot;Updated X ago&quot; timestamp auto-ticks every 15 seconds.
          </p>
          <ImportStatement
            components={["DashboardHeader"]}
            className="mt-4"
          />
        </div>

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use DashboardHeader at the top of every dashboard page. It provides a consistent
          identity bar with the dashboard title, an optional subtitle, a live/stale/offline
          status indicator, and a right-aligned slot for action buttons or controls like{" "}
          <a href="/docs/period-selector" className="font-medium text-[var(--accent)] hover:underline">
            PeriodSelector
          </a>
          . Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lastUpdated</code> date
          and the header will automatically display &quot;Updated Xm ago&quot; text that re-renders
          every 15 seconds — no polling logic required on your side.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<DashboardHeader
  title="Revenue Overview"
  subtitle="North America region"
/>`}
          >
            <div className="w-full">
              <DashboardHeader
                title="Revenue Overview"
                subtitle="North America region"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Status Badges */}
        <DocSection id="status-badges" title="Status Badges">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lastUpdated</code>{" "}
            date to show an auto-ticking &quot;Updated X ago&quot; label. The status badge is
            automatically derived:{" "}
            <strong>live</strong> when the data is fresh,{" "}
            <strong>stale</strong> when it exceeds{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">staleAfter</code>{" "}
            minutes (default: 5). You can also set{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">status</code>{" "}
            explicitly to override auto-derivation.
          </p>
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Live (just updated)</p>
              <DashboardHeader
                title="Sales Dashboard"
                subtitle="Real-time pipeline"
                lastUpdated={new Date()}
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Stale (updated 10 minutes ago)</p>
              <DashboardHeader
                title="Sales Dashboard"
                subtitle="Real-time pipeline"
                lastUpdated={new Date(Date.now() - 10 * 60_000)}
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Offline (explicit status)</p>
              <DashboardHeader
                title="Sales Dashboard"
                subtitle="Connection lost"
                status="offline"
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading (explicit status)</p>
              <DashboardHeader
                title="Sales Dashboard"
                status="loading"
              />
            </div>
          </div>
          <CodeBlock
            code={`// Auto-derived from lastUpdated
<DashboardHeader
  title="Sales Dashboard"
  lastUpdated={new Date()}          // "live" badge + "Updated just now"
  staleAfter={5}                    // turns "stale" after 5 min (default)
/>

// Explicit status override
<DashboardHeader
  title="Sales Dashboard"
  status="offline"
/>`}
            className="mt-4"
          />
        </DocSection>

        {/* Back Navigation */}
        <DocSection id="back-navigation" title="Back Navigation">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">back</code>{" "}
            prop renders an arrow-left link above the title. Pass an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">href</code> for link navigation
            or an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">onClick</code> for programmatic routing.
            The back link is hidden when{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">breadcrumbs</code>{" "}
            are also provided (breadcrumbs take precedence).
          </p>
          <ComponentExample
            code={`<DashboardHeader
  title="Order #12847"
  subtitle="Placed Jan 15, 2026"
  back={{ href: "/orders", label: "All Orders" }}
/>`}
          >
            <div className="w-full">
              <DashboardHeader
                title="Order #12847"
                subtitle="Placed Jan 15, 2026"
                back={{ href: "#", label: "All Orders" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Breadcrumbs */}
        <DocSection id="breadcrumbs" title="Breadcrumbs">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass an array of{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">BreadcrumbItem</code>{" "}
            objects to render a breadcrumb trail above the title. Each item can have an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">href</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">onClick</code>, or neither (plain text).
            The last item is automatically styled as the current page.
          </p>
          <ComponentExample
            code={`<DashboardHeader
  title="Q1 Revenue"
  subtitle="North America"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Dashboards", href: "/dashboards" },
    { label: "Q1 Revenue" },
  ]}
  lastUpdated={new Date()}
/>`}
          >
            <div className="w-full">
              <DashboardHeader
                title="Q1 Revenue"
                subtitle="North America"
                breadcrumbs={[
                  { label: "Home", href: "#" },
                  { label: "Dashboards", href: "#" },
                  { label: "Q1 Revenue" },
                ]}
                lastUpdated={new Date()}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Actions Slot */}
        <DocSection id="actions-slot" title="Actions Slot">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">actions</code>{" "}
            prop accepts any React node and renders it right-aligned. Use it for buttons,
            dropdowns, a PeriodSelector, or any other control your dashboard needs.
          </p>
          <ComponentExample
            code={`<DashboardHeader
  title="Team Performance"
  subtitle="Engineering"
  lastUpdated={new Date()}
  actions={
    <>
      <button className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
        Export
      </button>
      <button className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs text-white">
        Share
      </button>
    </>
  }
/>`}
          >
            <div className="w-full">
              <DashboardHeader
                title="Team Performance"
                subtitle="Engineering"
                lastUpdated={new Date()}
                actions={
                  <>
                    <button className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                      Export
                    </button>
                    <button className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs text-white">
                      Share
                    </button>
                  </>
                }
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Dense Mode */}
        <DocSection id="dense-mode" title="Dense Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dense</code>{" "}
            prop reduces the title size for tighter layouts. Also inherits from{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">MetricProvider</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Normal</p>
              <DashboardHeader
                title="Revenue Overview"
                subtitle="North America"
                lastUpdated={new Date()}
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Dense</p>
              <DashboardHeader
                title="Revenue Overview"
                subtitle="North America"
                lastUpdated={new Date()}
                dense
              />
            </div>
          </div>
          <CodeBlock
            code={`<DashboardHeader title="Revenue" dense />

// or via MetricProvider
<MetricProvider dense>
  <DashboardHeader title="Revenue" /> {/* inherits dense */}
</MetricProvider>`}
            className="mt-4"
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "title", type: "string", default: "(required)", description: "Dashboard title displayed as an h1." },
              { prop: "subtitle", type: "string", default: "\u2014", description: "Secondary label below the title." },
              { prop: "description", type: "string | ReactNode", default: "\u2014", description: "Content for the info popover beside the title." },
              { prop: "lastUpdated", type: "Date", default: "\u2014", description: 'Enables the auto-ticking "Updated Xm ago" label. Also auto-derives the status badge.' },
              { prop: "staleAfter", type: "number", default: "5", description: "Minutes before lastUpdated turns the status to stale (amber)." },
              { prop: "status", type: '"live" | "stale" | "offline" | "loading"', default: "\u2014", description: "Explicit status badge. Overrides auto-derivation from lastUpdated." },
              { prop: "back", type: "{ href?, label?, onClick? }", default: "\u2014", description: "Renders a back-arrow link above the title. Hidden when breadcrumbs are set." },
              { prop: "breadcrumbs", type: "BreadcrumbItem[]", default: "\u2014", description: "Breadcrumb trail above the title. Each item: { label, href?, onClick? }." },
              { prop: "actions", type: "ReactNode", default: "\u2014", description: "Right-aligned action slot for buttons, controls, or dropdowns." },
              { prop: "variant", type: "CardVariant", default: "\u2014", description: "Card variant override. Falls back to MetricProvider." },
              { prop: "dense", type: "boolean", default: "false", description: "Compact title size. Falls back to MetricProvider." },
              { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes on the root element." },
              { prop: "classNames", type: "{ root?, title?, subtitle?, ... }", default: "\u2014", description: "Sub-element class name overrides for fine-grained styling." },
              { prop: "id", type: "string", default: "\u2014", description: "HTML id attribute." },
              { prop: "data-testid", type: "string", default: "\u2014", description: "Test id for automated testing." },
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
              'The "Updated X ago" label auto-ticks every 15 seconds via an internal interval. No polling or manual re-renders needed on your side.',
              "Status is auto-derived from lastUpdated and staleAfter when you don't set status explicitly. Fresh data shows a green pulsing \"Live\" badge; stale data shows amber \"Stale\".",
              "The back link is automatically hidden when breadcrumbs are provided, so you don't need to conditionally render one or the other.",
              "DashboardHeader uses forwardRef and passes through id, data-testid, and className.",
              "Dense mode can be set per-component or inherited from MetricProvider.",
              "The component is wrapped in an error boundary. If it throws, a fallback message is rendered instead of crashing the page.",
              "The classNames prop lets you target individual sub-elements (title, subtitle, breadcrumbs, status, actions) for custom styling without overriding the root.",
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
              { name: "Dashboard", desc: "All-in-one wrapper that sets up providers and renders DashboardHeader at the top." },
              { name: "DashboardNav", desc: "Tabbed navigation for switching dashboard views. Often placed directly below DashboardHeader." },
              { name: "FilterBar", desc: "Filter container with Primary/Secondary slots. Pairs with DashboardHeader for a complete top bar." },
              { name: "MetricGrid", desc: "Responsive grid for KPI cards and charts. The main content area below the header." },
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
