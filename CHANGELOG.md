# Changelog

All notable changes to MetricUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

[0.3.0]: https://github.com/mpmcgowen/metricui/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/mpmcgowen/metricui/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/mpmcgowen/metricui/releases/tag/v0.2.0
