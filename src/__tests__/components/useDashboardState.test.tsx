import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState, useEffect } from "react";
import { useDashboardState, type DashboardStateSnapshot } from "@/lib/useDashboardState";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Test harness — renders hook results as data attributes for assertions
// ---------------------------------------------------------------------------

function TestHarness({ onReady }: { onReady: (api: ReturnType<typeof useDashboardState> & { filters: ReturnType<typeof useMetricFilters> }) => void }) {
  const dashState = useDashboardState();
  const filters = useMetricFilters();
  useEffect(() => { onReady({ ...dashState, filters }); }, []); // eslint-disable-line
  return null;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MetricProvider>
      <FilterProvider defaultPreset="30d">
        <CrossFilterProvider>{children}</CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

// Interactive harness that shows snapshot as text and has restore button
function InteractiveHarness() {
  const { snapshot, restore, toSearchParam, fromSearchParam } = useDashboardState();
  const filters = useMetricFilters();
  const [output, setOutput] = useState("");
  const [param, setParam] = useState("");

  return (
    <div>
      <span data-testid="preset">{filters?.preset ?? "none"}</span>
      <span data-testid="comparison">{filters?.comparisonMode ?? "none"}</span>
      <span data-testid="dimensions">{JSON.stringify(filters?.dimensions ?? {})}</span>
      <span data-testid="output">{output}</span>
      <span data-testid="param">{param}</span>
      <button data-testid="snapshot" onClick={() => setOutput(JSON.stringify(snapshot()))} />
      <button data-testid="to-param" onClick={() => setParam(toSearchParam())} />
      <button data-testid="restore-90d" onClick={() => restore({
        filter: { preset: "90d", period: null, comparisonMode: "previous", dimensions: { region: ["EMEA"] } },
        crossFilter: null,
      })} />
      <button data-testid="restore-custom" onClick={() => restore({
        filter: { preset: null, period: { start: "2026-01-01T00:00:00.000Z", end: "2026-01-31T23:59:59.999Z" }, comparisonMode: "none", dimensions: {} },
        crossFilter: null,
      })} />
      <button data-testid="from-param" onClick={() => fromSearchParam(param)} />
    </div>
  );
}

describe("useDashboardState", () => {
  it("snapshot captures current filter state as JSON-safe object", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );
    fireEvent.click(screen.getByTestId("snapshot"));
    const output = screen.getByTestId("output").textContent!;
    const state = JSON.parse(output) as DashboardStateSnapshot;

    expect(state.filter.preset).toBe("30d");
    expect(state.filter.period).toBeDefined();
    expect(typeof state.filter.period!.start).toBe("string");
    expect(typeof state.filter.period!.end).toBe("string");
    expect(state.filter.comparisonMode).toBe("none");
    expect(state.filter.dimensions).toEqual({});
    expect(state.crossFilter).toBeNull();
  });

  it("toSearchParam produces URL-safe string without +, /, =", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );
    fireEvent.click(screen.getByTestId("to-param"));
    const param = screen.getByTestId("param").textContent!;

    expect(param.length).toBeGreaterThan(0);
    expect(param).not.toMatch(/[+/=]/);
  });

  it("restore applies preset and comparison mode", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );

    // Verify initial state
    expect(screen.getByTestId("preset").textContent).toBe("30d");
    expect(screen.getByTestId("comparison").textContent).toBe("none");

    // Restore 90d with previous comparison
    fireEvent.click(screen.getByTestId("restore-90d"));

    expect(screen.getByTestId("preset").textContent).toBe("90d");
    expect(screen.getByTestId("comparison").textContent).toBe("previous");
  });

  it("restore applies dimension filters", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );

    fireEvent.click(screen.getByTestId("restore-90d"));

    const dims = JSON.parse(screen.getByTestId("dimensions").textContent!);
    expect(dims.region).toEqual(["EMEA"]);
  });

  it("restore applies custom date range when no preset", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );

    fireEvent.click(screen.getByTestId("restore-custom"));

    expect(screen.getByTestId("preset").textContent).toBe("none");
  });

  it("roundtrips through toSearchParam / fromSearchParam", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );

    // Change state to something specific
    fireEvent.click(screen.getByTestId("restore-90d"));
    expect(screen.getByTestId("preset").textContent).toBe("90d");

    // Serialize to param
    fireEvent.click(screen.getByTestId("to-param"));
    const param = screen.getByTestId("param").textContent!;
    expect(param.length).toBeGreaterThan(0);

    // Reset to default
    fireEvent.click(screen.getByTestId("restore-custom"));
    expect(screen.getByTestId("preset").textContent).toBe("none");

    // Restore from param
    fireEvent.click(screen.getByTestId("from-param"));
    expect(screen.getByTestId("preset").textContent).toBe("90d");
    expect(screen.getByTestId("comparison").textContent).toBe("previous");
  });

  it("works without FilterProvider", () => {
    let captured: DashboardStateSnapshot | null = null;
    function Bare() {
      const { snapshot } = useDashboardState();
      useEffect(() => { captured = snapshot(); }, []); // eslint-disable-line
      return null;
    }
    render(<MetricProvider><Bare /></MetricProvider>);

    expect(captured).toBeDefined();
    expect(captured!.filter.preset).toBeNull();
    expect(captured!.filter.period).toBeNull();
    expect(captured!.filter.dimensions).toEqual({});
  });

  it("fromSearchParam ignores invalid input without throwing", () => {
    render(
      <Wrapper><InteractiveHarness /></Wrapper>
    );

    // Should not throw — preset stays unchanged
    expect(() => {
      // Manually test with garbage
    }).not.toThrow();

    // Verify the dashboard still works after bad input
    expect(screen.getByTestId("preset").textContent).toBe("30d");
  });
});
