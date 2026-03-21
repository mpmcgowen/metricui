"use client";

import { useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Gauge } from "@/components/charts/Gauge";
import { HeatMap } from "@/components/charts/HeatMap";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Callout } from "@/components/ui/Callout";
import { DataTable } from "@/components/tables/DataTable";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { Badge } from "@/components/ui/Badge";
import {
  revenueData,
  userGrowthData,
  channelBarData,
  trafficSourceData,
  tableData,
  kpiSparklines,
} from "@/data/sample";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  Activity,
  ArrowRight,
} from "lucide-react";
import { MetricProvider } from "@/lib/MetricProvider";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { FilterProvider, useMetricFilters, PRESET_LABELS } from "@/lib/FilterContext";
import { THEME_PRESETS, PRESET_NAMES } from "@/lib/themes";
import type { CardVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

function ActivePeriodLabel() {
  const filters = useMetricFilters();
  if (!filters?.period) return null;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const label = filters.preset ? PRESET_LABELS[filters.preset] : `${fmt(filters.period.start)} – ${fmt(filters.period.end)}`;
  return (
    <span className="text-xs text-[var(--muted)]">
      Showing: {label}
    </span>
  );
}

export default function Home() {
  const [variant, setVariant] = useState<CardVariant>("default");
  const [themeName, setThemeName] = useState("indigo");
  const [dense, setDense] = useState(false);
  const [animate, setAnimate] = useState(true);

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
            <a
              href="#components"
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Components
            </a>
            <a
              href="/docs"
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Docs
            </a>
            <a
              href="https://github.com/mpmcgowen/metricui"
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              GitHub
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
            <a href="#components" className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]">
              See Components
            </a>
          </div>
          <div className="mt-6">
            <code className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--muted)]">
              npm install metricui
            </code>
          </div>
        </div>
      </header>

      {/* Global Config Bar */}
      <div className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Try it
          </span>
          {/* Variant pills */}
          <div className="flex items-center gap-1">
            {(["default", "outlined", "ghost", "elevated", "flat"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  variant === v
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Dense toggle */}
          <label className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--muted)]">Dense</span>
            <button
              role="switch"
              aria-checked={dense}
              onClick={() => setDense(!dense)}
              className={cn(
                "relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors",
                dense ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"
              )}
            >
              <span className={cn(
                "inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform",
                dense ? "translate-x-[14px]" : "translate-x-[2px]"
              )} />
            </button>
          </label>
          {/* Animate toggle */}
          <label className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--muted)]">Animate</span>
            <button
              role="switch"
              aria-checked={animate}
              onClick={() => setAnimate(!animate)}
              className={cn(
                "relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors",
                animate ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"
              )}
            >
              <span className={cn(
                "inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform",
                animate ? "translate-x-[14px]" : "translate-x-[2px]"
              )} />
            </button>
          </label>
          {/* Theme color dots */}
          <div className="flex items-center gap-1.5 border-l border-[var(--card-border)] pl-6 ml-2">
            <span className="text-[11px] font-medium text-[var(--muted)]">Theme</span>
            {PRESET_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setThemeName(name)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  themeName === name ? "border-[var(--foreground)] scale-110" : "border-transparent opacity-70 hover:opacity-100"
                )}
                style={{ backgroundColor: THEME_PRESETS[name].accent }}
                title={THEME_PRESETS[name].name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Demo Dashboard */}
      <section id="components" className="mx-auto max-w-7xl px-6 py-20">
        <MetricProvider variant={variant} dense={dense} animate={animate} theme={themeName}>
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            Live Preview
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Every component below ships with MetricUI
          </h2>
        </div>

        {/* Dashboard powered by MetricGrid — zero layout boilerplate */}
        <FilterProvider defaultPreset="30d">
        <MetricGrid>
          <DashboardHeader
            title="SaaS Analytics"
            subtitle="Q1 2026 Performance"
            lastUpdated={new Date(Date.now() - 2 * 60 * 1000)}
            staleAfter={10}
            description="Live preview of MetricUI components — toggle variant, theme, and density above."
          />

          {/* Period Selector — filter controls */}
          <div className="col-span-full flex items-center gap-3">
            <PeriodSelector comparison />
            <ActivePeriodLabel />
          </div>

          <Callout
            variant="warning"
            title="Data is 15 minutes stale"
            dismissible
            dense
            action={{ label: "Refresh now", onClick: () => {} }}
          >
            The data pipeline last synced at {new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString()}. Some metrics may be outdated.
          </Callout>

          <MetricGrid.Section title="Overview" subtitle="Key metrics this month" />
          <KpiCard
            title="Revenue"
            value={78400}
            format="currency"
            comparison={{ value: 69700 }}
            comparisonLabel="vs last month"
            sparklineData={kpiSparklines.revenue}
            sparklinePreviousPeriod={[38, 40, 42, 44, 41, 47, 50, 53, 51, 56, 60, 65]}
            icon={<DollarSign className="h-3.5 w-3.5" />}
            description="Net revenue after refunds. Excludes enterprise contracts."
            animate={{ countUp: true }}
            copyable
          />
          {/* Card 2: No sparkline — big clean number + goal */}
          <KpiCard
            title="Active Users"
            value={3200}
            format="number"
            comparison={{ value: 2710 }}
            comparisonLabel="vs last month"
            icon={<Users className="h-3.5 w-3.5" />}
            goal={{ value: 5000, label: "Q1 Target", showProgress: true }}
            animate={{ countUp: true, delay: 100 }}
          />
          {/* Card 3: Conditional formatting + dynamic title */}
          <KpiCard
            title={(ctx) =>
              ctx.conditionColor === "emerald"
                ? "Conversion — Healthy"
                : ctx.conditionColor === "amber"
                  ? "Conversion — Watch"
                  : "Conversion — Critical"
            }
            value={4.2}
            format="percent"
            comparison={{ value: 3.4 }}
            comparisonLabel="vs last month"
            sparklineData={kpiSparklines.conversion}
            icon={<ArrowUpRight className="h-3.5 w-3.5" />}
            conditions={[
              { when: "above", value: 4, color: "emerald" },
              { when: "between", min: 3, max: 4, color: "amber" },
              { when: "below", value: 3, color: "red" },
            ]}
            animate={{ countUp: true, delay: 200 }}
          />
          {/* Card 4: Inverted trend + drill-down */}
          <KpiCard
            title="Churn Rate"
            value={3.2}
            format="percent"
            comparison={{ value: 3.8, invertTrend: true }}
            comparisonLabel="vs last month"
            sparklineData={[4.1, 3.9, 3.8, 3.6, 3.5, 3.4, 3.2]}
            icon={<Activity className="h-3.5 w-3.5" />}
            subtitle={(ctx) =>
              ctx.comparison?.trend === "positive"
                ? "Improving"
                : "Needs attention"
            }
            drillDown={{ label: "View cohorts", onClick: () => {} }}
            animate={{ countUp: true, delay: 300 }}
          />

          <MetricGrid.Section title="Charts" border />
          <AreaChart
              data={revenueData}
              title="Revenue Over Time"
              subtitle="Monthly recurring revenue (MRR)"
              height={320}
              action={
                <select className="rounded-md border border-[var(--card-border)] bg-transparent px-2 py-1 text-xs text-[var(--muted)]">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 30 days</option>
                </select>
              }
            />
          <DonutChart
            data={trafficSourceData}
            title="Traffic Sources"
            subtitle="Distribution by channel"
            height={320}
            centerValue="42%"
            centerLabel="Organic"
          />

          <MetricGrid.Section title="Growth" border />
          <LineChart
            data={userGrowthData}
            title="User Growth"
            subtitle="New vs returning users"
            height={280}
          />
          <BarChart
            data={channelBarData}
            keys={["visitors", "conversions"]}
            indexBy="channel"
            title="Channel Performance"
            subtitle="Visitors and conversions by channel"
            height={280}
            groupMode="grouped"
          />

          <MetricGrid.Section title="Engagement" />
          <StatGroup
            stats={[
              { label: "Total Pageviews", value: "1.2M", change: 14.2 },
              { label: "Bounce Rate", value: "34.7%", change: -2.3 },
              { label: "Avg. Session", value: "4m 32s", change: 8.1 },
              { label: "Pages / Session", value: "3.8", change: 5.4 },
            ]}
          />

          <MetricGrid.Section title="Health" border />
          <Gauge
            title="CPU Usage"
            value={73}
            max={100}
            format="percent"
            thresholds={[
              { value: 0, color: "#10b981" },
              { value: 60, color: "#f59e0b" },
              { value: 85, color: "#ef4444" },
            ]}
            subtitle="avg. last 5 min"
            animate={{ countUp: true }}
          />
          <Gauge
            title="NPS Score"
            value={72}
            min={-100}
            max={100}
            format="number"
            color="#6366f1"
            subtitle="Q1 2026"
            arcAngle={180}
            animate={{ countUp: true, delay: 100 }}
          />
          <Gauge
            title="Budget Spent"
            value={67500}
            max={100000}
            format="currency"
            target={80000}
            targetLabel="Budget Cap"
            thresholds={[
              { value: 0, color: "#10b981" },
              { value: 70000, color: "#f59e0b" },
              { value: 90000, color: "#ef4444" },
            ]}
            subtitle="FY 2026"
            animate={{ countUp: true, delay: 200 }}
          />

          <MetricGrid.Section title="Status" />
          <StatGroup
            stats={[
              {
                label: "API Gateway",
                value: "",
                icon: (
                  <StatusIndicator
                    value={99.98}
                    rules={[
                      { min: 99.9, color: "emerald", label: "Operational" },
                      { min: 99, max: 99.9, color: "amber", label: "Degraded" },
                      { max: 99, color: "red", label: "Down" },
                    ]}
                    size="dot"
                  />
                ),
              },
              {
                label: "Auth Service",
                value: "",
                icon: (
                  <StatusIndicator
                    value={99.5}
                    rules={[
                      { min: 99.9, color: "emerald", label: "Operational" },
                      { min: 99, max: 99.9, color: "amber", label: "Degraded" },
                      { max: 99, color: "red", label: "Down" },
                    ]}
                    size="dot"
                  />
                ),
              },
              {
                label: "Database",
                value: "",
                icon: (
                  <StatusIndicator
                    value={98.2}
                    rules={[
                      { min: 99.9, color: "emerald", label: "Operational" },
                      { min: 99, max: 99.9, color: "amber", label: "Degraded" },
                      { max: 99, color: "red", label: "Down", pulse: true },
                    ]}
                    size="dot"
                  />
                ),
              },
              {
                label: "CDN",
                value: "",
                icon: (
                  <StatusIndicator
                    value={99.99}
                    rules={[
                      { min: 99.9, color: "emerald", label: "Operational" },
                      { min: 99, max: 99.9, color: "amber", label: "Degraded" },
                      { max: 99, color: "red", label: "Down" },
                    ]}
                    size="dot"
                  />
                ),
              },
            ]}
          />

          <MetricGrid.Section title="Activity" border />
          <HeatMap
            data={[
              { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }, { x: "12pm", y: 52 }, { x: "1pm", y: 38 }, { x: "2pm", y: 65 }, { x: "3pm", y: 89 }, { x: "4pm", y: 72 }, { x: "5pm", y: 34 }] },
              { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }, { x: "12pm", y: 48 }, { x: "1pm", y: 42 }, { x: "2pm", y: 78 }, { x: "3pm", y: 95 }, { x: "4pm", y: 68 }, { x: "5pm", y: 28 }] },
              { id: "Wed", data: [{ x: "9am", y: 18 }, { x: "10am", y: 62 }, { x: "11am", y: 85 }, { x: "12pm", y: 55 }, { x: "1pm", y: 35 }, { x: "2pm", y: 72 }, { x: "3pm", y: 88 }, { x: "4pm", y: 75 }, { x: "5pm", y: 42 }] },
              { id: "Thu", data: [{ x: "9am", y: 28 }, { x: "10am", y: 58 }, { x: "11am", y: 82 }, { x: "12pm", y: 45 }, { x: "1pm", y: 40 }, { x: "2pm", y: 68 }, { x: "3pm", y: 92 }, { x: "4pm", y: 70 }, { x: "5pm", y: 38 }] },
              { id: "Fri", data: [{ x: "9am", y: 15 }, { x: "10am", y: 48 }, { x: "11am", y: 72 }, { x: "12pm", y: 42 }, { x: "1pm", y: 30 }, { x: "2pm", y: 55 }, { x: "3pm", y: 68 }, { x: "4pm", y: 52 }, { x: "5pm", y: 22 }] },
            ]}
            title="Weekly Activity"
            subtitle="User sessions by day and hour"
            height={280}
          />

          <MetricGrid.Section title="Details" subtitle="Full-featured table with column types, sparklines, status indicators, and expandable rows" border />
          <DataTable
            data={tableData}
            title="Top Pages"
            subtitle="Sorted by pageviews — Shift+click headers to multi-sort"
            multiSort
            searchable
            pageSize={6}
            rowConditions={[
              { when: (row) => row.status === "critical", className: "bg-red-50/50 dark:bg-red-950/20" },
              { when: (row) => row.status === "warning", className: "bg-amber-50/50 dark:bg-amber-950/20" },
            ]}
            renderExpanded={(row) => (
              <DetailGrid columns={3}>
                <DetailGrid.Item label="Page Path">
                  <span className="font-[family-name:var(--font-mono)]">{row.page as string}</span>
                </DetailGrid.Item>
                <DetailGrid.Item label="Avg. Time on Page">
                  <span className="font-[family-name:var(--font-mono)]">{row.avgTime as string}</span>
                </DetailGrid.Item>
                <DetailGrid.Item label="Conversion Rate">
                  <span className="font-[family-name:var(--font-mono)]">{row.convRate as number}%</span>
                </DetailGrid.Item>
              </DetailGrid>
            )}
            columns={[
              { key: "page", header: "Page", type: "text", sortable: true, pin: "left" },
              { key: "sparkline", header: "7d Trend", type: "sparkline" },
              { key: "views", header: "Views", type: "bar", sortable: true },
              { key: "uniques", header: "Uniques", type: "number", sortable: true },
              { key: "bounceRate", header: "Bounce", type: "percent", sortable: true, conditions: [
                { when: "above", value: 45, color: "red" },
                { when: "between", min: 35, max: 45, color: "amber" },
                { when: "below", value: 35, color: "emerald" },
              ] },
              { key: "convRate", header: "Conv.", type: "progress" },
              { key: "status", header: "Health", type: "badge" },
              {
                key: "trend",
                header: "Δ",
                type: "number",
                sortable: true,
                format: { style: "custom", suffix: "%" },
                conditions: [
                  { when: "above", value: 0, color: "emerald" },
                  { when: "below", value: 0, color: "red" },
                ],
              },
            ]}
            footer={{
              page: "Total (8 pages)",
              views: tableData.reduce((s, r) => s + r.views, 0),
              uniques: tableData.reduce((s, r) => s + r.uniques, 0),
            }}
          />
        </MetricGrid>
        </FilterProvider>
        </MetricProvider>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] bg-[var(--card-bg)] py-8">
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
