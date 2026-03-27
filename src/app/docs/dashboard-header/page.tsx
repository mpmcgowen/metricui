"use client";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("dashboard-header")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "status-badges", title: "Status Badges", level: 2 },
  { id: "back-navigation", title: "Back Navigation", level: 2 },
  { id: "breadcrumbs", title: "Breadcrumbs", level: 2 },
  { id: "actions-slot", title: "Actions Slot", level: 2 },
  { id: "dense-mode", title: "Dense Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function DashboardHeaderDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

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
