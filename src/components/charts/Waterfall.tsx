"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { BarDatum, BarCustomLayerProps, BarTooltipProps } from "@nivo/bar";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { calculateResponsiveTicks } from "@/lib/calculateResponsiveTicks";
import type { DrillDownEvent, CardVariant, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import type { BarClickEvent } from "@/lib/chartTypes";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { assertPeer } from "@/lib/peerCheck";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WaterfallItem {
  /** Display label */
  label: string;
  /** Value — positive for increase, negative for decrease. Ignored for subtotal/total. */
  value?: number;
  /** Item type. Default: "value". "subtotal" and "total" are auto-computed running sums. */
  type?: "value" | "subtotal" | "total";
  /** Custom color override for this bar */
  color?: string;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface WaterfallProps extends DataComponentProps {
  data: WaterfallItem[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for values */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Color for positive (increase) bars. Default: theme positive color */
  positiveColor?: string;
  /** Color for negative (decrease) bars. Default: theme negative color */
  negativeColor?: string;
  /** Color for subtotal/total bars. Default: theme accent */
  totalColor?: string;
  /** Show connector lines between bars. Default: true */
  connectors?: boolean;
  /** Show value labels on bars. Default: true */
  enableLabels?: boolean;
  /** Corner radius on bars. Default: 3 */
  borderRadius?: number;
  /** Padding between bars (0-1). Default: 0.35 */
  padding?: number;
  /** Show grid lines. Default: true */
  enableGridY?: boolean;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Drill-down content renderer. When set, clicking a bar opens the drill-down panel. Takes priority over crossFilter for the click action.
   *  Pass `true` for an auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Emit cross-filter selection on bar click. Defaults field to "label". */
  crossFilter?: boolean | { field?: string };
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string };
}

// ---------------------------------------------------------------------------
// Internal: Transform waterfall items into stacked bar data
// ---------------------------------------------------------------------------

interface ComputedBar {
  label: string;
  _spacer: number;
  _positive: number;
  _negative: number;
  _value: number;       // actual value for tooltip
  _runningTotal: number; // cumulative total at this point
  _type: "value" | "subtotal" | "total";
  _customColor?: string;
}

function computeWaterfallBars(items: WaterfallItem[]): ComputedBar[] {
  const bars: ComputedBar[] = [];
  let runningTotal = 0;

  for (const item of items) {
    if (item.type === "subtotal" || item.type === "total") {
      // Subtotal/total bar — starts at 0, goes to running total
      bars.push({
        label: item.label,
        _spacer: runningTotal < 0 ? runningTotal : 0,
        _positive: runningTotal > 0 ? runningTotal : 0,
        _negative: runningTotal < 0 ? Math.abs(runningTotal) : 0,
        _value: runningTotal,
        _runningTotal: runningTotal,
        _type: item.type,
        _customColor: item.color,
      });
      // For "total", reset running total for subsequent items (if any)
      if (item.type === "total") {
        runningTotal = 0;
      }
    } else {
      const value = item.value ?? 0;
      const prevTotal = runningTotal;
      runningTotal += value;

      if (value >= 0) {
        // Positive bar — spacer up to previous total, then the increase
        bars.push({
          label: item.label,
          _spacer: prevTotal,
          _positive: value,
          _negative: 0,
          _value: value,
          _runningTotal: runningTotal,
          _type: "value",
          _customColor: item.color,
        });
      } else {
        // Negative bar — spacer up to new (lower) total, then the decrease going up
        bars.push({
          label: item.label,
          _spacer: runningTotal,
          _positive: 0,
          _negative: Math.abs(value),
          _value: value,
          _runningTotal: runningTotal,
          _type: "value",
          _customColor: item.color,
        });
      }
    }
  }

  return bars;
}

// ---------------------------------------------------------------------------
// Connector lines layer
// ---------------------------------------------------------------------------

function createConnectorLayer(
  bars: ComputedBar[],
  isDark: boolean
) {
  return function ConnectorLayer(props: BarCustomLayerProps<BarDatum>) {
    const { bars: nivoBars } = props;
    if (nivoBars.length < 2) return null;

    // Group bars by index (each waterfall item has 3 bars: spacer, positive, negative)
    // We need to find the top of each waterfall bar to draw connectors
    const barGroups = new Map<number, (typeof nivoBars)[number][]>();
    for (const bar of nivoBars) {
      const idx = bar.data.index;
      const group = barGroups.get(idx) ?? [];
      group.push(bar);
      barGroups.set(idx, group);
    }

    const connectors: React.ReactNode[] = [];
    const sortedIndices = [...barGroups.keys()].sort((a, b) => a - b);

    for (let i = 0; i < sortedIndices.length - 1; i++) {
      const currIdx = sortedIndices[i];
      const nextIdx = sortedIndices[i + 1];
      const currBars = barGroups.get(currIdx)!;
      const nextBars = barGroups.get(nextIdx)!;

      const currData = bars[currIdx];
      const nextData = bars[nextIdx];

      // Skip connector if next item is a total (starts from 0)
      if (nextData._type === "total") continue;

      // Find the y position of the running total for current bar
      // The running total determines where the connector goes
      const currRunning = currData._runningTotal;

      // Find the spacer bar to determine y position
      const currSpacerBar = currBars.find(b => String(b.data.id) === "_spacer");
      const nextSpacerBar = nextBars.find(b => String(b.data.id) === "_spacer");

      if (!currSpacerBar || !nextSpacerBar) continue;

      // The connector line goes from the top of the current bar to the start of the next bar
      // For positive bars: top = spacer.y (since bars grow upward in SVG)
      // We use the running total position
      const yScale = props.yScale as unknown as (v: number) => number;
      const y = yScale(currRunning);

      const x1 = currSpacerBar.x + currSpacerBar.width;
      const x2 = nextSpacerBar.x;

      connectors.push(
        <line
          key={`connector-${i}`}
          x1={x1}
          x2={x2}
          y1={y}
          y2={y}
          stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      );
    }

    return <g>{connectors}</g>;
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const WaterfallInner = forwardRef<HTMLDivElement, WaterfallProps>(function Waterfall({
  data: rawData = [],
  title,
  subtitle,
  description,
  footnote,
  action,
  headline,
  format,
  height,
  positiveColor: positiveColorProp,
  negativeColor: negativeColorProp,
  totalColor: totalColorProp,
  connectors = true,
  enableLabels = true,
  borderRadius = 3,
  padding = 0.35,
  enableGridY = true,
  yAxisLabel,
  dense: denseProp,
  animate: animateProp,
  drillDown,
  drillDownMode,
  crossFilter: crossFilterProp,
  tooltipHint,
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
  assertPeer(ResponsiveBar, "@nivo/bar", "Waterfall");
  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: "label",
    tooltipHint,
    data: rawData as unknown as DataRow[],
  });
  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense: denseProp });
  const { isDark, localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedDense, resolvedHeight, containerRef, containerWidth, nivoTheme } = ctx;

  // --- Colors ---
  const positiveColor = positiveColorProp ?? (isDark ? "#34d399" : "#059669");
  const negativeColor = negativeColorProp ?? (isDark ? "#f87171" : "#ef4444");
  const totalColor = totalColorProp ?? "var(--accent)";

  // --- Compute waterfall bars ---
  const computedBars = useMemo(() => computeWaterfallBars(rawData), [rawData]);

  // --- Transform to Nivo bar data ---
  const barData = useMemo(() => {
    return computedBars.map((bar) => ({
      label: bar.label,
      _spacer: Math.max(0, bar._spacer),
      _positive: bar._positive,
      _negative: bar._negative,
    }));
  }, [computedBars]);

  // --- Color function ---
  const colorFn = useCallback(
    (datum: { id: string | number; data: BarDatum }) => {
      const key = String(datum.id);
      if (key === "_spacer") return "transparent";

      const idx = barData.findIndex(b => b.label === String(datum.data.label));
      const computed = computedBars[idx];

      if (computed?._customColor) return computed._customColor;
      if (computed?._type === "subtotal" || computed?._type === "total") return totalColor;
      if (key === "_positive") return positiveColor;
      if (key === "_negative") return negativeColor;
      return positiveColor;
    },
    [barData, computedBars, positiveColor, negativeColor, totalColor],
  );

  // --- Format Y axis ---
  const formatYAxis = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
  );

  // --- X-axis ticks ---
  const xTickValues = useMemo(() => {
    const labels = barData.map(d => d.label);
    return calculateResponsiveTicks(labels, containerWidth);
  }, [barData, containerWidth]);

  // --- Margin (extra top space for labels above bars) ---
  const margin = useMemo(() => ({
    top: enableLabels ? 28 : 16,
    right: containerWidth < 400 ? 8 : 16,
    bottom: yAxisLabel ? 48 : 36,
    left: containerWidth < 300 ? 8 : containerWidth < 400 ? 36 : yAxisLabel ? 72 : 60,
  }), [containerWidth, yAxisLabel, enableLabels]);

  // --- Custom label layer (positioned above each bar for readability) ---
  const createLabelLayer = useCallback(
    () => {
      return function LabelLayer(props: BarCustomLayerProps<BarDatum>) {
        const { bars: nivoBars } = props;
        // Group bars by index to find each waterfall item's visual bounds
        const barGroups = new Map<number, { minY: number; x: number; width: number }>();
        for (const bar of nivoBars) {
          const key = String(bar.data.id);
          if (key === "_spacer") continue;
          if (bar.data.value === 0) continue;
          const idx = bar.data.index;
          const existing = barGroups.get(idx);
          if (!existing) {
            barGroups.set(idx, { minY: bar.y, x: bar.x, width: bar.width });
          } else {
            existing.minY = Math.min(existing.minY, bar.y);
          }
        }

        return (
          <g>
            {[...barGroups.entries()].map(([idx, bounds]) => {
              const computed = computedBars[idx];
              if (!computed) return null;
              const label = formatValue(Math.abs(computed._value), format, localeDefaults);
              return (
                <text
                  key={idx}
                  x={bounds.x + bounds.width / 2}
                  y={bounds.minY - 6}
                  textAnchor="middle"
                  dominantBaseline="auto"
                  fill={isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)"}
                  fontSize={11}
                  fontWeight={500}
                >
                  {label}
                </text>
              );
            })}
          </g>
        );
      };
    },
    [computedBars, format, localeDefaults, isDark],
  );

  // --- Custom layers ---
  const layers = useMemo(() => {
    const l = ["grid", "axes"] as any[];
    if (connectors) {
      l.push(createConnectorLayer(computedBars, isDark));
    }
    l.push("bars");
    if (enableLabels) {
      l.push(createLabelLayer());
    }
    l.push("markers", "legends", "annotations");
    return l;
  }, [connectors, computedBars, isDark, enableLabels, createLabelLayer]);

  return (
    <div ref={containerRef} style={{ minWidth: 120, height: "100%" }}>
      <ChartContainer
        ref={ref}
        componentName="Waterfall"
        shell={{
          title, subtitle, description, footnote, action, headline,
          variant: resolvedVariant, aiContext, loading, empty, error, stale,
          dense: resolvedDense,
          className: classNames?.root ?? className,
          classNames: classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined,
          id, "data-testid": dataTestId,
        }}
        height={resolvedHeight}
        exportData={rawData as unknown as DataRow[]}
      >
        <div style={{ height: resolvedHeight }}>
          <ResponsiveBar
            data={barData}
            keys={["_spacer", "_positive", "_negative"]}
            indexBy="label"
            theme={nivoTheme}
            colors={colorFn}
            margin={margin}
            padding={padding}
            groupMode="stacked"
            layout="vertical"
            borderRadius={borderRadius}
            borderWidth={0}
            enableGridX={false}
            enableGridY={enableGridY}
            enableLabel={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: 0,
              tickValues: xTickValues,
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
            tooltip={({ indexValue }: BarTooltipProps<BarDatum>) => {
              const idx = barData.findIndex(b => b.label === String(indexValue));
              const computed = computedBars[idx];
              if (!computed) return null;

              const isTotal = computed._type === "subtotal" || computed._type === "total";
              const displayValue = computed._value;
              const prefix = !isTotal && displayValue > 0 ? "+" : "";

              return (
                <ChartTooltip
                  header={String(indexValue)}
                  items={[{
                    color: isTotal
                      ? totalColor
                      : displayValue >= 0
                        ? positiveColor
                        : negativeColor,
                    label: isTotal
                      ? (computed._type === "subtotal" ? "Subtotal" : "Total")
                      : (displayValue >= 0 ? "Increase" : "Decrease"),
                    value: `${prefix}${formatValue(displayValue, format, localeDefaults)}`,
                    secondary: isTotal
                      ? undefined
                      : `Running total: ${formatValue(computed._runningTotal, format, localeDefaults)}`,
                  }]}
                  actionHint={interaction.actionHint}
                />
              );
            }}
            onClick={
              interaction.isInteractive
                ? (datum) => {
                    interaction.handleClick({ title: String(datum.indexValue), value: datum.indexValue, key: String(datum.id), indexValue: datum.indexValue });
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
  );
});

// Grid layout hint
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Waterfall = withErrorBoundary(WaterfallInner, "Waterfall");
(Waterfall as any).__gridHint = "chart"; // eslint-disable-line @typescript-eslint/no-explicit-any
