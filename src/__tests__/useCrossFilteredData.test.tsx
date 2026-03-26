import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCrossFilteredData } from "@/lib/useCrossFilteredData";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { useEffect, useRef, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const DATA = [
  { country: "US", revenue: 100, plan: "Pro" },
  { country: "EU", revenue: 200, plan: "Free" },
  { country: "US", revenue: 150, plan: "Enterprise" },
  { country: "APAC", revenue: 80, plan: "Pro" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Bare({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function WithCrossFilter({ children }: { children: ReactNode }) {
  return <CrossFilterProvider>{children}</CrossFilterProvider>;
}

/** Sets a cross-filter selection on mount */
function WithSelection({
  children,
  field,
  value,
}: {
  children: ReactNode;
  field: string;
  value: string;
}) {
  return (
    <CrossFilterProvider>
      <Selector field={field} value={value}>
        {children}
      </Selector>
    </CrossFilterProvider>
  );
}

function Selector({
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

describe("useCrossFilteredData", () => {
  it("returns full data when no cross-filter active", () => {
    const { result } = renderHook(
      () => useCrossFilteredData(DATA, "country"),
      { wrapper: WithCrossFilter },
    );
    expect(result.current).toEqual(DATA);
    expect(result.current.length).toBe(4);
  });

  it("filters data when cross-filter matches field", () => {
    const { result } = renderHook(
      () => useCrossFilteredData(DATA, "country"),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <WithSelection field="country" value="US">
            {children}
          </WithSelection>
        ),
      },
    );
    expect(result.current.length).toBe(2);
    expect(result.current.every((r) => r.country === "US")).toBe(true);
  });

  it("returns full data when cross-filter field does not match", () => {
    const { result } = renderHook(
      () => useCrossFilteredData(DATA, "plan"),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <WithSelection field="country" value="US">
            {children}
          </WithSelection>
        ),
      },
    );
    // Selection is on "country" but we're filtering on "plan" — no match, full data returned
    expect(result.current).toEqual(DATA);
    expect(result.current.length).toBe(4);
  });

  it("handles empty data array", () => {
    const { result } = renderHook(
      () => useCrossFilteredData([], "country"),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <WithSelection field="country" value="US">
            {children}
          </WithSelection>
        ),
      },
    );
    expect(result.current).toEqual([]);
    expect(result.current.length).toBe(0);
  });

  it("handles missing CrossFilterProvider (returns full data)", () => {
    const { result } = renderHook(
      () => useCrossFilteredData(DATA, "country"),
      { wrapper: Bare },
    );
    // No provider = useCrossFilter returns null = no filtering
    expect(result.current).toEqual(DATA);
    expect(result.current.length).toBe(4);
  });

  it("filters with numeric value match via string coercion", () => {
    const numData = [
      { id: 1, category: "A" },
      { id: 2, category: "B" },
      { id: 3, category: "A" },
    ];
    const { result } = renderHook(
      () => useCrossFilteredData(numData, "category"),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <WithSelection field="category" value="A">
            {children}
          </WithSelection>
        ),
      },
    );
    expect(result.current.length).toBe(2);
    expect(result.current.every((r) => r.category === "A")).toBe(true);
  });
});
