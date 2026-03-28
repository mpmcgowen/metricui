<p align="center">
  <img src="https://metricui.com/logo.svg" alt="MetricUI" width="200" />
</p>

<h1 align="center">MetricUI</h1>

<p align="center">
  <strong>The missing UI layer for React dashboards.</strong>
  <br />
  KPI cards, charts, tables, and layout — with built-in formatting, theming, data states, and zero config.
</p>

<p align="center">
  <a href="https://metricui.com">Homepage</a> ·
  <a href="https://metricui.com/docs">Docs</a> ·
  <a href="https://metricui.com/demos/analytics">Analytics Demo</a> ·
  <a href="https://metricui.com/demos/saas">SaaS Demo</a> ·
  <a href="https://metricui.com/demos/github">GitHub Demo</a> ·
  <a href="https://metricui.com/demos/wikipedia">Wikipedia Live</a> ·
  <a href="#mcp-server">MCP Server</a> ·
  <a href="https://metricui.com/roadmap">Roadmap</a>
</p>

---

<p align="center">
  <img src="https://metricui.com/screenshots/full-dark.png" alt="MetricUI SaaS Dashboard — dark mode" width="800" />
</p>

<p align="center">
  <em><a href="https://metricui.com/demos/analytics">Web Analytics</a> · <a href="https://metricui.com/demos/saas">SaaS Metrics</a> · <a href="https://metricui.com/demos/github">GitHub Analytics</a> · <a href="https://metricui.com/demos/wikipedia">Wikipedia Live</a> · <a href="https://metricui.com/demos/world">World Explorer</a> — all with AI Insights, cross-filtering, drill-downs, and export.</em>
</p>

---

## Install

```bash
npm install metricui
```

That's it. All chart dependencies are included.

### CDN (no bundler needed)

For browser sandboxes, Claude artifacts, v0, Bolt, or anywhere without npm:

```tsx
import { KpiCard, AreaChart, MetricProvider } from "https://cdn.jsdelivr.net/npm/metricui@latest/dist/metricui.browser.mjs";
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/metricui@latest/dist/styles.css" />
```

---

## Why MetricUI?

You're building a dashboard. You need KPI cards, charts, tables. You reach for Recharts + shadcn + custom CSS and spend days wiring up formatting, dark mode, loading states, and responsive layouts.

**MetricUI does all of that in one import.**

```tsx
import {
  MetricProvider, FilterProvider, DashboardHeader, PeriodSelector,
  MetricGrid, KpiCard, AreaChart, DonutChart, DataTable, Callout,
} from "metricui";
import "metricui/styles.css";

export default function Dashboard() {
  return (
    <MetricProvider theme="emerald">
      <FilterProvider defaultPreset="30d">
        <DashboardHeader title="Revenue" lastUpdated={new Date()} actions={<PeriodSelector comparison />} />

        <MetricGrid>
          <MetricGrid.Section title="Key Metrics" />
          <KpiCard title="Revenue" value={127450} format="currency"
            comparison={{ value: 113500 }} comparisonLabel="vs last month"
            sparkline={{ data: [89, 94, 99, 103, 109, 114, 127], previousPeriod: [78, 82, 85, 88, 91, 95, 98] }}
            conditions={[
              { when: "above", value: 120000, color: "emerald" },
              { when: "below", value: 90000, color: "red" },
            ]}
          />
          <KpiCard title="Users" value={8420} format="compact"
            comparison={[{ value: 7680, label: "vs last month" }, { value: 6200, label: "vs last year" }]}
            highlight
          />
          <KpiCard title="Churn" value={3.2} format="percent"
            comparison={{ value: 3.7, invertTrend: true }}
            goal={{ value: 2.5, showTarget: true, showRemaining: true }}
          />

          <Callout value={12.3} rules={[
            { min: 10, variant: "success", title: "Strong Growth", message: "Revenue grew {value}% this month." },
            { max: 0, variant: "error", title: "Revenue Declined", message: "Revenue dropped {value}%." },
          ]} />

          <MetricGrid.Section title="Trends" border />
          <AreaChart data={revenueData} comparisonData={prevPeriod} format="currency" title="Revenue Trend"
            referenceLines={[{ axis: "y", value: 50000, label: "Target", style: "dashed" }]}
            thresholds={[{ from: 0, to: 30000, color: "#EF4444", opacity: 0.05 }]}
          />
          <DonutChart data={planBreakdown} format="currency" title="By Plan" centerValue="$127K" centerLabel="Total" />

          <MetricGrid.Section title="Details" border />
          <DataTable data={customers} title="Top Customers" columns={columns} searchable pageSize={10} />
        </MetricGrid>
      </FilterProvider>
    </MetricProvider>
  );
}
```

**Zero layout code.** MetricGrid auto-detects component types — KPIs row up, charts pair, tables go full width. DashboardHeader shows live status with auto-ticking "Updated Xm ago". FilterProvider + PeriodSelector wire time filtering across the page. Responsive out of the box.

---

## Features

### AI Insights — Bring Your Own LLM

Drop `<DashboardInsight />` into any dashboard. A floating chat button appears — click it, ask questions about your data. The AI auto-collects live data from every component, builds context-rich prompts, and streams analysis. Use `@` to reference specific charts. Works with any LLM (OpenAI, Anthropic, local models). [Docs &rarr;](https://metricui.com/docs/ai-insights)

```tsx
<Dashboard ai={{ analyze: myLLM, company: "Acme Corp — B2B SaaS", context: "Q4 target: $500K" }}>
  <KpiCard title="Revenue" value={142800} aiContext="Primary metric. Enterprise drives 52%." />
  <DashboardInsight />
</Dashboard>
```

### KPI Cards — Not Just Numbers

<p>
  <img src="https://metricui.com/screenshots/kpi-dark.png" alt="KpiCard with goal progress" width="280" />
</p>

Sparkline with previous-period overlay. Goal progress bars. Conditional red/amber/green coloring. Multiple comparison badges. Copyable values. Drill-down links. [Docs &rarr;](https://metricui.com/docs/kpi-card)

### Charts with Reference Lines & Threshold Bands

<p>
  <img src="https://metricui.com/screenshots/area-dark.png" alt="AreaChart with threshold bands" width="500" />
</p>

Mark targets, benchmarks, and danger zones directly on charts. Comparison overlays show period-over-period trends as dashed lines. Works on [AreaChart](https://metricui.com/docs/area-chart), [LineChart](https://metricui.com/docs/line-chart), and [BarChart](https://metricui.com/docs/bar-chart).

```tsx
<AreaChart
  data={revenueData}
  comparisonData={previousPeriod}
  referenceLines={[{ axis: "y", value: 50000, label: "Target", style: "dashed" }]}
  thresholds={[{ from: 0, to: 30000, color: "#EF4444", opacity: 0.05 }]}
  format="currency"
/>
```

### Data-Driven Alerts

<p>
  <img src="https://metricui.com/screenshots/callout-light.png" alt="Callout alert with embedded metric" width="500" />
</p>

Pass a value and rules — [Callout](https://metricui.com/docs/callout) auto-selects the right variant, title, and message. Supports embedded formatted metrics, action buttons, collapsible detail, and auto-dismiss.

### Expandable Data Tables

<p>
  <img src="https://metricui.com/screenshots/table-dark.png" alt="DataTable with expanded row showing sparkline, gauge, and status indicators" width="700" />
</p>

Click a row and a mini-dashboard slides open — sparklines, gauges, status indicators, badges. Plus search, multi-sort, pagination, pinned columns, 12 column types, and row conditions. [Docs &rarr;](https://metricui.com/docs/data-table)

### Conversion Funnels

<p>
  <img src="https://metricui.com/screenshots/funnel-light.png" alt="Funnel chart with conversion rates" width="500" />
</p>

Auto-computed stage-to-stage conversion rates. Vertical or horizontal. Smooth or linear interpolation. [Docs &rarr;](https://metricui.com/docs/funnel)

### Light & Dark Mode

<p>
  <img src="https://metricui.com/screenshots/full-light.png" alt="MetricUI Wikipedia dashboard — light mode" width="700" />
</p>

<em><a href="https://metricui.com/demos/world">Wikipedia live demo</a> in light mode.</em>

CSS variables. Zero config. Every component adapts automatically. [Theming guide &rarr;](https://metricui.com/docs/guides/theming)

### Smart Format Engine

One prop formats any value. Currency, percentages, durations, compact notation — with locale support. [Docs &rarr;](https://metricui.com/docs/guides/format-engine)

```tsx
<KpiCard value={127450} format="currency" />        // → $127.5K
<KpiCard value={4.2} format="percent" />             // → 4.2%
<KpiCard value={3725} format="duration" />           // → 1h 2m 5s
<KpiCard value={2400000} format="number" />          // → 2.4M
```

### Theme Presets

One prop. Entire dashboard changes color. 8 built-in presets. Custom presets via `ThemePreset` type. [Theming guide &rarr;](https://metricui.com/docs/guides/theming)

```tsx
<MetricProvider theme="emerald">   // Green accent + green-first chart palette
<MetricProvider theme="rose">      // Pink accent + pink-first chart palette
<MetricProvider theme="amber">     // Warm amber everything
```

### MetricGrid — Zero Layout Code

Drop components in. It figures out the layout. [Docs &rarr;](https://metricui.com/docs/metric-grid)

```tsx
<MetricGrid>
  <MetricGrid.Section title="Overview" />
  <KpiCard ... />  <KpiCard ... />  <KpiCard ... />
  <AreaChart ... />          {/* Auto 2/3 width */}
  <DonutChart ... />         {/* Auto 1/3 width */}
  <DataTable ... />          {/* Auto full width */}
</MetricGrid>
```

### Filter System

Complete filter context — wire [PeriodSelector](https://metricui.com/docs/period-selector), [DropdownFilter](https://metricui.com/docs/dropdown-filter), [SegmentToggle](https://metricui.com/docs/segment-toggle), and [FilterTags](https://metricui.com/docs/filter-tags) together with zero boilerplate. [Filtering guide &rarr;](https://metricui.com/docs/guides/filtering)

```tsx
<FilterProvider defaultPreset="30d">
  <DashboardHeader title="Dashboard" actions={<PeriodSelector comparison />} />
  <SegmentToggle options={["All", "Enterprise", "SMB"]} field="segment" />
  <DropdownFilter label="Region" options={regions} field="region" multiple />
  <FilterTags />  {/* Auto-renders active filters as dismissible chips */}
</FilterProvider>
```

### Saved Views & Shareable Links

`useDashboardState()` captures the entire dashboard state (filters, period, dimensions, cross-filter) as a JSON-safe snapshot. Serialize to URL params for shareable links or persist to localStorage / your backend. [Cookbook recipe &rarr;](https://metricui.com/docs/guides/cookbook#saved-views)

### Data States

Every component handles loading, empty, error, and stale states out of the box. [Docs &rarr;](https://metricui.com/docs/guides/data-states)

### Error Boundaries

One chart crashes? The rest keep running. Dev mode shows component name + actionable hints. Prod mode shows clean retry UI.

### Accessibility

`prefers-reduced-motion`, focus-visible rings, ARIA attributes on charts, keyboard-accessible drill-downs. [Docs &rarr;](https://metricui.com/docs/guides/accessibility)

---

## Components

### Cards & Metrics

| Component | What it does | Docs |
|-----------|-------------|------|
| [**KpiCard**](https://metricui.com/docs/kpi-card) | Comparison badges, sparkline overlays, goal progress, conditional coloring, copyable, drill-down | [Docs](https://metricui.com/docs/kpi-card) |
| [**StatGroup**](https://metricui.com/docs/stat-group) | Multiple metrics in a dense responsive grid row with per-stat comparisons | [Docs](https://metricui.com/docs/stat-group) |

### Charts

| Component | What it does | Docs |
|-----------|-------------|------|
| [**AreaChart**](https://metricui.com/docs/area-chart) | Gradient fills, stacking, dual Y-axis, comparison overlays, reference lines, threshold bands | [Docs](https://metricui.com/docs/area-chart) |
| [**LineChart**](https://metricui.com/docs/line-chart) | Clean lines — same props as AreaChart without fill | [Docs](https://metricui.com/docs/line-chart) |
| [**BarChart**](https://metricui.com/docs/bar-chart) | 6 presets, comparison/target bars, sorting, negative values, reference lines | [Docs](https://metricui.com/docs/bar-chart) |
| [**BarLineChart**](https://metricui.com/docs/bar-line-chart) | Dual-axis combo: bars + lines — unified data format | [Docs](https://metricui.com/docs/bar-line-chart) |
| [**DonutChart**](https://metricui.com/docs/donut-chart) | Center KPI content, arc labels, percentage mode | [Docs](https://metricui.com/docs/donut-chart) |
| [**Gauge**](https://metricui.com/docs/gauge) | Arc gauge with threshold zones, target markers, comparison badges | [Docs](https://metricui.com/docs/gauge) |
| [**HeatMap**](https://metricui.com/docs/heatmap) | 2D matrix, cross-hair hover, sequential + diverging color scales | [Docs](https://metricui.com/docs/heatmap) |
| [**Funnel**](https://metricui.com/docs/funnel) | Conversion pipeline with auto-computed rates | [Docs](https://metricui.com/docs/funnel) |
| [**Waterfall**](https://metricui.com/docs/waterfall) | Sequential +/- changes with auto running totals, connectors | [Docs](https://metricui.com/docs/waterfall) |
| [**BulletChart**](https://metricui.com/docs/bullet-chart) | Actual vs target with qualitative range bands | [Docs](https://metricui.com/docs/bullet-chart) |
| [**ScatterPlot**](https://metricui.com/docs/scatter-plot) | Two-variable correlation with bubble size, reference lines, linked hover | [Docs](https://metricui.com/docs/scatter-plot) |
| [**Treemap**](https://metricui.com/docs/treemap) | Hierarchical part-of-whole with flat or nested data | [Docs](https://metricui.com/docs/treemap) |
| [**Calendar**](https://metricui.com/docs/calendar) | GitHub-style heatmap with auto date range detection | [Docs](https://metricui.com/docs/calendar) |
| [**Radar**](https://metricui.com/docs/radar) | Multi-axis comparison with overlay support | [Docs](https://metricui.com/docs/radar) |
| [**Sankey**](https://metricui.com/docs/sankey) | Flow visualization with gradient links, flat or native data | [Docs](https://metricui.com/docs/sankey) |
| [**Choropleth**](https://metricui.com/docs/choropleth) | Geographic heatmap with bundled world + US state maps, sqrt/log scale | [Docs](https://metricui.com/docs/choropleth) |
| [**Bump**](https://metricui.com/docs/bump) | Ranking chart with auto-ranking from flat data | [Docs](https://metricui.com/docs/bump) |
| [**Sparkline**](https://metricui.com/docs/sparkline) | Inline micro-chart with reference lines, bands, trend coloring | [Docs](https://metricui.com/docs/sparkline) |

### Data

| Component | What it does | Docs |
|-----------|-------------|------|
| [**DataTable**](https://metricui.com/docs/data-table) | Sort, search, pagination, expandable rows, 12 column types, pinned columns, row conditions | [Docs](https://metricui.com/docs/data-table) |

### Layout

| Component | What it does | Docs |
|-----------|-------------|------|
| [**Dashboard**](https://metricui.com/docs/dashboard) | All-in-one wrapper — replaces 5 nested providers in one component | [Docs](https://metricui.com/docs/dashboard) |
| [**DashboardHeader**](https://metricui.com/docs/dashboard-header) | Live/stale status, auto-ticking "Updated Xm ago", breadcrumbs, action slots | [Docs](https://metricui.com/docs/dashboard-header) |
| [**DashboardNav**](https://metricui.com/docs/dashboard-nav) | Tab/scroll navigation with sliding indicator, keyboard nav, URL sync | [Docs](https://metricui.com/docs/dashboard-nav) |
| [**MetricGrid**](https://metricui.com/docs/metric-grid) | Smart auto-layout grid with staggered reveal animations | [Docs](https://metricui.com/docs/metric-grid) |
| [**SectionHeader**](https://metricui.com/docs/section-header) | Labeled divider with description popover, badge, action slot | [Docs](https://metricui.com/docs/section-header) |
| [**Divider**](https://metricui.com/docs/divider) | Horizontal/vertical separator with label, icon, accent | [Docs](https://metricui.com/docs/divider) |

### Filters

| Component | What it does | Docs |
|-----------|-------------|------|
| **FilterProvider** | Context that wires all filter components. `useMetricFilters()` hook | [Guide](https://metricui.com/docs/guides/filtering) |
| [**PeriodSelector**](https://metricui.com/docs/period-selector) | Date range presets, custom ranges, comparison toggle | [Docs](https://metricui.com/docs/period-selector) |
| [**DropdownFilter**](https://metricui.com/docs/dropdown-filter) | Multi-select dimension filter with search, grouped options | [Docs](https://metricui.com/docs/dropdown-filter) |
| [**SegmentToggle**](https://metricui.com/docs/segment-toggle) | Pill toggle with icons, badges, multi-select | [Docs](https://metricui.com/docs/segment-toggle) |
| [**FilterTags**](https://metricui.com/docs/filter-tags) | Auto-renders active filters as dismissible chips | [Docs](https://metricui.com/docs/filter-tags) |

### Status & Alerts

| Component | What it does | Docs |
|-----------|-------------|------|
| [**Callout**](https://metricui.com/docs/callout) | Data-driven alerts with rules, `{value}` templates, embedded metrics | [Docs](https://metricui.com/docs/callout) |
| [**StatusIndicator**](https://metricui.com/docs/status-indicator) | Rule-based health with 5 sizes, pulse animation, trend arrows | [Docs](https://metricui.com/docs/status-indicator) |
| [**Badge**](https://metricui.com/docs/badge) | 6 variants, 3 sizes, custom colors, icons, dismiss | [Docs](https://metricui.com/docs/badge) |

---

## AI-First: MCP Server + llms.txt

Most component libraries give you docs and hope the AI figures it out. MetricUI gives the AI **structured knowledge of every component, every prop, and every pattern** — so it generates production-quality dashboards on the first try.

```bash
# One command. That's it.
claude mcp add --transport stdio metricui -- npx -y @metricui/mcp-server
```

### The difference is real

Here's what happens when you prompt an AI with **"Build me a SaaS dashboard with MRR, churn, users, and revenue breakdown"**:

<details>
<summary><strong>Without MetricUI MCP</strong> — what the AI generates with Recharts / generic components</summary>

```tsx
// The AI guesses at library APIs, builds everything from scratch
import { LineChart, Line, XAxis, YAxis, PieChart, Pie } from "recharts";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">SaaS Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">MRR</p>
          <p className="text-2xl font-bold">${(127450).toLocaleString()}</p>
          <p className="text-sm text-green-600">+12.3%</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Churn Rate</p>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-sm text-green-600">-13.5%</p>
        </div>
        {/* ...more hand-built cards with no formatting engine, no sparklines,
            no conditional coloring, no goal tracking... */}
      </div>

      <LineChart width={800} height={300} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Line dataKey="revenue" stroke="#8884d8" />
        {/* No reference lines. No threshold bands. No comparison overlay.
            No dark mode. No loading states. No error boundaries. */}
      </LineChart>
    </div>
  );
}
```

Raw `div` cards. Manual number formatting. No sparklines, no conditions, no goals, no filters, no dark mode, no data states, no error boundaries. Every dashboard looks the same.

</details>

<details open>
<summary><strong>With MetricUI MCP</strong> — what the AI generates (real output, unedited)</summary>

```tsx
import {
  MetricProvider, FilterProvider, DashboardHeader, PeriodSelector,
  MetricGrid, KpiCard, Callout, AreaChart, DonutChart, BarChart,
  DataTable, Badge,
} from "metricui";
import "metricui/styles.css";

export default function Dashboard() {
  return (
    <MetricProvider theme="emerald">
      <FilterProvider defaultPreset="30d">
        <DashboardHeader
          title="SaaS Metrics"
          subtitle="Real-time metrics overview"
          lastUpdated={new Date()}
          actions={<PeriodSelector comparison />}
        />
        <MetricGrid>
          <MetricGrid.Section title="Key Metrics" />

          <KpiCard title="Monthly Revenue" value={127450} format="currency"
            comparison={{ value: 113500 }} comparisonLabel="vs last month"
            sparkline={{ data: [89, 94, 99, 103, 109, 114, 127],
              previousPeriod: [78, 82, 85, 88, 91, 95, 98], interactive: true }}
            conditions={[
              { when: "above", value: 115000, color: "emerald" },
              { when: "below", value: 90000, color: "red" },
            ]} />

          <KpiCard title="Churn Rate" value={3.2} format="percent"
            comparison={{ value: 3.7, invertTrend: true }}
            goal={{ value: 2.5, showTarget: true, showRemaining: true }}
            conditions={[
              { when: "below", value: 2.5, color: "emerald" },
              { when: "above", value: 4, color: "red" },
            ]} />

          <KpiCard title="Active Users" value={8420} format="number"
            comparison={{ value: 7680 }} copyable
            drillDown={{ label: "View breakdown", onClick: () => {} }} />

          <KpiCard title="Conversion" value={4.8} format="percent"
            comparison={{ value: 4.2 }}
            sparkline={{ data: [3.1, 3.4, 3.8, 4.0, 4.1, 4.2, 4.8] }} />

          <Callout value={12.3} rules={[
            { min: 15, variant: "success", title: "Exceptional Growth",
              message: "Revenue grew {value}% — exceeding target by 50%." },
            { min: 5, max: 15, variant: "info", title: "Healthy Growth",
              message: "Revenue grew {value}% month-over-month." },
            { max: 0, variant: "error", title: "Revenue Declined",
              message: "Revenue dropped {value}%." },
          ]} action={{ label: "View growth report", onClick: () => {} }} />

          <MetricGrid.Section title="Trends" subtitle="Last 30 days" border />

          <AreaChart data={revenueData} comparisonData={comparisonData}
            format="currency" title="Revenue Trend"
            referenceLines={[{ axis: "y", value: 50000, label: "Target",
              color: "#10B981", style: "dashed" }]}
            thresholds={[{ from: 0, to: 40000, color: "#EF4444", opacity: 0.05 }]}
            xAxisLabel="Month" yAxisLabel="Revenue ($)"
            height={360} legend />

          <DonutChart data={breakdownData} format="currency"
            title="Revenue by Plan" centerValue="$99.4K" centerLabel="Total MRR" />

          <MetricGrid.Item span="full">
            <BarChart preset="grouped" data={channelData}
              keys={["revenue", "conversions"]} indexBy="channel"
              sort="desc" format="currency" title="Channel Performance" legend />
          </MetricGrid.Item>

          <MetricGrid.Section title="Details" border />
          <DataTable data={tableData} title="Top Customers" searchable
            columns={[
              { key: "name", header: "Customer", sortable: true },
              { key: "plan", header: "Plan",
                render: (v) => <Badge variant={v === "Enterprise" ? "info" : "default"}>{String(v)}</Badge> },
              { key: "mrr", header: "MRR", format: "currency", sortable: true },
              { key: "status", header: "Status",
                render: (v) => <Badge variant={v === "active" ? "success" : v === "at-risk" ? "warning" : "danger"}>{String(v)}</Badge> },
            ]} />
        </MetricGrid>
      </FilterProvider>
    </MetricProvider>
  );
}
```

</details>

**Same prompt. The AI with MetricUI MCP generates:**
- DashboardHeader with live status + auto-ticking "Updated Xm ago"
- FilterProvider + PeriodSelector with comparison toggle
- MetricGrid auto-layout (zero CSS)
- KpiCards with conditional coloring, goal progress bars, sparkline overlays, drill-down links
- AreaChart with dashed target reference line, danger zone threshold band, and previous-period comparison overlay
- Data-driven Callout that auto-picks severity from a growth number
- Sorted grouped BarChart, DonutChart with center KPI
- Searchable DataTable with Badge status columns
- Theme preset, dark mode, animations, error boundaries — all automatic

**The AI doesn't guess. It knows.** 13 tools, 26 components, every prop, every pattern. [Full MCP Server docs &rarr;](https://metricui.com/docs/guides/mcp-server)

### llms.txt

Machine-readable documentation for AI models at [`/llms.txt`](https://metricui.com/llms.txt). Every component, every prop, every type, every pattern — so even AI tools without MCP support can generate correct MetricUI code.

---

## Roadmap

MetricUI is building toward 1.0 — cross-filtering, zero-config charts, anomaly detection, data stories, and a stable API you can build on with confidence. See what's shipped, what's next, and where we're headed:

**[View the full roadmap &rarr;](https://metricui.com/roadmap)**

---

## Built With

- [Nivo](https://nivo.rocks) — chart rendering (line, bar, pie, heatmap)
- [Tailwind CSS](https://tailwindcss.com) — styling (ships pre-built, Tailwind not required in your project)
- [Lucide](https://lucide.dev) — icons
- [React](https://react.dev) 18/19

---

## License

MIT

---

<p align="center">
  <strong>Built for developers who care about design.</strong>
</p>
