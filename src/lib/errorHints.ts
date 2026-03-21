/**
 * Component-specific error hints for MetricUI's error boundary system.
 *
 * When a component crashes, the error boundary shows the relevant hint
 * to help developers diagnose the issue quickly.
 */

export const COMPONENT_HINTS: Record<string, string> = {
  AreaChart:
    "Pass flat rows with `index` and `categories`: `<AreaChart data={rows} index=\"month\" categories={[\"revenue\"]} />`. Or omit both to auto-infer. Nivo series format `{ id, data: [{x, y}] }[]` also works.",
  LineChart:
    "Pass flat rows with `index` and `categories`: `<LineChart data={rows} index=\"month\" categories={[\"revenue\"]} />`. Or omit both to auto-infer. LineChart is a thin wrapper over AreaChart.",
  BarChart:
    "Pass flat rows with `index` and `categories`: `<BarChart data={rows} index=\"month\" categories={[\"revenue\"]} />`. Or omit both to auto-infer. Legacy `keys`/`indexBy` props also work.",
  BarLineChart:
    "Pass flat rows with `index` and `categories` (mark line series with `axis: \"right\"`): `categories={[\"revenue\", { key: \"margin\", axis: \"right\" }]}`. Or use legacy `barData`/`lineData`/`barKeys`.",
  DonutChart:
    "Pass flat rows with `index` and `categories`: `<DonutChart data={rows} index=\"browser\" categories={[\"share\"]} />`. Native `{ id, label, value }[]` and `simpleData` also work.",
  HeatMap:
    "Pass flat rows with `index` and `categories`: `<HeatMap data={rows} index=\"day\" categories={[\"9am\", \"10am\"]} />`. Native `{ id, data: [{x, y}] }[]` and `simpleData` also work.",
  Gauge:
    "Check that `value` is a number between `min` and `max` (or null for null state). If using `thresholds`, each needs `{ value, color }`.",
  KpiCard:
    "Check that `value` is a number (or null for null state). If using `comparison`, ensure `comparison.value` is a number. If using `format`, check it's a valid FormatOption.",
  StatGroup:
    "Check that `stats` is an array of `{ label: string, value: string | number }` objects. For comparisons, include `previousValue` as a number.",
  DataTable:
    "Check that `data` is an array of objects and each column's `key` field exists in the data objects. Custom `render` functions must return valid ReactNode.",
  Sparkline:
    "Check that `data` is an array of numbers (or null for gaps). Ensure at least 2 non-null values for a visible line.",
  DashboardHeader:
    "Check that `title` is a string. If using `lastUpdated`, pass a valid Date object. If using `breadcrumbs`, pass an array of `{ label, href? }` objects.",
};
