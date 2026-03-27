// ---------------------------------------------------------------------------
// Competitor code snippets for comparison pages
// Each shows how to build ONE stacked area chart from the same 12-month dataset.
// MetricUI code shows a full dashboard (3 KPIs + area chart + donut) for contrast.
// ---------------------------------------------------------------------------

export const RECHARTS_CODE = `import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan 2024", enterprise: 38400, startup: 28600, smb: 17200 },
  { month: "Feb 2024", enterprise: 40100, startup: 29200, smb: 18200 },
  { month: "Mar 2024", enterprise: 42300, startup: 30100, smb: 19400 },
  { month: "Apr 2024", enterprise: 40800, startup: 29800, smb: 18800 },
  { month: "May 2024", enterprise: 43600, startup: 30900, smb: 19700 },
  { month: "Jun 2024", enterprise: 45200, startup: 32100, smb: 20800 },
  { month: "Jul 2024", enterprise: 44100, startup: 31800, smb: 20600 },
  { month: "Aug 2024", enterprise: 46800, startup: 33200, smb: 21400 },
  { month: "Sep 2024", enterprise: 49100, startup: 34300, smb: 22400 },
  { month: "Oct 2024", enterprise: 50800, startup: 35400, smb: 23000 },
  { month: "Nov 2024", enterprise: 52900, startup: 36700, smb: 23900 },
  { month: "Dec 2024", enterprise: 59400, startup: 41200, smb: 26850 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => \`$\${(v / 1000).toFixed(0)}k\`} />
        <Tooltip formatter={(v: number) => \`$\${v.toLocaleString()}\`} />
        <Legend />
        <Area type="monotone" dataKey="enterprise" stackId="1"
          fill="#6366f1" stroke="#6366f1" />
        <Area type="monotone" dataKey="startup" stackId="1"
          fill="#8b5cf6" stroke="#8b5cf6" />
        <Area type="monotone" dataKey="smb" stackId="1"
          fill="#a78bfa" stroke="#a78bfa" />
      </AreaChart>
    </ResponsiveContainer>
  );
}`;

export const TREMOR_CODE = `import { AreaChart, Card, Title } from "@tremor/react";

const data = [
  { month: "Jan 2024", Enterprise: 38400, Startup: 28600, SMB: 17200 },
  { month: "Feb 2024", Enterprise: 40100, Startup: 29200, SMB: 18200 },
  { month: "Mar 2024", Enterprise: 42300, Startup: 30100, SMB: 19400 },
  { month: "Apr 2024", Enterprise: 40800, Startup: 29800, SMB: 18800 },
  { month: "May 2024", Enterprise: 43600, Startup: 30900, SMB: 19700 },
  { month: "Jun 2024", Enterprise: 45200, Startup: 32100, SMB: 20800 },
  { month: "Jul 2024", Enterprise: 44100, Startup: 31800, SMB: 20600 },
  { month: "Aug 2024", Enterprise: 46800, Startup: 33200, SMB: 21400 },
  { month: "Sep 2024", Enterprise: 49100, Startup: 34300, SMB: 22400 },
  { month: "Oct 2024", Enterprise: 50800, Startup: 35400, SMB: 23000 },
  { month: "Nov 2024", Enterprise: 52900, Startup: 36700, SMB: 23900 },
  { month: "Dec 2024", Enterprise: 59400, Startup: 41200, SMB: 26850 },
];

export default function RevenueChart() {
  return (
    <Card>
      <Title>Revenue by Segment</Title>
      <AreaChart
        data={data}
        index="month"
        categories={["Enterprise", "Startup", "SMB"]}
        colors={["indigo", "violet", "purple"]}
        valueFormatter={(v) => \`$\${(v / 1000).toFixed(1)}k\`}
        stack
      />
    </Card>
  );
}`;

export const SHADCN_CODE = `import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

const chartConfig = {
  enterprise: { label: "Enterprise", color: "hsl(239 84% 67%)" },
  startup: { label: "Startup", color: "hsl(258 90% 66%)" },
  smb: { label: "SMB", color: "hsl(263 70% 71%)" },
};

const data = [
  { month: "Jan 2024", enterprise: 38400, startup: 28600, smb: 17200 },
  { month: "Feb 2024", enterprise: 40100, startup: 29200, smb: 18200 },
  { month: "Mar 2024", enterprise: 42300, startup: 30100, smb: 19400 },
  { month: "Apr 2024", enterprise: 40800, startup: 29800, smb: 18800 },
  { month: "May 2024", enterprise: 43600, startup: 30900, smb: 19700 },
  { month: "Jun 2024", enterprise: 45200, startup: 32100, smb: 20800 },
  { month: "Jul 2024", enterprise: 44100, startup: 31800, smb: 20600 },
  { month: "Aug 2024", enterprise: 46800, startup: 33200, smb: 21400 },
  { month: "Sep 2024", enterprise: 49100, startup: 34300, smb: 22400 },
  { month: "Oct 2024", enterprise: 50800, startup: 35400, smb: 23000 },
  { month: "Nov 2024", enterprise: 52900, startup: 36700, smb: 23900 },
  { month: "Dec 2024", enterprise: 59400, startup: 41200, smb: 26850 },
];

export default function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(v) => \`$\${(v / 1000).toFixed(0)}k\`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="enterprise" stackId="1"
          fill="var(--color-enterprise)" stroke="var(--color-enterprise)" />
        <Area type="monotone" dataKey="startup" stackId="1"
          fill="var(--color-startup)" stroke="var(--color-startup)" />
        <Area type="monotone" dataKey="smb" stackId="1"
          fill="var(--color-smb)" stroke="var(--color-smb)" />
      </AreaChart>
    </ChartContainer>
  );
}`;

export const CHARTJS_CODE = `import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
);

const labels = [
  "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024",
  "May 2024", "Jun 2024", "Jul 2024", "Aug 2024",
  "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024",
];

const data = {
  labels,
  datasets: [
    {
      label: "Enterprise",
      data: [38400, 40100, 42300, 40800, 43600, 45200,
             44100, 46800, 49100, 50800, 52900, 59400],
      fill: true,
      backgroundColor: "rgba(99, 102, 241, 0.3)",
      borderColor: "#6366f1",
    },
    {
      label: "Startup",
      data: [28600, 29200, 30100, 29800, 30900, 32100,
             31800, 33200, 34300, 35400, 36700, 41200],
      fill: true,
      backgroundColor: "rgba(139, 92, 246, 0.3)",
      borderColor: "#8b5cf6",
    },
    {
      label: "SMB",
      data: [17200, 18200, 19400, 18800, 19700, 20800,
             20600, 21400, 22400, 23000, 23900, 26850],
      fill: true,
      backgroundColor: "rgba(167, 139, 250, 0.3)",
      borderColor: "#a78bfa",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    tooltip: {
      callbacks: {
        label: (ctx: any) =>
          \`\${ctx.dataset.label}: $\${ctx.parsed.y.toLocaleString()}\`,
      },
    },
  },
  scales: {
    y: {
      stacked: true,
      ticks: { callback: (v: number) => \`$\${(v / 1000).toFixed(0)}k\` },
    },
    x: { stacked: true },
  },
};

export default function RevenueChart() {
  return <Line data={data} options={options} />;
}`;

export const METRICUI_CHART_CODE = `import { AreaChart } from "metricui";
import "metricui/styles.css";

const data = [
  { month: "Jan 2024", enterprise: 38400, startup: 28600, smb: 17200 },
  { month: "Feb 2024", enterprise: 40100, startup: 29200, smb: 18200 },
  { month: "Mar 2024", enterprise: 42300, startup: 30100, smb: 19400 },
  { month: "Apr 2024", enterprise: 40800, startup: 29800, smb: 18800 },
  { month: "May 2024", enterprise: 43600, startup: 30900, smb: 19700 },
  { month: "Jun 2024", enterprise: 45200, startup: 32100, smb: 20800 },
  { month: "Jul 2024", enterprise: 44100, startup: 31800, smb: 20600 },
  { month: "Aug 2024", enterprise: 46800, startup: 33200, smb: 21400 },
  { month: "Sep 2024", enterprise: 49100, startup: 34300, smb: 22400 },
  { month: "Oct 2024", enterprise: 50800, startup: 35400, smb: 23000 },
  { month: "Nov 2024", enterprise: 52900, startup: 36700, smb: 23900 },
  { month: "Dec 2024", enterprise: 59400, startup: 41200, smb: 26850 },
];

export default function RevenueChart() {
  return (
    <AreaChart
      data={data}
      index="month"
      categories={["enterprise", "startup", "smb"]}
      title="Revenue by Segment"
      format="currency"
      stacked
    />
  );
}`;

export const METRICUI_CODE = `import {
  Dashboard, DashboardInsight, SectionHeader,
  KpiCard, AreaChart, DonutChart, Waterfall, MetricGrid,
} from "metricui";
import "metricui/styles.css";
import { DollarSign, Users, TrendingDown, BarChart3 } from "lucide-react";

const data = [
  { month: "Jan 2024", revenue: 84200, users: 3120, churn: 4.2, conversions: 186, enterprise: 38400, startup: 28600, smb: 17200 },
  // ... 12 months from the same CSV
  { month: "Dec 2024", revenue: 127450, users: 5120, churn: 2.4, conversions: 342, enterprise: 59400, startup: 41200, smb: 26850 },
];

export default function SaasDashboard() {
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];

  return (
    <Dashboard theme="indigo" exportable
      ai={{ analyze: myLLM, company: "Acme SaaS", context: "2024 metrics" }}>
      <SectionHeader title="Key Metrics"
        description="December 2024 vs November. Click any card to drill down." />
      <MetricGrid>
        <KpiCard title="Revenue" value={latest.revenue} format="currency"
          comparison={{ value: prev.revenue, label: "vs Nov" }}
          sparkline={{ data: data.map(d => d.revenue), type: "bar" }}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          description="Monthly recurring revenue across all segments." drillDown />
        <KpiCard title="Active Users" value={latest.users} format="number"
          comparison={{ value: prev.users, label: "vs Nov" }}
          sparkline={{ data: data.map(d => d.users) }}
          icon={<Users className="h-3.5 w-3.5" />}
          description="Unique active users this month." drillDown />
        <KpiCard title="Churn Rate" value={latest.churn} format="percent"
          comparison={{ value: prev.churn, invertTrend: true, label: "vs Nov" }}
          sparkline={{ data: data.map(d => d.churn) }}
          icon={<TrendingDown className="h-3.5 w-3.5" />}
          description="Monthly churn rate. Lower is better."
          conditions={[{ when: "below", value: 3, color: "emerald" },
            { when: "between", min: 3, max: 4, color: "amber" },
            { when: "above", value: 4, color: "red" }]} drillDown />
        <KpiCard title="Conversions" value={latest.conversions} format="number"
          comparison={{ value: prev.conversions, label: "vs Nov" }}
          sparkline={{ data: data.map(d => d.conversions), type: "bar" }}
          icon={<BarChart3 className="h-3.5 w-3.5" />}
          description="New paid signups this month." drillDown />
      </MetricGrid>
      <SectionHeader title="Revenue Breakdown"
        description="Click any chart to drill down into the data." />
      <MetricGrid>
        <AreaChart data={data} index="month" categories={["enterprise", "startup", "smb"]}
          title="Revenue by Segment"
          subtitle="Stacked monthly revenue across Enterprise, Startup, and SMB"
          format="currency" stacked drillDown />
        <DonutChart data={[
          { id: "enterprise", label: "Enterprise", value: latest.enterprise },
          { id: "startup", label: "Startup", value: latest.startup },
          { id: "smb", label: "SMB", value: latest.smb },
        ]} title="Dec 2024 Mix" subtitle="Click a slice to drill into segment details"
          format="currency" drillDown />
      </MetricGrid>
      <Waterfall data={data.map((d, i) => ({
        label: d.month.split(" ")[0],
        value: i === 0 ? d.revenue : d.revenue - data[i - 1].revenue,
      }))} title="Month-over-Month Revenue Change"
        subtitle="Positive and negative swings with running totals"
        format="currency" drillDown />
      <DashboardInsight />
    </Dashboard>
  );
}`;
