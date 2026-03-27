import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mock Nivo responsive component — jsdom has no real layout
// ---------------------------------------------------------------------------

let lastScatterProps: any = null;

vi.mock("@nivo/scatterplot", () => ({
  ResponsiveScatterPlot: (props: any) => {
    lastScatterProps = props;
    return <div data-testid="nivo-scatterplot" />;
  },
}));

vi.mock("@/lib/useContainerSize", () => ({
  useContainerSize: () => ({
    ref: { current: null },
    width: 800,
    height: 400,
  }),
}));

vi.mock("@/lib/useChartLegend", () => ({
  useChartLegend: () => ({
    hidden: new Set(),
    toggle: vi.fn(),
    legendConfig: null,
    allHidden: false,
  }),
}));

import { ScatterPlot } from "@/components/charts/ScatterPlot";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const minimalData = [
  { id: "Series A", data: [{ x: 10, y: 20 }] },
];

const multiSeriesData = [
  {
    id: "Series A",
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
    ],
  },
  {
    id: "Series B",
    data: [
      { x: 15, y: 25 },
      { x: 35, y: 45 },
      { x: 55, y: 65 },
    ],
  },
];

const flatRowData = [
  { age: 25, revenue: 100, cost: 50 },
  { age: 30, revenue: 200, cost: 80 },
  { age: 35, revenue: 150, cost: 60 },
  { age: 40, revenue: 300, cost: 120 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ScatterPlot", () => {
  beforeEach(() => {
    lastScatterProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with minimal Nivo data", () => {
    const { container } = renderWithProvider(
      <ScatterPlot data={minimalData} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-scatterplot")).toBeInTheDocument();
  });

  it("renders with multi-series data", () => {
    renderWithProvider(<ScatterPlot data={multiSeriesData} />);
    expect(screen.getByTestId("nivo-scatterplot")).toBeInTheDocument();
    // Both series should be passed through
    expect(lastScatterProps.data).toHaveLength(2);
  });

  it("renders with flat DataRow format via index + categories", () => {
    renderWithProvider(
      <ScatterPlot
        data={flatRowData}
        index="age"
        categories={["revenue", "cost"]}
      />
    );
    expect(screen.getByTestId("nivo-scatterplot")).toBeInTheDocument();
    // Should transform into 2 series (revenue, cost)
    expect(lastScatterProps.data).toHaveLength(2);
    expect(lastScatterProps.data[0].id).toBe("revenue");
    expect(lastScatterProps.data[1].id).toBe("cost");
  });

  it("flat row data points are correctly transformed", () => {
    renderWithProvider(
      <ScatterPlot
        data={flatRowData}
        index="age"
        categories={["revenue"]}
      />
    );
    const series = lastScatterProps.data[0];
    expect(series.data).toHaveLength(4);
    expect(series.data[0]).toEqual({ x: 25, y: 100 });
    expect(series.data[3]).toEqual({ x: 40, y: 300 });
  });

  // --- Empty data ---
  it("handles empty data array gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(
      <ScatterPlot data={[]} />
    );
    expect(container.firstChild).toBeTruthy();
    // Empty data triggers CardShell's auto empty state — Nivo component is not rendered
  });

  it("handles undefined data gracefully", () => {
    const { container } = renderWithProvider(<ScatterPlot />);
    expect(container.firstChild).toBeTruthy();
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <ScatterPlot data={minimalData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} error={{ message: "Failed to load" }} />
    );
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <ScatterPlot data={minimalData} stale={{ since: new Date() }} />
    );
    // Stale state should render but chart still visible
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(<ScatterPlot data={minimalData} title="Revenue vs Cost" />);
    expect(screen.getByText("Revenue vs Cost")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} title="Revenue" subtitle="Last 30 days" />
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("does not render title element when no title provided", () => {
    renderWithProvider(<ScatterPlot data={minimalData} />);
    // Title wrapper should not be in the DOM
    expect(screen.queryByText("Revenue vs Cost")).not.toBeInTheDocument();
  });

  // --- Props pass-through ---
  it("passes nodeSize to Nivo", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} nodeSize={12} />
    );
    expect(lastScatterProps.nodeSize).toBe(12);
  });

  it("defaults nodeSize to 8", () => {
    renderWithProvider(<ScatterPlot data={minimalData} />);
    expect(lastScatterProps.nodeSize).toBe(8);
  });

  it("passes enableGridX and enableGridY", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} enableGridX={false} enableGridY={false} />
    );
    expect(lastScatterProps.enableGridX).toBe(false);
    expect(lastScatterProps.enableGridY).toBe(false);
  });

  // --- Colors ---
  it("passes custom colors to Nivo color function", () => {
    renderWithProvider(
      <ScatterPlot data={multiSeriesData} colors={["#ff0000", "#00ff00"]} />
    );
    // Colors are resolved through a function, but the function should exist
    expect(typeof lastScatterProps.colors).toBe("function");
  });

  // --- Animation ---
  it("disables animation when animate=false", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} animate={false} />
    );
    expect(lastScatterProps.animate).toBe(false);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} data-testid="my-scatter" />
    );
    expect(screen.getByTestId("my-scatter")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick handler when onNodeClick is provided", () => {
    const handleClick = vi.fn();
    renderWithProvider(
      <ScatterPlot data={minimalData} onNodeClick={handleClick} />
    );
    expect(lastScatterProps.onClick).toBeTruthy();
  });

  it("does not pass onClick when no click handler or crossFilter/drillDown", () => {
    renderWithProvider(<ScatterPlot data={minimalData} />);
    expect(lastScatterProps.onClick).toBeUndefined();
  });

  // --- Edge cases ---
  it("handles single data point in a series", () => {
    const singlePoint = [{ id: "A", data: [{ x: 1, y: 1 }] }];
    renderWithProvider(<ScatterPlot data={singlePoint} />);
    expect(lastScatterProps.data).toHaveLength(1);
    expect(lastScatterProps.data[0].data).toHaveLength(1);
  });

  it("handles flat rows with null values by filtering them out", () => {
    const dataWithNulls = [
      { age: 25, revenue: 100 },
      { age: null, revenue: 200 },
      { age: 35, revenue: null },
      { age: 40, revenue: 300 },
    ];
    renderWithProvider(
      <ScatterPlot data={dataWithNulls} index="age" categories={["revenue"]} />
    );
    // Rows with null index or null category should be filtered
    const series = lastScatterProps.data[0];
    expect(series.data).toHaveLength(2); // only age=25/rev=100 and age=40/rev=300
  });

  it("handles large dataset without crashing", () => {
    const largeData = [
      {
        id: "Big Series",
        data: Array.from({ length: 1000 }, (_, i) => ({
          x: i,
          y: Math.random() * 100,
        })),
      },
    ];
    renderWithProvider(<ScatterPlot data={largeData} />);
    expect(lastScatterProps.data[0].data).toHaveLength(1000);
  });

  it("returns empty series when flat rows provided without index/categories", () => {
    renderWithProvider(
      <ScatterPlot data={flatRowData} />
    );
    // Without index + categories, flat rows can't be transformed
    expect(lastScatterProps.data).toHaveLength(0);
  });

  // --- Format ---
  it("passes xFormat and yFormat to axis formatters", () => {
    renderWithProvider(
      <ScatterPlot
        data={minimalData}
        xFormat="currency"
        yFormat="percent"
      />
    );
    // Axis formatters should be set (they are functions)
    expect(lastScatterProps.axisBottom.format).toBeDefined();
    expect(lastScatterProps.axisLeft.format).toBeDefined();
  });

  // --- Axis labels ---
  it("passes xAxisLabel to bottom axis", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} xAxisLabel="Age" />
    );
    expect(lastScatterProps.axisBottom.legend).toBe("Age");
  });

  it("passes yAxisLabel to left axis", () => {
    renderWithProvider(
      <ScatterPlot data={minimalData} yAxisLabel="Revenue" />
    );
    expect(lastScatterProps.axisLeft.legend).toBe("Revenue");
  });
});
