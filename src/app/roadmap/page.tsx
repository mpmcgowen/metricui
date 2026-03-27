import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle2,
  Zap,
  Wand2,
  Terminal,
  Brain,
  Eye,
  Workflow,
  Shield,
  Flag,
  MessageSquare,
  Github,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmap — MetricUI",
  description:
    "See what's shipped, what's next, and where MetricUI is headed. From cross-filtering to anomaly detection to 1.0 stability.",
};

interface Milestone {
  version: string;
  title: string;
  tagline: string;
  status: "shipped" | "next" | "planned";
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  newComponents?: string[];
}

const milestones: Milestone[] = [
  {
    version: "0.2",
    title: "The Foundation",
    tagline:
      "26 components, format engine, 8 theme presets, MCP server, full docs site. Everything you need to build a production dashboard today.",
    status: "shipped",
    icon: CheckCircle2,
    highlights: [
      "KPI cards with sparklines, goal tracking, conditional coloring, and drill-downs",
      "11 chart types — Area, Line, Bar, Donut, Gauge, HeatMap, Funnel, Waterfall, Bullet, Bar+Line, Sparkline",
      "Smart format engine — currency, percent, duration, compact — with locale support",
      "Complete filter system — PeriodSelector, DropdownFilter, SegmentToggle, FilterTags",
      "MetricGrid auto-layout — drop components in, zero CSS needed",
      "Loading skeletons, empty states, error boundaries, stale indicators on every component",
      "8 theme presets, dark mode, dense mode, CSS variable theming",
      "MCP server with 13 tools so AI builds correct dashboards on the first try",
      "185+ tests, interactive docs, llms.txt for AI tools",
    ],
  },
  {
    version: "0.3",
    title: "Dashboards That React",
    tagline:
      "Click a bar in one chart and every other component on the page responds. Cross-filtering, linked hover, value flash, and a CLI that gets you from install to dashboard in 60 seconds.",
    status: "shipped",
    icon: Zap,
    highlights: [
      "CrossFilterProvider — signal-only click filtering with useCrossFilter and useCrossFilteredData hooks",
      "LinkedHoverProvider — synced crosshairs and tooltips across charts, zero config",
      "useValueFlash — opt-in highlight animation when data changes in real time",
      "npx metricui init — detects framework, configures AI tools, scaffolds a starter dashboard",
      "crossFilter prop on all categorical charts — BarChart, DonutChart, AreaChart, HeatMap, Funnel, Waterfall, BarLineChart, DataTable",
      "Stable donut colors — filtering won't change a slice's color",
      "Fully interactive demos — every filter on every demo page actually works",
    ],
    newComponents: ["CrossFilterProvider", "LinkedHoverProvider", "useValueFlash", "useCrossFilteredData"],
  },
  {
    version: "0.4",
    title: "The Dashboard That Ships",
    tagline:
      "Everything that turns a prototype into a product. FilterBar, DrillDown, Export, CardShell unification, tooltip hints, sticky filters, and reactive drill content.",
    status: "shipped",
    icon: Wand2,
    highlights: [
      "DrillDown system — slide-over and modal panels with nested breadcrumbs, up to 4 levels deep",
      "FilterBar — collapsible container with auto-tags, badge count, sticky frosted-glass mode",
      "Export — PNG (4x DPI), CSV with filter metadata, clipboard copy via ExportButton",
      "CardShell — unified card wrapper for all components (KPI, charts, tables, status)",
      "Tooltip action hints — auto 'Click to drill down' / 'Click to filter' on interactive charts",
      "Auto empty states — components detect empty data and show filter-aware messages",
      "Reactive drill content — live-updating drill panels for streaming data dashboards",
    ],
    newComponents: [
      "FilterBar",
      "DrillDown.Root",
      "DrillDownOverlay",
      "ExportButton",
      "CardShell",
      "AutoDrillTable",
      "useDrillDownAction",
    ],
  },
  {
    version: "0.5",
    title: "The DX Release",
    tagline:
      "Developer experience. 5 providers → 1 component, zero type casts, smart column inference, tab navigation, filter convenience hooks.",
    status: "shipped",
    icon: Terminal,
    highlights: [
      "Dashboard wrapper — 5 nested providers replaced by one <Dashboard> component with flat props",
      "DataRow type — zero as-never casts, typed interfaces just work with DataTable and all charts",
      "Smart column inference — omit columns prop, DataTable auto-detects numbers, dates, booleans, badges",
      "DashboardNav — tab and scroll navigation with FilterBar.Nav slot for unified sticky bar",
      "Filter convenience hooks — useFilterValue, useHasComparison, useActiveFilterCount",
      "MetricGrid fragment flattening — auto-layout works through React fragment wrappers",
      "Analytics demo — GA-style dashboard with 4 tab views and per-device filtering",
    ],
    newComponents: ["Dashboard", "DashboardNav", "FilterBar.Nav", "useFilterValue", "useHasComparison", "useActiveFilterCount"],
  },
  {
    version: "0.6",
    title: "The Intelligence Layer",
    tagline:
      "Bring-your-own-LLM dashboard analysis. A floating chat that reads your live data, understands your business context, and answers questions about your metrics. Works with any model.",
    status: "shipped",
    icon: Brain,
    highlights: [
      "DashboardInsight — floating chat button + slide-over sidebar with streaming AI responses",
      "Auto data collection — every component registers live data, updates when filters change",
      "Three-level context — company, dashboard, and per-component aiContext for smarter analysis",
      "@ mentions — reference specific charts in questions, keyboard navigation, multiple mentions",
      "Per-card sparkle icon — hover any card, click to open AI chat scoped to that metric",
      "Works with any LLM — OpenAI, Anthropic, local models. You bring the API key, we handle the UX",
    ],
    newComponents: [
      "DashboardInsight",
      "AiContext",
      "BaseComponentProps",
      "DataComponentProps",
    ],
  },
  {
    version: "0.7",
    title: "The Chart Expansion",
    tagline:
      "7 new chart types with bundled map features. 18 charts total covering every analytics use case from scatter plots to geographic maps. Alpha-3 country codes and 2-letter state abbreviations — no numeric IDs to look up.",
    status: "shipped",
    icon: Eye,
    highlights: [
      "ScatterPlot — correlation analysis with reference lines, linked hover, and bubble sizing",
      "Treemap — hierarchical breakdowns with flat or nested data, 5 tiling algorithms",
      "Calendar — GitHub-style contribution heatmap with auto date range detection",
      "Radar — multi-dimensional comparison with overlay support",
      "Sankey — flow visualization with gradient links, flat row or native format",
      "Choropleth — geographic heatmap with sqrt/log scale, tooltipLabel, country name resolution",
      "Bump — ranking chart with auto-ranking from flat data",
      "Bundled worldFeatures (alpha-3 codes) and usStatesFeatures (2-letter abbreviations)",
      "199 new tests (635 total), tick collision fix, granularity toggle cookbook recipe",
    ],
    newComponents: [
      "ScatterPlot",
      "Treemap",
      "Calendar",
      "Radar",
      "Sankey",
      "Choropleth",
      "Bump",
      "worldFeatures",
      "usStatesFeatures",
    ],
  },
  {
    version: "0.8",
    title: "The Polish",
    tagline:
      "Saved views, DRY architecture, accessibility, and doc site infrastructure. The release that turned a feature-complete library into a well-engineered one.",
    status: "shipped",
    icon: Workflow,
    highlights: [
      "useDashboardState — serialize/restore entire dashboard state for shareable links and saved views",
      "useChartInteraction — centralized drill-down/cross-filter/linked-hover logic across all 14 charts",
      "6 shared doc components — eliminated 1,400+ lines of boilerplate across 46+ pages",
      "Accessibility — ARIA roles on SegmentToggle, screen reader announcements, icon button labels",
      "useDropdown hook — shared keyboard navigation + ARIA for all dropdown components",
      "42 components in MCP knowledge base, all doc pages standardized",
      "Fixed-position TOC with accent bar active indicator",
    ],
    newComponents: ["useDashboardState", "useChartInteraction", "useDropdown"],
  },
  {
    version: "0.9",
    title: "Rock Solid",
    tagline:
      "Nothing new, everything better. Full keyboard navigation, color-blind safe mode, performance benchmarks, API consistency, edge case testing. This is when MetricUI earns \"production-ready.\"",
    status: "next",
    icon: Shield,
    highlights: [
      "Wire useDropdown into DropdownFilter, PeriodSelector, ExportButton — full keyboard nav",
      "Focus traps on DashboardInsight sidebar and DrillDownPanel",
      "Chart aria-labels — every chart gets role=\"img\" with auto-generated description",
      "API consistency — modern drillDown on Gauge/BulletChart, data states on StatGroup",
      "Edge case testing — 0 points, 10K points, nulls, long strings, negative values",
      "Performance benchmarks — 50 charts, 1000-row tables, FPS and memory profiling",
      "Color-blind safe mode and WCAG AA contrast compliance",
      "i18n — translatable data state messages, RTL layout support",
    ],
  },
  {
    version: "1.0",
    title: "The Standard",
    tagline:
      "API freeze. Semantic versioning contract. 18-month LTS commitment. Premium templates. MetricUI 1.0 is a promise: build on it with confidence.",
    status: "planned",
    icon: Flag,
    highlights: [
      "Stable API — no breaking changes without a major version bump",
      "create-metric-app CLI — scaffold a working dashboard in 30 seconds",
      "Starter templates for SaaS, ecommerce, DevOps, and finance",
      "Premium dashboard templates available for teams that want production-ready designs",
      "Complete documentation — every component, every prop, every pattern",
    ],
  },
];

const statusConfig = {
  shipped: {
    label: "Shipped",
    dotClass: "bg-emerald-500",
    badgeColor: "emerald" as const,
    ringClass: "ring-emerald-500/20",
  },
  next: {
    label: "Up Next",
    dotClass: "bg-amber-500 animate-pulse",
    badgeColor: "amber" as const,
    ringClass: "ring-amber-500/20",
  },
  planned: {
    label: "Planned",
    dotClass: "bg-zinc-400 dark:bg-zinc-600",
    badgeColor: "gray" as const,
    ringClass: "ring-zinc-500/10",
  },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#0A0A0C]">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MetricUI
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Docs
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Roadmap
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            MetricUI is building toward 1.0 — a stable, complete, and
            beautifully polished React dashboard library. Here is where we are
            and where we are going.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Shipped</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Up Next</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
              <span className="text-zinc-600 dark:text-zinc-400">Planned</span>
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 sm:left-[31px]" />

          <div className="space-y-12">
            {milestones.map((milestone) => {
              const config = statusConfig[milestone.status];
              const Icon = milestone.icon;

              return (
                <div key={milestone.version} className="relative flex gap-6 sm:gap-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 sm:h-16 sm:w-16">
                    <Icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        milestone.status === "shipped"
                          ? "text-emerald-500"
                          : milestone.status === "next"
                            ? "text-amber-500"
                            : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    {/* Version + status badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                        v{milestone.version}
                      </span>
                      <Badge color={config.badgeColor} size="sm" variant="outline">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
                          {config.label}
                        </span>
                      </Badge>
                    </div>

                    {/* Title */}
                    <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                      {milestone.title}
                    </h2>

                    {/* Tagline */}
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {milestone.tagline}
                    </p>

                    {/* Highlights */}
                    <ul className="mt-4 space-y-2">
                      {milestone.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300"
                        >
                          <span
                            className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                              milestone.status === "shipped"
                                ? "bg-emerald-500"
                                : milestone.status === "next"
                                  ? "bg-amber-500"
                                  : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* New components */}
                    {milestone.newComponents &&
                      milestone.newComponents.length > 0 && (
                        <div className="mt-4">
                          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            New Components
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {milestone.newComponents.map((comp) => (
                              <span
                                key={comp}
                                className="inline-block rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Post-1.0 teaser */}
        <div className="mt-20 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Beyond 1.0
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            After the stable release, MetricUI keeps growing. Here is a preview
            of what is on the horizon as post-1.0 minor releases.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "More chart types",
                items:
                  "Candlestick, Box Plot, Slope Chart, Sunburst, Stream/ThemeRiver, Waffle, Network Graph, Small Multiples, Sparkline Table",
              },
              {
                title: "Advanced features",
                items:
                  "Pivot Table, Cascading Filters, VS Code Extension, Collaborative annotations, DataStory guided walkthroughs, useMetricQuery data hook, useMetricStream real-time hook",
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {section.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {section.items}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Shape the roadmap
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Have a feature request? Want to upvote something on this list? We
            build in the open and prioritize based on what developers actually
            need.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/mpmcgowen/metricui/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <MessageSquare className="h-4 w-4" />
              Join the Discussion
            </a>
            <a
              href="https://github.com/mpmcgowen/metricui/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <Github className="h-4 w-4" />
              Open an Issue
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
          MetricUI is open source (MIT). Built for developers who care about
          design.
        </div>
      </footer>
    </div>
  );
}
