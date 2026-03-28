"use client";

import { forwardRef, useState, useCallback, useMemo, useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type {
  BarDatum,
  BarLayer,
  BarCustomLayerProps,
  ComputedDatum,
  BarTooltipProps,
} from "@nivo/bar";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { calculateResponsiveTicks } from "@/lib/calculateResponsiveTicks";
import { devWarn, devWarnDeprecated } from "@/lib/devWarnings";
import type { LegendConfig, ReferenceLine, ThresholdBand, BarClickEvent } from "@/lib/chartTypes";
import type { CardVariant, ChartNullMode, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { inferSchema, categoryKeys, categoryColors, type Category } from "@/lib/dataTransform";
import { assertPeer } from "@/lib/peerCheck";

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
  /** Preset configuration that sets sensible defaults for common use cases.
   *  Individual props override preset values. */
  preset?: BarChartPreset;
  data?: DataRow[];
  /** Column name to use as the X-axis (index). Alias for `indexBy`. */
  index?: string;
  /** Value columns to chart. Can be plain strings or rich config objects.
   *  Alias for `keys` — when provided, `keys` and `indexBy` are derived automatically. */
  categories?: Category[];
  keys?: string[];
  indexBy?: string;
  /** Previous period data rendered as outline bars */
  comparisonData?: Record<string, string | number>[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for value-axis labels and tooltips */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Bar layout direction. Default: "vertical" */
  layout?: "vertical" | "horizontal";
  /** How multiple keys are displayed. Default: "stacked" */
  groupMode?: "stacked" | "grouped" | "percent";
  /** Gap between bar groups. Default: 0.3 */
  padding?: number;
  /** Gap between bars in a group. Default: 4 for grouped, 0 for stacked */
  innerPadding?: number;
  /** Corner radius on bars. Default: 4 */
  borderRadius?: number;
  /** Show formatted value labels on bars. Default: false */
  enableLabels?: boolean;
  /** Where labels appear. Default: "auto" */
  labelPosition?: "inside" | "outside" | "auto";
  /** Sort bars by total value. Default: "none" */
  sort?: "none" | "asc" | "desc";
  /** Enable diverging colors for negative values. Default: false */
  enableNegative?: boolean;
  /** Color for negative bars. Default: "#EF4444" */
  negativeColor?: string;
  /** Target values keyed by index — renders ghost/outline bars behind actuals */
  targetData?: Record<string, number>[];
  /** Color for target bars. Default: theme-aware muted color */
  targetColor?: string;
  /** Per-key color overrides */
  seriesStyles?: Record<string, BarSeriesStyle>;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Reference lines */
  referenceLines?: ReferenceLine[];
  /** Threshold bands (colored Y-axis ranges) */
  thresholds?: ThresholdBand[];
  /** Legend configuration. Default: shown for multi-key data */
  legend?: boolean | LegendConfig;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Click handler for bars */
  onBarClick?: (bar: BarClickEvent) => void;
  /** Drill-down content renderer. When set, clicking a bar opens the drill-down panel. Takes priority over crossFilter for the click action.
   *  Pass `true` for an auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: BarClickEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Enable cross-filtering. `true` uses indexBy as the field, or pass `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** How null / missing data points are handled. Default: "gap" */
  chartNullMode?: ChartNullMode;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** @deprecated Use groupMode="grouped" instead */
  grouped?: boolean;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Custom tooltip (uses shared ChartTooltip)
// ---------------------------------------------------------------------------

// No standalone tooltip wrapper needed — we create the tooltip inline
// in the component below, where we have access to chartData and keys.

// ---------------------------------------------------------------------------
// Custom layers
// ---------------------------------------------------------------------------

function createThresholdLayer(
  thresholds: ThresholdBand[],
  layout: "vertical" | "horizontal"
) {
  return function ThresholdLayer(
    props: BarCustomLayerProps<BarDatum>
  ) {
    const { innerWidth, innerHeight, yScale, xScale } = props;

    return (
      <g>
        {thresholds.map((t, i) => {
          const color = t.color ?? "var(--accent)";
          const opacity = t.opacity ?? 0.08;

          if (layout === "vertical") {
            const yScaleFn = yScale as unknown as (v: number) => number;
            const y1 = yScaleFn(t.to);
            const y2 = yScaleFn(t.from);
            const h = Math.abs(y2 - y1);
            return (
              <g key={i}>
                <rect
                  x={0}
                  y={Math.min(y1, y2)}
                  width={innerWidth}
                  height={h}
                  fill={color}
                  opacity={opacity}
                />
                {t.label && (
                  <text
                    x={innerWidth - 6}
                    y={Math.min(y1, y2) + 12}
                    textAnchor="end"
                    fill={color}
                    fontSize={9}
                    fontWeight={600}
                    opacity={0.6}
                  >
                    {t.label}
                  </text>
                )}
              </g>
            );
          } else {
            const xScaleFn = xScale as unknown as (v: number) => number;
            const x1 = xScaleFn(t.from);
            const x2 = xScaleFn(t.to);
            const w = Math.abs(x2 - x1);
            return (
              <g key={i}>
                <rect
                  x={Math.min(x1, x2)}
                  y={0}
                  width={w}
                  height={innerHeight}
                  fill={color}
                  opacity={opacity}
                />
                {t.label && (
                  <text
                    x={Math.min(x1, x2) + 4}
                    y={12}
                    fill={color}
                    fontSize={9}
                    fontWeight={600}
                    opacity={0.6}
                  >
                    {t.label}
                  </text>
                )}
              </g>
            );
          }
        })}
      </g>
    );
  };
}

function createReferenceLineLayer(
  lines: ReferenceLine[],
  layout: "vertical" | "horizontal"
) {
  return function ReferenceLineLayer(
    props: BarCustomLayerProps<BarDatum>
  ) {
    const { innerWidth, innerHeight, yScale, xScale } = props;

    return (
      <g>
        {lines.map((line, i) => {
          const color = line.color ?? "var(--muted)";
          const dashArray = line.style === "solid" ? undefined : "6 4";

          // For vertical bar chart: y reference lines are horizontal, x reference lines are vertical
          // For horizontal bar chart: swap
          if (
            (layout === "vertical" && line.axis === "y") ||
            (layout === "horizontal" && line.axis === "x")
          ) {
            // Horizontal reference line across the value axis
            const scaleFn =
              layout === "vertical"
                ? (yScale as unknown as (v: number) => number)
                : (xScale as unknown as (v: number) => number);
            const pos = scaleFn(line.value as number);

            if (layout === "vertical") {
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
            } else {
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
            }
          }

          // Vertical line on category axis — not commonly used for bar charts but supported
          return <g key={i} />;
        })}
      </g>
    );
  };
}

function createComparisonLayer(
  comparisonData: Record<string, string | number>[],
  keys: string[],
  indexBy: string,
  comparisonColor: string,
  layout: "vertical" | "horizontal"
) {
  return function ComparisonLayer(
    props: BarCustomLayerProps<BarDatum>
  ) {
    const { bars, xScale, yScale } = props;
    if (!bars.length) return null;

    // Build a lookup from the comparison data
    const lookup = new Map<string, Record<string, number>>();
    for (const row of comparisonData) {
      const idx = String(row[indexBy]);
      const values: Record<string, number> = {};
      for (const key of keys) {
        values[key] = (row[key] as number) ?? 0;
      }
      lookup.set(idx, values);
    }

    return (
      <g>
        {bars.map((bar) => {
          const idx = String(bar.data.indexValue);
          const key = String(bar.data.id);
          const compValues = lookup.get(idx);
          if (!compValues || compValues[key] === undefined) return null;
          const compVal = compValues[key];

          if (layout === "vertical") {
            const yScaleFn = yScale as unknown as (v: number) => number;
            const y = yScaleFn(compVal);
            const y0 = yScaleFn(0);
            const barHeight = Math.abs(y0 - y);
            return (
              <rect
                key={`comp-${bar.key}`}
                x={bar.x}
                y={Math.min(y, y0)}
                width={bar.width}
                height={barHeight}
                fill="none"
                stroke={comparisonColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.5}
                rx={4}
              />
            );
          } else {
            const xScaleFn = xScale as unknown as (v: number) => number;
            const x = xScaleFn(compVal);
            const x0 = xScaleFn(0);
            const barWidth = Math.abs(x - x0);
            return (
              <rect
                key={`comp-${bar.key}`}
                x={Math.min(x, x0)}
                y={bar.y}
                width={barWidth}
                height={bar.height}
                fill="none"
                stroke={comparisonColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.5}
                rx={4}
              />
            );
          }
        })}
      </g>
    );
  };
}

function createTargetLayer(
  targetData: Record<string, number>[],
  indexBy: string,
  keys: string[],
  targetColor: string,
  layout: "vertical" | "horizontal"
) {
  return function TargetLayer(
    props: BarCustomLayerProps<BarDatum>
  ) {
    const { bars, xScale, yScale } = props;
    if (!bars.length) return null;

    const lookup = new Map<string, Record<string, number>>();
    for (const row of targetData) {
      const idx = String(row[indexBy]);
      const values: Record<string, number> = {};
      for (const key of keys) {
        if (row[key] !== undefined) values[key] = row[key];
      }
      lookup.set(idx, values);
    }

    return (
      <g>
        {bars.map((bar) => {
          const idx = String(bar.data.indexValue);
          const key = String(bar.data.id);
          const tgtValues = lookup.get(idx);
          if (!tgtValues || tgtValues[key] === undefined) return null;
          const tgtVal = tgtValues[key];

          if (layout === "vertical") {
            const yScaleFn = yScale as unknown as (v: number) => number;
            const y = yScaleFn(tgtVal);
            const y0 = yScaleFn(0);
            return (
              <rect
                key={`tgt-${bar.key}`}
                x={bar.x}
                y={Math.min(y, y0)}
                width={bar.width}
                height={Math.abs(y0 - y)}
                fill={targetColor}
                opacity={0.12}
                rx={4}
              />
            );
          } else {
            const xScaleFn = xScale as unknown as (v: number) => number;
            const x = xScaleFn(tgtVal);
            const x0 = xScaleFn(0);
            return (
              <rect
                key={`tgt-${bar.key}`}
                x={Math.min(x, x0)}
                y={bar.y}
                width={Math.abs(x - x0)}
                height={bar.height}
                fill={targetColor}
                opacity={0.12}
                rx={4}
              />
            );
          }
        })}
      </g>
    );
  };
}

// Hover dim layer: reduce opacity of non-hovered bars.
// Defined as a stable component at module scope to prevent unmount/remount flicker.
function HoverDimLayer(props: BarCustomLayerProps<BarDatum>) {
  const { bars } = props;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <g>
      {/* Invisible event-catching rects */}
      {bars.map((bar) => (
        <rect
          key={`evt-${bar.key}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill="transparent"
          onMouseEnter={() => setHoveredIndex(bar.data.index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ pointerEvents: "all", opacity: 0 }}
        />
      ))}
      {/* Visual dim overlay — pointer-events: none so tooltips still work */}
      {hoveredIndex !== null &&
        bars
          .filter((bar) => bar.data.index !== hoveredIndex)
          .map((bar) => (
            <rect
              key={`dim-${bar.key}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill="var(--background)"
              style={{
                opacity: 0.6,
                pointerEvents: "none",
                transition: "opacity 150ms ease",
              }}
            />
          ))}
    </g>
  );
}

/**
 * Linked hover highlight — when a sibling chart emits a hovered index,
 * highlight the matching bar group with a subtle background band.
 */
function createLinkedHoverBarLayer(
  hoveredIndex: string | number | null,
  sourceId: string | undefined,
  myId: string,
) {
  return function LinkedHoverBarLayer(props: BarCustomLayerProps<BarDatum>) {
    if (hoveredIndex == null || sourceId === myId) return null;
    const { bars, innerHeight } = props;
    // Find bars matching the hovered index
    const matchingBars = bars.filter((b) => String(b.data.indexValue) === String(hoveredIndex));
    if (matchingBars.length === 0) return null;
    // Get the x extent of the matching bar group
    const minX = Math.min(...matchingBars.map((b) => b.x));
    const maxX = Math.max(...matchingBars.map((b) => b.x + b.width));
    const pad = 4;
    return (
      <rect
        x={minX - pad}
        y={0}
        width={maxX - minX + pad * 2}
        height={innerHeight}
        fill="var(--accent)"
        opacity={0.06}
        rx={4}
        style={{ pointerEvents: "none", transition: "opacity 150ms ease" }}
      />
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BarChartInner = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(rawProps, ref) {
  // --- Resolve preset defaults, then let explicit props override ---
  const presetDefaults = rawProps.preset ? BAR_PRESETS[rawProps.preset] : {};
  const props = { ...presetDefaults, ...rawProps };

  const {
  data: rawData = [],
  index: indexProp,
  categories: categoriesProp,
  keys: keysProp,
  indexBy: indexByProp,
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
  labelPosition = "auto",
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
  // Legacy compat
  grouped,
  classNames,
  id,
  "data-testid": dataTestId,
  aiContext,
  } = props;

  assertPeer(ResponsiveBar, "@nivo/bar", "BarChart");

  // --- Deprecation warnings for old Nivo prop names ---
  if (process.env.NODE_ENV !== "production") {
    if (keysProp) devWarnDeprecated("BarChart", "keys", "categories");
    if (indexByProp) devWarnDeprecated("BarChart", "indexBy", "index");
  }

  // --- Resolve unified data props (index/categories → keys/indexBy) ---
  const inferred = useMemo(
    () => (!keysProp && !indexByProp ? inferSchema(rawData) : null),
    [rawData, keysProp, indexByProp]
  );
  const keys = keysProp ?? (categoriesProp ? categoryKeys(categoriesProp) : inferred?.categories ?? []);
  const indexBy = indexByProp ?? indexProp ?? inferred?.index ?? "";

  if (rawData.length > 0 && (keys.length === 0 || !indexBy)) {
    devWarn("BarChart.data", "BarChart received data but could not determine keys or indexBy. Pass `index` and `categories` props, or `keys` and `indexBy`.");
  }

  // Merge category-level color overrides into seriesStyles
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

  // --- Deprecation warnings ---
  if (process.env.NODE_ENV !== "production") {
    if (grouped !== undefined) devWarnDeprecated("BarChart", "grouped", 'groupMode="grouped"');
  }

  // --- Resolve groupMode ---
  const groupMode = groupModeProp ?? (grouped ? "grouped" : "stacked");
  const isPercent = groupMode === "percent";
  const nivoGroupMode = groupMode === "grouped" ? "grouped" : "stacked";

  // --- Inner padding default ---
  // Stacked uses -1 to overlap segments slightly, eliminating SVG anti-aliasing gaps
  const innerPaddingVal =
    innerPaddingProp ?? (groupMode === "grouped" ? 4 : -1);

  // --- Shared hooks ---
  const { containerRef, containerWidth, nivoTheme } = ctx;
  const { hidden: hiddenKeys, toggle: toggleKey, legendConfig, allHidden } = useChartLegend(
    keys.length,
    legendProp,
    { allIds: keys },
  );

  // --- Visible keys ---
  const visibleKeys = keys.filter((k) => !hiddenKeys.has(k));

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;
  const targetColor =
    targetColorProp ?? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)");
  const comparisonColor = isDark
    ? "rgba(255,255,255,0.35)"
    : "rgba(0,0,0,0.25)";

  // --- Sort data ---
  const data = useMemo(() => {
    if (sort === "none") return rawData;
    const sorted = [...rawData].sort((a, b) => {
      const totalA = visibleKeys.reduce(
        (sum, k) => sum + (Number(a[k]) || 0),
        0
      );
      const totalB = visibleKeys.reduce(
        (sum, k) => sum + (Number(b[k]) || 0),
        0
      );
      return sort === "asc" ? totalA - totalB : totalB - totalA;
    });
    return sorted;
  }, [rawData, sort, visibleKeys]);

  // --- Normalize data to 100% for percent mode ---
  const chartData = useMemo(() => {
    if (!isPercent) return data;
    return data.map((row) => {
      const total = visibleKeys.reduce(
        (sum, k) => sum + Math.abs(Number(row[k]) || 0),
        0
      );
      if (total === 0) return row;
      const normalized: Record<string, string | number> = {
        [indexBy]: row[indexBy],
      };
      for (const k of visibleKeys) {
        normalized[k] = ((Number(row[k]) || 0) / total) * 100;
      }
      return normalized;
    });
  }, [data, isPercent, visibleKeys, indexBy]);

  // --- Apply chartNullMode: for bars, only "zero" transforms data ---
  const processedChartData = useMemo(() => {
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

  // --- Color function with negative support ---
  const colorFn = useCallback(
    (datum: ComputedDatum<BarDatum>) => {
      // Per-key override via seriesStyles
      const keyStr = String(datum.id);
      if (seriesStyles?.[keyStr]?.color) {
        return seriesStyles[keyStr].color!;
      }
      // Per-key override via categories color config
      if (categoryColorMap[keyStr]) {
        return categoryColorMap[keyStr];
      }
      // Negative color
      if (enableNegative && datum.value !== null && datum.value < 0) {
        return negativeColor;
      }
      const keyIndex = keys.indexOf(keyStr);
      return seriesColors[
        (keyIndex >= 0 ? keyIndex : 0) % seriesColors.length
      ];
    },
    [keys, seriesColors, seriesStyles, categoryColorMap, enableNegative, negativeColor]
  );

  // --- Value axis formatter ---
  const formatValueAxis = useCallback(
    (value: number) => {
      if (isPercent) return `${Math.round(value)}%`;
      return formatValue(value, format, localeDefaults);
    },
    [format, localeDefaults, isPercent]
  );

  // --- Smart tick thinning ---
  const xTickValues = useMemo(() => {
    if (layout === "horizontal") return undefined;
    if (!data.length) return undefined;
    const labels = data.map((d) => String(d[indexBy]));
    return calculateResponsiveTicks(labels, containerWidth);
  }, [data, containerWidth, indexBy, layout]);

  // --- Label props ---
  const labelSkipWidth = labelPosition === "outside" ? 0 : 12;
  const labelSkipHeight = labelPosition === "outside" ? 0 : 12;

  // --- Custom layers ---
  const customLayers = useMemo(() => {
    const layers: BarLayer<BarDatum>[] = ["grid", "axes"];

    if (thresholds && thresholds.length > 0) {
      layers.push(
        createThresholdLayer(thresholds, layout) as BarLayer<BarDatum>
      );
    }
    if (referenceLines && referenceLines.length > 0) {
      layers.push(
        createReferenceLineLayer(referenceLines, layout) as BarLayer<BarDatum>
      );
    }
    if (targetData && targetData.length > 0) {
      layers.push(
        createTargetLayer(
          targetData,
          indexBy,
          visibleKeys,
          targetColor,
          layout
        ) as BarLayer<BarDatum>
      );
    }
    if (comparisonData && comparisonData.length > 0) {
      layers.push(
        createComparisonLayer(
          comparisonData,
          visibleKeys,
          indexBy,
          comparisonColor,
          layout
        ) as BarLayer<BarDatum>
      );
    }

    // Linked hover highlight from sibling charts
    if (interaction.linkedHover) {
      layers.push(createLinkedHoverBarLayer(interaction.linkedHover.hoveredIndex, interaction.linkedHover.sourceId, interaction.linkedHoverId) as BarLayer<BarDatum>);
    }

    layers.push("bars", "markers");
    layers.push("legends", "annotations");

    return layers;
  }, [
    thresholds,
    referenceLines,
    targetData,
    comparisonData,
    layout,
    indexBy,
    visibleKeys,
    targetColor,
    comparisonColor,
    interaction.linkedHover?.hoveredIndex,
    interaction.linkedHover?.sourceId,
    interaction.linkedHoverId,
  ]);

  // --- Responsive margins ---
  const isHorizontal = layout === "horizontal";

  // For horizontal layout, compute left margin from longest category label
  const horizontalLeftMargin = useMemo(() => {
    if (!isHorizontal) return 90;
    const labels = data.map((d) => String(d[indexBy]));
    const maxLen = labels.reduce((max, l) => Math.max(max, l.length), 0);
    // ~7px per character for the 10px mono font + 16px padding
    const estimated = maxLen * 7 + 16;
    // Cap at a reasonable max so labels don't take over the chart
    return Math.min(Math.max(estimated, 60), 180);
  }, [isHorizontal, data, indexBy]);

  const margin = useMemo(() => {
    if (isHorizontal) {
      return {
        top: denseValues.marginTop,
        right: containerWidth < 400 ? 16 : 32,
        bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
        left:
          containerWidth < 300 ? 60 : containerWidth < 400 ? 80 : yAxisLabel ? Math.max(horizontalLeftMargin, 110) : horizontalLeftMargin,
      };
    }
    return {
      top: denseValues.marginTop,
      right: containerWidth < 400 ? 8 : 16,
      bottom: xAxisLabel ? denseValues.marginBottomWithLabel : denseValues.marginBottom,
      left:
        containerWidth < 300
          ? 8
          : containerWidth < 400
            ? 36
            : yAxisLabel
              ? 72
              : 60,
    };
  }, [containerWidth, xAxisLabel, yAxisLabel, isHorizontal, horizontalLeftMargin, denseValues]);

  // --- Axis configs ---
  const valueAxisTicks = containerWidth < 500 ? 3 : 5;

  const axisBottom = useMemo(() => {
    if (isHorizontal) {
      // Value axis
      if (containerWidth < 300) return null;
      return {
        tickSize: 0,
        tickPadding: containerWidth < 400 ? 6 : 12,
        tickValues: valueAxisTicks,
        format: formatValueAxis,
        legend: containerWidth < 400 ? undefined : xAxisLabel,
        legendOffset: 38,
        legendPosition: "middle" as const,
      };
    }
    // Category axis
    return {
      tickSize: 0,
      tickPadding: 12,
      tickRotation: 0,
      tickValues: xTickValues,
      legend: xAxisLabel,
      legendOffset: 38,
      legendPosition: "middle" as const,
    };
  }, [
    isHorizontal,
    containerWidth,
    valueAxisTicks,
    formatValueAxis,
    xAxisLabel,
    xTickValues,
  ]);

  const axisLeft = useMemo(() => {
    if (isHorizontal) {
      // Category axis
      return {
        tickSize: 0,
        tickPadding: 12,
        tickRotation: 0,
        legend: yAxisLabel,
        legendOffset: -80,
        legendPosition: "middle" as const,
      };
    }
    // Value axis
    if (containerWidth < 300) return null;
    return {
      tickSize: 0,
      tickPadding: containerWidth < 400 ? 6 : 12,
      tickValues: valueAxisTicks,
      format: formatValueAxis,
      legend: containerWidth < 400 ? undefined : yAxisLabel,
      legendOffset: -52,
      legendPosition: "middle" as const,
    };
  }, [isHorizontal, containerWidth, valueAxisTicks, formatValueAxis, yAxisLabel]);

  // --- Color map for tooltip ---
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    keys.forEach((key, i) => {
      map.set(key, seriesStyles?.[key]?.color ?? seriesColors[i % seriesColors.length]);
    });
    return map;
  }, [keys, seriesStyles, seriesColors]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      keys.map((key, i) => {
        // Sum across all data points for this key
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
      <ChartContainer componentName="BarChart"
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
        <ResponsiveBar
          data={processedChartData}
          keys={visibleKeys}
          indexBy={indexBy}
          theme={nivoTheme}
          colors={colorFn}
          margin={margin}
          padding={padding}
          innerPadding={innerPaddingVal}
          groupMode={nivoGroupMode}
          layout={layout}
          borderRadius={groupMode === "stacked" || isPercent ? 0 : borderRadius}
          borderWidth={0}
          enableGridX={isHorizontal}
          enableGridY={!isHorizontal}
          enableLabel={enableLabels}
          labelSkipWidth={labelSkipWidth}
          labelSkipHeight={labelSkipHeight}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          label={(d: ComputedDatum<BarDatum>) =>
            d.value !== null
              ? isPercent
                ? `${Math.round(d.value)}%`
                : formatValue(d.value, format, localeDefaults)
              : ""
          }
          axisTop={null}
          axisRight={null}
          axisBottom={axisBottom}
          axisLeft={axisLeft}
          tooltip={({ indexValue }: BarTooltipProps<BarDatum>) => {
            // Emit to linked hover context
            if (interaction.linkedHover && barHoverRef.current !== indexValue) {
              barHoverRef.current = indexValue;
              setTimeout(() => interaction.linkedHover!.setHoveredIndex(indexValue, interaction.linkedHoverId), 0);
            }
            const row = chartData.find((d) => String(d[indexBy]) === String(indexValue));
            const tooltipFormat = isPercent ? ("percent" as FormatOption) : format;
            return (
              <ChartTooltip
                header={String(indexValue)}
                items={visibleKeys.map((key) => ({
                  color: colorMap.get(key) ?? "var(--muted)",
                  label: key,
                  value: row && row[key] != null
                    ? formatValue(Number(row[key]), tooltipFormat, localeDefaults)
                    : "\u2014",
                }))}
                actionHint={interaction.actionHint}
              />
            );
          }}
          animate={resolvedAnimate}
          motionConfig={resolvedAnimate ? config.motionConfig : undefined}
          layers={customLayers}
          onClick={
            (onBarClick || interaction.isInteractive)
              ? (datum: ComputedDatum<BarDatum> & { color: string }) => {
                  const event: BarClickEvent = {
                    id: datum.id,
                    value: datum.value,
                    label: String(datum.indexValue),
                    key: String(datum.id),
                    indexValue: datum.indexValue,
                  };
                  onBarClick?.(event);
                  interaction.handleClick({ title: String(datum.indexValue), value: datum.indexValue, key: String(datum.id), indexValue: datum.indexValue });
                }
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
export const BarChart = withErrorBoundary(BarChartInner, "BarChart");
(BarChart as any).__gridHint = "chart";
