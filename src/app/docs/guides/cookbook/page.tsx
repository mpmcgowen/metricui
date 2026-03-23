"use client";

import { useState } from "react";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { DataTable } from "@/components/tables/DataTable";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { MetricProvider } from "@/lib/MetricProvider";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LinkedHoverProvider } from "@/lib/LinkedHoverContext";
import { CrossFilterProvider } from "@/lib/CrossFilterContext";
import { DollarSign, Users, TrendingDown, Zap, Activity, Check, Minus, X, Building2, Calendar, Mail, Phone, CheckCircle2, Loader, Wrench, ShieldCheck, Database, Globe, Server, Wifi, AlertTriangle } from "lucide-react";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const trendData = [12, 18, 14, 22, 19, 26, 31];
const prevWeek = [10, 15, 12, 18, 16, 20, 24];

const revenueByMonth = [
  { month: "Jan", revenue: 42000, costs: 18000, orders: 320 },
  { month: "Feb", revenue: 51000, costs: 21000, orders: 380 },
  { month: "Mar", revenue: 68000, costs: 24000, orders: 450 },
  { month: "Apr", revenue: 55000, costs: 22000, orders: 400 },
  { month: "May", revenue: 73000, costs: 26000, orders: 520 },
  { month: "Jun", revenue: 81000, costs: 28000, orders: 580 },
];

const channelData = [
  { month: "Jan", organic: 40, paid: 30, referral: 20, direct: 10 },
  { month: "Feb", organic: 38, paid: 32, referral: 18, direct: 12 },
  { month: "Mar", organic: 35, paid: 35, referral: 17, direct: 13 },
  { month: "Apr", organic: 42, paid: 28, referral: 22, direct: 8 },
  { month: "May", organic: 45, paid: 25, referral: 20, direct: 10 },
  { month: "Jun", organic: 44, paid: 26, referral: 19, direct: 11 },
];

const tableData = [
  { name: "Acme Corp", revenue: 84200, trend: [12, 18, 14, 22, 19, 26, 31], status: "active", completion: 78, usage: 92, churn: 0.02, growth: 0.35 },
  { name: "Globex", revenue: 62100, trend: [20, 18, 22, 19, 17, 15, 14], status: "active", completion: 45, usage: 67, churn: 0.08, growth: 0.12 },
  { name: "Initech", revenue: 31400, trend: [8, 10, 9, 11, 12, 10, 13], status: "trial", completion: 92, usage: 34, churn: 0.22, growth: -0.05 },
  { name: "Umbrella", revenue: 95600, trend: [30, 28, 32, 35, 33, 38, 42], status: "active", completion: 100, usage: 88, churn: 0.01, growth: 0.42 },
  { name: "Cyberdyne", revenue: 18900, trend: [5, 8, 6, 4, 7, 5, 3], status: "churned", completion: 15, usage: 12, churn: 0.45, growth: -0.20 },
];

const hierarchyData = [
  { region: "North America", revenue: 1200000, children: [
    { region: "US East", revenue: 450000 },
    { region: "US West", revenue: 380000 },
    { region: "Canada", revenue: 370000 },
  ]},
  { region: "Europe", revenue: 800000, children: [
    { region: "UK", revenue: 350000 },
    { region: "Germany", revenue: 280000 },
    { region: "France", revenue: 170000 },
  ]},
];

const repsData = [
  { rep: "Alice", closed: 42 },
  { rep: "Bob", closed: 38 },
  { rep: "Carol", closed: 55 },
  { rep: "Dave", closed: 31 },
];
const repsTarget = [
  { rep: "Alice", closed: 50 },
  { rep: "Bob", closed: 50 },
  { rep: "Carol", closed: 50 },
  { rep: "Dave", closed: 50 },
];

// ---------------------------------------------------------------------------
// "Everything Table" data
// ---------------------------------------------------------------------------

const accountsData = [
  { account: "NovaTech", arr: 284000, trend: [18, 22, 19, 28, 25, 32, 38], health: "healthy", adoption: 94, nps: 72, csm: "Emily Tran", renewsIn: 45, risk: 0.02, segment: "Enterprise", contract: "3yr", contactEmail: "ops@novatech.io", lastActivity: "2 hours ago", topFeature: "API Access", seats: 340, seatsUsed: 312 },
  { account: "BrightPath", arr: 126000, trend: [14, 16, 18, 15, 20, 22, 24], health: "healthy", adoption: 78, nps: 61, csm: "James Cole", renewsIn: 120, risk: 0.05, segment: "Mid-Market", contract: "Annual", contactEmail: "admin@brightpath.co", lastActivity: "1 day ago", topFeature: "Dashboards", seats: 85, seatsUsed: 71 },
  { account: "Meridian Labs", arr: 89000, trend: [10, 12, 9, 8, 11, 10, 7], health: "at-risk", adoption: 42, nps: 28, csm: "Emily Tran", renewsIn: 30, risk: 0.35, segment: "Mid-Market", contract: "Annual", contactEmail: "it@meridianlabs.com", lastActivity: "12 days ago", topFeature: "Reports", seats: 60, seatsUsed: 22 },
  { account: "Apex Industries", arr: 412000, trend: [40, 38, 42, 45, 44, 48, 52], health: "healthy", adoption: 88, nps: 84, csm: "James Cole", renewsIn: 200, risk: 0.01, segment: "Enterprise", contract: "3yr", contactEmail: "platform@apex.com", lastActivity: "4 hours ago", topFeature: "SSO", seats: 500, seatsUsed: 467 },
  { account: "Flux Digital", arr: 34000, trend: [8, 6, 5, 4, 3, 4, 2], health: "churning", adoption: 15, nps: 12, csm: "Emily Tran", renewsIn: 14, risk: 0.82, segment: "SMB", contract: "Monthly", contactEmail: "hello@fluxdigital.io", lastActivity: "28 days ago", topFeature: "None", seats: 20, seatsUsed: 3 },
  { account: "Orion Group", arr: 198000, trend: [22, 24, 26, 28, 25, 30, 33], health: "healthy", adoption: 71, nps: 55, csm: "James Cole", renewsIn: 90, risk: 0.08, segment: "Enterprise", contract: "Annual", contactEmail: "tech@oriongroup.com", lastActivity: "6 hours ago", topFeature: "Integrations", seats: 200, seatsUsed: 158 },
];

// ---------------------------------------------------------------------------
// "Metric Sandwich" data
// ---------------------------------------------------------------------------

const sandwichMonthly = [
  { month: "Jan", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Feb", revenue: 48000, expenses: 30000, profit: 18000 },
  { month: "Mar", revenue: 55000, expenses: 31000, profit: 24000 },
  { month: "Apr", revenue: 51000, expenses: 33000, profit: 18000 },
  { month: "May", revenue: 62000, expenses: 34000, profit: 28000 },
  { month: "Jun", revenue: 71000, expenses: 36000, profit: 35000 },
];

const sandwichProducts = [
  { product: "Pro Plan", revenue: 38200, trend: [5, 8, 7, 12, 14, 18], customers: 142, growth: 0.24, status: "active", avgDeal: 269, topRegion: "US East", churnRate: 0.03 },
  { product: "Enterprise", revenue: 24800, trend: [10, 12, 11, 14, 16, 19], customers: 28, growth: 0.18, status: "active", avgDeal: 886, topRegion: "EMEA", churnRate: 0.01 },
  { product: "Starter", revenue: 5200, trend: [8, 7, 6, 5, 5, 4], customers: 310, growth: -0.12, status: "warning", avgDeal: 17, topRegion: "US West", churnRate: 0.15 },
  { product: "API Add-on", revenue: 2800, trend: [1, 2, 3, 4, 5, 8], customers: 45, growth: 0.62, status: "active", avgDeal: 62, topRegion: "US East", churnRate: 0.02 },
];

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const tocItems: TocItem[] = [
  { id: "tables", title: "Tables That Do Everything", level: 2 },
  { id: "table-sparkline", title: "Sparklines in cells", level: 3 },
  { id: "table-status", title: "Status dots in cells", level: 3 },
  { id: "table-bar", title: "Inline bar fills", level: 3 },
  { id: "table-expanded", title: "Expandable detail rows", level: 3 },
  { id: "table-hierarchy", title: "Hierarchical rows", level: 3 },
  { id: "table-row-highlight", title: "Row highlighting", level: 3 },
  { id: "kpi", title: "KPI Cards Beyond Basics", level: 2 },
  { id: "kpi-multi-comparison", title: "Multiple comparisons", level: 3 },
  { id: "kpi-invert", title: "Down is good", level: 3 },
  { id: "kpi-goal", title: "Goal tracking", level: 3 },
  { id: "kpi-ghost-sparkline", title: "Previous period sparkline", level: 3 },
  { id: "kpi-conditions", title: "Conditional glow", level: 3 },
  { id: "charts", title: "Charts That Tell Stories", level: 2 },
  { id: "chart-reference", title: "Target lines", level: 3 },
  { id: "chart-thresholds", title: "Threshold zones", level: 3 },
  { id: "chart-dual-axis", title: "Dual Y-axis", level: 3 },
  { id: "chart-percent", title: "100% stacked", level: 3 },
  { id: "chart-series-styles", title: "Per-series styling", level: 3 },
  { id: "chart-targets", title: "Target vs actual bars", level: 3 },
  { id: "layout", title: "Layout Without CSS", level: 2 },
  { id: "alerts", title: "Data-Driven Alerts", level: 2 },
  { id: "live-ops", title: "Live Ops Patterns", level: 2 },
  { id: "feature-matrix", title: "Feature Enablement Matrix", level: 2 },
  { id: "saas-tenant-matrix", title: "SaaS tenant matrix", level: 3 },
  { id: "everything-table", title: "The Everything Table", level: 2 },
  { id: "ops-war-room", title: "Ops War Room", level: 2 },
  { id: "metric-sandwich", title: "The Metric Sandwich", level: 2 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CookbookGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-4xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          Cookbook
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Recipes for every &ldquo;I didn&apos;t know you could do that&rdquo; moment.
          Each recipe is live — what you see is what you get.
        </p>

        {/* ================================================================ */}
        {/* TABLES */}
        {/* ================================================================ */}

        <DocSection id="tables" title="Tables That Do Everything">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            DataTable columns have a <code>type</code> field that transforms plain data into
            rich UI. No render functions needed.
          </p>
        </DocSection>

        <DocSection id="table-sparkline" title="Sparklines in cells" level={3}>
          <ComponentExample code={`<DataTable
  data={[
    { name: "Revenue", trend: [12, 18, 14, 22, 19, 26, 31] },
    { name: "Users",   trend: [80, 85, 78, 92, 95, 88, 102] },
  ]}
  columns={[
    { key: "name", header: "Metric" },
    { key: "trend", header: "7-Day Trend", type: "sparkline" },
  ]}
/>`}>
            <div className="w-full max-w-md">
              <DataTable
                data={[
                  { name: "Revenue", trend: [12, 18, 14, 22, 19, 26, 31] },
                  { name: "Users", trend: [80, 85, 78, 92, 95, 88, 102] },
                ]}
                columns={[
                  { key: "name", header: "Metric" },
                  { key: "trend", header: "7-Day Trend", type: "sparkline" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="table-status" title="Status dots in cells" level={3}>
          <ComponentExample code={`<DataTable
  data={[
    { service: "API",      uptime: 99.98 },
    { service: "Database", uptime: 97.2 },
    { service: "CDN",      uptime: 89.1 },
  ]}
  columns={[
    { key: "service", header: "Service" },
    { key: "uptime",  header: "Health", type: "status",
      statusRules: [
        { min: 99.9, color: "emerald", label: "Healthy" },
        { min: 95,   color: "amber",   label: "Degraded", pulse: true },
        {            color: "red",     label: "Down",     pulse: true },
      ],
    },
  ]}
  dense
/>`}>
            <div className="w-full max-w-sm">
              <DataTable
                data={[
                  { service: "API", uptime: 99.98 },
                  { service: "Database", uptime: 97.2 },
                  { service: "CDN", uptime: 89.1 },
                ]}
                columns={[
                  { key: "service", header: "Service" },
                  { key: "uptime", header: "Health", type: "status",
                    statusRules: [
                      { min: 99.9, color: "emerald", label: "Healthy" },
                      { min: 95, color: "amber", label: "Degraded", pulse: true },
                      { color: "red", label: "Down", pulse: true },
                    ],
                  },
                ]}
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="table-bar" title="Inline bar fills" level={3}>
          <ComponentExample code={`{ key: "usage", header: "CPU", type: "bar", format: "percent",
  conditions: [
    { when: "at_or_above", value: 90, color: "red" },
    { when: "at_or_above", value: 70, color: "amber" },
    { when: "below", value: 70, color: "emerald" },
  ]
}`}>
            <div className="w-full max-w-md">
              <DataTable
                data={tableData}
                columns={[
                  { key: "name", header: "Server" },
                  { key: "usage", header: "CPU Usage", type: "bar" as const, format: "percent" as const,
                    conditions: [
                      { when: "at_or_above", value: 90, color: "red" },
                      { when: "at_or_above", value: 70, color: "amber" },
                      { when: "below", value: 70, color: "emerald" },
                    ],
                  },
                ]}
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="table-expanded" title="Expandable detail rows" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Click the chevron to expand a row and reveal nested components — charts, stats, anything.
          </p>
          <ComponentExample code={`<DataTable
  data={customers}
  columns={columns}
  renderExpanded={(row) => (
    <div className="grid grid-cols-3 gap-3">
      <KpiCard bare title="Revenue" value={row.revenue} format="currency" />
      <KpiCard bare title="Completion" value={row.completion} format="percent" />
      <Sparkline data={row.trend} height={48} />
    </div>
  )}
/>`}>
            <div className="w-full">
              <DataTable
                data={tableData.slice(0, 3)}
                columns={[
                  { key: "name", header: "Customer" },
                  { key: "revenue", header: "Revenue", type: "currency" as const },
                  { key: "status", header: "Status", type: "badge" as const },
                ]}
                renderExpanded={(row) => (
                  <div className="grid grid-cols-3 gap-3">
                    <KpiCard bare title="Revenue" value={row.revenue as number} format="currency" />
                    <KpiCard bare title="Completion" value={row.completion as number} format="percent" />
                    <div className="flex items-center"><Sparkline data={row.trend as number[]} height={48} /></div>
                  </div>
                )}
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="table-hierarchy" title="Hierarchical rows" level={3}>
          <ComponentExample code={`<DataTable
  data={[
    { region: "North America", revenue: 1200000, children: [
      { region: "US East", revenue: 450000 },
      { region: "US West", revenue: 380000 },
      { region: "Canada", revenue: 370000 },
    ]},
  ]}
  childrenField="children"
  defaultExpanded
/>`}>
            <div className="w-full max-w-md">
              <DataTable
                data={hierarchyData}
                columns={[
                  { key: "region", header: "Region" },
                  { key: "revenue", header: "Revenue", type: "currency" as const },
                ]}
                childrenField="children"
                defaultExpanded
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="table-row-highlight" title="Row highlighting" level={3}>
          <ComponentExample code={`<DataTable
  data={accounts}
  rowConditions={[
    { when: (row) => row.churn > 0.15,  className: "bg-red-500/5" },
    { when: (row) => row.growth > 0.30, className: "bg-emerald-500/5" },
  ]}
/>`}>
            <div className="w-full max-w-lg">
              <DataTable
                data={tableData}
                columns={[
                  { key: "name", header: "Account" },
                  { key: "revenue", header: "Revenue", type: "currency" as const },
                  { key: "churn", header: "Churn", format: "percent" as const },
                  { key: "growth", header: "Growth", format: "percent" as const },
                ]}
                rowConditions={[
                  { when: (row) => (row.churn as number) > 0.15, className: "bg-red-500/5" },
                  { when: (row) => (row.growth as number) > 0.30, className: "bg-emerald-500/5" },
                ]}
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* KPI CARDS */}
        {/* ================================================================ */}

        <DocSection id="kpi" title="KPI Cards Beyond Basics">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            These recipes show what most devs discover weeks into using MetricUI.
          </p>
        </DocSection>

        <DocSection id="kpi-multi-comparison" title="Multiple comparisons" level={3}>
          <ComponentExample code={`<KpiCard
  title="Revenue"
  value={127450}
  format="currency"
  comparison={[
    { value: 113500, label: "vs last month" },
    { value: 98200, label: "vs last year", mode: "absolute" },
  ]}
/>`}>
            <KpiCard
              title="Revenue"
              value={127450}
              format="currency"
              comparison={[
                { value: 113500, label: "vs last month" },
                { value: 98200, label: "vs last year", mode: "absolute" },
              ]}
            />
          </ComponentExample>
        </DocSection>

        <DocSection id="kpi-invert" title="Down is good" level={3}>
          <ComponentExample code={`<KpiCard
  title="Churn Rate"
  value={3.2}
  format="percent"
  icon={<TrendingDown className="h-3.5 w-3.5" />}
  comparison={{ value: 4.8, invertTrend: true }}
/>`}>
            <KpiCard
              title="Churn Rate"
              value={3.2}
              format="percent"
              icon={<TrendingDown className="h-3.5 w-3.5" />}
              comparison={{ value: 4.8, invertTrend: true }}
            />
          </ComponentExample>
        </DocSection>

        <DocSection id="kpi-goal" title="Goal tracking" level={3}>
          <ComponentExample code={`<KpiCard
  title="Q2 Revenue"
  value={380000}
  format="currency"
  icon={<DollarSign className="h-3.5 w-3.5" />}
  goal={{
    value: 500000,
    label: "Q2 Target",
    showTarget: true,
    showRemaining: true,
    color: "#6366F1",
    completeColor: "#10B981",
  }}
/>`}>
            <KpiCard
              title="Q2 Revenue"
              value={380000}
              format="currency"
              icon={<DollarSign className="h-3.5 w-3.5" />}
              goal={{
                value: 500000,
                label: "Q2 Target",
                showTarget: true,
                showRemaining: true,
                color: "#6366F1",
                completeColor: "#10B981",
              }}
            />
          </ComponentExample>
        </DocSection>

        <DocSection id="kpi-ghost-sparkline" title="Previous period sparkline" level={3}>
          <ComponentExample code={`<KpiCard
  title="Daily Revenue"
  value={12400}
  format="currency"
  sparkline={{
    data: thisWeek,
    previousPeriod: lastWeek,
    type: "bar",
  }}
/>`}>
            <KpiCard
              title="Daily Revenue"
              value={12400}
              format="currency"
              sparkline={{
                data: trendData,
                previousPeriod: prevWeek,
                type: "bar",
              }}
            />
          </ComponentExample>
        </DocSection>

        <DocSection id="kpi-conditions" title="Conditional glow" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The card gets a colored glow when the value hits a threshold.
          </p>
          <ComponentExample code={`<KpiCard
  title="Error Rate"
  value={12.4}
  format="percent"
  conditions={[
    { when: "at_or_above", value: 10, color: "red" },
    { when: "at_or_above", value: 5,  color: "amber" },
    { when: "below",       value: 5,  color: "emerald" },
  ]}
/>`}>
            <div className="grid grid-cols-2 gap-4">
              <KpiCard
                title="Error Rate"
                value={12.4}
                format="percent"
                conditions={[
                  { when: "at_or_above", value: 10, color: "red" },
                  { when: "at_or_above", value: 5, color: "amber" },
                  { when: "below", value: 5, color: "emerald" },
                ]}
              />
              <KpiCard
                title="Error Rate"
                value={3.1}
                format="percent"
                conditions={[
                  { when: "at_or_above", value: 10, color: "red" },
                  { when: "at_or_above", value: 5, color: "amber" },
                  { when: "below", value: 5, color: "emerald" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* CHARTS */}
        {/* ================================================================ */}

        <DocSection id="charts" title="Charts That Tell Stories">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Overlay targets, thresholds, and dual axes to turn a chart into a narrative.
          </p>
        </DocSection>

        <DocSection id="chart-reference" title="Target lines" level={3}>
          <ComponentExample code={`<AreaChart
  data={data}
  index="month"
  categories={["revenue"]}
  format="currency"
  referenceLines={[
    { axis: "y", value: 70000, label: "Target", color: "#6366F1", style: "dashed" },
    { axis: "y", value: 50000, label: "Break-even", color: "#EF4444" },
  ]}
  enableArea gradient
/>`}>
            <div className="w-full">
              <AreaChart
                data={revenueByMonth}
                index="month"
                categories={["revenue"]}
                format="currency"
                height={260}
                referenceLines={[
                  { axis: "y", value: 70000, label: "Target", color: "#6366F1", style: "dashed" },
                  { axis: "y", value: 50000, label: "Break-even", color: "#EF4444" },
                ]}
                enableArea
                gradient
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="chart-thresholds" title="Threshold zones" level={3}>
          <ComponentExample code={`<AreaChart
  data={data}
  index="month"
  categories={["orders"]}
  thresholds={[
    { from: 0,   to: 350, color: "#EF4444", opacity: 0.06, label: "Low" },
    { from: 350, to: 450, color: "#F59E0B", opacity: 0.06, label: "Normal" },
    { from: 450, to: 600, color: "#10B981", opacity: 0.06, label: "High" },
  ]}
/>`}>
            <div className="w-full">
              <AreaChart
                data={revenueByMonth}
                index="month"
                categories={["orders"]}
                format="number"
                height={260}
                thresholds={[
                  { from: 0, to: 350, color: "#EF4444", opacity: 0.06, label: "Low" },
                  { from: 350, to: 450, color: "#F59E0B", opacity: 0.06, label: "Normal" },
                  { from: 450, to: 600, color: "#10B981", opacity: 0.06, label: "High" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="chart-dual-axis" title="Dual Y-axis" level={3}>
          <ComponentExample code={`<AreaChart
  data={data}
  index="month"
  categories={[
    { key: "revenue", format: "currency" },
    { key: "orders", format: "number", axis: "right" },
  ]}
  rightAxisLabel="Orders"
  enableArea gradient
/>`}>
            <div className="w-full">
              <AreaChart
                data={revenueByMonth}
                index="month"
                categories={[
                  { key: "revenue", format: "currency" },
                  { key: "orders", format: "number", axis: "right" },
                ]}
                rightAxisLabel="Orders"
                height={260}
                enableArea
                gradient
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="chart-percent" title="100% stacked" level={3}>
          <ComponentExample code={`<AreaChart
  data={channelData}
  index="month"
  categories={["organic", "paid", "referral", "direct"]}
  stacked
  stackMode="percent"
  format="percent"
  title="Traffic Mix"
/>`}>
            <div className="w-full">
              <AreaChart
                data={channelData}
                index="month"
                categories={["organic", "paid", "referral", "direct"]}
                stacked
                stackMode="percent"
                format="percent"
                title="Traffic Mix"
                height={260}
                enableArea
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="chart-series-styles" title="Per-series styling" level={3}>
          <ComponentExample code={`<AreaChart
  data={data}
  index="month"
  categories={["revenue", "costs"]}
  format="currency"
  seriesStyles={{
    revenue: { lineWidth: 2.5 },
    costs:   { lineStyle: "dashed", lineWidth: 1.5 },
  }}
/>`}>
            <div className="w-full">
              <AreaChart
                data={revenueByMonth}
                index="month"
                categories={["revenue", "costs"]}
                format="currency"
                height={260}
                seriesStyles={{
                  revenue: { lineWidth: 2.5 },
                  costs: { lineStyle: "dashed", lineWidth: 1.5 },
                }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        <DocSection id="chart-targets" title="Target vs actual bars" level={3}>
          <ComponentExample code={`<BarChart
  data={actuals}
  index="rep"
  categories={["closed"]}
  targetData={targets}
  title="Deals Closed vs Target"
/>`}>
            <div className="w-full">
              <BarChart
                data={repsData}
                index="rep"
                categories={["closed"]}
                targetData={repsTarget as unknown as Record<string, number>[]}
                title="Deals Closed vs Target"
                height={240}
                format="number"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* LAYOUT */}
        {/* ================================================================ */}

        <DocSection id="layout" title="Layout Without CSS">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Drop components into MetricGrid. KPIs row up, charts split intelligently,
            tables go full-width. No grid classes.
          </p>
          <ComponentExample code={`<MetricGrid>
  <KpiCard title="Revenue" value={127450} format="currency" />
  <KpiCard title="Users" value={8420} format="number" />
  <KpiCard title="Conversion" value={4.8} format="percent" />

  <MetricGrid.Section title="Trends" />

  <AreaChart data={data} index="month" categories={["revenue"]} />
  <DonutChart data={plans} index="plan" categories={["users"]} />
</MetricGrid>`}>
            <div className="w-full">
              <MetricGrid>
                <KpiCard title="Revenue" value={127450} format="currency" animate={{ countUp: true }} />
                <KpiCard title="Users" value={8420} format="number" animate={{ countUp: true }} />
                <KpiCard title="Conversion" value={4.8} format="percent" animate={{ countUp: true }} />
                <MetricGrid.Section title="Trends" />
                <AreaChart data={revenueByMonth} index="month" categories={["revenue"]} format="currency" height={200} enableArea gradient />
                <DonutChart data={revenueByMonth} index="month" categories={["orders"]} height={200} />
              </MetricGrid>
            </div>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* ALERTS */}
        {/* ================================================================ */}

        <DocSection id="alerts" title="Data-Driven Alerts">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Callout evaluates rules against a value and picks the variant automatically.
          </p>
          <ComponentExample code={`<Callout
  value={12.4}
  rules={[
    { min: 10, variant: "error",
      title: "Critical: {value}% error rate",
      message: "Immediate action required." },
    { min: 5, variant: "warning",
      title: "Elevated: {value}% error rate" },
    { variant: "success",
      title: "Error rate normal" },
  ]}
  metric={{ value: 12.4, format: "percent", label: "current" }}
  dismissible dense
/>`}>
            <div className="w-full max-w-lg">
              <Callout
                value={12.4}
                rules={[
                  { min: 10, variant: "error" as const, title: "Critical: {value}% error rate", message: "Immediate action required." },
                  { min: 5, variant: "warning" as const, title: "Elevated: {value}% error rate" },
                  { variant: "success" as const, title: "Error rate normal" },
                ]}
                metric={{ value: 12.4, format: "percent" as const, label: "current" }}
                dismissible
                dense
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* LIVE OPS */}
        {/* ================================================================ */}

        <DocSection id="live-ops" title="Live Ops Patterns">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            StatusIndicator at <code>size=&quot;card&quot;</code> matches KpiCard and slots into MetricGrid.
          </p>
          <ComponentExample code={`<MetricGrid columns={3}>
  <StatusIndicator
    size="card"
    title="API Gateway"
    value={99.97}
    rules={[
      { min: 99.9, color: "emerald", label: "Healthy" },
      { min: 95,   color: "amber",   label: "Degraded", pulse: true },
      {            color: "red",     label: "Down",     pulse: true },
    ]}
    since={new Date(Date.now() - 3600000 * 4)}
    trend={[99.1, 99.5, 99.8, 99.9, 99.97]}
  />
  <StatusIndicator size="card" title="Database" value={98.2}
    rules={[
      { min: 99.9, color: "emerald", label: "Healthy" },
      { min: 95, color: "amber", label: "Degraded", pulse: true },
      { color: "red", label: "Down", pulse: true },
    ]}
  />
  <StatusIndicator size="card" title="CDN" value={99.99}
    rules={[
      { min: 99.9, color: "emerald", label: "Healthy" },
      { min: 95, color: "amber", label: "Degraded", pulse: true },
      { color: "red", label: "Down", pulse: true },
    ]}
  />
</MetricGrid>`}>
            <div className="w-full">
              <MetricGrid columns={3}>
                <StatusIndicator
                  size="card"
                  title="API Gateway"
                  value={99.97}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                  since={new Date(Date.now() - 3600000 * 4)}
                  trend={[99.1, 99.5, 99.8, 99.9, 99.97]}
                />
                <StatusIndicator size="card" title="Database" value={98.2}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                />
                <StatusIndicator size="card" title="CDN" value={99.99}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                />
              </MetricGrid>
            </div>
          </ComponentExample>
        </DocSection>

        {/* ── Feature Enablement Matrix ── */}
        <DocSection id="feature-matrix" title="Feature Enablement Matrix">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use DataTable with custom <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">render</code> functions
            to build feature comparison matrices — plans vs features, customers vs capabilities, any two-dimensional mapping.
          </p>
          <ComponentExample
            code={`<DataTable
  data={features}
  columns={[
    { key: "feature", header: "Feature", pin: "left",
      render: (v, row) => (
        <div>
          <span className="font-medium">{v}</span>
          {row.description && (
            <p className="text-xs text-[var(--muted)]">{row.description}</p>
          )}
        </div>
      ),
    },
    ...["Starter", "Pro", "Enterprise"].map((plan) => ({
      key: plan.toLowerCase(),
      header: plan,
      align: "center",
      render: (v) =>
        v === true  ? <Check className="text-emerald-500" /> :
        v === "limited" ? <Badge color="amber" size="sm">Limited</Badge> :
                          <Minus className="text-[var(--muted)]" />,
    })),
  ]}
/>`}
          >
            <DataTable
              data={[
                { feature: "Dashboard Builder", description: "Drag-and-drop layout editor", starter: true, pro: true, enterprise: true },
                { feature: "Custom Charts", description: "Build charts from any data source", starter: true, pro: true, enterprise: true },
                { feature: "Team Sharing", starter: false, pro: true, enterprise: true },
                { feature: "API Access", description: "REST & GraphQL endpoints", starter: false, pro: true, enterprise: true },
                { feature: "SSO / SAML", starter: false, pro: false, enterprise: true },
                { feature: "Audit Log", starter: false, pro: "limited" as never, enterprise: true },
                { feature: "Custom Branding", starter: false, pro: false, enterprise: true },
                { feature: "SLA", description: "Uptime guarantee", starter: false, pro: "limited" as never, enterprise: true },
                { feature: "Dedicated Support", starter: false, pro: false, enterprise: true },
              ] as never[]}
              columns={[
                {
                  key: "feature" as const,
                  header: "Feature",
                  pin: "left" as const,
                  render: (v: unknown, row: Record<string, unknown>) => (
                    <div>
                      <span className="font-medium text-[var(--foreground)]">{String(v)}</span>
                      {Boolean(row.description) && (
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{String(row.description)}</p>
                      )}
                    </div>
                  ),
                },
                ...["Starter", "Pro", "Enterprise"].map((plan) => ({
                  key: plan.toLowerCase() as string,
                  header: plan,
                  align: "center" as const,
                  width: 110,
                  render: (v: unknown) =>
                    v === true ? <Check className="mx-auto h-4 w-4 text-emerald-500" /> :
                    v === "limited" ? <Badge color="amber" size="sm">Limited</Badge> :
                    <Minus className="mx-auto h-4 w-4 text-[var(--card-border)]" />,
                })),
              ] as never[]}
              dense
            />
          </ComponentExample>
        </DocSection>

        {/* ── SaaS Tenant Feature Matrix ── */}
        <DocSection id="saas-tenant-matrix" title="SaaS tenant matrix" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Internal ops pattern — a tenant-by-module rollout matrix with icon status indicators
            and expandable detail rows. Great for CSM dashboards, feature rollout tracking, and adoption monitoring.
          </p>
          <ComponentExample
            code={`const renderStage = (v: unknown) => {
  const s = String(v);
  if (s === "R") return <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />;
  if (s === "D") return <Loader className="mx-auto h-4 w-4 text-amber-500" />;
  if (s === "S") return <Wrench className="mx-auto h-4 w-4 text-blue-500" />;
  return <Minus className="mx-auto h-4 w-4 text-[var(--muted)] opacity-30" />;
};

const modules = ["Scheduling", "Billing", "Retention", "Reports", "API"];

<DataTable
  title="Studio Module Rollout"
  subtitle="12 studios · 5 modules"
  data={studios}
  columns={[
    { key: "studio", header: "Studio", pin: "left", sortable: true,
      render: (v, row) => (
        <div>
          <span className="font-medium">{v}</span>
          <span className="ml-2 text-[10px] text-[var(--muted)]">{row.tier}</span>
        </div>
      ),
    },
    { key: "am", header: "Acct Mgr", sortable: true },
    { key: "rooms", header: "Rooms", type: "number", sortable: true, width: 70 },
    ...modules.map((m) => ({
      key: m.toLowerCase(), header: m, align: "center", width: 90,
      render: renderStage,
    })),
  ]}
  footnote={
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Live</span>
      <span className="flex items-center gap-1"><Loader className="h-3 w-3 text-amber-500" /> In progress</span>
      <span className="flex items-center gap-1"><Wrench className="h-3 w-3 text-blue-500" /> Setting up</span>
      <span className="flex items-center gap-1"><Minus className="h-3 w-3 opacity-30" /> Not enabled</span>
    </div>
  }
  renderExpanded={(row) => ( /* customer detail grid */ )}
  searchable
  dense
  maxRows={10}
/>`}
          >
            {(() => {
              const renderStage = (v: unknown) => {
                const s = String(v);
                if (s === "R") return <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />;
                if (s === "D") return <Loader className="mx-auto h-4 w-4 text-amber-500" />;
                if (s === "S") return <Wrench className="mx-auto h-4 w-4 text-blue-500" />;
                return <Minus className="mx-auto h-4 w-4 text-[var(--muted)] opacity-30" />;
              };
              const modules = ["Scheduling", "Billing", "Retention", "Reports", "API"];
              const studios = [
                { studio: "Iron Temple", am: "Nora Voss", tier: "ENT", rooms: 38, contact: "Derek Haines", email: "derek@irontemple.com", phone: "(312) 555-0147", onboarded: "Sep 2023", mrr: "$14,200", plan: "Enterprise", notes: "Flagship partner. Running beta for new API webhooks.", scheduling: "R", billing: "R", retention: "R", reports: "R", api: "R" },
                { studio: "CorePulse Fitness", am: "Nora Voss", tier: "Mid", rooms: 12, contact: "Ava Chen", email: "ava@corepulse.io", phone: "(415) 555-0283", onboarded: "Jan 2024", mrr: "$4,800", plan: "Pro", notes: "Strong scheduling adoption. Retention module pilot starting Q2.", scheduling: "R", billing: "R", retention: "D", reports: "R", api: "-" },
                { studio: "Zenith Yoga", am: "Leo Park", tier: "SMB", rooms: 2, contact: "Maya Torres", email: "maya@zenithyoga.co", phone: "(503) 555-0391", onboarded: "May 2024", mrr: "$199", plan: "Starter", notes: "Single-location studio. Onboarding scheduling + billing.", scheduling: "D", billing: "S", retention: "-", reports: "-", api: "-" },
                { studio: "Lift Lab", am: "Nora Voss", tier: "ENT", rooms: 24, contact: "Jason Webb", email: "jason@liftlab.com", phone: "(212) 555-0468", onboarded: "Nov 2023", mrr: "$9,600", plan: "Enterprise", notes: "Full adoption. Reference account for case studies.", scheduling: "R", billing: "R", retention: "R", reports: "R", api: "D" },
                { studio: "Barre & Beyond", am: "Leo Park", tier: "Mid", rooms: 6, contact: "Claire Dumont", email: "claire@barreandbeyond.com", phone: "(617) 555-0524", onboarded: "Mar 2024", mrr: "$2,100", plan: "Pro", notes: "Interested in retention. Waiting on custom report templates.", scheduling: "R", billing: "R", retention: "S", reports: "D", api: "-" },
                { studio: "SweatBox", am: "Self Service", tier: "SMB", rooms: 1, contact: "Kai Nakamura", email: "kai@sweatbox.fit", phone: "(808) 555-0615", onboarded: "Oct 2024", mrr: "$99", plan: "Starter", notes: "Self-service onboarding. Low engagement — flag for outreach.", scheduling: "S", billing: "-", retention: "-", reports: "-", api: "-" },
                { studio: "Peak Performance", am: "Nora Voss", tier: "ENT", rooms: 31, contact: "Rachel Stein", email: "rachel@peakperf.com", phone: "(303) 555-0782", onboarded: "Dec 2023", mrr: "$11,500", plan: "Enterprise", notes: "Blocked on API due to IT security review. Everything else live.", scheduling: "R", billing: "R", retention: "R", reports: "R", api: "S" },
                { studio: "Cycle Society", am: "Leo Park", tier: "Mid", rooms: 8, contact: "Omar Farah", email: "omar@cyclesociety.co", phone: "(202) 555-0893", onboarded: "Jun 2024", mrr: "$3,400", plan: "Pro", notes: "Great engagement. Just enabled retention last week.", scheduling: "R", billing: "R", retention: "S", reports: "R", api: "-" },
                { studio: "FlexPoint Studios", am: "Self Service", tier: "SMB", rooms: 3, contact: "Priya Desai", email: "priya@flexpoint.fit", phone: "(408) 555-0914", onboarded: "Jan 2025", mrr: "$249", plan: "Starter", notes: "Brand new. Completed onboarding last week.", scheduling: "R", billing: "D", retention: "-", reports: "-", api: "-" },
                { studio: "Grind Athletics", am: "Leo Park", tier: "Mid", rooms: 10, contact: "Marcus Bell", email: "marcus@grindathletics.com", phone: "(404) 555-1025", onboarded: "Apr 2024", mrr: "$3,900", plan: "Pro", notes: "Strong usage across the board. Evaluating enterprise upgrade.", scheduling: "R", billing: "R", retention: "R", reports: "R", api: "S" },
                { studio: "Namaste Now", am: "Nora Voss", tier: "Mid", rooms: 5, contact: "Sophie Liu", email: "sophie@namastenow.co", phone: "(206) 555-1136", onboarded: "Aug 2024", mrr: "$1,800", plan: "Pro", notes: "Steady adoption. Wants reports module once templates ship.", scheduling: "R", billing: "R", retention: "D", reports: "-", api: "-" },
                { studio: "Titan CrossFit", am: "Leo Park", tier: "Mid", rooms: 4, contact: "Jake Morrison", email: "jake@titancf.com", phone: "(720) 555-1247", onboarded: "Jul 2024", mrr: "$1,600", plan: "Pro", notes: "Good momentum. Piloting retention with 2 locations first.", scheduling: "R", billing: "R", retention: "D", reports: "S", api: "-" },
              ];
              return (
                <DataTable
                  title="Studio Module Rollout"
                  subtitle={`${studios.length} studios · ${modules.length} modules`}
                  data={studios as never[]}
                  columns={[
                    {
                      key: "studio" as string,
                      header: "Studio",
                      pin: "left" as const,
                      sortable: true,
                      render: (v: unknown, row: Record<string, unknown>) => (
                        <div>
                          <span className="font-medium text-[var(--foreground)]">{String(v)}</span>
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-[var(--muted)]">{String(row.tier)}</span>
                        </div>
                      ),
                    },
                    { key: "am" as string, header: "Acct Mgr", sortable: true, width: 120 },
                    { key: "rooms" as string, header: "Rooms", type: "number" as const, sortable: true, width: 70 },
                    ...modules.map((m) => ({
                      key: m.toLowerCase() as string,
                      header: m,
                      align: "center" as const,
                      width: 90,
                      render: renderStage,
                    })),
                  ] as never[]}
                  renderExpanded={(row: Record<string, unknown>) => (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                      <div className="flex items-start gap-2">
                        <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Contact</p>
                          <p className="text-[13px] text-[var(--foreground)]">{String(row.contact)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Email</p>
                          <p className="text-[13px] text-[var(--foreground)]">{String(row.email)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Onboarded</p>
                          <p className="text-[13px] text-[var(--foreground)]">{String(row.onboarded)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">MRR</p>
                          <p className="text-[13px] font-semibold text-[var(--foreground)]">{String(row.mrr)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Phone</p>
                          <p className="text-[13px] text-[var(--foreground)]">{String(row.phone)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Plan</p>
                          <p className="text-[13px] text-[var(--foreground)]">{String(row.plan)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 sm:col-span-2">
                        <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">Notes</p>
                          <p className="text-[13px] leading-relaxed text-[var(--muted)]">{String(row.notes)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  footnote={
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Live</span>
                      <span className="flex items-center gap-1"><Loader className="h-3 w-3 text-amber-500" /> In progress</span>
                      <span className="flex items-center gap-1"><Wrench className="h-3 w-3 text-blue-500" /> Setting up</span>
                      <span className="flex items-center gap-1"><Minus className="h-3 w-3 opacity-30" /> Not enabled</span>
                    </div>
                  }
                  searchable
                  dense
                  maxRows={10}
                />
              );
            })()}
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* THE EVERYTHING TABLE                                             */}
        {/* ================================================================ */}

        <DocSection id="everything-table" title="The Everything Table">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            One table that <em>is</em> the dashboard. Every column type in play — sparklines, progress bars,
            status dots, badges, bar fills, conditional colors — plus expandable detail rows with nested KpiCards.
            Try doing this in Metabase.
          </p>
        </DocSection>

        <DocSection id="everything-table-demo" title="Account health matrix" level={3}>
          <ComponentExample
            code={`<DataTable
  title="Account Health Matrix"
  subtitle="6 accounts · click any row to expand"
  data={accounts}
  columns={[
    { key: "account", header: "Account", pin: "left", sortable: true },
    { key: "arr", header: "ARR", type: "currency", format: "compact", sortable: true },
    { key: "trend", header: "7d Trend", type: "sparkline" },
    { key: "health", header: "Health", type: "badge" },
    { key: "adoption", header: "Adoption", type: "progress" },
    { key: "nps", header: "NPS", type: "number", sortable: true,
      conditions: [
        { min: 50, color: "emerald" },
        { min: 20, color: "amber" },
        { color: "red" },
      ],
    },
    { key: "risk", header: "Churn Risk", type: "bar", format: "percent" },
    { key: "renewsIn", header: "Renews", type: "number", sortable: true,
      render: (v) => <Badge variant={v <= 30 ? "danger" : v <= 90 ? "warning" : "default"} size="sm">{v}d</Badge>,
    },
  ]}
  renderExpanded={(row) => (
    <MetricGrid columns={4}>
      <KpiCard title="Seats Used" value={\`\${row.seatsUsed}/\${row.seats}\`} ... />
      <KpiCard title="ARR" value={row.arr} format="currency" ... />
      <KpiCard title="Adoption" value={row.adoption} format="percent" ... />
      <KpiCard title="NPS Score" value={row.nps} ... />
    </MetricGrid>
  )}
  searchable
  dense
/>`}
          >
            <DataTable
              title="Account Health Matrix"
              subtitle="6 accounts · click any row to expand"
              data={accountsData as never[]}
              columns={[
                {
                  key: "account" as string, header: "Account", pin: "left" as const, sortable: true,
                  render: (v: unknown, row: Record<string, unknown>) => (
                    <div>
                      <span className="font-medium text-[var(--foreground)]">{String(v)}</span>
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-[var(--muted)]">{String(row.segment)}</span>
                    </div>
                  ),
                },
                { key: "arr" as string, header: "ARR", type: "currency" as const, format: "compact" as const, sortable: true },
                { key: "trend" as string, header: "7d Trend", type: "sparkline" as const },
                {
                  key: "health" as string, header: "Health", type: "badge" as const,
                  badgeVariant: (v: unknown) => {
                    const s = String(v);
                    if (s === "healthy") return "success" as const;
                    if (s === "at-risk") return "warning" as const;
                    return "danger" as const;
                  },
                },
                { key: "adoption" as string, header: "Adoption", type: "progress" as const },
                {
                  key: "nps" as string, header: "NPS", type: "number" as const, sortable: true,
                  conditions: [
                    { min: 50, color: "emerald" },
                    { min: 20, color: "amber" },
                    { color: "red" },
                  ],
                },
                { key: "risk" as string, header: "Churn Risk", type: "bar" as const, format: "percent" as const },
                {
                  key: "renewsIn" as string, header: "Renews", sortable: true, width: 80, align: "center" as const,
                  render: (v: unknown) => {
                    const d = Number(v);
                    return <Badge variant={d <= 30 ? "danger" : d <= 90 ? "warning" : "default"} size="sm">{d}d</Badge>;
                  },
                },
              ] as never[]}
              renderExpanded={(row: Record<string, unknown>) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <KpiCard bare title="Seats" value={`${row.seatsUsed}/${row.seats}`} subtitle={`${Math.round((Number(row.seatsUsed) / Number(row.seats)) * 100)}% utilized`} />
                    <KpiCard bare title="ARR" value={Number(row.arr)} format="currency" comparison={{ value: Number(row.arr) * 0.85, mode: "percent" }} />
                    <KpiCard bare title="Adoption" value={Number(row.adoption)} format="percent" conditions={[{ when: "at_or_above", value: 70, color: "emerald" }, { when: "at_or_above", value: 40, color: "amber" }, { when: "below", value: 40, color: "red" }]} />
                    <KpiCard bare title="NPS Score" value={Number(row.nps)} conditions={[{ when: "at_or_above", value: 50, color: "emerald" }, { when: "at_or_above", value: 20, color: "amber" }, { when: "below", value: 20, color: "red" }]} />
                  </div>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-[12px]">
                    <div><span className="text-[var(--muted)]">CSM:</span> <span className="text-[var(--foreground)]">{String(row.csm)}</span></div>
                    <div><span className="text-[var(--muted)]">Contract:</span> <span className="text-[var(--foreground)]">{String(row.contract)}</span></div>
                    <div><span className="text-[var(--muted)]">Last Active:</span> <span className="text-[var(--foreground)]">{String(row.lastActivity)}</span></div>
                    <div><span className="text-[var(--muted)]">Email:</span> <span className="text-[var(--foreground)]">{String(row.contactEmail)}</span></div>
                    <div><span className="text-[var(--muted)]">Top Feature:</span> <span className="text-[var(--foreground)]">{String(row.topFeature)}</span></div>
                    <div><span className="text-[var(--muted)]">Segment:</span> <span className="text-[var(--foreground)]">{String(row.segment)}</span></div>
                  </div>
                </div>
              )}
              searchable
              dense
            />
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* OPS WAR ROOM                                                     */}
        {/* ================================================================ */}

        <DocSection id="ops-war-room" title="Ops War Room">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            A live operations board that <em>feels</em> alive. Pulsing status indicators for degraded services,
            data-driven callouts that auto-switch severity, KPIs with conditional glow — all updating from a single
            data source. BI dashboards are screenshots by comparison.
          </p>
        </DocSection>

        <DocSection id="ops-war-room-demo" title="System status board" level={3}>
          <ComponentExample
            code={`<MetricProvider theme="slate">
  <MetricGrid>
    <SectionHeader title="System Status" subtitle="Real-time infrastructure health" />
    <StatusIndicator size="card" title="API Gateway" value={99.97} rules={[...]} since={...} trend={[...]} />
    <StatusIndicator size="card" title="Database Primary" value={98.2} rules={[...]} />
    <StatusIndicator size="card" title="CDN Edge" value={99.99} rules={[...]} />
    <StatusIndicator size="card" title="Queue Workers" value={94.1} rules={[...]} />
    <Callout value={94.1} rules={[
      { min: 99, variant: "success", title: "All systems operational" },
      { min: 95, variant: "warning", title: "Degraded: {value}% uptime" },
      { variant: "error", title: "Critical: {value}% uptime" },
    ]} />
    <KpiCard title="P50 Latency" value={42} ... conditions={[...]} />
    <KpiCard title="Error Rate" value={0.08} format="percent" ... conditions={[...]} />
    <KpiCard title="Active Connections" value={12847} ... />
    <KpiCard title="Queue Depth" value={342} ... conditions={[...]} />
    <AreaChart title="Request Volume (24h)" data={...} thresholds={[...]} referenceLines={[...]} />
  </MetricGrid>
</MetricProvider>`}
          >
            <MetricProvider theme="slate">
              <MetricGrid>
                <SectionHeader title="System Status" subtitle="Real-time infrastructure health" badge={<Badge variant="success" dot size="sm">Live</Badge>} />

                <StatusIndicator
                  size="card"
                  title="API Gateway"
                  value={99.97}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                  since={new Date(Date.now() - 3600000 * 72)}
                  trend={[99.1, 99.5, 99.8, 99.9, 99.97]}
                />
                <StatusIndicator
                  size="card"
                  title="Database Primary"
                  value={98.2}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                  since={new Date(Date.now() - 3600000 * 2)}
                  trend={[99.9, 99.8, 99.2, 98.8, 98.2]}
                />
                <StatusIndicator
                  size="card"
                  title="CDN Edge"
                  value={99.99}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                  since={new Date(Date.now() - 3600000 * 168)}
                  trend={[99.95, 99.97, 99.98, 99.99, 99.99]}
                />
                <StatusIndicator
                  size="card"
                  title="Queue Workers"
                  value={94.1}
                  rules={[
                    { min: 99.9, color: "emerald", label: "Healthy" },
                    { min: 95, color: "amber", label: "Degraded", pulse: true },
                    { color: "red", label: "Down", pulse: true },
                  ]}
                  since={new Date(Date.now() - 3600000 * 0.5)}
                  trend={[99.9, 98.4, 96.1, 95.0, 94.1]}
                />

                <Callout
                  value={94.1}
                  rules={[
                    { min: 99, variant: "success", title: "All systems operational", message: "Infrastructure is performing within expected parameters." },
                    { min: 95, variant: "warning", title: "Performance degraded", message: "Queue workers at {value}% — auto-scaling in progress. 3 workers restarting." },
                    { variant: "error", title: "Critical: systems impaired", message: "Multiple services below SLA threshold ({value}%). Incident response activated." },
                  ]}
                />

                <KpiCard
                  title="P50 Latency"
                  value={42}
                  subtitle="ms"
                  comparison={{ value: 38, mode: "percent" }}
                  sparkline={{ data: [35, 38, 36, 40, 42, 39, 42], type: "line" }}
                  conditions={[{ when: "below", value: 50, color: "emerald" }, { when: "below", value: 100, color: "amber" }, { when: "at_or_above", value: 100, color: "red" }]}
                  icon={<Zap className="h-3.5 w-3.5" />}
                />
                <KpiCard
                  title="Error Rate"
                  value={0.08}
                  format="percent"
                  comparison={{ value: 0.03, mode: "percent", invertTrend: true }}
                  sparkline={{ data: [0.02, 0.03, 0.03, 0.05, 0.06, 0.07, 0.08], type: "line" }}
                  conditions={[{ when: "below", value: 0.05, color: "emerald" }, { when: "below", value: 0.10, color: "amber" }, { when: "at_or_above", value: 0.10, color: "red" }]}
                  icon={<AlertTriangle className="h-3.5 w-3.5" />}
                />
                <KpiCard
                  title="Active Connections"
                  value={12847}
                  format="compact"
                  comparison={{ value: 11200, mode: "percent" }}
                  sparkline={{ data: [9800, 10200, 11000, 11500, 12100, 12500, 12847], type: "line" }}
                  icon={<Wifi className="h-3.5 w-3.5" />}
                />
                <KpiCard
                  title="Queue Depth"
                  value={342}
                  comparison={{ value: 45, mode: "percent", invertTrend: true }}
                  sparkline={{ data: [12, 28, 65, 140, 210, 290, 342], type: "line" }}
                  conditions={[{ when: "below", value: 100, color: "emerald" }, { when: "below", value: 500, color: "amber" }, { when: "at_or_above", value: 500, color: "red" }]}
                  highlight={342 > 200}
                  icon={<Database className="h-3.5 w-3.5" />}
                />

                <AreaChart
                  title="Request Volume (24h)"
                  data={[
                    { hour: "00:00", requests: 2400, errors: 12 },
                    { hour: "02:00", requests: 1800, errors: 8 },
                    { hour: "04:00", requests: 1200, errors: 5 },
                    { hour: "06:00", requests: 2800, errors: 14 },
                    { hour: "08:00", requests: 5200, errors: 26 },
                    { hour: "10:00", requests: 8400, errors: 42 },
                    { hour: "12:00", requests: 9800, errors: 78 },
                    { hour: "14:00", requests: 10200, errors: 92 },
                    { hour: "16:00", requests: 9600, errors: 86 },
                    { hour: "18:00", requests: 7200, errors: 58 },
                    { hour: "20:00", requests: 5400, errors: 32 },
                    { hour: "22:00", requests: 3600, errors: 18 },
                  ]}
                  index="hour"
                  categories={[
                    { key: "requests", label: "Requests", color: "var(--accent)" },
                    { key: "errors", label: "Errors", color: "var(--mu-color-negative)" },
                  ]}
                  referenceLines={[{ axis: "y", value: 10000, label: "Capacity Warning", color: "var(--mu-color-warning)" }]}
                  thresholds={[{ from: 10000, to: 12000, color: "var(--mu-color-negative)", opacity: 0.08, label: "Danger Zone" }]}
                  height={220}
                />
              </MetricGrid>
            </MetricProvider>
          </ComponentExample>
        </DocSection>

        {/* ================================================================ */}
        {/* THE METRIC SANDWICH                                              */}
        {/* ================================================================ */}

        <DocSection id="metric-sandwich" title="The Metric Sandwich">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Three layers, one story. KPI cards on top for the headlines, a chart in the middle for the trend,
            a detail table on the bottom for the drill-down — all wired together with linked hover and cross-filtering.
            Hover a point on the chart and the matching table row highlights. Click a table row and everything filters. Impossible in any BI tool.
          </p>
        </DocSection>

        <DocSection id="metric-sandwich-demo" title="Revenue deep-dive" level={3}>
          <ComponentExample
            code={`<LinkedHoverProvider>
  <CrossFilterProvider>
    <MetricGrid>
      {/* Layer 1: KPI headlines */}
      <KpiCard title="Total Revenue" value={329000} format="currency" comparison={...} sparkline={...} />
      <KpiCard title="Avg Deal Size" value={245} format="currency" comparison={...} />
      <KpiCard title="Active Products" value={4} comparison={...} />
      <KpiCard title="Net Margin" value={0.38} format="percent" goal={...} conditions={...} />

      {/* Layer 2: Trend chart */}
      <AreaChart title="Monthly Revenue vs Expenses" data={monthly} ... referenceLines={[...]} thresholds={[...]} />

      {/* Layer 3: Detail table with everything */}
      <DataTable title="Product Breakdown" data={products} columns={[...]} renderExpanded={...} />
    </MetricGrid>
  </CrossFilterProvider>
</LinkedHoverProvider>`}
          >
            <LinkedHoverProvider>
              <CrossFilterProvider>
                <MetricGrid>
                  <KpiCard
                    title="Total Revenue"
                    value={329000}
                    format="currency"
                    comparison={{ value: 280000, mode: "percent" }}
                    sparkline={{ data: [42, 48, 55, 51, 62, 71], previousPeriod: [38, 40, 44, 46, 50, 56], type: "line" }}
                    icon={<DollarSign className="h-3.5 w-3.5" />}
                  />
                  <KpiCard
                    title="Avg Deal Size"
                    value={245}
                    format="currency"
                    comparison={{ value: 210, mode: "percent" }}
                    sparkline={{ data: [190, 200, 215, 230, 240, 245], type: "line" }}
                  />
                  <KpiCard
                    title="Active Products"
                    value={4}
                    comparison={{ value: 3, mode: "percent" }}
                    subtitle="across 525 customers"
                    icon={<Zap className="h-3.5 w-3.5" />}
                  />
                  <KpiCard
                    title="Net Margin"
                    value={0.38}
                    format="percent"
                    goal={{ value: 0.40, label: "Target: 40%" }}
                    conditions={[{ when: "at_or_above", value: 0.35, color: "emerald" }, { when: "at_or_above", value: 0.20, color: "amber" }, { when: "below", value: 0.20, color: "red" }]}
                    sparkline={{ data: [0.33, 0.38, 0.44, 0.35, 0.45, 0.49], type: "bar" }}
                    icon={<Activity className="h-3.5 w-3.5" />}
                  />

                  <AreaChart
                    title="Monthly Revenue vs Expenses"
                    data={sandwichMonthly}
                    index="month"
                    categories={[
                      { key: "revenue", label: "Revenue", color: "var(--mu-color-positive)" },
                      { key: "expenses", label: "Expenses", color: "var(--mu-color-negative)" },
                      { key: "profit", label: "Profit", color: "var(--accent)" },
                    ]}
                    referenceLines={[{ axis: "y", value: 60000, label: "Revenue Target", color: "var(--mu-color-warning)" }]}
                    thresholds={[{ from: 0, to: 25000, color: "var(--mu-color-negative)", opacity: 0.05, label: "Below Breakeven" }]}
                    height={260}
                  />

                  <DataTable
                    title="Product Breakdown"
                    subtitle="Revenue by product line"
                    data={sandwichProducts as never[]}
                    columns={[
                      {
                        key: "product" as string, header: "Product", pin: "left" as const, sortable: true,
                        render: (v: unknown) => <span className="font-medium text-[var(--foreground)]">{String(v)}</span>,
                      },
                      { key: "revenue" as string, header: "Revenue", type: "currency" as const, sortable: true },
                      { key: "trend" as string, header: "6m Trend", type: "sparkline" as const },
                      { key: "customers" as string, header: "Customers", type: "number" as const, sortable: true },
                      {
                        key: "growth" as string, header: "Growth", type: "percent" as const, sortable: true,
                        conditions: [{ when: "at_or_above", value: 0, color: "emerald" }, { when: "below", value: 0, color: "red" }],
                      },
                      { key: "status" as string, header: "Status", type: "badge" as const },
                    ] as never[]}
                    renderExpanded={(row: Record<string, unknown>) => (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <KpiCard bare title="Avg Deal" value={Number(row.avgDeal)} format="currency" />
                        <KpiCard bare title="Churn Rate" value={Number(row.churnRate)} format="percent" conditions={[{ when: "below", value: 0.05, color: "emerald" }, { when: "below", value: 0.10, color: "amber" }, { when: "at_or_above", value: 0.10, color: "red" }]} />
                        <KpiCard bare title="Customers" value={Number(row.customers)} />
                        <KpiCard bare title="Top Region" value={String(row.topRegion)} />
                      </div>
                    )}
                    dense
                    crossFilter
                    linkedIndexField="product"
                  />
                </MetricGrid>
              </CrossFilterProvider>
            </LinkedHoverProvider>
          </ComponentExample>
        </DocSection>

      </div>
      <OnThisPage items={tocItems} />
    </div>
  );
}
