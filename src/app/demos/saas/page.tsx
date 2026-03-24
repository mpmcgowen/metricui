"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Funnel } from "@/components/charts/Funnel";
import { BulletChart } from "@/components/charts/BulletChart";
import { Waterfall } from "@/components/charts/Waterfall";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { FilterBar } from "@/components/filters/FilterBar";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { MetricProvider } from "@/lib/MetricProvider";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { fmt, formatValue } from "@/lib/format";
import { DrillDown, useDrillDownAction } from "@/components/ui/DrillDown";
import { accounts, type Account } from "@/data/saas-accounts";
import {
  DollarSign,
  Users,
  TrendingDown,
  BarChart3,
  Activity,
} from "lucide-react";

// ---------------------------------------------------------------------------
// All unique industries (for the dropdown)
// ---------------------------------------------------------------------------

const allIndustries = [...new Set(accounts.map((a) => a.industry))].sort();

// ---------------------------------------------------------------------------
// Derive dashboard data from a filtered account list
// ---------------------------------------------------------------------------

function deriveData(accts: Account[]) {
  const active = accts.filter((a) => a.status === "active");
  const churned = accts.filter((a) => a.status === "churned");
  const totalMrr = active.reduce((s, a) => s + a.mrr, 0);
  const totalSeats = active.reduce((s, a) => s + a.seats, 0);

  // --- KPIs ---
  const kpis = {
    mrr: totalMrr,
    arr: totalMrr * 12,
    activeAccounts: active.length,
    churned: churned.length,
    totalAccounts: accts.length,
    avgMrr: active.length > 0 ? Math.round(totalMrr / active.length) : 0,
    totalSeats,
    churnRate: accts.length > 0 ? Math.round((churned.length / accts.length) * 1000) / 10 : 0,
  };

  // --- Distributions ---
  function groupBy(arr: Account[], key: keyof Account) {
    const map = new Map<string, number>();
    for (const a of arr) map.set(String(a[key]), (map.get(String(a[key])) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([id, value]) => ({ id, label: id, value }));
  }

  const planDistribution = groupBy(accts, "plan");
  const industryDistribution = groupBy(accts, "industry");

  const countryMap = new Map<string, number>();
  for (const a of accts) countryMap.set(a.country, (countryMap.get(a.country) ?? 0) + 1);
  const countryDistribution = [...countryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([country, acctCount]) => ({ country, accounts: acctCount }));

  // --- Churn reasons ---
  const reasonMap = new Map<string, number>();
  for (const a of churned) {
    const r = a.churnReason ?? "unknown";
    reasonMap.set(r, (reasonMap.get(r) ?? 0) + 1);
  }
  const churnReasons = [...reasonMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1), value }));

  // --- MRR by month (from join dates of active accounts) ---
  const monthMrrMap = new Map<string, number>();
  for (const a of active) {
    monthMrrMap.set(a.joinMonth, (monthMrrMap.get(a.joinMonth) ?? 0) + a.mrr);
  }
  const mrrByMonth = [...monthMrrMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, mrr]) => ({ month, mrr }));

  // Cumulative MRR
  let cumulative = 0;
  const cumulativeMrr = mrrByMonth.map((m) => {
    cumulative += m.mrr;
    return { month: m.month, mrr: cumulative };
  });

  const mrrSparkline = cumulativeMrr.slice(-12).map((m) => m.mrr);

  // --- Signups & churn by month ---
  const signupMap = new Map<string, number>();
  const churnMap = new Map<string, number>();
  for (const a of accts) {
    signupMap.set(a.joinMonth, (signupMap.get(a.joinMonth) ?? 0) + 1);
    if (a.status === "churned") {
      churnMap.set(a.joinMonth, (churnMap.get(a.joinMonth) ?? 0) + 1);
    }
  }
  const growthMonths = [...new Set([...signupMap.keys(), ...churnMap.keys()])].sort();
  const growthData = growthMonths.map((month) => ({
    month,
    signups: signupMap.get(month) ?? 0,
    churned: churnMap.get(month) ?? 0,
  }));

  // --- Conversion funnel ---
  const funnel = [
    { id: "signups", label: "Signed Up", value: accts.length },
    { id: "activated", label: "Activated", value: active.length + Math.round(churned.length * 0.8) },
    { id: "subscribed", label: "Subscribed", value: active.length },
    { id: "retained", label: "Retained (6mo)", value: Math.round(active.length * 0.82) },
  ];

  // --- Top accounts (active, sorted by MRR) ---
  const topAccounts = [...active].sort((a, b) => b.mrr - a.mrr).slice(0, 20);

  return {
    kpis,
    planDistribution,
    industryDistribution,
    countryDistribution,
    churnReasons,
    cumulativeMrr,
    mrrSparkline,
    growthData,
    funnel,
    topAccounts,
  };
}

// ---------------------------------------------------------------------------
// Dashboard content — reads filters, derives everything from filtered data
// ---------------------------------------------------------------------------

/** Check if a "YYYY-MM" month string falls within a date range */
function monthInRange(month: string, start: Date, end: Date): boolean {
  // Parse "YYYY-MM" to first day of that month
  const [y, m] = month.split("-").map(Number);
  const monthStart = new Date(y, m - 1, 1);
  const monthEnd = new Date(y, m, 0, 23, 59, 59); // last day of month
  return monthEnd >= start && monthStart <= end;
}

function DashboardContent() {
  const cf = useCrossFilter();
  const filters = useMetricFilters();
  const openDrill = useDrillDownAction();
  const industryFilter = filters?.dimensions?.industry ?? [];

  // Step 1: Period filter
  const byPeriod = useMemo(() => {
    if (!filters?.period) return accounts;
    return accounts.filter((a) => monthInRange(a.joinMonth, filters.period!.start, filters.period!.end));
  }, [filters?.period]);

  // Step 2: Industry dropdown filter
  const byIndustry = useMemo(() => {
    if (industryFilter.length === 0) return byPeriod;
    return byPeriod.filter((a) => industryFilter.includes(a.industry));
  }, [byPeriod, industryFilter]);

  // Step 3: Cross-filter (country bar) on top
  const filtered = useMemo(() => {
    if (!cf?.isActive || cf.selection?.field !== "country") return byIndustry;
    return byIndustry.filter((a) => a.country === cf.selection!.value);
  }, [byIndustry, cf?.isActive, cf?.selection]);

  // Derive current period data
  const data = useMemo(() => deriveData(filtered), [filtered]);

  // Derive comparison period data (for KPI comparisons)
  const compData = useMemo(() => {
    if (!filters?.comparisonPeriod) return null;
    let comp = accounts.filter((a) => monthInRange(a.joinMonth, filters.comparisonPeriod!.start, filters.comparisonPeriod!.end));
    if (industryFilter.length > 0) comp = comp.filter((a) => industryFilter.includes(a.industry));
    if (cf?.isActive && cf.selection?.field === "country") comp = comp.filter((a) => a.country === cf.selection!.value);
    return deriveData(comp);
  }, [filters?.comparisonPeriod, industryFilter, cf?.isActive, cf?.selection]);

  // Country bar always shows industry-filtered data (it's the cross-filter source)
  const countryBarData = useMemo(() => deriveData(byIndustry), [byIndustry]);

  const churnSparkline = data.growthData.slice(-12).map((m) => m.churned);

  // Memoize comparison series for AreaCharts.
  // Key: map comparison data onto the current period's x-axis labels so both lines align.
  const mrrCompSeries = useMemo(() => {
    if (!compData) return undefined;
    const currentMonths = data.cumulativeMrr.map((m) => m.month);
    const compValues = compData.cumulativeMrr;
    return [{ id: "mrr", data: currentMonths.map((month, i) => ({
      x: month,
      y: compValues[i]?.mrr ?? null,
    })) }];
  }, [compData, data.cumulativeMrr]);

  const growthCompSeries = useMemo(() => {
    if (!compData) return undefined;
    const currentMonths = data.growthData.map((m) => m.month);
    const compValues = compData.growthData;
    return [
      { id: "signups", data: currentMonths.map((month, i) => ({ x: month, y: compValues[i]?.signups ?? null })) },
      { id: "churned", data: currentMonths.map((month, i) => ({ x: month, y: compValues[i]?.churned ?? null })) },
    ];
  }, [compData, data.growthData]);

  const filterLabel = [
    industryFilter.length > 0 ? industryFilter.join(", ") : "",
    cf?.isActive && cf.selection?.field === "country" ? cf.selection.value : "",
  ].filter(Boolean).join(" · ");

  return (
    <>
      <FilterBar
        badge={<>{formatValue(data.kpis.activeAccounts, "number")} active accounts</>}
        tags={{ showCrossFilter: true, crossFilterLabels: { country: "Country" } }}
        className="mt-4"
      >
        <FilterBar.Primary>
          <PeriodSelector
            presets={["30d", "90d", "quarter", "ytd", "year"]}
            comparison
          />
          <DropdownFilter
            label="Industry"
            options={allIndustries.map((ind) => ({
              value: ind,
              label: ind,
              count: accounts.filter((a) => a.industry === ind).length,
            }))}
            multiple
            field="industry"
          />
        </FilterBar.Primary>
      </FilterBar>

      <MetricGrid className="mt-6">

      {/* ── Overview ── */}
      <SectionHeader title="Overview" subtitle={filterLabel || "Key metrics this period"} />
      <KpiCard
        title="Monthly Recurring Revenue"
        value={data.kpis.mrr}
        format="currency"
        comparison={compData ? { value: compData.kpis.mrr, label: "vs comparison period" } : undefined}
        sparkline={{ data: data.mrrSparkline, type: "line" }}
        icon={<DollarSign className="h-3.5 w-3.5" />}
        description="Sum of all active subscription charges this month, excluding one-time fees and overages."
        animate={{ countUp: true }}
      />
      <KpiCard
        title="Annual Run Rate"
        value={data.kpis.arr}
        format={fmt("currency", { compact: true })}
        comparison={compData ? { value: compData.kpis.arr } : undefined}
        icon={<BarChart3 className="h-3.5 w-3.5" />}
        description={({ value }) => `Projected annual revenue (MRR × 12). Current monthly run rate: $${Math.round(value / 12).toLocaleString()}.`}
        animate={{ countUp: true, delay: 100 }}
      />
      <KpiCard
        title="Active Accounts"
        value={data.kpis.activeAccounts}
        format="number"
        comparison={compData ? { value: compData.kpis.activeAccounts } : undefined}
        icon={<Users className="h-3.5 w-3.5" />}
        description="Accounts with at least one active subscription. Excludes free-tier and trial accounts."
        animate={{ countUp: true, delay: 200 }}
      />
      <KpiCard
        title="Churn Rate"
        value={data.kpis.churnRate}
        format="percent"
        comparison={compData ? { value: compData.kpis.churnRate, invertTrend: true } : undefined}
        sparkline={{ data: churnSparkline, type: "bar" }}
        icon={<TrendingDown className="h-3.5 w-3.5" />}
        description={({ value }) => `${value}% of accounts cancelled this period. Target is below 15%. ${value > 15 ? "Review retention strategies." : "On track."}`}
        animate={{ countUp: true, delay: 300 }}
        conditions={[
          { when: "below", value: 15, color: "emerald" },
          { when: "between", min: 15, max: 25, color: "amber" },
          { when: "above", value: 25, color: "red" },
        ]}
        drillDown={{
          label: "View churned accounts",
          onClick: () => openDrill(
            { title: `Churn Rate: ${data.kpis.churnRate}%`, field: "status", value: "churned" },
            <MetricGrid>
              <DonutChart data={data.churnReasons} title="Churn Reasons" showPercentage innerRadius={0.6} height={260} />
              <DataTable
                data={filtered.filter((a) => a.status === "churned") as never[]}
                columns={[
                  { key: "name", header: "Account", sortable: true },
                  { key: "industry", header: "Industry", sortable: true },
                  { key: "churnReason", header: "Reason", sortable: true },
                  { key: "country", header: "Country", sortable: true },
                ]}
                title={`${data.kpis.churned} Churned Accounts`}
                pageSize={10}
                dense
                searchable
              />
            </MetricGrid>,
          ),
        }}
      />

      <StatGroup
        stats={[
          { label: "Avg MRR / Account", value: data.kpis.avgMrr, format: "currency" },
          { label: "Total Seats", value: data.kpis.totalSeats, format: "compact" },
          { label: "Total Accounts", value: data.kpis.totalAccounts, format: "number" },
          { label: "Churned", value: data.kpis.churned, icon: <Activity className="h-3 w-3" /> },
        ]}
      />

      {/* ── Churn callout ── */}
      <Callout
        value={data.kpis.churnRate}
        rules={[
          { max: 15, variant: "success", title: "Churn is healthy", message: "At {value}%, churn is below the 15% target." },
          { max: 25, variant: "warning", title: "Churn rate elevated", message: "At {value}%, churn is above the 15% target. Review retention strategies." },
          { variant: "error", title: "Churn is critical", message: "At {value}%, churn requires immediate action." },
        ]}
        metric={{ value: data.kpis.churned, format: "number", label: "accounts lost" }}
        dismissible
        dense
      />

      {/* ── Revenue ── */}
      <SectionHeader title="Revenue" subtitle="MRR trends and revenue bridge" />
      <AreaChart
        data={data.cumulativeMrr}
        index="month"
        categories={["mrr"]}
        title="Cumulative MRR"
        subtitle={compData ? "Current vs comparison period" : "Monthly recurring revenue growth"}
        description="Running total of MRR from account join dates. Filters apply — select an industry or country to see its MRR contribution."
        format="currency"
        height={300}
        enableArea
        gradient
        comparisonData={mrrCompSeries}
      />

      <Divider spacing="lg" />

      {/* ── Conversion & Retention ── */}
      <SectionHeader title="Conversion & Retention" />
      <Funnel
        data={data.funnel}
        title="Conversion Funnel"
        subtitle="Signup → Retained pipeline"
        description="Tracks accounts through each stage from initial signup to long-term retention."
        format="number"
        showConversionRate
        height={280}
      />
      <DonutChart
        data={data.churnReasons}
        title="Churn Reasons"
        subtitle="Why customers leave"
        description="Self-reported cancellation reasons collected from exit surveys."
        showPercentage
        innerRadius={0.6}
        centerValue={String(data.kpis.churned)}
        centerLabel="churned"
        height={280}
      />

      {/* ── Customers ── */}
      <SectionHeader title="Customers" subtitle="Account distribution — click a country bar to cross-filter" />
      <BarChart
        data={countryBarData.countryDistribution}
        keys={["accounts"]}
        indexBy="country"
        title="Accounts by Country"
        description="Click a bar to drill into that country's accounts."
        format="number"
        height={260}
        sort="desc"
        layout="horizontal"
        onBarClick={(e) => openDrill(
          { title: `Country: ${e.label}`, field: "country", value: e.indexValue },
          <MetricGrid>
            <KpiCard title="Accounts" value={filtered.filter((a) => a.country === e.indexValue).length} format="number" />
            <KpiCard title="MRR" value={filtered.filter((a) => a.country === e.indexValue && a.status === "active").reduce((s, a) => s + a.mrr, 0)} format="currency" />
            <DataTable
              data={filtered.filter((a) => a.country === e.indexValue) as never[]}
              columns={[
                { key: "name", header: "Account", sortable: true },
                { key: "industry", header: "Industry", sortable: true },
                { key: "plan", header: "Plan", sortable: true },
                { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" as const },
                { key: "status", header: "Status", sortable: true },
              ]}
              title="Accounts"
              pageSize={10}
              dense
              searchable
            />
          </MetricGrid>,
        )}
      />
      <DonutChart
        data={data.planDistribution}
        title="Plan Distribution"
        showPercentage
        innerRadius={0.6}
        height={260}
      />
      <DonutChart
        data={data.industryDistribution}
        title="Industry Breakdown"
        showPercentage
        innerRadius={0.6}
        height={260}
      />

      {/* ── Growth ── */}
      <SectionHeader title="Growth" subtitle="Signups vs churn trends" />
      <AreaChart
        data={data.growthData}
        index="month"
        categories={["signups", "churned"]}
        title="Signups vs Churn"
        subtitle={compData ? "Current vs comparison period" : "Monthly new signups and churned accounts"}
        format="number"
        height={300}
        enableArea
        gradient
        legend
        comparisonData={growthCompSeries}
      />

      {/* ── Top Accounts ── */}
      <MetricGrid.Section
        title="Top Accounts"
        subtitle={`${data.topAccounts.length} accounts by MRR`}
      />
      <DataTable
        data={data.topAccounts as never[]}
        description="Top 20 active accounts ranked by MRR. All filters apply."
        columns={[
          { key: "name", header: "Account", sortable: true },
          { key: "industry", header: "Industry", sortable: true },
          {
            key: "plan", header: "Plan", sortable: true,
            render: (val: unknown) => (
              <Badge size="sm" variant="outline"
                color={val === "Enterprise" ? "purple" : val === "Pro" ? "blue" : "gray"}>
                {String(val)}
              </Badge>
            ),
          },
          { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" as const },
          { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" as const },
          { key: "country", header: "Country", sortable: true },
        ]}
        title="Top Accounts"
        pageSize={10}
        dense
      />
    </MetricGrid>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper — providers + filters
// ---------------------------------------------------------------------------

export default function SaaSDashboard() {
  return (
    <MetricProvider theme="emerald">
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <FilterProvider defaultPreset="ytd" referenceDate={new Date(2024, 11, 31)}>
            <CrossFilterProvider>
              <DrillDown.Root>

                <DashboardHeader
                  title="RavenStack Analytics"
                  subtitle="SaaS metrics dashboard — powered by 500 generated accounts"
                  status="live"
                  back={{ href: "/docs/kpi-card" }}
                />

                <DashboardContent />

              </DrillDown.Root>
            </CrossFilterProvider>
          </FilterProvider>
        </div>
      </div>
    </MetricProvider>
  );
}
