/**
 * Single source of truth for MetricUI stats.
 * Used across README, homepage, docs, comparison pages.
 * Update here → everywhere updates.
 */

export const STATS = {
  /** Total visual components exported from the package */
  components: 44,
  /** Number of chart/visualization types */
  chartTypes: 18,
  /** Number of theme presets */
  themePresets: 8,
  /** Number of live demo dashboards */
  demos: 5,
  /** Total test count */
  tests: 675,
  /** Number of hooks exported */
  hooks: 14,
  /** Current version */
  version: "1.0.0",
} as const;
