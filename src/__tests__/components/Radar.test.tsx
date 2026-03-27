import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let lastRadarProps: any = null;

vi.mock("@nivo/radar", () => ({
  ResponsiveRadar: (props: any) => {
    lastRadarProps = props;
    return <div data-testid="nivo-radar" />;
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

import { Radar } from "@/components/charts/Radar";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const radarData = [
  { skill: "JS", alice: 90, bob: 70 },
  { skill: "CSS", alice: 75, bob: 85 },
  { skill: "HTML", alice: 95, bob: 80 },
  { skill: "React", alice: 85, bob: 60 },
  { skill: "Node", alice: 70, bob: 90 },
];

const singleSeriesData = [
  { metric: "Speed", score: 80 },
  { metric: "Power", score: 65 },
  { metric: "Agility", score: 90 },
  { metric: "Stamina", score: 75 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Radar", () => {
  beforeEach(() => {
    lastRadarProps = null;
  });

  // --- Basic rendering ---
  it("renders without crashing with minimal data", () => {
    const { container } = renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice", "bob"]} />
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("nivo-radar")).toBeInTheDocument();
  });

  it("passes correct keys and indexBy to Nivo", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice", "bob"]} />
    );
    expect(lastRadarProps.keys).toEqual(["alice", "bob"]);
    expect(lastRadarProps.indexBy).toBe("skill");
  });

  it("passes data through to Nivo", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice", "bob"]} />
    );
    expect(lastRadarProps.data).toHaveLength(5);
    expect(lastRadarProps.data[0].skill).toBe("JS");
  });

  // --- Auto-inference ---
  it("auto-infers index and categories when not explicitly provided", () => {
    renderWithProvider(<Radar data={radarData} />);
    // inferSchema should detect 'skill' as index (first string column)
    // and 'alice', 'bob' as categories (number columns)
    expect(lastRadarProps.indexBy).toBe("skill");
    expect(lastRadarProps.keys).toContain("alice");
    expect(lastRadarProps.keys).toContain("bob");
  });

  // --- Single series ---
  it("renders single series radar", () => {
    renderWithProvider(
      <Radar data={singleSeriesData} index="metric" categories={["score"]} />
    );
    expect(lastRadarProps.keys).toEqual(["score"]);
    expect(lastRadarProps.data).toHaveLength(4);
  });

  // --- Empty data ---
  it("handles empty data array gracefully", () => {
    const { container } = renderWithProvider(
      <Radar data={[]} index="skill" categories={["alice"]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("handles undefined data gracefully", () => {
    const { container } = renderWithProvider(<Radar />);
    expect(container.firstChild).toBeTruthy();
  });

  // --- Data states ---
  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} error={{ message: "Oops" }} />
    );
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });

  it("shows stale indicator when stale=true", () => {
    const { container } = renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} stale={{ since: new Date() }} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  // --- Title / subtitle ---
  it("shows title when provided", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} title="Skills Comparison" />
    );
    expect(screen.getByText("Skills Comparison")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} title="Skills" subtitle="Team A" />
    );
    expect(screen.getByText("Team A")).toBeInTheDocument();
  });

  // --- Format ---
  it("passes valueFormat function to Nivo", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} format="percent" />
    );
    expect(typeof lastRadarProps.valueFormat).toBe("function");
  });

  // --- Props pass-through ---
  it("passes fillOpacity to Nivo", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} fillOpacity={0.5} />
    );
    expect(lastRadarProps.fillOpacity).toBe(0.5);
  });

  it("defaults fillOpacity to 0.25", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} />
    );
    expect(lastRadarProps.fillOpacity).toBe(0.25);
  });

  it("passes borderWidth", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} borderWidth={4} />
    );
    expect(lastRadarProps.borderWidth).toBe(4);
  });

  it("passes dotSize", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} dotSize={10} />
    );
    expect(lastRadarProps.dotSize).toBe(10);
  });

  it("passes gridLevels", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} gridLevels={3} />
    );
    expect(lastRadarProps.gridLevels).toBe(3);
  });

  it("defaults gridLevels to 5", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} />
    );
    expect(lastRadarProps.gridLevels).toBe(5);
  });

  // --- Colors ---
  it("passes custom colors to Nivo", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice", "bob"]} colors={["#ff0000", "#00ff00"]} />
    );
    // Colors are mapped per visible key
    expect(lastRadarProps.colors).toHaveLength(2);
  });

  // --- Animation ---
  it("disables animation when animate=false", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} animate={false} />
    );
    expect(lastRadarProps.animate).toBe(false);
  });

  // --- data-testid ---
  it("applies data-testid to root element", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} data-testid="my-radar" />
    );
    expect(screen.getByTestId("my-radar")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("passes onClick when drillDown is set", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} drillDown={true} />
    );
    expect(lastRadarProps.onClick).toBeTruthy();
  });

  // --- Edge cases ---
  it("handles data with only 3 dimensions (minimum for radar)", () => {
    const minDimensions = [
      { dim: "A", val: 10 },
      { dim: "B", val: 20 },
      { dim: "C", val: 30 },
    ];
    renderWithProvider(
      <Radar data={minDimensions} index="dim" categories={["val"]} />
    );
    expect(lastRadarProps.data).toHaveLength(3);
  });

  it("handles category configs with custom labels", () => {
    renderWithProvider(
      <Radar
        data={radarData}
        index="skill"
        categories={[
          { key: "alice", label: "Alice Score" },
          { key: "bob", label: "Bob Score" },
        ]}
      />
    );
    expect(lastRadarProps.keys).toEqual(["alice", "bob"]);
  });

  it("uses circular grid shape", () => {
    renderWithProvider(
      <Radar data={radarData} index="skill" categories={["alice"]} />
    );
    expect(lastRadarProps.gridShape).toBe("circular");
  });
});
