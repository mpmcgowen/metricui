import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MetricProvider>
      <FilterProvider>{ui}</FilterProvider>
    </MetricProvider>
  );
}

function renderWithMetricOnly(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("PeriodSelector", () => {
  it("renders with default presets", () => {
    renderWithProviders(<PeriodSelector />);
    // The trigger button should be visible
    const trigger = screen.getByRole("button", { name: /select period/i });
    expect(trigger).toBeInTheDocument();
  });

  it('shows "Select period" when no period is active', () => {
    renderWithProviders(<PeriodSelector />);
    expect(screen.getByText("Select period")).toBeInTheDocument();
  });

  it("clicking a preset updates the display label", () => {
    renderWithProviders(<PeriodSelector />);
    // Open dropdown
    fireEvent.click(screen.getByText("Select period"));
    // Click "Last 30 days" preset
    fireEvent.click(screen.getByText("Last 30 days"));
    // The trigger should now show the preset label
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it('custom range inputs appear when "Custom range" is clicked', () => {
    renderWithProviders(<PeriodSelector allowCustom />);
    // Open dropdown
    fireEvent.click(screen.getByText("Select period"));
    // Click "Custom range"
    fireEvent.click(screen.getByText("Custom range"));
    // Date inputs should appear
    const dateInputs = document.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBe(2);
    // Apply button should appear
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("comparison toggle works (cycles through modes)", () => {
    renderWithProviders(
      <PeriodSelector comparison presets={["30d"]} />
    );
    // First select a period so comparison toggle appears
    fireEvent.click(screen.getByText("Select period"));
    fireEvent.click(screen.getByText("Last 30 days"));

    // The comparison toggle button should now be visible (ArrowLeftRight icon button)
    const comparisonBtns = document.querySelectorAll("button");
    // Find the comparison toggle — it's the button with the ArrowLeftRight icon
    const comparisonToggle = Array.from(comparisonBtns).find(
      (btn) => btn.getAttribute("title") === "No comparison"
    );
    expect(comparisonToggle).toBeTruthy();

    // Click to cycle to "previous"
    fireEvent.click(comparisonToggle!);
    // Now should show "vs prev"
    expect(screen.getByText("vs prev")).toBeInTheDocument();

    // Click again to cycle to "year-over-year"
    const nextToggle = Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.getAttribute("title") === "vs previous period"
    );
    fireEvent.click(nextToggle!);
    expect(screen.getByText("vs YoY")).toBeInTheDocument();
  });

  it("works with FilterProvider context", () => {
    function FilterDisplay() {
      const filters = useMetricFilters();
      return (
        <div data-testid="filter-display">
          {filters?.preset ? `preset:${filters.preset}` : "no-preset"}
        </div>
      );
    }

    render(
      <MetricProvider>
        <FilterProvider>
          <PeriodSelector />
          <FilterDisplay />
        </FilterProvider>
      </MetricProvider>
    );

    // Initially no preset
    expect(screen.getByTestId("filter-display").textContent).toBe("no-preset");

    // Select a preset
    fireEvent.click(screen.getByText("Select period"));
    fireEvent.click(screen.getByText("Last 7 days"));

    // The context should now have the preset
    expect(screen.getByTestId("filter-display").textContent).toBe("preset:7d");
  });

  it("data-testid passthrough", () => {
    renderWithProviders(
      <PeriodSelector data-testid="my-period-selector" />
    );
    expect(screen.getByTestId("my-period-selector")).toBeInTheDocument();
  });

  it("standalone onChange fires without FilterProvider", () => {
    const onChange = vi.fn();
    renderWithMetricOnly(
      <PeriodSelector onChange={onChange} />
    );
    fireEvent.click(screen.getByText("Select period"));
    fireEvent.click(screen.getByText("Last 7 days"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ start: expect.any(Date), end: expect.any(Date) }),
      "7d"
    );
  });

  it("hides custom range when allowCustom is false", () => {
    renderWithProviders(<PeriodSelector allowCustom={false} />);
    fireEvent.click(screen.getByText("Select period"));
    expect(screen.queryByText("Custom range")).not.toBeInTheDocument();
  });

  it("renders only specified presets", () => {
    renderWithProviders(<PeriodSelector presets={["7d", "30d"]} />);
    fireEvent.click(screen.getByText("Select period"));
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.queryByText("Last 90 days")).not.toBeInTheDocument();
    expect(screen.queryByText("This month")).not.toBeInTheDocument();
  });
});
