"use client";

import { DocSection } from "@/components/docs/DocSection";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { ComparisonDemo } from "@/components/docs/ComparisonDemo";
import { CHARTJS_CODE } from "@/components/docs/competitor-code";
import { ChartjsChart } from "@/components/docs/competitor-charts/ChartjsChart";

const tocItems: TocItem[] = [
  { id: "tldr", title: "TL;DR", level: 2 },
  { id: "what-is-chartjs", title: "What is Chart.js?", level: 2 },
  { id: "what-is-metricui", title: "What is MetricUI?", level: 2 },
  { id: "canvas-vs-svg", title: "Canvas vs. SVG", level: 2 },
  { id: "canvas-accessibility", title: "Accessibility", level: 3 },
  { id: "canvas-theming", title: "CSS & Theming", level: 3 },
  { id: "canvas-devtools", title: "DevTools & Inspection", level: 3 },
  { id: "chart-types", title: "Chart Types", level: 2 },
  { id: "react-integration", title: "React Integration", level: 2 },
  { id: "theming-design-systems", title: "Theming & Design Systems", level: 2 },
  { id: "dashboard-features", title: "Dashboard Features", level: 2 },
  { id: "plugin-ecosystem", title: "The Plugin Ecosystem", level: 2 },
  { id: "comparison-table", title: "Comparison Table", level: 2 },
  { id: "when-chartjs", title: "When to Choose Chart.js", level: 2 },
  { id: "when-metricui", title: "When to Choose MetricUI", level: 2 },
  { id: "see-it-live", title: "See It In Action", level: 2 },
  { id: "bottom-line", title: "The Bottom Line", level: 2 },
];

export default function ChartJsComparePage() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-5xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Compare
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MetricUI vs Chart.js
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Chart.js is one of the most popular JavaScript charting libraries ever
          built. MetricUI is a React dashboard framework. They solve different
          problems at different layers of the stack &mdash; and that distinction
          matters more than any feature checklist.
        </p>

        {/* ── TL;DR ────────────────────────────────────────────── */}
        <DocSection id="tldr" title="TL;DR">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js is a canvas-based charting engine with nine built-in chart
            types, a mature plugin ecosystem, and roughly 7.8 million weekly npm
            downloads. It draws pixels on a{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              {"<canvas>"}
            </code>{" "}
            element &mdash; fast, lightweight, framework-agnostic.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is an SVG-based React dashboard framework with 31
            components, 18 chart types, 8 theme presets, a complete filter
            system, cross-filtering, drill-down, export, AI insights, and
            dashboard layout primitives. It renders real DOM nodes that screen
            readers can traverse, CSS can style, and DevTools can inspect.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The core difference between MetricUI vs Chart.js is not features
            &mdash; it is rendering model. Canvas vs. SVG shapes everything
            downstream: accessibility, theming, developer experience, and what
            you can build without reaching for additional libraries.
          </p>
        </DocSection>

        {/* ── What is Chart.js? ────────────────────────────────── */}
        <DocSection id="what-is-chartjs" title="What is Chart.js?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js launched in 2013 and quickly became the go-to charting
            library for developers who needed something simple, fast, and free.
            It earned that reputation. A single script tag, a canvas element, and
            a configuration object was all you needed to get a beautiful,
            animated chart on the page.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The current release is v4.5.1 (October 2024). The React wrapper,{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              react-chartjs-2
            </code>
            , sits at v5.3.1 and added React 19 support in October 2025. Both
            are MIT-licensed.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js ships nine built-in chart types: Line, Bar, Area, Pie,
            Doughnut, Polar Area, Radar, Scatter, and Bubble. Community plugins
            extend it with financial charts, treemaps, geo maps, sankey
            diagrams, box plots, and more. Its plugin architecture is one of its
            greatest strengths &mdash; and we will give it the credit it
            deserves later in this comparison.
          </p>
        </DocSection>

        {/* ── What is MetricUI? ────────────────────────────────── */}
        <DocSection id="what-is-metricui" title="What is MetricUI?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a React component library purpose-built for analytics
            dashboards. It ships 31 components, 5 providers, and 15+ hooks
            &mdash; covering everything from KPI cards and 18 chart types to
            filter bars, drill-down panels, export, and AI-powered insights.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            All charts render as SVG via Nivo under the hood. This means every
            bar, slice, and axis tick is a real DOM element &mdash; accessible,
            styleable, inspectable. Eight theme presets ship out of the box,
            and a single{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              {"<MetricProvider theme=\"emerald\">"}
            </code>{" "}
            prop transforms the entire dashboard.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is also MIT-licensed, TypeScript-first, and ships with
            175+ tests and an MCP server for AI-assisted dashboard generation.
            It is a newer library with a smaller community, and it only targets
            React.
          </p>
        </DocSection>

        {/* ── Canvas vs. SVG ───────────────────────────────────── */}
        <DocSection id="canvas-vs-svg" title="Canvas vs. SVG: The Fundamental Divide">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is the section that matters most in any MetricUI vs Chart.js
            comparison. Everything else &mdash; feature counts, API design,
            ecosystem size &mdash; flows from this single architectural
            decision: Chart.js draws pixels on a canvas bitmap. MetricUI renders
            SVG elements in the DOM.
          </p>
          <p className="mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
            That sounds like a rendering implementation detail. It is not. It
            determines what your charts can do, who can use them, and how your
            team maintains them.
          </p>

          <DocSection id="canvas-accessibility" title="Accessibility" level={3}>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              A{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                {"<canvas>"}
              </code>{" "}
              element is a single opaque rectangle to a screen reader. There
              are no DOM nodes for individual bars, slices, or data points. A
              screen reader sees one element and announces whatever fallback
              text you place inside the canvas tag &mdash; usually nothing
              useful like &ldquo;chart showing revenue data.&rdquo;
            </p>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              The Chart.js community built a plugin,{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                chartjs-plugin-a11y-legend
              </code>
              , that generates keyboard-navigable legend items. It helps, but
              it cannot solve the fundamental problem: the chart itself remains
              a bitmap. You cannot tab to a specific bar. You cannot
              programmatically associate an aria-label with a data point. The
              accessibility ceiling is hard-coded by the rendering model.
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              SVG charts render every element as a DOM node. Screen readers can
              traverse them. Each bar can carry its own{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                aria-label
              </code>
              ,{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                role
              </code>
              , and keyboard focus. MetricUI inherits this from Nivo
              automatically &mdash; no plugins, no workarounds, no ceiling.
            </p>
          </DocSection>

          <DocSection id="canvas-theming" title="CSS & Theming" level={3}>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              Canvas does not participate in CSS. At all. You cannot use CSS
              variables to set a bar color. You cannot use a Tailwind class on a
              data point. You cannot use{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                @media (prefers-color-scheme: dark)
              </code>{" "}
              to flip chart colors &mdash; because the chart is not in the DOM
              tree that CSS sees. All styling goes through JavaScript
              configuration objects and{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                Chart.defaults
              </code>
              .
            </p>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              This creates a fundamental disconnect in modern React applications.
              Your design system uses CSS variables and a theme provider. Your
              layout uses Tailwind. Your charts exist in a parallel universe
              where none of that applies. Dark mode? You have to manually read
              the current theme state, map it to Chart.js config values, and
              trigger a full redraw.
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              SVG elements are DOM elements. They inherit CSS custom properties.
              They respond to media queries. MetricUI themes work by setting CSS
              variables on a provider &mdash; every chart, card, and filter
              beneath it picks up the change automatically. Dark mode is a
              single prop toggle, not a manual configuration mapping.
            </p>
          </DocSection>

          <DocSection id="canvas-devtools" title="DevTools & Inspection" level={3}>
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
              Open DevTools on a Chart.js chart and you see one element:{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                {"<canvas width=\"...\" height=\"...\">"}
              </code>
              . That is it. You cannot inspect a bar to check its dimensions.
              You cannot hover an axis label to see its computed styles. You
              cannot use the accessibility inspector to audit chart semantics.
              Debugging means console-logging Chart.js internals.
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--muted)]">
              SVG charts expose their entire structure in the Elements panel.
              Every{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                {"<rect>"}
              </code>
              ,{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                {"<path>"}
              </code>
              , and{" "}
              <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
                {"<text>"}
              </code>{" "}
              element is right there. Hover to highlight, click to inspect
              styles, edit attributes live. The developer experience gap is
              significant.
            </p>
          </DocSection>
        </DocSection>

        {/* ── Chart Types ──────────────────────────────────────── */}
        <DocSection id="chart-types" title="Chart Types">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js ships 9 built-in chart types: Line, Bar, Area, Pie,
            Doughnut, Polar Area, Radar, Scatter, and Bubble. Community plugins
            add financial charts (candlestick/OHLC), treemaps, geographic maps,
            sankey diagrams, word clouds, and box plots &mdash; though quality
            and maintenance vary across these third-party packages.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI ships 18 chart types as first-party components: Line, Bar,
            Area, Donut, Scatter, Radar, Heatmap, Treemap, Funnel, Sankey,
            Gauge, Waterfall, Calendar, Choropleth, Bump, Bullet, Bar-Line
            combo, and Sparkline. Each one shares the same props interface, the
            same theming system, and the same accessibility guarantees.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The difference is not just count. MetricUI chart types are designed
            for dashboards: they include built-in reference lines, threshold
            bands, comparison overlays, and data state handling (loading, empty,
            error) out of the box. Chart.js charts are general-purpose drawing
            primitives &mdash; powerful, but you build those dashboard features
            yourself.
          </p>
        </DocSection>

        {/* ── React Integration ────────────────────────────────── */}
        <DocSection id="react-integration" title="React Integration">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js is a vanilla JavaScript library. The React wrapper,{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              react-chartjs-2
            </code>
            , bridges the gap with components like{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              {"<Bar>"}
            </code>{" "}
            and{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              {"<Line>"}
            </code>
            , but underneath you are still writing Chart.js configuration
            objects. The mental model is imperative: define datasets, configure
            scales, register plugins, handle lifecycle callbacks.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            A known pain point is dataset identity across re-renders. React
            creates new object references on each render. Chart.js uses object
            identity to determine whether to animate a transition or reset the
            chart. The result: visual glitches and unnecessary full redraws
            unless you carefully memoize your data and options objects.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Server-side rendering is another friction point. Canvas requires a
            browser DOM. To render Chart.js on the server, you need{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              node-canvas
            </code>{" "}
            &mdash; a native C++ dependency that complicates deployment on
            serverless platforms and CI environments.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI components are React-native. Props in, UI out. No
            imperative configuration objects, no plugin registration, no
            dataset identity issues. Data is a prop. Theme is a prop. State is
            managed by React. SSR works without native dependencies because SVG
            is just markup.
          </p>
        </DocSection>

        {/* ── Theming & Design Systems ─────────────────────────── */}
        <DocSection id="theming-design-systems" title="Theming & Design Systems">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js provides{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              Chart.defaults
            </code>{" "}
            for global configuration &mdash; default font, colors, line
            widths. It is a global mutable object, not a theme system. There
            are no theme presets, no provider pattern, and no way to scope
            different themes to different parts of the page. Implementing dark
            mode means manually updating defaults and forcing every chart
            instance to redraw.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI ships 8 theme presets (indigo, emerald, rose, amber, cyan,
            violet, slate, orange) and supports fully custom themes. The{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              {"<MetricProvider>"}
            </code>{" "}
            component sets CSS variables that cascade to every chart, card,
            filter, and layout component beneath it. You can nest providers to
            scope different themes to different dashboard sections.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            For teams building design systems, the gap is significant. Chart.js
            charts exist outside your CSS architecture. MetricUI charts
            participate in it. Your tokens, your variables, your media
            queries all apply naturally.
          </p>
        </DocSection>

        {/* ── Dashboard Features ───────────────────────────────── */}
        <DocSection id="dashboard-features" title="Dashboard Features">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js is a charting library. It draws charts. It does not
            provide KPI cards, filter bars, data tables, dashboard layouts,
            export functionality, drill-down panels, or any of the other
            components you need to build a complete analytics dashboard. To
            build a dashboard with Chart.js, you combine it with a UI library,
            a layout system, a state management solution for filters, and
            custom code for everything else.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI ships the full stack of dashboard primitives:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1.5 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">KpiCard</strong> with
              sparklines, goal progress, conditional coloring, comparisons
            </li>
            <li>
              <strong className="text-[var(--foreground)]">FilterBar</strong>,
              DropdownFilter, PeriodSelector, SegmentToggle, FilterTags
            </li>
            <li>
              <strong className="text-[var(--foreground)]">CrossFilterProvider</strong>{" "}
              for click-to-filter interactions across charts
            </li>
            <li>
              <strong className="text-[var(--foreground)]">DrillDown</strong>{" "}
              slide-over panels for detail views
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Export</strong> to PNG,
              CSV, and clipboard
            </li>
            <li>
              <strong className="text-[var(--foreground)]">MetricGrid</strong>{" "}
              auto-layout and Dashboard wrapper
            </li>
            <li>
              <strong className="text-[var(--foreground)]">AI Insights</strong>{" "}
              for natural language data summaries
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Data states</strong>{" "}
              &mdash; loading, empty, and error handling built into every component
            </li>
          </ul>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            This is the clearest distinction in the MetricUI vs Chart.js
            comparison. Chart.js gives you a charting engine. MetricUI gives
            you a dashboard framework. If you only need a chart on a marketing
            page, Chart.js is perfectly sufficient. If you are building an
            analytics product, MetricUI gives you the full toolkit.
          </p>
        </DocSection>

        {/* ── Plugin Ecosystem ─────────────────────────────────── */}
        <DocSection id="plugin-ecosystem" title="The Plugin Ecosystem">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Credit where it is due: Chart.js has one of the best plugin
            ecosystems in the data visualization world. The plugin API is
            well-designed, well-documented, and has attracted a large community
            of contributors over 12+ years.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Standout plugins include{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              chartjs-plugin-annotation
            </code>{" "}
            for reference lines and regions,{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              chartjs-plugin-datalabels
            </code>{" "}
            for inline data labels,{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              chartjs-plugin-zoom
            </code>{" "}
            for pan and zoom interactions, and{" "}
            <code className="rounded bg-[var(--card-glow)] px-1.5 py-0.5 text-[13px] text-[var(--foreground)]">
              chartjs-plugin-streaming
            </code>{" "}
            for real-time data. Community-maintained chart type plugins add
            financial charts, geographic maps, treemaps, and sankey diagrams.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This ecosystem is a genuine advantage. If you have invested in
            Chart.js plugins, switching has a real cost. If a specific plugin
            solves a niche problem for your use case, that matters.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI takes a different approach: features that Chart.js
            delegates to plugins &mdash; reference lines, data labels,
            annotations &mdash; are built into the core chart components as
            props. There is no plugin registration step, no version
            compatibility matrix, and no risk of an unmaintained plugin
            breaking your build. The trade-off is a smaller surface area of
            niche extensions.
          </p>
        </DocSection>

        {/* ── Comparison Table ─────────────────────────────────── */}
        <DocSection id="comparison-table" title="Comparison Table">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-3 pr-4 text-left font-semibold text-[var(--foreground)]">
                    Feature
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                    Chart.js + react-chartjs-2
                  </th>
                  <th className="py-3 pl-4 text-left font-semibold text-[var(--foreground)]">
                    MetricUI
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Rendering</td>
                  <td className="py-3 px-4">Canvas (bitmap)</td>
                  <td className="py-3 pl-4">SVG (DOM nodes)</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Chart types (built-in)</td>
                  <td className="py-3 px-4">9</td>
                  <td className="py-3 pl-4">18</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Total components</td>
                  <td className="py-3 px-4">9 chart wrappers</td>
                  <td className="py-3 pl-4">31 components + 5 providers + 15+ hooks</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Screen reader a11y</td>
                  <td className="py-3 px-4">Plugin (limited)</td>
                  <td className="py-3 pl-4">Native (DOM-based)</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">CSS theming</td>
                  <td className="py-3 px-4">No (JS config only)</td>
                  <td className="py-3 pl-4">Yes (CSS variables, 8 presets)</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Dark mode</td>
                  <td className="py-3 px-4">Manual JS toggle + redraw</td>
                  <td className="py-3 pl-4">One prop on provider</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">React model</td>
                  <td className="py-3 px-4">Imperative wrapper</td>
                  <td className="py-3 pl-4">Declarative components</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">SSR</td>
                  <td className="py-3 px-4">Requires node-canvas</td>
                  <td className="py-3 pl-4">Works natively</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">KPI cards</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 pl-4">Yes</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Filters / cross-filtering</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 pl-4">Yes</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Export (PNG/CSV)</td>
                  <td className="py-3 px-4">Canvas toDataURL only</td>
                  <td className="py-3 pl-4">Built-in component</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Dashboard layout</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 pl-4">MetricGrid + Dashboard wrapper</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Plugin ecosystem</td>
                  <td className="py-3 px-4">Large, mature</td>
                  <td className="py-3 pl-4">Features built-in, smaller extension surface</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">TypeScript</td>
                  <td className="py-3 px-4">Yes (since v3)</td>
                  <td className="py-3 pl-4">Yes (first-class)</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">Framework</td>
                  <td className="py-3 px-4">Any (React via wrapper)</td>
                  <td className="py-3 pl-4">React only</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">npm weekly downloads</td>
                  <td className="py-3 px-4">~7.83M (Chart.js) / ~3.25M (react-chartjs-2)</td>
                  <td className="py-3 pl-4">Newer, growing</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">License</td>
                  <td className="py-3 px-4">MIT</td>
                  <td className="py-3 pl-4">MIT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ── When to Choose Chart.js ──────────────────────────── */}
        <DocSection id="when-chartjs" title="When to Choose Chart.js">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js remains a strong choice in several scenarios:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1.5 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Non-React projects.</strong>{" "}
              Chart.js works everywhere &mdash; vanilla JS, Vue, Angular,
              Svelte, server-rendered HTML. If you are not in React, MetricUI
              is not an option.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Single chart on a page.</strong>{" "}
              If you need one chart on a marketing page or blog post, Chart.js
              is lightweight and simple. A full dashboard framework would be
              overkill.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Massive datasets (10k+ points).</strong>{" "}
              Canvas handles very large datasets more efficiently than SVG
              because it does not create DOM nodes for each data point.
              Decimation plugins help further.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Existing plugin investment.</strong>{" "}
              If your team relies on specific Chart.js plugins (financial
              charts, streaming data, custom annotations), the migration cost
              may not be worth it.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Team familiarity.</strong>{" "}
              Chart.js has been around since 2013. Your team may already know
              it well. That institutional knowledge has real value.
            </li>
          </ul>
        </DocSection>

        {/* ── When to Choose MetricUI ──────────────────────────── */}
        <DocSection id="when-metricui" title="When to Choose MetricUI">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is the better fit when:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1.5 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">You are building a dashboard, not just a chart.</strong>{" "}
              KPI cards, filters, cross-filtering, drill-down, layout &mdash;
              MetricUI ships the complete toolkit. With Chart.js you assemble
              it from scratch.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Accessibility is a requirement.</strong>{" "}
              If your product must meet WCAG standards, SVG-based charts give
              you a structurally sound foundation. Canvas charts hit a hard
              accessibility ceiling.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">You have a design system.</strong>{" "}
              CSS variables, theme providers, Tailwind &mdash; MetricUI
              participates in all of them. Chart.js charts live outside your
              CSS architecture.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">You want declarative React.</strong>{" "}
              Props in, UI out. No imperative config objects, no plugin
              registration, no dataset identity gotchas.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">You need fast iteration.</strong>{" "}
              One import, one component, sensible defaults. MetricUI
              components are designed to look good immediately and customize
              deeply when needed.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">You are using AI to generate dashboards.</strong>{" "}
              MetricUI ships an MCP server. AI models can generate complete,
              valid dashboards from natural language because the component API
              is declarative and self-describing.
            </li>
          </ul>
        </DocSection>

        {/* ── See It In Action ─────────────────────────────────── */}
        <DocSection id="see-it-live" title="See It In Action">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Same dataset. Chart.js builds one chart. MetricUI builds a full dashboard.
            Download the CSV and try it yourself.
          </p>
          <ComparisonDemo competitorCode={CHARTJS_CODE} competitorName="Chart.js" competitorChart={<ChartjsChart />} />
        </DocSection>

        {/* ── The Bottom Line ──────────────────────────────────── */}
        <DocSection id="bottom-line" title="The Bottom Line">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Chart.js is a legend. It brought canvas charting to millions of
            developers and proved that beautiful, interactive data visualization
            could be free and simple. Its plugin ecosystem is mature, its
            community is massive, and it works in every JavaScript environment.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            But Chart.js is a charting engine from a different era. It was
            designed before React, before component-driven architecture, before
            CSS custom properties, before accessibility was a baseline
            expectation. The canvas rendering model &mdash; its defining
            architectural choice &mdash; creates hard limits on accessibility,
            theming, and developer experience that no amount of plugins can
            fully overcome.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is a React dashboard framework built for modern workflows.
            SVG rendering gives you accessible, styleable, inspectable charts.
            The component library gives you everything around those charts
            &mdash; KPI cards, filters, layout, export, AI insights. The
            theming system puts your charts inside your design system instead
            of beside it.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            If you need a quick chart in any framework, Chart.js is still a
            fine choice. If you are building a React analytics dashboard in
            2026, MetricUI gives you the complete picture.
          </p>
        </DocSection>
      </div>

      <aside className="sticky top-8 hidden h-fit w-48 shrink-0 py-8 pl-4 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  );
}
