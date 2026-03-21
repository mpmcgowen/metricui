import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
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

describe("SegmentToggle", () => {
  it("renders all options as buttons", () => {
    renderWithMetricOnly(
      <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
    );
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("default selection is first option", () => {
    renderWithMetricOnly(
      <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
    );
    // First option should have the active accent color class
    const dailyButton = screen.getByText("Daily").closest("button")!;
    expect(dailyButton.className).toContain("text-[var(--accent)]");
    // Others should have muted class
    const weeklyButton = screen.getByText("Weekly").closest("button")!;
    expect(weeklyButton.className).toContain("text-[var(--muted)]");
  });

  it("clicking an option makes it active", () => {
    renderWithMetricOnly(
      <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
    );
    const weeklyButton = screen.getByText("Weekly").closest("button")!;
    fireEvent.click(weeklyButton);
    // Weekly should now be active
    expect(weeklyButton.className).toContain("text-[var(--accent)]");
    // Daily should now be muted
    const dailyButton = screen.getByText("Daily").closest("button")!;
    expect(dailyButton.className).toContain("text-[var(--muted)]");
  });

  it("controlled value prop works", () => {
    renderWithMetricOnly(
      <SegmentToggle options={["Daily", "Weekly", "Monthly"]} value="Monthly" />
    );
    const monthlyButton = screen.getByText("Monthly").closest("button")!;
    expect(monthlyButton.className).toContain("text-[var(--accent)]");
    const dailyButton = screen.getByText("Daily").closest("button")!;
    expect(dailyButton.className).toContain("text-[var(--muted)]");
  });

  it("multiple selection mode works", () => {
    renderWithMetricOnly(
      <SegmentToggle
        options={["A", "B", "C"]}
        multiple
        defaultValue={["A"]}
      />
    );
    // Click B to add it
    const bButton = screen.getByText("B").closest("button")!;
    fireEvent.click(bButton);
    // Both A and B should be active
    const aButton = screen.getByText("A").closest("button")!;
    expect(aButton.className).toContain("text-[var(--accent)]");
    expect(bButton.className).toContain("text-[var(--accent)]");
  });

  it("string array shorthand for options works", () => {
    renderWithMetricOnly(
      <SegmentToggle options={["Alpha", "Beta", "Gamma"]} />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("badge counts render", () => {
    renderWithMetricOnly(
      <SegmentToggle
        options={[
          { value: "active", label: "Active", badge: 1234 },
          { value: "churned", label: "Churned", badge: 56 },
        ]}
      />
    );
    // Badge values should be formatted and rendered
    expect(screen.getByText("1.2K")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
  });

  it("onChange fires with correct value", () => {
    const onChange = vi.fn();
    renderWithMetricOnly(
      <SegmentToggle
        options={["Daily", "Weekly", "Monthly"]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Weekly"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Weekly");
  });

  it("onChange fires with array in multiple mode", () => {
    const onChange = vi.fn();
    renderWithMetricOnly(
      <SegmentToggle
        options={["A", "B", "C"]}
        multiple
        defaultValue={["A"]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("B"));
    expect(onChange).toHaveBeenCalledWith(["A", "B"]);
  });

  it("data-testid passthrough", () => {
    renderWithMetricOnly(
      <SegmentToggle
        options={["X", "Y"]}
        data-testid="my-segment-toggle"
      />
    );
    expect(screen.getByTestId("my-segment-toggle")).toBeInTheDocument();
  });

  it("works with FilterProvider context via field prop", () => {
    function DimensionDisplay() {
      const filters = useMetricFilters();
      const vals = filters?.dimensions?.["view"] ?? [];
      return (
        <div data-testid="dim-display">
          {vals.length > 0 ? vals.join(",") : "none"}
        </div>
      );
    }

    render(
      <MetricProvider>
        <FilterProvider>
          <SegmentToggle
            options={["Issues", "PRs"]}
            field="view"
          />
          <DimensionDisplay />
        </FilterProvider>
      </MetricProvider>
    );

    // Click PRs
    fireEvent.click(screen.getByText("PRs"));
    expect(screen.getByTestId("dim-display").textContent).toBe("PRs");
  });
});
