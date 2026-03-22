# Changelog

All notable changes to the MetricUI MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.1] - 2026-03-22

### Changed

- Setup guide no longer lists Nivo as a separate install — reflects that MetricUI now bundles all chart dependencies
- Server version bumped to match metricui@0.2.1

## [0.2.0] - 2026-03-20

### Added

- Initial release
- Tools: `list_components`, `search_components`, `search_docs`, `get_component_api`, `get_component_example`, `generate_dashboard`, `generate_data_shape`, `generate_table_columns`, `generate_provider_config`, `suggest_format`, `validate_props`, `get_setup_guide`, `init_project`
- Resources: component catalog, format engine reference, theme presets
- Prompts: dashboard generation, component migration

[0.2.1]: https://github.com/mpmcgowen/metricui/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/mpmcgowen/metricui/releases/tag/v0.2.0
