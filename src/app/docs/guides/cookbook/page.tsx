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
import { DollarSign, Users, TrendingDown, Zap, Activity } from "lucide-react";

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
            <div className="flex gap-4">
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

      </div>
      <OnThisPage items={tocItems} />
    </div>
  );
}
