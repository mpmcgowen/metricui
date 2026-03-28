"use client";

import { forwardRef, useCallback, useMemo, useRef } from "react";
import { ResponsivePie } from "@nivo/pie";
import type {
  ComputedDatum,
  PieTooltipProps,
  PieCustomLayerProps,
  PieLayer,
} from "@nivo/pie";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { useChartLegend } from "@/lib/useChartLegend";
import type { LegendConfig, SliceClickEvent } from "@/lib/chartTypes";
import type { CardVariant, ChartNullMode, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { toDonutData, type Category } from "@/lib/dataTransform";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { assertPeer } from "@/lib/peerCheck";
import { devWarn } from "@/lib/devWarnings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DonutDatum {
  id: string;
  label: string;
  /** Slice value. `null` or `0` slices can be auto-hidden via `hideZeroSlices`. */
  value: number;
  color?: string;
}

export interface DonutSeriesStyle {
  color?: string;
}

export type { LegendConfig };

type SortMode = "desc" | "asc" | "none";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DonutChartProps extends DataComponentProps {
  data?: DonutDatum[] | DataRow[];
  /** Column name to use as slice labels. */
  index?: string;
  /** Value column(s) to chart. For donut charts, typically a single category. */
  categories?: Category[];
  /** Simple data format — plain key-value object like { "Chrome": 45, "Firefox": 25 }.
   *  Converted to DonutDatum[] internally. `data` takes precedence when non-empty. */
  simpleData?: Record<string, number>;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for values in tooltips and labels */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Inner radius ratio (0-1). 0 = pie chart. Default: 0.6 */
  innerRadius?: number;
  /** Gap between slices in degrees. Default: 0.7 */
  padAngle?: number;
  /** Rounded slice edges in px. Default: 3 */
  cornerRadius?: number;
  /** Start angle in degrees. Default: 0 */
  startAngle?: number;
  /** End angle in degrees. Default: 360 */
  endAngle?: number;
  /** Sort slices by value. Default: "desc" */
  sortSlices?: SortMode;
  /** Hover expansion offset in px. Default: 4 */
  activeOuterRadiusOffset?: number;
  /** Show value labels on slices. Default: false */
  enableArcLabels?: boolean;
  /** Minimum angle to show arc label (degrees). Default: 10 */
  arcLabelsSkipAngle?: number;
  /** Show lines connecting slices to external labels. Default: false */
  enableArcLinkLabels?: boolean;
  /** Minimum angle to show arc link label (degrees). Default: 10 */
  arcLinkLabelsSkipAngle?: number;
  /** Show percentages instead of raw values. Default: false */
  showPercentage?: boolean;
  /** Big number in the donut center */
  centerValue?: string;
  /** Label below the center value */
  centerLabel?: string;
  /** Custom ReactNode for full control of center content */
  centerContent?: React.ReactNode;
  /** Slice border width. Default: 1 */
  borderWidth?: number;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Per-slice color overrides keyed by slice id */
  seriesStyles?: Record<string, DonutSeriesStyle>;
  /** Legend configuration. Default: shown with toggle */
  legend?: boolean | LegendConfig;
  /** Hide slices with value 0 or null. Default: true */
  hideZeroSlices?: boolean;
  /** Click handler for slices */
  onSliceClick?: (slice: SliceClickEvent) => void;
  /** Drill-down content renderer. When set, clicking a slice opens the drill-down panel. Takes priority over crossFilter for the click action.
   *  Pass `true` for an auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: SliceClickEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Enable cross-filter selection. Pass `true` to use "id" as the field, or `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** How null / missing data points are handled. No behavioral change for donut; included for API consistency. */
  chartNullMode?: ChartNullMode;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Custom tooltip (uses shared ChartTooltip)
// ---------------------------------------------------------------------------

function DonutTooltipWrapper({
  datum,
  format,
  showPercentage,
  total,
  actionHint,
}: PieTooltipProps<DonutDatum> & {
  format?: FormatOption;
  showPercentage?: boolean;
  total: number;
  actionHint?: string;
}) {
  const localeDefaults = useLocale();
  const pct = total > 0 ? ((datum.value / total) * 100).toFixed(1) : "0";

  return (
    <ChartTooltip
      items={[
        {
          color: datum.color,
          label: String(datum.label),
          value: showPercentage
            ? `${pct}%`
            : formatValue(datum.value, format, localeDefaults),
          secondary: showPercentage
            ? formatValue(datum.value, format, localeDefaults)
            : `${pct}%`,
        },
      ]}
      actionHint={actionHint}
    />
  );
}

// ---------------------------------------------------------------------------
// Center content layer
// ---------------------------------------------------------------------------

function createCenterLayer(
  centerValue?: string,
  centerLabel?: string,
  centerContent?: React.ReactNode
) {
  return function CenterLayer({
    centerX,
    centerY,
    innerRadius,
  }: PieCustomLayerProps<DonutDatum>) {
    if (centerContent) {
      return (
        <foreignObject
          x={centerX - innerRadius}
          y={centerY - innerRadius}
          width={innerRadius * 2}
          height={innerRadius * 2}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {centerContent}
          </div>
        </foreignObject>
      );
    }

    if (!centerValue && !centerLabel) return null;

    // Responsive font sizes based on inner radius
    const valueFontSize = Math.min(Math.max(innerRadius * 0.38, 14), 36);
    const labelFontSize = Math.min(Math.max(innerRadius * 0.16, 9), 13);

    return (
      <g>
        {centerValue && (
          <text
            x={centerX}
            y={centerLabel ? centerY - labelFontSize * 0.4 : centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: `${valueFontSize}px`,
              fontWeight: 700,
              fill: "var(--foreground)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x={centerX}
            y={centerValue ? centerY + valueFontSize * 0.55 : centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: `${labelFontSize}px`,
              fontWeight: 500,
              fill: "var(--muted)",
              letterSpacing: "0.02em",
            }}
          >
            {centerLabel}
          </text>
        )}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DonutChartInner = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart({
  data: dataProp = [],
  index: indexProp,
  categories: categoriesProp,
  simpleData,
  title,
  subtitle,
  description,
  footnote,
  action,
  format,
  height,
  innerRadius = 0.6,
  padAngle = 0.7,
  cornerRadius = 3,
  startAngle = 0,
  endAngle = 360,
  sortSlices = "desc",
  activeOuterRadiusOffset: activeOuterRadiusOffsetProp,
  enableArcLabels = false,
  arcLabelsSkipAngle = 10,
  enableArcLinkLabels = false,
  arcLinkLabelsSkipAngle = 10,
  showPercentage = false,
  centerValue,
  centerLabel,
  centerContent,
  borderWidth = 1,
  colors: chartColors,
  seriesStyles,
  legend: legendProp,
  hideZeroSlices = true,
  onSliceClick,
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
  assertPeer(ResponsivePie, "@nivo/pie", "DonutChart");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();

  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedDense = dense ?? config.dense;
  const resolvedHeight = height ?? denseValues.chartHeight;
  const _resolvedChartNullMode = chartNullMode ?? config.chartNullMode; // API consistency; no behavioral change for donut
  void _resolvedChartNullMode;
  const activeOuterRadiusOffset = activeOuterRadiusOffsetProp ?? (resolvedDense ? 2 : 4);

  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: indexProp ?? "id",
    tooltipHint,
    data: dataProp as DataRow[],
  });

  // --- Resolve data: unified format → DonutDatum[] ---
  const data = useMemo((): DonutDatum[] => {
    // 1. Unified format: flat rows + index + categories
    if (dataProp && dataProp.length > 0 && (indexProp || categoriesProp)) {
      const rows = dataProp as DataRow[];
      if (indexProp && categoriesProp) {
        return toDonutData(rows, indexProp, categoriesProp);
      }
    }
    // 2. Nivo-native DonutDatum[] (has id + value)
    if (dataProp && dataProp.length > 0) {
      const first = dataProp[0] as Record<string, unknown>;
      if ("id" in first && "value" in first) return dataProp as DonutDatum[];
      // 2b. Auto-infer from flat rows (first string col = label, first number col = value)
      const rows = dataProp as DataRow[];
      let labelKey: string | null = null;
      let valueKey: string | null = null;
      for (const [k, v] of Object.entries(rows[0])) {
        if (!labelKey && typeof v === "string") labelKey = k;
        else if (!valueKey && typeof v === "number") valueKey = k;
      }
      if (labelKey && valueKey) {
        if (process.env.NODE_ENV !== "production") {
          devWarn("DonutChart.autoInfer", "DonutChart: Data was auto-inferred from flat rows. For explicit control, pass `index` and `categories` props.");
        }
        return toDonutData(rows, labelKey, [valueKey]);
      }
      return dataProp as DonutDatum[];
    }
    // 3. Legacy simpleData
    if (simpleData && Object.keys(simpleData).length > 0) {
      return Object.entries(simpleData).map(([key, value]): DonutDatum => ({
        id: key,
        label: key,
        value,
      }));
    }
    return (dataProp as DonutDatum[]) ?? [];
  }, [dataProp, indexProp, categoriesProp, simpleData]);

  // --- Shared hooks ---
  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);
  const allSliceIds = useMemo(() => data.map((d) => d.id), [data]);
  const { hidden: hiddenSlices, toggle: toggleSlice, legendConfig, allHidden } = useChartLegend(
    data.length,
    legendProp,
    { alwaysShow: true, allIds: allSliceIds },
  );

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;

  // --- Sort + filter hidden + filter zero slices ---
  const visibleData = useMemo(() => {
    let filtered = data.filter((d) => !hiddenSlices.has(d.id));
    if (hideZeroSlices) {
      filtered = filtered.filter((d) => d.value != null && d.value !== 0);
    }
    if (sortSlices === "desc") {
      filtered = [...filtered].sort((a, b) => b.value - a.value);
    } else if (sortSlices === "asc") {
      filtered = [...filtered].sort((a, b) => a.value - b.value);
    }
    return filtered;
  }, [data, hiddenSlices, sortSlices, hideZeroSlices]);

  // --- Total for percentage display ---
  const total = useMemo(
    () => visibleData.reduce((sum, d) => sum + d.value, 0),
    [visibleData]
  );

  // --- Stable color map: remembers color assignments across data changes ---
  const stableColorMap = useRef<Map<string, string>>(new Map());
  const nextColorIdx = useRef(0);

  // Seed the map from the current full data set (grows monotonically, never forgets)
  for (const d of data) {
    const id = String(d.id);
    if (!stableColorMap.current.has(id)) {
      // Check for explicit color first
      if (d.color) {
        stableColorMap.current.set(id, d.color);
      } else {
        stableColorMap.current.set(id, seriesColors[nextColorIdx.current % seriesColors.length]);
      }
      nextColorIdx.current++;
    }
  }

  // --- Color function ---
  const colorFn = useCallback(
    (datum: Omit<ComputedDatum<DonutDatum>, "color" | "fill" | "arc">) => {
      // Per-slice override via seriesStyles
      if (seriesStyles?.[datum.id as string]?.color) {
        return seriesStyles[datum.id as string].color!;
      }
      // Per-datum color
      if (datum.data.color) {
        return datum.data.color;
      }
      // Stable color from map (survives filtering)
      return stableColorMap.current.get(String(datum.id)) ?? seriesColors[0];
    },
    [seriesColors, seriesStyles]
  );

  // --- Margin: responsive ---
  const denseScale = resolvedDense ? 0.6 : 1;
  const margin = useMemo(() => {
    if (enableArcLinkLabels) {
      const m = Math.round((containerWidth < 400 ? 40 : 60) * denseScale);
      return { top: m, right: m, bottom: m, left: m };
    }
    const m = Math.round((containerWidth < 300 ? 8 : 16) * denseScale);
    return { top: m, right: m, bottom: m, left: m };
  }, [containerWidth, enableArcLinkLabels, denseScale]);

  // --- Arc label formatter ---
  const arcLabelFn = useCallback(
    (d: ComputedDatum<DonutDatum>) => {
      if (showPercentage) {
        const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : "0";
        return `${pct}%`;
      }
      return formatValue(d.value, format, localeDefaults);
    },
    [showPercentage, total, format, localeDefaults]
  );

  // --- Arc link label formatter ---
  const arcLinkLabelFn = useCallback(
    (d: ComputedDatum<DonutDatum>) => {
      if (showPercentage) {
        const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : "0";
        return `${d.label} (${pct}%)`;
      }
      return String(d.label);
    },
    [showPercentage, total]
  );

  // --- Custom layers ---
  const layers = useMemo(() => {
    const l: PieLayer<DonutDatum>[] = ["arcs", "arcLinkLabels", "arcLabels", "legends"];
    if (centerValue || centerLabel || centerContent) {
      l.push(
        createCenterLayer(centerValue, centerLabel, centerContent) as PieLayer<DonutDatum>
      );
    }
    return l;
  }, [centerValue, centerLabel, centerContent]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      data.map((slice, i) => ({
        id: slice.id,
        label: slice.label,
        color:
          seriesStyles?.[slice.id]?.color ??
          slice.color ??
          seriesColors[i % seriesColors.length],
        value: slice.value != null ? formatValue(slice.value, format, localeDefaults) : undefined,
      })),
    [data, seriesStyles, seriesColors, format, localeDefaults]
  );

  return (
    <div ref={ref} id={id} data-testid={dataTestId} style={{ minWidth: 120, height: "100%" }}>
    <div ref={containerRef} style={{ height: "100%" }}>
      <ChartContainer componentName="DonutChart"
        aiContext={aiContext}
        title={title}
        subtitle={subtitle}
        description={description}
        footnote={footnote}
        action={action}
        height={resolvedHeight}
        variant={resolvedVariant}

        className={classNames?.root ?? className}
        classNames={classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined}
        loading={loading}
        empty={empty}
        error={error}
        stale={stale}
        exportData={data.length > 0 ? (data as unknown as DataRow[]) : (dataProp as DataRow[])}
        below={legendConfig ? (
          <ChartLegend
            items={legendItems}
            hidden={hiddenSlices}
            onToggle={toggleSlice}
            toggleable={legendConfig.toggleable !== false}
            onHover={interaction.linkedHover ? (id) => interaction.linkedHover!.setHoveredSeries(id, interaction.linkedHoverId) : undefined}
            className={classNames?.legend}
          />
        ) : undefined}
      >
        <div style={{ height: resolvedHeight }}>
        <ResponsivePie
          data={visibleData}
          theme={nivoTheme}
          colors={colorFn}
          margin={margin}
          innerRadius={innerRadius}
          padAngle={padAngle}
          cornerRadius={cornerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          sortByValue={sortSlices !== "none"}
          activeOuterRadiusOffset={activeOuterRadiusOffset}
          borderWidth={borderWidth}
          borderColor={{
            from: "color",
            modifiers: [["darker", isDark ? 0.6 : 0.2]],
          }}
          enableArcLabels={enableArcLabels}
          arcLabel={arcLabelFn}
          arcLabelsSkipAngle={arcLabelsSkipAngle}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [[isDark ? "brighter" : "darker", 1.6]],
          }}
          enableArcLinkLabels={enableArcLinkLabels}
          arcLinkLabel={arcLinkLabelFn}
          arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
          arcLinkLabelsTextColor="var(--muted)"
          arcLinkLabelsThickness={1}
          arcLinkLabelsColor={{ from: "color" }}
          arcLinkLabelsDiagonalLength={containerWidth < 400 ? 10 : 16}
          arcLinkLabelsStraightLength={containerWidth < 400 ? 12 : 20}
          tooltip={(props: PieTooltipProps<DonutDatum>) => (
            <DonutTooltipWrapper
              {...props}
              format={format}
              showPercentage={showPercentage}
              total={total}
              actionHint={interaction.actionHint}
            />
          )}
          onClick={
            (onSliceClick || interaction.isInteractive)
              ? (datum) => {
                  const pct = total > 0 ? (datum.value / total) * 100 : 0;
                  const event: SliceClickEvent = {
                    id: String(datum.id),
                    value: datum.value,
                    label: String(datum.label),
                    percentage: pct,
                  };
                  onSliceClick?.(event);
                  interaction.handleClick({ title: String(datum.label), value: datum.id, field: indexProp ?? "id", percentage: pct });
                }
              : undefined
          }
          animate={resolvedAnimate}
          motionConfig={resolvedAnimate ? config.motionConfig : undefined}
          layers={layers}
        />
        </div>

      </ChartContainer>
    </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const DonutChart = withErrorBoundary(DonutChartInner, "DonutChart");
(DonutChart as any).__gridHint = "chart";
