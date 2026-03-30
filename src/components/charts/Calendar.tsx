"use client";

import { forwardRef, useMemo } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import type { CalendarDatum, CalendarTooltipProps } from "@nivo/calendar";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { useComponentInteraction } from "@/lib/useComponentInteraction";
import { formatValue, type FormatOption } from "@/lib/format";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { assertPeer } from "@/lib/peerCheck";
import type { DrillDownEvent, CardVariant, DataRow, DataComponentProps, EmptyState, ErrorState, StaleState } from "@/lib/types";

// ---------------------------------------------------------------------------
// Click event payload
// ---------------------------------------------------------------------------

export interface CalendarClickEvent {
  day: string;
  value: number;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CalendarProps extends DataComponentProps {
  /** Nivo CalendarDatum[] or flat DataRow[]. */
  data?: CalendarDatum[] | DataRow[];
  /** Column name for the date when using flat rows. */
  dateField?: string;
  /** Column name for the value when using flat rows. */
  valueField?: string;
  /** Start date (YYYY-MM-DD). Auto-derived from data if omitted. */
  from?: string;
  /** End date (YYYY-MM-DD). Auto-derived from data if omitted. */
  to?: string;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Height in px. Default: 200 */
  height?: number;
  /** Sequential color scale for the heatmap cells. */
  colors?: string[];
  /** Color for days with no data. */
  emptyColor?: string;
  /** Value format for tooltips. */
  format?: FormatOption;
  /** Calendar direction. Default: "horizontal" */
  direction?: "horizontal" | "vertical";
  /** Enable/disable animation. Default: true */
  animate?: boolean;
  /** Click handler for a day cell. */
  onDayClick?: (event: CalendarClickEvent) => void;
  /** Drill-down. `true` auto-generates a filtered table; function for custom content. */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over" */
  drillDownMode?: "slide-over" | "modal";
  /** Enable cross-filtering. `true` uses dateField as the field, or pass `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
  /** Tooltip action hint. `true` = auto, string = custom, `false` = off. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides. */
  classNames?: { root?: string; header?: string; chart?: string; body?: string; footnote?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isCalendarDatum(row: Record<string, unknown>): row is CalendarDatum {
  return typeof row.day === "string" && typeof row.value === "number";
}

function toCalendarData(
  data: CalendarDatum[] | DataRow[],
  dateField: string,
  valueField: string,
): CalendarDatum[] {
  if (data.length === 0) return [];
  // Already in Nivo format?
  if (isCalendarDatum(data[0] as Record<string, unknown>)) {
    return data as CalendarDatum[];
  }
  return (data as DataRow[]).map((r) => ({
    day: String(r[dateField]),
    value: Number(r[valueField]),
  }));
}

function deriveDateRange(data: CalendarDatum[]): { from: string; to: string } {
  if (data.length === 0) {
    const today = new Date().toISOString().slice(0, 10);
    return { from: today, to: today };
  }
  const days = data.map((d) => d.day).sort();
  return { from: days[0], to: days[days.length - 1] };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CalendarInner = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const {
    data: rawData = [],
    dateField = "day",
    valueField = "value",
    from: fromProp,
    to: toProp,
    title,
    subtitle,
    description,
    footnote,
    action,
    height,
    colors: colorsProp,
    emptyColor: emptyColorProp,
    format,
    direction = "horizontal",
    animate: animateProp,
    onDayClick,
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    tooltipHint,
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
    dense,
    headline,
  } = props;

  assertPeer(ResponsiveCalendar, "@nivo/calendar", "Calendar");

  const ctx = useComponentConfig({ animate: animateProp, variant, height: height ?? 200, dense });
  const { isDark, localeDefaults, config, resolvedAnimate, resolvedVariant, denseValues, resolvedHeight } = ctx;
  const interaction = useComponentInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: dateField,
    tooltipHint,
    data: rawData as DataRow[],
  });

  // --- Data transform ---
  const calendarData = useMemo(
    () => toCalendarData(rawData, dateField, valueField),
    [rawData, dateField, valueField],
  );

  const { from, to } = useMemo(() => {
    const derived = deriveDateRange(calendarData);
    return {
      from: fromProp ?? derived.from,
      to: toProp ?? derived.to,
    };
  }, [calendarData, fromProp, toProp]);

  // --- Colors ---
  const defaultColors = isDark
    ? ["#1a3a2a", "#2d6a4f", "#40916c", "#52b788", "#74c69d"]
    : ["#d8f3dc", "#b7e4c7", "#95d5b2", "#74c69d", "#52b788"];
  const colors = colorsProp ?? config.colors?.slice(0, 5) ?? defaultColors;
  const emptyColor = emptyColorProp ?? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)");

  // --- Chart theme ---
  const { containerRef, containerWidth, nivoTheme } = ctx;

  // --- Margin ---
  const margin = useMemo(
    () => ({ top: 20, right: 20, bottom: 20, left: 20 }),
    [],
  );

  return (
    <div
      ref={ref}
      style={{ minWidth: 120, height: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%" }}>
        <ChartContainer
          componentName="Calendar"
          shell={{
            title, subtitle, description, footnote, action, headline,
            variant: resolvedVariant, aiContext, loading, empty, error, stale,
            dense,
            className: classNames?.root ?? className,
            classNames: classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart, footnote: classNames.footnote } : undefined,
            id, "data-testid": dataTestId,
          }}
          height={resolvedHeight}
          exportData={calendarData as unknown as DataRow[]}
        >
          <ResponsiveCalendar
            data={calendarData}
            from={from}
            to={to}
            theme={nivoTheme}
            colors={colors}
            emptyColor={emptyColor}
            direction={direction}
            margin={margin}
            yearSpacing={40}
            monthBorderColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
            dayBorderWidth={1}
            dayBorderColor={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            tooltip={({ day, value, color }: CalendarTooltipProps) => {
              return (
                <ChartTooltip
                  header={day}
                  items={[
                    {
                      color: color,
                      label: valueField,
                      value: value !== undefined && value !== null
                        ? formatValue(Number(value), format, localeDefaults)
                        : "\u2014",
                    },
                  ]}
                  actionHint={interaction.actionHint}
                />
              );
            }}
            onClick={(datum) => {
              const event: CalendarClickEvent = {
                day: datum.day,
                value: Number("value" in datum ? datum.value : 0) || 0,
              };
              onDayClick?.(event);
              interaction.handleClick({ title: datum.day, value: datum.day, field: dateField });
            }}
          />
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Calendar = withErrorBoundary(CalendarInner, "Calendar");
(Calendar as any).__gridHint = "chart"; // eslint-disable-line @typescript-eslint/no-explicit-any
