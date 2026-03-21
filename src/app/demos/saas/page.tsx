"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Funnel } from "@/components/charts/Funnel";
import { Gauge } from "@/components/charts/Gauge";
import { BulletChart } from "@/components/charts/BulletChart";
import { Waterfall } from "@/components/charts/Waterfall";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { FilterTags } from "@/components/filters/FilterTags";
import { FilterProvider } from "@/lib/FilterContext";
import { fmt } from "@/lib/format";
import {
  kpis,
  mrrByMonth,
  mrrSparkline,
  churnByMonth,
  planDistribution,
  industryDistribution,
  countryDistribution,
  churnReasons,
  topFeatures,
  revenueWaterfall,
  conversionFunnel,
  okrScorecard,
  topAccounts,
  signupsByMonth,
} from "@/data/saas";
import {
  DollarSign,
  Users,
  TrendingDown,
  BarChart3,
  Target,
  Activity,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data transforms
// ---------------------------------------------------------------------------

const mrrAreaData = [
  {
    id: "MRR",
    data: mrrByMonth.map((m) => ({ x: m.month, y: m.mrr })),
  },
];

const signupsAreaData = [
  {
    id: "Signups",
    data: signupsByMonth.map((m) => ({ x: m.month, y: m.signups })),
  },
];

const churnAreaData = [
  {
    id: "Churned",
    data: churnByMonth.map((m) => ({ x: m.month, y: m.churned })),
  },
];

const churnSparkline = churnByMonth.map((m) => m.churned);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SaaSDashboard() {
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);

  // Filter top accounts by industry
  const filteredAccounts = useMemo(() => {
    if (industryFilter.length === 0) return topAccounts;
    return topAccounts.filter((a) => industryFilter.includes(a.industry));
  }, [industryFilter]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <FilterProvider defaultPreset="ytd">

          <DashboardHeader
            title="RavenStack Analytics"
            subtitle="SaaS metrics dashboard — powered by real Kaggle data"
            status="live"
            back={{ href: "/docs/kpi-card" }}
          />

          {/* ── Filters ── */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <PeriodSelector
              presets={["30d", "90d", "quarter", "ytd", "year"]}
              comparison
            />
            <DropdownFilter
              label="Industry"
              options={industryDistribution.map((i) => ({
                value: i.label,
                label: i.label,
                count: i.value,
              }))}
              multiple
              value={industryFilter}
              onChange={(v) => setIndustryFilter(v as string[])}
            />
            <FilterTags />
          </div>

          {/* ── Dashboard Content ── */}
          <MetricGrid className="mt-6">

            {/* ── Overview ── */}
            <MetricGrid.Section title="Overview" subtitle="Key metrics this period" />
            <KpiCard
              title="Monthly Recurring Revenue"
              value={kpis.mrr}
              format="currency"
              comparison={{ value: kpis.prevMrr }}
              comparisonLabel="vs previous period"
              sparkline={{ data: mrrSparkline, type: "line" }}
              icon={<DollarSign className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Annual Run Rate"
              value={kpis.arr}
              format={fmt("currency", { compact: true })}
              comparison={{ value: kpis.prevArr }}
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 100 }}
            />
            <KpiCard
              title="Active Accounts"
              value={kpis.activeAccounts}
              format="number"
              comparison={{ value: kpis.prevActiveAccounts }}
              icon={<Users className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 200 }}
            />
            <KpiCard
              title="Churn Rate"
              value={kpis.churnRate}
              format="percent"
              comparison={{ value: kpis.prevChurnRate, invertTrend: true }}
              sparkline={{ data: churnSparkline, type: "bar" }}
              icon={<TrendingDown className="h-3.5 w-3.5" />}
              animate={{ countUp: true, delay: 300 }}
              conditions={[
                { when: "below", value: 15, color: "emerald" },
                { when: "between", min: 15, max: 25, color: "amber" },
                { when: "above", value: 25, color: "red" },
              ]}
            />

            <StatGroup
              stats={[
                { label: "Avg MRR / Account", value: kpis.avgMrr, format: "currency" },
                { label: "Total Seats", value: kpis.totalSeats, format: "compact" },
                { label: "Upgrades", value: kpis.upgrades, icon: <Activity className="h-3 w-3" /> },
                { label: "Downgrades", value: kpis.downgrades },
              ]}
            />

            {/* ── Churn callout ── */}
            <Callout
              value={kpis.churnRate}
              rules={[
                { max: 15, variant: "success", title: "Churn is healthy", message: "At {value}%, churn is below the 15% target." },
                { max: 25, variant: "warning", title: "Churn rate elevated", message: "At {value}%, churn is above the 15% target. Review retention strategies." },
                { variant: "error", title: "Churn is critical", message: "At {value}%, churn requires immediate action." },
              ]}
              metric={{ value: kpis.churned, format: "number", label: "accounts lost" }}
              dismissible
              dense
            />

            {/* ── Revenue ── */}
            <MetricGrid.Section title="Revenue" subtitle="MRR trends and revenue bridge" />
            <AreaChart
              data={mrrAreaData}
              title="MRR Over Time"
              subtitle="Monthly recurring revenue — 24 months"
              format="currency"
              height={300}
              enableArea
              gradient
            />
            <Waterfall
              data={revenueWaterfall}
              title="Revenue Bridge"
              subtitle="MRR movement this period"
              format={fmt("currency", { compact: true })}
              height={300}
            />

            {/* ── Conversion & Retention ── */}
            <MetricGrid.Section title="Conversion & Retention" />
            <Funnel
              data={conversionFunnel}
              title="Conversion Funnel"
              subtitle="Signup → Retained pipeline"
              format="number"
              showConversionRate
              height={280}
            />
            <DonutChart
              data={churnReasons}
              title="Churn Reasons"
              subtitle="Why customers leave"
              showPercentage
              innerRadius={0.6}
              centerValue={String(kpis.churned)}
              centerLabel="churned"
              height={280}
            />
            <Gauge
              value={kpis.churnRate}
              max={40}
              title="Churn Gauge"
              format="percent"
              thresholds={[
                { value: 15, color: "emerald" },
                { value: 25, color: "amber" },
                { value: 40, color: "red" },
              ]}
            />

            {/* ── Customers ── */}
            <MetricGrid.Section title="Customers" subtitle="Account distribution and growth" />
            <BarChart
              data={countryDistribution}
              keys={["accounts"]}
              indexBy="country"
              title="Accounts by Country"
              format="number"
              height={260}
              sort="desc"
              layout="horizontal"
            />
            <DonutChart
              data={planDistribution}
              title="Plan Distribution"
              showPercentage
              innerRadius={0.6}
              height={260}
            />
            <DonutChart
              data={industryDistribution}
              title="Industry Breakdown"
              showPercentage
              innerRadius={0.6}
              height={260}
            />

            {/* ── Product Usage ── */}
            <MetricGrid.Section title="Product Usage" subtitle="Feature adoption and engagement" />
            <BarChart
              data={topFeatures}
              keys={["usage"]}
              indexBy="feature"
              title="Top Features by Usage"
              subtitle="Aggregated usage count"
              format="compact"
              height={300}
              sort="desc"
              layout="horizontal"
            />

            {/* ── OKR Scorecard ── */}
            <MetricGrid.Section
              title="OKR Scorecard"
              subtitle="Progress against quarterly targets"
              badge={<Badge size="sm" variant="outline" color="amber">Q1 2025</Badge>}
            />
            <BulletChart
              simpleData={okrScorecard}
              title="Quarterly Goals"
              format="compact"
            />

            {/* ── Growth ── */}
            <MetricGrid.Section title="Growth" subtitle="Signup trends" />
            <AreaChart
              data={signupsAreaData}
              title="Signups Over Time"
              format="number"
              height={240}
              enableArea
              gradient
            />
            <AreaChart
              data={churnAreaData}
              title="Churn Events Over Time"
              format="number"
              height={240}
              colors={["#EF4444"]}
              enableArea
              gradient
            />

            {/* ── Top Accounts ── */}
            <MetricGrid.Section
              title="Top Accounts"
              subtitle={industryFilter.length > 0 ? `Filtered by: ${industryFilter.join(", ")}` : "By MRR"}
            />
            <DataTable
              data={filteredAccounts}
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
              title="Top 20 Accounts"
              pageSize={10}
              dense
            />

          </MetricGrid>
        </FilterProvider>
      </div>
    </div>
  );
}
