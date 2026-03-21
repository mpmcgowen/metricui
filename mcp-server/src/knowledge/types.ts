/**
 * MetricUI MCP Server — Type Knowledge Base
 *
 * Every TypeScript type used across the library, documented
 * with full definitions and relationships.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface TypeDef {
  name: string;
  kind: "interface" | "type" | "enum";
  definition: string;
  description: string;
  relatedTypes: string[];
}

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export const TYPES: TypeDef[] = [
  // === Format Engine Types ===

  {
    name: "FormatOption",
    kind: "type",
    definition: `type FormatOption = FormatStyle | "compact" | FormatConfig;`,
    description: 'Shorthand format specifier. Pass a string like "currency", "percent", "compact", "number", "duration" or a full FormatConfig object.',
    relatedTypes: ["FormatStyle", "FormatConfig"],
  },
  {
    name: "FormatStyle",
    kind: "type",
    definition: `type FormatStyle = "number" | "currency" | "percent" | "duration" | "custom";`,
    description: "The five core format styles supported by the format engine.",
    relatedTypes: ["FormatOption", "FormatConfig"],
  },
  {
    name: "FormatConfig",
    kind: "interface",
    definition: `interface FormatConfig {
  style: FormatStyle;
  currency?: string;           // ISO 4217 code, e.g. "USD"
  compact?: CompactMode;       // true/"auto"/false/"thousands"/"millions"/"billions"/"trillions"
  precision?: number;          // decimal places
  prefix?: string;
  suffix?: string;
  locale?: string;             // BCP 47 locale
  percentInput?: PercentInput; // "whole" (default) or "decimal"
  durationInput?: DurationInput;
  durationStyle?: DurationStyle;
  durationPrecision?: DurationPrecision;
}`,
    description: "Full format configuration object. All fields except `style` are optional with sensible defaults.",
    relatedTypes: ["FormatStyle", "CompactMode", "PercentInput", "DurationInput", "DurationStyle", "DurationPrecision"],
  },
  {
    name: "CompactMode",
    kind: "type",
    definition: `type CompactMode = boolean | "auto" | "thousands" | "millions" | "billions" | "trillions";`,
    description: 'Controls number compacting. true/"auto" auto-picks K/M/B/T based on magnitude. Fixed modes always divide by the specified scale.',
    relatedTypes: ["FormatConfig"],
  },
  {
    name: "PercentInput",
    kind: "type",
    definition: `type PercentInput = "whole" | "decimal";`,
    description: '"whole" (default): 12 means 12%. "decimal": 0.12 means 12% (multiplied by 100).',
    relatedTypes: ["FormatConfig"],
  },
  {
    name: "DurationInput",
    kind: "type",
    definition: `type DurationInput = "milliseconds" | "seconds" | "minutes" | "hours";`,
    description: "What unit the raw duration value represents. Default: seconds.",
    relatedTypes: ["FormatConfig"],
  },
  {
    name: "DurationStyle",
    kind: "type",
    definition: `type DurationStyle = "compact" | "long" | "clock" | "narrow";`,
    description: '"compact": "5m 30s". "long": "5 minutes 30 seconds". "clock": "5:30". "narrow": "5.5m" (single unit, decimal).',
    relatedTypes: ["FormatConfig"],
  },
  {
    name: "DurationPrecision",
    kind: "type",
    definition: `type DurationPrecision = "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";`,
    description: 'Smallest unit to display. e.g. "minutes" means "2h 30m" (no seconds).',
    relatedTypes: ["FormatConfig"],
  },
  {
    name: "ComparisonMode",
    kind: "type",
    definition: `type ComparisonMode = "absolute" | "percent" | "both";`,
    description: 'How to display the change: "percent" (default) shows "+12.5%", "absolute" shows "+$1,500", "both" shows "+$1,500 (+12.5%)".',
    relatedTypes: ["ComparisonConfig", "ComparisonResult"],
  },
  {
    name: "ComparisonResult",
    kind: "interface",
    definition: `interface ComparisonResult {
  percentChange: number;
  absoluteChange: number;
  trend: "positive" | "negative" | "neutral";
  label: string;
}`,
    description: "The computed result of comparing current vs previous values. Returned by computeComparison().",
    relatedTypes: ["ComparisonMode", "ComparisonConfig"],
  },

  // === Condition Types ===

  {
    name: "SimpleOperator",
    kind: "type",
    definition: `type SimpleOperator = "above" | "below" | "between" | "equals" | "not_equals" | "at_or_above" | "at_or_below";`,
    description: "Comparison operators for conditional formatting rules.",
    relatedTypes: ["Condition", "SimpleCondition", "ConditionCheck"],
  },
  {
    name: "ConditionCheck",
    kind: "interface",
    definition: `interface ConditionCheck {
  operator: SimpleOperator;
  value?: number;
  min?: number;   // for "between"
  max?: number;   // for "between"
}`,
    description: "A single check used standalone or inside compound rules.",
    relatedTypes: ["SimpleOperator", "CompoundCondition"],
  },
  {
    name: "SimpleCondition",
    kind: "interface",
    definition: `interface SimpleCondition {
  when: SimpleOperator;
  value?: number;
  min?: number;
  max?: number;
  color: string;  // Named ("emerald","red") or CSS ("#ff6b6b","rgb(...)")
}`,
    description: "A single condition: one check, one color. First match wins.",
    relatedTypes: ["Condition", "SimpleOperator"],
  },
  {
    name: "CompoundCondition",
    kind: "interface",
    definition: `interface CompoundCondition {
  when: "and" | "or";
  rules: ConditionCheck[];
  color: string;
}`,
    description: "Multiple checks combined with AND/OR logic.",
    relatedTypes: ["Condition", "ConditionCheck"],
  },
  {
    name: "Condition",
    kind: "type",
    definition: `type Condition = SimpleCondition | CompoundCondition;`,
    description: "A conditional formatting rule — either a simple check or a compound AND/OR.",
    relatedTypes: ["SimpleCondition", "CompoundCondition"],
  },

  // === Goal Types ===

  {
    name: "GoalConfig",
    kind: "interface",
    definition: `interface GoalConfig {
  value: number;
  label?: string;           // Default: "Target"
  showProgress?: boolean;   // Default: true
  showTarget?: boolean;     // Default: false
  showRemaining?: boolean;  // Default: false
  color?: string;           // Progress bar color
  completeColor?: string;   // Color when complete. Default: "emerald"
}`,
    description: "Goal/target configuration for KpiCard progress bars.",
    relatedTypes: ["FormatOption"],
  },

  // === Shared Component Types ===

  {
    name: "ComparisonConfig",
    kind: "interface",
    definition: `interface ComparisonConfig {
  value: number;
  label?: string;
  mode?: ComparisonMode;     // Default: "percent"
  invertTrend?: boolean;     // Flip colors (for metrics where down is good)
  threshold?: {
    warning: number;
    critical: number;
  };
}`,
    description: "Configuration for a comparison badge in KpiCard. Computes change from current vs this previous value.",
    relatedTypes: ["ComparisonMode", "ComparisonResult"],
  },
  {
    name: "TrendIconConfig",
    kind: "interface",
    definition: `interface TrendIconConfig {
  up?: React.ReactNode;
  down?: React.ReactNode;
  neutral?: React.ReactNode;
}`,
    description: "Custom trend icons for comparison badges in KpiCard.",
    relatedTypes: ["ComparisonConfig"],
  },
  {
    name: "NullDisplay",
    kind: "type",
    definition: `type NullDisplay = "zero" | "dash" | "blank" | "N/A" | string;`,
    description: 'How to display null/undefined/NaN/Infinity values. "dash" shows em-dash, "zero" formats as 0, "blank" shows empty string, or pass any custom string.',
    relatedTypes: ["MetricConfig"],
  },
  {
    name: "ChartNullMode",
    kind: "type",
    definition: `type ChartNullMode = "gap" | "zero" | "connect";`,
    description: '"gap" (default): skip point, visible gap. "zero": treat null as 0. "connect": bridge over nulls connecting adjacent non-null points.',
    relatedTypes: ["MetricConfig"],
  },
  {
    name: "SparklineType",
    kind: "type",
    definition: `type SparklineType = "line" | "bar";`,
    description: "Sparkline visualization type.",
    relatedTypes: ["SparklineProps"],
  },
  {
    name: "TitlePosition",
    kind: "type",
    definition: `type TitlePosition = "top" | "bottom" | "hidden";`,
    description: 'Where the title appears relative to the value in KpiCard. "hidden" hides the title entirely.',
    relatedTypes: [],
  },
  {
    name: "TitleAlign",
    kind: "type",
    definition: `type TitleAlign = "left" | "center" | "right";`,
    description: "Horizontal alignment for KpiCard content.",
    relatedTypes: ["TitlePosition"],
  },
  {
    name: "CardVariant",
    kind: "type",
    definition: `type CardVariant = "default" | "outlined" | "ghost" | "elevated";`,
    description: 'Visual variant for cards and chart containers. "default": solid bg + border. "outlined": transparent bg + thicker border. "ghost": tinted bg, no border. "elevated": solid bg + shadow.',
    relatedTypes: ["MetricConfig"],
  },

  // === Tooltip & Drill-Down ===

  {
    name: "TooltipConfig",
    kind: "interface",
    definition: `interface TooltipConfig {
  content: React.ReactNode | ((context: Record<string, unknown>) => React.ReactNode);
  position?: "top" | "right" | "bottom" | "left" | "cursor";
  delay?: number;      // ms
  maxWidth?: number;   // px
}`,
    description: "Custom tooltip configuration for KpiCard.",
    relatedTypes: [],
  },
  {
    name: "DrillDownConfig",
    kind: "interface",
    definition: `interface DrillDownConfig {
  label?: string;     // Default: "Details"
  onClick: () => void;
}`,
    description: "Drill-down action shown on hover in KpiCard's bottom-right corner.",
    relatedTypes: [],
  },

  // === Animation ===

  {
    name: "AnimationConfig",
    kind: "interface",
    definition: `interface AnimationConfig {
  countUp?: boolean;
  delay?: number;     // ms
  duration?: number;  // ms
}`,
    description: "Fine-grained animation control for KpiCard's count-up effect.",
    relatedTypes: ["MotionConfig"],
  },
  {
    name: "MotionConfig",
    kind: "interface",
    definition: `interface MotionConfig {
  mass: number;      // Default: 1
  tension: number;   // Default: 170
  friction: number;  // Default: 26
  clamp: boolean;    // Default: true
}`,
    description: "Spring physics configuration for chart animations and derived durations. Consumed by all chart components and useCountUp.",
    relatedTypes: ["AnimationConfig", "MetricConfig"],
  },

  // === Data States ===

  {
    name: "EmptyState",
    kind: "interface",
    definition: `interface EmptyState {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}`,
    description: "Configuration for empty data state display.",
    relatedTypes: ["ErrorState", "StaleState", "DataStates"],
  },
  {
    name: "ErrorState",
    kind: "interface",
    definition: `interface ErrorState {
  message?: string;
  retry?: () => void;
}`,
    description: "Configuration for error state display with optional retry button.",
    relatedTypes: ["EmptyState", "StaleState", "DataStates"],
  },
  {
    name: "StaleState",
    kind: "interface",
    definition: `interface StaleState {
  since?: Date;
  warningAfter?: number;  // minutes
}`,
    description: "Stale data indicator shown in the corner of the component.",
    relatedTypes: ["EmptyState", "ErrorState", "DataStates"],
  },
  {
    name: "DataStates",
    kind: "interface",
    definition: `interface DataStates {
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
}`,
    description: "Grouped data states interface. Used by KpiCard's `state` prop.",
    relatedTypes: ["EmptyState", "ErrorState", "StaleState"],
  },

  // === Provider ===

  {
    name: "MetricConfig",
    kind: "interface",
    definition: `interface MetricConfig {
  locale: string;             // BCP 47. Default: "en-US"
  currency: string;           // ISO 4217. Default: "USD"
  animate: boolean;           // Default: true
  motionConfig: MotionConfig;
  variant: CardVariant;       // Default: "default"
  colors: string[];           // Default: SERIES_COLORS
  nullDisplay: NullDisplay;   // Default: "dash"
  chartNullMode: ChartNullMode; // Default: "gap"
  dense: boolean;             // Default: false
  emptyState: { message?: string; icon?: React.ReactNode };
  errorState: { message?: string };
}`,
    description: "Global configuration for all MetricUI components. Set via MetricProvider, consumed via useMetricConfig().",
    relatedTypes: ["MotionConfig", "CardVariant", "NullDisplay", "ChartNullMode"],
  },
  {
    name: "LocaleDefaults",
    kind: "interface",
    definition: `interface LocaleDefaults {
  locale: string;
  currency: string;
}`,
    description: "Locale subset returned by the useLocale() hook.",
    relatedTypes: ["MetricConfig"],
  },

  // === Unified Data Format Types ===

  {
    name: "Category",
    kind: "type",
    definition: `type Category = string | CategoryConfig;`,
    description: "A category can be a plain column key string or a full CategoryConfig object. Used with the unified flat-row data format supported by AreaChart, LineChart, BarChart, BarLineChart, DonutChart, and HeatMap.",
    relatedTypes: ["CategoryConfig"],
  },
  {
    name: "CategoryConfig",
    kind: "interface",
    definition: `interface CategoryConfig {
  key: string;              // Column key in the data row
  label?: string;           // Display label (defaults to key)
  format?: FormatOption;    // Per-series format override
  color?: string;           // Override color for this series
  axis?: "left" | "right";  // Y-axis assignment (used by BarLineChart to split bars vs lines)
}`,
    description: "Rich category configuration for the unified data format. Allows per-series labels, formats, colors, and axis assignment. The axis field is used by BarLineChart to split categories into bar series (left/default) and line series (right).",
    relatedTypes: ["Category", "FormatOption"],
  },

  // === Chart-Specific Types ===

  {
    name: "SeriesStyle",
    kind: "interface",
    definition: `interface SeriesStyle {
  color?: string;
  lineWidth?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
  pointSize?: number;
  pointColor?: string | { from: string; modifiers?: any[] };
  pointBorderWidth?: number;
  pointBorderColor?: string;
}`,
    description: "Per-series style overrides for AreaChart and LineChart. Keyed by series ID in seriesStyles prop.",
    relatedTypes: ["AreaChartProps"],
  },
  {
    name: "BarSeriesStyle",
    kind: "interface",
    definition: `interface BarSeriesStyle {
  color?: string;
}`,
    description: "Per-key style overrides for BarChart. Currently only supports color.",
    relatedTypes: ["BarChartProps"],
  },
  {
    name: "DonutSeriesStyle",
    kind: "interface",
    definition: `interface DonutSeriesStyle {
  color?: string;
}`,
    description: "Per-slice style overrides for DonutChart. Currently only supports color.",
    relatedTypes: ["DonutChartProps", "DonutDatum"],
  },
  {
    name: "ReferenceLine",
    kind: "interface",
    definition: `interface ReferenceLine {
  axis: "x" | "y";
  value: number | string;
  label?: string;
  color?: string;              // Default: "var(--muted)"
  style?: "solid" | "dashed";  // Default: "dashed"
}`,
    description: "A reference line drawn on a chart (horizontal for Y, vertical for X).",
    relatedTypes: ["ThresholdBand"],
  },
  {
    name: "ThresholdBand",
    kind: "interface",
    definition: `interface ThresholdBand {
  from: number;
  to: number;
  color?: string;    // Default: "var(--accent)"
  label?: string;
  opacity?: number;  // Default: 0.08
}`,
    description: "A colored Y-axis range band for highlighting thresholds on charts.",
    relatedTypes: ["ReferenceLine"],
  },
  {
    name: "LegendConfig",
    kind: "interface",
    definition: `interface LegendConfig {
  position?: "top" | "bottom";
  toggleable?: boolean;  // Default: true
}`,
    description: "Legend display configuration for charts.",
    relatedTypes: [],
  },
  {
    name: "DonutDatum",
    kind: "interface",
    definition: `interface DonutDatum {
  id: string;
  label: string;
  value: number;
  color?: string;
}`,
    description: "A single slice in the DonutChart data array.",
    relatedTypes: ["DonutChartProps", "DonutSeriesStyle"],
  },
  {
    name: "SparklineReferenceLine",
    kind: "interface",
    definition: `interface SparklineReferenceLine {
  value: number;
  color?: string;
  style?: "solid" | "dashed";
  label?: string;
}`,
    description: "A horizontal reference line in a Sparkline (e.g., average or target).",
    relatedTypes: ["SparklineBand"],
  },
  {
    name: "SparklineBand",
    kind: "interface",
    definition: `interface SparklineBand {
  from: number;
  to: number;
  color?: string;
  opacity?: number;
}`,
    description: "A shaded band region in a Sparkline (e.g., normal range).",
    relatedTypes: ["SparklineReferenceLine"],
  },

  // === Table Types ===

  {
    name: "ColumnType",
    kind: "type",
    definition: `type ColumnType = "text" | "number" | "currency" | "percent" | "link" | "badge" | "sparkline" | "status" | "progress" | "date" | "bar";`,
    description: 'Column type for DataTable. Controls auto-rendering and alignment. "text": plain string (default). "number": auto-formats with locale. "currency": formats as currency. "percent": formats as percentage. "link": renders clickable anchor (use linkHref/linkTarget). "badge": renders a Badge (auto-maps common statuses like "active"/"failed" to colors). "sparkline": renders a Sparkline from array data. "status": renders a StatusIndicator (use statusRules/statusSize). "progress": renders a ProgressBar (0-100). "date": formats via Intl.DateTimeFormat (use dateFormat). "bar": renders inline bar chart for numeric values.',
    relatedTypes: ["Column", "DataTableProps"],
  },
  {
    name: "RowCondition",
    kind: "interface",
    definition: `interface RowCondition<T> {
  when: (row: T, index: number) => boolean;
  className: string;
}`,
    description: "Conditional row styling for DataTable. When the `when` predicate returns true, the `className` is applied to that row. Multiple conditions can match — all matching classNames are applied.",
    relatedTypes: ["DataTableProps"],
  },
  {
    name: "Column",
    kind: "interface",
    definition: `interface Column<T> {
  key: string;
  header?: string;
  label?: string;                // @deprecated — use header
  type?: ColumnType;             // Auto-render column type
  format?: FormatOption;
  align?: "left" | "center" | "right";
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  pin?: "left";
  wrap?: boolean;
  conditions?: Condition[];
  linkHref?: (value: any, row: T) => string;
  linkTarget?: string;
  badgeColor?: (value: any, row: T) => string | undefined;
  badgeVariant?: (value: any, row: T) => BadgeVariant | undefined;
  statusRules?: StatusRule[];
  statusSize?: StatusSize;
  dateFormat?: Intl.DateTimeFormatOptions;
}`,
    description: "Column definition for DataTable. Generic over the row type T. Supports column types for auto-rendering, conditional cell coloring, link/badge/status customization, and date formatting.",
    relatedTypes: ["DataTableProps", "FormatOption", "FooterRow", "ColumnType", "Condition", "StatusRule", "StatusSize"],
  },
  {
    name: "FooterRow",
    kind: "interface",
    definition: `interface FooterRow {
  [key: string]: React.ReactNode;
}`,
    description: "Summary/totals footer row for DataTable. Object keyed by column key.",
    relatedTypes: ["Column", "DataTableProps"],
  },

  // === StatGroup Types ===

  {
    name: "StatItem",
    kind: "interface",
    definition: `interface StatItem {
  label: string;
  value: string | number;
  change?: number;               // Legacy change percentage
  previousValue?: number;         // For auto-computed comparison
  comparisonMode?: ComparisonMode;
  invertTrend?: boolean;
  format?: FormatOption;
  icon?: React.ReactNode;
}`,
    description: "A single stat cell in StatGroup.",
    relatedTypes: ["StatGroupProps", "ComparisonMode", "FormatOption"],
  },

  // === BarChart Preset Type ===

  {
    name: "BarChartPreset",
    kind: "type",
    definition: `type BarChartPreset = "default" | "grouped" | "stacked" | "percent" | "horizontal" | "horizontal-grouped";`,
    description: "Built-in BarChart preset names that set sensible defaults for common use cases.",
    relatedTypes: ["BarChartProps"],
  },

  // === Annotation (charts) ===

  {
    name: "Annotation",
    kind: "interface",
    definition: `interface Annotation {
  type: "point" | "line" | "range";
  at?: string | number | Date;
  from?: string | number | Date;
  to?: string | number | Date;
  label: string;
  color?: string;
  style?: "solid" | "dashed";
}`,
    description: "Chart annotation for marking specific points, lines, or ranges.",
    relatedTypes: [],
  },

  // === Period Config ===

  {
    name: "PeriodConfig",
    kind: "interface",
    definition: `interface PeriodConfig {
  current: { start: Date; end: Date };
  previous?: "auto" | { start: Date; end: Date };
  granularity?: "day" | "week" | "month" | "quarter" | "year";
  label?: string;
}`,
    description: "Period/time intelligence configuration for time-based comparisons.",
    relatedTypes: [],
  },

  // === Badge Types ===

  {
    name: "BadgeVariant",
    kind: "type",
    definition: `type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";`,
    description: "Semantic color variants for Badge.",
    relatedTypes: [],
  },
  {
    name: "BadgeSize",
    kind: "type",
    definition: `type BadgeSize = "sm" | "md" | "lg";`,
    description: "Size variants for Badge. sm: 10px, md: 12px, lg: 14px.",
    relatedTypes: [],
  },
  // === Callout Types ===

  {
    name: "CalloutVariant",
    kind: "type",
    definition: `type CalloutVariant = "info" | "warning" | "success" | "error";`,
    description: "Visual variant for the Callout component. Controls background, border, icon, and text colors.",
    relatedTypes: ["CalloutRule", "CalloutProps"],
  },
  {
    name: "CalloutRule",
    kind: "interface",
    definition: `interface CalloutRule {
  min?: number;     // Minimum value (inclusive). Omit for fallback.
  max?: number;     // Maximum value (exclusive). Omit for no upper bound.
  variant: CalloutVariant;  // Variant to apply when matched.
  title?: string;   // Title text. Supports {value} placeholder.
  message?: string; // Message text. Supports {value} placeholder.
  icon?: React.ReactNode;   // Icon override for this rule.
}`,
    description: "A threshold rule for data-driven Callout. Rules are evaluated top-to-bottom; first match wins. Supports {value} placeholder interpolation in title and message.",
    relatedTypes: ["CalloutVariant", "CalloutProps"],
  },
  {
    name: "CalloutMetric",
    kind: "interface",
    definition: `interface CalloutMetric {
  value: number;        // Numeric value to display
  format?: FormatOption; // Format option (currency, percent, compact, etc.)
  label?: string;       // Label next to the value
}`,
    description: "Embedded formatted metric display inside a Callout. Uses the MetricUI format engine.",
    relatedTypes: ["CalloutProps", "FormatOption"],
  },
  {
    name: "CalloutAction",
    kind: "interface",
    definition: `interface CalloutAction {
  label: string;       // Button label
  onClick: () => void; // Click handler
}`,
    description: "Action button configuration for a Callout.",
    relatedTypes: ["CalloutProps"],
  },

  // === StatusIndicator Types ===

  {
    name: "StatusRule",
    kind: "interface",
    definition: `interface StatusRule {
  min?: number;    // Minimum value (inclusive). Omit for fallback/default.
  max?: number;    // Maximum value (exclusive). Omit for no upper bound.
  color: string;   // Named color ("emerald","red","amber","blue","gray","purple","cyan") or CSS color string.
  icon?: React.ReactNode;
  label?: string;  // Label shown next to the icon (e.g., "Healthy", "Critical").
  pulse?: boolean; // Pulse animation for attention states.
}`,
    description: "A threshold rule for StatusIndicator. Rules are evaluated top-to-bottom; first match wins.",
    relatedTypes: ["StatusSize", "StatusIndicatorProps"],
  },
  {
    name: "StatusSize",
    kind: "type",
    definition: `type StatusSize = "dot" | "sm" | "md" | "lg" | "card";`,
    description: 'Display mode for StatusIndicator. "dot": tiny inline circle. "sm": dot + label. "md": icon badge + label. "lg": prominent standalone. "card": full card shell matching KpiCard.',
    relatedTypes: ["StatusRule", "StatusIndicatorProps"],
  },

  {
    name: "FunnelDatumInput",
    kind: "interface",
    definition: `interface FunnelDatumInput {
  id: string;        // Unique identifier for this stage
  label: string;     // Display label for this stage
  value: number;     // Value at this stage
  color?: string;    // Optional custom color for this stage
}`,
    description: "A single stage in the Funnel data array.",
    relatedTypes: ["FunnelChartProps", "LegendConfig"],
  },

  {
    name: "HeatMapColorScale",
    kind: "type",
    definition: `type HeatMapColorScale = "sequential" | "diverging";`,
    description: "Color scale preset for HeatMap. Sequential = single hue (blues). Diverging = red-yellow-green around midpoint.",
    relatedTypes: ["HeatMapProps"],
  },
  {
    name: "BulletDatum",
    kind: "interface",
    definition: `interface BulletDatum {
  id: string;
  title?: React.ReactNode;
  ranges: number[];      // Cumulative endpoints: [150, 225, 300] means 0\u2192150, 150\u2192225, 225\u2192300
  measures: number[];    // Actual value bars drawn on top of ranges
  markers?: number[];    // Target marker vertical lines
}`,
    description: "Full data item for BulletChart. Each item renders as one horizontal (or vertical) bullet with range bands, measure bars, and optional target markers.",
    relatedTypes: ["SimpleBulletData", "BulletChartProps"],
  },
  {
    name: "SimpleBulletData",
    kind: "interface",
    definition: `interface SimpleBulletData {
  label: string;
  value: number;
  target?: number;
  max?: number;          // Default: auto from target or value * 1.2
  zones?: number[];      // Percentages of max. Default: [60, 80, 100]
}`,
    description: "Simple shorthand for BulletChart. Provides label/value/target and auto-generates ranges from zone percentages. Converted to BulletDatum internally.",
    relatedTypes: ["BulletDatum", "BulletChartProps"],
  },

  {
    name: "WaterfallItem",
    kind: "interface",
    definition: `interface WaterfallItem {
  label: string;          // Display label
  value?: number;         // Positive for increase, negative for decrease. Ignored for subtotal/total.
  type?: "value" | "subtotal" | "total";  // Default: "value". subtotal/total are auto-computed running sums.
  color?: string;         // Custom color override for this bar
}`,
    description: "A single item in the Waterfall data array. Value items contribute to the running total. Subtotal items display the running total. Total items display and reset the running total.",
    relatedTypes: ["WaterfallProps", "FormatOption"],
  },

  {
    name: "GaugeThreshold",
    kind: "interface",
    definition: `interface GaugeThreshold {\n  value: number;\n  color: string;\n}`,
    description: "Threshold breakpoint for Gauge colored zones. The color applies to the zone UP TO this value.",
    relatedTypes: ["GaugeProps"],
  },

  // === Filter System Types ===

  {
    name: "DateRange",
    kind: "interface",
    definition: `interface DateRange {
  start: Date;
  end: Date;
}`,
    description: "A date range with start and end timestamps. Used by PeriodSelector and FilterProvider to represent the active time window.",
    relatedTypes: ["FilterState", "PeriodPreset", "PeriodSelectorProps"],
  },
  {
    name: "PeriodPreset",
    kind: "type",
    definition: `type PeriodPreset = "7d" | "14d" | "30d" | "90d" | "month" | "quarter" | "ytd" | "year" | "all";`,
    description: "Named time-period presets. Each preset auto-computes a DateRange relative to today.",
    relatedTypes: ["DateRange", "FilterState", "PeriodSelectorProps"],
  },
  {
    name: "FilterComparisonMode",
    kind: "type",
    definition: `type ComparisonMode = "previous" | "year-over-year" | "none";`,
    description: 'Filter-level comparison mode. "previous" shifts the range backward by its own duration. "year-over-year" shifts back one year. "none" disables comparison.',
    relatedTypes: ["FilterState", "DateRange", "PeriodSelectorProps"],
  },
  {
    name: "FilterState",
    kind: "interface",
    definition: `interface FilterState {
  period: DateRange | null;
  preset: PeriodPreset | null;
  comparisonMode: ComparisonMode;
  comparisonPeriod: DateRange | null;
  dimensions: Record<string, string[]>;
}`,
    description: "The full filter state held by FilterProvider. Readable via useMetricFilters().",
    relatedTypes: ["DateRange", "PeriodPreset", "FilterComparisonMode", "FilterActions", "FilterContextValue"],
  },
  {
    name: "FilterActions",
    kind: "interface",
    definition: `interface FilterActions {
  setPeriod: (range: DateRange, preset?: PeriodPreset) => void;
  setPreset: (preset: PeriodPreset) => void;
  setCustomRange: (start: Date, end: Date) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  setDimension: (field: string, values: string[]) => void;
  clearDimension: (field: string) => void;
  clearAll: () => void;
}`,
    description: "Actions available on the filter context. Returned by useMetricFilters() alongside FilterState.",
    relatedTypes: ["FilterState", "FilterContextValue"],
  },
  {
    name: "FilterContextValue",
    kind: "type",
    definition: `type FilterContextValue = FilterState & FilterActions;`,
    description: "The combined state + actions type returned by useMetricFilters(). Null when no FilterProvider is present.",
    relatedTypes: ["FilterState", "FilterActions"],
  },

  // === DropdownFilter Types ===

  {
    name: "DropdownOption",
    kind: "interface",
    definition: `interface DropdownOption {
  value: string;
  label?: string;
  count?: number;
  icon?: React.ReactNode;
  group?: string;
}`,
    description: "A single option in a DropdownFilter. The value is the unique identifier, label defaults to value. Count renders as a badge. Group organizes options under section headers.",
    relatedTypes: ["DropdownFilterProps"],
  },

  // === SegmentToggle Types ===

  {
    name: "SegmentOption",
    kind: "interface",
    definition: `interface SegmentOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  badge?: number;
  badgeFormat?: FormatOption;
  color?: string;
}`,
    description: "A single option in a SegmentToggle. The value is the unique identifier, label defaults to value, and badge counts are formatted through the format engine.",
    relatedTypes: ["SegmentToggleProps", "FormatOption"],
  },
];
