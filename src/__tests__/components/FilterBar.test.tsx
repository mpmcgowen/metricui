import { describe, it, expect, vi } from "vitest";
import { useEffect, useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "@/components/filters/FilterBar";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { MetricProvider } from "@/lib/MetricProvider";
import { CrossFilterProvider } from "@/lib/CrossFilterContext";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MetricProvider>
      <FilterProvider>
        <CrossFilterProvider>{ui}</CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

function renderWithPreset(preset: "7d" | "30d" | "90d", ui: React.ReactElement) {
  return render(
    <MetricProvider>
      <FilterProvider defaultPreset={preset}>
        <CrossFilterProvider>{ui}</CrossFilterProvider>
      </FilterProvider>
    </MetricProvider>
  );
}

/** Helper that sets dimensions on mount */
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FilterBar", () => {
  it("renders with FilterBar.Primary and FilterBar.Secondary slots", () => {
    renderWithProviders(
      <FilterBar data-testid="fb">
        <FilterBar.Primary>
          <button>Region</button>
        </FilterBar.Primary>
        <FilterBar.Secondary>
          <button>Advanced</button>
        </FilterBar.Secondary>
      </FilterBar>
    );
    expect(screen.getByTestId("fb")).toBeInTheDocument();
    // Primary content should be visible (bar starts expanded by default)
    expect(screen.getByText("Region")).toBeInTheDocument();
    // Secondary starts collapsed — the "+1 more" button should be visible
    expect(screen.getByText(/\+1 more/)).toBeInTheDocument();
  });

  it("renders Nav slot content above the filter header", () => {
    renderWithProviders(
      <FilterBar data-testid="fb">
        <FilterBar.Nav>
          <span>Nav Content</span>
        </FilterBar.Nav>
        <FilterBar.Primary>
          <button>Filter</button>
        </FilterBar.Primary>
      </FilterBar>
    );
    expect(screen.getByText("Nav Content")).toBeInTheDocument();
    // Nav should appear before the filter controls in the DOM
    const nav = screen.getByText("Nav Content");
    const filter = screen.getByText("Filter");
    expect(nav.compareDocumentPosition(filter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("starts collapsed when defaultCollapsed is true", () => {
    renderWithProviders(
      <FilterBar defaultCollapsed data-testid="fb">
        <FilterBar.Primary>
          <button>Region Filter</button>
        </FilterBar.Primary>
      </FilterBar>
    );
    // When collapsed, the body is in a 0fr grid — the controls should be in overflow-hidden
    const fb = screen.getByTestId("fb");
    const overflowHidden = fb.querySelector(".overflow-hidden");
    expect(overflowHidden).toBeTruthy();
  });

  it("expands on click when collapsed", () => {
    renderWithProviders(
      <FilterBar defaultCollapsed data-testid="fb">
        <FilterBar.Primary>
          <button>Region Filter</button>
        </FilterBar.Primary>
      </FilterBar>
    );
    // Click the header to expand
    const header = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(header);
    // After expanding, grid-rows should change to 1fr
    const fb = screen.getByTestId("fb");
    const gridContainer = fb.querySelector(".grid-rows-\\[1fr\\]");
    expect(gridContainer).toBeTruthy();
  });

  it("applies sticky classes when sticky prop is true", () => {
    renderWithProviders(
      <FilterBar sticky data-testid="fb">
        <FilterBar.Primary>
          <button>Filter</button>
        </FilterBar.Primary>
      </FilterBar>
    );
    const fb = screen.getByTestId("fb");
    expect(fb.className).toContain("sticky");
    expect(fb.className).toContain("z-30");
    expect(fb.className).toContain("backdrop-blur");
  });

  it("shows active filter count badge", () => {
    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <CrossFilterProvider>
            <SetupDimensions dimensions={{ region: ["US"], plan: ["Pro"] }}>
              <FilterBar data-testid="fb">
                <FilterBar.Primary>
                  <button>Filter</button>
                </FilterBar.Primary>
              </FilterBar>
            </SetupDimensions>
          </CrossFilterProvider>
        </FilterProvider>
      </MetricProvider>
    );
    // period (1) + 2 dimensions = 3 active filters
    // The count badge should show "3"
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("clear all button resets filters", () => {
    function TestHarness() {
      const filters = useMetricFilters();
      return (
        <div>
          <FilterBar data-testid="fb">
            <FilterBar.Primary>
              <button>Filter</button>
            </FilterBar.Primary>
          </FilterBar>
          <div data-testid="dim-check">
            {JSON.stringify(filters?.dimensions ?? {})}
          </div>
          <div data-testid="period-check">
            {filters?.preset ?? "none"}
          </div>
        </div>
      );
    }

    render(
      <MetricProvider>
        <FilterProvider defaultPreset="30d">
          <CrossFilterProvider>
            <SetupDimensions dimensions={{ region: ["US"] }}>
              <TestHarness />
            </SetupDimensions>
          </CrossFilterProvider>
        </FilterProvider>
      </MetricProvider>
    );

    // Verify filter is active
    expect(screen.getByText("Clear all")).toBeInTheDocument();

    // Click Clear all
    fireEvent.click(screen.getByText("Clear all"));

    // Dimensions should be cleared
    expect(screen.getByTestId("dim-check").textContent).toBe("{}");
  });

  it("falls back to treating all children as Primary when no slots used", () => {
    renderWithProviders(
      <FilterBar data-testid="fb">
        <button>Loose Filter</button>
      </FilterBar>
    );
    // Should still render the button as primary content
    expect(screen.getByText("Loose Filter")).toBeInTheDocument();
  });

  it("secondary expand button toggles secondary filters", () => {
    renderWithProviders(
      <FilterBar data-testid="fb">
        <FilterBar.Primary>
          <button>Primary Filter</button>
        </FilterBar.Primary>
        <FilterBar.Secondary>
          <button>Secondary Filter</button>
        </FilterBar.Secondary>
      </FilterBar>
    );

    const moreButton = screen.getByText(/\+1 more/);
    expect(moreButton).toBeInTheDocument();

    // Click to expand secondary
    fireEvent.click(moreButton);

    // The "Less" text should now appear
    expect(screen.getByText("Less")).toBeInTheDocument();
    // aria-expanded should be true
    const expandButton = screen.getByText("Less").closest("button")!;
    expect(expandButton.getAttribute("aria-expanded")).toBe("true");
  });
});
