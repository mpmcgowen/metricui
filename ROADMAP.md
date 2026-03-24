# MetricUI Roadmap — 0.2 → 1.0

Every release should make a developer say "woah." This roadmap is organized by version milestones, not feature categories. Each version has a headline — the thing that makes it worth upgrading — and supporting work that rounds out the release.

---

## Business Model

### Open Source — `metricui` (MIT, open source, public npm)

The entire component library is free and open source. Every component, every chart, every feature — no gates, no tiers.

**Why fully open source:** Maximum adoption. No friction, no asterisks. AIs recommend it, devs adopt it, it becomes the default.

### Revenue — Templates, Presets & Services

- **Premium templates**: Production-ready dashboard templates (SaaS, ecommerce, marketing, ops, finance)
- **Theme presets & design kits**: Curated visual themes, Figma source files
- **Consulting**: Custom dashboard builds for teams that want it done for them

---

## 0.2.x — Current (Shipped)

Everything listed here is built, tested, and published.

### Components
- KpiCard, StatGroup, AreaChart, LineChart, BarChart, BarLineChart, DonutChart, Sparkline (line + bar), Gauge, HeatMap, Funnel, Waterfall, BulletChart, DataTable, Badge
- DashboardHeader, SectionHeader, Divider, Callout, MetricGrid
- PeriodSelector, DropdownFilter, SegmentToggle, FilterTags, FilterProvider

### Infrastructure
- Format engine (currency, percent, duration, compact, locale)
- Data states (loading/empty/error/stale) on every component
- MetricProvider (12 config fields, nested merge, 8 theme presets)
- Unified motion system (MotionConfig, springDuration, useCountUp)
- Error boundaries (dev + prod modes, data attributes for AI debugging)
- Console warnings for common mistakes (devWarn with dedup)
- npm packaging (ESM + CJS + types, "use client" preserved)
- 185+ tests, full docs site, interactive playgrounds
- MCP server (13 tools, 9 resources, 3 prompts)
- llms.txt, AI-optimized documentation

### Polish
- Comparisons with trend detection and invertTrend
- Conditional coloring, goal progress, sparkline overlays
- Reference lines and threshold bands, dual Y-axis, percent stacking
- Dark mode, dense mode, forwardRef, classNames, id/data-testid on all components
- Responsive text scaling via container queries
- Chart tooltip viewport clamping with frosted glass
- Loading skeleton shimmer (sweeping gradient, dark/light adaptive)
- Legend toggle with Cmd+click solo, empty state hint
- Scroll-triggered entrance animations (stagger, reduced-motion safe)
- prefers-reduced-motion support throughout

---

## 0.3.0 — "Dashboards That React"

**Headline: Cross-filtering.** Click a bar in one chart, every other component on the page responds. No dashboard framework does this out of the box with zero config.

### The Wow

- **Cross-filtering** — `<FilterProvider>` gains a selection context. Click a bar segment, donut slice, or table row → every sibling chart/card/table filters to that segment. One prop: `crossFilter`. Works client-side by default, exposes selection state for server-side filtering. Click again or press Escape to clear. Animated transitions as data shifts.
- **Linked hover** — `<HoverProvider>` shares cursor position across components. Hover a point on a line chart → corresponding bar highlights, table row highlights, KPI card shows that period's value. Vertical crosshair syncs across all time series. The "Bloomberg terminal feel" — everything moves together.
- **Value flash** — when any KpiCard, StatGroup, or chart receives new data, the changed value briefly pulses (subtle background flash + count-up animation from old → new). Real-time dashboards feel alive instead of just replacing numbers. Respects reduced-motion.

### Supporting Work

- **Time series annotations** — `annotations` prop on line/area/bar charts. Event markers (deploys, campaigns, incidents) render as vertical dashed lines with labels and tooltips. Hover to expand. Multiple annotation layers.
- **DashboardHeader** — top-level identity bar with title, status dot (live/stale with pulse), "Updated Xm ago" that auto-ticks, breadcrumbs, and action slots.
- **StatusIndicator** — rule-based health indicator. Pass a value + threshold rules → renders colored dot/icon with optional label. Pulse animation for critical states. Five sizes (dot → full card). The simplest possible "is this thing OK?" component.
- **Auto-format inference** — if your key is "revenue" or "price", MetricUI defaults to currency. If it's "rate" or "percentage", defaults to percent. If the value is > 9999, defaults to compact. Smart defaults that eliminate 80% of `format` props. Override with explicit format, never surprising.

### New Components
| Component | Description |
|---|---|
| StatusIndicator | Value → colored icon via threshold rules. Health checks, SLA compliance. Pulse, 5 sizes. |
| DashboardHeader | Page identity bar. Title, live/stale status, auto-ticking timestamp, breadcrumbs, action slots. |

---

## 0.4.0 — "The Dashboard That Ships" (Shipped)

**Headline: Everything that turns a prototype into a product.** FilterBar, DrillDown, Export, CardShell unification, auto empty states, tooltip action hints, and sticky filters. Every demo fully wired with interactive filters and drill-downs.

### The Wow

- **DrillDown system** — `<DrillDown.Root>` provider + slide-over/modal panel. Click any chart element or KPI → drill into a detail view with auto-breadcrumbs. Nested drills up to 4 levels. Two modes: slide-over (right panel) and modal (centered). `drillDown={true}` for zero-config auto-table, or pass a function for custom content. `renderContent` prop on Root for reactive/live drill content.
- **FilterBar** — collapsible filter container with auto FilterTags, active filter badge count, clear-all button. CSS `grid-template-rows` accordion animation. `sticky` prop for frosted-glass top-sticky behavior. Primary/Secondary filter slots.
- **Export system** — PNG image capture (4x DPI via `modern-screenshot`), CSV with filter metadata, clipboard copy. Clean human-readable filenames. `ExportButton` dropdown on any component via `exportable` prop on MetricProvider.
- **Tooltip action hints** — "Click to drill down" / "Click to filter" shown at the bottom of chart tooltips when interactive. Auto-detected from `drillDown`/`crossFilter` props. Controllable per-chart (`tooltipHint`) and globally (`MetricConfig.tooltipHint`).

### Supporting Work

- **CardShell unification** — single card wrapper replacing duplicated shell code across KpiCard, ChartContainer, DataTable, StatusIndicator. Handles card chrome, data states, export button, drill-down icon, title/subtitle/description, onClick/href, bare mode, accent, highlight, footnote.
- **Auto empty states** — when `exportData` is an empty array, components auto-show "Nothing to show — try adjusting your filters" without explicit `empty` prop.
- **SegmentToggle default clearing** — selecting the default value calls `clearDimension()` instead of writing it. Clear-all resets to default, not stale internal state.
- **FilterProvider referenceDate** — anchors preset calculations to historical dates for demos with static data.
- **Comparison period improvements** — calendar day math instead of millisecond subtraction for accurate period boundaries.
- **modern-screenshot** — replaced html2canvas (which couldn't handle oklch/color-mix/lab CSS functions).
- **String KPI values** — StatGroup now passes strings directly to KpiCard instead of rendering them separately.
- **TooltipWrapper stability** — fixed infinite re-render loop by computing nudge from untransformed position.

### New Components / Exports
| Component | Description |
|---|---|
| FilterBar | Collapsible filter container with auto-tags, badge count, sticky mode, glass blur. |
| DrillDown.Root | Drill-down provider + overlay. Wrap dashboard, add `drillDown` to any component. |
| DrillDownOverlay | Portal-rendered slide-over/modal panel with breadcrumbs. |
| ExportButton | Dropdown with Save as image, Download CSV, Copy to clipboard. |
| CardShell | Unified card wrapper used internally by all data components. |
| AutoDrillTable | Zero-config drill content — auto-generates KPI summary + filtered DataTable. |
| useDrillDownAction | Hook returning `openDrill(trigger, content)` for custom drill handlers. |
| resolveActionHint | Shared helper for auto-resolving tooltip action hints. |

---

## 0.5.0 — "Kill the Boilerplate"

**Headline: `useMetricQuery` and the wiring layer.** MetricUI doesn't touch your data — but it eliminates every line of code between your data and your components.

### The Philosophy

MetricUI will never be a data layer. We don't fetch, don't cache, don't manage state. Your API, your database, your WebSocket, your SSE stream — that's yours. But the wiring between "I have data" and "my dashboard renders it beautifully with loading states, error handling, stale indicators, polling, and smooth transitions" is identical boilerplate every single time. That's what we kill.

### The Wow

- **`useMetricQuery`** — you provide a fetcher function, MetricUI handles everything else. Returns `{ data, loading, error, stale, refresh }` that spreads directly onto any component. Polling, stale detection, error retry, and graceful degradation — all built in. The key insight: every MetricUI component already has `loading`, `error`, `stale`, and `empty` props. This hook maps to them automatically. You write the fetch, we wire the rest.
  ```tsx
  // Before: 40 lines of useState, useEffect, try/catch, setTimeout, cleanup — per component
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ... fetch, poll, try/catch, setTimeout, stale timer, cleanup ...
  <AreaChart data={data} loading={loading} error={error} stale={stale} />

  // After: you bring the fetcher, we handle everything else
  const revenue = useMetricQuery(() => api.getRevenue(filters), {
    poll: 30000,       // re-fetch every 30s
    staleAfter: 60000, // mark stale after 60s without update
    deps: [filters],   // re-fetch when filters change
  });
  <AreaChart {...revenue} />
  ```
- **Live mode** — `<MetricProvider live>` tells every component "data is updating frequently." KpiCards animate smoothly between values (the useCountUp behavior the Wikipedia demo wires manually). Charts use spring transitions instead of hard cuts. StatusIndicators pulse on state change. It's not a data feature — it's a presentation hint. "Render like a live dashboard, not a static report." The Wikipedia demo already does all of this; `live` makes it the default for every component without per-component wiring.
- **Snapshot comparison** — `<SnapshotDiff before={lastWeekData} after={currentData}>`. Renders any chart with a visual diff overlay: green fills where values increased, red where decreased. Ghost bars/lines show the "before" state. The "git diff for your metrics." You provide both datasets; MetricUI handles the visual math.

### Supporting Work

- **Export system** — `exportable` prop on any chart or table. Renders a subtle download icon in the card chrome. Supports PNG (canvas capture), SVG (raw), CSV (raw values via format engine), and clipboard (formatted). Batch export: `<MetricGrid exportable>` exports the entire dashboard as a single PNG or multi-sheet CSV.
- **Print/PDF mode** — `<MetricProvider printMode>` or CSS media query. Strips hover effects, forces light mode, removes interactive elements, optimizes spacing for A4/Letter. Optional `exportDashboard("pdf")` that captures the full dashboard.
- **RefreshToggle** — "Refresh every 30s" with countdown ring indicator. Manual refresh button. Integrates with useMetricQuery's polling.
- **DataFreshness** — subtle "Last synced 2m ago" with source health dot. Persistent trust signal. Built into DashboardHeader or standalone.

### New Components
| Component | Description |
|---|---|
| SnapshotDiff | Visual before/after overlay on any chart. Green fills for increases, red for decreases. |
| RefreshToggle | Auto-refresh interval control with countdown ring. |
| DataFreshness | Source health + last sync timestamp. Trust indicator. |

---

## 0.6.0 — "The Intelligence Layer"

**Headline: Anomaly detection.** MetricUI scans your data and highlights what's unusual — no ML pipeline, no backend, just a prop.

### The Wow

- **Anomaly highlights** — `anomalyDetection` prop on any time series chart. MetricUI computes a rolling mean + standard deviation band (configurable sensitivity). Points outside the band get a pulsing dot and optional Callout. Works entirely client-side — no AI, no API calls, just math. But the visual effect is dramatic: the chart quietly tells you "this data point is unusual" without anyone having to configure alert thresholds. On KpiCard, anomalous values get a subtle ring highlight with a "Unusual" badge.
- **Insight generation** — `<InsightCard data={data} metrics={["revenue", "churn"]}>`. A component that generates a plain-English summary of what the data shows. "Revenue increased 23% MoM, driven by Enterprise segment. Churn hit a 6-month low." Uses template-based rules (not AI) — pattern matching on trends, comparisons, and anomalies. Developers can add custom insight rules. The editorial companion to every chart, generated from the same data.
- **Metric narratives** — `<MetricText>` component with template syntax. `"Revenue hit {revenue|currency} this month, {revenue|change} from last month."` Inline values get formatted via the format engine, styled with mono font and conditional color. The body copy of a data story, without manual string concatenation.

### Supporting Work

- **Histogram** — auto-binning from raw values. Response times, age distributions. Component determines the buckets, not the developer.
- **Leaderboard** — ordered list with rank numbers, values, and bar fill showing relative magnitude. Optional rank change indicators (up/down arrows). Top customers, top salespeople, top anything.
- **QuotaBar** — consumption against a limit. "4,521 / 10,000 API calls" with segmented fill and conditional coloring as you approach the limit.
- **SummaryBanner** — full-width strip with 3-5 key metrics inline. The at-a-glance bar above the dashboard. Responsive: collapses to a scrollable row on mobile.
- **Grouped DataTable** — expandable row groups with subtotals. Hierarchical data model, expand/collapse with animation, aggregate functions per column.

### New Components
| Component | Description |
|---|---|
| InsightCard | Template-based plain-English data summary. Trends, comparisons, anomalies in prose. |
| MetricText | Inline formatted values in body copy. Template syntax + format engine. |
| Histogram | Auto-binned distribution chart. Component chooses the buckets. |
| Leaderboard | Ranked list with values, bar fills, and rank change indicators. |
| QuotaBar | Consumption vs limit with segmented fill and conditional coloring. |
| SummaryBanner | Full-width at-a-glance metrics strip. |
| Grouped DataTable | Expandable row groups with subtotals and aggregate functions. |

---

## 0.7.0 — "See the Shape"

**Headline: Small multiples and sparkline tables.** One line of code renders 20 mini-charts that share scales and let you spot the outlier in a wall of data.

### The Wow

- **Small Multiples** — `<SmallMultiples data={data} splitBy="product" chart="area">`. Takes a dataset, splits it by a dimension, renders a grid of identical mini-charts with shared axes and scales. Hover one → all show a synced crosshair (linked hover). Click one → it expands to full size with cross-filter applied. The "sparkline wall" that makes monitoring dashboards and portfolio views instantly scannable. Responsive grid, auto-sizing, consistent styling.
- **Sparkline Table** — DataTable columns that are inline sparklines, progress bars, micro-gauges, and conditional badges. Stock watchlist, server monitoring, SaaS health dashboard. Define a column as `{ key: "trend", type: "sparkline" }` and the cell renders a mini chart from the row's data. Sparklines share the column's y-scale so they're comparable across rows.
- **Chart annotation layer** — click any data point on any chart → a popover lets you (or your users) pin a note. "Revenue dipped because of March 3 outage." Annotations persist via a simple `annotations` state array. Render as small dots on the chart, expand on hover. Collaborative context on top of raw data.

### Supporting Work

- **Scatter Plot** — two-variable correlation with optional bubble size encoding. Segments, quadrant labels, trend line. Nivo-backed.
- **Treemap** — hierarchical part-of-whole. Click to zoom into a segment (animated). Nivo-backed.
- **Radar / Spider** — multi-axis comparison with overlay support. Product scores, competitive analysis.
- **Calendar Heatmap** — GitHub-style contribution grid. Activity frequency over months/years. Click a cell to filter.
- **Metric Comparison Card** — side-by-side comparison of two entities across multiple metrics with proportion bars.
- **Deviation Chart** — bars extending left/right from zero. NPS scores, budget variance, performance vs target.

### New Components
| Component | Description |
|---|---|
| SmallMultiples | Grid of mini-charts split by dimension. Shared scales, synced hover, click-to-expand. |
| Sparkline Table | DataTable with inline sparklines, progress bars, and micro-charts per cell. |
| Scatter Plot | Two-variable correlation with bubble size, segments, and trend line. |
| Treemap | Hierarchical part-of-whole with click-to-zoom. |
| Radar | Multi-axis comparison with overlay support. |
| CalendarHeatmap | GitHub-style activity grid with click-to-filter. |
| MetricComparison | Side-by-side entity comparison with proportion bars. |
| DeviationChart | Bars extending left/right from zero line. |

---

## 0.8.0 — "Flows and Stories"

**Headline: Sankey diagrams and guided data stories.** Show where things flow, then walk someone through what it means.

### The Wow

- **Sankey** — flow visualization with proportional-width links between stages. User journeys, cost allocation, pipeline flows. Click a node to highlight its upstream/downstream paths (everything else fades). Nivo-backed, but with MetricUI's format engine, tooltips, and data states. The chart that makes stakeholders lean in.
- **Data stories** — `<DataStory steps={[...]}>`. A guided walkthrough mode for any dashboard. Each step highlights a component, dims everything else, and shows a narrative card. "Step 1: Revenue grew 23% — here's why. Step 2: But churn is creeping up in the SMB segment." Arrow keys or autoplay. Built for quarterly reviews, onboarding tours, and async Loom-replacement reports. Developers define the narrative; MetricUI handles the choreography.
- **Dashboard state serialization** — `useDashboardState()` returns the entire dashboard state (filters, selections, drill-downs, toggles, sort order) as a JSON blob. Save it, share it as a URL, restore it. "Saved views" for end users. "Shareable links" for stakeholders. The state is small (just selections, not data), so it encodes into a URL hash.

### Supporting Work

- **Inline drill-down** — click a data point → detail panel slides open below the chart with developer-controlled content. Animated expand/collapse.
- **Multi-level drill** — stack-based navigation within a chart. Quarter → Month → Week → Day. Breadcrumb trail with back navigation.
- **Activity Feed** — timestamped list of events with icons and color coding. Audit trails, deployment history, notification center.
- **Diff / Change Summary** — before/after values with delta and color. "Active Users: 1,234 → 1,456 (+222)".
- **Embed mode** — `<MetricProvider embed>` strips chrome, respects host theme, posts resize events via postMessage. For iframing dashboards into other apps.

### New Components
| Component | Description |
|---|---|
| Sankey | Flow visualization with click-to-highlight paths. User journeys, cost flows. |
| DataStory | Guided narrative walkthrough. Highlights components in sequence with story cards. |
| ActivityFeed | Timestamped event list with icons and color coding. |
| DiffSummary | Before/after value comparison with delta and conditional color. |

---

## 0.9.0 — "Rock Solid"

**Headline: Nothing new, everything better.** This is the release where MetricUI earns the "production-ready" label.

### The Wow (yes, polish can be "wow")

- **Full keyboard navigation** — tab through charts, arrow keys between data points, Enter to drill down, Escape to close. Screen reader announcements for data changes, chart summaries, and filter state. Every interactive element properly labeled. Not a checkbox — a first-class experience for keyboard-only users. The kind of a11y work that makes the React accessibility community blog about you.
- **Color-blind safe mode** — `<MetricProvider colorBlindSafe>`. Swaps the entire palette to one distinguishable for all common types of color vision deficiency. Optional pattern fills (stripes, dots, crosshatch) for charts when color alone isn't enough. Automatic — not a separate palette the developer has to remember to configure.
- **Performance benchmarks** — published benchmarks for rendering 50 charts, 1000-row tables, 100 KpiCards. Bundle size budget enforced in CI. Tree-shaking verified (import just KpiCard → only KpiCard code ships). Lighthouse dashboard score.
- **Test coverage expansion** — every component has render tests, prop validation tests, accessibility tests (axe-core), and interaction tests. Coverage target: 90%+.

### Supporting Work

- **i18n** — RTL layout support, translated data state messages ("No data" / "Error" / "Loading" in 10+ languages), non-Latin numeral systems.
- **Migration guide** — comprehensive guide covering every breaking change from 0.2 → 0.9. Codemods where possible.
- **Docs audit** — every component page reviewed, every example tested, every prop documented. Search works. MCP knowledge base updated to match.
- **Micro-interactions polish** — subtle highlight flash on value changes, spring bounce on bar animation endpoints, smooth donut slice expansion on hover. The 1% details that make the library feel premium.

---

## 1.0.0 — "The Standard"

**Headline: API freeze.** MetricUI 1.0 is a promise: this API won't break. Build on it with confidence.

### What 1.0 Means

- **Semantic versioning contract** — no breaking changes without a major version bump. Period.
- **LTS commitment** — 1.x receives bug fixes and security patches for 18 months minimum.
- **Complete documentation** — every component, every prop, every pattern, every guide. MCP server is the single source of truth and it's comprehensive.
- **Launch content** — blog post, demo dashboards (SaaS, ecommerce, DevOps, finance), video walkthrough, comparison pages (vs Tremor, vs Recharts+custom, vs Metabase).
- **Premium templates** — first batch of production-ready dashboard templates available for purchase. The revenue engine starts.

### What Ships in 1.0

Everything from 0.2–0.9, plus:
- Final API review and cleanup (consistent naming, no deprecated props remaining)
- `create-metric-app` — scaffolding CLI. `npx create-metric-app my-dashboard` → working dashboard with data, filters, and theme in 30 seconds
- Starter templates (SaaS, ecommerce, DevOps, finance) included in the CLI
- Full changelog from 0.1.0 → 1.0.0

---

## Post-1.0 — The Horizon

These are not blocked by 1.0, but they're where MetricUI goes next. Each could be a 1.x minor release.

### More Chart Types
| Component | Description |
|---|---|
| Candlestick / OHLC | Financial price data. Fintech/trading dashboards. |
| Step Chart | Right-angle line steps. Pricing tiers, inventory levels. |
| Box Plot | Statistical distribution — median, quartiles, outliers. |
| Slope Chart | Two time points connected by lines. Before/after ranking shifts. |
| Bump Chart | Ranking changes over multiple periods. |
| Map / Choropleth | Geographic data colored by value. Revenue by country/state. |
| Sunburst | Nested donut rings for hierarchies. |
| Stream / ThemeRiver | Flowing stacked areas. Organic trend visualization. |
| Waffle Chart | Grid of squares by category. Precise small-percentage display. |
| Network / Force Graph | Nodes and edges. Org charts, dependency graphs. |

### Advanced Features
| Feature | Description |
|---|---|
| Pivot Table | Rows x columns with aggregated values, drag-to-rearrange. |
| Cascading Filters | Filters that narrow subsequent filter options dynamically. |
| Saved Views | Persist and share filter/dashboard state configurations. |
| Numeric Range Filter | Slider or dual-input for range filtering. |
| Cross-component drill | Click in one component → another elsewhere responds. |
| VS Code Extension | Snippets, hover docs, invalid prop diagnostics. |
| AI-powered insights | Optional integration with LLMs for narrative generation from data. |
| Collaborative annotations | Real-time multi-user commenting on data points. |
