# MetricUI Roadmap

---

## Business Model

### Free Tier — `metricui` (MIT, open source, public npm)

Everything a developer needs to build a production dashboard:

- All base components (KpiCard, StatGroup, AreaChart, LineChart, BarChart, BarLineChart, DonutChart, Sparkline, Gauge, HeatMap, DataTable, Badge)
- MetricGrid (auto-layout), MetricProvider (global config), theme presets, error boundaries
- Format engine, dark mode, dense mode, classNames, forwardRef, a11y
- MCP server (free — this is distribution/marketing, not product)
- llms.txt, docs site, playgrounds, demo dashboards

**Why free:** This is how MetricUI spreads. AIs recommend it, devs adopt it, it becomes the default. The free tier must be genuinely great — not a crippled demo.

### Pro Tier — `@metricui/pro` (paid, private npm)

What you outgrow into when you need advanced features:

- **Premium charts**: Funnel, Waterfall, Treemap, Sankey, Scatter, Calendar Heatmap, Radar
- **Export system**: PNG, SVG, CSV, clipboard on any chart or table
- **Cross-filtering**: Click a bar/slice/row, other components filter to that segment
- **Period selector + Filter bar**: Date range picker with presets, dimension filters, filter chips
- **Dashboard templates**: 5+ production-ready (SaaS, ecommerce, marketing, ops, finance)
- **Figma source files**
- **Priority support**

**How it works:**
```bash
npm install metricui              # Free — all base components
npm install @metricui/pro         # Paid — requires license key
```

```tsx
import { KpiCard, AreaChart, MetricGrid } from "metricui";         // Free
import { Funnel, Export, CrossFilter } from "@metricui/pro";       // Paid
```

Both packages share MetricProvider, same theming, same MCP server. Pro extends free — it's not a replacement.

The MCP server knows about both. It uses free components by default. When the user asks for a funnel or export, it generates `@metricui/pro` imports and tells them they need the Pro package.

**Upgrade moment:** Developer builds a dashboard with free components, then hits a wall — needs a funnel chart, needs to export to PNG, needs cross-filtering. That's when they buy Pro.

---

## Already Built
- Format engine (currency, percent, duration, compact, locale)
- Data states (loading/empty/error/stale) on every component
- Comparisons with trend detection and invertTrend
- Conditional coloring
- Dark mode theming via CSS variables
- Sparklines (line + bar types)
- Reference lines and threshold bands
- Goal progress tracking
- Null value handling (cards/tables: nullDisplay, charts: chartNullMode)
- Copy to clipboard (with onCopy callback)
- Drill-down actions (basic, keyboard accessible)
- Legend with series toggle (ARIA, orientation, className)
- Dual Y-axis
- Percent stacking
- Comparison period overlays
- prefers-reduced-motion support
- Global focus-visible ring (CSS)
- forwardRef on all components
- id / data-testid / classNames on all components
- Dense mode on all components (standardized from compact/dense)
- MetricProvider global config (12 fields, nested merge, prop > provider > fallback)
- Unified motion system (MotionConfig, DEFAULT_MOTION_CONFIG, springDuration)
- useCountUp fix (prev→target animation)
- MCP server (11 tools, 9 resources, 3 prompts, server instructions)
- npm packaging (ESM + CJS + types via tsup, "use client" preserved)
- Demo page with interactive global config bar
- Docs playground with collapsible sections, global config sidebar
- Badge expansion (sizes, outline variant, custom color, icon slot, onDismiss)
- DescriptionPopover a11y (ARIA, click/focus triggers, CSS vars)
- ChartTooltip (className, comparisonLabel, dark mode shadow fix)
- Skeleton components use CSS variables (not hardcoded colors)

---

## AI Discoverability & Distribution (Highest Priority)

1. ~~**MCP Server**~~ ✅ — 11 tools, 9 resources, 3 prompts, server instructions. Tested with Claude Code.
2. ~~**llms.txt**~~ ✅ — 2,165 lines at `public/llms.txt`. All 10 components with every prop, all types, format engine, MetricConfig, theming, 12 patterns.
3. ~~**AI-optimized documentation**~~ ✅ — MCP knowledge base codifies every component, prop, type, and pattern as structured data. get_component_api and get_component_example provide machine-readable docs.
4. ~~**AI prompt templates**~~ ✅ — MCP prompts: build_dashboard, review_dashboard, migrate_to_metricui.
5. ~~**Package metadata optimization**~~ ✅ — README rewritten with install, features, component table, MCP server, code examples. package.json already has description + keywords from npm packaging.
6. ~~**MCP `search_docs` tool**~~ ✅ — Weighted keyword search across all documentation (components, props, types, patterns, format examples, guide sections). Answers conceptual questions, returns ranked results with snippets. Same server, new tool.

---

## Infrastructure & Packaging

6. ~~**Package as installable npm library**~~ ✅ — tsup build, ESM + CJS + types, peer deps, "use client" preserved. `npm install metricui`.
7. ~~**Tests**~~ ✅ — 185 tests across 9 files. Format engine (70+ cases), MetricProvider (18 cases), motion helpers, component render tests (KpiCard, StatGroup, DataTable, Badge, all charts mocked via Nivo, MetricGrid). Vitest + Testing Library. All passing in <1s.
8. ~~**Docs / Storybook**~~ ✅ — Full documentation site with component API reference (prop tables, examples, data shapes), 5 guide pages (Getting Started, Format Engine, Theming, Data States, Accessibility), docs landing page, interactive playgrounds preserved per component, sticky ToC navigation.
9. ~~**Remove unused dependencies**~~ ✅ — Removed framer-motion, @nivo/funnel, @nivo/geo, @nivo/sankey, @nivo/scatterplot, @nivo/treemap, @nivo/radial-bar. Clean devDependencies.
10. ~~**Clean up type inconsistencies**~~ ✅ — Removed unused MetricBaseProps. Extracted ReferenceLine/ThresholdBand to chartTypes.ts. Exported KpiCardProps from barrel.
11. ~~**Consistent event/callback signatures**~~ ✅ — Normalized HeatMap onCellClick (id, value, label, seriesId, x). All chart callbacks use clean structured objects, no Nivo internals leak.

---

## Core — Global Config Layer

12. ~~**Expand MetricProvider**~~ ✅ — 12 config fields (locale, currency, animate, motionConfig, variant, colors, nullDisplay, chartNullMode, dense, emptyState, errorState). Nested merge. All components wired.
13. ~~**Unified animation system**~~ ✅ — MotionConfig type, DEFAULT_MOTION_CONFIG, springDuration(). useCountUp fixed (prev→target). Sparkline rebuilt on Nivo (spring transitions on data changes). All charts streaming-ready. Still TODO: BarLineChart line overlay animation.
14. ~~**Full theme customization**~~ ✅ (partial) — CSS variables for all colors, classNames on all components. Still TODO: `--radius`, `--spacing` variables, configurable noise texture.
15. ~~**Theme presets**~~ ✅ — 8 built-in presets (indigo, emerald, rose, amber, cyan, violet, slate, orange). `<MetricProvider theme="emerald">` sets accent + chart palette. Custom presets via ThemePreset type. Color dots on demo config bar.
16. ~~**Error boundaries per component**~~ ✅ — ErrorBoundary wraps all chart/card/table components. Dev mode: component name, error, stack trace, actionable hints, copy button. Prod mode: clean "couldn't load" + retry. AI: `data-component` and `data-error` attributes. Console: `[MetricUI] ComponentName render error`.
17. ~~**Console warnings for common mistakes**~~ ✅ — devWarn/devWarnDeprecated utilities with once-per-session dedup. Warnings for: deprecated props (grouped, compact, sparklineData), DataTable column key mismatches. All guarded by process.env.NODE_ENV.

---

## Core — Layout & Navigation

18. ~~**Dashboard layout grid**~~ ✅ (`<MetricGrid>`) — auto-layout from component type hints, smart row grouping, equal-width redistribution, MetricGrid.Item for overrides, MetricGrid.Section for labeled dividers, responsive reflow, dense mode. Demo page converted from 30+ lines of grid boilerplate to zero.
19. **Responsive text scaling** — KPI values, chart titles, axis labels scale down in smaller containers instead of overflowing.

---

## Core — Date & Filtering System

20. ~~**Period selector**~~ ✅ (`<PeriodSelector>`) — date range picker with presets (Last 7d, 30d, 90d, month, quarter, YTD, custom). FilterProvider + useMetricFilters() context. Auto-computes comparison period. Standalone onChange mode. Dense mode. Full checklist complete.
21. **Dimension filters** (`<DimensionFilter>`) — filter by any field (region, plan, status). Lives in a `<FilterBar>`. Filter state accessible via provider.
22. **Cross-filtering** — click a bar/slice/row and other components on the page filter to that segment. Components opt in via `crossFilter` prop. Supports both client-side filtering and server-side (expose filters for dev to pass to API).

---

## Core — Drill-Down System

23. **Inline drill-down** — click a data point, detail panel slides open below the chart with dev-controlled content (table, sub-chart, custom component).
24. **Multi-level drill** — stack-based navigation within a chart. Quarter → Month → Week → Day. Breadcrumb trail with back navigation.
25. **Cross-component drill** — click in one component, another component elsewhere on the page responds. Drill target shows placeholder when no selection.
26. **Drill-down animations** — current view slides out, detail slides in. Tied to unified animation system.

---

## Core — Export

27. **Export system** — `exportable` prop on any chart or table. PNG, SVG, CSV, clipboard. Subtle download icon in card chrome. Works with the format engine (CSV uses raw values, not display values).
28. **Print / PDF mode** — CSS print stylesheet that strips hover effects, forces light mode, removes interactive elements, optimizes for A4/Letter. Optional "generate PDF" that captures full dashboard.

---

## Pro — Interactivity & Real-Time

29. **Linked interactions** — shared hover context via provider. Hover a point on a line chart, corresponding bar highlights, table row highlights, KPI updates.
30. **Real-time mode** — provider-level config that switches components into streaming-friendly behavior. Rolling window on time series, smooth count-up between value changes, sparkline scroll animation.
31. **Data connector hooks** — `useMetricQuery` that bridges fetch/polling/error handling with component data state props. Thin glue, not a data layer.

---

## Pro — Intelligence & Annotations

32. **Time series annotations** — event markers on any time series chart (deploys, campaigns, incidents) with label and tooltip. First-class `annotations` prop.
33. **Auto-formatting inference** — if value is 1234567, default to compact ("1.2M"). If key is "revenue", assume currency. Smart defaults that reduce config.
34. **TypeScript data inference** — pass data array, component infers keys/indexBy/columns automatically. Less config for the common case.
35. **Relative time formatting** — "Updated 5 minutes ago" that auto-ticks. Built into stale state or as standalone `<TimeAgo>` utility.

---

## Pro — Enterprise Features

36. **Dashboard state serialization** — save/restore dashboard state (filters, toggles, sort, drill-down) as JSON. Enables saved views and shareable URLs.
37. **Commenting / annotation layer** — user-facing notes pinned to data points. "Revenue dipped because of March 3 outage." Overlay system for dashboard viewers.
38. **Embed mode** — stripped-down render for iframing into other apps. Removes chrome, respects host theme, posts resize events.
39. **i18n beyond locale** — RTL layout support, translated data state messages, non-Latin numeral systems.

---

## Accessibility (All Tiers)

35. **Keyboard navigation** — tab through charts, arrow keys between data points, Enter to drill down. Screen reader announcements for data changes.
36. **Color blind safe palettes** — alternate palette distinguishable for common color blindness. Optional pattern fills for grayscale.
37. **ARIA labels** — every interactive element properly labeled. Chart summaries for screen readers.

---

## Quality & Polish

38. **Micro-interactions** — subtle highlight flash on value changes, spring bounce on bar animation endpoints, smooth donut slice expansion on hover.
39. **prefers-reduced-motion** — already implemented, ensure all new animation work respects it.

---

## Usability & End-User Polish

40. ~~**Chart tooltip viewport clamping**~~ ✅ — TooltipWrapper detects viewport overflow and nudges via transform. Frosted glass backdrop-filter. Covers all 7 chart types via ChartTooltip.
41. ~~**Loading skeleton shimmer**~~ ✅ — Replaced animate-pulse with sweeping gradient animation (mu-shimmer). Light/dark adaptive via color-mix. Respects prefers-reduced-motion.
42. ~~**Legend toggle empty state + Cmd+click solo**~~ ✅ — "All hidden" hint when every series toggled off. Cmd/Ctrl+click to solo a series (show only that one, hide rest). Click again to restore all. Works on all 5 legend-enabled charts.
43. ~~**StatGroup responsive columns**~~ ✅ — Container query splits joined bar into individual bordered cards at <300px. Pure CSS, no React re-renders.
44. ~~**Scroll-triggered entrance animations**~~ ✅ — useRevealOnScroll hook + RevealCell in MetricGrid. 12px translateY + opacity fade, 60ms stagger between siblings. Respects animate:false and prefers-reduced-motion. SSR/test safe.
45. ~~**Gauge min/max label collision**~~ ✅ — Default showMinMax=false (cleaner). When enabled, labels render inside SVG at arc endpoints, scaled with gauge radius. Auto-hidden below 9px. Removed disconnected HTML labels.
46. ~~**Responsive text scaling**~~ ✅ — container queries on all card shells, progressive disclosure (sparklines/subtitles/footnotes hide at narrow widths), Nivo font sizes scale with container width, axis labels hide at breakpoints.

---

## Developer Tooling (Low Priority)

40. **VS Code extension** — autocomplete snippets for MetricUI components, hover docs showing prop types and examples inline, diagnostics for invalid prop combinations. Nice-to-have since TypeScript + MCP already cover most of this. Build when the component count is high enough to justify it.

---
---

# Components & Visualizations

All components integrate with the MetricUI system: format engine, data states (loading/empty/error/stale), theming, animation, export, accessibility.

## Tier 1 — Already Built

| Component | Description |
|---|---|
| Line Chart | Time series, trends |
| Area Chart | Filled line, stacked areas |
| Bar Chart | Categorical comparison, stacked, grouped, horizontal |
| Donut / Pie Chart | Part-of-whole composition |
| Bar-Line Combo | Dual axis, bars + lines overlay |
| Sparkline (line) | Inline trend indicator |
| Sparkline (bar) | Inline bar micro-chart |
| KPI Card | Single metric with comparison, sparkline, goal, conditions |
| Stat Group | Multiple metrics in a dense grid row |
| Data Table | Tabular data with sort, pagination, footer, pinned columns |
| Badge | Styled label/tag |

## Tier 2 — Must Build (every dashboard needs some of these)

### Layout

| Component | Description |
|---|---|
| Dashboard Header | Top-level page header. Title, subtitle, status badges (live/stale), back navigation, action slots (theme toggle, export, refresh, share). Themed, responsive, consistent across all dashboards. Not just a section divider — the dashboard's identity bar. |

### Filters & Controls

| Component | Description |
|---|---|
| Filter Bar | Container that holds filters in a horizontal row with consistent spacing, collapse/expand on mobile. Integrates with MetricProvider filter context. |
| ~~Period Selector~~ ✅ | Date range picker with presets (Last 7d, This month, Q4, YTD, custom). Auto-computes comparison period. FilterProvider + useMetricFilters() context. Standalone onChange mode. Full checklist complete. |
| ~~Dropdown Filter~~ ✅ | Single or multi-select dropdown for dimension filtering. Region, plan, status, etc. Search, grouped options, count badges, FilterContext integration. Full checklist complete. |
| Search Filter | Text input that filters across a dimension. Customer name, product search. Debounced, clearable. |
| ~~Segment Toggle~~ ✅ | Pill-style toggle for switching between segments. "Daily / Weekly / Monthly" or "All / Active / Churned". Single/multi-select, icons, badges, color-coded segments, FilterContext integration. Full checklist complete. |
| ~~Filter Tags / Chips~~ ✅ | Shows active filters as removable chips. "Region: US ✕ Plan: Pro ✕". Clear all button. Context-driven — reads from FilterProvider automatically. Dismiss individual filters or clear all. maxVisible overflow, custom labels, exclude/include. Full checklist complete. |
| Comparison Toggle | Switch between "vs previous period", "vs same period last year", "vs target". Drives comparison data across all components. |
| Granularity Selector | Switch time granularity — hourly, daily, weekly, monthly. Changes how time series charts bucket data. |
| Refresh / Live Toggle | Manual refresh button and/or auto-refresh interval toggle. "Refresh every 30s" with countdown indicator. |

### Charts

| Component | Description |
|---|---|
| ~~Gauge / Radial~~ ✅ | Single value against a target on a circular arc. CPU usage, quotas, health scores. Pure SVG, 270°/180° arc, thresholds, target marker, comparison. Full 12-point checklist complete. |
| ~~Heatmap~~ ✅ | Two-dimensional matrix with color intensity. @nivo/heatmap. Sequential/diverging color scales, rounded cells, formatted labels, simpleData shorthand. Full 12-point checklist. |
| ~~Funnel~~ ✅ | Conversion funnel chart. @nivo/funnel. Vertical/horizontal, smooth/linear interpolation, conversion rate annotations, simpleData shorthand. Full checklist complete. |
| ~~Waterfall~~ ✅ | Sequential positive/negative changes from a starting value. Revenue bridges, P&L breakdowns. Built on @nivo/bar with stacked spacer technique. Connectors, value labels, positive/negative/total coloring. Full checklist complete. |
| ~~Progress / Bullet Chart~~ ✅ | Actual vs target vs threshold as horizontal bars. @nivo/bullet. Full/simple data formats, horizontal/vertical, configurable measure/marker sizes. Full checklist complete. |
| Histogram | Raw values binned automatically. Response times, age distributions. Different from bar chart — component determines the buckets. |
| Stacked Bar-Line Combo | Stacked bars with trend line overlay. Common in finance/SaaS. Preset or variant of BarLineChart. |

### Tables & Lists

| Component | Description |
|---|---|
| Grouped Data Table | Table with expandable row groups, subtotals. Hierarchical data model, expand/collapse interaction. |
| Sparkline Table | DataTable where columns are inline sparklines, progress bars, micro charts. Stock watchlists, server monitoring. |
| Leaderboard / Ranked List | Ordered list with rank numbers, values, and bar fill showing relative magnitude. Top customers, top salespeople. |

### Data-Driven Visual Components

| Component | Description |
|---|---|
| Status Indicator / Icon Metric | Pass a hidden value, show a colored icon based on threshold rules. Health checks, SLA compliance. |
| Icon Metric Grid | Wall of status indicators. Monitoring dashboards, system status pages. |
| Threshold Meter / Risk Bar | Horizontal bar divided into colored zones with a marker. Credit scores, risk levels, SLA gauges. |
| Quota / Usage Bar | Consumption against a limit. "4,521 / 10,000 API calls" with segmented fill. |
| Metric Comparison Card | Side-by-side comparison of two entities across multiple metrics with relative proportion bars. |
| Summary Banner / Headline Bar | Full-width strip with 3-5 key metrics inline. The at-a-glance bar above the dashboard. |
| Countdown / Timer | Time remaining until deadline or quota reset. Auto-ticking, conditional coloring as it approaches zero. |
| Data Freshness Indicator | When data was last updated, next refresh, source health. Persistent trust indicator. |

### Text & Content Components

| Component | Description |
|---|---|
| ~~Section Header~~ ✅ | Standalone title, subtitle, description popover, action slot, badge. Dense mode, border, spacing control, classNames. MetricGrid.Section delegates to SectionHeader. Full checklist complete. |
| ~~Callout / Alert~~ ✅ | Styled message block. Info, warning, success, error variants. Data-driven rules, embedded metrics, collapsible detail, action buttons, auto-dismiss. Full checklist complete. |
| ~~Divider~~ ✅ | Themed horizontal/vertical rule with optional label or icon. Solid/dashed/dotted variants, accent mode, spacing control, dense mode. Full checklist complete. |
| Empty Section Placeholder | First-run / no-data section state with illustration, message, and CTA. |

## Tier 3 — Strong Differentiators (not every dashboard, but high value)

### Filters & Controls

| Component | Description |
|---|---|
| Numeric Range Filter | Slider or dual-input for filtering by numeric range. "Revenue $10K–$50K", "Age 25–40". |
| Saved Views / Preset Selector | Dropdown to save and restore filter combinations. "My View", "Executive Summary", "Q4 Deep Dive". Serializes filter state to JSON. |
| Filter Summary Bar | Compact bar showing how many results match current filters, with a natural language summary. "Showing 234 of 1,891 customers matching 3 filters." |
| Cascading Filters | Filters that narrow subsequent filter options. Select "US" → state dropdown only shows US states. Select "Pro plan" → feature dropdown only shows Pro features. |

### Charts

| Component | Description |
|---|---|
| Scatter Plot | Two-variable correlation, bubble variant with size encoding. Segments, risk/return. Nivo installed. |
| Treemap | Hierarchical part-of-whole. Disk usage, budgets, portfolios. Nivo installed. |
| Sankey | Flow between stages with proportional width. User journeys, cost flows. Nivo installed. |
| Radar / Spider | Multi-axis comparison. Product scores, skill assessments, competitive analysis. |
| Candlestick / OHLC | Financial price data (open, high, low, close). Fintech/trading dashboards. |
| Range / Gantt | Horizontal bars showing start-to-end ranges on a timeline. Project timelines, subscription periods. |
| Calendar Heatmap | GitHub-style contribution grid. Activity frequency over months/years. |
| Step Chart | Line chart with hard right-angle steps. Pricing tiers, inventory levels, discrete changes. |
| Comparison Chart | Two mirrored horizontal bar charts back-to-back. Male vs female, this year vs last year. Population pyramids. |
| Dot Plot / Strip Chart | Scatter but one axis is categorical. Individual data points per category, shows distribution and outliers. |
| Metric Ticker / Scrolling Feed | Live-updating scrolling values. Real-time dashboards, monitoring, trading floors. |
| Area Difference / Surplus-Deficit | Two overlapping areas, fill colored green when A > B, red when B > A. Actual vs forecast. |

### Tables & Lists

| Component | Description |
|---|---|
| Pivot Table | Rows × columns with aggregated values, drag-to-rearrange dimensions. Most requested advanced table feature. |
| Activity Feed / Event Log | Timestamped list of events with icons and color coding. Admin panels, audit trails. |
| Progress List / Checklist | Items with completion status (complete/in-progress/pending/failed). Onboarding steps, migration progress. |

### Data-Driven Visual Components

| Component | Description |
|---|---|
| Diff / Change Summary | Before/after values with delta. "Active Users: 1,234 → 1,456 (+222)" with color. |
| Metric Tile Grid | Dense grid of small metric blocks with conditional background coloring. 20-30 metrics at a glance. |
| Sparkline Grid / Small Multiples | Grid of identical mini charts, one per category. Shared axes/scales. Revenue per product in a 4×5 grid. |
| Deviation Chart | Bars extending left/right from a zero line. NPS scores, budget variance, performance vs target. |
| KPI Scorecard Matrix | Grid of values with conditional background coloring. Rows are entities, columns are metrics. Halfway between table and heatmap. |

### Text & Content Components

| Component | Description |
|---|---|
| Metric Text / Metric Markdown | Text block where inline values get formatted and styled automatically. Mono font for numbers, body font for prose. Supports template syntax for format engine. |
| Insight Card | Text card with metric headline, trend indicator, supporting narrative, and source attribution. The editorial companion to a chart. |
| Annotation Callout | Standalone card highlighting a specific insight. "Revenue crossed $1M for the first time." Icon, accent, optional link. |
| Definition List / Glossary | Key-value pairs styled consistently. What does "MRR" mean? What's the calculation? |
| Changelog / Release Notes | Timestamped list of dashboard or data changes. Builds trust and context. |
| Code / Query Block | Syntax-highlighted, themed, collapsible block for underlying queries or formulas. |

## Tier 4 — Specialized (niche audiences, premium value)

### Charts

| Component | Description |
|---|---|
| Map / Choropleth | Geographic data colored by value. Revenue by country, users by state. Nivo geo installed. Needs TopoJSON. |
| Box Plot | Statistical distribution — median, quartiles, outliers. Data science, QA metrics. |
| Violin Plot | Full distribution shape. More informative than box plot, less familiar to non-technical users. |
| Slope Chart | Two time points connected by lines. Before/after comparisons, ranking shifts. |
| Bump Chart | Ranking changes over multiple time periods. Nivo supports this. |
| Marimekko / Mosaic | Two-dimensional part-of-whole. Width encodes one variable, height another. Market share by segment × region. |
| Parallel Coordinates | Multiple axes side by side, each data point a line across all. Multi-dimensional exploration. |
| Network / Force Graph | Nodes and edges showing relationships. Org charts, dependency graphs. Physics simulation rendering. |

### Data-Driven Visual Components

| Component | Description |
|---|---|
| Timeline | Horizontal chronological events with cards/tooltips. Deployment history, customer journey. Events as points, not ranges. |

## Tier 5 — "That's a cool chart... what is it?"

| Component | Description |
|---|---|
| Sunburst | Nested donut rings showing hierarchy. File system visualization, taxonomy breakdowns. |
| Chord Diagram | Circular flow showing bidirectional relationships. Migration flows, trade between countries. |
| Stream / ThemeRiver | Flowing stacked areas expanding/contracting around a central axis. Organic trend feel. |
| Waffle Chart | Grid of colored squares by category. More precise than pie for small percentages. |
| Lollipop Chart | Bar chart with line + dot instead of filled bar. Cleaner for many categories. |
| Dumbbell Chart | Two dots connected by a line per category. Shows gap between two values. |
| Polar / Rose Chart | Bar chart in circular form. Wind direction, cyclical data. |
| Word Cloud | Text sized by frequency. Feedback analysis, topic extraction. |
| Hexbin | Scatter with hexagonal bin aggregation. Better for large overlapping datasets. |
| Icicle Chart | Rectangular sunburst — horizontal/vertical hierarchy display. |
