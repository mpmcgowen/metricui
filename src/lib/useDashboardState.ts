"use client";

import { useCallback } from "react";
import { useMetricFilters } from "./FilterContext";
import type { PeriodPreset, ComparisonMode } from "./FilterContext";
import { useCrossFilter } from "./CrossFilterContext";
import type { CrossFilterSelection } from "./interactionTypes";

// ---------------------------------------------------------------------------
// Serializable state shape
// ---------------------------------------------------------------------------

export interface DashboardStateSnapshot {
  /** Filter state */
  filter: {
    preset: PeriodPreset | null;
    period: { start: string; end: string } | null;
    comparisonMode: ComparisonMode;
    dimensions: Record<string, string[]>;
  };
  /** Cross-filter selection */
  crossFilter: CrossFilterSelection | null;
  /** Active tab (dev-managed — included in snapshot for convenience) */
  activeTab?: string | null;
  /** Arbitrary dev-defined state to include in the snapshot */
  custom?: Record<string, unknown>;
}

export interface UseDashboardStateResult {
  /** Current dashboard state as a JSON-safe snapshot */
  snapshot: () => DashboardStateSnapshot;
  /** Restore dashboard state from a snapshot */
  restore: (state: DashboardStateSnapshot) => void;
  /** Serialize current state to a compact URL-safe string */
  toSearchParam: () => string;
  /** Restore state from a URL search param string */
  fromSearchParam: (param: string) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Serialize and restore the entire dashboard interaction state.
 *
 * Returns `snapshot()` to capture the current state as a JSON-safe object,
 * and `restore()` to apply a previously captured snapshot. Use `toSearchParam()`
 * and `fromSearchParam()` for URL-based sharing.
 *
 * @example
 * ```tsx
 * const { snapshot, restore, toSearchParam, fromSearchParam } = useDashboardState();
 *
 * // Share as URL
 * const url = `${location.pathname}?view=${toSearchParam()}`;
 *
 * // Restore from URL on load
 * const params = new URLSearchParams(location.search);
 * if (params.has("view")) fromSearchParam(params.get("view")!);
 *
 * // Save to localStorage
 * localStorage.setItem("cfo-view", JSON.stringify(snapshot()));
 *
 * // Restore from localStorage
 * const saved = JSON.parse(localStorage.getItem("cfo-view")!);
 * restore(saved);
 * ```
 */
export function useDashboardState(): UseDashboardStateResult {
  const filters = useMetricFilters();
  const crossFilter = useCrossFilter();

  const snapshot = useCallback((): DashboardStateSnapshot => {
    const period = filters?.period
      ? { start: filters.period.start.toISOString(), end: filters.period.end.toISOString() }
      : null;

    return {
      filter: {
        preset: filters?.preset ?? null,
        period,
        comparisonMode: filters?.comparisonMode ?? "none",
        dimensions: filters?.dimensions ?? {},
      },
      crossFilter: crossFilter?.selection ?? null,
    };
  }, [filters, crossFilter]);

  const restore = useCallback(
    (state: DashboardStateSnapshot) => {
      if (!state) return;

      // --- Restore filters ---
      if (filters && state.filter) {
        const { preset, period, comparisonMode, dimensions } = state.filter;

        // Period: prefer preset (recalculates fresh), fall back to explicit dates
        if (preset) {
          filters.setPreset(preset);
        } else if (period) {
          filters.setCustomRange(new Date(period.start), new Date(period.end));
        }

        // Comparison mode
        if (comparisonMode) {
          filters.setComparisonMode(comparisonMode);
        }

        // Dimensions: clear all first, then set each
        if (dimensions) {
          // Clear existing dimensions not in the snapshot
          for (const field of Object.keys(filters.dimensions)) {
            if (!(field in dimensions)) {
              filters.clearDimension(field);
            }
          }
          // Set snapshot dimensions
          for (const [field, values] of Object.entries(dimensions)) {
            if (values.length > 0) {
              filters.setDimension(field, values);
            } else {
              filters.clearDimension(field);
            }
          }
        }
      }

      // --- Restore cross-filter ---
      if (crossFilter) {
        if (state.crossFilter) {
          crossFilter.select(state.crossFilter);
        } else {
          crossFilter.clear();
        }
      }
    },
    [filters, crossFilter],
  );

  const toSearchParam = useCallback((): string => {
    const state = snapshot();
    try {
      // Compact JSON → base64url (no padding, URL-safe)
      const json = JSON.stringify(state);
      if (typeof btoa === "function") {
        return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      // Node/SSR fallback
      return Buffer.from(json).toString("base64url");
    } catch {
      return "";
    }
  }, [snapshot]);

  const fromSearchParam = useCallback(
    (param: string) => {
      try {
        // Decode base64url → JSON
        const padded = param.replace(/-/g, "+").replace(/_/g, "/");
        let json: string;
        if (typeof atob === "function") {
          json = atob(padded);
        } else {
          json = Buffer.from(padded, "base64url").toString();
        }
        const state = JSON.parse(json) as DashboardStateSnapshot;
        restore(state);
      } catch {
        // Invalid param — silently ignore
      }
    },
    [restore],
  );

  return { snapshot, restore, toSearchParam, fromSearchParam };
}
