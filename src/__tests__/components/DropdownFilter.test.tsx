import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
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

describe("DropdownFilter", () => {
  it("renders trigger button with label", () => {
    renderWithMetricOnly(
      <DropdownFilter label="Region" options={["US", "EU", "APAC"]} />
    );
    expect(screen.getByText("Region")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    renderWithMetricOnly(
      <DropdownFilter label="Region" options={["US", "EU", "APAC"]} />
    );
    // Dropdown should not be visible yet
    expect(screen.queryByText("US")).not.toBeInTheDocument();
    // Click trigger
    fireEvent.click(screen.getByText("Region"));
    // Options should now be visible
    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("EU")).toBeInTheDocument();
    expect(screen.getByText("APAC")).toBeInTheDocument();
  });

  it("shows all options when open", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Plan"
        options={[
          { value: "free", label: "Free" },
          { value: "starter", label: "Starter" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Plan"));
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("single select — clicking an option selects it and closes dropdown", () => {
    renderWithMetricOnly(
      <DropdownFilter label="Region" options={["US", "EU", "APAC"]} />
    );
    fireEvent.click(screen.getByText("Region"));
    fireEvent.click(screen.getByText("EU"));
    // Dropdown should close
    expect(screen.queryByText("US")).not.toBeInTheDocument();
    // Trigger should show selected label
    expect(screen.getByText("EU")).toBeInTheDocument();
  });

  it("multiple select — clicking options toggles them, dropdown stays open", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Plan"
        options={["Free", "Pro", "Enterprise"]}
        multiple
      />
    );
    fireEvent.click(screen.getByText("Plan"));
    // Select Free
    fireEvent.click(screen.getByText("Free"));
    // Dropdown should stay open
    expect(screen.getByText("Pro")).toBeInTheDocument();
    // Select Pro
    fireEvent.click(screen.getByText("Pro"));
    // Both should be selected, dropdown still open
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    // Deselect Free
    fireEvent.click(screen.getByText("Free"));
    // Dropdown still open
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("search filters options", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Region"
        options={["US East", "US West", "EU Central", "EU West", "APAC"]}
        searchable
      />
    );
    fireEvent.click(screen.getByText("Region"));
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "EU" } });
    // Only EU options should be visible
    expect(screen.getByText("EU Central")).toBeInTheDocument();
    expect(screen.getByText("EU West")).toBeInTheDocument();
    expect(screen.queryByText("US East")).not.toBeInTheDocument();
    expect(screen.queryByText("APAC")).not.toBeInTheDocument();
  });

  it('"All" option clears selection', () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Region"
        options={["US", "EU", "APAC"]}
        multiple
        showAll
        defaultValue={["US", "EU"]}
      />
    );
    fireEvent.click(screen.getByText("Region (2)"));
    // Click "All"
    fireEvent.click(screen.getByText("All"));
    // Selection should be cleared — trigger should show just the label
    expect(screen.getByText("Region")).toBeInTheDocument();
  });

  it("grouped options render with group headers", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Region"
        options={[
          { value: "us", label: "US", group: "Americas" },
          { value: "br", label: "Brazil", group: "Americas" },
          { value: "de", label: "Germany", group: "Europe" },
          { value: "fr", label: "France", group: "Europe" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Region"));
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  it("count badges render", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Plan"
        options={[
          { value: "free", label: "Free", count: 1234 },
          { value: "pro", label: "Pro", count: 56 },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Plan"));
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
  });

  it("onChange fires with correct value", () => {
    const onChange = vi.fn();
    renderWithMetricOnly(
      <DropdownFilter
        label="Region"
        options={["US", "EU", "APAC"]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Region"));
    fireEvent.click(screen.getByText("EU"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("EU");
  });

  it("string array shorthand for options works", () => {
    renderWithMetricOnly(
      <DropdownFilter label="Region" options={["Alpha", "Beta", "Gamma"]} />
    );
    fireEvent.click(screen.getByText("Region"));
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("FilterProvider context integration via field prop", () => {
    function DimensionDisplay() {
      const filters = useMetricFilters();
      const vals = filters?.dimensions?.["region"] ?? [];
      return (
        <div data-testid="dim-display">
          {vals.length > 0 ? vals.join(",") : "none"}
        </div>
      );
    }

    render(
      <MetricProvider>
        <FilterProvider>
          <DropdownFilter
            label="Region"
            options={["US", "EU", "APAC"]}
            field="region"
          />
          <DimensionDisplay />
        </FilterProvider>
      </MetricProvider>
    );

    // Click trigger to open
    fireEvent.click(screen.getByText("Region"));
    // Select EU
    fireEvent.click(screen.getByText("EU"));
    expect(screen.getByTestId("dim-display").textContent).toBe("EU");
  });

  it("data-testid passthrough", () => {
    renderWithMetricOnly(
      <DropdownFilter
        label="Region"
        options={["US", "EU"]}
        data-testid="my-dropdown"
      />
    );
    expect(screen.getByTestId("my-dropdown")).toBeInTheDocument();
  });
});
