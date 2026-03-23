"use client";

import { createContext, useContext, useState, useCallback, useMemo, useId } from "react";
import type { LinkedHoverState } from "./interactionTypes";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LinkedHoverCtx = createContext<LinkedHoverState | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Read the linked hover state from the nearest LinkedHoverProvider.
 * Returns null if no provider is present — linked hover is opt-in.
 */
export function useLinkedHover(): LinkedHoverState | null {
  return useContext(LinkedHoverCtx);
}

/**
 * Generate a stable component ID for linked hover source tracking.
 * Components use this to avoid reacting to their own hover emissions.
 */
export function useLinkedHoverId(): string {
  return useId();
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface LinkedHoverProviderProps {
  children: React.ReactNode;
}

/**
 * Shares hover state across all child components.
 *
 * When a chart emits a hover event (x-axis index or series ID),
 * all sibling charts/cards/tables can react — synced crosshairs,
 * row highlights, category emphasis.
 *
 * Usage:
 * ```tsx
 * <LinkedHoverProvider>
 *   <AreaChart ... />
 *   <BarChart ... />
 *   <KpiCard linkedIndex="Mar" ... />
 * </LinkedHoverProvider>
 * ```
 */
export function LinkedHoverProvider({ children }: LinkedHoverProviderProps) {
  const [hoveredIndex, setHoveredIndexState] = useState<string | number | null>(null);
  const [hoveredSeries, setHoveredSeriesState] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string | undefined>(undefined);

  const setHoveredIndex = useCallback((index: string | number | null, source?: string) => {
    setHoveredIndexState(index);
    setSourceId(source);
  }, []);

  const setHoveredSeries = useCallback((seriesId: string | null, source?: string) => {
    setHoveredSeriesState(seriesId);
    setSourceId(source);
  }, []);

  const value = useMemo<LinkedHoverState>(() => ({
    hoveredIndex,
    hoveredSeries,
    sourceId,
    setHoveredIndex,
    setHoveredSeries,
  }), [hoveredIndex, hoveredSeries, sourceId, setHoveredIndex, setHoveredSeries]);

  return (
    <LinkedHoverCtx.Provider value={value}>
      {children}
    </LinkedHoverCtx.Provider>
  );
}
