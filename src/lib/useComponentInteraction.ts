"use client";

import { useCallback, useMemo } from "react";
import { useDrillDownAction } from "@/components/ui/DrillDownPanel";
import { AutoDrillTable } from "@/components/ui/AutoDrillTable";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useLinkedHover, useLinkedHoverId } from "@/lib/LinkedHoverContext";
import { resolveActionHint } from "@/components/charts/ChartTooltip";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { DataRow, DrillDownConfig } from "@/lib/types";
import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComponentInteractionOptions {
  /**
   * DrillDown prop — accepts:
   * - `true` for auto-generated drill content
   * - A render function `(event) => ReactNode` for custom content
   * - Legacy `DrillDownConfig` ({ onClick }) for backwards compatibility
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drillDown?: true | ((event: any) => React.ReactNode) | DrillDownConfig;
  /** DrillDown panel mode */
  drillDownMode?: "slide-over" | "modal";
  /** CrossFilter prop from the component */
  crossFilter?: boolean | { field?: string };
  /** Default field name for cross-filter and drill-down */
  defaultField: string;
  /** Tooltip action hint */
  tooltipHint?: boolean | string;
  /** Raw data for auto drill table (charts pass exportData, tables pass their data) */
  data?: DataRow[];
  /** Specific cross-filter value this component represents (for KpiCards, single-value components) */
  crossFilterValue?: string | number;
}

export interface ComponentClickEvent {
  /** Display title for the drill panel header */
  title: string;
  /** Field name for filtering */
  field?: string;
  /** Value clicked */
  value: string | number;
  /** Any extra data to pass to drill-down render function */
  [key: string]: unknown;
}

export interface ComponentInteractionResult {
  /** Call this when a component element is clicked. Handles drill-down > crossFilter priority, including legacy DrillDownConfig. */
  handleClick: (event: ComponentClickEvent) => void;
  /** Resolved action hint string for tooltips (or undefined if no hint) */
  actionHint: string | undefined;
  /** Whether any click interaction is enabled (drillDown or crossFilter) */
  isInteractive: boolean;
  /** The resolved cross-filter field name (or undefined if cross-filter is off) */
  crossFilterField: string | undefined;
  /** Whether this component should be visually dimmed (a cross-filter selection is active but doesn't match this component's value) */
  isCrossFilterDimmed: boolean;
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
// Helpers
// ---------------------------------------------------------------------------

function isLegacyDrillDown(d: unknown): d is DrillDownConfig {
  return typeof d === "object" && d !== null && "onClick" in d;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Centralizes component interaction logic: drill-down, cross-filter,
 * linked hover, and tooltip action hints.
 *
 * Used by ALL visual dashboard components — charts, KPI cards, tables,
 * callouts. One interaction path, one behavior, every component.
 *
 * Handles:
 * - DrillDown priority: drillDown > crossFilter > onClick
 * - Legacy DrillDownConfig ({ onClick }) backwards compatibility
 * - Auto drill table generation for `drillDown={true}`
 * - Cross-filter field resolution
 * - Cross-filter dimming (isCrossFilterDimmed)
 * - Tooltip action hint resolution
 * - Linked hover context
 */
export function useComponentInteraction(opts: ComponentInteractionOptions): ComponentInteractionResult {
  const {
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField,
    tooltipHint,
    data,
    crossFilterValue,
  } = opts;

  const openDrill = useDrillDownAction();
  const crossFilter = useCrossFilter();
  const linkedHover = useLinkedHover();
  const linkedHoverId = useLinkedHoverId();
  const config = useMetricConfig();

  // Is this a legacy { onClick } pattern?
  const legacy = isLegacyDrillDown(drillDown);
  const modernDrillDown = legacy ? undefined : (drillDown as true | ((event: ComponentClickEvent) => React.ReactNode) | undefined);

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

  // Cross-filter dimming — for components that represent a specific value
  const isCrossFilterDimmed = useMemo(() => {
    if (!crossFilter?.isActive || !crossFilterField) return false;
    const sel = crossFilter.selection;
    if (!sel) return false;
    if (sel.field !== crossFilterField) return false;
    if (crossFilterValue !== undefined && String(sel.value) === String(crossFilterValue)) return false;
    return true;
  }, [crossFilter, crossFilterField, crossFilterValue]);

  // Unified click handler: legacy > modern drillDown > crossFilter
  const handleClick = useCallback(
    (event: ComponentClickEvent) => {
      // Legacy imperative pattern
      if (legacy && isLegacyDrillDown(drillDown)) {
        drillDown.onClick();
        return;
      }

      const field = event.field ?? defaultField;
      const value = event.value;

      if (modernDrillDown) {
        const content =
          modernDrillDown === true
            ? React.createElement(AutoDrillTable, {
                data: data ?? [],
                field,
                value: String(value),
              })
            : modernDrillDown(event);
        openDrill(
          { title: event.title, field: crossFilterField ?? field, value, mode: drillDownMode },
          content,
        );
      } else if (crossFilterProp && crossFilter && crossFilterField) {
        crossFilter.select({ field: crossFilterField, value });
      }
    },
    [legacy, drillDown, modernDrillDown, drillDownMode, crossFilterProp, crossFilter, crossFilterField, defaultField, data, openDrill],
  );

  return {
    handleClick,
    actionHint,
    isInteractive,
    crossFilterField,
    isCrossFilterDimmed,
    crossFilter,
    linkedHover,
    linkedHoverId,
    openDrill,
  };
}
