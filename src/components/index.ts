// Charts
export { AreaChart } from "./charts/AreaChart";
export type { SeriesStyle, AreaChartProps } from "./charts/AreaChart";
export { BarChart } from "./charts/BarChart";
export type { BarChartProps, BarSeriesStyle, BarChartPreset } from "./charts/BarChart";
export { LineChart } from "./charts/LineChart";
export type { LineChartProps } from "./charts/LineChart";
export { BarLineChart } from "./charts/BarLineChart";
export type { BarLineChartProps } from "./charts/BarLineChart";
export { DonutChart } from "./charts/DonutChart";
export type { DonutChartProps, DonutDatum, DonutSeriesStyle } from "./charts/DonutChart";
export { Sparkline } from "./charts/Sparkline";
export type { SparklineProps, SparklineReferenceLine, SparklineBand } from "./charts/Sparkline";
export { Gauge } from "./charts/Gauge";
export type { GaugeProps, GaugeThreshold } from "./charts/Gauge";
export { HeatMap } from "./charts/HeatMap";
export type { HeatMapProps, HeatMapColorScale } from "./charts/HeatMap";
export { Funnel } from "./charts/Funnel";
export type { FunnelChartProps, FunnelDatumInput } from "./charts/Funnel";
export { BulletChart } from "./charts/BulletChart";
export type { BulletChartProps, BulletDatum, SimpleBulletData } from "./charts/BulletChart";
export { Waterfall } from "./charts/Waterfall";
export type { WaterfallProps, WaterfallItem } from "./charts/Waterfall";

export { ChartContainer } from "./charts/ChartContainer";
export { ChartTooltip } from "./charts/ChartTooltip";
export type { ChartTooltipProps, ChartTooltipItem } from "./charts/ChartTooltip";
export { ChartLegend } from "./charts/ChartLegend";
export type { ChartLegendProps, ChartLegendItem } from "./charts/ChartLegend";

export type { LegendConfig, ReferenceLine, ThresholdBand, PointClickEvent, BarClickEvent, SliceClickEvent, CellClickEvent } from "@/lib/chartTypes";
export type { Category, CategoryConfig } from "@/lib/dataTransform";

// Format helpers
export { fmt } from "@/lib/format";
export type { FormatOption, FormatConfig, FormatStyle } from "@/lib/format";

// Cards
export { KpiCard } from "./cards/KpiCard";
export type { KpiCardProps } from "./cards/KpiCard";
export { StatGroup } from "./cards/StatGroup";
export type { StatGroupProps, StatItem } from "./cards/StatGroup";

// Tables
export { DataTable } from "./tables/DataTable";
export type { Column, ColumnDef, ColumnType, DataTableProps, FooterRow, RowCondition } from "./tables/DataTable";

// Layout
export { MetricGrid } from "./layout/MetricGrid";
export type { MetricGridProps, MetricGridItemProps, GridHint } from "./layout/MetricGrid";
export { DashboardHeader } from "./layout/DashboardHeader";
export type { DashboardHeaderProps, DashboardStatus, BreadcrumbItem } from "./layout/DashboardHeader";

// UI
export { Badge } from "./ui/Badge";
export { StatusIndicator, StatusIndicatorWithBoundary } from "./ui/StatusIndicator";
export type { StatusIndicatorProps, StatusRule, StatusSize } from "./ui/StatusIndicator";
export { Callout, CalloutWithBoundary } from "./ui/Callout";
export type { CalloutProps, CalloutVariant, CalloutRule, CalloutMetric, CalloutAction } from "./ui/Callout";
export { SectionHeader } from "./ui/SectionHeader";
export type { SectionHeaderProps } from "./ui/SectionHeader";
export { Divider } from "./ui/Divider";
export type { DividerProps } from "./ui/Divider";
export { ErrorBoundary } from "./ui/ErrorBoundary";
export { ProgressBar } from "./ui/ProgressBar";
export { DetailGrid } from "./ui/DetailGrid";
export type { DetailGridProps } from "./ui/DetailGrid";
export type { ProgressBarProps } from "./ui/ProgressBar";

// Filters
export { PeriodSelector } from "./filters/PeriodSelector";
export type { PeriodSelectorProps } from "./filters/PeriodSelector";
export { SegmentToggle } from "./filters/SegmentToggle";
export type { SegmentToggleProps, SegmentOption } from "./filters/SegmentToggle";
export { DropdownFilter } from "./filters/DropdownFilter";
export type { DropdownFilterProps, DropdownOption } from "./filters/DropdownFilter";
export { FilterTags } from "./filters/FilterTags";
export type { FilterTagsProps } from "./filters/FilterTags";
export { FilterProvider, useMetricFilters, PRESET_LABELS } from "@/lib/FilterContext";
export type { FilterState, FilterActions, FilterContextValue, DateRange, PeriodPreset, ComparisonMode } from "@/lib/FilterContext";

// Error hints (extensible by consumers)
export { COMPONENT_HINTS } from "@/lib/errorHints";

// Provider / Config
export { MetricProvider, useMetricConfig, useLocale, useTheme, DEFAULT_METRIC_CONFIG } from "@/lib/MetricProvider";
export type { MetricConfig, LocaleDefaults, ColorScheme } from "@/lib/MetricProvider";

// Motion
export { DEFAULT_MOTION_CONFIG } from "@/lib/motion";
export type { MotionConfig } from "@/lib/motion";
export type {
  ChartNullMode, CardVariant, NullDisplay,
  ComparisonConfig, TrendIconConfig,
  EmptyState, ErrorState, StaleState,
  DrillDownConfig, AnimationConfig,
} from "@/lib/types";

// Chart colors
export { SERIES_COLORS } from "@/lib/chartColors";

// Themes
export { THEME_PRESETS, PRESET_NAMES, DEFAULT_THEME } from "@/lib/themes";
export type { ThemePreset } from "@/lib/themes";
