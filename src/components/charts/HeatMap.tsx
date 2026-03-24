"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import type { HeatMapDatum, ComputedCell, CustomLayerProps as HeatMapCustomLayerProps } from "@nivo/heatmap";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import type { CardVariant, EmptyState, ErrorState, StaleState } from "@/lib/types";
import type { CellClickEvent } from "@/lib/chartTypes";
import { toHeatMapSeries, inferSchema, categoryKeys, type Category } from "@/lib/dataTransform";
import { useLinkedHover, useLinkedHoverId } from "@/lib/LinkedHoverContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useDrillDownAction } from "@/components/ui/DrillDownPanel";

import { assertPeer } from "@/lib/peerCheck";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HeatMapSeries = {
  id: string;
  data: { x: string; y: number | null }[];
};

export type HeatMapColorScale = "sequential" | "diverging";

export interface HeatMapProps {
  data?: HeatMapSeries[] | Record<string, unknown>[];
  /** Column name to use as row labels. */
  index?: string;
  /** Column names to use as cell values (become the X-axis). */
  categories?: Category[];
  /** Simple data format — 2D object like { Mon: { "9am": 12, "10am": 45 }, ... }.
   *  Converted to series internally. `data` takes precedence. */
  simpleData?: Record<string, Record<string, number | null>>;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for cell values and tooltips */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Color scale type. Default: "sequential" */
  colorScale?: HeatMapColorScale;
  /** Custom color stops. Overrides colorScale. */
  colors?: string[];
  /** Color for cells with null/missing values */
  emptyColor?: string;
  /** Cell corner radius in px. Default: 4 */
  borderRadius?: number;
  /** Show formatted values inside cells. Default: false */
  enableLabels?: boolean;
  /** Skip labels on cells smaller than this (px). Default: 12 */
  labelSkipWidth?: number;
  /** Skip labels on cells shorter than this (px). Default: 12 */
  labelSkipHeight?: number;
  /** Force cells to be square. Default: false */
  forceSquare?: boolean;
  /** Inner padding between cells (ratio 0-1). Default: 0.05 */
  cellPadding?: number;
  /** Highlight behavior on hover. Default: "cell" */
  hoverTarget?: "cell" | "row" | "column" | "rowColumn";
  /** Opacity applied to non-hovered cells. Default: 0.35 */
  hoverOtherOpacity?: number;
  /** Click handler for cells */
  onCellClick?: (cell: CellClickEvent) => void;
  /** Drill-down content renderer. When set, clicking a cell opens the drill-down panel. Takes priority over crossFilter for the click action. */
  drillDown?: (event: CellClickEvent) => React.ReactNode;
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Enable cross-filter selection. Pass `true` to use "x" as the field, or `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Variant */
  variant?: CardVariant;
  /** Additional class names */
  className?: string;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string };
  /** HTML id */
  id?: string;
  /** Test id */
  "data-testid"?: string;
  /** Dense mode */
  dense?: boolean;
  /** Data states */
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
}

// ---------------------------------------------------------------------------
// Color scale presets
// ---------------------------------------------------------------------------

const SEQUENTIAL_COLORS = {
  light: {
    type: "sequential" as const,
    scheme: "blues" as const,
  },
  dark: {
    type: "sequential" as const,
    scheme: "blues" as const,
  },
};

const DIVERGING_COLORS = {
  light: {
    type: "diverging" as const,
    scheme: "red_yellow_green" as const,
    divergeAt: 0.5,
  },
  dark: {
    type: "diverging" as const,
    scheme: "red_yellow_green" as const,
    divergeAt: 0.5,
  },
};

// ---------------------------------------------------------------------------
// Tooltip (uses shared ChartTooltip)
// ---------------------------------------------------------------------------

function HeatMapTooltipWrapper({
  cell,
  format,
}: {
  cell: ComputedCell<HeatMapDatum>;
  format?: FormatOption;
}) {
  const localeDefaults = useLocale();
  const formatted = cell.value !== null
    ? formatValue(cell.value, format, localeDefaults)
    : "\u2014";

  return (
    <ChartTooltip
      header={String(cell.serieId)}
      items={[
        {
          color: cell.color,
          label: String(cell.data.x),
          value: formatted,
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HeatMapInner = forwardRef<HTMLDivElement, HeatMapProps>(function HeatMap({
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
  colorScale = "sequential",
  colors: colorsProp,
  emptyColor,
  borderRadius = 4,
  enableLabels = false,
  labelSkipWidth = 12,
  labelSkipHeight = 12,
  forceSquare = false,
  cellPadding = 0.05,
  hoverTarget = "cell",
  hoverOtherOpacity = 0.35,
  onCellClick,
  drillDown,
  drillDownMode,
  crossFilter: crossFilterProp,
  animate: animateProp,
  variant,
  className,
  classNames,
  id,
  dense,
  "data-testid": dataTestId,
  loading,
  empty,
  error,
  stale,
}, ref) {
  assertPeer(ResponsiveHeatMap, "@nivo/heatmap", "HeatMap");
  const openDrill = useDrillDownAction();
  const linkedHover = useLinkedHover();
  const linkedHoverId = useLinkedHoverId();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Config resolution ---
  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedDense = dense ?? config.dense;
  const resolvedHeight = height ?? denseValues.chartHeight;

  // --- Cross-filter ---
  const crossFilter = useCrossFilter();
  const crossFilterField = crossFilterProp
    ? (typeof crossFilterProp === "object" ? crossFilterProp.field : undefined) ?? "x"
    : undefined;

  // --- Resolve data: unified format → HeatMap series ---
  const data = useMemo(() => {
    // 1. Unified format: flat rows + index + categories
    if (dataProp && dataProp.length > 0 && (indexProp || categoriesProp)) {
      const rows = dataProp as Record<string, unknown>[];
      const inferred = inferSchema(rows);
      const index = indexProp ?? inferred?.index;
      const categories = categoriesProp ?? inferred?.categories;
      if (index && categories && categories.length > 0) {
        return toHeatMapSeries(rows, index, categories);
      }
    }
    // 2. Nivo-native series (has id + data array)
    if (dataProp && dataProp.length > 0) {
      const first = dataProp[0] as Record<string, unknown>;
      if ("id" in first && "data" in first) return dataProp as HeatMapSeries[];
      // 2b. Auto-infer from flat rows
      const rows = dataProp as Record<string, unknown>[];
      const inferred = inferSchema(rows);
      if (inferred) return toHeatMapSeries(rows, inferred.index, inferred.categories);
      return dataProp as HeatMapSeries[];
    }
    // 3. Legacy simpleData
    if (simpleData && Object.keys(simpleData).length > 0) {
      return Object.entries(simpleData).map(([rowId, cols]) => ({
        id: rowId,
        data: Object.entries(cols).map(([colId, val]) => ({ x: colId, y: val })),
      }));
    }
    return (dataProp as HeatMapSeries[]) ?? [];
  }, [dataProp, indexProp, categoriesProp, simpleData]);

  // --- Color scale ---
  const nivoColors = useMemo(() => {
    if (colorsProp && colorsProp.length >= 2) {
      return {
        type: "sequential" as const,
        colors: colorsProp,
      };
    }
    if (colorScale === "diverging") {
      return isDark ? DIVERGING_COLORS.dark : DIVERGING_COLORS.light;
    }
    return isDark ? SEQUENTIAL_COLORS.dark : SEQUENTIAL_COLORS.light;
  }, [colorsProp, colorScale, isDark]);

  // --- Responsive margins ---
  const margin = useMemo(() => ({
    top: resolvedDense ? 34 : 50,
    right: containerWidth < 400 ? 16 : 24,
    bottom: resolvedDense ? 6 : 16,
    left: containerWidth < 300 ? 40 : containerWidth < 400 ? 60 : 80,
  }), [containerWidth, resolvedDense]);

  // --- Value formatter ---
  const formatCellValue = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
  );

  // --- Empty color ---
  const resolvedEmptyColor = emptyColor ?? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)");

  return (
    <div ref={ref} id={id} data-testid={dataTestId} style={{ minWidth: 120, height: "100%" }}>
    <div ref={containerRef} style={{ height: "100%" }}>
      <ChartContainer componentName="HeatMap"
        title={title}
        subtitle={subtitle}
        description={description}
        footnote={footnote}
        action={action}
        height={resolvedHeight}
        variant={resolvedVariant}

        className={classNames?.root ?? className}
        classNames={classNames ? { header: classNames.header, body: classNames.chart } : undefined}
        loading={loading}
        empty={empty}
        error={error}
        stale={stale}
      >
        <div style={{ height: resolvedHeight }}>
          <ResponsiveHeatMap
            data={data}
            theme={nivoTheme}
            colors={nivoColors}
            emptyColor={resolvedEmptyColor}
            margin={margin}
            forceSquare={forceSquare}
            xInnerPadding={cellPadding}
            yInnerPadding={cellPadding}
            xOuterPadding={0}
            yOuterPadding={0}
            borderRadius={borderRadius}
            borderWidth={0}
            enableLabels={enableLabels}
            label={(cell) =>
              cell.value !== null ? formatCellValue(cell.value) : ""
            }
            labelTextColor={{
              from: "color",
              modifiers: [[isDark ? "brighter" : "darker", 1.8]],
            }}
            hoverTarget={hoverTarget}
            tooltip={({ cell }) => (
              <HeatMapTooltipWrapper cell={cell} format={format} />
            )}
            axisTop={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: containerWidth < 500 ? -45 : 0,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}
            axisBottom={null}
            axisRight={null}
            animate={!!resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            layers={[
              "grid",
              "axes",
              "cells",
              "legends",
              "annotations",
            ] as any}
            onClick={
              (onCellClick || drillDown || (crossFilterProp && crossFilter))
                ? (cell) => {
                    const event: CellClickEvent = {
                      id: `${cell.serieId}-${String(cell.data.x)}`,
                      value: cell.value,
                      label: String(cell.data.x),
                      seriesId: cell.serieId,
                      x: String(cell.data.x),
                    };
                    onCellClick?.(event);
                    if (drillDown) {
                      openDrill(
                        { title: String(cell.data.x), field: crossFilterField ?? "x", value: String(cell.data.x), mode: drillDownMode },
                        drillDown(event),
                      );
                    } else if (crossFilterProp && crossFilter && crossFilterField) {
                      crossFilter.select({ field: crossFilterField, value: String(cell.data.x) });
                    }
                  }
                : undefined
            }
          />
        </div>
      </ChartContainer>
    </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const HeatMap = withErrorBoundary(HeatMapInner, "HeatMap");
(HeatMap as any).__gridHint = "chart";
