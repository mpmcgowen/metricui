"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import type { DefaultNode, DefaultLink, SankeyNodeDatum as SankeyNodeDatumGeneric, SankeyLinkDatum as SankeyLinkDatumGeneric } from "@nivo/sankey";
import { ChartContainer } from "./ChartContainer";

// Resolve generic types with defaults
type SankeyNodeDatumResolved = SankeyNodeDatumGeneric<DefaultNode, DefaultLink>;
type SankeyLinkDatumResolved = SankeyLinkDatumGeneric<DefaultNode, DefaultLink>;
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useComponentInteraction } from "@/lib/useComponentInteraction";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { assertPeer } from "@/lib/peerCheck";
import type { LegendConfig } from "@/lib/chartTypes";
import type { DrillDownEvent, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState, CardVariant } from "@/lib/types";

export type { LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SankeyNode {
  id: string;
  [key: string]: unknown;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeyProps extends DataComponentProps {
  /** Native Nivo Sankey format: { nodes, links }. Takes precedence over flat DataRow[] format. */
  data?: SankeyData | DataRow[];
  /** Column name for the source node (flat format). Default: "source" */
  sourceField?: string;
  /** Column name for the target node (flat format). Default: "target" */
  targetField?: string;
  /** Column name for the link value (flat format). Default: "value" */
  valueField?: string;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for value labels and tooltips. */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Node colors. */
  colors?: string[];
  /** Enable/disable animation. Default: true */
  animate?: boolean;
  /** Thickness of each node rect. Default: 18 */
  nodeThickness?: number;
  /** Vertical padding between nodes. Default: 12 */
  nodePadding?: number;
  /** Opacity of the links. Default: 0.4 */
  linkOpacity?: number;
  /** Legend configuration. */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses source as the field, or pass `{ field }`. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down. `true` = auto table, function = custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
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

function isSankeyData(data: unknown): data is SankeyData {
  return (
    data != null &&
    typeof data === "object" &&
    "nodes" in (data as SankeyData) &&
    "links" in (data as SankeyData)
  );
}

function rowsToSankey(
  rows: DataRow[],
  sourceField: string,
  targetField: string,
  valueField: string,
): SankeyData {
  const nodeSet = new Set<string>();
  const links: SankeyLink[] = [];
  for (const row of rows) {
    const source = String(row[sourceField]);
    const target = String(row[targetField]);
    const value = Number(row[valueField]) || 0;
    nodeSet.add(source);
    nodeSet.add(target);
    links.push({ source, target, value });
  }
  return {
    nodes: Array.from(nodeSet).map((id) => ({ id })),
    links,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SankeyInner = forwardRef<HTMLDivElement, SankeyProps>(function Sankey(props, ref) {
  const {
    data: rawData,
    sourceField = "source",
    targetField = "target",
    valueField = "value",
    title,
    subtitle,
    description,
    footnote,
    action,
    format,
    height,
    colors: chartColors,
    animate: animateProp,
    nodeThickness = 18,
    nodePadding = 12,
    linkOpacity = 0.4,
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
    headline,
  } = props;

  assertPeer(ResponsiveSankey, "@nivo/sankey", "Sankey");

  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense });
  const { theme, localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedHeight, containerRef, containerWidth, nivoTheme } = ctx;

  // --- Resolve data ---
  const sankeyData = useMemo<SankeyData>(() => {
    if (!rawData) return { nodes: [], links: [] };
    if (isSankeyData(rawData)) return rawData;
    if (Array.isArray(rawData)) return rowsToSankey(rawData, sourceField, targetField, valueField);
    return { nodes: [], links: [] };
  }, [rawData, sourceField, targetField, valueField]);

  // --- Export data (flat rows for CSV) ---
  const exportData = useMemo<DataRow[]>(() => {
    return sankeyData.links.map((l) => ({
      [sourceField]: l.source,
      [targetField]: l.target,
      [valueField]: l.value,
    }));
  }, [sankeyData, sourceField, targetField, valueField]);

  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: sourceField,
    tooltipHint,
    data: exportData,
  });

  // --- Legend ---
  const nodeIds = useMemo(() => sankeyData.nodes.map((n) => n.id), [sankeyData.nodes]);
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig } = useChartLegend(
    nodeIds.length,
    legendProp,
    { allIds: nodeIds },
  );

  const seriesColors = chartColors ?? config.colors;

  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    nodeIds.forEach((id, i) => {
      map.set(id, seriesColors[i % seriesColors.length]);
    });
    return map;
  }, [nodeIds, seriesColors]);

  const legendItems = useMemo(
    () =>
      nodeIds.map((nodeId, i) => ({
        id: nodeId,
        label: nodeId,
        color: seriesColors[i % seriesColors.length],
      })),
    [nodeIds, seriesColors],
  );

  // --- Filtered data (hide nodes) ---
  const filteredData = useMemo<SankeyData>(() => {
    if (hiddenKeys.size === 0) return sankeyData;
    const nodes = sankeyData.nodes.filter((n) => !hiddenKeys.has(n.id));
    const visibleIds = new Set(nodes.map((n) => n.id));
    const links = sankeyData.links.filter(
      (l) => visibleIds.has(l.source) && visibleIds.has(l.target),
    );
    return { nodes, links };
  }, [sankeyData, hiddenKeys]);

  // --- Format callback ---
  const formatFn = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
  );

  // --- Node click handler ---
  const handleNodeClick = useCallback(
    (node: SankeyNodeDatumResolved) => {
      const nodeId = String(node.id);
      interaction.handleClick({ title: nodeId, value: nodeId, field: sourceField });
    },
    [interaction, sourceField],
  );

  return (
    <div
      ref={ref}
      style={{ minWidth: 120, height: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%" }}>
        <ChartContainer
          componentName="Sankey"
          shell={{
            title, subtitle, description, footnote, action, headline,
            variant: resolvedVariant, aiContext, loading, empty, error, stale,
            className: classNames?.root ?? className,
            classNames: classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined,
            id, "data-testid": dataTestId,
          }}
          height={resolvedHeight}
          exportData={exportData}
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
          <ResponsiveSankey
            data={filteredData}
            theme={nivoTheme}
            colors={((node: any) => colorMap.get(String(node.id)) ?? seriesColors[0]) as any}
            margin={{ top: 16, right: containerWidth < 500 ? 100 : 200, bottom: 40, left: containerWidth < 500 ? 100 : 200 }}
            nodeThickness={nodeThickness}
            nodeOpacity={1}
            nodeHoverOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeBorderWidth={0}
            nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
            nodeBorderRadius={3}
            linkOpacity={linkOpacity}
            linkHoverOpacity={0.6}
            linkHoverOthersOpacity={0.15}
            linkContract={3}
            linkBlendMode={theme === "dark" ? "screen" : "multiply"}
            enableLinkGradient
            nodeTooltip={({ node }) => (
              <ChartTooltip
                header={String(node.id)}
                items={[
                  {
                    color: String(node.color),
                    label: "Total",
                    value: formatFn(node.value),
                  },
                ]}
                actionHint={interaction.actionHint}
              />
            )}
            linkTooltip={({ link }) => (
              <ChartTooltip
                header={`${link.source.id} → ${link.target.id}`}
                items={[
                  {
                    color: String(link.source.color),
                    label: "Value",
                    value: formatFn(link.value),
                  },
                ]}
              />
            )}
            animate={resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            onClick={(data) => {
              // Only handle node clicks
              if ("id" in data && !("source" in data)) {
                handleNodeClick(data as SankeyNodeDatumResolved);
              }
            }}
            label={((node: any) => String(node.id)) as any}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
            sort="auto"
            nodeSpacing={nodePadding}
          />
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid hint + error boundary
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Sankey = withErrorBoundary(SankeyInner, "Sankey");
(Sankey as any).__gridHint = "chart";
