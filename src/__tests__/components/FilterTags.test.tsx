import { describe, it, expect, vi } from "vitest";
import { useEffect, useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterTags } from "@/components/filters/FilterTags";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MetricProvider>
      <FilterProvider>{ui}</FilterProvider>
    </MetricProvider>
  );
}

/** Sets up dimensions via a child that calls setDimension once on mount */
function SetupDimensions({
  dimensions,
  children,
}: {
  dimensions: Record<string, string[]>;
  children: React.ReactNode;
}) {
  const filters = useMetricFilters();
  const applied = useRef(false);
  useEffect(() => {
    if (filters && !applied.current) {
      applied.current = true;
      for (const [field, values] of Object.entries(dimensions)) {
        filters.setDimension(field, values);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{children}</>;
}

function renderWithDimensions(
  dimensions: Record<string, string[]>,
  ui: React.ReactElement,
) {
  return render(
    <MetricProvider>
      <FilterProvider>
        <SetupDimensions dimensions={dimensions}>{ui}</SetupDimensions>
      </FilterProvider>
    </MetricProvider>
  );
}

function renderWithPreset(preset: "7d" | "30d" | "90d", ui: React.ReactElement) {
  return render(
    <MetricProvider>
      <FilterProvider defaultPreset={preset}>{ui}</FilterProvider>
    </MetricProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FilterTags", () => {
  it("renders nothing when no filters are active", () => {
    renderWithProviders(<FilterTags data-testid="tags" />);
    expect(screen.queryByTestId("tags")).not.toBeInTheDocument();
  });

  it("shows period chip when a period is set", () => {
    renderWithPreset("30d", <FilterTags data-testid="tags" />);
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("Period:")).toBeInTheDocument();
  });

  it("shows dimension chips when dimensions are set", () => {
    renderWithDimensions(
      { region: ["US", "EU"] },
      <FilterTags data-testid="tags" />,
    );
    expect(screen.getByText("Region:")).toBeInTheDocument();
    expect(screen.getByText("US, EU")).toBeInTheDocument();
  });

  it("dismiss button removes a dimension filter", () => {
    function TestHarness() {
      const filters = useMetricFilters();
      return (
        <div>
          <FilterTags data-testid="tags" />
          <div data-testid="dim-check">
            {JSON.stringify(filters?.dimensions ?? {})}
          </div>
        </div>
      );
    }

    renderWithDimensions({ region: ["US"] }, <TestHarness />);
    // Should show the region chip
    expect(screen.getByText("Region:")).toBeInTheDocument();
    // Click dismiss
    const dismissBtn = screen.getByLabelText("Remove Region filter");
    fireEvent.click(dismissBtn);
    // Dimension should be cleared
    expect(screen.getByTestId("dim-check").textContent).toBe("{}");
  });

  it("'Clear all' button resets all filters", () => {
    function TestHarness() {
      const filters = useMetricFilters();
      return (
        <div>
          <FilterTags data-testid="tags" />
          <div data-testid="dim-check">
            {JSON.stringify(filters?.dimensions ?? {})}
          </div>
        </div>
      );
    }

    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <SetupDimensions dimensions={{ region: ["US"], plan: ["Pro"] }}>
            <TestHarness />
          </SetupDimensions>
        </FilterProvider>
      </MetricProvider>
    );

    // Should have period + 2 dimensions = 3 chips, plus "Clear all"
    expect(screen.getByText("Clear all")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Clear all"));
    // Dimensions should be empty after clear
    expect(screen.getByTestId("dim-check").textContent).toBe("{}");
  });

  it("excludes fields listed in exclude prop", () => {
    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <SetupDimensions dimensions={{ region: ["US"], plan: ["Pro"] }}>
            <FilterTags exclude={["region"]} data-testid="tags" />
          </SetupDimensions>
        </FilterProvider>
      </MetricProvider>
    );

    // Region should be excluded
    expect(screen.queryByText("Region:")).not.toBeInTheDocument();
    // Plan should still show
    expect(screen.getByText("Plan:")).toBeInTheDocument();
    // Period should still show
    expect(screen.getByText("Period:")).toBeInTheDocument();
  });

  it("custom labels render correctly", () => {
    renderWithDimensions(
      { region: ["US"] },
      <FilterTags labels={{ region: "Market" }} data-testid="tags" />,
    );
    expect(screen.getByText("Market:")).toBeInTheDocument();
    expect(screen.queryByText("Region:")).not.toBeInTheDocument();
  });

  it("maxVisible collapses overflow with '+N more' button", () => {
    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <SetupDimensions
            dimensions={{ region: ["US"], plan: ["Pro"], status: ["Active"] }}
          >
            <FilterTags maxVisible={2} data-testid="tags" />
          </SetupDimensions>
        </FilterProvider>
      </MetricProvider>
    );

    // Should show "+2 more" since we have 4 chips (period + 3 dimensions) but only 2 visible
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("expanding overflow shows all tags", () => {
    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <SetupDimensions
            dimensions={{ region: ["US"], plan: ["Pro"], status: ["Active"] }}
          >
            <FilterTags maxVisible={2} data-testid="tags" />
          </SetupDimensions>
        </FilterProvider>
      </MetricProvider>
    );

    // Click "+N more" to expand
    const moreButton = screen.getByText("+2 more");
    fireEvent.click(moreButton);

    // All tags should now be visible, "+N more" should be gone
    expect(screen.queryByText("+2 more")).not.toBeInTheDocument();
    expect(screen.getByText("Period:")).toBeInTheDocument();
    expect(screen.getByText("Region:")).toBeInTheDocument();
    expect(screen.getByText("Plan:")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
  });

  it("data-testid passthrough", () => {
    renderWithPreset("30d", <FilterTags data-testid="my-filter-tags" />);
    expect(screen.getByTestId("my-filter-tags")).toBeInTheDocument();
  });
});
