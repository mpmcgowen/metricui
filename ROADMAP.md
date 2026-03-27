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

## 0.3.0 — "Dashboards That React" (Shipped)

**Headline: Cross-filtering.** Click a bar in one chart, every other component on the page responds. No dashboard framework does this out of the box with zero config.

### The Wow

- **Cross-filtering** — `<FilterProvider>` gains a selection context. Click a bar segment, donut slice, or table row → every sibling chart/card/table filters to that segment. One prop: `crossFilter`. Works client-side by default, exposes selection state for server-side filtering. Click again or press Escape to clear. Animated transitions as data shifts.
- **Linked hover** — `<HoverProvider>` shares cursor position across components. Hover a point on a line chart → corresponding bar highlights, table row highlights, KPI card shows that period's value. Vertical crosshair syncs across all time series. The "Bloomberg terminal feel" — everything moves together.
- **Value flash** — when any KpiCard, StatGroup, or chart receives new data, the changed value briefly pulses (subtle background flash + count-up animation from old → new). Real-time dashboards feel alive instead of just replacing numbers. Respects reduced-motion.

### Supporting Work

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

## 0.5.0 — "The DX Release" (Shipped)

**Headline: Developer experience.** Everything that makes MetricUI faster to use, less boilerplate, fewer casts, smarter defaults.

### The Wow

- **`<Dashboard>` wrapper** — 5 providers → 1 component. `<Dashboard theme="emerald" filters={{ defaultPreset: "30d" }} exportable>` replaces MetricProvider + FilterProvider + CrossFilterProvider + LinkedHoverProvider + DrillDown.Root.
- **Zero `as never[]` casts** — `DataRow` type across the entire library. Typed interfaces just work with `<DataTable data={accounts} />`.
- **Smart column inference** — omit `columns` on DataTable and it auto-detects numbers, dates, booleans, badges, sparklines from the actual values.
- **DashboardNav** — tab and scroll navigation inside FilterBar. Multi-view dashboards with persistent filters. Sliding indicator, keyboard nav, URL sync.

### Supporting Work

- **Filter convenience hooks** — `useFilterValue("region")`, `useHasComparison()`, `useActiveFilterCount()`. No null-coalescing.
- **FilterBar.Nav slot** — embed DashboardNav inside FilterBar for one unified sticky bar.
- **MetricGrid fragment flattening** — auto-layout works through `<>` wrappers.
- **Analytics demo** — GA-style dashboard with tab mode, 4 views, per-device filtering, cross-filter, comparisons.

### New Components / Exports
| Component | Description |
|---|---|
| Dashboard | All-in-one wrapper replacing 5 nested providers. |
| DashboardNav | Tab/scroll navigation with sliding indicator and keyboard support. |
| FilterBar.Nav | Slot for embedding DashboardNav inside FilterBar. |
| useFilterValue | Read a dimension filter as string[] — no null checks. |
| useHasComparison | Boolean: is comparison mode active? |
| useActiveFilterCount | Number of active filters. |

---

## 0.6.0 — "The AI Layer" (Shipped)

**Headline: Bring-your-own-LLM dashboard intelligence.** Every dashboard becomes conversational — ask questions about your data, get insights with citations, all powered by whatever model you choose.

### The Wow

- **DashboardInsight** — chat panel that lives inside the dashboard. End users ask questions about the data they're looking at, get streaming answers with citations that link back to specific cards and metrics. Per-card sparkle button for "explain this" on any component. `@` mentions to reference specific metrics in questions.
- **Auto data collection** — `AiContext` system automatically gathers dashboard state (filters, visible metrics, card values, trends) into structured context that feeds the LLM. Three-level context hierarchy: dashboard-level, section-level, card-level. The model always knows what the user is looking at.
- **BYO LLM** — no vendor lock-in. Pass your own API key and endpoint. Works with Claude, GPT, Gemini, local models — anything that speaks the standard chat API. The dashboard provides the context; you choose the brain.
- **Streaming responses** — answers stream in token-by-token with a typing indicator. Citations render inline as clickable badges that highlight the referenced card on the dashboard. Sidebar and modal display modes.

### Supporting Work

- **Prompt framework** — structured system prompts that give the LLM dashboard context, formatting rules, and citation instructions. Developers can extend with custom instructions.
- **Citation system** — LLM responses include structured citations (`@card-id`) that resolve to visual highlights on the dashboard. Click a citation → the referenced card scrolls into view and pulses.
- **Per-card AI actions** — sparkle icon on any data component opens DashboardInsight pre-filled with "Explain this [card title]" including that card's data as context.

### New Components / Exports
| Component | Description |
|---|---|
| DashboardInsight | Chat panel with streaming LLM answers, citations, and @ mentions. |
| AiContext | Auto-collects dashboard state into structured LLM context. Three-level hierarchy. |
| useAiContext | Hook to read/extend the AI context from any component. |

---

## 0.7.0 — "The Chart Expansion" (Shipped)

**Headline: Seven new chart types, from scatter plots to choropleths.** The visual vocabulary doubles — every chart Nivo-backed, fully integrated with MetricUI's format engine, tooltips, data states, and cross-filtering.

### The Wow

- **ScatterPlot** — two-variable correlation with optional bubble size encoding. Segments, quadrant labels, trend line. Nivo-backed.
- **Treemap** — hierarchical part-of-whole. Click to zoom into a segment (animated). Nivo-backed.
- **Calendar Heatmap** — GitHub-style contribution grid. Activity frequency over months/years. Click a cell to filter.
- **Radar / Spider** — multi-axis comparison with overlay support. Product scores, competitive analysis.
- **Sankey** — flow visualization with proportional-width links between stages. User journeys, cost allocation, pipeline flows. Click a node to highlight upstream/downstream paths.
- **Choropleth** — geographic data colored by value. Bundled `worldFeatures` (ISO alpha-3 codes) and `usStatesFeatures` (2-letter abbreviations). `tooltipLabel` prop with country/state name resolution. No external GeoJSON required for common use cases.
- **Bump Chart** — ranking changes over multiple periods. Who's rising, who's falling. Nivo-backed.

### Supporting Work

- **Bundled map features** — `worldFeatures` and `usStatesFeatures` ship with the library. Import and pass directly to Choropleth — no downloading shapefiles or wrangling TopoJSON.
- **Tick collision fix** — auto label width estimation prevents overlapping axis labels on dense charts.
- **Granularity toggle cookbook recipe** — documented pattern for switching between daily/weekly/monthly views with the same data.
- **Full documentation** — every new chart has a dedicated doc page with live interactive demos, props table, and usage examples.

### New Components
| Component | Description |
|---|---|
| ScatterPlot | Two-variable correlation with bubble size, segments, and trend line. |
| Treemap | Hierarchical part-of-whole with click-to-zoom. |
| CalendarHeatmap | GitHub-style activity grid with click-to-filter. |
| Radar | Multi-axis comparison with overlay support. |
| Sankey | Flow visualization with click-to-highlight paths. User journeys, cost flows. |
| Choropleth | Geographic map colored by value. Bundled world + US features. |
| Bump | Ranking changes over multiple periods. |

---

## 0.8.0 — "Interactive Dashboards"

**Headline: Action buttons, inline edits, form inputs, and role-based visibility.** Dashboards stop being read-only reports and become operational tools where users take action on the data they see.

### The Wow

- **Action buttons** — attach actions to any card, table row, or chart element. "Approve", "Flag", "Assign" buttons that fire callbacks or POST to webhooks. The dashboard becomes a control plane, not just a display.
- **Inline edits** — editable cells in DataTable, editable KPI targets, editable thresholds. Click a value, type a new one, save. Optimistic updates with rollback on error. Turns static reports into live operational tools.
- **Form inputs** — date pickers, text inputs, number steppers, and toggles that live inside the dashboard and feed into filter context or action payloads. The missing link between "viewing data" and "doing something about it."
- **Webhook actions** — `onAction` prop that POSTs structured payloads to an endpoint. Card ID, row data, user action, current filters — everything the backend needs to process the action. Built-in confirmation dialogs and success/error toasts.

### Supporting Work

- **Role-based visibility** — `minRole` prop on components, columns, export buttons, and drill-down triggers. Pass `role` via Dashboard context. Components below the user's role render as disabled, hidden, or redacted. No more building separate dashboards for admins vs viewers.
- **Dashboard identity context** — `identity` prop on Dashboard for user ID, role, and custom claims. Flows through to all components for RLS-aware rendering and audit trails on actions.
- **DataStory** — `<DataStory steps={[...]}>`. Guided walkthrough mode for any dashboard. Each step highlights a component, dims everything else, and shows a narrative card. Built for quarterly reviews, onboarding tours, and async reports.
- **Dashboard state serialization** — `useDashboardState()` returns the entire dashboard state (filters, selections, drill-downs, toggles, sort order) as a JSON blob. Save it, share it as a URL, restore it. "Saved views" for end users.

### New Components
| Component | Description |
|---|---|
| ActionButton | Contextual action on cards/rows/chart elements. Webhook integration. |
| InlineEdit | Click-to-edit values in tables, cards, and thresholds. Optimistic updates. |
| FormInput | Date pickers, text inputs, number steppers for in-dashboard data entry. |
| DataStory | Guided narrative walkthrough. Highlights components in sequence with story cards. |

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
| Sunburst | Nested donut rings for hierarchies. |
| Stream / ThemeRiver | Flowing stacked areas. Organic trend visualization. |
| Waffle Chart | Grid of squares by category. Precise small-percentage display. |
| Network / Force Graph | Nodes and edges. Org charts, dependency graphs. |
| Histogram | Auto-binning from raw values. Response times, age distributions. |

### More Components
| Component | Description |
|---|---|
| SmallMultiples | Grid of mini-charts split by dimension. Shared scales, synced hover, click-to-expand. |
| SparklineTable | DataTable with inline sparklines, progress bars, and micro-charts per cell. |
| InsightCard | Template-based plain-English data summary. Trends, comparisons, anomalies in prose. |
| MetricText | Inline formatted values in body copy. Template syntax + format engine. |
| Leaderboard | Ranked list with values, bar fills, and rank change indicators. |
| QuotaBar | Consumption vs limit with segmented fill and conditional coloring. |
| SummaryBanner | Full-width at-a-glance metrics strip. |
| Grouped DataTable | Expandable row groups with subtotals and aggregate functions. |
| MetricComparison | Side-by-side entity comparison with proportion bars. |
| DeviationChart | Bars extending left/right from zero line. |
| ActivityFeed | Timestamped event list with icons and color coding. |
| DiffSummary | Before/after value comparison with delta and conditional color. |
| SnapshotDiff | Visual before/after overlay on any chart. Green fills for increases, red for decreases. |
| RefreshToggle | Auto-refresh interval control with countdown ring. |
| DataFreshness | Source health + last sync timestamp. Trust indicator. |

### Advanced Features
| Feature | Description |
|---|---|
| useMetricQuery | Fetcher → { data, loading, error, stale, refresh } that spreads onto any component. Polling, retry, stale detection. |
| Live mode | `<MetricProvider live>` — spring transitions, auto count-up, pulse on change. Presentation hint for real-time dashboards. |
| Anomaly detection | `anomalyDetection` prop — rolling mean + std dev bands, pulsing dots on outliers. Client-side, no ML. |
| Chart annotation layer | Click any data point → pin a note. Collaborative context on data. |
| Pivot Table | Rows x columns with aggregated values, drag-to-rearrange. |
| Cascading Filters | Filters that narrow subsequent filter options dynamically. |
| Saved Views | Persist and share filter/dashboard state configurations. |
| Numeric Range Filter | Slider or dual-input for range filtering. |
| Cross-component drill | Click in one component → another elsewhere responds. |
| VS Code Extension | Snippets, hover docs, invalid prop diagnostics. |
| Collaborative annotations | Real-time multi-user commenting on data points. |
| Embed mode | `<MetricProvider embed>` — strips chrome, respects host theme, postMessage resize. For iframing. |
| Print/PDF mode | `<MetricProvider printMode>` — strips hover effects, forces light, optimizes for A4/Letter. |
