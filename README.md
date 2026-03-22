<p align="center">
  <img src="https://metricui.com/og.png" alt="MetricUI" width="600" />
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
  <a href="https://metricui.com/demos/saas">SaaS Demo</a> ·
  <a href="https://metricui.com/demos/github">GitHub Demo</a> ·
  <a href="#mcp-server">MCP Server</a>
</p>

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

## Install

```bash
npm install metricui
```

That's it. All chart dependencies are included.

---

## Features

### 🎯 Smart Format Engine

One prop formats any value. Currency, percentages, durations, compact notation — with locale support.

```tsx
<KpiCard value={127450} format="currency" />        // → $127.5K
<KpiCard value={4.2} format="percent" />             // → 4.2%
<KpiCard value={3725} format="duration" />           // → 1h 2m 5s
<KpiCard value={2400000} format="number" />          // → 2.4M
```

### 🎨 Theme Presets

One prop. Entire dashboard changes color.

```tsx
<MetricProvider theme="emerald">   // Green accent + green-first chart palette
<MetricProvider theme="rose">      // Pink accent + pink-first chart palette
<MetricProvider theme="amber">     // Warm amber everything
```

8 built-in presets. Custom presets via `ThemePreset` type.

### 📐 MetricGrid — Zero Layout Code

Drop components in. It figures out the layout.

```tsx
<MetricGrid>
  <MetricGrid.Section title="Overview" />
  <KpiCard ... />
  <KpiCard ... />
  <KpiCard ... />
  <AreaChart ... />          {/* Auto 2/3 width */}
  <DonutChart ... />         {/* Auto 1/3 width */}
  <DataTable ... />          {/* Auto full width */}
</MetricGrid>
```

3 KPIs? Equal thirds. 5 KPIs? Equal fifths. No gaps, no orphans.

### ⚙️ MetricProvider — Global Config

Set it once. Every component inherits.

```tsx
<MetricProvider
  theme="emerald"
  variant="elevated"
  dense
  animate={false}
  locale="de-DE"
  currency="EUR"
  nullDisplay="N/A"
>
  {/* Every component reads these defaults. Props override. */}
</MetricProvider>
```

Nested providers merge — override just what you need for a section.

### 📈 Reference Lines & Threshold Bands

Mark targets, benchmarks, and danger zones directly on charts. No custom SVG needed.

```tsx
<AreaChart
  data={revenueData}
  format="currency"
  referenceLines={[
    { axis: "y", value: 50000, label: "Target", color: "#10B981", style: "dashed" },
  ]}
  thresholds={[
    { from: 0, to: 30000, color: "#EF4444", opacity: 0.05 },
  ]}
  comparisonData={previousPeriod}  // Dashed overlay of last period
/>
```

Works on AreaChart, LineChart, and BarChart. Comparison overlays show period-over-period trends at a glance.

### 🔍 Filter System

Complete filter context — wire PeriodSelector, DropdownFilter, SegmentToggle, and FilterTags together with zero boilerplate.

```tsx
<FilterProvider defaultPreset="30d">
  <DashboardHeader title="Dashboard" actions={<PeriodSelector comparison />} />
  <SegmentToggle options={["All", "Enterprise", "SMB"]} field="segment" />
  <DropdownFilter label="Region" options={regions} field="region" multiple />
  <FilterTags />  {/* Auto-renders active filters as dismissible chips */}
</FilterProvider>
```

Read filter state anywhere with `useMetricFilters()`. Comparison periods auto-compute.

### 📊 Data States — Loading, Empty, Error, Stale

Every component handles data states out of the box. No conditional rendering, no wrapper components.

```tsx
<KpiCard title="Revenue" value={data?.revenue} format="currency" loading={isLoading} />
<AreaChart data={chartData} title="Trends" error={{ message: "API timeout", onRetry: refetch }} />
<DataTable data={[]} columns={cols} empty={{ message: "No results match your filters" }} />
```

One prop per state. Skeletons match the component layout. Errors show retry buttons. Empty states are customizable.

### 🛡️ Error Boundaries

One chart crashes? The rest keep running.

- **Dev mode**: Component name, error message, actionable hint, stack trace, copy button
- **Prod mode**: Clean "couldn't load" + retry button
- **AI debugging**: `data-component` and `data-error` attributes on the DOM

### 🌙 Dark Mode

CSS variables. Zero config. Matches system preference or toggle manually.

### ♿ Accessibility

- `prefers-reduced-motion` kills all animations
- Global `focus-visible` ring on every interactive element
- ARIA attributes on charts (`role="meter"`, `aria-valuenow`)
- Keyboard-accessible drill-downs and popovers

---

## Components

### Cards & Metrics

| Component | What it does |
|-----------|-------------|
| **KpiCard** | Single metric with comparison badges, sparkline with previous-period overlay, goal progress bar, conditional coloring (10+ named colors), copyable values, drill-down links |
| **StatGroup** | Multiple metrics in a dense responsive grid row with per-stat comparisons |

### Charts

| Component | What it does |
|-----------|-------------|
| **AreaChart** | Time series with gradient fills, stacking (normal + 100%), dual Y-axis, comparison overlays, reference lines, threshold bands, per-series styling, 9 curve types |
| **LineChart** | Clean line visualization (AreaChart without fill) — same props |
| **BarChart** | 6 presets (grouped, stacked, percent, horizontal, etc.), comparison/target ghost bars, sorting, negative value coloring, reference lines |
| **BarLineChart** | Dual-axis combo: bars on left, lines on right — unified data format |
| **DonutChart** | Proportional breakdown with center KPI content, arc labels, percentage mode |
| **Gauge** | Arc gauge with threshold zones (auto-color), target markers, comparison badges |
| **HeatMap** | 2D matrix with color intensity, row/column/cross-hair hover, sequential + diverging scales |
| **Funnel** | Conversion pipeline with auto-computed stage-to-stage rates, smooth/linear interpolation |
| **Waterfall** | Sequential +/- changes with auto running totals, connectors, positive/negative/total coloring |
| **BulletChart** | Actual vs target with qualitative range bands, multiple measures and markers |
| **Sparkline** | Inline micro-chart (line/bar) with reference lines, bands, trend coloring, min/max markers |

### Data

| Component | What it does |
|-----------|-------------|
| **DataTable** | Sort, pagination, search, pinned columns, expandable rows, 12 column types (sparkline, status, progress, badge), row conditions, footer |

### Layout

| Component | What it does |
|-----------|-------------|
| **DashboardHeader** | Page header with live/stale status (pulsing dot), auto-ticking "Updated Xm ago", breadcrumbs, action slots |
| **MetricGrid** | Smart auto-layout grid — KPIs row up, charts pair, tables go full width. Staggered reveal animations |
| **SectionHeader** | Labeled section divider with description popover, badge, action slot |
| **Divider** | Horizontal/vertical separator with optional label, icon, accent coloring |

### Filters

| Component | What it does |
|-----------|-------------|
| **FilterProvider** | Context that wires all filter components together. `useMetricFilters()` hook for reading state |
| **PeriodSelector** | Date range picker with presets (7d, 30d, quarter, YTD, custom), comparison toggle |
| **DropdownFilter** | Single/multi-select dimension filter with search, grouped options, count badges |
| **SegmentToggle** | Pill-style toggle for switching segments/views with icons, badges, multi-select |
| **FilterTags** | Auto-renders active filters as dismissible chips from FilterContext |

### Status & Alerts

| Component | What it does |
|-----------|-------------|
| **Callout** | Data-driven alerts — pass a value + rules, auto-selects variant/message with `{value}` templates |
| **StatusIndicator** | Rule-based health display with 5 sizes (dot to full card), pulse animation, trend arrows, time-in-state |
| **Badge** | Styled label with 6 variants, 3 sizes, custom colors, icons, dismiss button |

---

## MCP Server

MetricUI ships an MCP server that makes AI coding tools (Claude Code, Cursor, Windsurf) experts on the entire API. The AI knows every component, every prop, every pattern — and generates production-quality dashboards with theme presets, reference lines, threshold bands, conditions, goals, and filter systems on the first try.

```bash
# Add to Claude Code (recommended)
claude mcp add --transport stdio metricui -- npx -y @metricui/mcp-server
```

**What the AI gets:** 12 tools for looking up APIs, generating dashboards, validating props, and searching docs. Full knowledge of all 26 components, every prop, data shapes, advanced patterns, and the format engine. When you say "build me a SaaS dashboard", it generates a complete page with DashboardHeader, MetricGrid, advanced KpiCards, charts with reference lines, and a filter bar — not a generic grid of basic cards.

---

## llms.txt

Machine-readable documentation for AI models at `/llms.txt`. Every component, every prop, every type, every pattern.

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
