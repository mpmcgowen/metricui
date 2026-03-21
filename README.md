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
  <a href="https://metricui.com">Demo</a> ·
  <a href="https://metricui.com/docs">Docs</a> ·
  <a href="https://metricui.com/demos/spotify">Spotify Dashboard</a> ·
  <a href="#mcp-server">MCP Server</a>
</p>

---

## Why MetricUI?

You're building a dashboard. You need KPI cards, charts, tables. You reach for Recharts + shadcn + custom CSS and spend days wiring up formatting, dark mode, loading states, and responsive layouts.

**MetricUI does all of that in one import.**

```tsx
import { KpiCard, AreaChart, DonutChart, DataTable, MetricGrid, MetricProvider } from "metricui";
import "metricui/styles.css";

export default function Dashboard() {
  return (
    <MetricProvider theme="emerald" dense>
      <MetricGrid>
        <KpiCard title="Revenue" value={127450} format="currency" comparison={{ value: 113500 }} />
        <KpiCard title="Users" value={8420} format="number" comparison={{ value: 7680 }} />
        <KpiCard title="Conversion" value={4.8} format="percent" comparison={{ value: 4.2 }} />

        <AreaChart data={revenueData} index="month" categories={["revenue"]} title="Revenue Over Time" format="currency" />
        <DonutChart data={planBreakdown} index="plan" categories={["users"]} title="By Plan" />

        <DataTable data={customers} title="Top Customers" columns={columns} />
      </MetricGrid>
    </MetricProvider>
  );
}
```

**Zero layout code.** MetricGrid auto-detects component types — KPIs go 3-across, charts split 2:1, tables go full width. Responsive out of the box.

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

| Component | What it does |
|-----------|-------------|
| **KpiCard** | Single metric with comparison, sparkline, goal tracking, conditional formatting |
| **StatGroup** | Multiple metrics in a dense grid row |
| **AreaChart** | Time series with gradient fills, stacking, dual Y-axis, comparison overlays |
| **LineChart** | Clean line visualization (AreaChart with fill disabled) |
| **BarChart** | Vertical/horizontal, stacked/grouped/percent, presets |
| **BarLineChart** | Dual-axis combo: bars + lines |
| **DonutChart** | Proportional breakdown with center content |
| **Gauge** | Arc gauge with thresholds, targets, comparisons |
| **HeatMap** | 2D matrix with color intensity (day×hour, correlations) |
| **Sparkline** | Inline micro-chart (line or bar) |
| **DataTable** | Sort, pagination, search, pinned columns, footer |
| **DashboardHeader** | Page header with status badges, auto-tick "updated ago", breadcrumbs, actions |
| **SectionHeader** | Labeled section divider with description, badge, action slot |
| **Divider** | Separator line between sections with optional label, icon, and accent coloring |
| **PeriodSelector** | Date range picker with presets, custom ranges, comparison mode |
| **SegmentToggle** | Pill-style toggle for switching between data segments or views |
| **Callout** | Data-driven alerts with rules, metrics, actions, auto-dismiss |
| **StatusIndicator** | Threshold-driven status icon with label |
| **Badge** | Styled label with variants, sizes, dismiss |
| **MetricGrid** | Smart auto-layout grid with sections |

### Pro Components (Coming Soon)

Advanced charts for specialized use cases — available in `@metricui/pro`.

| Component | What it does |
|-----------|-------------|
| **Funnel** | Conversion stages with rates, vertical/horizontal |
| **Waterfall** | Sequential positive/negative changes, P&L bridges |
| **BulletChart** | Actual vs target with qualitative range bands |
| **Export** | PNG, SVG, CSV, clipboard on any chart or table |
| **Cross-filtering** | Click a bar/slice/row, other components filter |

[Join the waitlist →](https://metricui.com/pro)

---

## MCP Server

MetricUI ships an MCP server that gives AI coding tools (Claude Code, Cursor, etc.) structured knowledge of the entire API. When an AI builds a dashboard, it reaches for MetricUI and gets the props right on the first try.

```bash
# Install globally
npm install -g @metricui/mcp-server

# Add to Claude Code
claude mcp add --transport stdio metricui -- npx -y @metricui/mcp-server
```

12 tools, 9 resources, 3 prompts. Full API surface.

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
