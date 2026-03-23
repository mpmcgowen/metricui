"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { CrossFilterSelection, CrossFilterState } from "./interactionTypes";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CrossFilterCtx = createContext<CrossFilterState | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Read the cross-filter state from the nearest CrossFilterProvider.
 * Returns null if no provider is present — cross-filtering is opt-in.
 */
export function useCrossFilter(): CrossFilterState | null {
  return useContext(CrossFilterCtx);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface CrossFilterProviderProps {
  children: React.ReactNode;
}

/**
 * Shares cross-filter selection state across all child components.
 *
 * When a chart emits a selection (bar click, slice click, etc.),
 * sibling components can dim non-matching data to create a
 * cross-filtered dashboard experience.
 *
 * - Click the same item again to deselect (toggle behavior)
 * - Press Escape to clear the selection
 * - Selection state is exposed via `useCrossFilter()` for
 *   developer-side data refetching
 *
 * Usage:
 * ```tsx
 * <CrossFilterProvider>
 *   <BarChart crossFilter ... />
 *   <DonutChart crossFilter ... />
 *   <DataTable crossFilter ... />
 * </CrossFilterProvider>
 * ```
 */
export function CrossFilterProvider({ children }: CrossFilterProviderProps) {
  const [selection, setSelection] = useState<CrossFilterSelection | null>(null);

  const select = useCallback((next: CrossFilterSelection) => {
    setSelection((prev) => {
      // Toggle: clicking the same field+value deselects
      if (prev && prev.field === next.field && String(prev.value) === String(next.value)) {
        return null;
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelection(null);
  }, []);

  // Escape key clears the selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelection(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const isActive = selection !== null;

  const value = useMemo<CrossFilterState>(() => ({
    selection,
    select,
    clear,
    isActive,
  }), [selection, select, clear, isActive]);

  return (
    <CrossFilterCtx.Provider value={value}>
      {children}
    </CrossFilterCtx.Provider>
  );
}
