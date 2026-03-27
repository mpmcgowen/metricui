"use client";

import { forwardRef, useState, useCallback, useMemo, useRef } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import type {
  ScatterPlotDatum,
  ScatterPlotRawSerie,
  ScatterPlotNodeData,
  ScatterPlotLayerId,
  ScatterPlotCustomSvgLayer,
  ScatterPlotLayerProps,
} from "@nivo/scatterplot";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useChartInteraction } from "@/lib/useChartInteraction";

import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { useChartLegend } from "@/lib/useChartLegend";
import type { LegendConfig, ReferenceLine, ScatterNodeClickEvent } from "@/lib/chartTypes";
import type { CardVariant, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { categoryKeys, categoryColors, type Category } from "@/lib/dataTransform";
import { assertPeer } from "@/lib/peerCheck";

// Re-export shared types
export type { ReferenceLine, LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScatterPlotDatumInput = ScatterPlotRawSerie<ScatterPlotDatum>;

export interface ScatterPlotProps extends DataComponentProps {
  /** Nivo-native scatter series data. Mutually exclusive with index/categories flat-row mode. */
  data?: ScatterPlotDatumInput[] | DataRow[];
  /** X-axis field name (for flat-row mode) */
  index?: string;
  /** Y-axis field(s) — each category becomes a series (for flat-row mode) */
  categories?: Category[];
  /** Format for x-axis values */
  xFormat?: FormatOption;
  /** Format for y-axis values */
  yFormat?: FormatOption;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Height in px. Default: 300 */
  height?: number;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Node (dot) size in px. Default: 8 */
  nodeSize?: number;
  /** Show X-axis grid lines. Default: true */
  enableGridX?: boolean;
  /** Show Y-axis grid lines. Default: true */
  enableGridY?: boolean;
  /** Reference lines */
  referenceLines?: ReferenceLine[];
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Legend configuration. Default: shown for multi-series data */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses serieId as the field, or pass `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down content renderer. `true` for auto table, or a function for custom content. */
  drillDown?: true | ((event: ScatterNodeClickEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. */
  tooltipHint?: boolean | string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Click handler for nodes */
  onNodeClick?: (event: ScatterNodeClickEvent) => void;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Helpers — detect whether data is Nivo-native or flat rows
// ---------------------------------------------------------------------------

function isNivoData(data: unknown[]): data is ScatterPlotDatumInput[] {
  if (data.length === 0) return false;
  const first = data[0] as Record<string, unknown>;
  return "id" in first && "data" in first && Array.isArray(first.data);
}

function flatRowsToNivo(
  rows: DataRow[],
  index: string,
  categories: Category[],
): ScatterPlotDatumInput[] {
  const keys = categoryKeys(categories);
  return keys.map((key) => ({
    id: key,
    data: rows
      .filter((row) => row[index] != null && row[key] != null)
      .map((row) => ({
        x: row[index] as number,
        y: row[key] as number,
      })),
  }));
}

// ---------------------------------------------------------------------------
// Reference line layer
// ---------------------------------------------------------------------------

function createReferenceLineLayer(lines: ReferenceLine[]) {
  return function ReferenceLineLayer(
    props: ScatterPlotLayerProps<ScatterPlotDatum>,
  ) {
    const { innerWidth, innerHeight, xScale, yScale } = props;

    return (
      <g>
        {lines.map((line, i) => {
          const color = line.color ?? "var(--muted)";
          const dashArray = line.style === "solid" ? undefined : "6 4";

          if (line.axis === "y") {
            const scaleFn = yScale as unknown as (v: number) => number;
            const pos = scaleFn(line.value as number);
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={pos}
                  y2={pos}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray={dashArray}
                  opacity={0.5}
                />
                {line.label && (
                  <text
                    x={innerWidth - 4}
                    y={pos - 5}
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

          // x-axis reference line (vertical)
          const scaleFn = xScale as unknown as (v: number) => number;
          const pos = scaleFn(line.value as number);
          return (
            <g key={i}>
              <line
                x1={pos}
                x2={pos}
                y1={0}
                y2={innerHeight}
                stroke={color}
                strokeWidth={1}
                strokeDasharray={dashArray}
                opacity={0.5}
              />
              {line.label && (
                <text
                  x={pos + 4}
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

// ---------------------------------------------------------------------------
// Linked hover highlight layer
// ---------------------------------------------------------------------------

function createLinkedHoverLayer(
  hoveredIndex: string | number | null,
  sourceId: string | undefined,
  myId: string,
) {
  return function LinkedHoverScatterLayer(
    props: ScatterPlotLayerProps<ScatterPlotDatum>,
  ) {
    if (hoveredIndex == null || sourceId === myId) return null;
    const { nodes } = props;
    const matchingNodes = nodes.filter(
      (n) => String(n.serieId) === String(hoveredIndex),
    );
    if (matchingNodes.length === 0) return null;

    return (
      <g>
        {matchingNodes.map((node) => (
          <circle
            key={`lh-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.size / 2 + 4}
            fill="var(--accent)"
            opacity={0.15}
            style={{ pointerEvents: "none", transition: "opacity 150ms ease" }}
          />
        ))}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ScatterPlotInner = forwardRef<HTMLDivElement, ScatterPlotProps>(
  function ScatterPlotComponent(props, ref) {
    const {
      data: rawData = [],
      index: indexProp,
      categories: categoriesProp,
      xFormat,
      yFormat,
      title,
      subtitle,
      description,
      footnote,
      action,
      height,
      colors: chartColors,
      nodeSize = 8,
      enableGridX = true,
      enableGridY = true,
      referenceLines,
      animate: animateProp,
      legend: legendProp,
      crossFilter: crossFilterProp,
      drillDown,
      drillDownMode,
      tooltipHint,
      xAxisLabel,
      yAxisLabel,
      onNodeClick,
      dense,
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

    assertPeer(ResponsiveScatterPlot, "@nivo/scatterplot", "ScatterPlot");

    // --- Theme / config hooks ---
    const { theme } = useTheme();
    const localeDefaults = useLocale();
    const config = useMetricConfig();
    const resolvedAnimate = animateProp ?? config.animate;
    const resolvedVariant = (variant ?? config.variant) as CardVariant;
    const denseValues = useDenseValues();
    const resolvedHeight = height ?? denseValues.chartHeight;
    const interaction = useChartInteraction({
      drillDown,
      drillDownMode,
      crossFilter: crossFilterProp,
      defaultField: indexProp ?? "serieId",
      tooltipHint,
      data: rawData as DataRow[],
    });
    const hoverRef = useRef<string | number | null>(null);

    // --- Category-level color overrides ---
    const categoryColorMap = useMemo(
      () => (categoriesProp ? categoryColors(categoriesProp) : {}),
      [categoriesProp],
    );

    // --- Transform data ---
    const nivoData: ScatterPlotDatumInput[] = useMemo(() => {
      if (rawData.length === 0) return [];
      if (isNivoData(rawData)) return rawData as ScatterPlotDatumInput[];
      if (indexProp && categoriesProp) {
        return flatRowsToNivo(rawData as DataRow[], indexProp, categoriesProp);
      }
      return [];
    }, [rawData, indexProp, categoriesProp]);

    // --- Series IDs ---
    const seriesIds = useMemo(
      () => nivoData.map((s) => String(s.id)),
      [nivoData],
    );

    // --- Container size ---
    const { ref: containerRef, width: containerWidth } = useContainerSize();
    const nivoTheme = useChartTheme(containerWidth);

    // --- Legend ---
    const {
      hidden: hiddenSeries,
      toggle: toggleSeries,
      legendConfig,
    } = useChartLegend(seriesIds.length, legendProp, { allIds: seriesIds });

    // --- Visible data (filter hidden series) ---
    const visibleData = useMemo(
      () => nivoData.filter((s) => !hiddenSeries.has(String(s.id))),
      [nivoData, hiddenSeries],
    );

    // --- Colors ---
    const seriesColors = chartColors ?? config.colors;

    const colorFn = useCallback(
      (d: { serieId: string | number }) => {
        const idStr = String(d.serieId);
        if (categoryColorMap[idStr]) return categoryColorMap[idStr];
        const idx = seriesIds.indexOf(idStr);
        return seriesColors[(idx >= 0 ? idx : 0) % seriesColors.length];
      },
      [seriesIds, seriesColors, categoryColorMap],
    );

    // --- Color map for tooltip / legend ---
    const colorMap = useMemo(() => {
      const map = new Map<string, string>();
      seriesIds.forEach((id, i) => {
        map.set(
          id,
          categoryColorMap[id] ?? seriesColors[i % seriesColors.length],
        );
      });
      return map;
    }, [seriesIds, categoryColorMap, seriesColors]);

    // --- Legend items ---
    const legendItems = useMemo(
      () =>
        seriesIds.map((id, i) => ({
          id,
          label: id,
          color:
            categoryColorMap[id] ?? seriesColors[i % seriesColors.length],
        })),
      [seriesIds, categoryColorMap, seriesColors],
    );

    // --- Axis formatters ---
    const formatXAxis = useCallback(
      (value: number | string | Date) =>
        xFormat
          ? formatValue(Number(value), xFormat, localeDefaults)
          : String(value),
      [xFormat, localeDefaults],
    );

    const formatYAxis = useCallback(
      (value: number | string | Date) =>
        yFormat
          ? formatValue(Number(value), yFormat, localeDefaults)
          : String(value),
      [yFormat, localeDefaults],
    );

    // --- Margins ---
    const margin = useMemo(
      () => ({
        top: denseValues.marginTop,
        right: containerWidth < 400 ? 16 : 32,
        bottom: xAxisLabel
          ? denseValues.marginBottomWithLabel
          : denseValues.marginBottom,
        left:
          containerWidth < 300
            ? 8
            : containerWidth < 400
              ? 36
              : yAxisLabel
                ? 72
                : 60,
      }),
      [containerWidth, xAxisLabel, yAxisLabel, denseValues],
    );

    // --- Axis configs ---
    const valueAxisTicks = containerWidth < 500 ? 3 : 5;

    const axisBottom = useMemo(() => {
      if (containerWidth < 300) return null;
      return {
        tickSize: 0,
        tickPadding: containerWidth < 400 ? 6 : 12,
        tickValues: valueAxisTicks,
        format: formatXAxis,
        legend: containerWidth < 400 ? undefined : xAxisLabel,
        legendOffset: 38,
        legendPosition: "middle" as const,
      };
    }, [containerWidth, valueAxisTicks, formatXAxis, xAxisLabel]);

    const axisLeft = useMemo(() => {
      if (containerWidth < 300) return null;
      return {
        tickSize: 0,
        tickPadding: containerWidth < 400 ? 6 : 12,
        tickValues: valueAxisTicks,
        format: formatYAxis,
        legend: containerWidth < 400 ? undefined : yAxisLabel,
        legendOffset: -52,
        legendPosition: "middle" as const,
      };
    }, [containerWidth, valueAxisTicks, formatYAxis, yAxisLabel]);

    // --- Custom layers ---
    const customLayers = useMemo(() => {
      const layers: (
        | ScatterPlotLayerId
        | ScatterPlotCustomSvgLayer<ScatterPlotDatum>
      )[] = ["grid", "axes"];

      if (referenceLines && referenceLines.length > 0) {
        layers.push(
          createReferenceLineLayer(
            referenceLines,
          ) as ScatterPlotCustomSvgLayer<ScatterPlotDatum>,
        );
      }

      if (interaction.linkedHover) {
        layers.push(
          createLinkedHoverLayer(
            interaction.linkedHover.hoveredIndex,
            interaction.linkedHover.sourceId,
            interaction.linkedHoverId,
          ) as ScatterPlotCustomSvgLayer<ScatterPlotDatum>,
        );
      }

      layers.push("nodes", "markers", "mesh", "legends", "annotations");
      return layers;
    }, [
      referenceLines,
      interaction.linkedHover?.hoveredIndex,
      interaction.linkedHover?.sourceId,
      interaction.linkedHoverId,
    ]);

    // --- Click handler ---
    const handleClick = useCallback(
      (node: ScatterPlotNodeData<ScatterPlotDatum>) => {
        const event: ScatterNodeClickEvent = {
          id: node.id,
          serieId: String(node.serieId),
          x: node.xValue,
          y: node.yValue,
          label: `${node.serieId}: (${node.formattedX}, ${node.formattedY})`,
        };

        onNodeClick?.(event);
        interaction.handleClick({
          title: String(node.serieId),
          value: node.xValue instanceof Date ? node.xValue.toISOString() : node.xValue,
          field: indexProp ?? "serieId",
          serieId: String(node.serieId),
        });
      },
      [onNodeClick, interaction, indexProp],
    );

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        style={{ minWidth: 120, height: "100%" }}
        onMouseLeave={() => {
          if (interaction.linkedHover) {
            hoverRef.current = null;
            interaction.linkedHover.setHoveredIndex(null, interaction.linkedHoverId);
          }
        }}
      >
        <div ref={containerRef} style={{ height: "100%" }}>
          <ChartContainer
            componentName="ScatterPlot"
            aiContext={aiContext}
            title={title}
            subtitle={subtitle}
            description={description}
            footnote={footnote}
            action={action}
            height={resolvedHeight}
            variant={resolvedVariant}
            className={classNames?.root ?? className}
            classNames={
              classNames
                ? {
                    header: classNames.header,
                    body: classNames.body ?? classNames.chart,
                  }
                : undefined
            }
            loading={loading}
            empty={empty}
            error={error}
            stale={stale}
            exportData={rawData as DataRow[]}
            below={
              legendConfig ? (
                <ChartLegend
                  items={legendItems}
                  hidden={hiddenSeries}
                  onToggle={toggleSeries}
                  toggleable={legendConfig.toggleable !== false}
                  onHover={
                    interaction.linkedHover
                      ? (id) =>
                          interaction.linkedHover!.setHoveredSeries(id, interaction.linkedHoverId)
                      : undefined
                  }
                />
              ) : undefined
            }
          >
            <ResponsiveScatterPlot
              data={visibleData}
              theme={nivoTheme}
              colors={colorFn}
              margin={margin}
              nodeSize={nodeSize}
              enableGridX={enableGridX}
              enableGridY={enableGridY}
              axisTop={null}
              axisRight={null}
              axisBottom={axisBottom}
              axisLeft={axisLeft}
              useMesh={true}
              animate={resolvedAnimate}
              motionConfig={resolvedAnimate ? config.motionConfig : undefined}
              layers={customLayers}
              tooltip={({
                node,
              }: {
                node: ScatterPlotNodeData<ScatterPlotDatum>;
              }) => {
                // Emit to linked hover context
                if (
                  interaction.linkedHover &&
                  hoverRef.current !== node.serieId
                ) {
                  hoverRef.current = node.serieId;
                  setTimeout(
                    () =>
                      interaction.linkedHover!.setHoveredIndex(
                        node.serieId,
                        interaction.linkedHoverId,
                      ),
                    0,
                  );
                }

                const xVal = xFormat
                  ? formatValue(
                      Number(node.xValue),
                      xFormat,
                      localeDefaults,
                    )
                  : String(node.formattedX);
                const yVal = yFormat
                  ? formatValue(
                      Number(node.yValue),
                      yFormat,
                      localeDefaults,
                    )
                  : String(node.formattedY);

                return (
                  <ChartTooltip
                    header={String(node.serieId)}
                    items={[
                      {
                        color:
                          colorMap.get(String(node.serieId)) ??
                          "var(--muted)",
                        label: indexProp ?? "x",
                        value: xVal,
                      },
                      {
                        color:
                          colorMap.get(String(node.serieId)) ??
                          "var(--muted)",
                        label: "y",
                        value: yVal,
                      },
                    ]}
                    actionHint={interaction.actionHint}
                  />
                );
              }}
              onClick={
                onNodeClick || interaction.isInteractive
                  ? handleClick
                  : undefined
              }
            />
          </ChartContainer>
        </div>
      </div>
    );
  },
);

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const ScatterPlot = withErrorBoundary(ScatterPlotInner, "ScatterPlot");
(ScatterPlot as any).__gridHint = "chart";
