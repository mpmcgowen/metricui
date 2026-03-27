"use client";

import { useCallback, useMemo } from "react";
import { useDrillDownAction } from "@/components/ui/DrillDownPanel";
import { AutoDrillTable } from "@/components/ui/AutoDrillTable";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useLinkedHover, useLinkedHoverId } from "@/lib/LinkedHoverContext";
import { resolveActionHint } from "@/components/charts/ChartTooltip";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { DataRow } from "@/lib/types";
import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChartInteractionOptions {
  /** DrillDown prop from the chart component */
  drillDown?: true | ((event: ChartClickEvent) => React.ReactNode);
  /** DrillDown panel mode */
  drillDownMode?: "slide-over" | "modal";
  /** CrossFilter prop from the chart component */
  crossFilter?: boolean | { field?: string };
  /** Default field name for cross-filter (usually the index/id field) */
  defaultField: string;
  /** Tooltip hint prop from the chart component */
  tooltipHint?: boolean | string;
  /** Raw data for auto drill table */
  data?: DataRow[];
}

export interface ChartClickEvent {
  /** Display title for the drill panel header */
  title: string;
  /** Field name for filtering */
  field?: string;
  /** Value clicked */
  value: string | number;
  /** Any extra data to pass to drill-down render function */
  [key: string]: unknown;
}

export interface ChartInteractionResult {
  /** Call this when a chart element is clicked. Handles drill-down vs cross-filter priority. */
  handleClick: (event: ChartClickEvent) => void;
  /** Resolved action hint string for tooltips (or undefined if no hint) */
  actionHint: string | undefined;
  /** Whether any click interaction is enabled */
  isInteractive: boolean;
  /** The resolved cross-filter field name (or undefined if cross-filter is off) */
  crossFilterField: string | undefined;
  /** The cross-filter context (for reading selection state) */
  crossFilter: ReturnType<typeof useCrossFilter>;
  /** Linked hover context */
  linkedHover: ReturnType<typeof useLinkedHover>;
  /** Linked hover ID for this component instance */
  linkedHoverId: string;
  /** The openDrill function for advanced usage */
  openDrill: ReturnType<typeof useDrillDownAction>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Centralizes chart interaction logic: drill-down, cross-filter, linked hover,
 * and tooltip action hints. Replaces 6 separate hook calls and the click
 * handler priority logic that was duplicated across 14 chart components.
 *
 * @example
 * ```tsx
 * const interaction = useChartInteraction({
 *   drillDown, drillDownMode, crossFilter: crossFilterProp,
 *   tooltipHint, defaultField: indexBy, data: exportData,
 * });
 *
 * // In click handler:
 * interaction.handleClick({ title: "January", value: "Jan" });
 *
 * // In tooltip:
 * <ChartTooltip actionHint={interaction.actionHint} ... />
 * ```
 */
export function useChartInteraction(opts: ChartInteractionOptions): ChartInteractionResult {
  const {
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField,
    tooltipHint,
    data,
  } = opts;

  const openDrill = useDrillDownAction();
  const crossFilter = useCrossFilter();
  const linkedHover = useLinkedHover();
  const linkedHoverId = useLinkedHoverId();
  const config = useMetricConfig();

  // Resolve cross-filter field
  const crossFilterField = useMemo(
    () =>
      crossFilterProp
        ? (typeof crossFilterProp === "object" ? crossFilterProp.field : undefined) ?? defaultField
        : undefined,
    [crossFilterProp, defaultField],
  );

  // Resolve tooltip action hint
  const actionHint = useMemo(
    () => resolveActionHint(tooltipHint, config.tooltipHint, !!drillDown, !!crossFilterProp),
    [tooltipHint, config.tooltipHint, drillDown, crossFilterProp],
  );

  const isInteractive = !!drillDown || !!(crossFilterProp && crossFilter);

  // Unified click handler with drillDown > crossFilter priority
  const handleClick = useCallback(
    (event: ChartClickEvent) => {
      const field = event.field ?? defaultField;
      const value = event.value;

      if (drillDown) {
        const content =
          drillDown === true
            ? React.createElement(AutoDrillTable, {
                data: data ?? [],
                field,
                value: String(value),
              })
            : drillDown(event);
        openDrill(
          { title: event.title, field: crossFilterField ?? field, value, mode: drillDownMode },
          content,
        );
      } else if (crossFilterProp && crossFilter && crossFilterField) {
        crossFilter.select({ field: crossFilterField, value });
      }
    },
    [drillDown, drillDownMode, crossFilterProp, crossFilter, crossFilterField, defaultField, data, openDrill],
  );

  return {
    handleClick,
    actionHint,
    isInteractive,
    crossFilterField,
    crossFilter,
    linkedHover,
    linkedHoverId,
    openDrill,
  };
}
