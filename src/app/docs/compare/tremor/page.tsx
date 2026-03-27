"use client";

import { ComparisonDemo } from "@/components/docs/ComparisonDemo";
import { TREMOR_CODE } from "@/components/docs/competitor-code";
import { TremorChart } from "@/components/docs/competitor-charts/TremorChart";
import { DocSection } from "@/components/docs/DocSection";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const tocItems: TocItem[] = [
  { id: "tldr", title: "TL;DR", level: 2 },
  { id: "what-is-tremor", title: "What is Tremor?", level: 2 },
  { id: "what-is-metricui", title: "What is MetricUI?", level: 2 },
  { id: "acquisition-factor", title: "The Acquisition Factor", level: 2 },
  { id: "dashboard-components", title: "Dashboard Components", level: 2 },
  { id: "chart-types", title: "Chart Types", level: 2 },
  { id: "theming", title: "Theming & Customization", level: 2 },
  { id: "interactivity", title: "Interactivity", level: 2 },
  { id: "developer-experience", title: "Developer Experience", level: 2 },
  { id: "comparison-table", title: "Comparison Table", level: 2 },
  { id: "when-tremor", title: "When to Choose Tremor", level: 2 },
  { id: "when-metricui", title: "When to Choose MetricUI", level: 2 },
  { id: "see-it-live", title: "See It In Action", level: 2 },
  { id: "bottom-line", title: "The Bottom Line", level: 2 },
];

export default function TremorCompare() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-5xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Compare
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MetricUI vs Tremor
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Two React dashboard libraries with different philosophies, different
          chart engines, and very different trajectories. Here is an honest
          comparison to help you pick the right tool for your next analytics
          project.
        </p>

        {/* ── TL;DR ──────────────────────────────────────────────── */}
        <DocSection id="tldr" title="TL;DR">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor is a beautifully designed dashboard component library that
            gained well-deserved traction in the React ecosystem. It ships clean
            Tailwind-based components and was backed by Y Combinator before being
            acquired by Vercel in January 2025. Since the acquisition, active
            development has slowed and the project has pivoted toward a
            copy-paste model.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI takes a different approach: purpose-built for data-heavy
            dashboards with 18 chart types, cross-filtering, drill-down, export,
            AI insights, and a complete theming system with runtime switching.
            It is newer and has a smaller community, but it covers significantly
            more ground for teams building production analytics interfaces.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            If you need a lightweight set of chart primitives and you are
            comfortable building dashboard wiring yourself, Tremor is a solid
            starting point. If you want a complete dashboard framework with
            interactivity, layout, and AI baked in, MetricUI is the more
            comprehensive choice.
          </p>
        </DocSection>

        {/* ── What is Tremor? ────────────────────────────────────── */}
        <DocSection id="what-is-tremor" title="What is Tremor?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor launched as an open-source React library focused on making it
            easy to build dashboards with Tailwind CSS. It earned a loyal
            following for good reason: the components looked great out of the
            box, the API was approachable, and the Tailwind-native styling made
            it feel at home in modern React projects.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor ships around 45 total components, though many of those are
            general-purpose UI primitives like Button, Input, Switch, and Dialog.
            The visualization layer includes roughly 11 chart types &mdash; Area,
            Bar, Combo, Line, Donut, Bar List, Category Bar, Progress Bar,
            Progress Circle, Spark Chart, and Tracker &mdash; all built on top
            of Recharts.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The library also comes with Blocks: over 300 pre-built templates
            that were open-sourced after the Vercel acquisition. These are useful
            starting points for common dashboard layouts, and they are now
            completely free.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Today, Tremor exists across two repositories. The original npm
            package (<code className="text-[13px] text-[var(--foreground)]">@tremor/react</code>,
            v3.18.7, last updated January 2025) and a newer copy-paste
            repository modeled after shadcn/ui (last commit October 2025). The
            npm package still sees around 220K weekly downloads.
          </p>
        </DocSection>

        {/* ── What is MetricUI? ──────────────────────────────────── */}
        <DocSection id="what-is-metricui" title="What is MetricUI?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a React component library built specifically for
            analytics dashboards. Where Tremor provides chart primitives and
            leaves dashboard orchestration to the developer, MetricUI ships the
            full stack: charts, KPI cards, data tables, filters, cross-filtering,
            drill-down, export, layout, theming, and AI-powered insights.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The library includes 31 components, 5 providers, and 15+ hooks. All
            18 chart types are backed by Nivo, which means consistent rendering,
            animations, and accessibility across every visualization. The theming
            system ships 8 presets with runtime switching via a single provider
            prop.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI also ships an MCP server, which means AI coding assistants
            can generate complete, valid dashboards using the library without
            hallucinating props or inventing components. It is newer and has a
            smaller community than Tremor, but it is actively developed and
            purpose-built for the dashboard use case.
          </p>
        </DocSection>

        {/* ── The Acquisition Factor ─────────────────────────────── */}
        <DocSection id="acquisition-factor" title="The Acquisition Factor">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            On January 22, 2025, Vercel announced the acquisition of Tremor.
            This was a validation of the project&apos;s design quality and
            community traction. The Tremor founders joined Vercel and now
            contribute to Vercel&apos;s product suite.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For users evaluating MetricUI vs Tremor, the acquisition introduces
            a practical question: what does the roadmap look like? Since January
            2025, the npm package has not received a new release. The copy-paste
            repository saw its last commit in October 2025. Blocks were
            open-sourced, which is genuinely generous, but net-new feature
            development has slowed considerably.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This does not mean Tremor is abandoned. The code still works, the
            components are still well-built, and 220K weekly downloads show
            healthy adoption. But teams planning a multi-year investment in a
            dashboard framework should factor in the pace of development and
            whether the features they need in the future will arrive.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is independently maintained and actively shipping. Version
            0.6.1 landed with AI insights, and the roadmap through 1.0 is
            public. That said, independent maintenance comes with its own risks
            &mdash; there is no corporate backing. The trade-off is pace versus
            institutional stability, and it is worth weighing both sides.
          </p>
        </DocSection>

        {/* ── Dashboard Components ───────────────────────────────── */}
        <DocSection id="dashboard-components" title="Dashboard Components">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Both libraries ship visualization components, but they scope the
            problem differently. Tremor bundles general-purpose UI primitives
            alongside its charts. MetricUI focuses exclusively on the dashboard
            layer and assumes you are already using a UI library for buttons,
            inputs, and modals.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Category</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Tremor</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">MetricUI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Total components</td>
                  <td className="px-4 py-2.5">~45 (incl. UI primitives)</td>
                  <td className="px-4 py-2.5">31 + 5 providers + 15+ hooks</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Chart components</td>
                  <td className="px-4 py-2.5">~11</td>
                  <td className="px-4 py-2.5">18</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">KPI / Metric cards</td>
                  <td className="px-4 py-2.5">Basic card + Badge</td>
                  <td className="px-4 py-2.5">KpiCard with sparklines, goals, conditions, comparisons</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Data tables</td>
                  <td className="px-4 py-2.5">Table component</td>
                  <td className="px-4 py-2.5">DataTable + DataRow with sorting, pagination, search</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Dashboard layout</td>
                  <td className="px-4 py-2.5">None (manual grid)</td>
                  <td className="px-4 py-2.5">MetricGrid auto-layout + Dashboard wrapper</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Filter system</td>
                  <td className="px-4 py-2.5">None</td>
                  <td className="px-4 py-2.5">FilterProvider, FilterBar, PeriodSelector, DropdownFilter, SegmentToggle, FilterTags</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Templates / Blocks</td>
                  <td className="px-4 py-2.5">300+ free Blocks</td>
                  <td className="px-4 py-2.5">MCP-generated dashboards</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor&apos;s Blocks are a real strength &mdash; 300+ open-source
            templates give you a fast starting point. MetricUI trades templates
            for composable primitives that wire together automatically via
            context, plus an MCP server that lets AI assistants generate complete
            dashboards from a natural language prompt.
          </p>
        </DocSection>

        {/* ── Chart Types ────────────────────────────────────────── */}
        <DocSection id="chart-types" title="Chart Types">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is one of the biggest differences when comparing MetricUI vs
            Tremor. Tremor covers the essentials well. MetricUI covers those
            plus the specialized chart types that data teams actually need for
            production dashboards.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Chart Type</th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">Tremor</th>
                  <th className="px-4 py-2.5 text-center font-semibold text-[var(--foreground)]">MetricUI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ["Area", true, true],
                  ["Bar", true, true],
                  ["Line", true, true],
                  ["Combo / Dual Axis", true, true],
                  ["Donut / Pie", true, true],
                  ["Spark Chart", true, true],
                  ["Progress Bar", true, true],
                  ["Progress Circle", true, true],
                  ["Bar List", true, true],
                  ["Category Bar", true, false],
                  ["Tracker", true, false],
                  ["Funnel", false, true],
                  ["Treemap", false, true],
                  ["Sankey", false, true],
                  ["Gauge", false, true],
                  ["Scatter / Bubble", false, true],
                  ["HeatMap", false, true],
                  ["Waterfall", false, true],
                  ["Bullet", false, true],
                  ["Radar", false, true],
                ].map(([type, tremor, metric]) => (
                  <tr key={type as string} className="border-b border-[var(--border)]">
                    <td className="px-4 py-2">{type as string}</td>
                    <td className="px-4 py-2 text-center">
                      {tremor ? (
                        <span className="text-emerald-500">Yes</span>
                      ) : (
                        <span className="text-[var(--muted)] opacity-40">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {metric ? (
                        <span className="text-emerald-500">Yes</span>
                      ) : (
                        <span className="text-[var(--muted)] opacity-40">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor&apos;s 11 chart types cover the most common dashboard
            scenarios. If your dashboard is primarily line charts, bar charts,
            and donuts, Tremor handles that well.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI&apos;s 18 chart types are all backed by Nivo, which gives
            you a consistent rendering engine, animation system, and
            accessibility layer across every chart. The specialized types
            &mdash; Funnel, Sankey, Treemap, HeatMap, Waterfall, Bullet, and
            Gauge &mdash; are the charts that data teams ask for once a dashboard
            moves past the prototype stage.
          </p>
        </DocSection>

        {/* ── Theming & Customization ────────────────────────────── */}
        <DocSection id="theming" title="Theming & Customization">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor&apos;s theming story is Tailwind CSS. You style components
            using utility classes and your Tailwind config. This is natural if
            your entire app is Tailwind-based, and it gives you fine-grained
            control at the class level. There are no built-in theme presets, no
            ThemeProvider, and no runtime theme switching.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI takes a different approach with a centralized theming
            system. The <code className="text-[13px] text-[var(--foreground)]">MetricProvider</code>{" "}
            accepts a theme prop that applies one of 8 built-in presets
            &mdash; indigo, emerald, rose, amber, cyan, violet, slate, or
            orange &mdash; or a fully custom theme object. Switching themes at
            runtime is a single prop change.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Feature</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Tremor</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">MetricUI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Theming approach</td>
                  <td className="px-4 py-2.5">Tailwind utility classes</td>
                  <td className="px-4 py-2.5">CSS variables via MetricProvider</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Built-in presets</td>
                  <td className="px-4 py-2.5">None</td>
                  <td className="px-4 py-2.5">8 presets</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Runtime switching</td>
                  <td className="px-4 py-2.5">No</td>
                  <td className="px-4 py-2.5">Yes, single prop</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Custom themes</td>
                  <td className="px-4 py-2.5">Via Tailwind config</td>
                  <td className="px-4 py-2.5">Custom ThemePreset object</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Dark mode</td>
                  <td className="px-4 py-2.5">Tailwind dark: modifier</td>
                  <td className="px-4 py-2.5">Built into each preset</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Neither approach is wrong. Tailwind-based theming gives more
            granular control if you are already deep in the Tailwind ecosystem.
            MetricUI&apos;s provider-based system is faster to set up and makes
            it trivial to offer theme switching to end users, which is
            increasingly common in SaaS dashboards.
          </p>
        </DocSection>

        {/* ── Interactivity ──────────────────────────────────────── */}
        <DocSection id="interactivity" title="Interactivity">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Interactivity is where the gap between MetricUI and Tremor becomes
            most pronounced. Tremor provides click handlers on chart elements
            and basic tooltip interactions. The developer is responsible for
            building any coordination between components &mdash; filtering,
            cross-highlighting, drill-down navigation.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI ships a full interactivity stack that wires together via
            React context:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Filter system</strong>{" "}
              &mdash; FilterProvider, FilterBar, PeriodSelector, DropdownFilter,
              SegmentToggle, and FilterTags, all connected via context. One
              filter change propagates to every subscribed component.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Cross-filtering</strong>{" "}
              &mdash; Click a bar segment or donut slice to set a filter signal
              that other charts and tables can respond to. Built on
              CrossFilterProvider with the{" "}
              <code className="text-[13px] text-[var(--foreground)]">useCrossFilter()</code>{" "}
              and{" "}
              <code className="text-[13px] text-[var(--foreground)]">useCrossFilteredData()</code>{" "}
              hooks.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Linked hover</strong>{" "}
              &mdash; Hover over a data point in one chart and see the
              corresponding point highlighted in every linked chart.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Value flash</strong>{" "}
              &mdash; Visual pulse animation when metric values change, so users
              notice updates in real time.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Drill-down</strong>{" "}
              &mdash; Up to 4 levels of drill-down navigation with breadcrumb
              trails, built into the component layer.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Export</strong>{" "}
              &mdash; PNG, CSV, and clipboard export for any chart or table.
            </li>
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            None of these features exist in Tremor. You can build them yourself
            on top of Tremor&apos;s components, but that is weeks of custom
            development that MetricUI provides out of the box.
          </p>
        </DocSection>

        {/* ── Developer Experience ───────────────────────────────── */}
        <DocSection id="developer-experience" title="Developer Experience">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor&apos;s developer experience is one of its strengths. The API
            is clean, the components are well-documented, and the Tailwind
            integration means styling feels natural. The copy-paste model (via
            the newer repository) gives you full ownership of the source code,
            which some teams prefer for long-term maintenance.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI focuses on a different DX priority: minimizing the wiring
            code between components. A MetricProvider wraps the app, a
            MetricGrid handles layout, and filters, themes, and data states all
            flow through context. The trade-off is more convention and less
            manual control.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">DX Feature</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Tremor</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">MetricUI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">TypeScript</td>
                  <td className="px-4 py-2.5">Full</td>
                  <td className="px-4 py-2.5">Full</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Installation model</td>
                  <td className="px-4 py-2.5">npm package + copy-paste</td>
                  <td className="px-4 py-2.5">npm package</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Chart engine</td>
                  <td className="px-4 py-2.5">Recharts</td>
                  <td className="px-4 py-2.5">Nivo</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Built-in data states</td>
                  <td className="px-4 py-2.5">No</td>
                  <td className="px-4 py-2.5">Loading, empty, error states</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">Test coverage</td>
                  <td className="px-4 py-2.5">Yes</td>
                  <td className="px-4 py-2.5">175+ tests</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5">AI-assisted generation</td>
                  <td className="px-4 py-2.5">No</td>
                  <td className="px-4 py-2.5">MCP server</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">AI insights</td>
                  <td className="px-4 py-2.5">No</td>
                  <td className="px-4 py-2.5">DashboardInsight (bring-your-own-LLM)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The MCP server is worth highlighting. MetricUI ships a Model Context
            Protocol server that AI coding assistants (Cursor, Copilot, Claude)
            can use to generate valid dashboards without hallucinating
            component names or props. This is a meaningful DX advantage in 2026
            where most new code starts with an AI prompt.
          </p>
        </DocSection>

        {/* ── Comparison Table ───────────────────────────────────── */}
        <DocSection id="comparison-table" title="Comparison Table">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            A side-by-side summary of the key differences between MetricUI and
            Tremor.
          </p>
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-glow)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Feature</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">Tremor</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--foreground)]">MetricUI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ["Chart types", "11", "18"],
                  ["Chart engine", "Recharts", "Nivo"],
                  ["Theme presets", "None", "8 built-in + custom"],
                  ["Runtime theme switching", "No", "Yes"],
                  ["Auto-layout grid", "No", "MetricGrid"],
                  ["Filter system", "No", "Full (6 components + context)"],
                  ["Cross-filtering", "No", "Yes"],
                  ["Linked hover", "No", "Yes"],
                  ["Drill-down", "No", "Yes (4 levels)"],
                  ["Export (PNG/CSV)", "No", "Yes"],
                  ["AI insights", "No", "DashboardInsight"],
                  ["MCP server", "No", "Yes"],
                  ["Data states", "No", "Loading / empty / error"],
                  ["Dashboard wrapper", "No", "Yes"],
                  ["Templates", "300+ Blocks", "MCP generation"],
                  ["License", "MIT / Apache 2.0", "MIT"],
                  ["npm downloads", "~220K/week", "Growing"],
                  ["Active development", "Slowed post-acquisition", "Active"],
                ].map(([feature, tremor, metric]) => (
                  <tr key={feature as string} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{feature as string}</td>
                    <td className="px-4 py-2.5">{tremor as string}</td>
                    <td className="px-4 py-2.5">{metric as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ── When to Choose Tremor ──────────────────────────────── */}
        <DocSection id="when-tremor" title="When to Choose Tremor">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor is still a good choice in specific scenarios:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You want a <strong className="text-[var(--foreground)]">Tailwind-native</strong> approach
              where every component is styled with utility classes and integrates
              seamlessly with your existing Tailwind setup.
            </li>
            <li>
              You need <strong className="text-[var(--foreground)]">general-purpose UI components</strong> alongside
              your charts. Tremor&apos;s Button, Input, Dialog, and other
              primitives mean you may not need a separate UI library.
            </li>
            <li>
              You want to <strong className="text-[var(--foreground)]">own the source code</strong> via
              the copy-paste model. No dependency to upgrade, no breaking changes
              to worry about.
            </li>
            <li>
              Your dashboard is <strong className="text-[var(--foreground)]">simple</strong> &mdash; a
              few charts, a table, some KPIs &mdash; and does not need
              cross-filtering, drill-down, or coordinated interactivity.
            </li>
            <li>
              You want to start from a <strong className="text-[var(--foreground)]">template</strong>.
              Tremor&apos;s 300+ open-source Blocks give you a massive library
              of pre-built layouts.
            </li>
          </ul>
        </DocSection>

        {/* ── When to Choose MetricUI ────────────────────────────── */}
        <DocSection id="when-metricui" title="When to Choose MetricUI">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is the stronger choice when your requirements go beyond
            basic charts:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You are building a <strong className="text-[var(--foreground)]">production analytics dashboard</strong> that
              needs filtering, cross-filtering, drill-down, and export out of
              the box.
            </li>
            <li>
              You need <strong className="text-[var(--foreground)]">specialized chart types</strong> like
              Funnel, Sankey, Treemap, HeatMap, Waterfall, Gauge, or Bullet
              that Tremor does not offer.
            </li>
            <li>
              You want <strong className="text-[var(--foreground)]">runtime theme switching</strong> with
              built-in presets &mdash; especially useful for SaaS products where
              customers expect white-labeling or dark mode.
            </li>
            <li>
              You want <strong className="text-[var(--foreground)]">auto-layout</strong> that handles
              responsive grid placement without manual CSS grid configuration.
            </li>
            <li>
              You are using <strong className="text-[var(--foreground)]">AI coding tools</strong> and
              want an MCP server that generates valid, complete dashboards from
              natural language.
            </li>
            <li>
              You want <strong className="text-[var(--foreground)]">AI-powered insights</strong> embedded
              directly in the dashboard via a bring-your-own-LLM integration.
            </li>
            <li>
              You need <strong className="text-[var(--foreground)]">active, ongoing development</strong> with
              a clear public roadmap toward 1.0.
            </li>
          </ul>
        </DocSection>

        {/* ── See It In Action ───────────────────────────────────── */}
        <DocSection id="see-it-live" title="See It In Action">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Same dataset. Tremor builds one chart. MetricUI builds a full dashboard.
            Download the CSV and try it yourself.
          </p>
          <ComparisonDemo competitorCode={TREMOR_CODE} competitorName="Tremor" competitorChart={<TremorChart />} />
        </DocSection>

        {/* ── The Bottom Line ────────────────────────────────────── */}
        <DocSection id="bottom-line" title="The Bottom Line">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Tremor earned its place in the React ecosystem by proving that
            dashboard components could be beautiful, well-typed, and
            Tailwind-native. It raised the bar for what open-source dashboard
            libraries should look and feel like. That legacy is real and worth
            acknowledging.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            But the dashboard landscape in 2026 demands more than chart
            primitives. Teams need coordinated interactivity, intelligent
            theming, auto-layout, export, and increasingly, AI integration.
            Tremor was not built for that scope, and its post-acquisition pace
            suggests those features are unlikely to arrive.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI was designed from the ground up to be a complete dashboard
            framework. It has fewer community miles than Tremor, but it ships
            more of what you actually need to build a production analytics
            experience. The chart coverage is broader, the interactivity is
            deeper, the theming is more flexible, and the AI story is already
            here.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            If you are starting a new dashboard project in 2026 and comparing
            MetricUI vs Tremor, the question is not which library has better
            individual components &mdash; both are well-crafted. The question is
            whether you want to build the dashboard wiring yourself or use a
            framework that already has it. MetricUI is that framework.
          </p>
        </DocSection>
      </div>

      <aside className="sticky top-8 hidden h-fit w-48 shrink-0 py-8 pl-4 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  );
}
