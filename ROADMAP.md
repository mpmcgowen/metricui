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

## 0.8.0 — "The Polish" (Shipped)

**Headline: Saved views, DRY architecture, accessibility, and doc site infrastructure.** The release that turned a feature-complete library into a well-engineered one.

### The Wow

- **Saved views & shareable links** — `useDashboardState()` captures the entire dashboard state (filters, period, dimensions, cross-filter) as a JSON-safe snapshot. `toSearchParam()` / `fromSearchParam()` for URL-based sharing. Save to localStorage, database, or URL — developer's choice.
- **Centralized chart interaction** — `useChartInteraction` hook replaces 6 separate hook calls duplicated across 14 chart components. DrillDown-vs-crossFilter priority, auto drill table, tooltip hints — all defined once.
- **Doc site infrastructure** — 6 shared doc components (DocPageLayout, ComponentDocFooter, NotesList, GuideHero, PlaygroundSection, Code) eliminate 1,400+ lines of boilerplate. Every doc page uses the same system. Add a new page = write only unique content.
- **Fixed-position TOC** — OnThisPage redesigned as a dbt-style right-rail nav with accent bar active indicator. Floats in the margin, never steals content width.

### Supporting Work

- **Accessibility** — SegmentToggle gains `role="radiogroup"` + `aria-checked`. DataStateWrapper announces loading/error/empty to screen readers via `aria-live`. FilterBar gains `aria-expanded`. DashboardInsight icon buttons gain `aria-label`.
- **API consistency** — Sparkline gains `aiContext` prop. Gauge gains `action` prop. Full API audit documented remaining gaps.
- **useDropdown hook** — shared dropdown behavior with keyboard nav + ARIA, ready to wire into DropdownFilter, PeriodSelector, ExportButton.
- **Component-data expansion** — 11 new entries (7 charts + DashboardNav, ExportButton, DashboardInsight, DrillDown). 42 total components in the MCP knowledge base.
- **All 38 component doc pages** standardized to shared system (ComponentHero → demos → PropsTable → Notes → RelatedComponents).

---

## 0.9.0 — "Rock Solid"

**Headline: Nothing new, everything better.** This is the release where MetricUI earns the "production-ready" label.

### Accessibility (finish the job)

- **Wire `useDropdown`** into DropdownFilter, PeriodSelector, ExportButton — full keyboard navigation (arrow keys, Escape, Home/End) + ARIA roles
- **DashboardInsight focus trap** — `role="dialog"`, `aria-modal="true"`, Tab key stays inside the sidebar
- **DashboardNav roving tabindex** — only active tab gets `tabIndex={0}`, inactive tabs get `tabIndex={-1}`
- **Chart aria-labels** — every chart gets `role="img"` with an auto-generated `aria-label` summarizing the data
- **DrillDownPanel focus trap** — local Escape handler, keep Tab within the dialog
- **Opacity/contrast fixes** — audit all `opacity-40` through `opacity-70` on text, ensure WCAG AA compliance

### API Consistency (finish the job)

- **Gauge** — add modern `drillDown` (true | function), `drillDownMode`, `crossFilter`, `tooltipHint`
- **BulletChart** — add `drillDown`, `drillDownMode`, `crossFilter`, `tooltipHint`
- **StatGroup** — wire up `empty`, `error`, `stale` data states (currently inherited but ignored)
- **DataTable** — add `drillDown={true}` auto-drill shorthand

### Testing & Performance

- **Edge case tests** — 0 data points, 10,000 data points, negative values, null values, extremely long strings, emoji in labels
- **Interaction tests** — click bar → drill-down opens → correct data renders. Full user flow coverage.
- **Accessibility tests** — axe-core on every component, every state
- **Performance benchmarks** — 50 charts on one page, 1000-row tables, measure FPS and memory
- **DX smoke test** — fresh Next.js project, `npm install metricui`, build a dashboard from scratch, document every friction point

### Supporting Work

- **i18n** — translatable data state messages ("No data" / "Error" / "Loading"), RTL layout support
- **Color-blind safe mode** — `<MetricProvider colorBlindSafe>` swaps to distinguishable palette with optional pattern fills
- **Migration guide** — comprehensive guide covering every breaking change from 0.2 → 0.9
- **Micro-interactions polish** — the 1% details that make the library feel premium

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
