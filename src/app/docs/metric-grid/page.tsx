"use client";

import { MetricGrid } from "@/components/layout/MetricGrid";
import { KpiCard } from "@/components/cards/KpiCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DataTable } from "@/components/tables/DataTable";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("metric-grid")!;

const tocItems: TocItem[] = [
  { id: "when-to-use", title: "When to Use", level: 2 },
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "sections", title: "MetricGrid.Section", level: 2 },
  { id: "item-overrides", title: "MetricGrid.Item", level: 2 },
  { id: "auto-detection", title: "Auto-Detection", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// Sample data for live examples
const revenueData = [
  { date: "Jan", revenue: 12400, cost: 8200 },
  { date: "Feb", revenue: 15800, cost: 9100 },
  { date: "Mar", revenue: 14200, cost: 8600 },
  { date: "Apr", revenue: 18900, cost: 10200 },
  { date: "May", revenue: 21300, cost: 11800 },
  { date: "Jun", revenue: 19700, cost: 10900 },
];

const channelData = [
  { channel: "Organic", visits: 12400 },
  { channel: "Paid", visits: 8600 },
  { channel: "Social", visits: 5200 },
  { channel: "Referral", visits: 3100 },
];

const tableData = [
  { page: "/pricing", views: 12840, bounce: "32%" },
  { page: "/docs", views: 9420, bounce: "18%" },
  { page: "/blog/launch", views: 7210, bounce: "45%" },
  { page: "/signup", views: 5830, bounce: "12%" },
];

const tableColumns = [
  { key: "page", header: "Page" },
  { key: "views", header: "Views", format: "number" as const },
  { key: "bounce", header: "Bounce Rate" },
];

export default function MetricGridDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <DocSection id="when-to-use" title="When to Use">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Use MetricGrid as the auto-layout container for dashboards. Drop MetricUI
            components in and it figures out the layout — KPI cards go in equal-width rows,
            charts split side-by-side, tables go full width. No Tailwind grid classes, no
            manual column math, no responsive breakpoints to manage. Override individual
            items with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
              MetricGrid.Item
            </code>{" "}
            when the auto-layout is not what you want.
          </p>
        </DocSection>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            A typical dashboard with KPI cards, charts, and a table. MetricGrid detects
            each component type and assigns the right width automatically.
          </p>
          <ComponentExample
            code={`<MetricGrid>
  <KpiCard title="Revenue" value={78400} format="currency" comparison={{ value: 65200 }} />
  <KpiCard title="Users" value={3200} format="number" comparison={{ value: 2800 }} />
  <KpiCard title="Conversion" value={4.2} format="percent" comparison={{ value: 3.8 }} />

  <AreaChart
    data={revenueData}
    index="date"
    categories={["revenue", "cost"]}
    title="Revenue vs Cost"
    format="currency"
  />
  <BarChart
    data={channelData}
    index="channel"
    categories={["visits"]}
    title="Traffic by Channel"
  />

  <DataTable data={tableData} columns={columns} title="Top Pages" />
</MetricGrid>`}
          >
            <div className="w-full">
              <MetricGrid>
                <KpiCard title="Revenue" value={78400} format="currency" comparison={{ value: 65200 }} />
                <KpiCard title="Users" value={3200} format="number" comparison={{ value: 2800 }} />
                <KpiCard title="Conversion" value={4.2} format="percent" comparison={{ value: 3.8 }} />

                <AreaChart
                  data={revenueData}
                  index="date"
                  categories={["revenue", "cost"]}
                  title="Revenue vs Cost"
                  format="currency"
                />
                <BarChart
                  data={channelData}
                  index="channel"
                  categories={["visits"]}
                  title="Traffic by Channel"
                />

                <DataTable data={tableData} columns={tableColumns} title="Top Pages" />
              </MetricGrid>
            </div>
          </ComponentExample>
        </DocSection>

        {/* MetricGrid.Section */}
        <DocSection id="sections" title="MetricGrid.Section">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
              MetricGrid.Section
            </code>{" "}
            renders a full-width labeled divider between groups of components. It delegates
            to{" "}
            <a href="/docs/section-header" className="font-medium text-[var(--accent)] hover:underline">
              SectionHeader
            </a>{" "}
            internally, so it supports all the same props: subtitle, description, action, badge, and border.
          </p>
          <ComponentExample
            code={`<MetricGrid>
  <MetricGrid.Section title="Overview" subtitle="Key metrics at a glance" />
  <KpiCard title="Revenue" value={78400} format="currency" />
  <KpiCard title="Users" value={3200} />
  <KpiCard title="Conversion" value={4.2} format="percent" />

  <MetricGrid.Section title="Trends" border />
  <AreaChart data={revenueData} index="date" categories={["revenue"]} title="Revenue Over Time" />

  <MetricGrid.Section title="Details" border />
  <DataTable data={tableData} columns={columns} title="Top Pages" />
</MetricGrid>`}
          >
            <div className="w-full">
              <MetricGrid>
                <MetricGrid.Section title="Overview" subtitle="Key metrics at a glance" />
                <KpiCard title="Revenue" value={78400} format="currency" />
                <KpiCard title="Users" value={3200} />
                <KpiCard title="Conversion" value={4.2} format="percent" />

                <MetricGrid.Section title="Trends" border />
                <AreaChart
                  data={revenueData}
                  index="date"
                  categories={["revenue"]}
                  title="Revenue Over Time"
                  format="currency"
                />

                <MetricGrid.Section title="Details" border />
                <DataTable data={tableData} columns={tableColumns} title="Top Pages" />
              </MetricGrid>
            </div>
          </ComponentExample>
        </DocSection>

        {/* MetricGrid.Item */}
        <DocSection id="item-overrides" title="MetricGrid.Item">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Wrap any child in{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
              MetricGrid.Item
            </code>{" "}
            to override the auto-detected width. The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">span</code>{" "}
            prop accepts{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;sm&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;md&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;lg&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;full&quot;</code>,{" "}
            or a number from 1 to 12.
          </p>
          <CodeBlock
            code={`<MetricGrid>
  <KpiCard title="Revenue" value={78400} format="currency" />
  <KpiCard title="Users" value={3200} />

  {/* Force this chart to full width instead of auto-pairing */}
  <MetricGrid.Item span="full">
    <AreaChart data={data} title="Revenue Over Time" />
  </MetricGrid.Item>

  <DataTable data={tableData} title="Details" />
</MetricGrid>`}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Span</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)]">Behavior</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  { span: '"sm"', desc: "1/4 width" },
                  { span: '"md"', desc: "1/3 width" },
                  { span: '"lg"', desc: "2/3 width" },
                  { span: '"full"', desc: "Full width" },
                  { span: "1-12", desc: "Explicit column count out of 12" },
                ].map((row) => (
                  <tr key={row.span} className="border-b border-[var(--card-border)]/50">
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)]">
                      {row.span}
                    </td>
                    <td className="py-2">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* Auto-Detection */}
        <DocSection id="auto-detection" title="Auto-Detection">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricGrid inspects each child&apos;s component type to decide how to lay it out. It checks
            for a static{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">__gridHint</code>{" "}
            property first, then falls back to matching the component&apos;s{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">displayName</code>.
            Unknown component types default to full width, so custom components are never broken.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Component</th>
                  <th className="pb-2 pr-4 font-semibold text-[var(--foreground)]">Grid Hint</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)]">Layout Behavior</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  { comp: "KpiCard", hint: "kpi", layout: "Equal-width row with other KPIs (up to 4 per row)" },
                  { comp: "Gauge", hint: "gauge", layout: "Equal-width row with other small items" },
                  { comp: "StatGroup", hint: "stat", layout: "Full width" },
                  { comp: "AreaChart, LineChart, BarChart, BarLineChart, DonutChart, HeatMap, Funnel", hint: "chart", layout: "Two charts: 2:1 split. Three charts: equal thirds. Single chart: full width" },
                  { comp: "DataTable", hint: "table", layout: "Full width" },
                  { comp: "DashboardHeader", hint: "header", layout: "Full width" },
                  { comp: "MetricGrid.Section", hint: "full", layout: "Full width (labeled divider)" },
                  { comp: "Unknown / custom", hint: "unknown", layout: "Full width (safe default)" },
                ].map((row) => (
                  <tr key={row.comp} className="border-b border-[var(--card-border)]/50">
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)]">
                      {row.comp}
                    </td>
                    <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-[12px]">
                      {row.hint}
                    </td>
                    <td className="py-2">{row.layout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            To make your own custom component auto-detected, set the static{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">__gridHint</code>{" "}
            property:
          </p>
          <CodeBlock
            code={`import type { GridHint } from "metricui";

function MyCustomChart(props) {
  return <div>...</div>;
}
MyCustomChart.__gridHint = "chart" as GridHint;

// Now MetricGrid will treat it like any other chart`}
            className="mt-2"
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />

          <h3 className="mt-8 mb-3 text-[15px] font-semibold text-[var(--foreground)]">
            MetricGrid.Section Props
          </h3>
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
                  { prop: "title", type: "string", def: "(required)", desc: "Section label." },
                  { prop: "subtitle", type: "string", def: "\u2014", desc: "Secondary label below the title." },
                  { prop: "description", type: "string | ReactNode", def: "\u2014", desc: "Content for the info popover." },
                  { prop: "action", type: "ReactNode", def: "\u2014", desc: "Right-aligned action slot." },
                  { prop: "badge", type: "ReactNode", def: "\u2014", desc: "Inline badge after the title." },
                  { prop: "border", type: "boolean", def: "false", desc: "Show a border line above the section." },
                  { prop: "className", type: "string", def: "\u2014", desc: "Additional CSS classes." },
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

          <h3 className="mt-8 mb-3 text-[15px] font-semibold text-[var(--foreground)]">
            MetricGrid.Item Props
          </h3>
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
                  { prop: "span", type: '"sm" | "md" | "lg" | "full" | number', def: "\u2014", desc: "Override the auto-detected column width." },
                  { prop: "children", type: "ReactNode", def: "(required)", desc: "The component to render." },
                  { prop: "className", type: "string", def: "\u2014", desc: "Additional CSS classes." },
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
            {component.notes.map((note, i) => (
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

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
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
