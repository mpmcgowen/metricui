import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredData } from "@/lib/useFilteredData";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { MetricProvider } from "@/lib/MetricProvider";
import { useEffect, useRef, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const DATA = [
  { id: 1, date: "2025-01-15", region: "US", revenue: 100 },
  { id: 2, date: "2025-01-20", region: "EU", revenue: 200 },
  { id: 3, date: "2025-02-10", region: "US", revenue: 150 },
  { id: 4, date: "2025-02-15", region: "EU", revenue: 250 },
  { id: 5, date: "2025-03-01", region: "US", revenue: 175 },
  { id: 6, date: "2025-03-15", region: "EU", revenue: 300 },
  { id: 7, date: "2024-03-15", region: "US", revenue: 80 },  // previous year
  { id: 8, date: "2024-03-20", region: "EU", revenue: 120 }, // previous year
];

// ---------------------------------------------------------------------------
// Wrapper helpers
// ---------------------------------------------------------------------------

function Bare({ children }: { children: ReactNode }) {
  return <MetricProvider>{children}</MetricProvider>;
}

function WithFilters({ children, preset }: { children: ReactNode; preset?: "7d" | "30d" | "90d" }) {
  return (
    <MetricProvider>
      <FilterProvider defaultPreset={preset}>
        <CrossFilterProvider>{children}</CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

/** Wrapper that sets a dimension filter on mount */
function WithDimension({
  children,
  field,
  values,
}: {
  children: ReactNode;
  field: string;
  values: string[];
}) {
  return (
    <MetricProvider>
      <FilterProvider>
        <CrossFilterProvider>
          <DimensionSetter field={field} values={values}>
            {children}
          </DimensionSetter>
        </CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

function DimensionSetter({
  children,
  field,
  values,
}: {
  children: ReactNode;
  field: string;
  values: string[];
}) {
  const filters = useMetricFilters();
  const applied = useRef(false);
  useEffect(() => {
    if (filters && !applied.current) {
      applied.current = true;
      filters.setDimension(field, values);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{children}</>;
}

/** Wrapper that sets a cross-filter selection on mount */
function WithCrossFilter({
  children,
  field,
  value,
}: {
  children: ReactNode;
  field: string;
  value: string;
}) {
  return (
    <MetricProvider>
      <FilterProvider>
        <CrossFilterProvider>
          <CrossFilterSetter field={field} value={value}>
            {children}
          </CrossFilterSetter>
        </CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

function CrossFilterSetter({
  children,
  field,
  value,
}: {
  children: ReactNode;
  field: string;
  value: string;
}) {
  const cf = useCrossFilter();
  const applied = useRef(false);
  useEffect(() => {
    if (cf && !applied.current) {
      applied.current = true;
      cf.select({ field, value });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useFilteredData", () => {
  it("returns unfiltered data when no providers are present", () => {
    const { result } = renderHook(
      () => useFilteredData(DATA, { dateField: "date", dimensionFields: ["region"] }),
      { wrapper: Bare },
    );
    // No FilterProvider = no filtering
    expect(result.current.filtered).toEqual(DATA);
    expect(result.current.isFiltered).toBe(false);
    expect(result.current.comparison).toBeNull();
  });

  it("filters by period when dateField is set and FilterProvider has active period", () => {
    // Use a fixed reference date so the 30d window is predictable
    const refDate = new Date(2025, 2, 20); // March 20, 2025
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MetricProvider>
        <FilterProvider defaultPreset="30d" referenceDate={refDate}>
          <CrossFilterProvider>{children}</CrossFilterProvider>
        </FilterProvider>
      </MetricProvider>
    );

    const { result } = renderHook(
      () => useFilteredData(DATA, { dateField: "date" }),
      { wrapper },
    );

    // 30d from March 20 = Feb 19 to March 20 (29 days back from end of day).
    // id 5 (March 1) and id 6 (March 15) are in range.
    // id 3 (Feb 10), id 4 (Feb 15) are before Feb 19.
    expect(result.current.filtered.length).toBe(2);
    expect(result.current.filtered.map((r) => r.id).sort()).toEqual([5, 6]);
    expect(result.current.isFiltered).toBe(true);
  });

  it("filters by dimensions when dimensionFields match active dimensions", () => {
    const { result } = renderHook(
      () => useFilteredData(DATA, { dimensionFields: ["region"] }),
      { wrapper: ({ children }: { children: ReactNode }) => (
        <WithDimension field="region" values={["US"]}>
          {children}
        </WithDimension>
      )},
    );

    // Only US rows: id 1, 3, 5, 7
    expect(result.current.filtered.every((r) => r.region === "US")).toBe(true);
    expect(result.current.filtered.length).toBe(4);
    expect(result.current.isFiltered).toBe(true);
  });

  it("filters by cross-filter when crossFilterField matches active selection", () => {
    const { result } = renderHook(
      () => useFilteredData(DATA, { crossFilterField: "region" }),
      { wrapper: ({ children }: { children: ReactNode }) => (
        <WithCrossFilter field="region" value="EU">
          {children}
        </WithCrossFilter>
      )},
    );

    // Only EU rows: id 2, 4, 6, 8
    expect(result.current.filtered.every((r) => r.region === "EU")).toBe(true);
    expect(result.current.filtered.length).toBe(4);
    expect(result.current.isFiltered).toBe(true);
  });

  it("ignores cross-filter when crossFilterField does not match selection field", () => {
    const { result } = renderHook(
      () => useFilteredData(DATA, { crossFilterField: "product" }),
      { wrapper: ({ children }: { children: ReactNode }) => (
        <WithCrossFilter field="region" value="EU">
          {children}
        </WithCrossFilter>
      )},
    );

    // crossFilterField is "product" but selection is on "region" — no filtering
    expect(result.current.filtered).toEqual(DATA);
    expect(result.current.isFiltered).toBe(false);
  });

  it("returns comparison data from comparison period", () => {
    const refDate = new Date(2025, 2, 20); // March 20, 2025
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MetricProvider>
        <FilterProvider defaultPreset="30d" defaultComparison="year-over-year" referenceDate={refDate}>
          <CrossFilterProvider>{children}</CrossFilterProvider>
        </FilterProvider>
      </MetricProvider>
    );

    const { result } = renderHook(
      () => useFilteredData(DATA, { dateField: "date" }),
      { wrapper },
    );

    // Comparison should be year-over-year: Feb 19-March 20 of 2024
    // id 7 (2024-03-15) and id 8 (2024-03-20) fall in that range
    expect(result.current.comparison).not.toBeNull();
    expect(result.current.comparison!.length).toBe(2);
    expect(result.current.comparison!.map((r) => r.id).sort()).toEqual([7, 8]);
  });

  it("isFiltered is true when any filter is active", () => {
    const { result } = renderHook(
      () => useFilteredData(DATA, { dimensionFields: ["region"] }),
      { wrapper: ({ children }: { children: ReactNode }) => (
        <WithDimension field="region" values={["US"]}>
          {children}
        </WithDimension>
      )},
    );
    expect(result.current.isFiltered).toBe(true);
  });

  it("handles empty data gracefully", () => {
    const { result } = renderHook(
      () => useFilteredData([], { dateField: "date", dimensionFields: ["region"] }),
      { wrapper: ({ children }: { children: ReactNode }) => (
        <WithFilters preset="30d">{children}</WithFilters>
      )},
    );
    expect(result.current.filtered).toEqual([]);
    expect(result.current.isFiltered).toBe(true); // period is active even if data is empty
  });

  it("handles missing providers gracefully (returns original data)", () => {
    // No FilterProvider, no CrossFilterProvider — just MetricProvider
    const { result } = renderHook(
      () => useFilteredData(DATA, { dateField: "date", dimensionFields: ["region"], crossFilterField: "region" }),
      { wrapper: Bare },
    );
    expect(result.current.filtered).toEqual(DATA);
    expect(result.current.comparison).toBeNull();
    expect(result.current.isFiltered).toBe(false);
  });

  it("auto-detects date field and returns comparison when available", () => {
    const refDate = new Date(2025, 2, 20);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MetricProvider>
        <FilterProvider defaultPreset="30d" defaultComparison="previous" referenceDate={refDate}>
          <CrossFilterProvider>{children}</CrossFilterProvider>
        </FilterProvider>
      </MetricProvider>
    );

    const { result } = renderHook(
      () => useFilteredData(DATA, { dimensionFields: ["region"] }),
      { wrapper },
    );

    // Auto-detects "date" field in DATA, so comparison is available
    expect(result.current.comparison).not.toBeNull();
  });
});
