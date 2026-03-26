"use client";

import { forwardRef, useMemo } from "react";
import { ResponsiveBullet } from "@nivo/bullet";
import type { Datum as NivoBulletDatum, BulletTooltipProps } from "@nivo/bullet";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import type { CardVariant, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";
import { assertPeer } from "@/lib/peerCheck";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BulletDatum {
  /** Unique identifier */
  id: string;
  /** Display title for this metric. Can be a ReactNode. */
  title?: React.ReactNode;
  /** Background ranges — typically [poor, satisfactory, good] thresholds.
   *  Values are cumulative endpoints: [150, 225, 300] means 0→150, 150→225, 225→300 */
  ranges: number[];
  /** Actual measured values — bars drawn on top of ranges. Usually one value. */
  measures: number[];
  /** Target markers — vertical lines showing goals/targets. */
  markers?: number[];
}

/** Simple shorthand for a single bullet item */
export interface SimpleBulletData {
  /** Label */
  label: string;
  /** Actual value */
  value: number;
  /** Target value — rendered as a marker */
  target?: number;
  /** Maximum value — defines the range. Default: auto from target or value * 1.2 */
  max?: number;
  /** Threshold zones as percentages of max. Default: [60, 80, 100] (three zones) */
  zones?: number[];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BulletChartProps extends DataComponentProps {
  /** Full bullet data — for complete control */
  data?: BulletDatum[];
  /** Simple data format — for the common "value vs target" case.
   *  `data` takes precedence when provided. */
  simpleData?: SimpleBulletData[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for values in tooltips. */
  format?: FormatOption;
  /** Height in px. Default: auto-calculated from item count. */
  height?: number;
  /** Layout direction. Default: "horizontal" */
  layout?: "horizontal" | "vertical";
  /** Gap between bullet items in px. Default: 40 */
  spacing?: number;
  /** Range color scheme. Default: theme-aware greens */
  rangeColors?: string[];
  /** Measure (bar) color scheme. Default: theme accent */
  measureColors?: string[];
  /** Marker color scheme. Default: theme foreground */
  markerColors?: string[];
  /** Size of the measure bar relative to the range (0-1). Default: 0.4 */
  measureSize?: number;
  /** Size of the marker relative to the range height. Default: 0.6 */
  markerSize?: number;
  /** Title position. Default: "before" */
  titlePosition?: "before" | "after";
  /** Show axis. Default: true */
  showAxis?: boolean;
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function simpleToNivo(items: SimpleBulletData[]): NivoBulletDatum[] {
  return items.map((item) => {
    const max = item.max ?? (item.target ? Math.max(item.target, item.value) * 1.2 : item.value * 1.2);
    const zones = item.zones ?? [60, 80, 100];
    const ranges = zones.map((pct) => (pct / 100) * max);
    return {
      id: item.label,
      title: item.label,
      ranges,
      measures: [item.value],
      markers: item.target !== undefined ? [item.target] : undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BulletChartInner = forwardRef<HTMLDivElement, BulletChartProps>(function BulletChart({
  data: dataProp = [],
  simpleData,
  title,
  subtitle,
  description,
  footnote,
  action,
  format,
  height: heightProp,
  layout = "horizontal",
  spacing = 24,
  rangeColors: rangeColorsProp,
  measureColors: measureColorsProp,
  markerColors: markerColorsProp,
  measureSize = 0.5,
  markerSize = 0.8,
  titlePosition = "before",
  showAxis = true,
  dense: denseProp,
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
  assertPeer(ResponsiveBullet, "@nivo/bullet", "BulletChart");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();

  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedDense = denseProp ?? config.dense;

  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Resolve and normalize data for readable axis labels ---
  const { data, scaleSuffix } = useMemo(() => {
    let raw: NivoBulletDatum[];
    if (dataProp && dataProp.length > 0) raw = dataProp as NivoBulletDatum[];
    else if (simpleData && simpleData.length > 0) raw = simpleToNivo(simpleData);
    else raw = dataProp as NivoBulletDatum[] ?? [];

    // Find the maximum value across all bullets to determine scale
    let maxVal = 0;
    for (const d of raw) {
      for (const v of d.ranges) maxVal = Math.max(maxVal, Math.abs(v));
      for (const v of d.measures) maxVal = Math.max(maxVal, Math.abs(v));
      if (d.markers) for (const v of d.markers) maxVal = Math.max(maxVal, Math.abs(v));
    }

    // Each bullet has its own scale, so normalize per-item
    const normalized = raw.map((d) => {
      let itemMax = 0;
      for (const v of d.ranges) itemMax = Math.max(itemMax, Math.abs(v));
      for (const v of d.measures) itemMax = Math.max(itemMax, Math.abs(v));
      if (d.markers) for (const v of d.markers) itemMax = Math.max(itemMax, Math.abs(v));

      let divisor = 1;
      let suffix = "";
      if (itemMax >= 1_000_000) { divisor = 1_000_000; suffix = "M"; }
      else if (itemMax >= 10_000) { divisor = 1_000; suffix = "K"; }

      if (divisor === 1) return d;

      return {
        ...d,
        ranges: d.ranges.map((v) => v / divisor),
        measures: d.measures.map((v) => v / divisor),
        markers: d.markers?.map((v) => v / divisor),
      };
    });

    // Determine a global suffix hint for the component (for display purposes)
    let globalSuffix = "";
    if (maxVal >= 1_000_000) globalSuffix = "M";
    else if (maxVal >= 10_000) globalSuffix = "K";

    return { data: normalized, scaleSuffix: globalSuffix };
  }, [dataProp, simpleData]);

  // --- Auto height based on item count ---
  const itemHeight = resolvedDense ? 36 : 48;
  const resolvedHeight = heightProp ?? Math.max(
    data.length * (itemHeight + spacing) - spacing + (showAxis ? 40 : 16),
    100
  );

  // --- Colors — subtle, theme-aware, matching our card/chart palette ---
  const rangeColors = rangeColorsProp ?? (isDark
    ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.10)"]
    : ["rgba(0,0,0,0.03)", "rgba(0,0,0,0.06)", "rgba(0,0,0,0.09)"]
  );
  const measureColors = measureColorsProp ?? [
    "var(--accent)",
  ];
  const markerColors = markerColorsProp ?? [
    isDark ? "#e8e8e5" : "#1a1a1a",
  ];

  // --- Margin ---
  const margin = useMemo(() => ({
    top: 8,
    right: containerWidth < 400 ? 16 : 32,
    bottom: showAxis ? 28 : 8,
    left: titlePosition === "before" ? (containerWidth < 400 ? 80 : 120) : 16,
  }), [containerWidth, showAxis, titlePosition]);

  return (
    <div ref={containerRef} style={{ minWidth: 120, height: "100%" }}>
      <ChartContainer
        ref={ref}
        id={id}
        data-testid={dataTestId}
        componentName="BulletChart"
        aiContext={aiContext}
        title={title}
        subtitle={subtitle}
        description={description}
        footnote={footnote}
        action={action}
        height={resolvedHeight}
        variant={resolvedVariant}

        dense={resolvedDense}
        className={classNames?.root ?? className}
        classNames={classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined}
        loading={loading}
        empty={empty}
        error={error}
        stale={stale}
      >
        <div style={{ height: resolvedHeight }}>
          <ResponsiveBullet
            data={data}
            theme={nivoTheme}
            layout={layout}
            spacing={spacing}
            margin={margin}
            titlePosition={titlePosition}
            titleAlign="end"
            titleOffsetX={-12}
            titleOffsetY={0}
            rangeColors={rangeColors}
            measureColors={measureColors}
            markerColors={markerColors}
            measureSize={measureSize}
            markerSize={markerSize}
            rangeBorderWidth={0}
            rangeBorderColor="transparent"
            measureBorderWidth={0}
            measureBorderColor="transparent"
            axisPosition={showAxis ? "after" : "before"}
            tooltip={({ v0, v1, color }: BulletTooltipProps) => {
              // Tooltip receives normalized values — format uses the original format prop
              // which handles the display correctly since we show compact values
              const suffix = scaleSuffix;
              const fmtTip = (v: number) => suffix ? `${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}` : formatValue(v, format, localeDefaults);
              return (
                <ChartTooltip
                  items={[{
                    color,
                    label: v1 !== undefined ? "Range" : "Value",
                    value: v1 !== undefined
                      ? `${fmtTip(v0)} – ${fmtTip(v1)}`
                      : fmtTip(v0),
                  }]}
                />
              );
            }}
            animate={resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
          />
        </div>
      </ChartContainer>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const BulletChart = withErrorBoundary(BulletChartInner, "BulletChart");
(BulletChart as any).__gridHint = "chart"; // eslint-disable-line @typescript-eslint/no-explicit-any
