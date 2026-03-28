"use client";

import { forwardRef, useMemo, useCallback } from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import type {
  DefaultTreeMapDatum,
  ComputedNode,
  TooltipProps,
} from "@nivo/treemap";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { useChartLegend } from "@/lib/useChartLegend";
import type { LegendConfig } from "@/lib/chartTypes";
import type { CardVariant, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { assertPeer } from "@/lib/peerCheck";

// Re-export shared types
export type { LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Hierarchical datum accepted by Nivo's ResponsiveTreeMap */
export interface TreemapDatum {
  name: string;
  value?: number;
  children?: TreemapDatum[];
  [key: string]: unknown;
}

/** Click event payload for Treemap */
export interface TreemapClickEvent {
  id: string;
  value: number;
  label: string;
  path: string[];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TreemapProps extends DataComponentProps {
  /** Hierarchical Nivo data OR flat rows (aggregated via `index` + `value` props) */
  data?: TreemapDatum | DataRow[];
  /** Category field name when using flat DataRow[] input */
  index?: string;
  /** Value field name when using flat DataRow[] input */
  value?: string;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Height in px. Default: 300 */
  height?: number;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Format for value labels and tooltips */
  format?: FormatOption;
  /** Tiling algorithm. Default: "squarify" */
  tile?: "squarify" | "binary" | "slice" | "dice" | "sliceDice";
  /** Padding between sibling tiles. Default: 2 */
  innerPadding?: number;
  /** Padding around the root. Default: 4 */
  outerPadding?: number;
  /** Skip labels on tiles smaller than this (px). Default: 24 */
  labelSkipSize?: number;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Legend configuration. Default: shown */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses index as the field, or pass `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down content renderer. `true` for auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: TreemapClickEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Detect whether the data prop is hierarchical (TreemapDatum) or flat (DataRow[]) */
function isHierarchical(data: TreemapDatum | DataRow[]): data is TreemapDatum {
  return !Array.isArray(data) && typeof data === "object" && "name" in data;
}

/** Convert flat rows to Nivo hierarchical format */
function flatToHierarchical(rows: DataRow[], indexField: string, valueField: string): DefaultTreeMapDatum {
  return {
    id: "root",
    children: rows.map((r) => ({
      id: String(r[indexField] ?? ""),
      value: Number(r[valueField]) || 0,
    })),
  };
}

/** Convert our TreemapDatum (name-based) to Nivo's DefaultTreeMapDatum (id-based) */
function normalizeDatum(datum: TreemapDatum): DefaultTreeMapDatum {
  return {
    id: datum.name,
    value: datum.value,
    children: datum.children?.map(normalizeDatum),
  };
}

/** Collect all leaf ids from hierarchical data for legend */
function collectLeafIds(datum: DefaultTreeMapDatum): string[] {
  if (datum.children && datum.children.length > 0) {
    return datum.children.flatMap(collectLeafIds);
  }
  return [datum.id];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TreemapInner = forwardRef<HTMLDivElement, TreemapProps>(function Treemap(props, ref) {
  const {
    data: rawData,
    index: indexProp = "name",
    value: valueProp = "value",
    title,
    subtitle,
    description,
    footnote,
    action,
    height,
    colors: chartColors,
    format,
    tile = "squarify",
    innerPadding = 2,
    outerPadding = 4,
    labelSkipSize = 24,
    animate: animateProp,
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
    exportable,
    state,
  } = props;

  assertPeer(ResponsiveTreeMap, "@nivo/treemap", "Treemap");

  const config = useMetricConfig();
  const localeDefaults = useLocale();
  const { theme } = useTheme();

  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedHeight = height ?? denseValues.chartHeight;

  // --- Container size ---
  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Transform data ---
  const nivoData = useMemo<DefaultTreeMapDatum>(() => {
    if (!rawData) return { id: "root", children: [] };
    if (isHierarchical(rawData)) return normalizeDatum(rawData);
    return flatToHierarchical(rawData as DataRow[], indexProp, valueProp);
  }, [rawData, indexProp, valueProp]);

  // --- Leaf ids for legend ---
  const leafIds = useMemo(() => collectLeafIds(nivoData), [nivoData]);

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;

  // --- Legend ---
  const { hidden: hiddenIds, toggle: toggleId, legendConfig } = useChartLegend(
    leafIds.length,
    legendProp,
    { allIds: leafIds },
  );

  // --- Filter hidden nodes from data ---
  const filteredData = useMemo<DefaultTreeMapDatum>(() => {
    if (hiddenIds.size === 0) return nivoData;

    function filterChildren(datum: DefaultTreeMapDatum): DefaultTreeMapDatum {
      if (!datum.children) return datum;
      return {
        ...datum,
        children: datum.children
          .filter((c) => !hiddenIds.has(c.id))
          .map(filterChildren),
      };
    }
    return filterChildren(nivoData);
  }, [nivoData, hiddenIds]);

  // --- Flat export data ---
  const exportData = useMemo<DataRow[]>(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    // Extract leaves from hierarchical data
    function extractLeaves(datum: TreemapDatum): DataRow[] {
      if (datum.children && datum.children.length > 0) {
        return datum.children.flatMap(extractLeaves);
      }
      return [{ name: datum.name, value: datum.value ?? 0 }];
    }
    return extractLeaves(rawData);
  }, [rawData]);

  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: indexProp,
    tooltipHint,
    data: exportData,
  });

  // --- Color function ---
  const colorFn = useCallback(
    (node: { id: string }) => {
      const idx = leafIds.indexOf(node.id);
      return seriesColors[(idx >= 0 ? idx : 0) % seriesColors.length];
    },
    [leafIds, seriesColors],
  );

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      leafIds.map((id, i) => {
        // Find value for this leaf
        const child = nivoData.children?.find((c) => c.id === id);
        return {
          id,
          label: id,
          color: seriesColors[i % seriesColors.length],
          value: child?.value != null ? formatValue(child.value, format, localeDefaults) : undefined,
        };
      }),
    [leafIds, nivoData, seriesColors, format, localeDefaults],
  );

  // --- Tooltip ---
  const renderTooltip = useCallback(
    ({ node }: TooltipProps<DefaultTreeMapDatum>) => {
      const actionHint = interaction.actionHint;
      const idx = leafIds.indexOf(node.id);
      const color = seriesColors[(idx >= 0 ? idx : 0) % seriesColors.length];

      return (
        <ChartTooltip
          header={node.id}
          items={[
            {
              color,
              label: node.id,
              value: formatValue(node.value, format, localeDefaults),
            },
          ]}
          actionHint={actionHint}
        />
      );
    },
    [interaction.actionHint, leafIds, seriesColors, format, localeDefaults],
  );

  // --- Click handler ---
  const handleClick = useCallback(
    (node: ComputedNode<DefaultTreeMapDatum>) => {
      if (!node.isLeaf) return;
      interaction.handleClick({ title: node.id, value: node.id, field: indexProp, path: node.pathComponents });
    },
    [interaction, indexProp],
  );

  // --- Margins ---
  const margin = useMemo(
    () => ({
      top: 4,
      right: 4,
      bottom: 4,
      left: 4,
    }),
    [],
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
          componentName="Treemap"
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
              ? { header: classNames.header, body: classNames.body ?? classNames.chart }
              : undefined
          }
          loading={loading}
          empty={empty}
          error={error}
          stale={stale}
          state={state}
          exportable={exportable}
          exportData={exportData}
          below={
            legendConfig ? (
              <ChartLegend
                items={legendItems}
                hidden={hiddenIds}
                onToggle={toggleId}
                toggleable={legendConfig.toggleable !== false}
              />
            ) : undefined
          }
        >
          <ResponsiveTreeMap<DefaultTreeMapDatum>
            data={filteredData}
            identity="id"
            value="value"
            tile={tile}
            leavesOnly
            innerPadding={innerPadding}
            outerPadding={outerPadding}
            margin={margin}
            theme={nivoTheme}
            colors={colorFn}
            labelSkipSize={labelSkipSize}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 2.4]],
            }}
            parentLabelTextColor={{
              from: "color",
              modifiers: [["darker", 3]],
            }}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.3]],
            }}
            nodeOpacity={1}
            tooltip={renderTooltip}
            animate={resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            onClick={
              interaction.isInteractive
                ? handleClick
                : undefined
            }
          />
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Treemap = withErrorBoundary(TreemapInner, "Treemap");
(Treemap as any).__gridHint = "chart";
