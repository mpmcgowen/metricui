/**
 * MetricUI MCP Server — Common Usage Patterns
 *
 * Ready-to-use code patterns covering the most common dashboard scenarios.
 */

export interface Pattern {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  code: string;
}

export const PATTERNS: Pattern[] = [
  // =========================================================================
  // 1. Basic Dashboard Layout
  // =========================================================================
  {
    name: "Basic Dashboard",
    slug: "basic-dashboard",
    description: "A complete dashboard with KPI row, charts, and a data table.",
    tags: ["dashboard", "layout", "kpi", "chart", "table", "getting-started"],
    code: `import {
  MetricProvider,
  KpiCard,
  StatGroup,
  AreaChart,
  BarChart,
  DataTable,
} from "metricui";

function Dashboard() {
  return (
    <MetricProvider locale="en-US" currency="USD">
      <div className="space-y-6 p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Revenue" value={142300} format="currency"
            comparison={{ value: 128500, label: "vs last month" }} />
          <KpiCard title="Users" value={12450} format="compact"
            comparison={{ value: 11200 }} />
          <KpiCard title="Conversion" value={4.2} format="percent"
            comparison={{ value: 3.8 }} />
          <KpiCard title="Churn" value={2.1} format="percent"
            comparison={{ value: 2.8, invertTrend: true }} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AreaChart
            data={revenueTimeSeries}
            format="currency"
            title="Revenue Over Time"
          />
          <BarChart
            data={salesByCategory}
            keys={["sales"]}
            indexBy="category"
            format="currency"
            title="Sales by Category"
          />
        </div>

        {/* Table */}
        <DataTable
          data={transactions}
          columns={[
            { key: "date", header: "Date", sortable: true },
            { key: "customer", header: "Customer", sortable: true },
            { key: "amount", header: "Amount", format: "currency", sortable: true },
            { key: "status", header: "Status" },
          ]}
          pageSize={10}
          searchable
          title="Recent Transactions"
        />
      </div>
    </MetricProvider>
  );
}`,
  },

  // =========================================================================
  // 2. KPI Card with All Features
  // =========================================================================
  {
    name: "KPI Card with All Features",
    slug: "kpi-all-features",
    description: "A KpiCard showcasing comparison, sparkline, goal, conditions, copy, and drill-down.",
    tags: ["kpi", "comparison", "sparkline", "goal", "conditional", "copyable", "drilldown"],
    code: `<KpiCard
  title="Monthly Revenue"
  value={142300}
  format="currency"
  comparison={[
    { value: 128500, label: "vs last month" },
    { value: 110000, label: "vs last year", mode: "both" },
  ]}
  sparkline={{
    data: [98, 105, 110, 108, 120, 135, 142],
    previousPeriod: [90, 92, 95, 100, 98, 105, 110],
    type: "line",
    interactive: true,
  }}
  goal={{ value: 150000, showTarget: true, showRemaining: true }}
  conditions={[
    { when: "above", value: 140000, color: "emerald" },
    { when: "between", min: 100000, max: 140000, color: "amber" },
    { when: "below", value: 100000, color: "red" },
  ]}
  copyable
  onCopy={(v) => console.log("Copied:", v)}
  drillDown={{ label: "View breakdown", onClick: () => router.push("/revenue") }}
  animate={{ countUp: true, duration: 1200 }}
  description="Total revenue from all channels including recurring and one-time."
  footnote="Updated 5 minutes ago"
/>`,
  },

  // =========================================================================
  // 3. Time Series with Comparison
  // =========================================================================
  {
    name: "Time Series with Comparison",
    slug: "time-series-comparison",
    description: "AreaChart with previous period overlay and dual Y-axis.",
    tags: ["area-chart", "time-series", "comparison", "dual-axis"],
    code: `<AreaChart
  data={[
    { id: "Revenue", data: thisMonth.map(d => ({ x: d.date, y: d.revenue })) },
  ]}
  comparisonData={[
    { id: "Revenue", data: lastMonth.map(d => ({ x: d.date, y: d.revenue })) },
  ]}
  format="currency"
  title="Revenue Trend"
  subtitle="Current vs Previous Period"
  xAxisLabel="Date"
  yAxisLabel="Revenue"
  referenceLines={[
    { axis: "y", value: targetRevenue, label: "Target", color: "#10B981", style: "dashed" },
  ]}
  thresholds={[
    { from: 0, to: dangerThreshold, color: "#EF4444", opacity: 0.05, label: "Below target" },
  ]}
/>`,
  },

  // =========================================================================
  // 4. Bar Chart Presets
  // =========================================================================
  {
    name: "Bar Chart Presets",
    slug: "bar-chart-presets",
    description: "Examples of all BarChart presets: grouped, stacked, percent, horizontal.",
    tags: ["bar-chart", "presets", "grouped", "stacked", "percent", "horizontal"],
    code: `{/* Grouped comparison */}
<BarChart
  preset="grouped"
  data={monthlyData}
  keys={["revenue", "expenses"]}
  indexBy="month"
  format="currency"
  title="Revenue vs Expenses"
  legend
/>

{/* 100% stacked composition */}
<BarChart
  preset="percent"
  data={channelData}
  keys={["organic", "paid", "referral"]}
  indexBy="month"
  title="Channel Mix"
  legend
/>

{/* Horizontal sorted */}
<BarChart
  preset="horizontal"
  data={salesByRep}
  keys={["sales"]}
  indexBy="rep"
  sort="desc"
  format="currency"
  title="Sales Leaderboard"
/>

{/* With targets and negative values */}
<BarChart
  data={profitData}
  keys={["profit"]}
  indexBy="quarter"
  format="currency"
  enableNegative
  negativeColor="#EF4444"
  targetData={targetProfitData}
  referenceLines={[{ axis: "y", value: 0, style: "solid", color: "var(--muted)" }]}
  title="Quarterly Profit"
/>`,
  },

  // =========================================================================
  // 5. Data Fetching States
  // =========================================================================
  {
    name: "Data Fetching States",
    slug: "data-fetching-states",
    description: "How to handle loading, empty, error, and stale states across components.",
    tags: ["loading", "empty", "error", "stale", "data-states", "skeleton"],
    code: `function MetricCard({ data, isLoading, error }) {
  return (
    <KpiCard
      title="Revenue"
      value={data?.revenue ?? null}
      format="currency"
      loading={isLoading}
      error={error ? {
        message: "Failed to load revenue data",
        retry: () => refetch(),
      } : undefined}
      empty={!isLoading && !error && data?.revenue == null ? {
        message: "No revenue data for this period",
        icon: <TrendingUp className="h-8 w-8" />,
        action: <button onClick={selectPeriod}>Change period</button>,
      } : undefined}
      stale={data?.updatedAt ? {
        since: new Date(data.updatedAt),
        warningAfter: 30, // minutes
      } : undefined}
    />
  );
}

{/* Or using the grouped state prop */}
<KpiCard
  title="Revenue"
  value={data?.revenue ?? null}
  format="currency"
  state={{
    loading: isLoading,
    error: error ? { message: error.message, retry: refetch } : undefined,
    stale: { since: lastUpdated, warningAfter: 30 },
  }}
/>

{/* Charts and tables have the same props */}
<AreaChart
  data={chartData ?? []}
  loading={isLoading}
  error={error ? { message: "Chart data unavailable", retry: refetch } : undefined}
  empty={!chartData?.length ? { message: "No data points" } : undefined}
/>

<DataTable
  data={tableData ?? []}
  loading={isLoading}
  error={error ? { message: error.message } : undefined}
/>`,
  },

  // =========================================================================
  // 6. Conditional Formatting
  // =========================================================================
  {
    name: "Conditional Formatting",
    slug: "conditional-formatting",
    description: "KpiCard with simple and compound conditional formatting rules.",
    tags: ["conditions", "conditional", "color", "threshold", "formatting"],
    code: `{/* Simple threshold coloring */}
<KpiCard
  title="Server Uptime"
  value={99.2}
  format="percent"
  conditions={[
    { when: "above", value: 99.9, color: "emerald" },
    { when: "between", min: 99, max: 99.9, color: "amber" },
    { when: "below", value: 99, color: "red" },
  ]}
/>

{/* Custom CSS colors */}
<KpiCard
  title="Score"
  value={78}
  conditions={[
    { when: "above", value: 90, color: "#22C55E" },
    { when: "between", min: 70, max: 90, color: "#F59E0B" },
    { when: "below", value: 70, color: "#EF4444" },
  ]}
/>

{/* Compound conditions with AND */}
<KpiCard
  title="Health Score"
  value={currentScore}
  conditions={[
    {
      when: "and",
      rules: [
        { operator: "above", value: 80 },
        { operator: "below", value: 100 },
      ],
      color: "emerald",
    },
    {
      when: "or",
      rules: [
        { operator: "below", value: 20 },
        { operator: "equals", value: 0 },
      ],
      color: "red",
    },
  ]}
/>

{/* Inverted trend (lower is better) */}
<KpiCard
  title="Error Rate"
  value={0.5}
  format="percent"
  comparison={{ value: 1.2, invertTrend: true }}
  conditions={[
    { when: "below", value: 1, color: "emerald" },
    { when: "between", min: 1, max: 5, color: "amber" },
    { when: "above", value: 5, color: "red" },
  ]}
/>`,
  },

  // =========================================================================
  // 7. Simple Donut
  // =========================================================================
  {
    name: "Simple Donut Chart",
    slug: "simple-donut",
    description: "DonutChart with center content, percentages, and the simpleData shorthand.",
    tags: ["donut", "pie", "composition", "percentage", "center"],
    code: `{/* Full data format */}
<DonutChart
  data={[
    { id: "chrome", label: "Chrome", value: 45 },
    { id: "firefox", label: "Firefox", value: 25 },
    { id: "safari", label: "Safari", value: 20 },
    { id: "edge", label: "Edge", value: 10 },
  ]}
  centerValue="100K"
  centerLabel="Total Users"
  showPercentage
  enableArcLabels
  title="Browser Share"
/>

{/* simpleData shorthand — no ids or labels needed */}
<DonutChart
  simpleData={{ Desktop: 60, Mobile: 35, Tablet: 5 }}
  showPercentage
  title="Traffic by Device"
/>

{/* Half donut (gauge style) */}
<DonutChart
  data={[
    { id: "completed", label: "Completed", value: 78 },
    { id: "remaining", label: "Remaining", value: 22 },
  ]}
  startAngle={-90}
  endAngle={90}
  innerRadius={0.7}
  centerValue="78%"
  centerLabel="Complete"
  sortSlices="none"
  colors={["#10B981", "#E2E8F0"]}
/>`,
  },

  // =========================================================================
  // 8. Dual Axis (BarLineChart)
  // =========================================================================
  {
    name: "Dual Axis Combo Chart",
    slug: "dual-axis",
    description: "BarLineChart showing bars + lines on separate Y-axes.",
    tags: ["dual-axis", "combo", "bar-line", "two-scales"],
    code: `<BarLineChart
  barData={[
    { month: "Jan", revenue: 42000, expenses: 28000 },
    { month: "Feb", revenue: 45000, expenses: 26000 },
    { month: "Mar", revenue: 52000, expenses: 31000 },
    { month: "Apr", revenue: 48000, expenses: 29000 },
  ]}
  barKeys={["revenue", "expenses"]}
  indexBy="month"
  lineData={[
    { id: "Margin %", data: [
      { x: "Jan", y: 33.3 },
      { x: "Feb", y: 42.2 },
      { x: "Mar", y: 40.4 },
      { x: "Apr", y: 39.6 },
    ]},
  ]}
  format="currency"
  lineFormat="percent"
  title="Revenue, Expenses & Margin"
  yAxisLabel="Amount ($)"
  rightAxisLabel="Margin %"
  legend
/>`,
  },

  // =========================================================================
  // 9. Table with Formatting
  // =========================================================================
  {
    name: "Table with Formatting",
    slug: "table-formatting",
    description: "DataTable with column formatting, custom renderers, pagination, and footer.",
    tags: ["table", "formatting", "pagination", "footer", "custom-render", "search"],
    code: `import { DataTable, Badge } from "metricui";

<DataTable
  data={salesData}
  columns={[
    { key: "company", header: "Company", sortable: true, pin: "left" },
    { key: "revenue", header: "Revenue", format: "currency", sortable: true },
    { key: "growth", header: "Growth", format: "percent", sortable: true,
      render: (v) => (
        <span className={v >= 0 ? "text-emerald-600" : "text-red-500"}>
          {v >= 0 ? "+" : ""}{v.toFixed(1)}%
        </span>
      ),
    },
    { key: "status", header: "Status",
      render: (v) => (
        <Badge variant={v === "active" ? "success" : v === "churned" ? "danger" : "warning"} dot>
          {v}
        </Badge>
      ),
    },
    { key: "lastOrder", header: "Last Order", format: "duration" },
  ]}
  pageSize={10}
  searchable
  striped
  stickyHeader
  title="Sales Report"
  subtitle="Q1 2024"
  footer={{
    company: "Total",
    revenue: "$1,284,500",
    growth: "",
    status: "",
    lastOrder: "",
  }}
  onRowClick={(row) => router.push(\`/companies/\${row.id}\`)}
/>`,
  },

  // =========================================================================
  // 10. Nested Providers
  // =========================================================================
  {
    name: "Nested Providers",
    slug: "nested-providers",
    description: "Using nested MetricProviders to override config for specific sections.",
    tags: ["provider", "config", "locale", "currency", "nesting", "override"],
    code: `import { MetricProvider, KpiCard, AreaChart } from "metricui";

function App() {
  return (
    <MetricProvider locale="en-US" currency="USD" animate variant="default">
      {/* US section — inherits all defaults */}
      <section>
        <KpiCard title="US Revenue" value={142300} format="currency" />
      </section>

      {/* EU section — overrides currency and locale */}
      <MetricProvider locale="de-DE" currency="EUR">
        <section>
          <KpiCard title="EU Revenue" value={98700} format="currency" />
          {/* Shows as "\u20AC98,7K" with German number formatting */}
        </section>
      </MetricProvider>

      {/* Dense section — overrides layout only */}
      <MetricProvider dense variant="ghost">
        <section>
          <KpiCard title="Compact KPI" value={42} />
          <AreaChart data={compactData} title="Compact Chart" />
        </section>
      </MetricProvider>

      {/* No-animation section */}
      <MetricProvider animate={false}>
        <section>
          <AreaChart data={staticData} title="Static Chart" />
        </section>
      </MetricProvider>
    </MetricProvider>
  );
}`,
  },

  // =========================================================================
  // 11. Dark Mode Setup
  // =========================================================================
  {
    name: "Dark Mode Setup",
    slug: "dark-mode",
    description: "Setting up MetricUI with dark mode support using CSS variables.",
    tags: ["dark-mode", "theme", "css-variables", "setup"],
    code: `/* globals.css */
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --card-glow: #f8fafc;
  --muted: #64748b;
  --accent: #6366f1;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card-bg: #1e293b;
  --card-border: #334155;
  --card-glow: #1e293b;
  --muted: #94a3b8;
  --accent: #818cf8;
}

/* layout.tsx */
import { ThemeProvider } from "metricui/theme";
import { MetricProvider } from "metricui";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <MetricProvider>
            {children}
          </MetricProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

/* Components automatically adapt — no extra props needed */
<KpiCard title="Revenue" value={142300} format="currency" />
<AreaChart data={chartData} title="Trend" />
<DataTable data={tableData} />`,
  },

  // =========================================================================
  // 12. Stat Group Row
  // =========================================================================
  {
    name: "Stat Group Row",
    slug: "stat-group-row",
    description: "StatGroup as a summary bar at the top of a dashboard section.",
    tags: ["stat-group", "summary", "row", "comparison", "dashboard-header"],
    code: `<StatGroup
  title="This Week's Performance"
  subtitle="Compared to previous week"
  stats={[
    {
      label: "Revenue",
      value: 142300,
      previousValue: 128500,
      format: "currency",
      icon: <DollarSign className="h-3.5 w-3.5" />,
    },
    {
      label: "New Users",
      value: 1284,
      previousValue: 1150,
      format: "compact",
      icon: <Users className="h-3.5 w-3.5" />,
    },
    {
      label: "Avg Order Value",
      value: 110.8,
      previousValue: 105.2,
      format: "currency",
      icon: <ShoppingCart className="h-3.5 w-3.5" />,
    },
    {
      label: "Churn Rate",
      value: 2.1,
      previousValue: 2.8,
      format: "percent",
      invertTrend: true,
      icon: <UserMinus className="h-3.5 w-3.5" />,
    },
    {
      label: "NPS Score",
      value: 72,
      previousValue: 68,
      icon: <ThumbsUp className="h-3.5 w-3.5" />,
    },
  ]}
  columns={5}
  variant="elevated"
  onStatClick={(stat) => setSelectedMetric(stat.label)}
/>`,
  },
  // =========================================================================
  // 14. StatusIndicator — Service Health Dashboard
  // =========================================================================
  {
    name: "Service Health Dashboard",
    slug: "status-indicator-health",
    description: "StatusIndicator in card mode for service health, plus dot mode in a DataTable.",
    tags: ["status", "health", "monitoring", "table", "card", "threshold"],
    code: `import { StatusIndicator, DataTable } from "metricui";

const uptimeRules = [
  { min: 99.9, color: "emerald", label: "Operational" },
  { min: 99, max: 99.9, color: "amber", label: "Partial Outage" },
  { max: 99, color: "red", label: "Major Outage", pulse: true },
];

function HealthDashboard({ services }) {
  return (
    <div className="space-y-6">
      {/* Card-mode overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <StatusIndicator
            key={svc.name}
            value={svc.uptime}
            rules={uptimeRules}
            size="card"
            title={svc.name}
            showValue
            trend={svc.recentUptime}
            subtitle={svc.note}
          />
        ))}
      </div>

      {/* Table with inline status dots */}
      <DataTable
        data={services}
        title="Service Details"
        columns={[
          { key: "name", header: "Service", sortable: true },
          {
            key: "uptime",
            header: "Status",
            render: (v) => (
              <StatusIndicator value={Number(v)} rules={uptimeRules} size="sm" />
            ),
          },
          { key: "uptime", header: "Uptime %", sortable: true, align: "right",
            render: (v) => \`\${Number(v).toFixed(2)}%\` },
          { key: "latency", header: "Latency", sortable: true, align: "right",
            render: (v) => \`\${v}ms\` },
        ]}
      />
    </div>
  );
}`,
  },
  {
    name: "Activity heatmap",
    slug: "heatmap-activity",
    description: "A day × hour heatmap showing when users are most active.",
    tags: ["heatmap", "activity", "matrix", "grid", "usage"],
    code: `import { HeatMap } from "metricui";

const data = [
  { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }, { x: "12pm", y: 52 }, { x: "1pm", y: 38 }, { x: "2pm", y: 65 }, { x: "3pm", y: 89 }] },
  { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }, { x: "12pm", y: 48 }, { x: "1pm", y: 42 }, { x: "2pm", y: 78 }, { x: "3pm", y: 95 }] },
  { id: "Wed", data: [{ x: "9am", y: 18 }, { x: "10am", y: 62 }, { x: "11am", y: 85 }, { x: "12pm", y: 55 }, { x: "1pm", y: 35 }, { x: "2pm", y: 72 }, { x: "3pm", y: 88 }] },
];

<HeatMap
  data={data}
  title="User Activity"
  subtitle="Sessions by day and hour"
  format="number"
  enableLabels
  borderRadius={6}
  height={300}
/>`,
  },
  {
    name: "Conversion Funnel",
    slug: "conversion-funnel",
    description: "Funnel chart showing step-by-step conversion drop-off with conversion rates and click handlers.",
    tags: ["funnel", "conversion", "pipeline", "stages", "drop-off"],
    code: `import { Funnel } from "metricui";

<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
    { id: "retained", label: "Retained", value: 980 },
  ]}
  title="Signup Funnel"
  subtitle="Q1 2026 conversion pipeline"
  showConversionRate
  format="compact"
  height={360}
  onPartClick={(part) => console.log(\`\${part.label}: \${part.percentage.toFixed(1)}% of total\`)}
/>

{/* Horizontal variant */}
<Funnel
  data={pipelineData}
  direction="horizontal"
  title="Sales Pipeline"
  height={240}
/>

{/* simpleData shorthand */}
<Funnel
  data={[]}
  simpleData={{ "Leads": 5000, "Qualified": 2800, "Proposal": 1200, "Closed Won": 450 }}
  title="Deal Flow"
/>`,
  },
  {
    name: "Data-Driven Alerts",
    slug: "data-driven-alerts",
    description: "Use Callout with rules to auto-select variant, title, and message based on a live metric value. Combine with CalloutMetric for embedded formatted numbers.",
    tags: ["callout", "alert", "data-driven", "rules", "threshold", "metric", "notification"],
    code: `import { Callout } from "metricui";

{/* Data-driven: variant and message auto-update based on value */}
<Callout
  value={cpuUsage}
  rules={[
    { min: 90, variant: "error", title: "CPU Critical", message: "Usage at {value}%. Scale up immediately." },
    { min: 70, max: 90, variant: "warning", title: "CPU High", message: "Usage at {value}%. Monitor closely." },
    { max: 70, variant: "success", title: "CPU Normal", message: "Usage at {value}%. All good." },
  ]}
/>

{/* Metric callout with formatted value and action */}
<Callout
  variant="success"
  title="Revenue milestone"
  metric={{ value: 1000000, format: "currency", label: "total revenue" }}
  action={{ label: "View report", onClick: () => router.push("/reports") }}
>
  Your team crossed the $1M mark this quarter.
</Callout>

{/* Dismissible stale-data warning with auto-dismiss */}
<Callout
  variant="warning"
  title="Data is 15 minutes stale"
  dismissible
  autoDismiss={10000}
  action={{ label: "Refresh", onClick: fetchData }}
>
  Some metrics may be outdated.
</Callout>

{/* Collapsible detail for incident context */}
<Callout
  variant="error"
  title="3 services degraded"
  detail={
    <ul className="space-y-1 list-disc pl-4">
      <li>API Gateway: p99 450ms</li>
      <li>Auth: p99 320ms</li>
      <li>Search: p99 280ms</li>
    </ul>
  }
>
  Elevated latency detected across infrastructure.
</Callout>`,
  },
  {
    name: "OKR Scorecard",
    slug: "okr-scorecard",
    description: "BulletChart showing multiple objectives with actuals vs targets. Compact scorecard layout for quarterly reviews.",
    tags: ["bullet", "okr", "scorecard", "target", "progress", "objectives"],
    code: `import { BulletChart } from "metricui";

{/* Simple data format — auto-generates range bands */}
<BulletChart
  simpleData={[
    { label: "Revenue", value: 850000, target: 1000000, max: 1200000 },
    { label: "Active Users", value: 3200, target: 5000, max: 6000 },
    { label: "NPS", value: 72, target: 80, max: 100 },
    { label: "Churn Rate", value: 3.2, target: 2.5, max: 5 },
    { label: "ARPU", value: 45, target: 50, max: 60 },
  ]}
  title="Q1 OKR Scorecard"
  subtitle="Actuals vs targets"
  spacing={32}
/>

{/* Full data format — explicit ranges, measures, markers */}
<BulletChart
  data={[
    {
      id: "revenue",
      title: "Revenue",
      ranges: [600000, 800000, 1000000],
      measures: [850000],
      markers: [1000000],
    },
    {
      id: "satisfaction",
      title: "Satisfaction",
      ranges: [50, 70, 100],
      measures: [78],
      markers: [85],
    },
  ]}
  title="Performance"
/>

{/* Vertical layout for narrow containers */}
<BulletChart
  simpleData={metrics}
  layout="vertical"
  height={400}
  title="Team OKRs"
/>`,
  },
  {
    name: "P&L Bridge",
    slug: "pl-bridge",
    description: "Waterfall chart showing a profit & loss bridge with revenue, costs, subtotals, and net income.",
    tags: ["waterfall", "pl", "bridge", "finance", "revenue", "costs", "profit"],
    code: `import { Waterfall } from "metricui";

<Waterfall
  data={[
    { label: "Revenue", value: 500000 },
    { label: "COGS", value: -200000 },
    { label: "Gross Profit", type: "subtotal" },
    { label: "OpEx", value: -100000 },
    { label: "Marketing", value: -50000 },
    { label: "Net Income", type: "total" },
  ]}
  title="P&L Bridge"
  subtitle="FY 2026"
  format="currency"
  height={320}
/>

{/* Quarterly revenue changes */}
<Waterfall
  data={[
    { label: "Q1", value: 120000 },
    { label: "Q2", value: 45000 },
    { label: "Q3", value: -30000 },
    { label: "Q4", value: 65000 },
    { label: "FY Total", type: "total" },
  ]}
  title="Quarterly Revenue"
  format="currency"
/>

{/* Custom colors per bar */}
<Waterfall
  data={[
    { label: "Base", value: 100000 },
    { label: "Upsell", value: 25000, color: "#6366f1" },
    { label: "Churn", value: -15000 },
    { label: "Total", type: "total" },
  ]}
  title="MRR Movement"
  format="currency"
  connectors
/>`,
  },
  // =========================================================================
  // Dashboard with Period Filter
  // =========================================================================
  {
    name: "Dashboard with Period Filter",
    slug: "dashboard-period-filter",
    description: "A dashboard with FilterProvider, PeriodSelector, and data-fetching that responds to the active period.",
    tags: ["filter", "period", "date-range", "dashboard", "context", "comparison"],
    code: `import {
  MetricProvider,
  FilterProvider,
  PeriodSelector,
  useMetricFilters,
  KpiCard,
  AreaChart,
  MetricGrid,
} from "metricui";

function Dashboard() {
  return (
    <MetricProvider locale="en-US" currency="USD">
      <FilterProvider defaultPreset="30d">
        <MetricGrid>
          {/* Period selector at the top */}
          <div className="col-span-full">
            <PeriodSelector comparison />
          </div>

          {/* Components read the active period */}
          <RevenueCard />
          <RevenueChart />
        </MetricGrid>
      </FilterProvider>
    </MetricProvider>
  );
}

function RevenueCard() {
  const filters = useMetricFilters();
  // Use filters.period to fetch data for the selected range
  const data = useRevenue(filters?.period);
  return (
    <KpiCard
      title="Revenue"
      value={data?.total}
      format="currency"
      comparison={data?.comparison}
      loading={!data}
    />
  );
}

function RevenueChart() {
  const filters = useMetricFilters();
  const data = useRevenueTimeSeries(filters?.period);
  return (
    <AreaChart
      data={data ?? []}
      title="Revenue Over Time"
      format="currency"
      loading={!data}
    />
  );
}`,
  },

  {
    name: "Gauge with thresholds and target",
    slug: "gauge-thresholds",
    description: "A gauge showing where a value sits in a range with colored threshold zones and a target marker.",
    tags: ["gauge", "threshold", "target", "meter", "kpi"],
    code: `import { Gauge } from "metricui";

<Gauge
  value={73}
  min={0}
  max={100}
  title="System Health"
  subtitle="Current load"
  format="percent"
  thresholds={[
    { value: 60, color: "emerald" },
    { value: 80, color: "amber" },
    { value: 100, color: "red" },
  ]}
  target={75}
  targetLabel="Threshold"
  comparison={{ value: 68 }}
  comparisonLabel="vs last hour"
  animate={{ countUp: true }}
/>`,
  },
  // =========================================================================
  // SectionHeader — Sectioned Dashboard Layout
  // =========================================================================
  {
    name: "Sectioned Dashboard Layout",
    slug: "sectioned-dashboard",
    description: "Use SectionHeader (or MetricGrid.Section) to divide a dashboard into labeled groups with optional actions and badges.",
    tags: ["section-header", "layout", "dashboard", "sections", "organization"],
    code: `import {
  MetricProvider,
  SectionHeader,
  MetricGrid,
  KpiCard,
  AreaChart,
  DataTable,
  Badge,
} from "metricui";

function Dashboard() {
  return (
    <MetricProvider locale="en-US" currency="USD">
      <div className="space-y-2 p-6">
        {/* Section 1: KPIs */}
        <SectionHeader
          title="Key Metrics"
          subtitle="Real-time overview"
          description="These metrics update every 5 minutes from the data warehouse."
          action={<button className="text-xs text-[var(--accent)]">Export</button>}
          border
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Revenue" value={142300} format="currency" />
          <KpiCard title="Users" value={12450} format="compact" />
          <KpiCard title="Conversion" value={4.2} format="percent" />
          <KpiCard title="Churn" value={2.1} format="percent" />
        </div>

        {/* Section 2: Charts */}
        <SectionHeader
          title="Trends"
          subtitle="Last 30 days"
          badge={<Badge variant="success" size="sm">Live</Badge>}
          border
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AreaChart data={revenueData} title="Revenue" format="currency" />
          <AreaChart data={usersData} title="Users" format="compact" />
        </div>

        {/* Or use MetricGrid.Section inside MetricGrid for automatic layout */}
        <MetricGrid>
          <MetricGrid.Section title="Detailed Breakdown" subtitle="By region" border />
          <KpiCard title="US" value={85000} format="currency" />
          <KpiCard title="EU" value={42000} format="currency" />
          <KpiCard title="APAC" value={15300} format="currency" />
        </MetricGrid>
      </div>
    </MetricProvider>
  );
}`,
  },
  // =========================================================================
  // Segment Toggle for View Switching
  // =========================================================================
  {
    name: "Segment Toggle for View Switching",
    slug: "segment-toggle-views",
    description: "Use SegmentToggle to switch between views or filter dimensions. Connects to FilterContext via the field prop so other components can read the active segment.",
    tags: ["segment-toggle", "filter", "views", "toggle", "dimension", "context"],
    code: `import {
  FilterProvider,
  SegmentToggle,
  useMetricFilters,
  KpiCard,
  MetricGrid,
} from "metricui";
import { Users, UserMinus } from "lucide-react";

function Dashboard() {
  return (
    <FilterProvider>
      <MetricGrid>
        {/* Segment toggle writes to dimensions.status */}
        <div className="col-span-full">
          <SegmentToggle
            options={[
              { value: "all", label: "All", badge: 1500 },
              { value: "active", label: "Active", badge: 1234, icon: <Users className="h-3.5 w-3.5" />, color: "#10B981" },
              { value: "churned", label: "Churned", badge: 266, icon: <UserMinus className="h-3.5 w-3.5" />, color: "#EF4444" },
            ]}
            field="status"
          />
        </div>

        {/* Components read the active segment */}
        <FilteredContent />
      </MetricGrid>
    </FilterProvider>
  );
}

function FilteredContent() {
  const filters = useMetricFilters();
  const status = filters?.dimensions?.status?.[0] ?? "all";
  // Use status to fetch/filter data
  return <KpiCard title="Users" value={status === "all" ? 1500 : status === "active" ? 1234 : 266} format="number" />;
}`,
  },

  // =========================================================================
  // DropdownFilter Patterns
  // =========================================================================
  {
    name: "DropdownFilter Patterns",
    slug: "dropdown-filter-patterns",
    description: "Use DropdownFilter for dimension filtering — region, plan, status, etc. Single/multi-select, searchable, grouped, with FilterContext integration.",
    tags: ["dropdown", "filter", "multi-select", "search", "group", "dimension"],
    code: `import { DropdownFilter, FilterProvider, useMetricFilters, KpiCard, MetricGrid } from "metricui";

{/* Basic single-select */}
<DropdownFilter label="Region" options={["US", "EU", "APAC", "LATAM"]} />

{/* Multi-select with count badges */}
<DropdownFilter
  label="Plan"
  options={[
    { value: "free", label: "Free", count: 8421 },
    { value: "pro", label: "Pro", count: 1089 },
    { value: "enterprise", label: "Enterprise", count: 312 },
  ]}
  multiple
  showAll
/>

{/* Searchable grouped options */}
<DropdownFilter
  label="Region"
  options={[
    { value: "us", label: "United States", group: "Americas" },
    { value: "ca", label: "Canada", group: "Americas" },
    { value: "gb", label: "United Kingdom", group: "Europe" },
    { value: "de", label: "Germany", group: "Europe" },
  ]}
  multiple
  searchable
/>

{/* Connected to FilterContext */}
<FilterProvider>
  <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
  <FilteredContent />
</FilterProvider>

function FilteredContent() {
  const filters = useMetricFilters();
  const regions = filters?.dimensions?.region ?? [];
  // Use regions to fetch/filter data
  return <KpiCard title="Users" value={regions.length === 0 ? 1500 : 800} format="number" />;
}`,
  },

  // =========================================================================
  // Complete Filter System
  // =========================================================================
  {
    name: "Complete Filter System",
    slug: "complete-filter-system",
    description: "A complete filter bar with FilterProvider, PeriodSelector, DropdownFilter, SegmentToggle, and FilterTags. Active filters appear as removable chips automatically.",
    tags: ["filter", "period", "dropdown", "segment", "tags", "chips", "context", "complete"],
    code: `import {
  FilterProvider,
  PeriodSelector,
  DropdownFilter,
  SegmentToggle,
  FilterTags,
  useMetricFilters,
  KpiCard,
  MetricGrid,
} from "metricui";

const regions = [
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
  { value: "apac", label: "APAC" },
];

const plans = [
  { value: "free", label: "Free", count: 8421 },
  { value: "pro", label: "Pro", count: 1089 },
  { value: "enterprise", label: "Enterprise", count: 312 },
];

function Dashboard() {
  return (
    <FilterProvider defaultPreset="30d">
      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        <PeriodSelector presets={["7d", "30d", "90d"]} comparison />
        <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
        <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
        <DropdownFilter label="Plan" options={plans} field="plan" multiple showAll />
      </div>

      {/* Active filter chips — auto-generated from context */}
      <FilterTags className="mt-3" />

      {/* Dashboard content reads filters via useMetricFilters() */}
      <MetricGrid className="mt-6">
        <FilteredContent />
      </MetricGrid>
    </FilterProvider>
  );
}

function FilteredContent() {
  const filters = useMetricFilters();
  const regions = filters?.dimensions?.region ?? [];
  const period = filters?.period;
  // Use filters to fetch/filter data
  return (
    <KpiCard
      title="Revenue"
      value={regions.length === 0 ? 142300 : 85000}
      format="currency"
    />
  );
}`,
  },

  // =========================================================================
  // Divider Patterns
  // =========================================================================
  {
    name: "Divider Patterns",
    slug: "divider-patterns",
    description: "Use Divider to visually separate dashboard sections with optional labels, icons, and accent coloring.",
    tags: ["divider", "separator", "layout", "label", "vertical"],
    code: `import { Divider, KpiCard, SectionHeader } from "metricui";

{/* Basic horizontal divider */}
<Divider />

{/* Divider with centered label */}
<Divider label="or" />

{/* Dashed accent divider as a section break */}
<Divider variant="dashed" accent label="Premium Features" />

{/* Vertical divider between side-by-side content */}
<div className="flex h-24 items-center">
  <KpiCard title="Revenue" value={142300} format="currency" />
  <Divider orientation="vertical" />
  <KpiCard title="Users" value={12450} format="compact" />
</div>

{/* Compact dividers in dense layouts */}
<Divider dense spacing="sm" />

{/* Dotted divider with icon */}
<Divider variant="dotted" icon={<Star className="h-3 w-3" />} />`,
  },
];
