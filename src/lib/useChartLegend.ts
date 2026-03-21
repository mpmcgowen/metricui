"use client";

import { useState, useCallback, useMemo } from "react";
import type { LegendConfig } from "@/lib/chartTypes";

/**
 * Shared chart legend state hook.
 *
 * Manages hidden items set, toggle/solo callbacks, and legend config resolution.
 * Used by AreaChart, BarChart, DonutChart, and other chart components.
 *
 * Interactions:
 * - Click: toggle one series on/off
 * - Cmd/Ctrl+Click: solo — show only that series, hide all others.
 *   Cmd/Ctrl+click the soloed series again to restore all.
 */
export function useChartLegend(
  itemCount: number,
  legendProp?: boolean | LegendConfig,
  options?: {
    /** Show legend even for single-item data. Default: false (only multi-item shows legend) */
    alwaysShow?: boolean;
    /** All item IDs — needed for solo behavior. If not provided, solo is disabled. */
    allIds?: string[];
  }
) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const legendConfig: LegendConfig | null = useMemo(() => {
    if (legendProp === false) return null;
    if (legendProp === true || legendProp === undefined) {
      if (options?.alwaysShow || itemCount > 1) {
        return { position: "bottom", toggleable: true };
      }
      return null;
    }
    return legendProp;
  }, [legendProp, itemCount, options?.alwaysShow]);

  const toggle = useCallback((id: string, meta?: boolean) => {
    setHidden((prev) => {
      // --- Solo mode (Cmd/Ctrl+click) ---
      if (meta && options?.allIds) {
        const allIds = options.allIds;
        const othersHidden = allIds.filter((x) => x !== id).every((x) => prev.has(x));
        if (othersHidden) {
          // Already soloed on this item — restore all
          return new Set();
        }
        // Solo: hide everything except the clicked item
        return new Set(allIds.filter((x) => x !== id));
      }

      // --- Normal toggle ---
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [options?.allIds]);

  const isHidden = useCallback((id: string) => hidden.has(id), [hidden]);

  const allHidden = useMemo(() => {
    if (!options?.allIds) return hidden.size >= itemCount;
    return options.allIds.every((id) => hidden.has(id));
  }, [hidden, itemCount, options?.allIds]);

  return { hidden, toggle, isHidden, legendConfig, allHidden };
}
