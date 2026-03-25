"use client";

import { useState, useMemo } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Funnel } from "@/components/charts/Funnel";
import { DataTable } from "@/components/tables/DataTable";
import { Callout } from "@/components/ui/Callout";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Dashboard } from "@/components/layout/Dashboard";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { FilterBar } from "@/components/filters/FilterBar";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useMetricFilters, useFilterValue } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useDrillDownAction } from "@/components/ui/DrillDown";
import { formatValue } from "@/lib/format";
import {
  dailyMetrics,
  trafficSources,
  topPages,
  devices,
  browsers,
  countries,
  conversionFunnel,
  totals,
} from "@/data/analytics";
import {
  BarChart3,
  Users,
  MousePointerClick,
  Eye,
  TrendingUp,
  Globe,
  Monitor,
  Target,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsDashboard() {
  return (
    <Dashboard
      theme="violet"
      variant="outlined"
      exportable
      filters={{ defaultPreset: "90d", referenceDate: new Date("2025-12-31") }}
    >
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div />
            <ThemeToggle />
          </div>
          <div className="mt-8">
            <DashboardHeader
              title="acme.dev"
              subtitle="Website analytics — Q4 2025"
              status="live"
              back={{ href: "/docs/kpi-card", label: "Docs" }}
              variant="flat"
            />
          </div>
          <AnalyticsContent />
        </div>
      </div>
    </Dashboard>
  );
}

// ---------------------------------------------------------------------------
// Content — reads filters, switches tabs
// ---------------------------------------------------------------------------

function AnalyticsContent() {
  const [tab, setTab] = useState("overview");
  const filters = useMetricFilters();
  const crossFilter = useCrossFilter();
  const openDrill = useDrillDownAction();
  const deviceFilter = useFilterValue("device");

  // Period-filtered daily data
  const filteredDaily = useMemo(() => {
    if (!filters?.period) return dailyMetrics;
    return dailyMetrics.filter((d) => {
      const date = new Date(d.date);
      return date >= filters.period!.start && date <= filters.period!.end;
    });
  }, [filters?.period]);

  // Cross-filter by source
  const activeSource = crossFilter?.selection?.field === "source" ? String(crossFilter.selection.value) : null;

  // Computed totals from filtered data
  const kpis = useMemo(() => {
    const data = filteredDaily;
    return {
      sessions: data.reduce((s, d) => s + d.sessions, 0),
      pageViews: data.reduce((s, d) => s + d.pageViews, 0),
      users: data.reduce((s, d) => s + d.users, 0),
      newUsers: data.reduce((s, d) => s + d.newUsers, 0),
      conversions: data.reduce((s, d) => s + d.conversions, 0),
      revenue: data.reduce((s, d) => s + d.revenue, 0),
      avgBounceRate: data.length > 0 ? Math.round(data.reduce((s, d) => s + d.bounceRate, 0) / data.length * 10) / 10 : 0,
      avgConversionRate: data.length > 0 ? Math.round(data.reduce((s, d) => s + d.conversionRate, 0) / data.length * 10) / 10 : 0,
    };
  }, [filteredDaily]);

  // Sparklines
  const sessionSparkline = useMemo(() => filteredDaily.map((d) => d.sessions), [filteredDaily]);
  const conversionSparkline = useMemo(() => filteredDaily.map((d) => d.conversions), [filteredDaily]);
  const revenueSparkline = useMemo(() => filteredDaily.map((d) => d.revenue), [filteredDaily]);

  // Trend data for area charts
  const trendData = useMemo(() =>
    filteredDaily.map((d) => ({
      date: d.date.slice(5), // "MM-DD"
      sessions: d.sessions,
      pageViews: d.pageViews,
      users: d.users,
    })),
    [filteredDaily],
  );

  const conversionTrendData = useMemo(() =>
    filteredDaily.map((d) => ({
      date: d.date.slice(5),
      conversions: d.conversions,
      revenue: d.revenue,
    })),
    [filteredDaily],
  );

  // Source data for cross-filter
  const sourceChartData = useMemo(() =>
    trafficSources.map((s) => ({
      source: s.source,
      sessions: s.sessions,
      conversions: s.conversions,
    })),
    [],
  );

  return (
    <>
      <FilterBar sticky className="mt-4">
        <FilterBar.Nav>
          <DashboardNav
            tabs={[
              { value: "overview", label: "Overview", icon: <Eye className="h-3.5 w-3.5" />, badge: kpis.sessions },
              { value: "acquisition", label: "Acquisition", icon: <Globe className="h-3.5 w-3.5" /> },
              { value: "engagement", label: "Engagement", icon: <MousePointerClick className="h-3.5 w-3.5" /> },
              { value: "conversions", label: "Conversions", icon: <Target className="h-3.5 w-3.5" />, badge: kpis.conversions },
            ]}
            value={tab}
            onChange={setTab}
          />
        </FilterBar.Nav>
        <FilterBar.Primary>
          <PeriodSelector
            presets={["30d", "90d", "quarter", "ytd"]}
            comparison
          />
          <SegmentToggle
            options={[
              { value: "All", label: "All Devices" },
              { value: "Desktop", label: "Desktop", icon: <Monitor className="h-3.5 w-3.5" /> },
              { value: "Mobile", label: "Mobile" },
            ]}
            defaultValue="All"
            field="device"
          />
        </FilterBar.Primary>
      </FilterBar>

      {/* Status row */}
      <div className="mt-3 flex items-center gap-3">
        <StatusIndicator value={99.8} size="sm" rules={[{ min: 99, color: "emerald", label: "Site Up", pulse: true }]} />
        <StatusIndicator value={kpis.avgBounceRate} size="sm" rules={[
          { max: 40, color: "emerald", label: "Bounce Rate Healthy" },
          { min: 40, max: 55, color: "amber", label: "Bounce Rate Elevated" },
          { min: 55, color: "red", label: "Bounce Rate High" },
        ]} />
      </div>

      <MetricGrid className="mt-6">

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <>
            <KpiCard
              title="Sessions"
              value={kpis.sessions}
              format="compact"
              sparkline={{ data: sessionSparkline, type: "bar" }}
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Users"
              value={kpis.users}
              format="compact"
              icon={<Users className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Page Views"
              value={kpis.pageViews}
              format="compact"
              icon={<Eye className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Bounce Rate"
              value={kpis.avgBounceRate}
              format="percent"
              conditions={[
                { when: "below", value: 40, color: "emerald" },
                { when: "between", min: 40, max: 55, color: "amber" },
                { when: "above", value: 55, color: "red" },
              ]}
              animate={{ countUp: true, delay: 300 }}
            />

            <AreaChart
              data={trendData}
              index="date"
              categories={["sessions", "users"]}
              title="Traffic Trend"
              subtitle="Daily sessions and unique users"
              format="compact"
              height={300}
              curve="monotoneX"
              enableArea
              gradient
              drillDown
            />
            <BarChart
              data={sourceChartData}
              index="source"
              categories={["sessions"]}
              title="Sessions by Source"
              format="compact"
              height={300}
              sort="desc"
              crossFilter
            />

            <Callout
              value={kpis.avgConversionRate}
              rules={[
                { min: 3.5, variant: "success", message: "Conversion rate is strong at {value}% — above the 3.5% target." },
                { min: 2.5, max: 3.5, variant: "info", message: "Conversion rate is {value}% — within normal range." },
                { max: 2.5, variant: "warning", message: "Conversion rate dropped to {value}% — review landing pages." },
              ]}
            />

            <StatGroup
              stats={[
                { label: "New Users", value: kpis.newUsers, format: "compact" },
                { label: "Avg. Session", value: `${Math.floor(totals.avgSessionDuration / 60)}m ${totals.avgSessionDuration % 60}s` },
                { label: "Pages / Session", value: kpis.pageViews > 0 ? Math.round(kpis.pageViews / kpis.sessions * 10) / 10 : 0, format: "number" },
                { label: "Conversions", value: kpis.conversions, format: "compact" },
                { label: "Revenue", value: kpis.revenue, format: "currency" },
              ]}
              dense
            />
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ACQUISITION TAB */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {tab === "acquisition" && (
          <>
            <MetricGrid.Section title="Traffic Sources" subtitle="Where your visitors come from" />
            <BarChart
              data={sourceChartData}
              index="source"
              categories={["sessions", "conversions"]}
              title="Sessions & Conversions by Source"
              format="compact"
              height={320}
              sort="desc"
              layout="horizontal"
              crossFilter={{ field: "source" }}
              drillDown
            />
            <DonutChart
              data={trafficSources.map((s) => ({ source: s.source, sessions: s.sessions }))}
              index="source"
              categories={["sessions"]}
              title="Traffic Share"
              height={320}
              showPercentage
              innerRadius={0.65}
              crossFilter={{ field: "source" }}
            />

            <MetricGrid.Section title="Geography" subtitle="Top countries by sessions" />
            <BarChart
              data={countries.slice(0, 8)}
              index="country"
              categories={["sessions", "conversions"]}
              title="Top Countries"
              format="compact"
              height={320}
              layout="horizontal"
              crossFilter={{ field: "country" }}
              drillDown
            />
            <DataTable
              data={countries}
              columns={[
                { key: "country", header: "Country", sortable: true },
                { key: "sessions", header: "Sessions", format: "compact", sortable: true, align: "right" },
                { key: "users", header: "Users", format: "compact", sortable: true, align: "right" },
                { key: "conversions", header: "Conversions", format: "number", sortable: true, align: "right" },
                { key: "revenue", header: "Revenue", format: "currency", sortable: true, align: "right" },
              ]}
              title="All Countries"
              dense
              searchable
              drillDown={(row) => (
                <MetricGrid>
                  <KpiCard title="Sessions" value={row.sessions as number} format="compact" />
                  <KpiCard title="Users" value={row.users as number} format="compact" />
                  <KpiCard title="Conversions" value={row.conversions as number} format="number" />
                  <KpiCard title="Revenue" value={row.revenue as number} format="currency" />
                </MetricGrid>
              )}
              drillDownMode="modal"
            />
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ENGAGEMENT TAB */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {tab === "engagement" && (
          <>
            <KpiCard
              title="Avg. Bounce Rate"
              value={kpis.avgBounceRate}
              format="percent"
              conditions={[
                { when: "below", value: 40, color: "emerald" },
                { when: "between", min: 40, max: 55, color: "amber" },
                { when: "above", value: 55, color: "red" },
              ]}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Pages / Session"
              value={kpis.pageViews > 0 ? Math.round(kpis.pageViews / kpis.sessions * 10) / 10 : 0}
              format="number"
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Avg. Session Duration"
              value={totals.avgSessionDuration}
              format="duration"
              animate={{ countUp: true, delay: 200 }}
            />

            <MetricGrid.Section title="Top Pages" subtitle="Most viewed pages and their engagement" />
            <DataTable
              data={topPages}
              columns={[
                { key: "page", header: "Page", sortable: true },
                { key: "pageViews", header: "Views", format: "compact", sortable: true, align: "right" },
                { key: "uniqueViews", header: "Unique", format: "compact", sortable: true, align: "right" },
                { key: "avgTimeOnPage", header: "Avg. Time", format: "duration", sortable: true, align: "right" },
                { key: "bounceRate", header: "Bounce", format: "percent", sortable: true, align: "right" },
                { key: "conversions", header: "Conversions", format: "number", sortable: true, align: "right" },
              ]}
              title="Page Performance"
              pageSize={8}
              dense
              multiSort
              searchable
            />

            <MetricGrid.Section title="Technology" subtitle="Devices and browsers" />
            <DonutChart
              data={devices.map((d) => ({ device: d.device, sessions: d.sessions }))}
              index="device"
              categories={["sessions"]}
              title="Device Split"
              height={280}
              showPercentage
              innerRadius={0.65}
              crossFilter={{ field: "device" }}
            />
            <BarChart
              data={browsers}
              index="browser"
              categories={["sessions"]}
              title="Browser Usage"
              format="compact"
              height={280}
              sort="desc"
            />
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* CONVERSIONS TAB */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {tab === "conversions" && (
          <>
            <KpiCard
              title="Conversions"
              value={kpis.conversions}
              format="number"
              sparkline={{ data: conversionSparkline, type: "bar" }}
              icon={<Target className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Conversion Rate"
              value={kpis.avgConversionRate}
              format="percent"
              goal={{ value: 3.5, label: "Q4 Target", showProgress: true, showTarget: true }}
              conditions={[
                { when: "above", value: 3.5, color: "emerald" },
                { when: "between", min: 2.5, max: 3.5, color: "amber" },
                { when: "below", value: 2.5, color: "red" },
              ]}
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Revenue"
              value={kpis.revenue}
              format="currency"
              sparkline={{ data: revenueSparkline, type: "line" }}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 200 }}
            />

            <MetricGrid.Section title="Conversion Funnel" subtitle="From visitor to paying customer" />
            <Funnel
              data={conversionFunnel}
              title="Signup Funnel"
              format="compact"
              height={360}
              showConversionRate
              drillDown
            />

            <AreaChart
              data={conversionTrendData}
              index="date"
              categories={["conversions", "revenue"]}
              title="Conversion Trend"
              subtitle="Daily conversions and revenue"
              format="number"
              height={300}
              curve="monotoneX"
              enableArea
              gradient
            />

            <MetricGrid.Section title="Revenue by Source" />
            <BarChart
              data={trafficSources.map((s) => ({ source: s.source, revenue: s.revenue }))}
              index="source"
              categories={["revenue"]}
              title="Revenue by Traffic Source"
              format="currency"
              height={300}
              sort="desc"
              crossFilter={{ field: "source" }}
              drillDown
            />
          </>
        )}

      </MetricGrid>
    </>
  );
}
