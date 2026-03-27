"use client";

import { DocSection } from "@/components/docs/DocSection";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";
import { ComparisonDemo } from "@/components/docs/ComparisonDemo";
import { RECHARTS_CODE } from "@/components/docs/competitor-code";
import { RechartsChart } from "@/components/docs/competitor-charts/RechartsChart";

const tocItems: TocItem[] = [
  { id: "tldr", title: "TL;DR", level: 2 },
  { id: "what-is-recharts", title: "What is Recharts?", level: 2 },
  { id: "what-is-metricui", title: "What is MetricUI?", level: 2 },
  { id: "charts-head-to-head", title: "Charts: Head to Head", level: 2 },
  { id: "beyond-charts", title: "Beyond Charts", level: 2 },
  { id: "theming-and-design", title: "Theming & Design", level: 2 },
  { id: "developer-experience", title: "Developer Experience", level: 2 },
  { id: "performance-and-bundle", title: "Performance & Bundle Size", level: 2 },
  { id: "community-and-ecosystem", title: "Community & Ecosystem", level: 2 },
  { id: "comparison-table", title: "Comparison Table", level: 2 },
  { id: "when-to-choose-recharts", title: "When to Choose Recharts", level: 2 },
  { id: "when-to-choose-metricui", title: "When to Choose MetricUI", level: 2 },
  { id: "see-it-live", title: "See It In Action", level: 2 },
  { id: "the-bottom-line", title: "The Bottom Line", level: 2 },
];

export default function RechartsComparison() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-5xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Compare
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          MetricUI vs Recharts
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Recharts is the most popular React charting library. MetricUI is a
          complete dashboard framework. Here is an honest comparison to help you
          decide which one fits your project.
        </p>

        {/* ── TL;DR ── */}
        <DocSection id="tldr" title="TL;DR">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you need standalone charts embedded in an existing UI, Recharts is
            a proven choice with an enormous community. If you need a{" "}
            <strong className="text-[var(--foreground)]">dashboard</strong> —
            charts, KPI cards, filters, tables, layout, export, theming, and
            data states — MetricUI ships all of that out of the box. The question
            is not really MetricUI vs Recharts. It is whether you want a charting
            library or a dashboard framework.
          </p>
        </DocSection>

        {/* ── What is Recharts? ── */}
        <DocSection id="what-is-recharts" title="What is Recharts?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts (v3.8.1, March 2026) is a composable, SVG-based charting
            library for React. It provides 12 chart types — Line, Bar, Area,
            Composed, Pie, Radar, RadialBar, Scatter, Funnel, Treemap, Sankey,
            and Sunburst — all built from small, declarative sub-components you
            combine freely.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            With roughly 24 million weekly npm downloads, Recharts is one of the
            most-used visualization packages in the React ecosystem. It has
            strong documentation, hundreds of community examples, and years of
            battle-tested production use. If you have ever built a React app with
            charts, you have probably used Recharts.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts does one thing — charts — and it does it well. Everything
            else (layout, theming, filters, state management, export) is
            deliberately out of scope.
          </p>
        </DocSection>

        {/* ── What is MetricUI? ── */}
        <DocSection id="what-is-metricui" title="What is MetricUI?">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI (v0.6.1) is a React dashboard framework. It provides 31
            components, 5 providers, 15+ hooks, and 18 chart types — all
            designed to work together as a system.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Charts are one layer. On top of that, MetricUI includes KPI cards
            with sparklines and conditional formatting, a complete filter system
            with cross-filtering, data tables, drill-down navigation, export to
            PNG/CSV/clipboard, auto-layout grids, 8 theme presets, loading
            skeletons, error boundaries, and an AI insights layer with
            bring-your-own-LLM support.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is newer and has a smaller community. It is MIT-licensed,
            fully typed, and backed by 175+ tests. Its charts are built on Nivo,
            which itself is built on D3 — a mature rendering pipeline under the
            hood.
          </p>
        </DocSection>

        {/* ── Charts: Head to Head ── */}
        <DocSection id="charts-head-to-head" title="Charts: Head to Head">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Both libraries cover the core chart types. Recharts offers 12;
            MetricUI offers 18. The overlap is significant — line, bar, area,
            pie/donut, radar, scatter, treemap, sankey, and funnel are available
            in both. MetricUI adds heatmap, calendar, choropleth, bump, gauge,
            waterfall, bullet, sparkline, and bar-line combo charts.
          </p>
          <DataTable
            data={[
              { type: "Line", recharts: "Yes", metricui: "Yes" },
              { type: "Bar", recharts: "Yes", metricui: "Yes" },
              { type: "Area", recharts: "Yes", metricui: "Yes" },
              { type: "Pie / Donut", recharts: "Yes", metricui: "Yes" },
              { type: "Radar", recharts: "Yes", metricui: "Yes" },
              { type: "Scatter", recharts: "Yes", metricui: "Yes" },
              { type: "Treemap", recharts: "Yes", metricui: "Yes" },
              { type: "Sankey", recharts: "Yes", metricui: "Yes" },
              { type: "Funnel", recharts: "Yes", metricui: "Yes" },
              { type: "Sunburst", recharts: "Yes", metricui: "No" },
              { type: "RadialBar", recharts: "Yes", metricui: "No" },
              { type: "Composed", recharts: "Yes", metricui: "BarLineChart" },
              { type: "Heatmap", recharts: "No", metricui: "Yes" },
              { type: "Calendar", recharts: "No", metricui: "Yes" },
              { type: "Choropleth", recharts: "No", metricui: "Yes" },
              { type: "Bump", recharts: "No", metricui: "Yes" },
              { type: "Gauge", recharts: "No", metricui: "Yes" },
              { type: "Waterfall", recharts: "No", metricui: "Yes" },
              { type: "Bullet", recharts: "No", metricui: "Yes" },
              { type: "Sparkline", recharts: "No", metricui: "Yes" },
            ]}
            columns={[
              { key: "type", header: "Chart Type" },
              { key: "recharts", header: "Recharts" },
              { key: "metricui", header: "MetricUI" },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts gives you more granular control over chart composition — you
            can mix and match XAxis, YAxis, Tooltip, Legend, and multiple series
            components in any combination. MetricUI charts are more opinionated:
            you pass props and data, and the component handles the rest,
            including reference lines, threshold bands, and comparison overlays.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The tradeoff is flexibility vs speed. Recharts lets you build
            anything; MetricUI gets you to a polished result faster.
          </p>
        </DocSection>

        {/* ── Beyond Charts ── */}
        <DocSection id="beyond-charts" title="Beyond Charts">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is where the comparison stops being apples-to-apples. Recharts
            is a charting library. MetricUI is a dashboard framework. Everything
            listed below is something you would need to build yourself (or find
            another library for) if you choose Recharts.
          </p>
          <DataTable
            data={[
              { capability: "KPI Cards", recharts: "Build yourself", metricui: "KpiCard with sparklines, goals, conditions, comparisons" },
              { capability: "Data Tables", recharts: "Build yourself", metricui: "DataTable with sorting, pagination, density, variants" },
              { capability: "Filter System", recharts: "Build yourself", metricui: "FilterProvider + PeriodSelector + DropdownFilter + SegmentToggle + FilterBar" },
              { capability: "Cross-Filtering", recharts: "Build yourself", metricui: "CrossFilterProvider — click a chart to filter everything" },
              { capability: "Linked Hover", recharts: "Build yourself", metricui: "Built-in — hover one chart, highlight across all" },
              { capability: "Drill-Down", recharts: "Build yourself", metricui: "4-level drill-down, 2 modes (inline + panel)" },
              { capability: "Export", recharts: "Build yourself", metricui: "PNG (4x DPI), CSV, clipboard — one component" },
              { capability: "Auto Layout", recharts: "Build yourself", metricui: "MetricGrid — zero CSS, responsive, staggered animations" },
              { capability: "Dashboard Shell", recharts: "Build yourself", metricui: "Dashboard wrapper replaces 5 providers with one import" },
              { capability: "Loading / Empty / Error States", recharts: "Build yourself", metricui: "Built-in skeletons, empty states, error boundaries, stale indicators" },
              { capability: "Theming", recharts: "Build yourself", metricui: "8 presets, CSS variables, dark mode, 4 card variants" },
              { capability: "AI Insights", recharts: "Build yourself", metricui: "DashboardInsight with bring-your-own-LLM, auto-context" },
              { capability: "Status Indicators", recharts: "Build yourself", metricui: "StatusIndicator, Badge, Callout, SectionHeader" },
            ]}
            columns={[
              { key: "capability", header: "Capability" },
              { key: "recharts", header: "Recharts" },
              { key: "metricui", header: "MetricUI" },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            None of these are criticisms of Recharts — they are simply outside
            its scope. But if you are building a dashboard, these are the
            features that take weeks to implement, test, and polish. MetricUI
            ships them ready to use.
          </p>
        </DocSection>

        {/* ── Theming & Design ── */}
        <DocSection id="theming-and-design" title="Theming & Design">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts has no theming system. Colors, fonts, and styles are set
            per-component via inline props. There is no global theme provider, no
            presets, and no design token system. Dark mode requires manually
            coordinating styles across every chart instance.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI uses CSS custom properties for theming. One{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">
              &lt;MetricProvider theme=&quot;emerald&quot;&gt;
            </code>{" "}
            call sets the accent color, chart palette, card styling, and dark
            mode behavior for every component in the tree. Eight presets are
            included. Custom themes are a single CSS block.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI also supports four card variants (default, outlined, ghost,
            elevated) and custom variants via CSS selectors — so every component
            in a dashboard can share a consistent visual language without
            per-component styling.
          </p>
        </DocSection>

        {/* ── Developer Experience ── */}
        <DocSection id="developer-experience" title="Developer Experience">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts has excellent TypeScript support and a composable API that
            React developers find intuitive. Building a chart means assembling
            sub-components — XAxis, YAxis, CartesianGrid, Tooltip, Legend — and
            configuring each one. This is flexible, but verbose. A typical
            Recharts chart is 30-50 lines of JSX.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI charts are props-driven. A typical chart is 5-10 lines.
            Reference lines, threshold bands, comparison overlays, and
            formatting are all handled via props rather than child components.
            The tradeoff: less compositional flexibility, but dramatically less
            boilerplate.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Where MetricUI pulls further ahead is in the dashboard layer.
            Filters, cross-filtering, drill-down, export, and layout all work
            via providers and hooks — no wiring required. A complete, interactive
            dashboard with filters, KPIs, charts, and a table can be built in
            under 100 lines.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI also ships an MCP server with 13 tools for AI-assisted
            generation. Point Claude, Cursor, or any MCP-compatible agent at it
            and it can scaffold dashboards, look up component APIs, and validate
            props — a workflow that does not exist for Recharts.
          </p>
        </DocSection>

        {/* ── Performance & Bundle Size ── */}
        <DocSection id="performance-and-bundle" title="Performance & Bundle Size">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts bundles at roughly 515KB (minified), which includes a Redux
            dependency. Performance with large datasets (10,000+ points) can
            degrade noticeably, and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">
              ResponsiveContainer
            </code>{" "}
            has known issues with layout thrashing and hydration mismatches in
            SSR environments.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI's charts are backed by Nivo, which uses D3 for
            calculations and renders via SVG or HTML Canvas depending on the
            chart type. Nivo's Canvas renderers handle large datasets more
            gracefully. Bundle size depends on which components you import — the
            full library is larger than Recharts (it includes far more than
            charts), but tree-shaking keeps per-page bundles reasonable.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            For SSR, Recharts requires{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">
              &quot;use client&quot;
            </code>{" "}
            boundaries around every chart due to ResponsiveContainer's reliance
            on browser APIs. MetricUI components also require client-side
            rendering for interactive elements, but the Dashboard wrapper
            handles this cleanly with a single boundary.
          </p>
        </DocSection>

        {/* ── Community & Ecosystem ── */}
        <DocSection id="community-and-ecosystem" title="Community & Ecosystem">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            This is where Recharts has a clear advantage. With 24 million
            weekly downloads, thousands of Stack Overflow answers, hundreds of
            tutorials, and years of production use at major companies, Recharts
            has one of the largest support ecosystems of any React library. If
            you hit a problem, someone has probably solved it before.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is new. The community is small but growing. Documentation
            is thorough — every component has a dedicated doc page with props
            tables, examples, and notes — but you will not find a Stack Overflow
            archive or a library of community blog posts yet.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            That said, MetricUI's MCP server partially offsets this gap. Instead
            of searching for answers, you can ask an AI agent to generate the
            code directly from MetricUI's knowledge base. It is a different kind
            of ecosystem, but an effective one for modern workflows.
          </p>
        </DocSection>

        {/* ── Comparison Table ── */}
        <DocSection id="comparison-table" title="Comparison Table">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            A high-level feature matrix covering the most common dashboard
            requirements.
          </p>
          <DataTable
            data={[
              { feature: "Chart Types", recharts: "12", metricui: "18" },
              { feature: "KPI Cards", recharts: "No", metricui: "Yes" },
              { feature: "Data Tables", recharts: "No", metricui: "Yes" },
              { feature: "Filter System", recharts: "No", metricui: "Yes (5 components)" },
              { feature: "Cross-Filtering", recharts: "No", metricui: "Yes" },
              { feature: "Drill-Down", recharts: "No", metricui: "Yes (4 levels)" },
              { feature: "Export (PNG/CSV)", recharts: "No", metricui: "Yes" },
              { feature: "Theme Presets", recharts: "No", metricui: "8 built-in" },
              { feature: "Dark Mode", recharts: "Manual per-chart", metricui: "Automatic" },
              { feature: "Dashboard Shell", recharts: "No", metricui: "Yes" },
              { feature: "Auto Layout Grid", recharts: "No", metricui: "MetricGrid" },
              { feature: "Loading Skeletons", recharts: "No", metricui: "Yes" },
              { feature: "Error Boundaries", recharts: "No", metricui: "Yes" },
              { feature: "AI Insights", recharts: "No", metricui: "Yes (BYOLLM)" },
              { feature: "MCP Server", recharts: "No", metricui: "13 tools" },
              { feature: "TypeScript", recharts: "Yes", metricui: "Yes" },
              { feature: "SSR Support", recharts: "Problematic", metricui: "Client boundary" },
              { feature: "License", recharts: "MIT", metricui: "MIT" },
              { feature: "npm Weekly Downloads", recharts: "~24M", metricui: "New" },
              { feature: "Maturity", recharts: "Very mature", metricui: "v0.6.1" },
            ]}
            columns={[
              { key: "feature", header: "Feature" },
              { key: "recharts", header: "Recharts" },
              { key: "metricui", header: "MetricUI" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* ── When to Choose Recharts ── */}
        <DocSection id="when-to-choose-recharts" title="When to Choose Recharts">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts is the right choice when:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You need <strong className="text-[var(--foreground)]">charts only</strong>, not a
              full dashboard — for example, a single chart embedded in a blog
              post, a marketing page, or an existing app.
            </li>
            <li>
              You need <strong className="text-[var(--foreground)]">maximum compositional flexibility</strong>.
              Recharts lets you assemble chart elements like building blocks, which
              is ideal for highly custom or unusual visualizations.
            </li>
            <li>
              You value <strong className="text-[var(--foreground)]">ecosystem maturity</strong>.
              Recharts has years of production use, extensive community
              resources, and well-known patterns for every edge case.
            </li>
            <li>
              Your team already knows Recharts and the cost of switching is
              not justified by the additional capabilities.
            </li>
            <li>
              You need Sunburst or RadialBar charts specifically, which
              MetricUI does not currently offer.
            </li>
          </ul>
        </DocSection>

        {/* ── When to Choose MetricUI ── */}
        <DocSection id="when-to-choose-metricui" title="When to Choose MetricUI">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI is the right choice when:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[14px] leading-relaxed text-[var(--muted)]">
            <li>
              You are building a{" "}
              <strong className="text-[var(--foreground)]">dashboard, not just charts</strong>.
              If you need KPI cards, filters, tables, and layout alongside your
              charts, MetricUI ships it all as one integrated system.
            </li>
            <li>
              You want{" "}
              <strong className="text-[var(--foreground)]">time-to-dashboard measured in hours,
              not weeks</strong>. Dashboard wrapper, MetricGrid, and the filter
              system eliminate the most time-consuming integration work.
            </li>
            <li>
              You need{" "}
              <strong className="text-[var(--foreground)]">cross-filtering, drill-down, or
              export</strong> — features that require significant custom
              development with Recharts.
            </li>
            <li>
              You want{" "}
              <strong className="text-[var(--foreground)]">consistent theming</strong> across every
              component — charts, cards, tables, filters — without manually
              coordinating styles.
            </li>
            <li>
              You use{" "}
              <strong className="text-[var(--foreground)]">AI-assisted development</strong>.
              MetricUI's MCP server lets agents generate, validate, and scaffold
              dashboards from natural language.
            </li>
            <li>
              You need polished{" "}
              <strong className="text-[var(--foreground)]">data states</strong> — loading
              skeletons, empty states, error boundaries, and stale data
              indicators — without building them from scratch.
            </li>
          </ul>
        </DocSection>

        {/* ── See It In Action ── */}
        <DocSection id="see-it-live" title="See It In Action">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Same dataset. Recharts builds one chart. MetricUI builds a full dashboard.
            Download the CSV and try it yourself.
          </p>
          <ComparisonDemo competitorCode={RECHARTS_CODE} competitorName="Recharts" competitorChart={<RechartsChart />} />
        </DocSection>

        {/* ── The Bottom Line ── */}
        <DocSection id="the-bottom-line" title="The Bottom Line">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Recharts and MetricUI are different tools for different jobs.
            Recharts is a charting library — arguably the best and most popular
            one in the React ecosystem. MetricUI is a dashboard framework that
            happens to include charts.
          </p>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            If you are adding a chart to an existing page, Recharts is a
            great choice. But if you are building an analytics dashboard,
            operations console, or reporting interface, choosing Recharts means
            you are signing up to build everything around those charts yourself:
            KPI cards, filters, filter coordination, export, layout, theming,
            loading states, and error handling. That is weeks of work that
            MetricUI ships on day one.
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The honest tradeoff: Recharts gives you a massive community and
            battle-tested maturity. MetricUI gives you a complete dashboard in a
            fraction of the time. Pick the one that matches what you are
            actually building.
          </p>
        </DocSection>
      </div>

      <aside className="sticky top-8 hidden h-fit w-48 shrink-0 py-8 pl-4 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  );
}
