"use client";

import { DocSection } from "@/components/docs/DocSection";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { ComparisonDemo } from "@/components/docs/ComparisonDemo";
import { SHADCN_CODE } from "@/components/docs/competitor-code";
import { RechartsChart } from "@/components/docs/competitor-charts/RechartsChart";

const tocItems: TocItem[] = [
  { id: "tldr", title: "TL;DR", level: 2 },
  { id: "what-is-shadcn", title: "What is shadcn/ui Charts?", level: 2 },
  { id: "what-is-metricui", title: "What is MetricUI?", level: 2 },
  { id: "philosophy", title: "Philosophy: Own It vs. Ship It", level: 2 },
  { id: "chart-types", title: "Chart Types", level: 2 },
  { id: "code-you-write", title: "The Code You Write", level: 2 },
  { id: "dashboard-features", title: "Dashboard Features", level: 2 },
  { id: "theming", title: "Theming", level: 2 },
  { id: "accessibility", title: "Accessibility", level: 2 },
  { id: "comparison-table", title: "Comparison Table", level: 2 },
  { id: "when-shadcn", title: "When to Choose shadcn/ui Charts", level: 2 },
  { id: "when-metricui", title: "When to Choose MetricUI", level: 2 },
  { id: "see-it-live", title: "See It In Action", level: 2 },
  { id: "bottom-line", title: "The Bottom Line", level: 2 },
];

export default function ShadcnCompare() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-5xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Compare
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MetricUI vs shadcn/ui Charts
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          shadcn/ui changed how developers think about component libraries. Its
          copy-paste philosophy puts you in full control of every line. But when
          the goal is a production dashboard, control and speed pull in opposite
          directions. Here is an honest look at how MetricUI vs shadcn/ui Charts
          compare for analytics and data visualization work.
        </p>

        {/* ── TL;DR ─────────────────────────────────────────────── */}
        <DocSection id="tldr" title="TL;DR">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui Charts gives you a thin Recharts wrapper with 6 chart
            categories, a copy-paste workflow, and total code ownership. MetricUI
            gives you 18 chart types, a complete filter/drill-down/export stack,
            dashboard layout primitives, and AI insights &mdash; all through
            props, not code you maintain. If you are building a marketing site
            with a chart or two, shadcn is a fine choice. If you are building a
            dashboard, MetricUI ships it in a fraction of the time and code.
          </p>
        </DocSection>

        {/* ── What is shadcn/ui Charts? ──────────────────────────── */}
        <DocSection id="what-is-shadcn" title="What is shadcn/ui Charts?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui is not a component library in the traditional sense. It is
            a curated collection of copy-paste components built on Radix UI and
            Tailwind CSS. The charts section follows the same model: you run{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              npx shadcn add chart
            </code>{" "}
            to install a thin abstraction layer &mdash; ChartContainer,
            ChartConfig, ChartTooltip, ChartLegend &mdash; and then copy raw
            Recharts code from the docs into your project.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The underlying engine is Recharts (updated to v3). shadcn provides
            roughly 68 chart examples across 6 categories: Area, Bar, Line, Pie,
            Radar, and Radial. Everything else &mdash; data transformation,
            layout, state management, interactivity &mdash; is your
            responsibility. That is the point. You own every line.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            With approximately 729K CLI downloads per month, shadcn/ui has
            enormous mindshare. It is, without question, the most culturally
            influential component project in the React ecosystem right now.
          </p>
        </DocSection>

        {/* ── What is MetricUI? ──────────────────────────────────── */}
        <DocSection id="what-is-metricui" title="What is MetricUI?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a purpose-built dashboard component library. It ships 31
            components, 5 providers, and 15+ hooks as a single npm package. All
            18 chart types are backed by Nivo. Filters, cross-filtering,
            drill-down, export, layout, and AI insights are built in and wired
            together through React context.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The philosophy is different from shadcn: instead of owning the code,
            you own the data and the configuration. MetricUI handles rendering,
            interactivity, theming, accessibility, and state &mdash; you pass
            props and plug in your data source. It is a product, not a pattern.
          </p>
        </DocSection>

        {/* ── Philosophy ─────────────────────────────────────────── */}
        <DocSection id="philosophy" title="Philosophy: Own It vs. Ship It">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui&apos;s core insight is that developers do not want a black
            box. They want to read the source, modify it, and never worry about
            upstream breaking changes. For general UI &mdash; buttons, dialogs,
            dropdowns &mdash; this is a genuinely great model. You copy the code,
            it becomes yours, and you move on.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For charts and dashboards, the calculus changes. A chart is not a
            button. It has axes, legends, tooltips, responsive sizing, animation,
            accessibility attributes, color scales, data state handling (loading,
            empty, error), and interaction layers. When you &ldquo;own&rdquo;
            that code, you also own every bug fix, every Recharts migration, and
            every edge case across every viewport.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI takes the opposite position: you should own the wiring, not
            the rendering. Your code defines what data to show, how to filter it,
            and what happens on interaction. The library handles the 200 things
            that make a chart production-ready. This is not laziness &mdash; it
            is leverage.
          </p>
        </DocSection>

        {/* ── Chart Types ────────────────────────────────────────── */}
        <DocSection id="chart-types" title="Chart Types">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui Charts covers the basics well. If you need a bar chart, a
            line chart, or a pie chart, the examples are polished and easy to
            copy. But the catalog stops at 6 categories.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">
                    Chart Type
                  </th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">
                    shadcn/ui
                  </th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">
                    MetricUI
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ["Area", true, true],
                  ["Bar", true, true],
                  ["Line", true, true],
                  ["Pie / Donut", true, true],
                  ["Radar", true, true],
                  ["Radial", true, true],
                  ["Gauge", false, true],
                  ["Funnel", false, true],
                  ["Treemap", false, true],
                  ["Heatmap", false, true],
                  ["Scatter", false, true],
                  ["Sankey", false, true],
                  ["Waterfall", false, true],
                  ["Bullet", false, true],
                  ["Sparkline", false, true],
                  ["Calendar", false, true],
                  ["Choropleth", false, true],
                  ["Bump", false, true],
                ].map(([type, shadcn, metric]) => (
                  <tr
                    key={type as string}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-4 py-2">{type as string}</td>
                    <td className="px-4 py-2 text-center">
                      {shadcn ? (
                        <span className="text-emerald-500">Yes</span>
                      ) : (
                        <span className="text-[var(--muted)] opacity-40">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {metric ? (
                        <span className="text-emerald-500">Yes</span>
                      ) : (
                        <span className="text-[var(--muted)] opacity-40">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI covers 18 chart types. shadcn/ui Charts covers 6. If you
            need a Gauge, Funnel, Heatmap, Sankey, Treemap, Waterfall, Bullet,
            Sparkline, Calendar, Choropleth, or Bump chart, shadcn/ui simply does
            not have them &mdash; and since there is no abstraction to extend,
            you would be writing raw Recharts (or switching to another library
            entirely).
          </p>
        </DocSection>

        {/* ── The Code You Write ─────────────────────────────────── */}
        <DocSection id="code-you-write" title="The Code You Write">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is where the comparison gets concrete. Below is a standard bar
            chart in both libraries, rendering the same data with a tooltip and
            axis labels.
          </p>

          <DocSection id="shadcn-code" title="shadcn/ui Charts" level={3}>
            <pre className="mb-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card-glow)] p-4 text-[13px] leading-relaxed text-[var(--foreground)]">
              <code>{`"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 45200 },
  { month: "Mar", revenue: 48100 },
  { month: "Apr", revenue: 51800 },
  { month: "May", revenue: 49200 },
  { month: "Jun", revenue: 55400 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig}
      className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}`}</code>
            </pre>
            <p className="mb-6 text-[13px] text-[var(--muted)]">
              ~42 lines. You are composing Recharts primitives inside a shadcn
              container. Every axis option, tooltip behavior, and style is manual
              configuration. This is a single chart &mdash; no filters, no
              export, no data states.
            </p>
          </DocSection>

          <DocSection id="metricui-code" title="MetricUI" level={3}>
            <pre className="mb-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card-glow)] p-4 text-[13px] leading-relaxed text-[var(--foreground)]">
              <code>{`import { BarChart } from "@metricui/core"

const data = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 45200 },
  { month: "Mar", revenue: 48100 },
  { month: "Apr", revenue: 51800 },
  { month: "May", revenue: 49200 },
  { month: "Jun", revenue: 55400 },
]

export function RevenueChart() {
  return (
    <BarChart
      data={data}
      index="month"
      categories={["revenue"]}
    />
  )
}`}</code>
            </pre>
            <p className="mb-6 text-[13px] text-[var(--muted)]">
              ~18 lines, including the data array. The chart renders with
              sensible defaults: responsive sizing, tooltip, axis labels, theme
              colors, ARIA attributes, and animation. You did not configure any
              of that &mdash; but you can override all of it through props.
            </p>
          </DocSection>

          <DocSection
            id="dashboard-code"
            title="Now Scale to a Dashboard"
            level={3}
          >
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              A real dashboard has 4 charts, a row of KPI cards, a data table,
              filters, and export. In shadcn/ui, you are assembling that from
              scratch: composing Recharts primitives for each chart, building
              your own KPI cards from the generic Card component, wiring filter
              state manually, and implementing export yourself. A conservative
              estimate is 300&ndash;500+ lines of presentation code that you now
              maintain.
            </p>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              In MetricUI, the same dashboard is a composition of pre-built
              components inside a MetricProvider and MetricGrid. Filters are
              wired through context. Export works out of the box. The total is
              typically 80&ndash;120 lines.
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              The difference is not just initial velocity. Six months from now,
              when you need to add a new filter or swap a chart type, MetricUI is
              a prop change. In shadcn, it is a refactor of code you copied and
              may have since modified.
            </p>
          </DocSection>
        </DocSection>

        {/* ── Dashboard Features ─────────────────────────────────── */}
        <DocSection id="dashboard-features" title="Dashboard Features">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui Charts is a chart library. MetricUI is a dashboard
            framework. The gap is everything that surrounds the chart.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">
                    Feature
                  </th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">
                    shadcn/ui
                  </th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">
                    MetricUI
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ["KPI Cards", "Build from Card", "Dedicated component"],
                  ["Filter System", "DIY", "FilterProvider + 4 filter types"],
                  ["Cross-Filtering", "No", "CrossFilterProvider + hooks"],
                  ["Linked Hover", "No", "Built-in"],
                  ["Drill-Down", "No", "4-level drill-down"],
                  ["Export (PNG/CSV)", "No", "Built-in"],
                  ["Dashboard Layout", "No", "MetricGrid auto-layout"],
                  ["Dashboard Shell", "Example page", "Dashboard wrapper component"],
                  ["Data States", "No", "Loading / empty / error built-in"],
                  ["AI Insights", "No", "Bring-your-own-LLM"],
                  ["MCP Server", "No", "AI-assisted generation"],
                ].map(([feature, shadcn, metric]) => (
                  <tr
                    key={feature as string}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-4 py-2">{feature as string}</td>
                    <td className="px-4 py-2 text-center">
                      {shadcn as string}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {metric as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Every row marked &ldquo;No&rdquo; or &ldquo;DIY&rdquo; in the
            shadcn column represents code you will write and maintain yourself.
            Some of these &mdash; cross-filtering, drill-down, export &mdash;
            are non-trivial features that take days to build well. MetricUI ships
            them as props.
          </p>
        </DocSection>

        {/* ── Theming ────────────────────────────────────────────── */}
        <DocSection id="theming" title="Theming">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui Charts uses CSS custom properties for chart colors:{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              --chart-1
            </code>{" "}
            through{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              --chart-5
            </code>
            . This gives you five color slots that you override in your CSS.
            Layout, typography, spacing, and component styling are all manual.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI provides 8 built-in theme presets (indigo, emerald, rose,
            amber, cyan, violet, slate, orange) plus support for fully custom
            themes. Switching is a single prop on MetricProvider. Themes control
            colors, surfaces, borders, radii, and typographic treatment
            consistently across every component &mdash; charts, cards, tables,
            filters, and layout.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Runtime theme switching (for user preferences or multi-tenant
            dashboards) is built in. With shadcn/ui, you would implement that
            yourself.
          </p>
        </DocSection>

        {/* ── Accessibility ──────────────────────────────────────── */}
        <DocSection id="accessibility" title="Accessibility">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Accessibility in data visualization is hard. Charts are inherently
            visual, and making them perceivable to screen readers and navigable
            by keyboard requires deliberate engineering.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            An independent accessibility audit of shadcn/ui Charts found WCAG
            failures across multiple success criteria: SC 1.1.1 (non-text
            content), SC 1.3.1 (info and relationships), SC 1.4.1 (use of
            color), and SC 1.4.13 (content on hover or focus). The audit
            described shadcn&apos;s screen reader accessibility claims as
            &ldquo;irresponsible.&rdquo; This does not mean shadcn is careless
            &mdash; accessibility in charts is genuinely difficult, and Recharts
            itself has limitations.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI takes a layered approach: ARIA labels on all chart
            containers, keyboard navigation for interactive elements,{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              prefers-reduced-motion
            </code>{" "}
            respected for animations, and semantic HTML for data tables and KPI
            cards. It is not perfect &mdash; no chart library is &mdash; but
            accessibility is a first-class concern in the component API, not an
            afterthought bolted onto copied code.
          </p>
        </DocSection>

        {/* ── Comparison Table ───────────────────────────────────── */}
        <DocSection id="comparison-table" title="Comparison Table">
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">
                    Dimension
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">
                    shadcn/ui Charts
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">
                    MetricUI
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ["Model", "Copy-paste", "npm package"],
                  ["Engine", "Recharts v3", "Nivo"],
                  ["Chart types", "6 categories", "18 types"],
                  ["KPI component", "Generic Card", "Dedicated KpiCard"],
                  ["Filters", "DIY", "Built-in system"],
                  ["Cross-filtering", "No", "Yes"],
                  ["Drill-down", "No", "4 levels"],
                  ["Export", "No", "PNG / CSV / clipboard"],
                  ["Layout system", "No", "MetricGrid"],
                  ["Themes", "5 CSS vars", "8 presets + custom"],
                  ["AI features", "No", "BYOL insights"],
                  ["Tests", "N/A (your code)", "175+"],
                  ["Accessibility", "WCAG failures noted", "ARIA + keyboard + motion"],
                  ["TypeScript", "Yes", "Yes"],
                  ["License", "MIT", "MIT"],
                  ["Community", "Massive (~729K/mo)", "Newer, growing"],
                  ["Lines per chart", "~40-60", "~8-10"],
                ].map(([dim, shadcn, metric]) => (
                  <tr
                    key={dim as string}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-4 py-2 font-medium text-[var(--foreground)]">
                      {dim as string}
                    </td>
                    <td className="px-4 py-2">{shadcn as string}</td>
                    <td className="px-4 py-2">{metric as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ── When to Choose shadcn/ui ───────────────────────────── */}
        <DocSection
          id="when-shadcn"
          title="When to Choose shadcn/ui Charts"
        >
          <ul className="space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
              <span>
                You are building a marketing site or landing page with 1&ndash;2
                decorative charts and want full visual control.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
              <span>
                Your team already uses shadcn/ui for the rest of the UI and wants
                a consistent copy-paste workflow.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
              <span>
                You need deep, line-level customization of Recharts internals and
                are comfortable maintaining that code.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
              <span>
                You have a strong preference for zero runtime dependencies beyond
                what you copy into your project.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
              <span>
                Community ecosystem matters &mdash; shadcn has a massive pool of
                examples, tutorials, and third-party integrations.
              </span>
            </li>
          </ul>
        </DocSection>

        {/* ── When to Choose MetricUI ────────────────────────────── */}
        <DocSection id="when-metricui" title="When to Choose MetricUI">
          <ul className="space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                You are building a dashboard with multiple charts, KPIs,
                filters, and interactivity &mdash; not a single chart on a page.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                Time-to-ship matters. MetricUI gets a polished dashboard live in
                hours, not weeks.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                You need chart types that shadcn does not offer: Gauge, Funnel,
                Heatmap, Sankey, Treemap, Waterfall, Bullet, Choropleth, or
                Calendar.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                You want cross-filtering, drill-down, and export without
                building them from scratch.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                You want to minimize maintained code. Props over copy-paste means
                fewer lines, fewer bugs, and automatic upgrades.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                Accessibility is a requirement, not an aspiration. MetricUI
                bakes it into every component.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 shrink-0 text-[var(--accent)]">&#10003;</span>
              <span>
                You want AI-assisted dashboard generation via the MCP server or
                AI Insights for end users.
              </span>
            </li>
          </ul>
        </DocSection>

        {/* ── See It In Action ───────────────────────────────────── */}
        <DocSection id="see-it-live" title="See It In Action">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Same dataset. shadcn/ui builds one chart. MetricUI builds a full dashboard.
            Download the CSV and try it yourself.
          </p>
          <ComparisonDemo competitorCode={SHADCN_CODE} competitorName="shadcn/ui" competitorChart={<RechartsChart />} />
        </DocSection>

        {/* ── The Bottom Line ────────────────────────────────────── */}
        <DocSection id="bottom-line" title="The Bottom Line">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            shadcn/ui is a philosophy: own your code, compose from primitives,
            never be locked in. It is a genuinely great approach for general UI
            work, and its cultural impact on the React ecosystem is undeniable.
            For charts on a marketing page or a blog, it works.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a product: ship your dashboard, configure through props,
            move on to the next problem. It exists because dashboards are not a
            composition of isolated charts &mdash; they are interconnected
            systems of data, filters, interactions, and layout. Building that
            system from copied Recharts snippets is possible. It is also slow,
            fragile, and expensive to maintain.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The question is not which library is better. It is what you are
            building. If the answer is &ldquo;a dashboard,&rdquo; MetricUI was
            purpose-built for that. If the answer is &ldquo;a website that
            happens to have a chart,&rdquo; shadcn might be all you need.
          </p>
        </DocSection>
      </div>

      <aside className="sticky top-8 hidden h-fit w-48 shrink-0 py-8 pl-4 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  );
}
