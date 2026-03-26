"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveBump } from "@nivo/bump";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip, resolveActionHint } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useLinkedHover, useLinkedHoverId } from "@/lib/LinkedHoverContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useDrillDownAction } from "@/components/ui/DrillDownPanel";
import { AutoDrillTable } from "@/components/ui/AutoDrillTable";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { useChartLegend } from "@/lib/useChartLegend";
import { assertPeer } from "@/lib/peerCheck";
import type { LegendConfig } from "@/lib/chartTypes";
import type { DataRow, DataComponentProps, EmptyState, ErrorState, StaleState, CardVariant } from "@/lib/types";
import { inferSchema, categoryKeys, categoryColors, type Category } from "@/lib/dataTransform";

export type { LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BumpSeriesDatum {
  x: string | number;
  y: number | null;
}

export interface BumpSeries {
  id: string;
  data: BumpSeriesDatum[];
}

export interface BumpProps extends DataComponentProps {
  /**
   * Data in one of two formats:
   * - BumpSeries[]: Nivo-native `{ id, data: [{ x, y }] }` format
   * - DataRow[]: flat rows with index (x-axis) + categories (values → ranks)
   */
  data?: BumpSeries[] | DataRow[];
  /** Column for x-axis labels (flat format). */
  index?: string;
  /** Category columns — each becomes a ranked series (flat format). */
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
  /** Line width. Default: 3 */
  lineWidth?: number;
  /** Point size at each position. Default: 8 */
  pointSize?: number;
  /** Point border width. Default: 2 */
  pointBorderWidth?: number;
  /** Legend configuration. Default: shown for multi-series. */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses series id as field, or pass `{ field }`. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down. `true` = auto table, function = custom content. */
  drillDown?: true | ((event: { id: string; x: string | number; y: number }) => React.ReactNode);
  /** Drill-down mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Tooltip action hint. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides. */
  classNames?: { root?: string; header?: string; chart?: string; body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isBumpSeries(data: unknown): data is BumpSeries[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  return typeof first === "object" && first !== null && "id" in first && "data" in first && Array.isArray((first as BumpSeries).data);
}

/**
 * Convert flat DataRow[] to BumpSeries[] by ranking each row's category values.
 * For each x-position (index), ranks are assigned based on descending value.
 */
function rowsToBumpSeries(
  rows: DataRow[],
  indexBy: string,
  keys: string[],
): BumpSeries[] {
  // For each row, rank the categories by value (descending → rank 1 = highest)
  const seriesMap = new Map<string, BumpSeriesDatum[]>();
  for (const key of keys) {
    seriesMap.set(key, []);
  }

  for (const row of rows) {
    const x = row[indexBy];
    // Collect values and rank
    const entries = keys.map((k) => ({ key: k, value: Number(row[k]) || 0 }));
    entries.sort((a, b) => b.value - a.value);
    const ranks = new Map<string, number>();
    entries.forEach((e, i) => ranks.set(e.key, i + 1));

    for (const key of keys) {
      seriesMap.get(key)!.push({ x, y: ranks.get(key) ?? null });
    }
  }

  return keys.map((key) => ({
    id: key,
    data: seriesMap.get(key)!,
  }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BumpInner = forwardRef<HTMLDivElement, BumpProps>(function Bump(props, ref) {
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
    lineWidth = 3,
    pointSize = 8,
    pointBorderWidth = 2,
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

  assertPeer(ResponsiveBump, "@nivo/bump", "Bump");
  const openDrill = useDrillDownAction();

  // --- Resolve data format ---
  const inferred = useMemo(
    () => (!isBumpSeries(rawData) && Array.isArray(rawData) ? inferSchema(rawData as DataRow[]) : null),
    [rawData],
  );
  const keys = categoriesProp ? categoryKeys(categoriesProp) : inferred?.categories ?? [];
  const indexBy = indexProp ?? inferred?.index ?? "";

  const categoryColorMap = useMemo(
    () => (categoriesProp ? categoryColors(categoriesProp) : {}),
    [categoriesProp],
  );

  const { theme } = useTheme();
  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedHeight = height ?? denseValues.chartHeight;
  const linkedHover = useLinkedHover();
  const linkedHoverId = useLinkedHoverId();
  const crossFilter = useCrossFilter();
  const crossFilterField = crossFilterProp
    ? (typeof crossFilterProp === "object" ? crossFilterProp.field : undefined) ?? "id"
    : undefined;

  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Resolve data ---
  const bumpData = useMemo<BumpSeries[]>(() => {
    if (isBumpSeries(rawData)) return rawData as BumpSeries[];
    if (Array.isArray(rawData) && rawData.length > 0 && keys.length > 0 && indexBy) {
      return rowsToBumpSeries(rawData as DataRow[], indexBy, keys);
    }
    return [];
  }, [rawData, keys, indexBy]);

  // --- Legend + visibility ---
  const seriesIds = useMemo(() => bumpData.map((s) => s.id), [bumpData]);
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig } = useChartLegend(
    seriesIds.length,
    legendProp,
    { allIds: seriesIds },
  );

  const seriesColors = chartColors ?? config.colors;

  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    seriesIds.forEach((sid, i) => {
      map.set(sid, categoryColorMap[sid] ?? seriesColors[i % seriesColors.length]);
    });
    return map;
  }, [seriesIds, categoryColorMap, seriesColors]);

  const visibleData = useMemo(
    () => bumpData.filter((s) => !hiddenKeys.has(s.id)),
    [bumpData, hiddenKeys],
  );

  const legendItems = useMemo(
    () =>
      seriesIds.map((sid, i) => ({
        id: sid,
        label: sid,
        color: categoryColorMap[sid] ?? seriesColors[i % seriesColors.length],
      })),
    [seriesIds, categoryColorMap, seriesColors],
  );

  // --- Export data (flat) ---
  const exportData = useMemo<DataRow[]>(() => {
    if (isBumpSeries(rawData)) {
      // Flatten back to rows
      const rows: DataRow[] = [];
      for (const series of rawData as BumpSeries[]) {
        for (const d of series.data) {
          rows.push({ series: series.id, x: d.x, rank: d.y });
        }
      }
      return rows;
    }
    return rawData as DataRow[];
  }, [rawData]);

  // --- Format callback ---
  const formatFn = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
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
          componentName="Bump"
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
          exportData={exportData}
          below={
            legendConfig ? (
              <ChartLegend
                items={legendItems}
                hidden={hiddenKeys}
                onToggle={toggleKey}
                toggleable={legendConfig.toggleable !== false}
                onHover={linkedHover ? (id) => linkedHover.setHoveredSeries(id, linkedHoverId) : undefined}
              />
            ) : undefined
          }
        >
          <ResponsiveBump
            data={visibleData}
            theme={nivoTheme}
            colors={(serie: { id: string }) => colorMap.get(serie.id) ?? seriesColors[0]}
            margin={{
              top: denseValues.marginTop,
              right: containerWidth < 400 ? 60 : 90,
              bottom: denseValues.marginBottom,
              left: containerWidth < 400 ? 32 : 48,
            }}
            lineWidth={lineWidth}
            activeLineWidth={lineWidth + 3}
            inactiveLineWidth={1}
            inactiveOpacity={0.25}
            pointSize={pointSize}
            activePointSize={pointSize + 4}
            pointBorderWidth={pointBorderWidth}
            activePointBorderWidth={pointBorderWidth + 1}
            pointColor={{ theme: "background" }}
            pointBorderColor={{ from: "serie.color" }}
            startLabel
            startLabelPadding={12}
            endLabel
            endLabelPadding={12}
            startLabelTextColor={{ from: "color" }}
            endLabelTextColor={{ from: "color" }}
            axisTop={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}
            animate={resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            lineTooltip={({ serie }: { serie: any }) => {
              // Emit linked hover
              if (linkedHover) {
                setTimeout(() => linkedHover.setHoveredSeries(serie.id, linkedHoverId), 0);
              }
              const datums: BumpSeriesDatum[] = serie.data?.data ?? serie.points?.map((p: any) => p.data) ?? [];
              return (
                <ChartTooltip
                  header={String(serie.id)}
                  items={datums
                    .filter((d) => d.y != null)
                    .map((d) => ({
                      color: colorMap.get(serie.id) ?? "var(--muted)",
                      label: String(d.x),
                      value: `#${d.y}`,
                    }))}
                  actionHint={resolveActionHint(tooltipHint, config.tooltipHint, !!drillDown, !!crossFilterProp)}
                />
              );
            }}
            onClick={(serie: any) => {
              if (drillDown) {
                const datums: BumpSeriesDatum[] = serie.data?.data ?? [];
                const first = datums[0];
                const event = { id: serie.id, x: first?.x ?? "", y: first?.y ?? 0 };
                const content =
                  drillDown === true ? (
                    <AutoDrillTable data={exportData} field="series" value={serie.id} />
                  ) : (
                    drillDown(event)
                  );
                openDrill(
                  { title: serie.id, field: crossFilterField ?? "id", value: serie.id, mode: drillDownMode },
                  content,
                );
              } else if (crossFilterProp && crossFilter && crossFilterField) {
                crossFilter.select({ field: crossFilterField, value: serie.id });
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
export const Bump = withErrorBoundary(BumpInner, "Bump");
(Bump as any).__gridHint = "chart";
