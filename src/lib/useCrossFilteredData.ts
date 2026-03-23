"use client";

import { useMemo } from "react";
import { useCrossFilter } from "./CrossFilterContext";

/**
 * Convenience hook that filters an array based on the active cross-filter selection.
 *
 * - If no CrossFilterProvider is present, returns the original data unchanged.
 * - If a selection is active but the field doesn't match, returns the original data.
 * - If the selection matches, returns only rows where `row[field] === selection.value`.
 *
 * @param data - The full unfiltered dataset
 * @param field - The field name to match against the cross-filter selection
 * @returns The filtered (or original) data array
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const data = useCrossFilteredData(allAccounts, "country");
 *   // When "US" is selected, data = allAccounts.filter(a => a.country === "US")
 *   // When nothing is selected, data = allAccounts
 *   return <BarChart data={data} index="country" categories={["revenue"]} />;
 * }
 * ```
 */
export function useCrossFilteredData<T extends Record<string, unknown>>(
  data: T[],
  field: string,
): T[] {
  const cf = useCrossFilter();

  return useMemo(() => {
    if (!cf?.isActive || cf.selection?.field !== field) return data;
    const selected = cf.selection.value;
    return data.filter((row) => String(row[field]) === String(selected));
  }, [data, field, cf?.isActive, cf?.selection]);
}
