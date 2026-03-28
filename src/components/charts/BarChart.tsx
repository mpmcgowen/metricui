"use client";

import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
  useChartDimensions,
  useBandScale,
  useLinearScale,
  useStackedData,
  useElementInteraction,
  useTooltip,
  ChartSvg,
  Axis,
  GridLines,
  Bars,
  ReferenceLine as CoreReferenceLine,
  ThresholdBand as CoreThresholdBand,
  HighlightBand,
  TooltipPortal,
} from "@metricui/core";

import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { calculateResponsiveTicks } from "@/lib/calculateResponsiveTicks";
import { devWarn } from "@/lib/devWarnings";
import type { LegendConfig, ReferenceLine, ThresholdBand, BarClickEvent } from "@/lib/chartTypes";
import type { DrillDownEvent, CardVariant, ChartNullMode, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { inferSchema, categoryKeys, categoryColors, type Category } from "@/lib/dataTransform";

// Re-export shared types so downstream code doesn't break
export type { ReferenceLine, ThresholdBand, LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BarSeriesStyle {
  color?: string;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export type BarChartPreset = "default" | "grouped" | "stacked" | "percent" | "horizontal" | "horizontal-grouped";

const BAR_PRESETS: Record<BarChartPreset, Partial<BarChartProps>> = {
  default: {},
  grouped: { groupMode: "grouped" },
  stacked: { groupMode: "stacked" },
  percent: { groupMode: "percent" },
  horizontal: { layout: "horizontal" },
  "horizontal-grouped": { layout: "horizontal", groupMode: "grouped" },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BarChartProps extends DataComponentProps {
  preset?: BarChartPreset;
  data?: DataRow[];
  index?: string;
  categories?: Category[];
  comparisonData?: Record<string, string | number>[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  format?: FormatOption;
  height?: number;
  layout?: "vertical" | "horizontal";
  groupMode?: "stacked" | "grouped" | "percent";
  padding?: number;
  innerPadding?: number;
  borderRadius?: number;
  enableLabels?: boolean;
  labelPosition?: "inside" | "outside" | "auto";
  sort?: "none" | "asc" | "desc";
  enableNegative?: boolean;
  negativeColor?: string;
  targetData?: Record<string, number>[];
  targetColor?: string;
  seriesStyles?: Record<string, BarSeriesStyle>;
  colors?: string[];
  referenceLines?: ReferenceLine[];
  thresholds?: ThresholdBand[];
  legend?: boolean | LegendConfig;
  xAxisLabel?: string;
  yAxisLabel?: string;
  onBarClick?: (bar: BarClickEvent) => void;
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  drillDownMode?: "slide-over" | "modal";
  crossFilter?: boolean | { field?: string };
  tooltipHint?: boolean | string;
  chartNullMode?: ChartNullMode;
  animate?: boolean;
  classNames?: { root?: string; header?: string; chart?: string; body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Component — powered by @metricui/core
// ---------------------------------------------------------------------------

const BarChartInner = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(rawProps, ref) {
  const presetDefaults = rawProps.preset ? BAR_PRESETS[rawProps.preset] : {};
  const props = { ...presetDefaults, ...rawProps };

  const {
    data: rawData = [],
    index: indexProp,
    categories: categoriesProp,
    comparisonData,
    title,
    subtitle,
    description,
    footnote,
    action,
    format,
    height,
    layout = "vertical",
    groupMode: groupModeProp,
    padding = 0.3,
    innerPadding: innerPaddingProp,
    borderRadius = 4,
    enableLabels = false,
    sort = "none",
    enableNegative = false,
    negativeColor = "#EF4444",
    targetData,
    targetColor: targetColorProp,
    seriesStyles,
    colors: chartColors,
    referenceLines,
    thresholds,
    legend: legendProp,
    xAxisLabel,
    yAxisLabel,
    onBarClick,
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    tooltipHint,
    dense,
    chartNullMode,
    animate: animateProp,
    variant,
    className,
    loading,
    empty,
    error,
    stale,
    classNames,
    id,
    "data-testid": dataTestId,
    aiContext,
  } = props;

  // --- Resolve data schema ---
  const inferred = useMemo(
    () => (!categoriesProp && !indexProp ? inferSchema(rawData) : null),
    [rawData, categoriesProp, indexProp]
  );
  const keys = categoriesProp ? categoryKeys(categoriesProp) : inferred?.categories ?? [];
  const indexBy = indexProp ?? inferred?.index ?? "";

  if (rawData.length > 0 && (keys.length === 0 || !indexBy)) {
    devWarn("BarChart.data", "BarChart received data but could not determine categories or index. Pass `index` and `categories` props.");
  }

  const categoryColorMap = useMemo(
    () => categoriesProp ? categoryColors(categoriesProp) : {},
    [categoriesProp]
  );

  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense });
  const { isDark, localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedHeight } = ctx;
  const resolvedChartNullMode = chartNullMode ?? config.chartNullMode;
  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: indexBy,
    tooltipHint,
    data: rawData as DataRow[],
  });
  const barHoverRef = useRef<string | number | null>(null);

  // --- Resolve groupMode ---
  const groupMode = groupModeProp ?? "stacked";
  const isPercent = groupMode === "percent";
  const isGrouped = groupMode === "grouped";
  const isStacked = !isGrouped;

  // --- Shared hooks ---
  const { containerRef, containerWidth, nivoTheme } = ctx;
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig, allHidden } = useChartLegend(
    keys.length,
    legendProp,
    { allIds: keys },
  );

  const visibleKeys = keys.filter((k) => !hiddenKeys.has(k));
  const seriesColors = chartColors ?? config.colors;
  const targetColor = targetColorProp ?? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)");
  const comparisonColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  const isHorizontal = layout === "horizontal";

  // --- Sort data ---
  const data = useMemo(() => {
    if (sort === "none") return rawData;
    const sorted = [...rawData].sort((a, b) => {
      const totalA = visibleKeys.reduce((sum, k) => sum + (Number(a[k]) || 0), 0);
      const totalB = visibleKeys.reduce((sum, k) => sum + (Number(b[k]) || 0), 0);
      return sort === "asc" ? totalA - totalB : totalB - totalA;
    });
    return sorted;
  }, [rawData, sort, visibleKeys]);

  // --- Normalize for percent mode ---
  const chartData = useMemo(() => {
    if (!isPercent) return data;
    return data.map((row) => {
      const total = visibleKeys.reduce((sum, k) => sum + Math.abs(Number(row[k]) || 0), 0);
      if (total === 0) return row;
      const normalized: Record<string, string | number> = { [indexBy]: row[indexBy] };
      for (const k of visibleKeys) {
        normalized[k] = ((Number(row[k]) || 0) / total) * 100;
      }
      return normalized;
    });
  }, [data, isPercent, visibleKeys, indexBy]);

  // --- Apply chartNullMode ---
  const processedData = useMemo(() => {
    if (resolvedChartNullMode !== "zero") return chartData;
    return chartData.map((row) => {
      const out: Record<string, string | number> = { [indexBy]: row[indexBy] };
      for (const k of visibleKeys) {
        const v = row[k];
        out[k] = v == null ? 0 : v;
      }
      return out;
    });
  }, [chartData, resolvedChartNullMode, visibleKeys, indexBy]);

  // --- Value axis formatter ---
  const formatValueAxis = useCallback(
    (value: unknown) => {
      const v = value as number;
      if (isPercent) return `${Math.round(v)}%`;
      return formatValue(v, format, localeDefaults);
    },
    [format, localeDefaults, isPercent]
  );

  // --- Responsive margins ---
  const horizontalLeftMargin = useMemo(() => {
    if (!isHorizontal) return 90;
    const labels = data.map((d) => String(d[indexBy]));
    const maxLen = labels.reduce((max, l) => Math.max(max, l.length), 0);
    const estimated = maxLen * 7 + 16;
    return Math.min(Math.max(estimated, 60), 180);
  }, [isHorizontal, data, indexBy]);

  const margin = useMemo(() => {
    if (isHorizontal) {
      return {
        top: denseValues.marginTop,
        right: containerWidth < 400 ? 16 : 32,
        bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
        left: containerWidth < 300 ? 60 : containerWidth < 400 ? 80 : yAxisLabel ? Math.max(horizontalLeftMargin, 110) : horizontalLeftMargin,
      };
    }
    return {
      top: denseValues.marginTop,
      right: containerWidth < 400 ? 8 : 16,
      bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
      left: containerWidth < 300 ? 8 : containerWidth < 400 ? 36 : yAxisLabel ? 72 : 60,
    };
  }, [containerWidth, xAxisLabel, yAxisLabel, isHorizontal, horizontalLeftMargin, denseValues]);

  // --- Chart dimensions ---
  const dims = useChartDimensions({
    width: containerWidth,
    height: resolvedHeight,
    margin,
  });

  // --- Scales ---
  const categoryDomain = processedData.map((d) => String(d[indexBy]));

  const categoryScale = useBandScale({
    domain: categoryDomain,
    range: isHorizontal ? [0, dims.innerHeight] : [0, dims.innerWidth],
    paddingInner: padding,
    paddingOuter: 0.1,
  });

  // Compute value domain from visible data
  const valueDomain = useMemo((): [number, number] => {
    let min = 0;
    let max = 0;
    for (const row of processedData) {
      if (isStacked) {
        let stackPos = 0;
        let stackNeg = 0;
        for (const k of visibleKeys) {
          const v = Number(row[k]) || 0;
          if (v >= 0) stackPos += v;
          else stackNeg += v;
        }
        if (stackPos > max) max = stackPos;
        if (stackNeg < min) min = stackNeg;
      } else {
        for (const k of visibleKeys) {
          const v = Number(row[k]) || 0;
          if (v > max) max = v;
          if (v < min) min = v;
        }
      }
    }
    // Include target/comparison data in domain
    if (targetData) {
      for (const row of targetData) {
        for (const k of visibleKeys) {
          const v = Number(row[k]) || 0;
          if (v > max) max = v;
          if (v < min) min = v;
        }
      }
    }
    return [min, max];
  }, [processedData, visibleKeys, isStacked, targetData]);

  const valueScale = useLinearScale({
    domain: valueDomain,
    range: isHorizontal ? [0, dims.innerWidth] : [dims.innerHeight, 0],
    nice: true,
    includeZero: true,
  });

  const groupScale = isGrouped
    ? useBandScale({
        domain: visibleKeys,
        range: [0, categoryScale.bandwidth()],
        paddingInner: 0.05,
      })
    : undefined;

  // --- Stacked data ---
  const { series: stackedSeries } = useStackedData({
    data: processedData as Record<string, any>[],
    keys: visibleKeys,
  });

  // --- Interaction ---
  const { hoveredDatum, hoveredIndex, onHover, onHoverEnd } =
    useElementInteraction<any>();
  const tooltip = useTooltip<any>();

  // --- Smart tick thinning ---
  const xTickValues = useMemo(() => {
    if (isHorizontal) return undefined;
    if (!data.length) return undefined;
    const labels = data.map((d) => String(d[indexBy]));
    return calculateResponsiveTicks(labels, containerWidth);
  }, [data, containerWidth, indexBy, isHorizontal]);

  // --- Color resolver ---
  const getColor = useCallback(
    (key: string, value?: number) => {
      if (seriesStyles?.[key]?.color) return seriesStyles[key].color!;
      if (categoryColorMap[key]) return categoryColorMap[key];
      if (enableNegative && value !== undefined && value < 0) return negativeColor;
      const keyIndex = keys.indexOf(key);
      return seriesColors[(keyIndex >= 0 ? keyIndex : 0) % seriesColors.length];
    },
    [keys, seriesColors, seriesStyles, categoryColorMap, enableNegative, negativeColor]
  );

  // --- Color map for tooltip ---
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    keys.forEach((key, i) => {
      map.set(key, seriesStyles?.[key]?.color ?? categoryColorMap[key] ?? seriesColors[i % seriesColors.length]);
    });
    return map;
  }, [keys, seriesStyles, categoryColorMap, seriesColors]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      keys.map((key, i) => {
        const total = data.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
        return {
          id: key,
          label: key,
          color: seriesStyles?.[key]?.color ?? categoryColorMap[key] ?? seriesColors[i % seriesColors.length],
          value: total ? formatValue(total, format, localeDefaults) : undefined,
        };
      }),
    [keys, seriesStyles, categoryColorMap, seriesColors, data, format, localeDefaults]
  );

  // --- Axis tick config ---
  const valueAxisTicks = containerWidth < 500 ? 3 : 5;

  // --- Nivo theme props for axis styling ---
  const axisTextStyle = useMemo(() => ({
    fontSize: containerWidth < 400 ? 9 : 10,
    fill: "var(--muted)",
    fontFamily: "var(--font-mono)",
  }), [containerWidth]);

  // --- Build the chart ---
  const renderChart = () => {
    if (containerWidth <= 0 || dims.innerWidth <= 0 || dims.innerHeight <= 0) return null;

    const categoryAxisPosition = isHorizontal ? "left" as const : "bottom" as const;
    const valueAxisPosition = isHorizontal ? "bottom" as const : "left" as const;

    // Handle tooltip show with linked hover emit
    const handleBarHover = (e: any, indexValue: string) => {
      onHover(e);
      tooltip.show({ datum: { indexValue, ...e.datum }, clientX: e.clientX, clientY: e.clientY });
      if (interaction.linkedHover && barHoverRef.current !== indexValue) {
        barHoverRef.current = indexValue;
        interaction.linkedHover.setHoveredIndex(indexValue, interaction.linkedHoverId);
      }
    };

    const handleBarHoverEnd = () => {
      onHoverEnd();
      tooltip.hide();
    };

    const handleBarClick = (datum: any, indexValue: string, key: string) => {
      const event: BarClickEvent = {
        id: key,
        value: datum.value ?? datum.upper - datum.lower,
        label: indexValue,
        key,
        indexValue,
      };
      onBarClick?.(event);
      interaction.handleClick({ title: indexValue, value: indexValue, key, indexValue });
    };

    return (
      <>
        <ChartSvg
          width={containerWidth}
          height={resolvedHeight}
          margin={margin}
          aria-label={title ?? "Bar chart"}
        >
          {/* Grid lines */}
          <GridLines
            xScale={isHorizontal ? valueScale : undefined}
            yScale={isHorizontal ? undefined : valueScale}
            width={dims.innerWidth}
            height={dims.innerHeight}
            lineProps={{ stroke: "var(--card-border)", strokeWidth: 1 }}
          />

          {/* Threshold bands */}
          {thresholds?.map((t, i) => (
            <CoreThresholdBand
              key={`thresh-${i}`}
              scale={valueScale}
              from={t.from}
              to={t.to}
              orientation={isHorizontal ? "vertical" : "horizontal"}
              length={isHorizontal ? dims.innerHeight : dims.innerWidth}
              label={t.label}
              rectProps={{
                fill: t.color ?? "var(--accent)",
                opacity: t.opacity ?? 0.08,
              }}
              labelProps={{ fontSize: 9, fontWeight: 600, fill: t.color ?? "var(--accent)", opacity: 0.6 }}
            />
          ))}

          {/* Reference lines */}
          {referenceLines?.map((rl, i) => (
            <CoreReferenceLine
              key={`ref-${i}`}
              scale={valueScale}
              value={rl.value}
              orientation={isHorizontal ? "vertical" : "horizontal"}
              length={isHorizontal ? dims.innerHeight : dims.innerWidth}
              label={rl.label}
              lineProps={{
                stroke: rl.color ?? "var(--accent)",
                strokeDasharray: "6 3",
                strokeWidth: 1,
              }}
              labelProps={{ fontSize: 9, fill: rl.color ?? "var(--accent)" }}
            />
          ))}

          {/* Target bars (ghost behind actuals) */}
          {targetData && targetData.length > 0 && visibleKeys.map((key) => {
            const targetBarData = targetData
              .filter((row) => row[key] !== undefined)
              .map((row, i) => ({
                index: String(row[indexBy]),
                value: row[key],
                key,
              }));
            if (targetBarData.length === 0) return null;
            return (
              <Bars
                key={`target-${key}`}
                data={targetBarData}
                xScale={categoryScale}
                yScale={valueScale}
                x="index"
                y="value"
                orientation={layout}
                rx={borderRadius}
                style={() => ({ fill: targetColor, opacity: 1 })}
              />
            );
          })}

          {/* Comparison bars (dashed outline) */}
          {comparisonData && comparisonData.length > 0 && visibleKeys.map((key) => {
            const compBarData = comparisonData
              .filter((row) => row[key] !== undefined)
              .map((row) => ({
                index: String(row[indexBy]),
                value: Number(row[key]) || 0,
                key,
              }));
            if (compBarData.length === 0) return null;
            return (
              <Bars
                key={`comp-${key}`}
                data={compBarData}
                xScale={categoryScale}
                yScale={valueScale}
                x="index"
                y="value"
                orientation={layout}
                rx={borderRadius}
                style={() => ({
                  fill: "none",
                  stroke: comparisonColor,
                  strokeWidth: 1.5,
                  strokeDasharray: "4 3",
                  opacity: 0.5,
                })}
              />
            );
          })}

          {/* Linked hover highlight band */}
          {interaction.linkedHover &&
            interaction.linkedHover.hoveredIndex != null &&
            interaction.linkedHover.sourceId !== interaction.linkedHoverId && (
              <HighlightBand
                scale={categoryScale}
                value={String(interaction.linkedHover.hoveredIndex)}
                length={isHorizontal ? dims.innerWidth : dims.innerHeight}
                orientation={isHorizontal ? "horizontal" : "vertical"}
                padding={4}
                visible
                rectProps={{ fill: "var(--accent)", opacity: 0.06, rx: 4 }}
              />
            )}

          {/* Actual data bars */}
          {isGrouped ? (
            // Grouped: flatten data, use groupScale
            visibleKeys.map((key) => {
              const flatData = processedData.map((row) => ({
                index: String(row[indexBy]),
                key,
                value: Number(row[key]) || 0,
              }));
              return (
                <Bars
                  key={`bar-${key}`}
                  data={flatData}
                  xScale={categoryScale}
                  yScale={valueScale}
                  x="index"
                  y="value"
                  groupScale={groupScale}
                  groupKey="key"
                  orientation={layout}
                  rx={borderRadius}
                  style={(d: any, i: number) => {
                    const dimmed = hoveredIndex !== null && hoveredIndex !== i;
                    return {
                      fill: getColor(key, d.value),
                      opacity: dimmed ? 0.3 : 1,
                      cursor: (onBarClick || interaction.isInteractive) ? "pointer" : undefined,
                      transition: "opacity 150ms ease",
                    };
                  }}
                  onHover={(e: any) => handleBarHover(e, e.datum.index)}
                  onHoverEnd={handleBarHoverEnd}
                  onClick={
                    (onBarClick || interaction.isInteractive)
                      ? (e: any) => handleBarClick(e.datum, e.datum.index, key)
                      : undefined
                  }
                />
              );
            })
          ) : (
            // Stacked: use stackedSeries with y0/y
            stackedSeries
              .filter((s) => visibleKeys.includes(s.key))
              .map((s, si) => (
                <Bars
                  key={`bar-${s.key}`}
                  data={s.data as any[]}
                  xScale={categoryScale}
                  yScale={valueScale}
                  x={(d: any) => String(d.datum[indexBy])}
                  y={(d: any) => d.upper}
                  y0={(d: any) => d.lower}
                  orientation={layout}
                  rx={si === stackedSeries.length - 1 ? borderRadius : 0}
                  style={(d: any, i: number) => {
                    const dimmed = hoveredIndex !== null && hoveredIndex !== i;
                    return {
                      fill: getColor(s.key, d.upper - d.lower),
                      opacity: dimmed ? 0.3 : 1,
                      cursor: (onBarClick || interaction.isInteractive) ? "pointer" : undefined,
                      transition: "opacity 150ms ease",
                    };
                  }}
                  onHover={(e: any) => handleBarHover(e, String((e.datum as any).datum[indexBy]))}
                  onHoverEnd={handleBarHoverEnd}
                  onClick={
                    (onBarClick || interaction.isInteractive)
                      ? (e: any) => handleBarClick(e.datum, String(e.datum.datum[indexBy]), s.key)
                      : undefined
                  }
                />
              ))
          )}

          {/* Category axis */}
          <Axis
            scale={categoryScale}
            position={categoryAxisPosition}
            offset={categoryAxisPosition === "bottom" ? dims.innerHeight : 0}
            tickValues={xTickValues}
            tickSize={0}
            tickPadding={12}
            tickLabelProps={() => ({
              ...axisTextStyle,
              textAnchor: categoryAxisPosition === "left" ? ("end" as const) : ("middle" as const),
            })}
            lineProps={{ stroke: "var(--card-border)" }}
            tickLineProps={{ stroke: "var(--card-border)" }}
            title={isHorizontal ? yAxisLabel : xAxisLabel}
            titleProps={axisTextStyle}
          />

          {/* Value axis */}
          {containerWidth >= 300 && (
            <Axis
              scale={valueScale}
              position={valueAxisPosition}
              offset={valueAxisPosition === "bottom" ? dims.innerHeight : 0}
              tickCount={valueAxisTicks}
              tickSize={0}
              tickPadding={containerWidth < 400 ? 6 : 12}
              tickFormat={formatValueAxis}
              tickLabelProps={() => ({
                ...axisTextStyle,
                textAnchor: valueAxisPosition === "left" ? ("end" as const) : ("middle" as const),
              })}
              lineProps={{ stroke: "var(--card-border)" }}
              tickLineProps={{ stroke: "var(--card-border)" }}
              title={isHorizontal ? xAxisLabel : yAxisLabel}
              titleProps={axisTextStyle}
            />
          )}
        </ChartSvg>

        {/* Tooltip */}
        <TooltipPortal
          isVisible={tooltip.isVisible}
          clientX={tooltip.position?.clientX ?? 0}
          clientY={tooltip.position?.clientY ?? 0}
          clampToViewport
          anchor="top-center"
          offset={{ y: -12 }}
        >
          {tooltip.datum && (
            <ChartTooltip
              header={String(tooltip.datum.indexValue ?? tooltip.datum.index ?? "")}
              items={visibleKeys.map((key) => {
                const row = chartData.find((d) => String(d[indexBy]) === String(tooltip.datum.indexValue ?? tooltip.datum.index));
                const tooltipFormat = isPercent ? ("percent" as FormatOption) : format;
                return {
                  color: colorMap.get(key) ?? "var(--muted)",
                  label: key,
                  value: row && row[key] != null
                    ? formatValue(Number(row[key]), tooltipFormat, localeDefaults)
                    : "\u2014",
                };
              })}
              actionHint={interaction.actionHint}
            />
          )}
        </TooltipPortal>
      </>
    );
  };

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      style={{ minWidth: 120, height: "100%" }}
      onMouseLeave={() => {
        if (interaction.linkedHover) {
          barHoverRef.current = null;
          interaction.linkedHover.setHoveredIndex(null, interaction.linkedHoverId);
        }
      }}
    >
      <div ref={containerRef} style={{ height: "100%" }}>
        <ChartContainer
          componentName="BarChart"
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
          exportData={rawData as DataRow[]}
          below={legendConfig ? (
            <ChartLegend
              items={legendItems}
              hidden={hiddenKeys}
              onToggle={toggleKey}
              toggleable={legendConfig.toggleable !== false}
              onHover={interaction.linkedHover ? (id) => interaction.linkedHover!.setHoveredSeries(id, interaction.linkedHoverId) : undefined}
            />
          ) : undefined}
        >
          {renderChart()}
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const BarChart = withErrorBoundary(BarChartInner, "BarChart");
(BarChart as any).__gridHint = "chart";
