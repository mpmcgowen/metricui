"use client";

import { KpiCard } from "@/components/cards/KpiCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
  },
  {
    title: "GitHub Analytics",
    description: "Repository stats, contributors, activity",
    href: "/demos/github",
  },
  {
    title: "Wikipedia Live",
    description: "Real-time streaming data dashboard",
    href: "/demos/wikipedia",
  },
  {
    title: "World Data",
    description: "Population, GDP, geographic metrics",
    href: "/demos/world",
  },
];

const codeExample = `import { KpiCard, AreaChart, MetricGrid, MetricProvider } from "metricui";
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
        />
        <AreaChart
          data={revenueData}
          title="Revenue Over Time"
        />
      </MetricGrid>
    </MetricProvider>
  );
}`;

export default function Home() {
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

      {/* Inline preview — just 3 KPI cards */}
      <section className="border-b border-[var(--card-border)] bg-[var(--background)] py-16">
        <div className="mx-auto max-w-4xl px-6">
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

      {/* Features */}
      <section className="py-20">
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
              <div key={f.title} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <f.icon className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="border-y border-[var(--card-border)] bg-[var(--card-bg)] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Quick Start
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              A complete dashboard in 15 lines
            </h2>
          </div>
          <pre className="mt-10 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-6 text-sm leading-relaxed text-[var(--muted)]">
            <code>{codeExample}</code>
          </pre>
        </div>
      </section>

      {/* Live demos */}
      <section id="demos" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Live Demos
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              See it in action
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Full interactive dashboards built entirely with MetricUI components.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {demos.map((d) => (
              <a
                key={d.href}
                href={d.href}
                className="group rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 transition-all hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5"
              >
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

      {/* Component list */}
      <section className="border-t border-[var(--card-border)] bg-[var(--card-bg)] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            22 Components
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Everything ships free
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
            KpiCard &middot; StatGroup &middot; AreaChart &middot; LineChart &middot; BarChart &middot; BarLineChart &middot; DonutChart &middot; Sparkline &middot; Gauge &middot; HeatMap &middot; DataTable &middot; MetricGrid &middot; DashboardHeader &middot; SectionHeader &middot; Divider &middot; PeriodSelector &middot; SegmentToggle &middot; DropdownFilter &middot; FilterTags &middot; Callout &middot; StatusIndicator &middot; Badge
          </p>
          <div className="mt-8">
            <a href="/docs" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline">
              Browse all components <ArrowRight className="h-3.5 w-3.5" />
            </a>
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
