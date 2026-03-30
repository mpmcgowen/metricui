"use client";

import { forwardRef, useCallback, useMemo, useRef } from "react";
import { ResponsiveLine } from "@nivo/line";
import type {
  LineCustomSvgLayerProps,
  LineSvgLayer,
  LineLayerId,
  Point,
} from "@nivo/line";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { calculateResponsiveTicks } from "@/lib/calculateResponsiveTicks";
import { withOpacity } from "@/lib/utils";
import { devWarn } from "@/lib/devWarnings";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import type { LegendConfig, ReferenceLine, ThresholdBand, PointClickEvent } from "@/lib/chartTypes";
import type { DrillDownEvent, CardVariant, ChartNullMode, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { toLineSeries, inferSchema, categoryKeys, categoryColors, rightAxisCategories, type Category } from "@/lib/dataTransform";
import { assertPeer } from "@/lib/peerCheck";

// Re-export shared types so downstream code doesn't break
export type { ReferenceLine, ThresholdBand, LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Data point. `null` y-values create gaps in the line. */
type Datum = { x: string | number; y: number | null };
type SeriesData = { id: string; data: Datum[] };

/** Prefix used to distinguish comparison series from user series */
const COMPARISON_PREFIX = "__cmp__";

/** Check if data is already in Nivo series format (vs flat rows) */
function isSeriesData(data: unknown[]): data is SeriesData[] {
  if (!data.length) return false;
  const first = data[0] as Record<string, unknown>;
  return typeof first === "object" && "id" in first && "data" in first && Array.isArray(first.data);
}
type CurveType =
  | "basis"
  | "cardinal"
  | "catmullRom"
  | "linear"
  | "monotoneX"
  | "monotoneY"
  | "natural"
  | "step"
  | "stepAfter"
  | "stepBefore";

type LineStyle = "solid" | "dashed" | "dotted";
type LayerProps = LineCustomSvgLayerProps<SeriesData>;

export interface SeriesStyle {
  /** Override color for this series */
  color?: string;
  /** Override line width for this series */
  lineWidth?: number;
  /** Override line stroke style for this series */
  lineStyle?: LineStyle;
  /** Override point size for this series */
  pointSize?: number;
  /** Override point fill color for this series */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pointColor?: string | { from: string; modifiers?: any[] };
  /** Override point border width for this series */
  pointBorderWidth?: number;
  /** Override point border color for this series */
  pointBorderColor?: string;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AreaChartProps extends DataComponentProps {
  data?: SeriesData[] | DataRow[];
  /** Column name to use as the X-axis (index). When provided with `categories`,
   *  flat row data is auto-converted to series format. */
  index?: string;
  /** Value columns to chart. Can be plain strings or rich config objects with
   *  format, color, and axis overrides. When omitted, all numeric columns are inferred. */
  categories?: Category[];
  /** Simple data format — array of { label, value } objects. Converted to series internally.
   *  Alternative to `data` for the common single-series case. `data` takes precedence. */
  simpleData?: { label: string; value: number | null }[];
  /** Series name when using simpleData. Default: "Value" */
  simpleDataId?: string;
  /** Previous period data — renders as dashed overlay */
  comparisonData?: SeriesData[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for Y-axis values and tooltips */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Curve interpolation. Default: "monotoneX" */
  curve?: CurveType;
  /** Show data points on the line. Default: false */
  enablePoints?: boolean;
  /** Show filled area under the line. Default: true */
  enableArea?: boolean;
  /** Use gradient fill instead of flat opacity. Default: true */
  gradient?: boolean;
  /** Area fill opacity (when gradient is false). Default: 0.08 */
  areaOpacity?: number;
  /** Stack multiple series. Default: false */
  stacked?: boolean;
  /** Stack mode. "normal" stacks raw values, "percent" normalizes to 100%. Default: "normal" */
  stackMode?: "normal" | "percent";
  /** Show grid lines. Default: true (Y only) */
  enableGridX?: boolean;
  enableGridY?: boolean;
  /** Reference lines */
  referenceLines?: ReferenceLine[];
  /** Threshold bands (colored Y-axis ranges) */
  thresholds?: ThresholdBand[];
  /** Legend configuration. Default: shown for multi-series */
  legend?: boolean | LegendConfig;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Assign specific series to the right Y-axis by series ID */
  rightAxisSeries?: string[];
  /** Format for right Y-axis values */
  rightAxisFormat?: FormatOption;
  /** Right Y-axis label */
  rightAxisLabel?: string;
  /** Line width in px. Default: 2 */
  lineWidth?: number;
  /** Line stroke style. Default: "solid" */
  lineStyle?: LineStyle;
  /** Point radius in px. Default: 6 */
  pointSize?: number;
  /** Point fill color. Default: card background (hollow ring effect).
   *  Use `{ from: "serieColor" }` for solid filled points. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pointColor?: string | { from: string; modifiers?: any[] };
  /** Point border width in px. Default: 2 */
  pointBorderWidth?: number;
  /** Point border color. Default: series color */
  pointBorderColor?: string;
  /** Per-series style overrides keyed by series ID */
  seriesStyles?: Record<string, SeriesStyle>;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Click handler for data points */
  onPointClick?: (point: PointClickEvent) => void;
  /** Drill-down content renderer. When set, clicking a point opens the drill-down panel. Takes priority over crossFilter for the click action.
   *  Pass `true` for an auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Enable cross-filter selection. Pass `true` to use "x" as the field, or `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** How null / missing data points are handled. Default: "gap" */
  chartNullMode?: ChartNullMode;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string; legend?: string };
}

// Tooltip is rendered inline in the component below for access to
// percent-stack original values and dual-axis formatting context.

// ---------------------------------------------------------------------------
// Custom layers
// ---------------------------------------------------------------------------

/**
 * Linked hover crosshair — renders a vertical dashed line at the
 * hoveredIndex position when another component is the source.
 */
function createLinkedCrosshairLayer(
  hoveredIndex: string | number | null,
  sourceId: string | undefined,
  myId: string,
) {
  return function LinkedCrosshairLayer(props: LayerProps) {
    // Only render when another component is emitting the hover
    if (hoveredIndex == null || sourceId === myId) return null;
    const xScale = props.xScale as unknown as (value: string | number) => number;
    const innerHeight = props.innerHeight;
    const x = xScale(hoveredIndex);
    if (x == null || isNaN(x)) return null;
    return (
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={innerHeight}
        stroke="var(--muted)"
        strokeDasharray="4 3"
        strokeWidth={1}
        opacity={0.5}
        style={{ pointerEvents: "none" }}
      />
    );
  };
}

function createThresholdLayer(thresholds: ThresholdBand[]) {
  return function ThresholdLayer(props: LayerProps) {
    const yScale = props.yScale as unknown as (value: number) => number;
    const innerWidth = props.innerWidth;
    return (
      <g>
        {thresholds.map((t, i) => {
          const y1 = yScale(t.to);
          const y2 = yScale(t.from);
          const h = Math.abs(y2 - y1);
          const color = t.color ?? "var(--accent)";
          const opacity = t.opacity ?? 0.08;
          return (
            <g key={i}>
              <rect
                x={0}
                y={Math.min(y1, y2)}
                width={innerWidth}
                height={h}
                fill={color}
                opacity={opacity}
              />
              {t.label && (
                <text
                  x={innerWidth - 6}
                  y={Math.min(y1, y2) + 12}
                  textAnchor="end"
                  fill={color}
                  fontSize={9}
                  fontWeight={600}
                  opacity={0.6}
                >
                  {t.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };
}

function createReferenceLineLayer(lines: ReferenceLine[]) {
  return function ReferenceLineLayer(props: LayerProps) {
    const yScale = props.yScale as unknown as (value: number) => number;
    const xScale = props.xScale as unknown as (value: string | number) => number;
    const innerWidth = props.innerWidth;
    const innerHeight = props.innerHeight;

    return (
      <g>
        {lines.map((line, i) => {
          const color = line.color ?? "var(--muted)";
          const dashArray = line.style === "solid" ? undefined : "6 4";

          if (line.axis === "y") {
            const y = yScale(line.value as number);
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y}
                  y2={y}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray={dashArray}
                  opacity={0.5}
                />
                {line.label && (
                  <text
                    x={innerWidth - 4}
                    y={y - 5}
                    textAnchor="end"
                    fill={color}
                    fontSize={9}
                    fontWeight={600}
                    opacity={0.7}
                  >
                    {line.label}
                  </text>
                )}
              </g>
            );
          }

          const x = xScale(line.value);
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={0}
                y2={innerHeight}
                stroke={color}
                strokeWidth={1}
                strokeDasharray={dashArray}
                opacity={0.5}
              />
              {line.label && (
                <text
                  x={x + 4}
                  y={10}
                  fill={color}
                  fontSize={9}
                  fontWeight={600}
                  opacity={0.7}
                >
                  {line.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };
}

// Dashed line layer for comparison series (used when custom line layer is off)
function createDashedLineLayer(comparisonIds: string[]) {
  return function DashedLineLayer(props: LayerProps) {
    const { series, lineGenerator } = props;
    return (
      <g>
        {series
          .filter((s) => comparisonIds.includes(String(s.id)))
          .map((s) => (
            <path
              key={s.id}
              d={lineGenerator(
                s.data.map((d) => ({
                  x: (d.position as { x: number }).x,
                  y: (d.position as { y: number }).y,
                }))
              ) ?? undefined}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.5}
            />
          ))}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Line style helpers
// ---------------------------------------------------------------------------

function lineStyleToDashArray(style: LineStyle): string | undefined {
  switch (style) {
    case "dashed": return "6 4";
    case "dotted": return "2 2";
    default: return undefined;
  }
}

// Custom line layer — handles per-series width/style and comparison dashing
function createStyledLineLayer(
  defaults: { lineWidth: number; lineStyle: LineStyle },
  seriesStyles: Record<string, SeriesStyle> | undefined,
  comparisonIds: string[],
) {
  return function StyledLineLayer(props: LayerProps) {
    const { series, lineGenerator } = props;
    return (
      <g>
        {series.map((s) => {
          const id = String(s.id);
          const isComparison = comparisonIds.includes(id);
          // Strip comparison prefix to look up style for the original series
          const baseId = isComparison ? id.slice(COMPARISON_PREFIX.length) : id;
          const style = seriesStyles?.[baseId];

          const width = isComparison
            ? (style?.lineWidth ?? defaults.lineWidth)
            : (style?.lineWidth ?? defaults.lineWidth);
          const dashArray = isComparison
            ? "6 4"
            : lineStyleToDashArray(style?.lineStyle ?? defaults.lineStyle);
          const opacity = isComparison ? 0.5 : 1;

          const path = lineGenerator(
            s.data.map((d) => ({
              x: (d.position as { x: number }).x,
              y: (d.position as { y: number }).y,
            }))
          );

          return (
            <path
              key={id}
              d={path ?? undefined}
              fill="none"
              stroke={s.color}
              strokeWidth={width}
              strokeDasharray={dashArray}
              opacity={opacity}
            />
          );
        })}
      </g>
    );
  };
}

// Custom point layer — handles per-series point styling
function createStyledPointLayer(
  defaults: {
    pointSize: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointColor: string | { from: string; modifiers?: any[] };
    pointBorderWidth: number;
  },
  seriesStyles: Record<string, SeriesStyle>,
  comparisonIds: string[],
) {
  return function StyledPointLayer(props: LayerProps) {
    const { series } = props;
    return (
      <g>
        {series.map((s) => {
          const id = String(s.id);
          if (comparisonIds.includes(id)) return null;
          const style = seriesStyles[id];
          const size = style?.pointSize ?? defaults.pointSize;
          const rawFill = style?.pointColor ?? defaults.pointColor;
          const fill = typeof rawFill === "string" ? rawFill : s.color;
          const borderW = style?.pointBorderWidth ?? defaults.pointBorderWidth;
          const borderC = style?.pointBorderColor ?? s.color;

          return s.data.map((d, j) => (
            <circle
              key={`${id}-${j}`}
              cx={(d.position as { x: number }).x}
              cy={(d.position as { y: number }).y}
              r={size / 2}
              fill={fill}
              stroke={borderC}
              strokeWidth={borderW}
            />
          ));
        })}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AreaChartInner = forwardRef<HTMLDivElement, AreaChartProps>(function AreaChart({
  data: dataProp = [],
  index: indexProp,
  categories: categoriesProp,
  simpleData,
  simpleDataId = "Value",
  comparisonData,
  title,
  subtitle,
  description,
  footnote,
  action,
  headline,
  format,
  height,
  curve = "monotoneX",
  enablePoints = false,
  enableArea = true,
  gradient = true,
  areaOpacity = 0.08,
  stacked: stackedProp = false,
  stackMode,
  lineWidth = 2,
  lineStyle = "solid",
  pointSize = 6,
  pointColor = "var(--card-bg)",
  pointBorderWidth = 2,
  pointBorderColor,
  seriesStyles: seriesStylesProp,
  enableGridX = false,
  enableGridY = true,
  referenceLines,
  thresholds,
  legend: legendProp,
  xAxisLabel,
  yAxisLabel,
  rightAxisSeries,
  rightAxisFormat,
  rightAxisLabel,
  colors: chartColors,
  onPointClick,
  drillDown,
  drillDownMode,
  crossFilter: crossFilterProp,
  tooltipHint,
  dense,
  chartNullMode,
  animate: animateProp,
  variant,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
  aiContext,
  loading,
  empty,
  error,
  stale,
}, ref) {
  assertPeer(ResponsiveLine, "@nivo/line", "AreaChart");
  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense });
  const { localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedHeight } = ctx;
  const resolvedChartNullMode = chartNullMode ?? config.chartNullMode;

  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: "x",
    tooltipHint,
    data: dataProp as DataRow[],
  });
  const sliceIndexRef = useRef<string | number | null>(null);

  // --- Resolve stacked from stackMode ---
  const isPercentStack = stackMode === "percent";
  const stacked = isPercentStack || stackedProp || !!stackMode;

  // --- Resolve unified data format → Nivo series ---
  const rawData = useMemo(() => {
    // 1. Unified format: flat rows + index + categories
    if (dataProp && dataProp.length > 0 && (indexProp || categoriesProp)) {
      const rows = dataProp as DataRow[];
      const inferred = inferSchema(rows);
      const index = indexProp ?? inferred?.index;
      const categories = categoriesProp ?? inferred?.categories;
      if (index && categories && categories.length > 0) {
        return toLineSeries(rows, index, categories);
      }
    }
    // 2. Zero-config: infer index + categories from data shape
    if (dataProp && dataProp.length > 0 && !isSeriesData(dataProp)) {
      const rows = dataProp as DataRow[];
      const inferred = inferSchema(rows);
      if (inferred) {
        return toLineSeries(rows, inferred.index, inferred.categories);
      }
    }
    // 3. Nivo-native series format (passthrough)
    if (dataProp && dataProp.length > 0) return dataProp as SeriesData[];
    // 4. Legacy simpleData
    if (simpleData && simpleData.length > 0) {
      return [{
        id: simpleDataId,
        data: simpleData.map((d) => ({ x: d.label, y: d.value })),
      }];
    }
    return (dataProp as SeriesData[]) ?? [];
  }, [dataProp, indexProp, categoriesProp, simpleData, simpleDataId]);

  if (dataProp && dataProp.length > 0 && rawData.length === 0) {
    devWarn("AreaChart.data", "AreaChart received data but resolved to zero series. Pass `index` and `categories` props, or ensure data matches `{ id, data: [{x, y}] }[]` format.");
  }

  // --- Resolve category-level overrides ---
  const resolvedRightAxisSeries = useMemo(
    () => rightAxisSeries ?? (categoriesProp ? rightAxisCategories(categoriesProp) : undefined),
    [rightAxisSeries, categoriesProp]
  );
  const categoryColorOverrides = useMemo(
    () => categoriesProp ? categoryColors(categoriesProp) : {},
    [categoriesProp]
  );
  const seriesStyles = useMemo(() => {
    if (!Object.keys(categoryColorOverrides).length) return seriesStylesProp;
    const merged = { ...seriesStylesProp };
    for (const [key, color] of Object.entries(categoryColorOverrides)) {
      merged[key] = { ...merged[key], color };
    }
    return merged;
  }, [seriesStylesProp, categoryColorOverrides]);

  // --- Shared hooks ---
  const { containerRef, containerWidth, nivoTheme } = ctx;
  const allSeriesIds = useMemo(() => rawData.map((s) => s.id), [rawData]);
  const { hidden: hiddenSeries, toggle: toggleSeries, legendConfig, allHidden } = useChartLegend(
    rawData.length,
    legendProp,
    { allIds: allSeriesIds },
  );

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;

  // --- Filter hidden series ---
  const visibleRawData = rawData.filter((s) => !hiddenSeries.has(s.id));

  // --- 100% stacked: normalize data and store originals ---
  const originalValuesMap = useMemo(() => {
    if (!isPercentStack) return null;
    // Build a map of seriesId -> x -> originalY
    const map = new Map<string, Map<string | number, number | null>>();
    for (const series of visibleRawData) {
      const xMap = new Map<string | number, number | null>();
      for (const pt of series.data) {
        xMap.set(pt.x, pt.y);
      }
      map.set(series.id, xMap);
    }
    return map;
  }, [isPercentStack, visibleRawData]);

  const visibleData = useMemo(() => {
    if (!isPercentStack) return visibleRawData;
    // For each x, compute total and normalize to percentage
    // First collect all x values
    if (visibleRawData.length === 0) return visibleRawData;
    const xValues = visibleRawData[0].data.map((d) => d.x);
    const totals = new Map<string | number, number>();
    for (const x of xValues) {
      let total = 0;
      for (const series of visibleRawData) {
        const pt = series.data.find((d) => d.x === x);
        total += Math.abs(Number(pt?.y) || 0);
      }
      totals.set(x, total);
    }
    return visibleRawData.map((series) => ({
      ...series,
      data: series.data.map((pt) => {
        const total = totals.get(pt.x) || 0;
        if (total === 0 || pt.y === null) return { ...pt, y: 0 };
        return { ...pt, y: (Number(pt.y) / total) * 100 };
      }),
    }));
  }, [isPercentStack, visibleRawData]);

  // --- Dual Y-axis: normalize right-axis series ---
  const rightAxisSet = useMemo(
    () => new Set(resolvedRightAxisSeries ?? []),
    [resolvedRightAxisSeries]
  );
  const hasRightAxis = rightAxisSet.size > 0;

  // Store original right-axis values before normalization
  const rightOriginalValues = useMemo(() => {
    if (!hasRightAxis) return null;
    const map = new Map<string, Map<string | number, number | null>>();
    for (const series of visibleData) {
      if (!rightAxisSet.has(series.id)) continue;
      const xMap = new Map<string | number, number | null>();
      for (const pt of series.data) {
        xMap.set(pt.x, pt.y);
      }
      map.set(series.id, xMap);
    }
    return map;
  }, [hasRightAxis, visibleData, rightAxisSet]);

  // Compute left and right min/max, then normalize right-axis series to left scale
  const { normalizedVisibleData, rightMin, rightMax } = useMemo(() => {
    if (!hasRightAxis) return { normalizedVisibleData: visibleData, rightMin: 0, rightMax: 0 };

    const leftSeries = visibleData.filter((s) => !rightAxisSet.has(s.id));
    const rightSeries = visibleData.filter((s) => rightAxisSet.has(s.id));

    // Compute left min/max
    let leftMin = Infinity, leftMax = -Infinity;
    for (const s of leftSeries) {
      for (const pt of s.data) {
        if (pt.y !== null) {
          leftMin = Math.min(leftMin, pt.y);
          leftMax = Math.max(leftMax, pt.y);
        }
      }
    }
    if (!isFinite(leftMin)) { leftMin = 0; leftMax = 100; }
    // Add some padding
    const leftRange = leftMax - leftMin || 1;
    leftMin = leftMin - leftRange * 0.05;
    leftMax = leftMax + leftRange * 0.05;

    // Compute right min/max
    let rMin = Infinity, rMax = -Infinity;
    for (const s of rightSeries) {
      for (const pt of s.data) {
        if (pt.y !== null) {
          rMin = Math.min(rMin, pt.y);
          rMax = Math.max(rMax, pt.y);
        }
      }
    }
    if (!isFinite(rMin)) { rMin = 0; rMax = 100; }
    const rightRange = rMax - rMin || 1;
    rMin = rMin - rightRange * 0.05;
    rMax = rMax + rightRange * 0.05;

    // Normalize right series to left scale
    const normalized = visibleData.map((s) => {
      if (!rightAxisSet.has(s.id)) return s;
      return {
        ...s,
        data: s.data.map((pt) => {
          if (pt.y === null) return pt;
          const normalizedY = ((pt.y - rMin) / (rMax - rMin)) * (leftMax - leftMin) + leftMin;
          return { ...pt, y: normalizedY };
        }),
      };
    });

    return { normalizedVisibleData: normalized, rightMin: rMin, rightMax: rMax };
  }, [hasRightAxis, visibleData, rightAxisSet]);

  const data = hasRightAxis ? normalizedVisibleData : visibleData;

  // --- Merge comparison data as dashed series ---
  const comparisonSeriesIds = useMemo(
    () => (comparisonData ? comparisonData.map((s) => `${COMPARISON_PREFIX}${s.id}`) : []),
    [comparisonData]
  );

  // Fix #6: If all primary series are hidden, also hide comparison counterparts
  const allPrimaryHidden = data.length === 0 && rawData.length > 0;

  const allData = useMemo(() => {
    if (!comparisonData || allPrimaryHidden) return data;
    const comp = comparisonData
      .filter((s) => !hiddenSeries.has(s.id))
      .map((s) => ({ ...s, id: `${COMPARISON_PREFIX}${s.id}` }));
    return [...data, ...comp];
  }, [data, comparisonData, hiddenSeries, allPrimaryHidden]);

  // --- Apply chartNullMode transformation ---
  const processedData = useMemo(() => {
    if (resolvedChartNullMode === "gap") return allData;
    if (resolvedChartNullMode === "zero") {
      return allData.map((series) => ({
        ...series,
        data: series.data.map((pt) => ({
          ...pt,
          y: pt.y === null ? 0 : pt.y,
        })),
      }));
    }
    // "connect": filter out null points so Nivo draws continuous lines
    return allData.map((series) => ({
      ...series,
      data: series.data.filter((pt) => pt.y !== null),
    }));
  }, [allData, resolvedChartNullMode]);

  // --- Colors array: main colors + faded for comparison ---
  const allColors = useMemo(() => {
    const base = data.map((s, i) => {
      const override = seriesStyles?.[s.id]?.color;
      return override ?? seriesColors[i % seriesColors.length];
    });
    if (!comparisonData) return base;
    const compColors = base.map((c) => withOpacity(c, 0.38));
    return [...base, ...compColors];
  }, [data, comparisonData, seriesColors, seriesStyles]);

  // --- Gradient defs ---
  const gradientDefs = useMemo(() => {
    if (!gradient || !enableArea) return [];
    return allData.map((series, i) => ({
      id: `gradient-${series.id.replace(/[^a-zA-Z0-9]/g, "_")}`,
      type: "linearGradient" as const,
      colors: [
        { offset: 0, color: allColors[i % allColors.length], opacity: 0.25 },
        { offset: 100, color: allColors[i % allColors.length], opacity: 0 },
      ],
    }));
  }, [gradient, enableArea, allData, allColors]);

  const gradientFills = useMemo(() => {
    if (!gradient || !enableArea) return [];
    return allData.map((series) => ({
      match: { id: series.id },
      id: `gradient-${series.id.replace(/[^a-zA-Z0-9]/g, "_")}`,
    }));
  }, [gradient, enableArea, allData]);

  // --- Determine if custom layers are needed ---
  const needsCustomLines = lineStyle !== "solid" || !!seriesStyles;
  const needsCustomPoints = enablePoints && !!seriesStyles && Object.values(seriesStyles).some(
    (s) => s.pointSize != null || s.pointColor != null || s.pointBorderWidth != null || s.pointBorderColor != null
  );

  // --- Right axis custom layer ---
  const rightAxisLayer = useMemo(() => {
    if (!hasRightAxis) return null;
    const rMin = rightMin;
    const rMax = rightMax;
    const rFormat = rightAxisFormat;
    const rLabel = rightAxisLabel;
    return function RightAxisLayer(props: LayerProps) {
      const { innerHeight, innerWidth } = props;
      const yScale = props.yScale as unknown as (value: number) => number;
      // Map right-axis values to pixel positions using the left scale
      // Since right-axis data is normalized to left scale, yScale converts left-scale values to pixels
      const tickCount = 5;
      const ticks: { value: number; y: number }[] = [];
      for (let i = 0; i <= tickCount; i++) {
        const rightVal = rMin + (rMax - rMin) * (i / tickCount);
        // Convert to left-scale normalized value, then to pixel
        const fraction = i / tickCount;
        const y = innerHeight * (1 - fraction);
        ticks.push({ value: rightVal, y });
      }
      return (
        <g transform={`translate(${innerWidth}, 0)`}>
          {/* Axis line */}
          <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="transparent" />
          {ticks.map((tick, idx) => (
            <g key={idx} transform={`translate(0, ${tick.y})`}>
              <text
                x={12}
                y={0}
                dy="0.32em"
                textAnchor="start"
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fill: "var(--muted)",
                }}
              >
                {formatValue(tick.value, rFormat, localeDefaults)}
              </text>
            </g>
          ))}
          {rLabel && (
            <text
              transform={`translate(52, ${innerHeight / 2}) rotate(90)`}
              textAnchor="middle"
              style={{
                fontSize: 11,
                fontWeight: 500,
                fill: "var(--muted)",
              }}
            >
              {rLabel}
            </text>
          )}
        </g>
      );
    };
  }, [hasRightAxis, rightMin, rightMax, rightAxisFormat, rightAxisLabel, localeDefaults]);

  // --- Custom layers ---
  const customLayers = useMemo(() => {
    const layers: LineSvgLayer<SeriesData>[] = [
      "grid" as LineLayerId,
      "markers" as LineLayerId,
      "axes" as LineLayerId,
    ];
    if (thresholds && thresholds.length > 0) {
      layers.push(createThresholdLayer(thresholds) as LineSvgLayer<SeriesData>);
    }
    if (referenceLines && referenceLines.length > 0) {
      layers.push(createReferenceLineLayer(referenceLines) as LineSvgLayer<SeriesData>);
    }
    layers.push("areas" as LineLayerId);
    layers.push("crosshair" as LineLayerId);

    if (needsCustomLines) {
      layers.push(createStyledLineLayer(
        { lineWidth, lineStyle },
        seriesStyles,
        comparisonSeriesIds,
      ) as LineSvgLayer<SeriesData>);
    } else {
      layers.push("lines" as LineLayerId);
      if (comparisonSeriesIds.length > 0) {
        layers.push(createDashedLineLayer(comparisonSeriesIds) as LineSvgLayer<SeriesData>);
      }
    }

    if (needsCustomPoints) {
      layers.push(createStyledPointLayer(
        { pointSize, pointColor, pointBorderWidth },
        seriesStyles!,
        comparisonSeriesIds,
      ) as LineSvgLayer<SeriesData>);
    } else {
      layers.push("points" as LineLayerId);
    }

    // Right axis layer (after points, before slices)
    if (rightAxisLayer) {
      layers.push(rightAxisLayer as LineSvgLayer<SeriesData>);
    }

    // Linked hover crosshair from sibling charts
    if (interaction.linkedHover) {
      layers.push(createLinkedCrosshairLayer(interaction.linkedHover.hoveredIndex, interaction.linkedHover.sourceId, interaction.linkedHoverId) as LineSvgLayer<SeriesData>);
    }

    layers.push("slices" as LineLayerId);
    layers.push("mesh" as LineLayerId);
    layers.push("legends" as LineLayerId);
    return layers;
  }, [thresholds, referenceLines, comparisonSeriesIds, needsCustomLines, needsCustomPoints, lineWidth, lineStyle, pointSize, pointColor, pointBorderWidth, seriesStyles, rightAxisLayer, interaction.linkedHover?.hoveredIndex, interaction.linkedHover?.sourceId, interaction.linkedHoverId]);

  // --- Y-axis formatter ---
  const formatYAxis = useCallback(
    (value: number) => {
      if (isPercentStack) return `${Math.round(value)}%`;
      return formatValue(value, format, localeDefaults);
    },
    [format, localeDefaults, isPercentStack]
  );

  // --- Smart X-axis tick thinning based on container width ---
  const xTickValues = useMemo(() => {
    if (!allData.length || !allData[0].data.length) return undefined;
    const labels = allData[0].data.map((d) => d.x);
    return calculateResponsiveTicks(labels, containerWidth);
  }, [allData, containerWidth]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      rawData.map((series, i) => {
        // Latest non-null value for the legend summary
        const lastPoint = [...series.data].reverse().find((d) => d.y !== null);
        const lastValue = lastPoint?.y;
        return {
          id: series.id,
          label: series.id,
          color: seriesStyles?.[series.id]?.color ?? seriesColors[i % seriesColors.length],
          value: lastValue != null ? formatValue(lastValue, format, localeDefaults) : undefined,
        };
      }),
    [rawData, seriesStyles, seriesColors, format, localeDefaults]
  );

  return (
    <div
      ref={ref}
      style={{ minWidth: 120, height: "100%" }}
      onMouseLeave={() => {
        if (interaction.linkedHover) {
          sliceIndexRef.current = null;
          interaction.linkedHover.setHoveredIndex(null, interaction.linkedHoverId);
        }
      }}
    >
    <div ref={containerRef} style={{ height: "100%" }}>
    <ChartContainer componentName="AreaChart"
      shell={{
        title, subtitle, description, footnote, action, headline,
        variant: resolvedVariant, aiContext, loading, empty, error, stale,
        className: classNames?.root ?? className,
        classNames: classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined,
        id, "data-testid": dataTestId,
      }}
      height={resolvedHeight}
      exportData={dataProp as DataRow[]}
      below={<>
        {legendConfig && (
          <ChartLegend
            items={legendItems}
            hidden={hiddenSeries}
            onToggle={toggleSeries}
            toggleable={legendConfig.toggleable !== false}
            className={classNames?.legend}
            onHover={interaction.linkedHover ? (id) => interaction.linkedHover!.setHoveredSeries(id, interaction.linkedHoverId) : undefined}
          />
        )}
        {comparisonData && comparisonData.length > 0 && (
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[length:var(--mu-text-2xs)] text-[var(--muted)] opacity-60">
            <svg width="16" height="2" className="flex-shrink-0">
              <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <span>Previous period</span>
          </div>
        )}
      </>}
    >
      <ResponsiveLine
        data={processedData}
        theme={nivoTheme}
        colors={allColors}
        margin={{
          top: denseValues.marginTop,
          right: hasRightAxis ? (rightAxisLabel ? 80 : 64) : containerWidth < 400 ? 8 : 16,
          bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
          left: containerWidth < 300 ? 8 : containerWidth < 400 ? 36 : yAxisLabel ? 72 : 60,
        }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: isPercentStack ? 0 : "auto",
          max: isPercentStack ? 100 : "auto",
          stacked,
        }}
        curve={curve}
        lineWidth={lineWidth}
        enablePoints={enablePoints && !needsCustomPoints}
        pointSize={pointSize}
        pointColor={pointColor}
        pointBorderWidth={pointBorderWidth}
        pointBorderColor={pointBorderColor ?? { from: "serieColor" }}
        enableArea={enableArea}
        areaOpacity={gradient ? 1 : areaOpacity}
        enableGridX={enableGridX}
        enableGridY={enableGridY}
        axisTop={null}
        axisRight={null}
        axisBottom={containerWidth < 200 ? null : {
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0,
          tickValues: xTickValues,
          legend: containerWidth < 400 ? undefined : xAxisLabel,
          legendOffset: 38,
          legendPosition: "middle" as const,
        }}
        axisLeft={containerWidth < 300 ? null : {
          tickSize: 0,
          tickPadding: containerWidth < 400 ? 6 : 12,
          tickValues: containerWidth < 500 ? 3 : 5,
          format: formatYAxis,
          legend: containerWidth < 400 ? undefined : yAxisLabel,
          legendOffset: -52,
          legendPosition: "middle" as const,
        }}
        useMesh={true}
        enableSlices="x"
        sliceTooltip={({ slice }) => {
          const points = slice.points as unknown as ReadonlyArray<Point<SeriesData>>;
          if (points.length === 0) return null;
          const xVal = points[0].data.x;

          // Emit to linked hover context — use setTimeout(0) to escape
          // React's commit cycle and avoid infinite re-render loops
          // from Nivo's TooltipWrapper useLayoutEffect.
          if (sliceIndexRef.current !== xVal) {
            sliceIndexRef.current = xVal as string | number;
            setTimeout(() => interaction.linkedHover?.setHoveredIndex(xVal as string | number, interaction.linkedHoverId), 0);
          }

          // Split current vs comparison series
          const currentPoints = points.filter(
            (p) => !String(p.seriesId).startsWith(COMPARISON_PREFIX)
          );
          const comparisonPts = points.filter(
            (p) => String(p.seriesId).startsWith(COMPARISON_PREFIX)
          );

          return (
            <ChartTooltip
              header={String(xVal)}
              items={currentPoints.map((p) => {
                const sid = String(p.seriesId);
                const isRight = rightAxisSet.has(sid);

                // Determine the real value
                let realValue: number | null = p.data.y as number | null;
                if (isPercentStack && originalValuesMap) {
                  const orig = originalValuesMap.get(sid)?.get(p.data.x as string | number);
                  realValue = orig ?? null;
                }
                if (isRight && rightOriginalValues) {
                  const orig = rightOriginalValues.get(sid)?.get(p.data.x as string | number);
                  realValue = orig ?? null;
                }

                const fmtToUse = isRight ? (rightAxisFormat ?? format) : format;
                const formattedVal = realValue !== null
                  ? formatValue(realValue, fmtToUse, localeDefaults)
                  : "\u2014";

                // For percent stack, show percentage as secondary
                let secondary: string | undefined;
                if (isPercentStack && p.data.y !== null) {
                  secondary = `${(p.data.y as number).toFixed(1)}%`;
                }

                return {
                  color: p.seriesColor,
                  label: sid,
                  value: formattedVal,
                  secondary,
                };
              })}
              comparisonItems={comparisonPts.length > 0 ? comparisonPts.map((p) => ({
                color: p.seriesColor,
                label: String(p.seriesId).slice(COMPARISON_PREFIX.length),
                value: p.data.y !== null ? formatValue(p.data.y as number, format, localeDefaults) : "\u2014",
              })) : undefined}
              actionHint={interaction.actionHint}
            />
          );
        }}
        crosshairType="bottom-left"
        animate={resolvedAnimate}
        motionConfig={resolvedAnimate ? config.motionConfig : undefined}
        layers={customLayers}
        defs={gradientDefs}
        fill={gradientFills}
        onClick={
          (onPointClick || interaction.isInteractive)
            ? (rawPoint) => {
                const point = rawPoint as unknown as Point<SeriesData>;
                if (point.seriesId !== undefined) {
                  const sid = String(point.seriesId);
                  const event: PointClickEvent = {
                    id: sid,
                    value: point.data.y as number,
                    label: String(point.data.x),
                    seriesId: sid,
                    x: point.data.x as string | number,
                    y: point.data.y as number,
                  };
                  onPointClick?.(event);
                  interaction.handleClick({ title: String(point.data.x), value: point.data.x as string | number, field: indexProp ?? "x", seriesId: sid });
                }
              }
            : undefined
        }
      />
    </ChartContainer>
    </div>
    </div>
  );
});

import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const AreaChart = withErrorBoundary(AreaChartInner, "AreaChart");
(AreaChart as any).__gridHint = "chart";
