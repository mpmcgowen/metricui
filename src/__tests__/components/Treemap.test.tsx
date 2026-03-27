import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastTreemapProps: any = null;

vi.mock("@nivo/treemap", () => ({
  ResponsiveTreeMap: (props: any) => {
    lastTreemapProps = props;
    return <div data-testid="nivo-treemap" />;
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

import { Treemap } from "@/components/charts/Treemap";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const hierarchicalData = {
  name: "root",
  children: [
    { name: "Electronics", value: 500 },
    { name: "Clothing", value: 300 },
    { name: "Books", value: 200 },
  ],
};

const deepHierarchicalData = {
  name: "root",
  children: [
    {
      name: "Tech",
      children: [
        { name: "Laptops", value: 300 },
        { name: "Phones", value: 400 },
      ],
    },
    {
      name: "Fashion",
      children: [
        { name: "Shoes", value: 150 },
        { name: "Shirts", value: 100 },
      ],
    },
  ],
};

const flatRowData = [
  { category: "Electronics", sales: 500 },
  { category: "Clothing", sales: 300 },
  { category: "Books", sales: 200 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Treemap", () => {
  beforeEach(() => {
    lastTreemapProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with hierarchical data", () => {
    const { container } = renderWithProvider(
      <Treemap data={hierarchicalData} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-treemap")).toBeInTheDocument();
  });

  it("renders with flat DataRow format", () => {
    renderWithProvider(
      <Treemap data={flatRowData} index="category" value="sales" />
    );
    expect(screen.getByTestId("nivo-treemap")).toBeInTheDocument();
    // Should transform to hierarchical with root + 3 children
    expect(lastTreemapProps.data.id).toBe("root");
    expect(lastTreemapProps.data.children).toHaveLength(3);
  });

  it("flat rows produce correct child IDs and values", () => {
    renderWithProvider(
      <Treemap data={flatRowData} index="category" value="sales" />
    );
    const children = lastTreemapProps.data.children;
    expect(children[0]).toEqual({ id: "Electronics", value: 500 });
    expect(children[1]).toEqual({ id: "Clothing", value: 300 });
    expect(children[2]).toEqual({ id: "Books", value: 200 });
  });

  it("hierarchical data is normalized (name → id)", () => {
    renderWithProvider(<Treemap data={hierarchicalData} />);
    expect(lastTreemapProps.data.id).toBe("root");
    // Children should have `id` not `name`
    expect(lastTreemapProps.data.children[0].id).toBe("Electronics");
  });

  it("handles deep hierarchical data", () => {
    renderWithProvider(<Treemap data={deepHierarchicalData} />);
    const data = lastTreemapProps.data;
    expect(data.children).toHaveLength(2);
    expect(data.children[0].id).toBe("Tech");
    expect(data.children[0].children).toHaveLength(2);
    expect(data.children[0].children[0].id).toBe("Laptops");
  });

  // --- Empty data ---
  it("handles undefined data gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(<Treemap />);
    expect(container.firstChild).toBeTruthy();
    // No data → CardShell auto empty state, Nivo not rendered
  });

  it("handles empty flat array (shows empty state)", () => {
    const { container } = renderWithProvider(<Treemap data={[]} index="name" value="value" />);
    expect(container.firstChild).toBeTruthy();
    // Empty array → CardShell auto empty state
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Treemap data={hierarchicalData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} error={{ message: "Load failed" }} />
    );
    expect(screen.getByText("Load failed")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Treemap data={hierarchicalData} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} title="Sales by Category" />
    );
    expect(screen.getByText("Sales by Category")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} title="Sales" subtitle="Q1 2025" />
    );
    expect(screen.getByText("Q1 2025")).toBeInTheDocument();
  });

  // --- Format ---
  it("passes format config through to treemap", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} format="currency" />
    );
    // Treemap tooltip uses format — just verify no crash
    expect(screen.getByTestId("nivo-treemap")).toBeInTheDocument();
  });

  // --- Props pass-through ---
  it("passes tile algorithm to Nivo", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} tile="binary" />
    );
    expect(lastTreemapProps.tile).toBe("binary");
  });

  it("defaults tile to squarify", () => {
    renderWithProvider(<Treemap data={hierarchicalData} />);
    expect(lastTreemapProps.tile).toBe("squarify");
  });

  it("passes innerPadding and outerPadding", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} innerPadding={4} outerPadding={8} />
    );
    expect(lastTreemapProps.innerPadding).toBe(4);
    expect(lastTreemapProps.outerPadding).toBe(8);
  });

  it("passes labelSkipSize", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} labelSkipSize={16} />
    );
    expect(lastTreemapProps.labelSkipSize).toBe(16);
  });

  // --- Colors ---
  it("passes custom colors as a function", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} colors={["#ff0000", "#00ff00", "#0000ff"]} />
    );
    expect(typeof lastTreemapProps.colors).toBe("function");
  });

  // --- Animation ---
  it("disables animation when animate=false", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} animate={false} />
    );
    expect(lastTreemapProps.animate).toBe(false);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} data-testid="my-treemap" />
    );
    expect(screen.getByTestId("my-treemap")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick when drillDown is set", () => {
    renderWithProvider(
      <Treemap data={hierarchicalData} drillDown={true} />
    );
    expect(lastTreemapProps.onClick).toBeTruthy();
  });

  it("does not pass onClick when no drillDown or crossFilter", () => {
    renderWithProvider(<Treemap data={hierarchicalData} />);
    expect(lastTreemapProps.onClick).toBeUndefined();
  });

  // --- Edge cases ---
  it("handles single-child hierarchical data", () => {
    const singleChild = { name: "root", children: [{ name: "Only", value: 100 }] };
    renderWithProvider(<Treemap data={singleChild} />);
    expect(lastTreemapProps.data.children).toHaveLength(1);
  });

  it("handles flat rows with zero values", () => {
    const zeroData = [
      { name: "A", value: 0 },
      { name: "B", value: 0 },
    ];
    renderWithProvider(<Treemap data={zeroData} />);
    expect(lastTreemapProps.data.children).toHaveLength(2);
  });

  it("uses leavesOnly rendering", () => {
    renderWithProvider(<Treemap data={deepHierarchicalData} />);
    expect(lastTreemapProps.leavesOnly).toBe(true);
  });

  it("uses default index/value field names ('name' and 'value')", () => {
    const defaultFieldData = [
      { name: "Alpha", value: 100 },
      { name: "Beta", value: 200 },
    ];
    renderWithProvider(<Treemap data={defaultFieldData} />);
    expect(lastTreemapProps.data.children[0].id).toBe("Alpha");
    expect(lastTreemapProps.data.children[0].value).toBe(100);
  });
});
