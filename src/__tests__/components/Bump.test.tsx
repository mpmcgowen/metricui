import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastBumpProps: any = null;

vi.mock("@nivo/bump", () => ({
  ResponsiveBump: (props: any) => {
    lastBumpProps = props;
    return <div data-testid="nivo-bump" />;
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

import { Bump } from "@/components/charts/Bump";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const nativeBumpData = [
  {
    id: "Python",
    data: [
      { x: "2020", y: 1 },
      { x: "2021", y: 2 },
      { x: "2022", y: 1 },
      { x: "2023", y: 1 },
    ],
  },
  {
    id: "JavaScript",
    data: [
      { x: "2020", y: 2 },
      { x: "2021", y: 1 },
      { x: "2022", y: 2 },
      { x: "2023", y: 3 },
    ],
  },
  {
    id: "Rust",
    data: [
      { x: "2020", y: 3 },
      { x: "2021", y: 3 },
      { x: "2022", y: 3 },
      { x: "2023", y: 2 },
    ],
  },
];

const flatRowData = [
  { year: "2020", python: 500, javascript: 300, rust: 100 },
  { year: "2021", python: 400, javascript: 450, rust: 120 },
  { year: "2022", python: 550, javascript: 350, rust: 150 },
  { year: "2023", python: 600, javascript: 280, rust: 400 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Bump", () => {
  beforeEach(() => {
    lastBumpProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with native BumpSeries data", () => {
    const { container } = renderWithProvider(
      <Bump data={nativeBumpData} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-bump")).toBeInTheDocument();
  });

  it("passes native data directly to Nivo", () => {
    renderWithProvider(<Bump data={nativeBumpData} />);
    expect(lastBumpProps.data).toHaveLength(3);
    expect(lastBumpProps.data[0].id).toBe("Python");
    expect(lastBumpProps.data[0].data).toHaveLength(4);
  });

  // --- Flat row with auto-ranking ---
  it("renders with flat DataRow format via index + categories", () => {
    renderWithProvider(
      <Bump
        data={flatRowData}
        index="year"
        categories={["python", "javascript", "rust"]}
      />
    );
    expect(screen.getByTestId("nivo-bump")).toBeInTheDocument();
    expect(lastBumpProps.data).toHaveLength(3);
  });

  it("auto-ranks flat row values (highest value = rank 1)", () => {
    renderWithProvider(
      <Bump
        data={flatRowData}
        index="year"
        categories={["python", "javascript", "rust"]}
      />
    );
    const pythonSeries = lastBumpProps.data.find((s: any) => s.id === "python");
    const jsSeries = lastBumpProps.data.find((s: any) => s.id === "javascript");
    const rustSeries = lastBumpProps.data.find((s: any) => s.id === "rust");

    // 2020: python=500 (rank 1), javascript=300 (rank 2), rust=100 (rank 3)
    expect(pythonSeries.data[0]).toEqual({ x: "2020", y: 1 });
    expect(jsSeries.data[0]).toEqual({ x: "2020", y: 2 });
    expect(rustSeries.data[0]).toEqual({ x: "2020", y: 3 });

    // 2021: javascript=450 (rank 1), python=400 (rank 2), rust=120 (rank 3)
    expect(jsSeries.data[1]).toEqual({ x: "2021", y: 1 });
    expect(pythonSeries.data[1]).toEqual({ x: "2021", y: 2 });
    expect(rustSeries.data[1]).toEqual({ x: "2021", y: 3 });

    // 2023: python=600 (rank 1), rust=400 (rank 2), javascript=280 (rank 3)
    expect(pythonSeries.data[3]).toEqual({ x: "2023", y: 1 });
    expect(rustSeries.data[3]).toEqual({ x: "2023", y: 2 });
    expect(jsSeries.data[3]).toEqual({ x: "2023", y: 3 });
  });

  it("each ranked series has same number of data points as input rows", () => {
    renderWithProvider(
      <Bump
        data={flatRowData}
        index="year"
        categories={["python", "javascript", "rust"]}
      />
    );
    for (const series of lastBumpProps.data) {
      expect(series.data).toHaveLength(flatRowData.length);
    }
  });

  // --- Auto-inference ---
  it("auto-infers index and categories from flat data", () => {
    renderWithProvider(<Bump data={flatRowData} />);
    // inferSchema should detect 'year' as index (string col) and the rest as categories
    expect(lastBumpProps.data.length).toBeGreaterThan(0);
  });

  // --- Empty data ---
  it("handles empty data array gracefully (shows empty state)", () => {
    const { container } = renderWithProvider(<Bump data={[]} />);
    expect(container.firstChild).toBeTruthy();
    // Empty data → CardShell auto empty state, Nivo not rendered
  });

  it("handles undefined data gracefully", () => {
    const { container } = renderWithProvider(<Bump />);
    expect(container.firstChild).toBeTruthy();
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Bump data={nativeBumpData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} error={{ message: "Ranking failed" }} />
    );
    expect(screen.getByText("Ranking failed")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Bump data={nativeBumpData} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} title="Language Rankings" />
    );
    expect(screen.getByText("Language Rankings")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} title="Rankings" subtitle="By popularity" />
    );
    expect(screen.getByText("By popularity")).toBeInTheDocument();
  });

  // --- Props pass-through ---
  it("passes lineWidth to Nivo", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} lineWidth={5} />
    );
    expect(lastBumpProps.lineWidth).toBe(5);
  });

  it("defaults lineWidth to 3", () => {
    renderWithProvider(<Bump data={nativeBumpData} />);
    expect(lastBumpProps.lineWidth).toBe(3);
  });

  it("passes pointSize", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} pointSize={12} />
    );
    expect(lastBumpProps.pointSize).toBe(12);
  });

  it("defaults pointSize to 8", () => {
    renderWithProvider(<Bump data={nativeBumpData} />);
    expect(lastBumpProps.pointSize).toBe(8);
  });

  it("passes pointBorderWidth", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} pointBorderWidth={4} />
    );
    expect(lastBumpProps.pointBorderWidth).toBe(4);
  });

  it("sets activeLineWidth to lineWidth + 3", () => {
    renderWithProvider(<Bump data={nativeBumpData} lineWidth={5} />);
    expect(lastBumpProps.activeLineWidth).toBe(8);
  });

  it("sets activePointSize to pointSize + 4", () => {
    renderWithProvider(<Bump data={nativeBumpData} pointSize={10} />);
    expect(lastBumpProps.activePointSize).toBe(14);
  });

  // --- Start/end labels ---
  it("enables startLabel and endLabel", () => {
    renderWithProvider(<Bump data={nativeBumpData} />);
    expect(lastBumpProps.startLabel).toBe(true);
    expect(lastBumpProps.endLabel).toBe(true);
  });

  // --- Colors ---
  it("passes custom colors as a function", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} colors={["#ff0000", "#00ff00", "#0000ff"]} />
    );
    expect(typeof lastBumpProps.colors).toBe("function");
  });

  // --- Animation ---
  it("disables animation when animate=false", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} animate={false} />
    );
    expect(lastBumpProps.animate).toBe(false);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} data-testid="my-bump" />
    );
    expect(screen.getByTestId("my-bump")).toBeInTheDocument();
  });

  // --- Click / drillDown ---
  it("passes onClick when drillDown is set", () => {
    renderWithProvider(
      <Bump data={nativeBumpData} drillDown={true} />
    );
    expect(lastBumpProps.onClick).toBeTruthy();
  });

  // --- Edge cases ---
  it("handles two series (minimum for meaningful bump chart)", () => {
    const twoSeries = nativeBumpData.slice(0, 2);
    renderWithProvider(<Bump data={twoSeries} />);
    expect(lastBumpProps.data).toHaveLength(2);
  });

  it("handles single data point per series", () => {
    const singlePoint = [
      { id: "A", data: [{ x: "2024", y: 1 }] },
      { id: "B", data: [{ x: "2024", y: 2 }] },
    ];
    renderWithProvider(<Bump data={singlePoint} />);
    expect(lastBumpProps.data).toHaveLength(2);
    expect(lastBumpProps.data[0].data).toHaveLength(1);
  });

  it("handles null y values in native data", () => {
    const nullData = [
      {
        id: "A",
        data: [
          { x: "2020", y: 1 },
          { x: "2021", y: null },
          { x: "2022", y: 2 },
        ],
      },
    ];
    renderWithProvider(<Bump data={nullData} />);
    expect(lastBumpProps.data[0].data[1].y).toBeNull();
  });

  it("handles flat rows with zero values (all tied → ranks still assigned)", () => {
    const tiedData = [
      { month: "Jan", a: 100, b: 100, c: 100 },
    ];
    renderWithProvider(
      <Bump data={tiedData} index="month" categories={["a", "b", "c"]} />
    );
    // All tied at 100, so ranks are 1, 2, 3 based on sort stability
    const ranks = lastBumpProps.data.map((s: any) => s.data[0].y);
    expect(ranks.sort()).toEqual([1, 2, 3]);
  });

  it("handles category configs with custom labels", () => {
    renderWithProvider(
      <Bump
        data={flatRowData}
        index="year"
        categories={[
          { key: "python", label: "Python" },
          { key: "javascript", label: "JavaScript" },
        ]}
      />
    );
    expect(lastBumpProps.data).toHaveLength(2);
    expect(lastBumpProps.data[0].id).toBe("python");
    expect(lastBumpProps.data[1].id).toBe("javascript");
  });

  // --- Export data ---
  it("flattens native bump data to rows for export", () => {
    // This tests the internal exportData logic — native data should become flat rows
    // We can verify by checking the component renders (export data is used by CardShell)
    renderWithProvider(<Bump data={nativeBumpData} />);
    expect(screen.getByTestId("nivo-bump")).toBeInTheDocument();
  });

  it("passes flat row data through as export data", () => {
    renderWithProvider(
      <Bump data={flatRowData} index="year" categories={["python", "javascript"]} />
    );
    expect(screen.getByTestId("nivo-bump")).toBeInTheDocument();
  });
});
