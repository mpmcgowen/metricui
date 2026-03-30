"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveFunnel } from "@nivo/funnel";
import type { FunnelDatum, FunnelPart, FunnelSvgProps } from "@nivo/funnel";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useChartLegend } from "@/lib/useChartLegend";
import { SERIES_COLORS } from "@/lib/chartColors";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { assertPeer } from "@/lib/peerCheck";
import type { LegendConfig } from "@/lib/chartTypes";
import type { DrillDownEvent, CardVariant, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FunnelDatumInput {
  /** Unique identifier for this stage */
  id: string;
  /** Display label for this stage */
  label: string;
  /** Value at this stage */
  value: number;
  /** Optional custom color for this stage */
  color?: string;
}

export type { LegendConfig };

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface FunnelChartProps extends DataComponentProps {
  data: FunnelDatumInput[];
  /** Simple data format — plain key-value object like { "Visited": 1000, "Signed Up": 400 }.
   *  Converted to FunnelDatumInput[] internally. `data` takes precedence when non-empty. */
  simpleData?: Record<string, number>;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for values in tooltips and labels */
  format?: FormatOption;
  /** Height in px. Default: 300 */
  height?: number;
  /** Funnel direction. Default: "vertical" */
  direction?: "vertical" | "horizontal";
  /** Interpolation between stages. Default: "smooth" */
  interpolation?: "smooth" | "linear";
  /** Gap between stages in px. Default: 4 */
  spacing?: number;
  /** Shape blending factor (0 = sharp rectangles, 1 = smooth funnel). Default: 0.66 */
  shapeBlending?: number;
  /** Fill opacity. Default: 1 */
  fillOpacity?: number;
  /** Border width. Default: 0 */
  borderWidth?: number;
  /** Show value labels on each stage. Default: true */
  enableLabel?: boolean;
  /** Show separators between stages. Default: true */
  enableSeparators?: boolean;
  /** Show conversion rates between stages. Default: false */
  showConversionRate?: boolean;
  /** Hover expansion size in px. Default: 10 */
  currentPartSizeExtension?: number;
  /** Series colors. Default: theme series palette */
  colors?: string[];
  /** Legend configuration. Default: hidden */
  legend?: boolean | LegendConfig;
  /** Emit cross-filter selection on part click. Defaults field to "id". */
  crossFilter?: boolean | { field?: string };
  /** Show action hint in tooltip. `true` = auto, custom string = override, `false` = off. Default: respect global config. */
  tooltipHint?: boolean | string;
  /** Click handler for funnel parts */
  onPartClick?: (part: {
    id: string;
    value: number;
    label: string;
    /** Percentage of first stage's value */
    percentage: number;
  }) => void;
  /** Drill-down content renderer. When set, clicking a part opens the drill-down panel. Takes priority over crossFilter for the click action.
   *  Pass `true` for an auto-generated detail table, or a function for custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Enable/disable chart animation. Default: true */
  animate?: boolean;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; chart?: string; /** Alias for `chart` */ body?: string; legend?: string };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FunnelChartInner = forwardRef<HTMLDivElement, FunnelChartProps>(function FunnelChart({
  data: dataProp = [],
  simpleData,
  title,
  subtitle,
  description,
  footnote,
  action,
  headline,
  format,
  height,
  direction = "vertical",
  interpolation = "smooth",
  spacing = 4,
  shapeBlending = 0.66,
  fillOpacity = 1,
  borderWidth = 0,
  enableLabel = true,
  enableSeparators = true,
  showConversionRate = false,
  currentPartSizeExtension = 10,
  colors: chartColors,
  legend: legendProp,
  crossFilter: crossFilterProp,
  tooltipHint,
  onPartClick,
  drillDown,
  drillDownMode,
  dense,
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
  assertPeer(ResponsiveFunnel, "@nivo/funnel", "Funnel");
  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: "id",
    tooltipHint,
    data: dataProp as unknown as DataRow[],
  });
  const ctx = useComponentConfig({ animate: animateProp, variant, height, dense });
  const { isDark, localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedDense, resolvedHeight } = ctx;

  // --- Resolve simpleData → full datum array ---
  const data: FunnelDatumInput[] = useMemo(() => {
    if (dataProp && dataProp.length > 0) return dataProp;
    if (simpleData && Object.keys(simpleData).length > 0) {
      return Object.entries(simpleData).map(([key, value]): FunnelDatumInput => ({
        id: key,
        label: key,
        value,
      }));
    }
    return dataProp;
  }, [dataProp, simpleData]);

  // --- Shared hooks ---
  const { containerRef, containerWidth, nivoTheme } = ctx;
  const allPartIds = useMemo(() => data.map((d) => d.id), [data]);
  const { hidden: hiddenParts, toggle: togglePart, legendConfig, allHidden } = useChartLegend(
    data.length,
    legendProp,
    { allIds: allPartIds },
  );

  // --- Colors ---
  const seriesColors = chartColors ?? config.colors;

  // --- Filter hidden parts ---
  const visibleData = useMemo(() => {
    return data.filter((d) => !hiddenParts.has(d.id));
  }, [data, hiddenParts]);

  // --- First stage value for percentage calculations ---
  const firstValue = visibleData.length > 0 ? visibleData[0].value : 0;

  // --- Color function ---
  const colorFn = useCallback(
    (datum: { id: string | number }) => {
      const item = data.find((d) => d.id === String(datum.id));
      if (item?.color) return item.color;
      const idx = data.findIndex((d) => d.id === String(datum.id));
      return seriesColors[(idx >= 0 ? idx : 0) % seriesColors.length];
    },
    [data, seriesColors],
  );

  // --- Margin ---
  const margin = useMemo(() => {
    if (direction === "horizontal") {
      return {
        top: 16,
        right: containerWidth < 400 ? 16 : 32,
        bottom: 16,
        left: containerWidth < 400 ? 16 : 32,
      };
    }
    return {
      top: 16,
      right: containerWidth < 300 ? 8 : 16,
      bottom: 16,
      left: containerWidth < 300 ? 8 : 16,
    };
  }, [containerWidth, direction]);

  // --- Legend items ---
  const legendItems = useMemo(
    () =>
      data.map((item, i) => ({
        id: item.id,
        label: item.label,
        color: item.color ?? seriesColors[i % seriesColors.length],
      })),
    [data, seriesColors],
  );

  // --- Conversion rate layer ---
  const conversionLayer = useMemo(() => {
    if (!showConversionRate) return null;
    return function ConversionRateLayer(props: { parts: FunnelPart<FunnelDatum>[] }) {
      const { parts } = props;
      if (parts.length < 2) return null;
      return (
        <g>
          {parts.slice(1).map((part, i) => {
            const prevPart = parts[i];
            const prevValue = prevPart.data.value;
            const curValue = part.data.value;
            const rate = prevValue > 0 ? Math.round((curValue / prevValue) * 100) : 0;

            if (direction === "horizontal") {
              const x = (prevPart.x1 + part.x0) / 2;
              const y = part.y0 - 8;
              return (
                <text
                  key={part.data.id}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="auto"
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fill: isDark ? "#6B7280" : "#9CA3AF",
                  }}
                >
                  {rate}%
                </text>
              );
            }

            const x = part.x1 + 12;
            const y = (prevPart.y1 + part.y0) / 2;
            return (
              <text
                key={part.data.id}
                x={x}
                y={y}
                textAnchor="start"
                dominantBaseline="central"
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fill: isDark ? "#6B7280" : "#9CA3AF",
                }}
              >
                {rate}%
              </text>
            );
          })}
        </g>
      );
    };
  }, [showConversionRate, direction, isDark]);

  // --- Layers ---
  const layers = useMemo(() => {
    const l: FunnelSvgProps<FunnelDatum>["layers"] = [
      "separators",
      "parts",
      "labels",
      "annotations",
    ];
    if (conversionLayer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      l.push(conversionLayer as any);
    }
    return l;
  }, [conversionLayer]);

  return (
    <div ref={containerRef} style={{ minWidth: 120, height: "100%" }}>
      <ChartContainer
        ref={ref}
        componentName="Funnel"
        shell={{
          title, subtitle, description, footnote, action, headline,
          variant: resolvedVariant, aiContext, loading, empty, error, stale,
          dense: resolvedDense,
          className: classNames?.root ?? className,
          classNames: classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined,
          id, "data-testid": dataTestId,
        }}
        height={resolvedHeight}
        exportData={dataProp as unknown as DataRow[]}
        below={<>
          {legendConfig && (
            <ChartLegend
              items={legendItems}
              hidden={hiddenParts}
              onToggle={togglePart}
              toggleable={legendConfig.toggleable !== false}
              className={classNames?.legend}
            />
          )}
        </>}
      >
        <div style={{ height: resolvedHeight }}>
          <ResponsiveFunnel
            data={visibleData as FunnelDatum[]}
            theme={nivoTheme}
            colors={colorFn}
            margin={margin}
            direction={direction}
            interpolation={interpolation}
            spacing={spacing}
            shapeBlending={shapeBlending}
            fillOpacity={fillOpacity}
            borderWidth={borderWidth}
            borderColor={{
              from: "color",
              modifiers: [["darker", isDark ? 0.6 : 0.2]],
            }}
            enableLabel={enableLabel}
            labelColor={{
              from: "color",
              modifiers: [[isDark ? "brighter" : "darker", 1.6]],
            }}
            enableBeforeSeparators={enableSeparators}
            enableAfterSeparators={enableSeparators}
            beforeSeparatorLength={enableSeparators ? 14 : 0}
            afterSeparatorLength={enableSeparators ? 14 : 0}
            beforeSeparatorOffset={enableSeparators ? 10 : 0}
            afterSeparatorOffset={enableSeparators ? 10 : 0}
            currentPartSizeExtension={currentPartSizeExtension}
            currentBorderWidth={borderWidth > 0 ? borderWidth + 1 : 0}
            valueFormat={(v: number) => formatValue(v, format, localeDefaults)}
            tooltip={({ part }: { part: FunnelPart<FunnelDatum> }) => {
              const pct = firstValue > 0
                ? ((part.data.value / firstValue) * 100).toFixed(1)
                : "0";
              return (
                <ChartTooltip
                  items={[
                    {
                      color: part.color,
                      label: String(part.data.label ?? part.data.id),
                      value: formatValue(part.data.value, format, localeDefaults),
                      secondary: `${pct}% of total`,
                    },
                  ]}
                  actionHint={interaction.actionHint}
                />
              );
            }}
            onClick={
              (onPartClick || interaction.isInteractive)
                ? (part) => {
                    const partLabel = String(part.data.label ?? part.data.id);
                    if (onPartClick) {
                      const pct = firstValue > 0
                        ? (part.data.value / firstValue) * 100
                        : 0;
                      onPartClick({
                        id: String(part.data.id),
                        value: part.data.value,
                        label: partLabel,
                        percentage: pct,
                      });
                    }
                    interaction.handleClick({ title: partLabel, value: String(part.data.id), id: String(part.data.id) });
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

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Funnel = withErrorBoundary(FunnelChartInner, "Funnel");
(Funnel as any).__gridHint = "chart"; // eslint-disable-line @typescript-eslint/no-explicit-any
