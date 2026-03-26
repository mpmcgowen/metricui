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
  Zap,
  MousePointerClick,
  Shield,
  Download,
  MessageSquare,
  Filter,
  PanelRightOpen,
} from "lucide-react";
import { MetricProvider } from "@/lib/MetricProvider";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const stats = [
  { label: "Components", value: "44" },
  { label: "Chart Types", value: "11" },
  { label: "Tests", value: "436" },
  { label: "Demos", value: "5" },
];

const capabilities = [
  {
    icon: Sparkles,
    label: "AI Insights",
    title: "Your dashboard learned to talk.",
    description: "Drop in one component. Connect your LLM. End users ask questions about their data — the AI sees every chart, every filter, every number. @ mention specific metrics. Get answers grounded in what's actually on screen.",
    accent: "text-violet-500",
    bg: "bg-violet-500/8",
  },
  {
    icon: MousePointerClick,
    label: "Cross-Filtering",
    title: "Click a bar. Everything responds.",
    description: "Click a donut slice, a bar, a table row — every other component on the page filters to match. One prop: crossFilter. No wiring code. Click again to clear. Signal-only architecture — you own the data, we own the interaction.",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/8",
  },
  {
    icon: PanelRightOpen,
    label: "Drill-Downs",
    title: "Click any metric. See the detail.",
    description: "drillDown={true} auto-generates a detail panel. Or pass a function for custom content. Slide-over or modal. Nested up to 4 levels with breadcrumbs. Works on every component — KPIs, charts, tables.",
    accent: "text-blue-500",
    bg: "bg-blue-500/8",
  },
  {
    icon: Download,
    label: "Export",
    title: "PNG. CSV. Clipboard. One prop.",
    description: "exportable on MetricProvider. Every component gets a download button. 4x DPI PNGs via modern-screenshot. CSV with filter metadata. Clean filenames. The finance team stops asking you for screenshots.",
    accent: "text-amber-500",
    bg: "bg-amber-500/8",
  },
];

const features = [
  { icon: Code2, title: "One import, not six libraries", desc: "KPI cards, 11 chart types, tables, layout, formatting, theming — one package. No glue code." },
  { icon: Layers, title: "Built-in data states", desc: "Loading skeletons, empty states, error retry, stale indicators. On every component. Pass a prop." },
  { icon: Filter, title: "Complete filter system", desc: "FilterBar + PeriodSelector + DropdownFilter + SegmentToggle + FilterTags. All wired through context." },
  { icon: Palette, title: "8 theme presets + dark mode", desc: "One prop changes everything. Indigo, emerald, rose, amber, cyan, violet, slate, orange. CSS variables." },
  { icon: Zap, title: "Smart defaults, zero config", desc: "Auto column inference on tables. Auto-format from key names. MetricGrid auto-layout. It just works." },
  { icon: Bot, title: "MCP server for AI tools", desc: "Claude, Cursor, Copilot generate correct MetricUI code on the first try. Full API surface exposed." },
  { icon: Shield, title: "436 tests. TypeScript-first.", desc: "Every component tested. Every prop typed. BaseComponentProps inherited everywhere. Ship with confidence." },
  { icon: MessageSquare, title: "44 components. All free.", desc: "MIT license. No pro tier. No gates. KPIs, charts, tables, filters, layout, AI — everything ships." },
];

const demos = [
  { title: "Web Analytics", desc: "GA-style · tab nav · AI insights · cross-filter · per-device data", href: "/demos/analytics", color: "from-violet-500/20 to-violet-500/5", accent: "text-violet-400" },
  { title: "SaaS Metrics", desc: "MRR · churn · funnel · industry breakdown · AI analysis", href: "/demos/saas", color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400" },
  { title: "GitHub Analytics", desc: "Real facebook/react data · commit velocity · issue triage", href: "/demos/github", color: "from-slate-500/20 to-slate-500/5", accent: "text-slate-400" },
  { title: "Wikipedia Live", desc: "Real-time streaming · bot/human analysis · edit velocity", href: "/demos/wikipedia", color: "from-amber-500/20 to-amber-500/5", accent: "text-amber-400" },
  { title: "World Explorer", desc: "Population · GDP · languages · 4-level drill-downs", href: "/demos/world", color: "from-cyan-500/20 to-cyan-500/5", accent: "text-cyan-400" },
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
          isPositive ? "text-green-600" : "text-red-600"
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 65 lines. Still missing: goal progress, conditional coloring,
// comparison badges, copy-to-clipboard, drill-down, dense mode,
// dark mode, null handling, count-up animation, export...`;

const withCode = `import { KpiCard } from "metricui";

<KpiCard
  title="Revenue"
  value={127450}
  format="currency"
  comparison={{ value: 113500 }}
  sparkline={{ data: [89, 94, 98, 103, 108, 113, 127] }}
  loading={loading}
/>

// 10 lines. Everything included.
// Goal progress, conditional colors, drill-down,
// dark mode, export, AI context — all just props.`;

const quickStart = `import { Dashboard, KpiCard, AreaChart, MetricGrid, DashboardInsight } from "metricui";
import "metricui/styles.css";

export default function MyDashboard() {
  return (
    <Dashboard
      theme="emerald"
      filters={{ defaultPreset: "30d" }}
      exportable
      ai={{ analyze: myLLM, company: "Acme Corp", context: "Q4 revenue dashboard" }}
    >
      <MetricGrid>
        <KpiCard title="Revenue" value={127450} format="currency"
          comparison={{ value: 113500 }}
          aiContext="Our north star metric. Enterprise drives 52%." />
        <KpiCard title="Users" value={8420} format="number"
          goal={{ value: 10000, showProgress: true }} />
        <AreaChart data={revenueData} index="month" categories={["revenue"]}
          title="Revenue Over Time" crossFilter drillDown />
      </MetricGrid>
      <DashboardInsight />
    </Dashboard>
  );
}`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home() {
  const [compareTab, setCompareTab] = useState<"without" | "with">("without");

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-[var(--card-border)]">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-[var(--card-bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,rgba(129,140,248,0.08),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

        {/* Nav */}
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--foreground)] text-xs font-bold text-[var(--background)]">M</div>
            <span className="text-base font-bold tracking-tight">MetricUI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/docs" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Docs</a>
            <a href="#demos" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Demos</a>
            <a href="/roadmap" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Roadmap</a>
            <a href="https://github.com/mpmcgowen/metricui" className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"><Github className="h-4 w-4" /></a>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--accent)]">
              <Sparkles className="h-3 w-3" />
              Now with AI Insights — ask your dashboard questions
            </div>

            <h1 className="max-w-4xl text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)]">
              The last dashboard library
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
                you&apos;ll ever install.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              44 components. 11 chart types. AI-powered analysis. Cross-filtering. Drill-downs. Export.
              One import replaces six libraries — and your dashboard can explain itself.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <a href="/docs/guides/getting-started" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:shadow-xl hover:shadow-[var(--accent)]/30 hover:scale-[1.02]">
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#demos" className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 px-7 py-3.5 text-sm font-medium text-[var(--muted)] backdrop-blur transition-all hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]">
                See 5 Live Demos
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <code className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--muted)] font-[family-name:var(--font-mono)]">
                npm install metricui
              </code>
              <span className="text-xs text-[var(--muted)]">MIT · Open Source · Free</span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 flex max-w-lg items-center justify-center gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{s.value}</div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-[var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  LIVE KPI PREVIEW                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[var(--card-border)] bg-[var(--background)] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Live Components
          </p>
          <p className="mb-10 text-center text-sm text-[var(--muted)]">
            Real MetricUI components rendering below. Sparklines, comparisons, goals, conditional colors — no screenshots.
          </p>
          <MetricProvider animate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCard
                title="Revenue"
                value={127450}
                format="currency"
                comparison={{ value: 113500, label: "vs last month" }}
                sparkline={{ data: [89, 94, 98, 103, 108, 113, 127], type: "bar" }}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                description="Monthly recurring revenue across all plans."
                animate={{ countUp: true }}
              />
              <KpiCard
                title="Active Users"
                value={8420}
                format="number"
                comparison={{ value: 7680 }}
                icon={<Users className="h-3.5 w-3.5" />}
                goal={{ value: 10000, label: "Q4 Target", showProgress: true, showTarget: true }}
                animate={{ countUp: true, delay: 150 }}
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
                animate={{ countUp: true, delay: 300 }}
              />
            </div>
          </MetricProvider>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  CAPABILITIES — the big four                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Superpowers</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Not just charts.<br />A complete dashboard intelligence platform.
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.label} className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 transition-all hover:border-[var(--accent)]/20 hover:shadow-xl hover:shadow-[var(--accent)]/5">
                <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider", c.bg, c.accent)}>
                  <c.icon className="h-3 w-3" />
                  {c.label}
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--foreground)]">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  BEFORE / AFTER                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--card-border)] bg-[var(--card-bg)] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Before &amp; After</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
              65 lines of glue code?<br />Or 10 lines that do more?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)]">
              One KPI card with formatting, comparison, sparkline, loading, error handling, dark mode, export, and AI context.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-1 w-fit mx-auto">
            <button
              onClick={() => setCompareTab("without")}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium transition-all",
                compareTab === "without" ? "bg-red-500/10 text-red-500" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              Without MetricUI
            </button>
            <button
              onClick={() => setCompareTab("with")}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium transition-all",
                compareTab === "with" ? "bg-emerald-500/10 text-emerald-500" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              With MetricUI
            </button>
          </div>

          <div className="mt-8">
            {compareTab === "without" ? (
              <CodeBlock code={withoutCode} language="tsx" filename="RevenueCard.tsx — 65 lines, still missing features" />
            ) : (
              <CodeBlock code={withCode} language="tsx" filename="RevenueCard.tsx — 10 lines, everything included" />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  QUICK START                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Quick Start</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
              A complete AI-powered dashboard.<br />25 lines.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)]">
              Dashboard wrapper, filters, cross-filtering, drill-downs, export, and AI chat — all configured.
            </p>
          </div>
          <div className="mt-10">
            <CodeBlock code={quickStart} language="tsx" filename="app/dashboard/page.tsx" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  FEATURES GRID                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--card-border)] bg-[var(--card-bg)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Everything Included</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
              The features real dashboards need
            </h2>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5 transition-all hover:border-[var(--accent)]/20">
                <f.icon className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="mt-3 text-[13px] font-semibold text-[var(--foreground)]">{f.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  LIVE DEMOS                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="demos" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Live Demos</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Don&apos;t take our word for it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)]">
              Five fully interactive dashboards. Real data. Real AI. Real cross-filtering. Click around.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((d, i) => (
              <a
                key={d.href}
                href={d.href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-7 transition-all hover:border-[var(--accent)]/30 hover:shadow-xl hover:shadow-[var(--accent)]/5 hover:-translate-y-0.5",
                  i === 0 && "sm:col-span-2 lg:col-span-2",
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100", d.color)} />
                <div className="relative">
                  <h3 className={cn("text-lg font-bold transition-colors group-hover:text-[var(--accent)]", "text-[var(--foreground)]")}>
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{d.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  CTA                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Your next dashboard deserves better.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)]">
            Stop assembling six libraries into a dashboard. Start building one that thinks.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="/docs/guides/getting-started" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:shadow-xl hover:shadow-[var(--accent)]/30 hover:scale-[1.02]">
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://github.com/mpmcgowen/metricui" className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-7 py-3.5 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]">
              <Github className="h-4 w-4" /> Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-sm text-[var(--muted)]">&copy; {new Date().getFullYear()} MetricUI. MIT License.</p>
          <div className="flex items-center gap-4">
            <a href="/docs" className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Docs</a>
            <a href="/roadmap" className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Roadmap</a>
            <a href="https://github.com/mpmcgowen/metricui" className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
