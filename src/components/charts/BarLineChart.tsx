"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type {
  BarDatum,
  BarLayer,
  BarCustomLayerProps,
  BarTooltipProps,
} from "@nivo/bar";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import type { ChartLegendItem } from "./ChartLegend";
import { useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { useChartLegend } from "@/lib/useChartLegend";
import { calculateResponsiveTicks } from "@/lib/calculateResponsiveTicks";
import type { LegendConfig, BarClickEvent } from "@/lib/chartTypes";
import type { CardVariant, ChartNullMode, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { toBarLineData, categoryKeys, resolveCategory, type Category } from "@/lib/dataTransform";
import { useLinkedHover, useLinkedHoverId } from "@/lib/LinkedHoverContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useDrillDownAction } from "@/components/ui/DrillDownPanel";

import { assertPeer } from "@/lib/peerCheck";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

type LineSeriesData = { id: string; data: { x: string | number; y: number | null }[] };

export interface BarLineChartProps {
  /** Unified flat row data. Use with `index` and `categories` (mark line series with `axis: "right"`). */
  data?: Record<string, unknown>[];
  /** Column name for the X-axis. Used with unified `data` prop. */
  index?: string;
  /** Value columns. Categories with `axis: "right"` become lines, the rest become bars. */
  categories?: Category[];
  /** Bar data — same shape as BarChart */
  barData?: Record<string, string | number>[];
  /** Keys for bars */
  barKeys?: string[];
  /** Index field name */
  indexBy?: string;
  /** Line data — same shape as AreaChart/LineChart */
  lineData?: LineSeriesData[];

  // Standard chart props
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for bar values (left Y-axis) */
  format?: FormatOption;
  /** Format for line values (right Y-axis) */
  lineFormat?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Bar colors. Default: theme series palette */
  colors?: string[];
  /** Line colors. Default: theme series palette offset after bar keys */
  lineColors?: string[];
  /** Variant */
  variant?: CardVariant;
  /** Additional class names */
  className?: string;
  /** Data states */
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
  /** Legend configuration. Default: shown for multi-key data */
  legend?: boolean | LegendConfig;

  // Bar-specific
  /** How multiple bar keys are displayed. Default: "stacked" */
  groupMode?: "stacked" | "grouped";
  /** Gap between bar groups. Default: 0.3 */
  padding?: number;
  /** Corner radius on bars. Default: 4 */
  borderRadius?: number;

  // Line-specific
  /** Line width in px. Default: 2 */
  lineWidth?: number;
  /** Show data points on lines. Default: true */
  enablePoints?: boolean;
  /** Point radius in px. Default: 5 */
  pointSize?: number;
  /** Line interpolation. Default: "monotoneX" */
  curve?: CurveType;
  /** Fill area under lines. Default: false */
  enableArea?: boolean;

  // Axes
  /** X-axis label */
  xAxisLabel?: string;
  /** Left Y-axis label (bars) */
  yAxisLabel?: string;
  /** Right Y-axis label (lines) */
  rightAxisLabel?: string;

  /** Compact layout — reduces margins and default height. Default: false */
  dense?: boolean;
  /** How null / missing data points are handled. Default: "gap" */
  chartNullMode?: ChartNullMode;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Drill-down content renderer. When set, clicking a bar opens the drill-down panel. Takes priority over crossFilter for the click action. */
  drillDown?: (event: BarClickEvent) => React.ReactNode;
  /** Emit cross-filter selection on bar click. Defaults field to the `indexBy` value. */
  crossFilter?: boolean | { field?: string };
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; legend?: string };
  /** HTML id attribute */
  id?: string;
  /** Test id for testing frameworks */
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// SVG path helpers
// ---------------------------------------------------------------------------

function linearPathD(points: { x: number; y: number }[]): string {
  return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
}

function monotoneXPathD(points: { x: number; y: number }[]): string {
  if (points.length < 3) return linearPathD(points);
  const n = points.length;
  const d: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    d.push(dx === 0 ? 0 : (points[i + 1].y - points[i].y) / dx);
  }
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push((d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(d[i]) < 1e-12) { m[i] = 0; m[i + 1] = 0; } else {
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
  }
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (points[i + 1].x - points[i].x) / 3;
    path += ` C ${points[i].x + dx} ${points[i].y + m[i] * dx} ${points[i + 1].x - dx} ${points[i + 1].y - m[i + 1] * dx} ${points[i + 1].x} ${points[i + 1].y}`;
  }
  return path;
}

function buildLinePath(points: { x: number; y: number }[], curve: CurveType): string {
  if (curve === "monotoneX" || curve === "natural" || curve === "catmullRom" || curve === "cardinal") {
    return monotoneXPathD(points);
  }
  return linearPathD(points);
}

// ---------------------------------------------------------------------------
// Line overlay layer for ResponsiveBar
// ---------------------------------------------------------------------------

function createLineLayer(
  lineData: LineSeriesData[],
  indexBy: string,
  barData: Record<string, string | number>[],
  lineColors: string[],
  lineFormat: FormatOption | undefined,
  localeDefaults: { locale: string; currency: string },
  options: {
    lineWidth: number;
    enablePoints: boolean;
    pointSize: number;
    curve: CurveType;
    enableArea: boolean;
    rightAxisLabel?: string;
  },
) {
  // Compute right-axis scale from line data
  let lineMin = Infinity;
  let lineMax = -Infinity;
  for (const series of lineData) {
    for (const pt of series.data) {
      if (pt.y !== null) {
        if (pt.y < lineMin) lineMin = pt.y;
        if (pt.y > lineMax) lineMax = pt.y;
      }
    }
  }
  if (!isFinite(lineMin)) { lineMin = 0; lineMax = 100; }
  // Add padding
  const lineRange = lineMax - lineMin || 1;
  lineMin = lineMin - lineRange * 0.05;
  lineMax = lineMax + lineRange * 0.05;

  return function LineOverlayLayer(props: BarCustomLayerProps<BarDatum>) {
    const { innerWidth, innerHeight, bars } = props;

    // Build x position map from bar data: index value -> center x position
    // Group bars by indexValue to find the center of each group
    const indexPositions = new Map<string, number>();
    const indexGroups = new Map<string, { minX: number; maxX: number; width: number }>();
    for (const bar of bars) {
      const idx = String(bar.data.indexValue);
      const existing = indexGroups.get(idx);
      if (!existing) {
        indexGroups.set(idx, { minX: bar.x, maxX: bar.x + bar.width, width: bar.width });
      } else {
        existing.minX = Math.min(existing.minX, bar.x);
        existing.maxX = Math.max(existing.maxX, bar.x + bar.width);
      }
    }
    for (const [idx, group] of indexGroups) {
      indexPositions.set(idx, (group.minX + group.maxX) / 2);
    }

    // Y scale for lines
    const yScale = (value: number) => {
      const fraction = (value - lineMin) / (lineMax - lineMin);
      return innerHeight * (1 - fraction);
    };

    // Build paths
    return (
      <g>
        {/* Right axis ticks */}
        <g transform={`translate(${innerWidth}, 0)`}>
          {Array.from({ length: 6 }, (_, i) => {
            const value = lineMin + (lineMax - lineMin) * (i / 5);
            const y = yScale(value);
            return (
              <g key={i} transform={`translate(0, ${y})`}>
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
                  {formatValue(value, lineFormat, localeDefaults)}
                </text>
              </g>
            );
          })}
          {options.rightAxisLabel && (
            <text
              transform={`translate(52, ${innerHeight / 2}) rotate(90)`}
              textAnchor="middle"
              style={{
                fontSize: 11,
                fontWeight: 500,
                fill: "var(--muted)",
              }}
            >
              {options.rightAxisLabel}
            </text>
          )}
        </g>

        {/* Lines */}
        {lineData.map((series, si) => {
          const color = lineColors[si % lineColors.length];
          // Build the index order from bar data
          const indexOrder = barData.map((d) => String(d[indexBy]));
          const points: { x: number; y: number; value: number }[] = [];

          for (const xLabel of indexOrder) {
            const pt = series.data.find((d) => String(d.x) === xLabel);
            const xPos = indexPositions.get(xLabel);
            if (pt && pt.y !== null && xPos !== undefined) {
              points.push({ x: xPos, y: yScale(pt.y), value: pt.y });
            }
          }

          if (points.length < 2) return null;

          // Build SVG path using the selected curve interpolation
          const pathD = buildLinePath(points, options.curve);

          // Area path
          let areaD: string | undefined;
          if (options.enableArea) {
            areaD = pathD + ` L ${points[points.length - 1].x} ${innerHeight} L ${points[0].x} ${innerHeight} Z`;
          }

          return (
            <g key={series.id}>
              {/* Area fill */}
              {areaD && (
                <path
                  d={areaD}
                  fill={color}
                  opacity={0.08}
                />
              )}
              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={options.lineWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Points */}
              {options.enablePoints &&
                points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={options.pointSize / 2}
                    fill="var(--card-bg)"
                    stroke={color}
                    strokeWidth={2}
                  />
                ))}
            </g>
          );
        })}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BarLineChartInner = forwardRef<HTMLDivElement, BarLineChartProps>(function BarLineChart({
  data: unifiedData = [],
  index: indexProp,
  categories: categoriesProp,
  barData: barDataProp,
  barKeys: barKeysProp,
  indexBy: indexByProp,
  lineData: lineDataProp,
  title,
  subtitle,
  description,
  footnote,
  action,
  format,
  lineFormat,
  height,
  colors: barColorsProp,
  lineColors: lineColorsProp,
  variant,
  className,
  loading,
  empty,
  error,
  stale,
  legend: legendProp,
  groupMode = "stacked",
  padding = 0.3,
  borderRadius = 4,
  lineWidth = 2,
  enablePoints = true,
  pointSize = 5,
  curve = "monotoneX",
  enableArea = false,
  xAxisLabel,
  yAxisLabel,
  rightAxisLabel,
  dense,
  chartNullMode,
  animate: animateProp,
  drillDown,
  crossFilter: crossFilterProp,
  classNames,
  id,
  "data-testid": dataTestId,
}, ref) {
  assertPeer(ResponsiveBar, "@nivo/bar", "BarLineChart");
  const openDrill = useDrillDownAction();
  const linkedHover = useLinkedHover();
  const linkedHoverId = useLinkedHoverId();
  const crossFilter = useCrossFilter();
  const crossFilterField = crossFilterProp
    ? (typeof crossFilterProp === "object" ? crossFilterProp.field : undefined) ?? indexByProp ?? indexProp ?? "index"
    : undefined;

  // --- Resolve unified data → bar + line split ---
  const resolved = useMemo(() => {
    if (unifiedData && indexProp && categoriesProp) {
      return toBarLineData(unifiedData, indexProp, categoriesProp);
    }
    return null;
  }, [unifiedData, indexProp, categoriesProp]);

  const barData = barDataProp ?? resolved?.barData ?? [];
  const barKeys = barKeysProp ?? resolved?.barKeys ?? [];
  const indexBy = indexByProp ?? resolved?.indexBy ?? "";
  const lineData = lineDataProp ?? resolved?.lineData ?? [];

  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedHeight = height ?? denseValues.chartHeight;
  const resolvedChartNullMode = chartNullMode ?? config.chartNullMode;

  // Total number of legend items = bar keys + line series
  const totalItems = barKeys.length + lineData.length;
  const allLegendIds = useMemo(() => [...barKeys, ...lineData.map((s) => s.id)], [barKeys, lineData]);
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig, allHidden } = useChartLegend(
    totalItems,
    legendProp,
    { allIds: allLegendIds },
  );

  // Colors
  const allSeriesColors = barColorsProp ?? config.colors;
  const barColors = allSeriesColors;
  const lineColors = lineColorsProp ?? config.colors.slice(barKeys.length);

  // Visible bar keys and line series
  const visibleBarKeys = barKeys.filter((k) => !hiddenKeys.has(k));
  const visibleLineData = lineData.filter((s) => !hiddenKeys.has(s.id));

  // --- Apply chartNullMode to line data ---
  const processedLineData = useMemo(() => {
    if (resolvedChartNullMode === "gap") return visibleLineData;
    if (resolvedChartNullMode === "zero") {
      return visibleLineData.map((series) => ({
        ...series,
        data: series.data.map((pt) => ({
          ...pt,
          y: pt.y === null ? 0 : pt.y,
        })),
      }));
    }
    // "connect": filter out null points
    return visibleLineData.map((series) => ({
      ...series,
      data: series.data.filter((pt) => pt.y !== null),
    }));
  }, [visibleLineData, resolvedChartNullMode]);

  // --- Apply chartNullMode to bar data (only "zero" transforms) ---
  const processedBarData = useMemo(() => {
    if (resolvedChartNullMode !== "zero") return barData;
    return barData.map((row) => {
      const out: Record<string, string | number> = { [indexBy]: row[indexBy] };
      for (const k of visibleBarKeys) {
        const v = row[k];
        out[k] = v == null ? 0 : v;
      }
      return out;
    });
  }, [barData, resolvedChartNullMode, visibleBarKeys, indexBy]);

  // Bar color function
  const barColorFn = useCallback(
    (datum: { id: string | number }) => {
      const keyIndex = barKeys.indexOf(String(datum.id));
      return barColors[(keyIndex >= 0 ? keyIndex : 0) % barColors.length];
    },
    [barKeys, barColors]
  );

  // Format bar axis
  const formatBarAxis = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults]
  );

  // X-axis ticks
  const xTickValues = useMemo(() => {
    const labels = barData.map((d) => String(d[indexBy]));
    return calculateResponsiveTicks(labels, containerWidth);
  }, [barData, containerWidth, indexBy]);

  // Build lookup for line values by index for tooltip
  const lineValueLookup = useMemo(() => {
    const map = new Map<string, Map<string, number | null>>();
    for (const series of lineData) {
      const xMap = new Map<string, number | null>();
      for (const pt of series.data) {
        xMap.set(String(pt.x), pt.y);
      }
      map.set(series.id, xMap);
    }
    return map;
  }, [lineData]);

  // Line color map for tooltip
  const lineColorMap = useMemo(() => {
    const map = new Map<string, string>();
    lineData.forEach((s, i) => {
      map.set(s.id, lineColors[i % lineColors.length]);
    });
    return map;
  }, [lineData, lineColors]);

  // Custom layers
  const customLayers = useMemo(() => {
    const layers: BarLayer<BarDatum>[] = [
      "grid",
      "axes",
      "bars",
      "markers",
    ];

    if (processedLineData.length > 0) {
      layers.push(
        createLineLayer(
          processedLineData,
          indexBy,
          processedBarData,
          lineColors,
          lineFormat,
          localeDefaults,
          {
            lineWidth,
            enablePoints,
            pointSize,
            curve,
            enableArea,
            rightAxisLabel,
          }
        ) as BarLayer<BarDatum>
      );
    }

    layers.push("legends", "annotations");
    return layers;
  }, [
    processedLineData, indexBy, processedBarData, lineColors, lineFormat,
    localeDefaults, lineWidth, enablePoints, pointSize, curve, enableArea, rightAxisLabel,
  ]);

  // Margins
  const margin = useMemo(() => ({
    top: denseValues.marginTop,
    right: rightAxisLabel ? 80 : 64,
    bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
    left: containerWidth < 300 ? 8 : containerWidth < 400 ? 36 : yAxisLabel ? 72 : 60,
  }), [containerWidth, xAxisLabel, yAxisLabel, rightAxisLabel, denseValues]);

  // Legend items: bars (square) + lines (line indicator)
  const legendItems: ChartLegendItem[] = useMemo(() => {
    const items: ChartLegendItem[] = [];
    barKeys.forEach((key, i) => {
      items.push({
        id: key,
        label: key,
        color: barColors[i % barColors.length],
      });
    });
    lineData.forEach((series, i) => {
      items.push({
        id: series.id,
        label: series.id,
        color: lineColors[i % lineColors.length],
      });
    });
    return items;
  }, [barKeys, barColors, lineData, lineColors]);

  // Axis configs
  const valueAxisTicks = containerWidth < 500 ? 3 : 5;

  return (
    <div ref={ref} id={id} data-testid={dataTestId} style={{ minWidth: 120, height: "100%" }}>
    <div ref={containerRef} style={{ height: "100%" }}>
      <ChartContainer componentName="BarLineChart"
        title={title}
        subtitle={subtitle}
        description={description}
        footnote={footnote}
        action={action}
        height={resolvedHeight}
        variant={resolvedVariant}

        className={classNames?.root ?? className}
        loading={loading}
        empty={empty}
        error={error}
        stale={stale}
        below={legendConfig ? (
          <ChartLegend
            items={legendItems}
            hidden={hiddenKeys}
            onToggle={toggleKey}
            toggleable={legendConfig.toggleable !== false}
            onHover={linkedHover ? (id) => linkedHover.setHoveredSeries(id, linkedHoverId) : undefined}
          />
        ) : undefined}
      >
        <ResponsiveBar
          data={processedBarData}
          keys={visibleBarKeys}
          indexBy={indexBy}
          theme={nivoTheme}
          colors={barColorFn}
          margin={margin}
          padding={padding}
          innerPadding={groupMode === "grouped" ? 4 : -1}
          groupMode={groupMode}
          borderRadius={groupMode === "stacked" ? 0 : borderRadius}
          borderWidth={0}
          enableGridX={false}
          enableGridY={true}
          enableLabel={false}
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
            tickValues: valueAxisTicks,
            format: formatBarAxis,
            legend: containerWidth < 400 ? undefined : yAxisLabel,
            legendOffset: -52,
            legendPosition: "middle" as const,
          }}
          tooltip={({ indexValue }: BarTooltipProps<BarDatum>) => {
            const row = barData.find((d) => String(d[indexBy]) === String(indexValue));
            return (
              <ChartTooltip
                header={String(indexValue)}
                items={[
                  // Bar items
                  ...visibleBarKeys.map((key) => ({
                    color: barColors[barKeys.indexOf(key) % barColors.length],
                    label: key,
                    value: row && row[key] != null
                      ? formatValue(Number(row[key]), format, localeDefaults)
                      : "\u2014",
                  })),
                  // Line items
                  ...visibleLineData.map((series) => {
                    const val = lineValueLookup.get(series.id)?.get(String(indexValue));
                    return {
                      color: lineColorMap.get(series.id) ?? "var(--muted)",
                      label: series.id,
                      value: val != null
                        ? formatValue(val, lineFormat, localeDefaults)
                        : "\u2014",
                    };
                  }),
                ]}
              />
            );
          }}
          onClick={
            (drillDown || (crossFilterProp && crossFilter))
              ? (datum) => {
                  if (drillDown) {
                    const event: BarClickEvent = {
                      id: datum.id,
                      value: datum.value,
                      label: String(datum.indexValue),
                      key: String(datum.id),
                      indexValue: datum.indexValue,
                    };
                    openDrill(
                      { title: String(datum.indexValue), field: crossFilterField ?? indexBy, value: datum.indexValue },
                      drillDown(event),
                    );
                  } else if (crossFilterProp && crossFilter && crossFilterField) {
                    crossFilter.select({ field: crossFilterField, value: datum.indexValue as string | number });
                  }
                }
              : undefined
          }
          animate={resolvedAnimate}
          motionConfig={resolvedAnimate ? config.motionConfig : undefined}
          layers={customLayers}
        />
      </ChartContainer>
    </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const BarLineChart = withErrorBoundary(BarLineChartInner, "BarLineChart");
(BarLineChart as any).__gridHint = "chart";
