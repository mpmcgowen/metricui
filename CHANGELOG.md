# Changelog

All notable changes to MetricUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

[0.2.1]: https://github.com/mpmcgowen/metricui/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/mpmcgowen/metricui/releases/tag/v0.2.0
