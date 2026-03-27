"use client";

import { KpiCard } from "@/components/cards/KpiCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Waterfall } from "@/components/charts/Waterfall";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { Dashboard } from "@/components/layout/Dashboard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DashboardInsight } from "@/components/ui/DashboardInsight";
import { MetricProvider } from "@/lib/MetricProvider";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { METRICUI_CHART_CODE, METRICUI_CODE } from "@/components/docs/competitor-code";
import { Download, DollarSign, Users, TrendingDown, BarChart3 } from "lucide-react";

// ---------------------------------------------------------------------------
// AI streaming via existing API route (same as demos)
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
// Full 12-month SaaS dataset (same CSV available at /data/saas-metrics.csv)
// ---------------------------------------------------------------------------

const data = [
  { month: "Jan 2024", revenue: 84200, users: 3120, churn: 4.2, conversions: 186, enterprise: 38400, startup: 28600, smb: 17200 },
  { month: "Feb 2024", revenue: 87500, users: 3340, churn: 3.9, conversions: 201, enterprise: 40100, startup: 29200, smb: 18200 },
  { month: "Mar 2024", revenue: 91800, users: 3580, churn: 3.7, conversions: 218, enterprise: 42300, startup: 30100, smb: 19400 },
  { month: "Apr 2024", revenue: 89400, users: 3490, churn: 4.1, conversions: 195, enterprise: 40800, startup: 29800, smb: 18800 },
  { month: "May 2024", revenue: 94200, users: 3720, churn: 3.5, conversions: 229, enterprise: 43600, startup: 30900, smb: 19700 },
  { month: "Jun 2024", revenue: 98100, users: 3890, churn: 3.3, conversions: 241, enterprise: 45200, startup: 32100, smb: 20800 },
  { month: "Jul 2024", revenue: 96500, users: 3810, churn: 3.6, conversions: 232, enterprise: 44100, startup: 31800, smb: 20600 },
  { month: "Aug 2024", revenue: 101400, users: 4050, churn: 3.1, conversions: 258, enterprise: 46800, startup: 33200, smb: 21400 },
  { month: "Sep 2024", revenue: 105800, users: 4280, churn: 2.9, conversions: 272, enterprise: 49100, startup: 34300, smb: 22400 },
  { month: "Oct 2024", revenue: 109200, users: 4460, churn: 2.8, conversions: 289, enterprise: 50800, startup: 35400, smb: 23000 },
  { month: "Nov 2024", revenue: 113500, users: 4690, churn: 2.6, conversions: 301, enterprise: 52900, startup: 36700, smb: 23900 },
  { month: "Dec 2024", revenue: 127450, users: 5120, churn: 2.4, conversions: 342, enterprise: 59400, startup: 41200, smb: 26850 },
];

const latest = data[data.length - 1];
const prev = data[data.length - 2];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ComparisonDemoProps {
  competitorCode?: string;
  competitorName?: string;
  competitorChart?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function countLines(code: string) {
  return code.split("\n").length;
}

export function ComparisonDemo({ competitorCode, competitorName, competitorChart }: ComparisonDemoProps) {
  const competitorLines = competitorCode ? countLines(competitorCode) : 0;
  const metricuiChartLines = countLines(METRICUI_CHART_CODE);
  const metricuiDashLines = countLines(METRICUI_CODE);
  const deltaLines = metricuiDashLines - metricuiChartLines;

  return (
    <div className="mt-10 space-y-12">
      {/* CSV download */}
      <div className="flex justify-end">
        <a
          href="/data/saas-metrics.csv"
          download
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--card-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
        >
          <Download className="h-3 w-3" />
          Download the dataset (CSV)
        </a>
      </div>

      {/* ── Grafana note (no code comparison possible) ── */}
      {!competitorCode && !competitorChart && (
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Grafana is a platform, not a code library — there is no equivalent code snippet to compare.
            Below is what MetricUI renders from a single CSV. No server, no data source
            configuration, no iframe embedding.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  ROUND 1: Chart vs. Chart — apples to apples                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {competitorCode && competitorName && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              Round 1: Chart vs. Chart
            </h3>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              Same data, same chart type. Apples to apples.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-md bg-[var(--card-glow)] px-3 py-1.5 text-[13px] font-mono font-semibold text-[var(--muted)]">
                {competitorName}: {competitorLines} lines
              </span>
              <span className="text-[var(--muted)]">vs</span>
              <span className="rounded-md bg-[var(--accent)]/10 px-3 py-1.5 text-[13px] font-mono font-semibold text-[var(--accent)]">
                MetricUI: {metricuiChartLines} lines
              </span>
            </div>
          </div>

          {/* Competitor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-[var(--card-glow)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                {competitorName}
              </span>
            </div>
            <CodeBlock code={competitorCode} language="tsx" filename={`${competitorName} — stacked area chart`} />
            {competitorChart && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                {competitorChart}
              </div>
            )}
          </div>

          {/* MetricUI chart-only */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
                MetricUI
              </span>
            </div>
            <CodeBlock code={METRICUI_CHART_CODE} language="tsx" filename="MetricUI — stacked area chart" />
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <MetricProvider theme="indigo">
                <AreaChart
                  data={data.map((d) => ({ month: d.month, enterprise: d.enterprise, startup: d.startup, smb: d.smb }))}
                  index="month"
                  categories={["enterprise", "startup", "smb"]}
                  title="Revenue by Segment"
                  format="currency"
                  stacked
                />
              </MetricProvider>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  ROUND 2: Now keep going — full dashboard                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            {competitorCode ? "Round 2: Now keep going" : "What MetricUI builds"}
          </h3>
          <p className="mt-1 text-[13px] text-[var(--muted)]">
            {competitorCode
              ? `With ${competitorName}, you'd need to build everything below from scratch. With MetricUI, add ${deltaLines} more lines and get KPI cards, drill-downs, export, and AI chat.`
              : "A full interactive dashboard from a single CSV — KPI cards, drill-downs, export, and AI chat."}
          </p>
          {competitorCode && (
            <div className="mt-3">
              <span className="rounded-md bg-[var(--accent)]/10 px-3 py-1.5 text-[13px] font-mono font-semibold text-[var(--accent)]">
                +{deltaLines} lines → full production dashboard
              </span>
            </div>
          )}
        </div>

        <CodeBlock code={METRICUI_CODE} language="tsx" filename="MetricUI — full dashboard" />

        {/* The live dashboard */}
        <div className="rounded-xl border-2 border-[var(--accent)]/20 bg-[var(--card-bg)] p-1">
          <div className="rounded-lg bg-[var(--background)] p-4">
            <Dashboard
              theme="indigo"
              exportable
              ai={{
                analyze: analyzeWithClaude as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                stream: true,
                company: "Acme SaaS — B2B analytics platform.",
                context: "2024 SaaS metrics dashboard. Revenue, users, churn, and conversions by segment (Enterprise, Startup, SMB). Data auto-collected from components below.",
              }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--foreground)]">SaaS Metrics</h3>
                <p className="mt-1 text-[13px] text-[var(--muted)]">
                  12-month overview — click any element to drill down
                </p>
              </div>

              <SectionHeader
                title="Key Metrics"
                description="December 2024 vs November. Click any card to drill down."
              />

              <MetricGrid>
                <KpiCard
                  title="Revenue"
                  value={latest.revenue}
                  format="currency"
                  comparison={{ value: prev.revenue, label: "vs Nov" }}
                  sparkline={{ data: data.map((d) => d.revenue), type: "bar" }}
                  icon={<DollarSign className="h-3.5 w-3.5" />}
                  description="Monthly recurring revenue across all segments."
                  drillDown
                />
                <KpiCard
                  title="Active Users"
                  value={latest.users}
                  format="number"
                  comparison={{ value: prev.users, label: "vs Nov" }}
                  sparkline={{ data: data.map((d) => d.users) }}
                  icon={<Users className="h-3.5 w-3.5" />}
                  description="Unique active users this month."
                  drillDown
                />
                <KpiCard
                  title="Churn Rate"
                  value={latest.churn}
                  format="percent"
                  comparison={{ value: prev.churn, invertTrend: true, label: "vs Nov" }}
                  sparkline={{ data: data.map((d) => d.churn) }}
                  icon={<TrendingDown className="h-3.5 w-3.5" />}
                  description="Monthly churn rate. Lower is better."
                  conditions={[
                    { when: "below", value: 3, color: "emerald" },
                    { when: "between", min: 3, max: 4, color: "amber" },
                    { when: "above", value: 4, color: "red" },
                  ]}
                  drillDown
                />
                <KpiCard
                  title="Conversions"
                  value={latest.conversions}
                  format="number"
                  comparison={{ value: prev.conversions, label: "vs Nov" }}
                  sparkline={{ data: data.map((d) => d.conversions), type: "bar" }}
                  icon={<BarChart3 className="h-3.5 w-3.5" />}
                  description="New paid signups this month."
                  drillDown
                />
              </MetricGrid>

              <SectionHeader
                title="Revenue Breakdown"
                description="Click any chart to drill down into the data."
              />

              <MetricGrid>
                <AreaChart
                  data={data}
                  index="month"
                  categories={["enterprise", "startup", "smb"]}
                  title="Revenue by Segment"
                  subtitle="Stacked monthly revenue across Enterprise, Startup, and SMB"
                  format="currency"
                  stacked
                  drillDown
                />
                <DonutChart
                  data={[
                    { id: "enterprise", label: "Enterprise", value: latest.enterprise },
                    { id: "startup", label: "Startup", value: latest.startup },
                    { id: "smb", label: "SMB", value: latest.smb },
                  ]}
                  title="Dec 2024 Mix"
                  subtitle="Click a slice to drill into segment details"
                  format="currency"
                  drillDown
                />
              </MetricGrid>

              <Waterfall
                data={data.map((d, i) => ({
                  label: d.month.split(" ")[0],
                  value: i === 0 ? d.revenue : d.revenue - data[i - 1].revenue,
                }))}
                title="Month-over-Month Revenue Change"
                subtitle="Positive and negative swings with running totals"
                format="currency"
                drillDown
              />

              <DashboardInsight />
            </Dashboard>
          </div>
        </div>

        <p className="text-center text-[12px] text-[var(--muted)]">
          Try it: click any KPI or chart to drill down, hit export, or open the AI chat to ask questions about the data.
        </p>
      </div>
    </div>
  );
}
