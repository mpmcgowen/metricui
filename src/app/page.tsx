"use client";

import { useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowRight,
  Palette,
  Layers,
  Code2,
  Sparkles,
  BarChart3,
  Bot,
  Github,
} from "lucide-react";
import { MetricProvider } from "@/lib/MetricProvider";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Code2,
    title: "One import, not six libraries",
    description: "KPI cards, charts, tables, layout, and formatting in a single package. No glue code.",
  },
  {
    icon: Layers,
    title: "Built-in data states",
    description: "Loading, empty, error, and stale states on every component. Pass a prop, not build a wrapper.",
  },
  {
    icon: Sparkles,
    title: "Smart format engine",
    description: "Currency, percent, duration, compact numbers — centralized formatting with locale support.",
  },
  {
    icon: Palette,
    title: "Theming that works",
    description: "8 presets, CSS variables, dark mode, dense mode, 5 card variants. One provider, zero config.",
  },
  {
    icon: BarChart3,
    title: "Unified data format",
    description: "Same data array works across Area, Line, Bar, Donut, and HeatMap. No reshaping between chart types.",
  },
  {
    icon: Bot,
    title: "MCP server for AI tools",
    description: "AI coding tools generate correct MetricUI code on the first try. Full API surface exposed.",
  },
];

const demos = [
  {
    title: "SaaS Analytics",
    description: "MRR, churn, user growth, channel performance",
    href: "/demos/saas",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "GitHub Analytics",
    description: "Repository stats, contributors, activity",
    href: "/demos/github",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Wikipedia Live",
    description: "Real-time streaming data dashboard",
    href: "/demos/wikipedia",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "World Data",
    description: "Population, GDP, geographic metrics",
    href: "/demos/world",
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

const components = [
  { name: "KpiCard", href: "/docs/kpi-card", icon: BarChart3 },
  { name: "StatGroup", href: "/docs/stat-group", icon: Layers },
  { name: "AreaChart", href: "/docs/area-chart", icon: BarChart3 },
  { name: "LineChart", href: "/docs/line-chart", icon: BarChart3 },
  { name: "BarChart", href: "/docs/bar-chart", icon: BarChart3 },
  { name: "BarLineChart", href: "/docs/bar-line-chart", icon: BarChart3 },
  { name: "DonutChart", href: "/docs/donut-chart", icon: BarChart3 },
  { name: "Sparkline", href: "/docs/sparkline", icon: BarChart3 },
  { name: "Gauge", href: "/docs/gauge", icon: BarChart3 },
  { name: "HeatMap", href: "/docs/heatmap", icon: BarChart3 },
  { name: "DataTable", href: "/docs/data-table", icon: Layers },
  { name: "MetricGrid", href: "/docs/metric-grid", icon: Layers },
  { name: "DashboardHeader", href: "/docs/dashboard-header", icon: Layers },
  { name: "PeriodSelector", href: "/docs/period-selector", icon: Layers },
  { name: "SegmentToggle", href: "/docs/segment-toggle", icon: Layers },
  { name: "DropdownFilter", href: "/docs/dropdown-filter", icon: Layers },
  { name: "FilterTags", href: "/docs/filter-tags", icon: Layers },
  { name: "Callout", href: "/docs/callout", icon: Layers },
  { name: "StatusIndicator", href: "/docs/status-indicator", icon: Layers },
  { name: "Badge", href: "/docs/badge", icon: Layers },
  { name: "SectionHeader", href: "/docs/section-header", icon: Layers },
  { name: "Divider", href: "/docs/divider", icon: Layers },
];

const withoutCode = `// The usual way — Recharts + shadcn + custom everything
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

function RevenueCard({ value, prev, sparkline, loading, error }) {
  if (loading) return (
    <Card>
      <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardContent className="py-8 text-center text-sm text-red-500">
        Failed to load — <button onClick={() => window.location.reload()}>Retry</button>
      </CardContent>
    </Card>
  );

  const change = prev !== 0 ? ((value - prev) / prev) * 100 : 0;
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
          Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{formatCurrency(value)}</p>
        <div className={cn("flex items-center gap-1 text-sm mt-1",
          isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          <Icon className="h-3 w-3" />
          <span>{isPositive ? "+" : ""}{change.toFixed(1)}% vs last month</span>
        </div>
        {sparkline && (
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline.map((v, i) => ({ i, v }))}>
                <Area type="monotone" dataKey="v" stroke="#6366f1"
                  fill="url(#grad)" strokeWidth={1.5} />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// And you still don't have: goal progress, conditional coloring,
// comparison badges, copy-to-clipboard, drill-down, dense mode,
// dark mode theming, null handling, count-up animation...`;

const withCode = `// MetricUI — same result, zero glue code
import { KpiCard } from "metricui";

function RevenueCard({ value, prev, loading }) {
  return (
    <KpiCard
      title="Revenue"
      value={value}
      format="currency"
      comparison={{ value: prev }}
      loading={loading}
    />
  );
}`;

const quickStart = `import { KpiCard, AreaChart, MetricGrid, MetricProvider } from "metricui";
import "metricui/styles.css";

export default function Dashboard() {
  return (
    <MetricProvider theme="emerald" dense>
      <MetricGrid>
        <KpiCard
          title="Revenue"
          value={127450}
          format="currency"
          comparison={{ value: 113500 }}
          sparklineData={[89, 94, 98, 103, 108, 113, 127]}
        />
        <AreaChart data={revenueData} title="Revenue Over Time" />
      </MetricGrid>
    </MetricProvider>
  );
}`;

export default function Home() {
  const [compareTab, setCompareTab] = useState<"without" | "with">("without");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[var(--card-border)] bg-[var(--card-bg)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(129,140,248,0.06),transparent)]" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--foreground)] text-xs font-bold text-[var(--background)]">
              M
            </div>
            <span className="text-base font-bold tracking-tight">MetricUI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/docs" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
              Docs
            </a>
            <a href="#demos" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
              Demos
            </a>
            <a href="https://github.com/mpmcgowen/metricui" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
              <Github className="h-4 w-4" />
            </a>
            <ThemeToggle />
          </div>
        </nav>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Open source — MIT license
          </div>
          <h1 className="mx-auto max-w-3xl text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-[var(--foreground)]">
            The missing UI layer
            <br />
            <span className="text-[var(--accent)]">
              for React dashboards
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--muted)]">
            KPI cards, charts, tables, and layout — with built-in formatting, theming, data states, and zero config. One import, not six libraries.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <a href="/docs/guides/getting-started" className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-all hover:opacity-80">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#demos" className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]">
              See Demos
            </a>
          </div>
          <div className="mt-6">
            <code className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--muted)]">
              npm install metricui
            </code>
          </div>
        </div>
      </header>

      {/* Inline preview — 3 KPI cards with context */}
      <section className="border-b border-[var(--card-border)] bg-[var(--background)] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-8 text-center text-sm text-[var(--muted)]">
            3 props each. No formatting code. No layout CSS. No loading state wrapper.
          </p>
          <MetricProvider animate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCard
                title="Revenue"
                value={127450}
                format="currency"
                comparison={{ value: 113500 }}
                sparklineData={[89, 94, 98, 103, 108, 113, 127]}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                animate={{ countUp: true }}
              />
              <KpiCard
                title="Active Users"
                value={8420}
                format="number"
                comparison={{ value: 7680 }}
                icon={<Users className="h-3.5 w-3.5" />}
                goal={{ value: 10000, showProgress: true }}
                animate={{ countUp: true, delay: 100 }}
              />
              <KpiCard
                title="Conversion"
                value={4.8}
                format="percent"
                comparison={{ value: 4.2 }}
                icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                conditions={[
                  { when: "above", value: 4, color: "emerald" },
                  { when: "between", min: 3, max: 4, color: "amber" },
                  { when: "below", value: 3, color: "red" },
                ]}
                animate={{ countUp: true, delay: 200 }}
              />
            </div>
          </MetricProvider>
        </div>
      </section>

      {/* Before / After comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Before &amp; After
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Stop assembling dashboards from scratch
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              One KPI card with formatting, comparison, sparkline, loading, and error handling.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mt-10 flex items-center justify-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-1 w-fit mx-auto">
            <button
              onClick={() => setCompareTab("without")}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                compareTab === "without"
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              Without MetricUI
            </button>
            <button
              onClick={() => setCompareTab("with")}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                compareTab === "with"
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              With MetricUI
            </button>
          </div>

          <div className="mt-6">
            {compareTab === "without" ? (
              <div>
                <CodeBlock code={withoutCode} language="tsx" filename="RevenueCard.tsx — 65 lines and still missing features" />
              </div>
            ) : (
              <div>
                <CodeBlock code={withCode} language="tsx" filename="RevenueCard.tsx — 10 lines, everything included" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[var(--card-border)] bg-[var(--card-bg)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Why MetricUI
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Everything a dashboard needs, nothing it doesn&apos;t
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-6">
                <f.icon className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick start code */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Quick Start
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              A complete dashboard in 20 lines
            </h2>
          </div>
          <div className="mt-10">
            <CodeBlock code={quickStart} language="tsx" filename="app/dashboard/page.tsx" />
          </div>
        </div>
      </section>

      {/* Live demos */}
      <section id="demos" className="border-y border-[var(--card-border)] bg-[var(--card-bg)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Live Demos
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              See it in action
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Full interactive dashboards built entirely with MetricUI.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {demos.map((d) => (
              <a
                key={d.href}
                href={d.href}
                className="group rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-6 transition-all hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5"
              >
                <div className={cn("mb-3 inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider", d.color)}>
                  Demo
                </div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {d.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{d.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  View demo <ArrowRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Components grid */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              22 Components
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Everything ships free
            </h2>
          </div>
          <div className="mx-auto mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {components.map((c) => (
              <a
                key={c.name}
                href={c.href}
                className="group flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6">
          <p className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} MetricUI. MIT License.
          </p>
          <div className="flex items-center gap-4">
            <a href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Docs</a>
            <a href="https://github.com/mpmcgowen/metricui" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
