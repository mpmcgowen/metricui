"use client";

import { useMemo } from "react";
import { useMetricFilters } from "./FilterContext";
import { useCrossFilter } from "./CrossFilterContext";
import type { DateRange } from "./FilterContext";
import type { DataRow } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseFilteredDataOptions {
  /** Field name containing a date string (ISO/YYYY-MM/YYYY-MM-DD) or Date object for period filtering */
  dateField?: string;
  /** Field names to filter by dimensions (reads active values from FilterContext automatically) */
  dimensionFields?: string[];
  /** Field name for cross-filter matching */
  crossFilterField?: string;
}

export interface UseFilteredDataResult<T> {
  /** Data filtered by period + dimensions + cross-filter */
  filtered: T[];
  /** Data from comparison period (null if no comparison active) */
  comparison: T[] | null;
  /** Whether any filters are currently active */
  isFiltered: boolean;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Parse a row's date field into a comparable Date range.
 * Supports:
 *   - Date objects
 *   - ISO strings ("2024-03-15T00:00:00Z")
 *   - "YYYY-MM-DD" date strings
 *   - "YYYY-MM" month strings (treated as the full month range)
 */
function parseDateValue(value: unknown): { start: Date; end: Date } | null {
  if (value instanceof Date) {
    return { start: value, end: value };
  }
  if (typeof value !== "string" || !value) return null;

  // "YYYY-MM" month format
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [y, m] = value.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59, 999);
    return { start, end };
  }

  // ISO or YYYY-MM-DD — parse to a single point in time
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return { start: d, end: d };
}

function dateInRange(value: unknown, range: DateRange): boolean {
  const parsed = parseDateValue(value);
  if (!parsed) return true; // if unparseable, keep the row
  return parsed.end >= range.start && parsed.start <= range.end;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Convenience hook that applies period, dimension, and cross-filter filtering
 * in one call — eliminating the ~60-line boilerplate pattern repeated in every demo.
 *
 * Reads from the nearest `FilterProvider` and `CrossFilterProvider` automatically.
 * When no providers are present, returns the original data unchanged.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { filtered, comparison, isFiltered } = useFilteredData(accounts, {
 *     dateField: "joinMonth",
 *     dimensionFields: ["industry", "country"],
 *     crossFilterField: "country",
 *   });
 *   const data = useMemo(() => deriveData(filtered), [filtered]);
 *   const compData = useMemo(() => comparison ? deriveData(comparison) : null, [comparison]);
 * }
 * ```
 */
export function useFilteredData<T extends DataRow>(
  data: T[],
  options?: UseFilteredDataOptions,
): UseFilteredDataResult<T> {
  const filters = useMetricFilters();
  const cf = useCrossFilter();

  // Auto-detect date field if not specified — look for common date column names
  const autoDateField = useMemo(() => {
    if (options?.dateField) return options.dateField;
    if (!data.length) return undefined;
    const firstRow = data[0];
    const dateNames = ["date", "day", "month", "week", "period", "timestamp", "createdAt", "created_at"];
    for (const name of dateNames) {
      if (name in firstRow) return name;
    }
    // Check for any field with a date-like value
    for (const [key, val] of Object.entries(firstRow)) {
      if (val instanceof Date) return key;
      if (typeof val === "string" && /^\d{4}-\d{2}(-\d{2})?/.test(val)) return key;
    }
    return undefined;
  }, [data, options?.dateField]);

  // Auto-use all active dimension filters if no specific fields given
  const autoDimensionFields = useMemo(() => {
    if (options?.dimensionFields) return options.dimensionFields;
    if (!filters?.dimensions) return undefined;
    const active = Object.keys(filters.dimensions).filter(
      (k) => filters.dimensions[k] && filters.dimensions[k].length > 0,
    );
    return active.length > 0 ? active : undefined;
  }, [options?.dimensionFields, filters?.dimensions]);

  // Auto-use cross-filter field from active selection
  const autoCrossFilterField = useMemo(() => {
    if (options?.crossFilterField) return options.crossFilterField;
    return cf?.selection?.field;
  }, [options?.crossFilterField, cf?.selection?.field]);

  const dateField = autoDateField;
  const dimensionFields = autoDimensionFields;
  const crossFilterField = autoCrossFilterField;

  // Step 1: Period filter
  const byPeriod = useMemo(() => {
    if (!dateField || !filters?.period) return data;
    return data.filter((row) => dateInRange(row[dateField], filters.period!));
  }, [data, dateField, filters?.period]);

  // Step 2: Dimension filters
  const byDimensions = useMemo(() => {
    if (!dimensionFields || !filters?.dimensions) return byPeriod;

    let result = byPeriod;
    for (const field of dimensionFields) {
      const values = filters.dimensions[field];
      if (values && values.length > 0) {
        result = result.filter((row) => values.includes(String(row[field])));
      }
    }
    return result;
  }, [byPeriod, dimensionFields, filters?.dimensions]);

  // Step 3: Cross-filter
  const filtered = useMemo(() => {
    if (!crossFilterField || !cf?.isActive || cf.selection?.field !== crossFilterField) {
      return byDimensions;
    }
    return byDimensions.filter(
      (row) => String(row[crossFilterField]) === String(cf.selection!.value),
    );
  }, [byDimensions, crossFilterField, cf?.isActive, cf?.selection]);

  // Comparison period: same dimension + cross-filter logic, different date range
  const comparison = useMemo(() => {
    if (!filters?.comparisonPeriod) return null;

    // Start from full data with comparison period filter
    let comp: T[];
    if (dateField) {
      comp = data.filter((row) => dateInRange(row[dateField], filters.comparisonPeriod!));
    } else {
      // No date field — comparison makes no sense without date filtering
      return null;
    }

    // Apply same dimension filters
    if (dimensionFields && filters.dimensions) {
      for (const field of dimensionFields) {
        const values = filters.dimensions[field];
        if (values && values.length > 0) {
          comp = comp.filter((row) => values.includes(String(row[field])));
        }
      }
    }

    // Apply same cross-filter
    if (crossFilterField && cf?.isActive && cf.selection?.field === crossFilterField) {
      comp = comp.filter(
        (row) => String(row[crossFilterField]) === String(cf.selection!.value),
      );
    }

    return comp;
  }, [
    data, dateField, dimensionFields, crossFilterField,
    filters?.comparisonPeriod, filters?.dimensions,
    cf?.isActive, cf?.selection,
  ]);

  // Compute isFiltered
  const isFiltered = useMemo(() => {
    if (filters?.period) return true;
    if (dimensionFields && filters?.dimensions) {
      for (const field of dimensionFields) {
        if (filters.dimensions[field]?.length > 0) return true;
      }
    }
    if (crossFilterField && cf?.isActive && cf.selection?.field === crossFilterField) {
      return true;
    }
    return false;
  }, [filters?.period, filters?.dimensions, dimensionFields, crossFilterField, cf?.isActive, cf?.selection]);

  return { filtered, comparison, isFiltered };
}
