# Changelog

All notable changes to MetricUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.6.0] - 2026-03-25

### Added

- **AI Insights — bring your own LLM.** `<DashboardInsight />` renders a floating chat button + slide-over sidebar. Connect any LLM (OpenAI, Anthropic, local models) via the `ai` prop on `<Dashboard>`. The AI auto-collects live data from every component on the dashboard and builds context-rich prompts. No hardcoded data — updates when filters change.
- **Three-level AI context.** `company` (who you are), `context` (what this dashboard measures), `aiContext` (per-component business hints). The more context the dev provides, the smarter the analysis.
- **@ mentions in AI chat.** Type `@` to reference specific charts/KPIs. Keyboard navigation (arrows + Enter). Multiple mentions. Mentions render as styled chips in messages.
- **Per-card AI sparkle icon.** Hover any card → sparkle icon in top-right. Click → opens AI chat pre-scoped to that component.
- **Auto data collection.** CardShell automatically registers component data with AiContext: KPI values, chart data (full rows ≤20, first 10 + stats for larger sets), table rows. Live — updates when filters change.
- **Streaming responses.** Token-by-token rendering with pulsing cursor and abort button.
- **Quick prompts.** "What's notable?", "What's at risk?", "Summarize" — customizable or hideable.
- **Chat persistence.** In-memory by default. Controlled mode with `messages`/`onMessage` for database persistence.
- **Citations.** LLM cites sources with `[[Component Title]]` rendered as styled accent chips.
- **`BaseComponentProps` / `DataComponentProps`.** Shared base types for all components. `aiContext`, `id`, `data-testid`, `className` defined once, inherited everywhere. New universal props added in one place.
- **All 5 demos wired with AI.** Analytics, SaaS, GitHub, Wikipedia, World — all have `<Dashboard>` wrapper, AI context, `<DashboardInsight />`, and 6-14 `aiContext` props each.
- **Analytics demo.** New GA-style dashboard with tab navigation, 4 views, per-device daily data, cross-filtering, comparison periods.

### Changed

- **Drill-down icon removed from KPIs.** Cards are clickable directly with a hover lift effect. Cleaner top-right with just sparkle (AI) and download (export) icons.
- **`DataRow` type** used across all components — eliminates `as never[]` casts.
- **MetricGrid fragment flattening** — auto-layout works through `<>` wrappers.
- **GitHub, Wikipedia, World demos** converted from individual providers to `<Dashboard>` wrapper.
- Homepage updated with all 5 demos and AI Insights as headline feature.
- MCP server, llms.txt, docs, sidebar all updated for 0.6.

### Fixed

- FilterBar nested button hydration error.
- TooltipWrapper infinite re-render loop.
- KPIs and DataTables now register with AiContext via `aiTitle`.
- Doc page TOC width standardized to w-40 across all 31 pages.

## [0.5.0] - 2026-03-25

### Added

- **`<Dashboard>` wrapper** — replaces the 5-provider nesting pattern (MetricProvider + FilterProvider + CrossFilterProvider + LinkedHoverProvider + DrillDown.Root) with a single component and flat props. Every hook works inside.
- **`DashboardNav`** — tab and scroll navigation for multi-view dashboards. Sliding underline indicator, keyboard navigation (arrows, Home/End), optional URL sync. Two modes: `"tabs"` (switch content) and `"scroll"` (smooth-scroll to section IDs with IntersectionObserver highlight).
- **`FilterBar.Nav` slot** — embed DashboardNav inside FilterBar. Tabs render above filter controls, sharing one sticky frosted-glass card.
- **Smart column inference** — DataTable auto-detects column types from values when `columns` is omitted. Numbers → right-aligned + sortable, booleans → badge, Date/ISO strings → date, low-cardinality strings (≤10 unique) → badge, number arrays → sparkline.
- **Filter convenience hooks** — `useFilterValue(field)` returns `string[]`, `useHasComparison()` returns `boolean`, `useActiveFilterCount()` returns `number`. No null-coalescing needed.
- **Analytics demo** — GA-style dashboard at `/demos/analytics` with tab mode navigation, 4 views (Overview, Acquisition, Engagement, Conversions), per-device daily data, cross-filter on traffic sources, comparison periods, drill-downs.

### Changed

- **`DataRow` type** — single universal row constraint (`Record<string, any>`) replaces `Record<string, unknown>` across DataTable, CardShell, Export, DrillDown, and all chart components. Typed interfaces now work directly — no more `as never[]` casts.
- **BarChart `data` prop** relaxed from `Record<string, string | number>[]` to `DataRow[]`.
- **MetricGrid fragment flattening** — auto-layout now works through React fragment wrappers (`<>...</>`). KPIs inside fragments no longer stack vertically.
- MCP server, llms.txt, and docs updated for all 0.5 features.

### Fixed

- FilterBar nested button hydration error (header changed from `<button>` to `<div role="button">`).
- TooltipWrapper infinite re-render loop (replaced setState with direct DOM mutation).

## [0.4.0] - 2026-03-24

### Added

- **FilterBar** — collapsible filter container with auto-tags, badge, active filter count, clear-all button, smooth accordion animation. Supports `FilterBar.Primary` / `FilterBar.Secondary` slots for organizing filters.
- **DrillDown system** — click any component to open a detail panel. `DrillDown.Root` provider manages the drill stack with breadcrumb navigation. Two presentation modes: slide-over (right panel) and modal (centered). Nested drills up to 4 levels with auto-breadcrumbs. Escape/back/backdrop to close.
- **`drillDown` prop** on all 12 data components. `drillDown={true}` for zero-config auto-table, `drillDown={(event) => <content>}` for full control. DrillDown beats crossFilter when both are set.
- **Export system** — `exportable` prop on MetricProvider (global) or per-component. PNG image, CSV download, clipboard copy. Clean filenames: "Revenue by Country — DevTools — Mar 24, 2026.csv". Filter context metadata in CSV exports.
- **CardShell** — unified card wrapper replacing duplicated shell code. KpiCard, all charts, DataTable, StatusIndicator now share one card architecture. New features added to CardShell automatically work on every data component.
- **Auto empty states** — components auto-detect empty data and show a smart default message. Three tiers: automatic ("Nothing to show — try adjusting your filters"), global override via `MetricProvider.emptyState`, per-component override via `empty` prop.
- **`useCrossFilteredData` hook** — one-line convenience for filtering data by cross-filter selection.
- **`referenceDate` prop on FilterProvider** — anchor preset calculations (Last 30 days, YTD, etc.) to a historical date instead of today. Essential for demos and tests with historical data.
- **`ExportableConfig` type** — unified `boolean | { data: Record<string, unknown>[] }` for export configuration. Pass `{ data: rawData }` to override CSV export data (show summary chart, export detail).
- **`drillDownMode` prop** — per-component control of drill presentation (slide-over or modal).
- **`badge` prop on FilterBar** — dev-controlled inline badge for result counts or status.
- **`collapsible` prop on FilterBar** — manual expand/collapse with accordion animation.
- **SegmentToggle clears dimension on default value** — selecting the default option clears the FilterContext dimension instead of writing it.
- All 4 demos: FilterBar, rich drill-downs (30+ total), export enabled, all filters wired to FilterContext.

### Changed

- **Unified card architecture** — KpiCard, ChartContainer, DataTable, StatusIndicator all use CardShell internally. One code path for card chrome, variant, dense, data states, export, drill-down.
- **All SegmentToggles and DropdownFilters use `field` prop** — no more local state bypass, everything writes to FilterContext for consistent collapsed summary display.
- **SegmentToggle animation speed** — reduced from 1200ms (spring duration) to 200ms for snappy toggling.
- **PeriodSelector comparison** — wired with real data in SaaS demo. Comparison periods derive from filtered datasets.
- **SaaS demo completely rebuilt** — 500 generated accounts, all KPIs/charts derived from filtered data, full period + industry + country cross-filter cascade.
- MCP server and llms.txt updated for all 0.4 features.

### Fixed

- Export dropdown z-index (portal to document.body)
- Export button click triggering drill-down (stopPropagation on dropdown container)
- PNG export tainted canvas (html2canvas + CSS variable pre-resolution)
- Export dropdown visible in captures (.mu-exporting CSS class)
- PeriodSelector nested button hydration error (span with role="button")
- Nivo tooltip render loop in AreaChart/BarChart (setTimeout vs queueMicrotask)
- Description popover z-index (portal to document.body)
- Value flash border-radius inheritance

## [0.3.0] - 2026-03-23

### Added

- **CrossFilterProvider / useCrossFilter** — click-based filtering for charts and tables. Signal-only: captures the user's selection into context, you filter your own data. Same philosophy as FilterProvider.
- **LinkedHoverProvider / useLinkedHover** — syncs hover state (crosshairs, tooltips) across charts. Wrap in the provider, charts auto-participate.
- **useValueFlash** — hook that returns a CSS class for a brief highlight animation when data changes. Respects `prefers-reduced-motion` and MetricProvider's `animate` setting.
- **`npx metricui init`** — interactive setup CLI. Detects framework (Next.js, Vite, React), configures AI tools (Cursor rules, Claude Code, MCP server), and scaffolds a starter dashboard.
- **`crossFilter` prop** on BarChart, DonutChart, AreaChart, HeatMap, and DataTable — emits `crossFilter.select()` on click. Pass `true` to use the index field, or `{ field: "name" }` to override.
- **Stable donut colors** — DonutChart remembers color assignments across data changes. Filtering won't change a slice's color.
- **Feature matrix cookbook recipe** — DataTable with custom renders for plan comparison grids.
- **Public roadmap page** at `/roadmap` with version milestones and feature highlights.
- **Interactions guide** covering linked hover and value flash with live demos.
- **Cross-filtering section** added to the Filtering guide with setup, API reference, and usage patterns.
- Getting Started guide rewritten around `npx metricui init`.

### Changed

- All raw HTML tables in docs replaced with DataTable (dogfooding).
- SaaS demo API Usage card replaced with KpiCard + goal prop.
- Roadmap page badges now use the Badge component.
- Interactions demo layouts use MetricGrid instead of raw CSS grid.
- Value flash animation now inherits `border-radius` from the parent container.
- MCP server knowledge, prompts, and server instructions updated for all 0.3.0 features.
- llms.txt updated with CrossFilterProvider, LinkedHoverProvider, useValueFlash, and init CLI.
- FilterTags supports displaying active cross-filter selections.

## [0.2.1] - 2026-03-22

### Changed

- Nivo chart packages are now bundled as direct dependencies — `npm install metricui` is all you need, no extra peer dependency installs required

### Added

- `metricui` CLI with `--version`, `docs`, `demos`, `github`, and `mcp` commands
- Postinstall welcome message with quick-start links
- MCP Server documentation page and sidebar navigation
- Improved README with screenshots, doc links, and before/after MCP comparison

## [0.2.0] - 2026-03-20

### Added

- Initial public release
- KpiCard, StatGroup, AreaChart, LineChart, BarChart, BarLineChart, DonutChart, Sparkline, Gauge, HeatMap, Funnel, Waterfall, BulletChart, DataTable
- DashboardHeader, SectionHeader, Divider, MetricGrid
- FilterProvider, PeriodSelector, SegmentToggle, DropdownFilter, FilterTags
- Callout, StatusIndicator, Badge
- MetricProvider with 8 theme presets
- Format engine (currency, percent, compact, duration, custom)
- Built-in data states (loading, empty, error, stale)
- MCP server for AI-assisted dashboard generation

[0.6.0]: https://github.com/mpmcgowen/metricui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/mpmcgowen/metricui/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/mpmcgowen/metricui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/mpmcgowen/metricui/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/mpmcgowen/metricui/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/mpmcgowen/metricui/releases/tag/v0.2.0
