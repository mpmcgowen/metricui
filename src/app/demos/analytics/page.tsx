"use client";

import { useState, useMemo } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Funnel } from "@/components/charts/Funnel";
import { BulletChart } from "@/components/charts/BulletChart";
import { DataTable } from "@/components/tables/DataTable";
import { Callout } from "@/components/ui/Callout";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Badge } from "@/components/ui/Badge";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Dashboard } from "@/components/layout/Dashboard";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { FilterBar } from "@/components/filters/FilterBar";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useMetricFilters, useFilterValue, useHasComparison } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useDrillDownAction } from "@/components/ui/DrillDown";
import { formatValue, fmt } from "@/lib/format";
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
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
  Target,
  DollarSign,
  Clock,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { DashboardInsight } from "@/components/ui/DashboardInsight";

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
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsDashboard() {
  return (
    <Dashboard
      theme="violet"
      variant="outlined"
      exportable
      filters={{ defaultPreset: "90d", defaultComparison: "previous", referenceDate: new Date("2025-12-31") }}
      ai={{
        analyze: analyzeWithClaude as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        stream: true,
        context: `B2B SaaS marketing site (acme.dev). Q4 2025. Revenue target: $500K. Series A stage.

DASHBOARD DATA:
Sessions: 191.5K | Users: 144.9K (58% new) | Bounce Rate: 47% | Revenue: $440K

Traffic Sources:
- Organic Search: 82.4K sessions, 3.5% conv, $198.6K revenue, 35% bounce
- Direct: 41.2K sessions, 4.0% conv, $112.4K revenue, 43% bounce
- Social: 28.6K sessions, 2.4% conv, $41.2K revenue, 52% bounce
- Referral: 19.4K sessions, 4.6% conv, $62.1K revenue, 39% bounce
- Email: 15.8K sessions, 7.1% conv, $89.2K revenue, 28% bounce
- Paid Search: 12.2K sessions, 4.3% conv, $35.8K revenue, 45% bounce
- Display: 4.8K sessions, 2.5% conv, $7.4K revenue, 61% bounce

Devices:
- Desktop: 118.4K sessions, 32% bounce, 4.2% conversion
- Mobile: 72.8K sessions, 49% bounce, 1.8% conversion
- Tablet: 13.2K sessions, 41% bounce, 2.9% conversion

Top Pages (by conversions):
- /pricing: 42.1K views, 18% bounce, 2,180 conversions
- /demo: 18.9K views, 12% bounce, 1,640 conversions
- / (homepage): 89.2K views, 38% bounce, 1,240 conversions
- /features: 38.4K views, 24% bounce, 890 conversions
- /contact: 5.4K views, 32% bounce, 380 conversions

Funnel: 204K visitors → 129K engaged (63%) → 42K pricing (33%) → 12.4K signup (30%) → 7.9K converted (64%) → 3.4K paid (43%)

Top Countries: US (82.4K), UK (24.6K), Germany (18.2K), Canada (14.8K), France (12.4K)`,
        tone: "executive",
      }}
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
// Content
// ---------------------------------------------------------------------------

function AnalyticsContent() {
  const [tab, setTab] = useState("overview");
  const filters = useMetricFilters();
  const crossFilter = useCrossFilter();
  const openDrill = useDrillDownAction();
  const hasComparison = useHasComparison();

  // --- Cross-filter state ---
  const activeSource = crossFilter?.selection?.field === "source" ? String(crossFilter.selection.value) : null;
  const activeCountry = crossFilter?.selection?.field === "country" ? String(crossFilter.selection.value) : null;

  // --- Device filter ---
  const deviceFilter = useFilterValue("device");
  const activeDevice = deviceFilter.length > 0 && deviceFilter[0] !== "All" ? deviceFilter[0] : null;

  // --- Period + device filtered daily data ---
  const filteredDaily = useMemo(() => {
    let data = dailyMetrics;
    if (activeDevice) {
      data = data.filter((d) => d.device === activeDevice);
    }
    if (filters?.period) {
      data = data.filter((d) => {
        const date = new Date(d.date);
        return date >= filters.period!.start && date <= filters.period!.end;
      });
    }
    return data;
  }, [filters?.period, activeDevice]);

  // --- Comparison period data (same device filter) ---
  const compDaily = useMemo(() => {
    if (!filters?.comparisonPeriod) return null;
    let data = dailyMetrics;
    if (activeDevice) data = data.filter((d) => d.device === activeDevice);
    return data.filter((d) => {
      const date = new Date(d.date);
      return date >= filters.comparisonPeriod!.start && date <= filters.comparisonPeriod!.end;
    });
  }, [filters?.comparisonPeriod, activeDevice]);

  // --- Source data filtered by cross-filter ---
  const filteredSources = useMemo(() => {
    if (!activeSource) return trafficSources;
    return trafficSources.filter((s) => s.source === activeSource);
  }, [activeSource]);

  // --- Country data filtered by cross-filter ---
  const filteredCountries = useMemo(() => {
    if (!activeCountry) return countries;
    return countries.filter((c) => c.country === activeCountry);
  }, [activeCountry]);

  // --- Computed KPIs (react to cross-filter when a source is selected) ---
  const kpis = useMemo(() => {
    // If a source is cross-filtered, use that source's aggregated stats
    if (activeSource) {
      const src = trafficSources.find((s) => s.source === activeSource);
      if (src) {
        const convRate = src.sessions > 0 ? Math.round(src.conversions / src.sessions * 1000) / 10 : 0;
        return {
          sessions: src.sessions, pageViews: Math.round(src.sessions * 3.2), users: src.users,
          newUsers: src.newUsers, conversions: src.conversions, revenue: src.revenue,
          avgBounce: src.bounceRate, avgConvRate: convRate, avgDuration: 185, pagesPerSession: 3.2,
        };
      }
    }
    const d = filteredDaily;
    const sessions = d.reduce((s, r) => s + r.sessions, 0);
    const pageViews = d.reduce((s, r) => s + r.pageViews, 0);
    const users = d.reduce((s, r) => s + r.users, 0);
    const newUsers = d.reduce((s, r) => s + r.newUsers, 0);
    const conversions = d.reduce((s, r) => s + r.conversions, 0);
    const revenue = d.reduce((s, r) => s + r.revenue, 0);
    const avgBounce = d.length > 0 ? Math.round(d.reduce((s, r) => s + r.bounceRate, 0) / d.length * 10) / 10 : 0;
    const avgConvRate = d.length > 0 ? Math.round(d.reduce((s, r) => s + r.conversionRate, 0) / d.length * 10) / 10 : 0;
    const avgDuration = d.length > 0 ? Math.round(d.reduce((s, r) => s + r.avgSessionDuration, 0) / d.length) : 0;
    const pagesPerSession = sessions > 0 ? Math.round(pageViews / sessions * 10) / 10 : 0;
    return { sessions, pageViews, users, newUsers, conversions, revenue, avgBounce, avgConvRate, avgDuration, pagesPerSession };
  }, [filteredDaily, activeSource]);

  // --- Comparison KPIs (only valid if comparison period has data) ---
  const compKpis = useMemo(() => {
    if (!compDaily || compDaily.length === 0) return null;
    const d = compDaily;
    return {
      sessions: d.reduce((s, r) => s + r.sessions, 0),
      pageViews: d.reduce((s, r) => s + r.pageViews, 0),
      users: d.reduce((s, r) => s + r.users, 0),
      conversions: d.reduce((s, r) => s + r.conversions, 0),
      revenue: d.reduce((s, r) => s + r.revenue, 0),
      avgBounce: d.length > 0 ? Math.round(d.reduce((s, r) => s + r.bounceRate, 0) / d.length * 10) / 10 : 0,
      avgConvRate: d.length > 0 ? Math.round(d.reduce((s, r) => s + r.conversionRate, 0) / d.length * 10) / 10 : 0,
    };
  }, [compDaily]);

  // --- Aggregate by date (sum device rows when "All Devices" selected) ---
  const dailyAgg = useMemo(() => {
    const map = new Map<string, { sessions: number; pageViews: number; users: number; newUsers: number; conversions: number; revenue: number; bounceSum: number; count: number }>();
    for (const d of filteredDaily) {
      const prev = map.get(d.date);
      if (prev) {
        prev.sessions += d.sessions;
        prev.pageViews += d.pageViews;
        prev.users += d.users;
        prev.newUsers += d.newUsers;
        prev.conversions += d.conversions;
        prev.revenue += d.revenue;
        prev.bounceSum += d.bounceRate;
        prev.count++;
      } else {
        map.set(d.date, { sessions: d.sessions, pageViews: d.pageViews, users: d.users, newUsers: d.newUsers, conversions: d.conversions, revenue: d.revenue, bounceSum: d.bounceRate, count: 1 });
      }
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({
      date, sessions: v.sessions, pageViews: v.pageViews, users: v.users, newUsers: v.newUsers,
      conversions: v.conversions, revenue: v.revenue, bounceRate: Math.round(v.bounceSum / v.count * 10) / 10,
    }));
  }, [filteredDaily]);

  // --- Sparklines ---
  const sessionSpark = useMemo(() => dailyAgg.map((d) => d.sessions), [dailyAgg]);
  const userSpark = useMemo(() => dailyAgg.map((d) => d.users), [dailyAgg]);
  const convSpark = useMemo(() => dailyAgg.map((d) => d.conversions), [dailyAgg]);
  const revSpark = useMemo(() => dailyAgg.map((d) => d.revenue), [dailyAgg]);
  const bounceSpark = useMemo(() => dailyAgg.map((d) => d.bounceRate), [dailyAgg]);

  // --- Chart data ---
  const trendData = useMemo(() => dailyAgg.map((d) => ({
    date: d.date.slice(5),
    sessions: d.sessions,
    users: d.users,
    "new users": d.newUsers,
  })), [dailyAgg]);

  const convTrendData = useMemo(() => dailyAgg.map((d) => ({
    date: d.date.slice(5),
    conversions: d.conversions,
    revenue: d.revenue,
  })), [dailyAgg]);

  const sourceData = useMemo(() => trafficSources.map((s) => ({
    source: s.source,
    sessions: s.sessions,
    conversions: s.conversions,
    revenue: s.revenue,
  })), []);

  const sourceOptions = useMemo(() => trafficSources.map((s) => ({
    value: s.source,
    label: s.source,
    count: s.sessions,
  })), []);

  return (
    <>
      {/* ── Sticky FilterBar with embedded nav ── */}
      <FilterBar
        sticky
        badge={<>{formatValue(kpis.sessions, "compact")} sessions</>}
        tags={{ showCrossFilter: true, crossFilterLabels: { source: "Source", country: "Country" } }}
        className="mt-4"
      >
        <FilterBar.Nav>
          <DashboardNav
            tabs={[
              { value: "overview", label: "Overview", icon: <Eye className="h-3.5 w-3.5" /> },
              { value: "acquisition", label: "Acquisition", icon: <Globe className="h-3.5 w-3.5" /> },
              { value: "engagement", label: "Engagement", icon: <MousePointerClick className="h-3.5 w-3.5" /> },
              { value: "conversions", label: "Conversions", icon: <Target className="h-3.5 w-3.5" />, badge: `${formatValue(kpis.conversions, "compact")} conv.` },
            ]}
            value={tab}
            onChange={setTab}
          />
        </FilterBar.Nav>
        <FilterBar.Primary>
          <PeriodSelector presets={["30d", "90d", "quarter", "ytd"]} comparison />
          <SegmentToggle
            options={[
              { value: "All", label: "All Devices" },
              { value: "Desktop", label: "Desktop", icon: <Monitor className="h-3.5 w-3.5" /> },
              { value: "Mobile", label: "Mobile", icon: <Smartphone className="h-3.5 w-3.5" /> },
            ]}
            defaultValue="All"
            field="device"
          />
        </FilterBar.Primary>
      </FilterBar>

      {/* ── Status bar ── */}
      <div className="mt-3 flex items-center gap-3">
        <StatusIndicator value={99.8} size="sm" rules={[{ min: 99, color: "emerald", label: "Site Up", pulse: true }]} />
        <StatusIndicator value={kpis.avgBounce} size="sm" rules={[
          { max: 40, color: "emerald", label: "Bounce Healthy" },
          { min: 40, max: 55, color: "amber", label: "Bounce Elevated" },
          { min: 55, color: "red", label: "Bounce High" },
        ]} />
        <StatusIndicator value={kpis.avgConvRate} size="sm" rules={[
          { min: 3.5, color: "emerald", label: "Conv. On Track" },
          { min: 2.5, max: 3.5, color: "amber", label: "Conv. At Risk" },
          { max: 2.5, color: "red", label: "Conv. Below Target" },
        ]} />
      </div>

      {/* ── AI Insights ── */}
      <DashboardInsight className="mt-4" />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/*  OVERVIEW                                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <MetricGrid className="mt-6">
            {/* ── Hero KPIs ── */}
            <KpiCard
              title="Sessions"
              value={kpis.sessions}
              format="compact"
              comparison={compKpis ? { value: compKpis.sessions, label: "prev period" } : undefined}
              sparkline={{ data: sessionSpark, type: "bar" }}
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              description="Total visits to acme.dev in the selected period. Each session may include multiple page views."
              animate={{ countUp: true }}
              drillDown={{
                label: "Session breakdown",
                onClick: () => openDrill(
                  { title: `${formatValue(kpis.sessions, "compact")} Sessions`, field: "sessions" },
                  <MetricGrid>
                    <KpiCard title="Sessions" value={kpis.sessions} format="compact" />
                    <KpiCard title="Users" value={kpis.users} format="compact" />
                    <KpiCard title="New Users" value={kpis.newUsers} format="compact" />
                    <KpiCard title="Pages / Session" value={kpis.pagesPerSession} format="number" />
                    <AreaChart data={trendData} index="date" categories={["sessions", "users", "new users"]} title="Daily Breakdown" format="compact" height={280} curve="monotoneX" enableArea gradient />
                  </MetricGrid>,
                ),
              }}
            />
            <KpiCard
              title="Users"
              value={kpis.users}
              format="compact"
              comparison={compKpis ? { value: compKpis.users, label: "prev period" } : undefined}
              sparkline={{ data: userSpark, type: "line" }}
              icon={<Users className="h-3.5 w-3.5" />}
              description={({ value }) => `${formatValue(kpis.newUsers, "compact")} new users (${Math.round(kpis.newUsers / kpis.users * 100)}% new). Returning users drive ${Math.round((1 - kpis.newUsers / kpis.users) * 100)}% of traffic.`}
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Bounce Rate"
              value={kpis.avgBounce}
              format="percent"
              sparkline={{ data: bounceSpark, type: "line" }}

              conditions={[
                { when: "below", value: 40, color: "emerald" },
                { when: "between", min: 40, max: 55, color: "amber" },
                { when: "above", value: 55, color: "red" },
              ]}
              description="Percentage of single-page sessions. Lower is better — visitors who bounce didn't engage."
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Revenue"
              value={kpis.revenue}
              format="currency"
              comparison={compKpis ? { value: compKpis.revenue, label: "prev period" } : undefined}
              sparkline={{ data: revSpark, type: "line" }}
              icon={<DollarSign className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 300 }}
            />

            {/* ── Traffic trend — full width ── */}
            <AreaChart
              data={trendData}
              index="date"
              categories={["sessions", "users"]}
              title="Traffic Trend"
              subtitle="Daily sessions and unique users — Q4 2025"
              description="The weekend dips (Sat/Sun) and holiday valley (Dec 23–26) are clearly visible. The overall trendline shows steady 30% QoQ growth."
              format="compact"
              height={320}
              curve="monotoneX"
              enableArea
              gradient
              drillDown
            />

            {/* ── Source breakdown + donut ── */}
            <BarChart
              data={sourceData}
              index="source"
              categories={["sessions"]}
              title="Traffic Sources"
              subtitle="Click a bar to cross-filter the dashboard"
              format="compact"
              height={320}
              sort="desc"
              layout="horizontal"
              crossFilter={{ field: "source" }}
              drillDown={(event) => {
                const src = trafficSources.find((s) => s.source === event.indexValue);
                if (!src) return null;
                return (
                  <MetricGrid>
                    <KpiCard title="Sessions" value={src.sessions} format="compact" />
                    <KpiCard title="Users" value={src.users} format="compact" />
                    <KpiCard title="Bounce Rate" value={src.bounceRate} format="percent" conditions={[
                      { when: "below", value: 40, color: "emerald" },
                      { when: "above", value: 50, color: "red" },
                    ]} />
                    <KpiCard title="Conversions" value={src.conversions} format="number" />
                    <KpiCard title="Revenue" value={src.revenue} format="currency" />
                    <KpiCard title="Conv. Rate" value={src.sessions > 0 ? Math.round(src.conversions / src.sessions * 1000) / 10 : 0} format="percent" />
                  </MetricGrid>
                );
              }}
            />
            <DonutChart
              data={trafficSources.map((s) => ({ source: s.source, sessions: s.sessions }))}
              index="source"
              categories={["sessions"]}
              title="Traffic Share"
              height={320}
              showPercentage
              innerRadius={0.65}
              centerValue={formatValue(kpis.sessions, "compact")}
              centerLabel="total"
              crossFilter={{ field: "source" }}
            />

            {/* ── Insight callout ── */}
            <Callout
              value={kpis.avgConvRate}
              rules={[
                { min: 3.5, variant: "success", message: "Conversion rate is strong at {value}% — above the 3.5% Q4 target. Organic search drives 37% of conversions." },
                { min: 2.5, max: 3.5, variant: "info", message: "Conversion rate at {value}% — within normal range but below the 3.5% Q4 target." },
                { max: 2.5, variant: "warning", message: "Conversion rate dropped to {value}% — significantly below the 3.5% target. Review landing page performance." },
              ]}
            />

            {/* ── Quick stats ── */}
            <StatGroup
              stats={[
                { label: "New Users", value: kpis.newUsers, format: "compact", icon: <ArrowUpRight className="h-3 w-3" /> },
                { label: "Avg. Session", value: kpis.avgDuration, format: "duration", icon: <Clock className="h-3 w-3" /> },
                { label: "Pages / Session", value: kpis.pagesPerSession, format: "number" },
                { label: "Conversions", value: kpis.conversions, format: "compact", icon: <Target className="h-3 w-3" /> },
                { label: "Conv. Rate", value: kpis.avgConvRate, format: "percent" },
              ]}
              dense
            />
        </MetricGrid>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/*  ACQUISITION                                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === "acquisition" && (
        <MetricGrid className="mt-6">
            {/* ── Source KPIs ── */}
            <KpiCard title="Organic Search" value={82400} format="compact" description="40% of all traffic. Highest conversion rate at 3.5%." icon={<Search className="h-3.5 w-3.5" />} />
            <KpiCard title="Direct" value={41200} format="compact" description="Brand-aware visitors. 20% of traffic, strong return rate." />
            <KpiCard title="Email" value={15800} format="compact" description="Lowest bounce rate (28%). Best engagement per session." />
            <KpiCard title="Paid Search" value={12200} format="compact" description="$35.8K revenue from $12.2K sessions. $2.93 CPA." conditions={[{ when: "above", value: 10000, color: "emerald" }]} />

            <MetricGrid.Section title="Traffic Sources" subtitle="Click a source to cross-filter — all charts respond" />
            <BarChart
              data={sourceData}
              index="source"
              categories={["sessions", "conversions"]}
              title="Sessions & Conversions by Source"
              format="compact"
              height={340}
              sort="desc"
              layout="horizontal"
              crossFilter={{ field: "source" }}
              drillDown
            />
            <DonutChart
              data={trafficSources.map((s) => ({ source: s.source, revenue: s.revenue }))}
              index="source"
              categories={["revenue"]}
              title="Revenue by Source"
              subtitle="Email punches above its weight — 17% of revenue from 8% of traffic"
              height={340}
              showPercentage
              innerRadius={0.65}
              centerValue={formatValue(kpis.revenue, fmt("currency", { compact: true }))}
              centerLabel="total"
              crossFilter={{ field: "source" }}
            />

            <MetricGrid.Section title="Geography" subtitle="Top countries by sessions" />
            <BarChart
              data={countries.slice(0, 8)}
              index="country"
              categories={["sessions", "conversions"]}
              title="Top Countries"
              format="compact"
              height={340}
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
                { key: "conversions", header: "Conv.", format: "number", sortable: true, align: "right" },
                { key: "revenue", header: "Revenue", format: "currency", sortable: true, align: "right" },
              ]}
              title="All Countries"
              subtitle="Click a row to drill into country detail"
              dense
              searchable
              multiSort
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

            {/* Source performance table */}
            <DataTable
              data={trafficSources}
              columns={[
                { key: "source", header: "Source", sortable: true },
                { key: "sessions", header: "Sessions", format: "compact", sortable: true, align: "right" },
                { key: "users", header: "Users", format: "compact", sortable: true, align: "right" },
                { key: "newUsers", header: "New Users", format: "compact", sortable: true, align: "right" },
                { key: "bounceRate", header: "Bounce", format: "percent", sortable: true, align: "right" },
                { key: "conversions", header: "Conv.", format: "number", sortable: true, align: "right" },
                { key: "revenue", header: "Revenue", format: "currency", sortable: true, align: "right" },
              ]}
              title="Source Performance"
              dense
              multiSort
            />
        </MetricGrid>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/*  ENGAGEMENT                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === "engagement" && (
        <MetricGrid className="mt-6">
            {/* ── Engagement KPIs ── */}
            <KpiCard
              title="Bounce Rate"
              value={kpis.avgBounce}
              format="percent"
              comparison={compKpis ? { value: compKpis.avgBounce } : undefined}
              sparkline={{ data: bounceSpark, type: "line" }}

              conditions={[
                { when: "below", value: 40, color: "emerald" },
                { when: "between", min: 40, max: 55, color: "amber" },
                { when: "above", value: 55, color: "red" },
              ]}
              description="Single-page session rate. Target: below 40%."
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Pages / Session"
              value={kpis.pagesPerSession}
              format="number"
              description="Average depth of a visit. Higher means more engaged users exploring the site."
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Avg. Session Duration"
              value={kpis.avgDuration}
              format="duration"
              icon={<Clock className="h-3.5 w-3.5" />}
              description="Mean time on site per session. Excludes bounced sessions."
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Page Views"
              value={kpis.pageViews}
              format="compact"
              comparison={compKpis ? { value: compKpis.pageViews, label: "prev period" } : undefined}
              icon={<Eye className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 300 }}
            />

            {/* ── Top pages table ── */}
            <MetricGrid.Section title="Top Pages" subtitle="Most viewed pages — sorted by views" />
            <DataTable
              data={topPages}
              columns={[
                { key: "page", header: "Page", sortable: true },
                { key: "pageViews", header: "Views", format: "compact", sortable: true, align: "right" },
                { key: "uniqueViews", header: "Unique", format: "compact", sortable: true, align: "right" },
                { key: "avgTimeOnPage", header: "Avg. Time", format: "duration", sortable: true, align: "right" },
                { key: "bounceRate", header: "Bounce %", format: "percent", sortable: true, align: "right" },
                { key: "exitRate", header: "Exit %", format: "percent", sortable: true, align: "right" },
                { key: "conversions", header: "Conv.", format: "number", sortable: true, align: "right" },
              ]}
              title="Page Performance"
              subtitle="/pricing has the lowest bounce (18%) and highest conversions. /demo converts 8.7% of visitors."
              pageSize={8}
              dense
              multiSort
              searchable
            />

            {/* ── Devices & browsers ── */}
            <MetricGrid.Section title="Technology" subtitle="Device and browser breakdown" />
            <DonutChart
              data={devices.map((d) => ({ device: d.device, sessions: d.sessions }))}
              index="device"
              categories={["sessions"]}
              title="Device Split"
              subtitle="Desktop dominates but mobile is 36% of traffic"
              height={300}
              showPercentage
              innerRadius={0.65}
              centerValue={formatValue(kpis.sessions, "compact")}
              centerLabel="sessions"
              crossFilter={{ field: "device" }}
            />
            <BarChart
              data={browsers}
              index="browser"
              categories={["sessions"]}
              title="Browser Usage"
              subtitle="Chrome at 53%, Safari at 21%"
              format="compact"
              height={300}
              sort="desc"
              drillDown
            />

            <Callout
              value={kpis.avgBounce}
              rules={[
                { max: 40, variant: "success", message: "Bounce rate at {value}% is healthy. Visitors are engaging with content across multiple pages." },
                { min: 40, max: 55, variant: "warning", message: "Bounce rate at {value}% is elevated. Consider improving above-the-fold content on high-traffic landing pages." },
                { min: 55, variant: "warning", message: "Bounce rate at {value}% is critical. Audit top entry pages for load speed, relevance, and mobile experience." },
              ]}
            />
        </MetricGrid>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/*  CONVERSIONS                                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === "conversions" && (
        <MetricGrid className="mt-6">
            {/* ── Conversion KPIs ── */}
            <KpiCard
              title="Conversions"
              value={kpis.conversions}
              format="number"
              comparison={compKpis ? { value: compKpis.conversions, label: "prev period" } : undefined}
              sparkline={{ data: convSpark, type: "bar" }}
              icon={<Target className="h-3.5 w-3.5" />}
              description={`${formatValue(kpis.conversions, "number")} completed signups from ${formatValue(kpis.sessions, "compact")} sessions.`}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Conversion Rate"
              value={kpis.avgConvRate}
              format="percent"
              comparison={compKpis ? { value: compKpis.avgConvRate } : undefined}
              goal={{ value: 3.5, label: "Q4 Target", showProgress: true, showTarget: true, showRemaining: true }}
              conditions={[
                { when: "above", value: 3.5, color: "emerald" },
                { when: "between", min: 2.5, max: 3.5, color: "amber" },
                { when: "below", value: 2.5, color: "red" },
              ]}
              description="Percentage of sessions that complete signup. Q4 target is 3.5%."
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Revenue"
              value={kpis.revenue}
              format="currency"
              comparison={compKpis ? { value: compKpis.revenue, label: "prev period" } : undefined}
              sparkline={{ data: revSpark, type: "line" }}
              icon={<DollarSign className="h-3.5 w-3.5" />}
              description={`Avg. revenue per conversion: ${formatValue(kpis.conversions > 0 ? Math.round(kpis.revenue / kpis.conversions) : 0, "currency")}`}
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Revenue / Session"
              value={kpis.sessions > 0 ? Math.round(kpis.revenue / kpis.sessions * 100) / 100 : 0}
              format="currency"
              description="Average revenue generated per session across all traffic sources."
              animate={{ countUp: true, delay: 300 }}
            />

            {/* ── Funnel ── */}
            <MetricGrid.Section
              title="Conversion Funnel"
              subtitle="From first visit to first payment"
              badge={<Badge size="sm" color="violet">{Math.round(conversionFunnel[5].value / conversionFunnel[0].value * 1000) / 10}% end-to-end</Badge>}
            />
            <Funnel
              data={conversionFunnel}
              title="Signup Funnel"
              subtitle="Biggest drop-off: Engaged → Pricing (67% lost). Pricing → Signup converts at 29%."
              format="compact"
              height={380}
              showConversionRate
              drillDown
            />

            {/* ── Conversion trend ── */}
            <AreaChart
              data={convTrendData}
              index="date"
              categories={[{ key: "conversions", label: "Conversions" }, { key: "revenue", label: "Revenue", axis: "right" }]}
              title="Conversion & Revenue Trend"
              subtitle="Daily conversions (left axis) and revenue (right axis)"
              format="number"
              height={320}
              curve="monotoneX"
              enableArea
              gradient
              drillDown
            />

            {/* ── Revenue by source ── */}
            <MetricGrid.Section title="Revenue by Source" subtitle="Which channels drive the most revenue?" />
            <BarChart
              data={sourceData}
              index="source"
              categories={["revenue"]}
              title="Revenue by Traffic Source"
              subtitle="Organic search drives $199K (37%) — email at $89K has the best ROI"
              format="currency"
              height={320}
              sort="desc"
              crossFilter={{ field: "source" }}
              drillDown
            />
            <DataTable
              data={trafficSources.map((s) => ({
                source: s.source,
                sessions: s.sessions,
                conversions: s.conversions,
                revenue: s.revenue,
                convRate: s.sessions > 0 ? Math.round(s.conversions / s.sessions * 1000) / 10 : 0,
                revenuePerSession: s.sessions > 0 ? Math.round(s.revenue / s.sessions * 100) / 100 : 0,
              }))}
              columns={[
                { key: "source", header: "Source", sortable: true },
                { key: "sessions", header: "Sessions", format: "compact", sortable: true, align: "right" },
                { key: "conversions", header: "Conv.", format: "number", sortable: true, align: "right" },
                { key: "convRate", header: "Conv. %", format: "percent", sortable: true, align: "right" },
                { key: "revenue", header: "Revenue", format: "currency", sortable: true, align: "right" },
                { key: "revenuePerSession", header: "Rev/Session", format: "currency", sortable: true, align: "right" },
              ]}
              title="Source Conversion Detail"
              dense
              multiSort
            />

            <Callout
              value={kpis.avgConvRate}
              rules={[
                { min: 3.5, variant: "success", message: "Q4 conversion target of 3.5% achieved at {value}%. Revenue on track at " + formatValue(kpis.revenue, "currency") + ". Focus on scaling paid channels." },
                { min: 2.5, max: 3.5, variant: "warning", message: "Conversion rate at {value}% — below the 3.5% Q4 target. The pricing page converts well (29% → signup) but top-of-funnel engagement is weak." },
                { max: 2.5, variant: "warning", message: "Conversion rate at {value}% is critical. Recommend A/B testing the pricing page layout and adding social proof to high-traffic landing pages." },
              ]}
            />
        </MetricGrid>
      )}
    </>
  );
}
