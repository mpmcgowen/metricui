"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DateRange {
  start: Date;
  end: Date;
}

export type PeriodPreset = "7d" | "14d" | "30d" | "90d" | "month" | "quarter" | "ytd" | "year" | "all";

export type ComparisonMode = "previous" | "year-over-year" | "none";

export interface FilterState {
  /** Active date range */
  period: DateRange | null;
  /** Which preset is active (null if custom range) */
  preset: PeriodPreset | null;
  /** Comparison mode */
  comparisonMode: ComparisonMode;
  /** Computed comparison date range (auto-calculated from period + mode) */
  comparisonPeriod: DateRange | null;
  /** Active dimension filters — key is field name, value is selected values */
  dimensions: Record<string, string[]>;
}

export interface FilterActions {
  /** Set the active period */
  setPeriod: (range: DateRange, preset?: PeriodPreset) => void;
  /** Set period from a preset */
  setPreset: (preset: PeriodPreset) => void;
  /** Set a custom date range */
  setCustomRange: (start: Date, end: Date) => void;
  /** Change comparison mode */
  setComparisonMode: (mode: ComparisonMode) => void;
  /** Set a dimension filter */
  setDimension: (field: string, values: string[]) => void;
  /** Clear a dimension filter */
  clearDimension: (field: string) => void;
  /** Clear all filters */
  clearAll: () => void;
}

export type FilterContextValue = FilterState & FilterActions;

// ---------------------------------------------------------------------------
// Preset calculations
// ---------------------------------------------------------------------------

function presetToRange(preset: PeriodPreset, referenceDate?: Date): DateRange {
  const now = referenceDate ?? new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (preset) {
    case "7d": {
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "14d": {
      const start = new Date(end);
      start.setDate(start.getDate() - 13);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "30d": {
      const start = new Date(end);
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "90d": {
      const start = new Date(end);
      start.setDate(start.getDate() - 89);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end };
    }
    case "quarter": {
      const qMonth = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), qMonth, 1);
      return { start, end };
    }
    case "ytd": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end };
    }
    case "year": {
      const start = new Date(end);
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(start.getDate() + 1);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "all":
      return { start: new Date(0), end };
    default:
      return { start: new Date(end.getTime() - 30 * 86400000), end };
  }
}

function computeComparisonPeriod(
  period: DateRange,
  mode: ComparisonMode
): DateRange | null {
  if (mode === "none") return null;

  const durationMs = period.end.getTime() - period.start.getTime();

  if (mode === "previous") {
    // Previous period of same length, ending the day before current starts
    const end = new Date(period.start);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
    const start = new Date(end);
    start.setDate(start.getDate() - durationDays + 1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }

  if (mode === "year-over-year") {
    // Same dates, one year earlier
    const start = new Date(period.start);
    start.setFullYear(start.getFullYear() - 1);
    const end = new Date(period.end);
    end.setFullYear(end.getFullYear() - 1);
    return { start, end };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Preset labels
// ---------------------------------------------------------------------------

export const PRESET_LABELS: Record<PeriodPreset, string> = {
  "7d": "Last 7 days",
  "14d": "Last 14 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  month: "This month",
  quarter: "This quarter",
  ytd: "Year to date",
  year: "Last 12 months",
  all: "All time",
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DEFAULT_FILTER_STATE: FilterState = {
  period: null,
  preset: null,
  comparisonMode: "none",
  comparisonPeriod: null,
  dimensions: {},
};

const FilterCtx = createContext<FilterContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Read the active filter state from the nearest FilterProvider.
 * Returns null if no FilterProvider is present — filters are optional.
 */
export function useMetricFilters(): FilterContextValue | null {
  return useContext(FilterCtx);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface FilterProviderProps {
  /** Initial preset. Default: none (no period selected) */
  defaultPreset?: PeriodPreset;
  /** Initial comparison mode. Default: "none" */
  defaultComparison?: ComparisonMode;
  /**
   * Reference date for computing preset ranges. Default: now.
   * Useful for demos or tests with historical data.
   */
  referenceDate?: Date;
  children: React.ReactNode;
}

export function FilterProvider({
  defaultPreset,
  defaultComparison = "none",
  referenceDate,
  children,
}: FilterProviderProps) {
  const [period, setPeriodState] = useState<DateRange | null>(
    defaultPreset ? presetToRange(defaultPreset, referenceDate) : null
  );
  const [preset, setPresetState] = useState<PeriodPreset | null>(defaultPreset ?? null);
  const [comparisonMode, setComparisonModeState] = useState<ComparisonMode>(defaultComparison);
  const [dimensions, setDimensions] = useState<Record<string, string[]>>({});

  // Computed comparison period
  const comparisonPeriod = useMemo(
    () => (period ? computeComparisonPeriod(period, comparisonMode) : null),
    [period, comparisonMode]
  );

  // Actions
  const setPeriod = useCallback((range: DateRange, p?: PeriodPreset) => {
    setPeriodState(range);
    setPresetState(p ?? null);
  }, []);

  const setPreset = useCallback((p: PeriodPreset) => {
    const range = presetToRange(p, referenceDate);
    setPeriodState(range);
    setPresetState(p);
  }, [referenceDate]);

  const setCustomRange = useCallback((start: Date, end: Date) => {
    setPeriodState({ start, end });
    setPresetState(null);
  }, []);

  const setComparisonMode = useCallback((mode: ComparisonMode) => {
    setComparisonModeState(mode);
  }, []);

  const setDimension = useCallback((field: string, values: string[]) => {
    setDimensions(prev => ({ ...prev, [field]: values }));
  }, []);

  const clearDimension = useCallback((field: string) => {
    setDimensions(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setPeriodState(defaultPreset ? presetToRange(defaultPreset, referenceDate) : null);
    setPresetState(defaultPreset ?? null);
    setComparisonModeState(defaultComparison);
    setDimensions({});
  }, [defaultPreset, defaultComparison, referenceDate]);

  const value = useMemo<FilterContextValue>(() => ({
    period,
    preset,
    comparisonMode,
    comparisonPeriod,
    dimensions,
    setPeriod,
    setPreset,
    setCustomRange,
    setComparisonMode,
    setDimension,
    clearDimension,
    clearAll,
  }), [
    period, preset, comparisonMode, comparisonPeriod, dimensions,
    setPeriod, setPreset, setCustomRange, setComparisonMode,
    setDimension, clearDimension, clearAll,
  ]);

  return (
    <FilterCtx.Provider value={value}>
      {children}
    </FilterCtx.Provider>
  );
}
