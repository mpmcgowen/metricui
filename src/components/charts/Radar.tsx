"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useComponentInteraction } from "@/lib/useComponentInteraction";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { assertPeer } from "@/lib/peerCheck";
import type { LegendConfig } from "@/lib/chartTypes";
import type { DrillDownEvent, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState, CardVariant } from "@/lib/types";
import { inferSchema, categoryKeys, categoryColors, type Category } from "@/lib/dataTransform";

export type { LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RadarProps extends DataComponentProps {
  /** Flat rows with an index dimension + numeric category columns. */
  data?: DataRow[];
  /** Column name for the dimension labels (spokes). */
  index?: string;
  /** Metric columns to compare on the radar. */
  categories?: Category[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for value labels and tooltips. */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Series colors. */
  colors?: string[];
  /** Enable/disable animation. Default: true */
  animate?: boolean;
  /** Fill opacity for each series area. Default: 0.25 */
  fillOpacity?: number;
  /** Border width for each series. Default: 2 */
  borderWidth?: number;
  /** Dot size at each vertex. Default: 6 */
  dotSize?: number;
  /** Number of concentric grid levels. Default: 5 */
  gridLevels?: number;
  /** Legend configuration. Default: shown for multi-series. */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses index as the field, or pass `{ field }`. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down. `true` = auto table, function = custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  /** Drill-down mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Tooltip action hint. `true` = auto, string = custom, `false` = off. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides. */
  classNames?: { root?: string; header?: string; chart?: string; body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const RadarInner = forwardRef<HTMLDivElement, RadarProps>(function Radar(props, ref) {
  const {
    data: rawData = [],
    index: indexProp,
    categories: categoriesProp,
    title,
    subtitle,
    description,
    footnote,
    action,
    format,
    height,
    colors: chartColors,
    animate: animateProp,
    fillOpacity = 0.25,
    borderWidth = 2,
    dotSize = 6,
    gridLevels = 5,
    legend: legendProp,
    crossFilter: crossFilterProp,
    drillDown,
    drillDownMode,
    tooltipHint,
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

  assertPeer(ResponsiveRadar, "@nivo/radar", "Radar");

  // --- Resolve unified data props ---
  const inferred = useMemo(
    () => inferSchema(rawData),
    [rawData],
  );
  const keys = categoriesProp ? categoryKeys(categoriesProp) : inferred?.categories ?? [];
  const indexBy = indexProp ?? inferred?.index ?? "";

  const categoryColorMap = useMemo(
    () => (categoriesProp ? categoryColors(categoriesProp) : {}),
    [categoriesProp],
  );

  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense });
  const { localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedHeight } = ctx;
  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: indexBy,
    tooltipHint,
    data: rawData as DataRow[],
  });

  const { containerRef, containerWidth, nivoTheme } = ctx;
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig, allHidden } = useChartLegend(
    keys.length,
    legendProp,
    { allIds: keys },
  );

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;
  const visibleKeys = keys.filter((k) => !hiddenKeys.has(k));

  // --- Color map for tooltips and legend ---
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    keys.forEach((key, i) => {
      map.set(key, categoryColorMap[key] ?? seriesColors[i % seriesColors.length]);
    });
    return map;
  }, [keys, categoryColorMap, seriesColors]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      keys.map((key, i) => ({
        id: key,
        label: key,
        color: categoryColorMap[key] ?? seriesColors[i % seriesColors.length],
      })),
    [keys, categoryColorMap, seriesColors],
  );

  // --- Filter data to only visible keys ---
  const chartData = useMemo(() => {
    if (visibleKeys.length === keys.length) return rawData;
    return rawData.map((row) => {
      const out: DataRow = { [indexBy]: row[indexBy] };
      for (const k of visibleKeys) {
        out[k] = row[k];
      }
      return out;
    });
  }, [rawData, visibleKeys, keys.length, indexBy]);

  // --- Format callback ---
  const formatFn = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
  );

  // --- Click handler ---
  const handleSliceClick = useCallback(
    (_data: DataRow[], sliceIndex: string) => {
      interaction.handleClick({ title: sliceIndex, value: sliceIndex, field: indexBy });
    },
    [interaction, indexBy],
  );

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      style={{ minWidth: 120, height: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%" }}>
        <ChartContainer
          componentName="Radar"
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
          below={
            legendConfig ? (
              <ChartLegend
                items={legendItems}
                hidden={hiddenKeys}
                onToggle={toggleKey}
                toggleable={legendConfig.toggleable !== false}
                onHover={interaction.linkedHover ? (id) => interaction.linkedHover!.setHoveredSeries(id, interaction.linkedHoverId) : undefined}
              />
            ) : undefined
          }
        >
          <ResponsiveRadar
            data={chartData}
            keys={visibleKeys}
            indexBy={indexBy}
            theme={nivoTheme}
            colors={visibleKeys.map((k) => colorMap.get(k) ?? seriesColors[0])}
            margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
            fillOpacity={fillOpacity}
            borderWidth={borderWidth}
            borderColor={{ from: "color" }}
            dotSize={dotSize}
            dotColor={{ theme: "background" }}
            dotBorderWidth={2}
            dotBorderColor={{ from: "color" }}
            gridLevels={gridLevels}
            gridShape="circular"
            animate={resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            valueFormat={(v: number) => formatFn(v)}
            sliceTooltip={({ index, data: sliceData }) => {
              // Emit linked hover
              if (interaction.linkedHover) {
                setTimeout(() => interaction.linkedHover!.setHoveredIndex(index, interaction.linkedHoverId), 0);
              }
              return (
                <ChartTooltip
                  header={String(index)}
                  items={sliceData.map((d) => ({
                    color: colorMap.get(String(d.id)) ?? "var(--muted)",
                    label: String(d.id),
                    value: d.formattedValue ?? formatFn(d.value),
                  }))}
                  actionHint={interaction.actionHint}
                />
              );
            }}
            onClick={(datum) => {
              if (interaction.isInteractive) {
                handleSliceClick(rawData, String(datum.index));
              }
            }}
          />
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid hint + error boundary
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Radar = withErrorBoundary(RadarInner, "Radar");
(Radar as any).__gridHint = "chart";
