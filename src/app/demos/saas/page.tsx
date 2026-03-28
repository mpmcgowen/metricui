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
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { FilterBar } from "@/components/filters/FilterBar";
import { useMetricFilters } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { Dashboard } from "@/components/layout/Dashboard";
import { fmt, formatValue } from "@/lib/format";
import { DashboardInsight } from "@/components/ui/DashboardInsight";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { accounts, type Account } from "@/data/saas-accounts";
import {
  DollarSign,
  Users,
  TrendingDown,
  BarChart3,
  Activity,
  PieChart,
  Table2,
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
        sticky
        badge={<>{formatValue(data.kpis.activeAccounts, "number")} active accounts</>}
        tags={{ showCrossFilter: true, crossFilterLabels: { country: "Country" } }}
        className="mt-4"
      >
        <FilterBar.Nav>
          <DashboardNav
            tabs={[
              { value: "overview", label: "Overview", icon: <Activity className="h-3.5 w-3.5" /> },
              { value: "revenue", label: "Revenue", icon: <DollarSign className="h-3.5 w-3.5" /> },
              { value: "conversion", label: "Conversion", icon: <TrendingDown className="h-3.5 w-3.5" /> },
              { value: "customers", label: "Customers", icon: <Users className="h-3.5 w-3.5" /> },
              { value: "growth", label: "Growth", icon: <BarChart3 className="h-3.5 w-3.5" /> },
            ]}
            mode="scroll"
          />
        </FilterBar.Nav>
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
      <SectionHeader id="overview" title="Overview" subtitle={filterLabel || "Key metrics this period"} />
      <KpiCard
        title="Monthly Recurring Revenue"
        value={data.kpis.mrr}
        format="currency"
        comparison={compData ? { value: compData.kpis.mrr, label: "vs comparison period" } : undefined}
        sparkline={{ data: data.mrrSparkline, type: "line" }}
        icon={<DollarSign className="h-3.5 w-3.5" />}
        aiContext="Our north star metric. Enterprise accounts drive 52% of MRR despite being 14% of base. Expansion revenue from seat upgrades is the fastest-growing segment."
        description="Sum of all active subscription charges this month, excluding one-time fees and overages."
        animate={{ countUp: true }}
        drillDown={() => {
            const activeAccts = filtered.filter((a) => a.status === "active");
            const mrrByPlan = (() => {
              const map = new Map<string, number>();
              for (const a of activeAccts) map.set(a.plan, (map.get(a.plan) ?? 0) + a.mrr);
              return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([id, value]) => ({ id, label: id, value }));
            })();
            const topByMrr = [...activeAccts].sort((a, b) => b.mrr - a.mrr).slice(0, 15);
            return (
              <MetricGrid>
                <KpiCard title="MRR" value={data.kpis.mrr} format="currency" />
                <KpiCard title="ARR" value={data.kpis.arr} format={fmt("currency", { compact: true })} />
                <KpiCard title="Avg MRR / Account" value={data.kpis.avgMrr} format="currency" />
                <DonutChart
                  data={mrrByPlan}
                  title="MRR by Plan"
                  subtitle="Revenue distribution across pricing tiers"
                  showPercentage
                  innerRadius={0.6}
                  centerValue={formatValue(data.kpis.mrr, { style: "currency", compact: true })}
                  centerLabel="total"
                  height={280}
                />
                <DataTable
                  data={topByMrr}
                  columns={[
                    { key: "name", header: "Account", sortable: true },
                    { key: "plan", header: "Plan", sortable: true },
                    { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
                    { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" },
                    { key: "industry", header: "Industry", sortable: true },
                  ]}
                  title="Top 15 Accounts by MRR"
                  pageSize={10}
                  dense
                  searchable
                />
              </MetricGrid>
            );
        }}
      />
      <KpiCard
        title="Annual Run Rate"
        value={data.kpis.arr}
        format={fmt("currency", { compact: true })}
        comparison={compData ? { value: compData.kpis.arr } : undefined}
        icon={<BarChart3 className="h-3.5 w-3.5" />}
        aiContext="ARR is MRR × 12. Board target is $2M ARR by end of year. Currently tracking behind — need 15% MRR growth in Q4 to hit it."
        description={({ value }) => `Projected annual revenue (MRR × 12). Current monthly run rate: $${Math.round(value / 12).toLocaleString()}.`}
        animate={{ countUp: true, delay: 100 }}
      />
      <KpiCard
        title="Active Accounts"
        value={data.kpis.activeAccounts}
        format="number"
        comparison={compData ? { value: compData.kpis.activeAccounts } : undefined}
        icon={<Users className="h-3.5 w-3.5" />}
        aiContext="Active = not churned. Basic plan has highest absolute churn but lowest MRR impact. Enterprise retention is critical — losing one Enterprise account equals losing ~8 Basic accounts in MRR."
        description="Accounts with at least one active subscription. Excludes free-tier and trial accounts."
        animate={{ countUp: true, delay: 200 }}
        drillDown={() => {
            const activeAccts = filtered.filter((a) => a.status === "active");
            const byIndustry = (() => {
              const map = new Map<string, number>();
              for (const a of activeAccts) map.set(a.industry, (map.get(a.industry) ?? 0) + 1);
              return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([industry, count]) => ({ industry, accounts: count }));
            })();
            return (
              <MetricGrid>
                <KpiCard title="Active" value={activeAccts.length} format="number" />
                <KpiCard title="Total MRR" value={activeAccts.reduce((s, a) => s + a.mrr, 0)} format="currency" />
                <KpiCard title="Avg Seats" value={activeAccts.length > 0 ? Math.round(activeAccts.reduce((s, a) => s + a.seats, 0) / activeAccts.length) : 0} format="number" />
                <BarChart
                  data={byIndustry}
                  categories={["accounts"]}
                  index="industry"
                  title="Accounts by Industry"
                  format="number"
                  height={260}
                  sort="desc"
                  layout="horizontal"
                />
                <DataTable
                  data={activeAccts}
                  columns={[
                    { key: "name", header: "Account", sortable: true },
                    { key: "industry", header: "Industry", sortable: true },
                    { key: "plan", header: "Plan", sortable: true },
                    { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
                    { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" },
                    { key: "country", header: "Country", sortable: true },
                  ]}
                  title="All Active Accounts"
                  pageSize={10}
                  dense
                  searchable
                />
              </MetricGrid>
            );
        }}
      />
      <KpiCard
        title="Churn Rate"
        value={data.kpis.churnRate}
        format="percent"
        comparison={compData && compData.kpis.totalAccounts > 20 ? { value: compData.kpis.churnRate, invertTrend: true } : undefined}
        sparkline={{ data: churnSparkline, type: "bar" }}
        icon={<TrendingDown className="h-3.5 w-3.5" />}
        aiContext="Target is below 15%. FinTech vertical has highest churn, driven by competitor pressure. Enterprise churn is low but catastrophic per-account. Most churn happens in first 90 days."
        description={({ value }) => `${value}% of accounts cancelled this period. Target is below 15%. ${value > 15 ? "Review retention strategies." : "On track."}`}
        animate={{ countUp: true, delay: 300 }}
        conditions={[
          { when: "below", value: 15, color: "emerald" },
          { when: "between", min: 15, max: 25, color: "amber" },
          { when: "above", value: 25, color: "red" },
        ]}
        drillDown={() => (
            <MetricGrid>
              <DonutChart data={data.churnReasons} title="Churn Reasons" showPercentage innerRadius={0.6} height={260} />
              <DataTable
                data={filtered.filter((a) => a.status === "churned")}
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
            </MetricGrid>
        )}
      />

      <StatGroup
        stats={[
          { label: "Avg MRR / Account", value: data.kpis.avgMrr, format: "currency" },
          { label: "Total Seats", value: data.kpis.totalSeats, format: "compact" },
          { label: "Total Accounts", value: data.kpis.totalAccounts, format: "number" },
          { label: "Churned", value: data.kpis.churned, icon: <Activity className="h-3 w-3" /> },
        ]}
        aiContext="Avg MRR/Account is a key health indicator. Rising means upsell is working. Total seats correlates with stickiness — accounts with 10+ seats churn 60% less."
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
      <SectionHeader id="revenue" title="Revenue" subtitle="MRR trends and revenue bridge" />
      <AreaChart
        data={data.cumulativeMrr}
        index="month"
        categories={["mrr"]}
        title="Cumulative MRR"
        subtitle={compData ? "Current vs comparison period" : "Monthly recurring revenue growth"}
        description="Running total of MRR from account join dates. Filters apply — select an industry or country to see its MRR contribution."
        aiContext="MRR growth flattened in Q3 2024 due to a pricing migration. The step-up in Oct 2024 reflects Enterprise renewals on new pricing. Seasonality: Q1 is slowest for new signups."
        format="currency"
        height={300}
        enableArea
        gradient
        comparisonData={mrrCompSeries}
      />

      {/* ── Conversion & Retention ── */}
      <SectionHeader id="conversion" title="Conversion & Retention" />
      <Funnel
        data={data.funnel}
        title="Conversion Funnel"
        subtitle="Signup → Retained pipeline"
        description="Tracks accounts through each stage from initial signup to long-term retention."
        aiContext="Biggest drop-off is Activated → Subscribed (credit card wall). We're testing a 14-day free trial to improve this. Retained = still active after 6 months."
        format="number"
        showConversionRate
        height={280}
      />
      <DonutChart
        data={data.churnReasons}
        title="Churn Reasons"
        subtitle="Why customers leave"
        description="Self-reported cancellation reasons collected from exit surveys."
        aiContext="'Price' is the top reason but exit surveys are unreliable — many who say 'price' actually had low usage. 'Competitor' churn is concentrated in FinTech vertical."
        showPercentage
        innerRadius={0.6}
        centerValue={String(data.kpis.churned)}
        centerLabel="churned"
        height={280}
      />

      {/* ── Customers ── */}
      <SectionHeader id="customers" title="Customers" subtitle="Account distribution — click a country bar to cross-filter" />
      <BarChart
        data={countryBarData.countryDistribution}
        categories={["accounts"]}
        index="country"
        title="Accounts by Country"
        description="Click a bar to drill into that country's accounts."
        aiContext="US dominates account count but ARPU is highest in UK and Germany (Enterprise-heavy). APAC is growing fastest QoQ. Brazil accounts have highest churn."
        format="number"
        height={260}
        sort="desc"
        layout="horizontal"
        crossFilter={{ field: "country" }}
        drillDown={(e) => (
          <MetricGrid>
            <KpiCard title="Accounts" value={filtered.filter((a) => a.country === e.indexValue).length} format="number" />
            <KpiCard title="MRR" value={filtered.filter((a) => a.country === e.indexValue && a.status === "active").reduce((s, a) => s + a.mrr, 0)} format="currency" />
            <DataTable
              data={filtered.filter((a) => a.country === e.indexValue)}
              columns={[
                { key: "name", header: "Account", sortable: true },
                { key: "industry", header: "Industry", sortable: true },
                { key: "plan", header: "Plan", sortable: true },
                { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
                { key: "status", header: "Status", sortable: true },
              ]}
              title="Accounts"
              pageSize={10}
              dense
              searchable
            />
          </MetricGrid>
        )}
      />
      <DonutChart
        data={data.planDistribution}
        title="Plan Distribution"
        aiContext="Basic is highest volume but Pro is the sweet spot — best retention and growing fastest. Enterprise is small count but huge MRR share. Goal: shift Basic → Pro via feature gating."
        showPercentage
        innerRadius={0.6}
        height={260}
        drillDown={(event) => (
          <MetricGrid>
            <KpiCard title={`${event.label} Accounts`} value={filtered.filter((a) => a.plan === event.id).length} format="number" />
            <KpiCard title="MRR" value={filtered.filter((a) => a.plan === event.id && a.status === "active").reduce((s, a) => s + a.mrr, 0)} format="currency" />
            <KpiCard title="Churn Rate" value={(() => { const planAccts = filtered.filter((a) => a.plan === event.id); const churned = planAccts.filter((a) => a.status === "churned").length; return planAccts.length > 0 ? Math.round((churned / planAccts.length) * 1000) / 10 : 0; })()} format="percent" />
            <DataTable
              data={filtered.filter((a) => a.plan === event.id)}
              columns={[
                { key: "name", header: "Account", sortable: true },
                { key: "industry", header: "Industry", sortable: true },
                { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
                { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" },
                { key: "status", header: "Status", sortable: true },
                { key: "country", header: "Country", sortable: true },
              ]}
              title={`${event.label} Plan Accounts`}
              pageSize={10}
              dense
              searchable
            />
          </MetricGrid>
        )}
      />
      <DonutChart
        data={data.industryDistribution}
        title="Industry Breakdown"
        aiContext="FinTech and HealthTech are largest verticals. FinTech has highest churn but also highest ARPU. E-commerce is newest vertical — early but promising retention."
        showPercentage
        innerRadius={0.6}
        height={260}
        drillDown={(event) => (
          <MetricGrid>
            <KpiCard title={`${event.label} Accounts`} value={filtered.filter((a) => a.industry === event.id).length} format="number" />
            <KpiCard title="MRR" value={filtered.filter((a) => a.industry === event.id && a.status === "active").reduce((s, a) => s + a.mrr, 0)} format="currency" />
            <KpiCard title="Avg Seats" value={(() => { const indAccts = filtered.filter((a) => a.industry === event.id && a.status === "active"); return indAccts.length > 0 ? Math.round(indAccts.reduce((s, a) => s + a.seats, 0) / indAccts.length) : 0; })()} format="number" />
            <DataTable
              data={filtered.filter((a) => a.industry === event.id)}
              columns={[
                { key: "name", header: "Account", sortable: true },
                { key: "plan", header: "Plan", sortable: true },
                { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
                { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" },
                { key: "status", header: "Status", sortable: true },
                { key: "country", header: "Country", sortable: true },
              ]}
              title={`${event.label} Accounts`}
              pageSize={10}
              dense
              searchable
            />
          </MetricGrid>
        )}
      />

      {/* ── Growth ── */}
      <SectionHeader id="growth" title="Growth" subtitle="Signups vs churn trends" />
      <AreaChart
        data={data.growthData}
        index="month"
        categories={["signups", "churned"]}
        title="Signups vs Churn"
        subtitle={compData ? "Current vs comparison period" : "Monthly new signups and churned accounts"}
        aiContext="Net new accounts (signups minus churn) is the key growth indicator. Positive months = healthy. The gap narrowed in mid-2024 due to a competitor launch. Recovered in Q4."
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
        data={data.topAccounts}
        description="Top 20 active accounts ranked by MRR. Click a row to drill into account details."
        aiContext="Top 20 accounts represent ~40% of total MRR. High concentration risk. Top 3 are all Enterprise FinTech. CSM team actively manages accounts over $2K MRR."
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
          { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },
          { key: "seats", header: "Seats", format: "number", sortable: true, align: "right" },
          { key: "country", header: "Country", sortable: true },
        ]}
        title="Top Accounts"
        pageSize={10}
        dense
        drillDownMode="modal"
        drillDown={(row) => (
          <MetricGrid>
            <KpiCard title="MRR" value={row.mrr as number} format="currency" />
            <KpiCard title="Seats" value={row.seats as number} format="number" />
            <KpiCard title="Join Month" value={String(row.joinMonth)} format={{ style: "custom" }} />
            <StatGroup
              stats={[
                { label: "Plan", value: String(row.plan) },
                { label: "Industry", value: String(row.industry) },
                { label: "Country", value: String(row.country) },
                { label: "Status", value: String(row.status) },
              ]}
              dense
            />
          </MetricGrid>
        )}
      />
    </MetricGrid>

      {/* ── AI Insights — floating button + sidebar chat ── */}
      <DashboardInsight />
    </>
  );
}

// ---------------------------------------------------------------------------
// Real LLM via API route — streams from Claude
// ---------------------------------------------------------------------------

async function* analyzeWithClaude(
  messages: { role: string; content: string }[],
): AsyncGenerator<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${err}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

// ---------------------------------------------------------------------------
// Page wrapper — providers + filters
// ---------------------------------------------------------------------------

export default function SaaSDashboard() {
  return (
    <Dashboard
      theme="emerald"
      exportable
      filters={{ defaultPreset: "ytd", referenceDate: new Date(2024, 11, 31) }}
      ai={{
        analyze: analyzeWithClaude as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        stream: true,
        company: "RavenStack is a B2B SaaS selling developer productivity tools. Series B, 500 accounts. Pricing tiers: Basic, Pro, Enterprise.",
        context: "This dashboard tracks subscription metrics. Data covers 2023-2024. 22% overall churn rate. Enterprise accounts are 14% of base but 52% of MRR.",
      }}>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <DashboardHeader
            title="RavenStack Analytics"
            subtitle="SaaS metrics dashboard — powered by 500 generated accounts"
            status="live"
            back={{ href: "/docs/kpi-card" }}
          />
          <DashboardContent />
        </div>
      </div>
    </Dashboard>
  );
}
