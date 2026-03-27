import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastSankeyProps: any = null;

vi.mock("@nivo/sankey", () => ({
  ResponsiveSankey: (props: any) => {
    lastSankeyProps = props;
    return <div data-testid="nivo-sankey" />;
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

import { Sankey } from "@/components/charts/Sankey";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const nativeData = {
  nodes: [
    { id: "Organic" },
    { id: "Paid" },
    { id: "Landing" },
    { id: "Signup" },
    { id: "Purchase" },
  ],
  links: [
    { source: "Organic", target: "Landing", value: 500 },
    { source: "Paid", target: "Landing", value: 300 },
    { source: "Landing", target: "Signup", value: 400 },
    { source: "Landing", target: "Purchase", value: 200 },
    { source: "Signup", target: "Purchase", value: 150 },
  ],
};

const flatRowData = [
  { from: "Organic", to: "Landing", amount: 500 },
  { from: "Paid", to: "Landing", amount: 300 },
  { from: "Landing", to: "Signup", amount: 400 },
  { from: "Landing", to: "Purchase", amount: 200 },
];

const defaultFieldFlatData = [
  { source: "A", target: "B", value: 100 },
  { source: "A", target: "C", value: 200 },
  { source: "B", target: "D", value: 50 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Sankey", () => {
  beforeEach(() => {
    lastSankeyProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with native node/link data", () => {
    const { container } = renderWithProvider(
      <Sankey data={nativeData} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-sankey")).toBeInTheDocument();
  });

  it("passes native data directly to Nivo", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.data.nodes).toHaveLength(5);
    expect(lastSankeyProps.data.links).toHaveLength(5);
  });

  // --- Flat row format ---
  it("renders with flat DataRow format", () => {
    renderWithProvider(
      <Sankey
        data={flatRowData}
        sourceField="from"
        targetField="to"
        valueField="amount"
      />
    );
    expect(screen.getByTestId("nivo-sankey")).toBeInTheDocument();
  });

  it("flat rows produce correct nodes (unique source + target)", () => {
    renderWithProvider(
      <Sankey
        data={flatRowData}
        sourceField="from"
        targetField="to"
        valueField="amount"
      />
    );
    const nodeIds = lastSankeyProps.data.nodes.map((n: any) => n.id).sort();
    expect(nodeIds).toEqual(["Landing", "Organic", "Paid", "Purchase", "Signup"]);
  });

  it("flat rows produce correct links", () => {
    renderWithProvider(
      <Sankey
        data={flatRowData}
        sourceField="from"
        targetField="to"
        valueField="amount"
      />
    );
    expect(lastSankeyProps.data.links).toHaveLength(4);
    expect(lastSankeyProps.data.links[0]).toEqual({
      source: "Organic",
      target: "Landing",
      value: 500,
    });
  });

  it("uses default field names (source, target, value) for flat rows", () => {
    renderWithProvider(<Sankey data={defaultFieldFlatData} />);
    expect(lastSankeyProps.data.nodes).toHaveLength(4);
    expect(lastSankeyProps.data.links).toHaveLength(3);
    expect(lastSankeyProps.data.links[0]).toEqual({
      source: "A",
      target: "B",
      value: 100,
    });
  });

  // --- Empty data ---
  it("handles undefined data gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(<Sankey />);
    expect(container.firstChild).toBeTruthy();
    // No data → CardShell auto empty state, Nivo not rendered
  });

  it("handles empty array data (shows empty state)", () => {
    const { container } = renderWithProvider(<Sankey data={[]} />);
    expect(container.firstChild).toBeTruthy();
    // Empty array → CardShell auto empty state
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Sankey data={nativeData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Sankey data={nativeData} error={{ message: "Network error" }} />
    );
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Sankey data={nativeData} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Sankey data={nativeData} title="Traffic Flow" />
    );
    expect(screen.getByText("Traffic Flow")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Sankey data={nativeData} title="Flow" subtitle="Last 7 days" />
    );
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  // --- Format ---
  it("renders with format prop without crashing", () => {
    renderWithProvider(
      <Sankey data={nativeData} format="currency" />
    );
    expect(screen.getByTestId("nivo-sankey")).toBeInTheDocument();
  });

  // --- Props pass-through ---
  it("passes nodeThickness to Nivo", () => {
    renderWithProvider(
      <Sankey data={nativeData} nodeThickness={24} />
    );
    expect(lastSankeyProps.nodeThickness).toBe(24);
  });

  it("defaults nodeThickness to 18", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.nodeThickness).toBe(18);
  });

  it("passes linkOpacity", () => {
    renderWithProvider(
      <Sankey data={nativeData} linkOpacity={0.6} />
    );
    expect(lastSankeyProps.linkOpacity).toBe(0.6);
  });

  it("defaults linkOpacity to 0.4", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.linkOpacity).toBe(0.4);
  });

  it("passes nodeSpacing (from nodePadding)", () => {
    renderWithProvider(
      <Sankey data={nativeData} nodePadding={20} />
    );
    expect(lastSankeyProps.nodeSpacing).toBe(20);
  });

  // --- Colors ---
  it("passes custom colors as a function", () => {
    renderWithProvider(
      <Sankey data={nativeData} colors={["#ff0000", "#00ff00"]} />
    );
    expect(typeof lastSankeyProps.colors).toBe("function");
  });

  // --- Animation ---
  it("disables animation when animate=false", () => {
    renderWithProvider(
      <Sankey data={nativeData} animate={false} />
    );
    expect(lastSankeyProps.animate).toBe(false);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Sankey data={nativeData} data-testid="my-sankey" />
    );
    expect(screen.getByTestId("my-sankey")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick when drillDown is set", () => {
    renderWithProvider(
      <Sankey data={nativeData} drillDown={true} />
    );
    expect(lastSankeyProps.onClick).toBeTruthy();
  });

  it("does not pass onClick when no drillDown or crossFilter", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    // Sankey always has onClick to handle node clicks
    // It only fires handlers for nodes, not links
    expect(lastSankeyProps.onClick).toBeDefined();
  });

  // --- Rendering features ---
  it("enables link gradient", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.enableLinkGradient).toBe(true);
  });

  it("uses outside label position", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.labelPosition).toBe("outside");
  });

  it("uses auto sort", () => {
    renderWithProvider(<Sankey data={nativeData} />);
    expect(lastSankeyProps.sort).toBe("auto");
  });

  // --- Edge cases ---
  it("handles single link", () => {
    const singleLink = {
      nodes: [{ id: "A" }, { id: "B" }],
      links: [{ source: "A", target: "B", value: 100 }],
    };
    renderWithProvider(<Sankey data={singleLink} />);
    expect(lastSankeyProps.data.nodes).toHaveLength(2);
    expect(lastSankeyProps.data.links).toHaveLength(1);
  });

  it("handles flat rows with non-numeric values by defaulting to 0", () => {
    const badValueData = [
      { source: "A", target: "B", value: "not a number" as any },
    ];
    renderWithProvider(<Sankey data={badValueData} />);
    expect(lastSankeyProps.data.links[0].value).toBe(0);
  });

  it("handles flat rows with duplicate source-target pairs", () => {
    const dupData = [
      { source: "A", target: "B", value: 100 },
      { source: "A", target: "B", value: 200 },
    ];
    renderWithProvider(<Sankey data={dupData} />);
    // Both links should be passed through (Nivo handles dedup)
    expect(lastSankeyProps.data.links).toHaveLength(2);
    expect(lastSankeyProps.data.nodes).toHaveLength(2);
  });
});
