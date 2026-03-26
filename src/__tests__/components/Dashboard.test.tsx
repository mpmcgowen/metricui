import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/components/layout/Dashboard";
import { useMetricConfig } from "@/lib/MetricProvider";
import { useMetricFilters } from "@/lib/FilterContext";
import { useAi } from "@/lib/AiContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";

// ---------------------------------------------------------------------------
// Spy components that read context and render it for assertions
// ---------------------------------------------------------------------------

function ConfigSpy() {
  const config = useMetricConfig();
  return (
    <div data-testid="config-spy">
      <span data-testid="locale">{config.locale}</span>
      <span data-testid="currency">{config.currency}</span>
      <span data-testid="dense">{config.dense ? "true" : "false"}</span>
      <span data-testid="exportable">{config.exportable ? "true" : "false"}</span>
      <span data-testid="animate">{config.animate ? "true" : "false"}</span>
    </div>
  );
}

function FilterSpy() {
  const filters = useMetricFilters();
  return (
    <div data-testid="filter-spy">
      <span data-testid="has-filters">{filters ? "true" : "false"}</span>
      <span data-testid="preset">{filters?.preset ?? "none"}</span>
    </div>
  );
}

function AiSpy() {
  const ai = useAi();
  return (
    <div data-testid="ai-spy">
      <span data-testid="ai-enabled">{ai?.enabled ? "true" : "false"}</span>
    </div>
  );
}

function CrossFilterSpy() {
  const cf = useCrossFilter();
  return (
    <div data-testid="cf-spy">
      <span data-testid="cf-available">{cf ? "true" : "false"}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Dashboard", () => {
  it("renders children", () => {
    render(
      <Dashboard>
        <div data-testid="child">Hello</div>
      </Dashboard>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("provides MetricConfig with correct values", () => {
    render(
      <Dashboard locale="de-DE" currency="EUR" dense exportable>
        <ConfigSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("locale").textContent).toBe("de-DE");
    expect(screen.getByTestId("currency").textContent).toBe("EUR");
    expect(screen.getByTestId("dense").textContent).toBe("true");
    expect(screen.getByTestId("exportable").textContent).toBe("true");
  });

  it("provides FilterContext when filters prop is set", () => {
    render(
      <Dashboard filters={{ defaultPreset: "30d" }}>
        <FilterSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("has-filters").textContent).toBe("true");
    expect(screen.getByTestId("preset").textContent).toBe("30d");
  });

  it("does NOT provide FilterContext when filters is omitted", () => {
    render(
      <Dashboard>
        <FilterSpy />
      </Dashboard>
    );
    // When no FilterProvider, useMetricFilters returns null
    expect(screen.getByTestId("has-filters").textContent).toBe("false");
    expect(screen.getByTestId("preset").textContent).toBe("none");
  });

  it("ai prop makes useAi() return enabled context", () => {
    const mockAnalyze = vi.fn().mockResolvedValue("insight");
    render(
      <Dashboard ai={{ analyze: mockAnalyze }}>
        <AiSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("ai-enabled").textContent).toBe("true");
  });

  it("ai context is disabled when ai prop is omitted", () => {
    render(
      <Dashboard>
        <AiSpy />
      </Dashboard>
    );
    // AiProvider receives null config, so enabled should be false
    expect(screen.getByTestId("ai-enabled").textContent).toBe("false");
  });

  it("always provides CrossFilterContext", () => {
    render(
      <Dashboard>
        <CrossFilterSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("cf-available").textContent).toBe("true");
  });

  it("animate=false propagates through MetricConfig", () => {
    render(
      <Dashboard animate={false}>
        <ConfigSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("animate").textContent).toBe("false");
  });

  it("default config values when no props are set", () => {
    render(
      <Dashboard>
        <ConfigSpy />
      </Dashboard>
    );
    expect(screen.getByTestId("locale").textContent).toBe("en-US");
    expect(screen.getByTestId("currency").textContent).toBe("USD");
    expect(screen.getByTestId("dense").textContent).toBe("false");
    expect(screen.getByTestId("exportable").textContent).toBe("false");
    expect(screen.getByTestId("animate").textContent).toBe("true");
  });
});
