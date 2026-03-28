import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mock Nivo responsive components — jsdom has no real layout so Nivo's
// responsive wrappers break. We mock them as simple divs so we can test
// our wrapper logic (title, loading, config resolution) without Nivo internals.
// ---------------------------------------------------------------------------

vi.mock("@nivo/line", () => ({
  ResponsiveLine: (props: any) => <div data-testid="nivo-line" />,
}));

vi.mock("@nivo/bar", () => ({
  ResponsiveBar: (props: any) => <div data-testid="nivo-bar" />,
}));

vi.mock("@nivo/pie", () => ({
  ResponsivePie: (props: any) => <div data-testid="nivo-pie" />,
}));

vi.mock("@nivo/heatmap", () => ({
  ResponsiveHeatMap: (props: any) => <div data-testid="nivo-heatmap" />,
}));

vi.mock("@nivo/funnel", () => ({
  ResponsiveFunnel: (props: any) => <div data-testid="nivo-funnel" />,
}));

vi.mock("@nivo/bullet", () => ({
  ResponsiveBullet: (props: any) => <div data-testid="nivo-bullet" />,
}));

// Mock useContainerSize to return usable dimensions
vi.mock("@/lib/useContainerSize", () => ({
  useContainerSize: () => ({
    ref: { current: null },
    width: 800,
    height: 400,
  }),
}));

// Mock useChartLegend to prevent errors
vi.mock("@/lib/useChartLegend", () => ({
  useChartLegend: () => ({
    hidden: new Set(),
    toggle: vi.fn(),
    legendConfig: null,
  }),
}));

// Now import the actual components (after mocks are set up)
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Gauge } from "@/components/charts/Gauge";
import { HeatMap } from "@/components/charts/HeatMap";
import { Funnel } from "@/components/charts/Funnel";
import { BulletChart } from "@/components/charts/BulletChart";
import { Waterfall } from "@/components/charts/Waterfall";

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <MetricProvider>{ui}</MetricProvider>
  );
}

// ---------------------------------------------------------------------------
// AreaChart
// ---------------------------------------------------------------------------

describe("AreaChart", () => {
  const areaData = [
    { id: "A", data: [{ x: "Jan", y: 10 }, { x: "Feb", y: 20 }] },
  ];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <AreaChart data={areaData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<AreaChart data={areaData} title="Traffic" />);
    expect(screen.getByText("Traffic")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <AreaChart data={areaData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// LineChart
// ---------------------------------------------------------------------------

describe("LineChart", () => {
  const lineData = [
    { id: "A", data: [{ x: "Jan", y: 10 }, { x: "Feb", y: 20 }] },
  ];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <LineChart data={lineData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<LineChart data={lineData} title="Trend" />);
    expect(screen.getByText("Trend")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <LineChart data={lineData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// BarChart
// ---------------------------------------------------------------------------

describe("BarChart", () => {
  const barData = [{ month: "Jan", value: 10 }];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <BarChart data={barData} categories={["value"]} index="month" />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(
      <BarChart data={barData} categories={["value"]} index="month" title="Sales" />
    );
    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <BarChart data={barData} categories={["value"]} index="month" loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// DonutChart
// ---------------------------------------------------------------------------

describe("DonutChart", () => {
  const donutData = [{ id: "a", label: "A", value: 10 }];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <DonutChart data={donutData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<DonutChart data={donutData} title="Distribution" />);
    expect(screen.getByText("Distribution")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <DonutChart data={donutData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Gauge
// ---------------------------------------------------------------------------

describe("Gauge", () => {
  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <Gauge value={50} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<Gauge value={50} title="CPU Usage" />);
    expect(screen.getByText("CPU Usage")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Gauge value={50} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// HeatMap
// ---------------------------------------------------------------------------

describe("HeatMap", () => {
  const heatData = [{ id: "Row1", data: [{ x: "Col1", y: 10 }] }];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <HeatMap data={heatData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<HeatMap data={heatData} title="Activity" />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <HeatMap data={heatData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

describe("Funnel", () => {
  const funnelData = [
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
  ];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <Funnel data={funnelData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<Funnel data={funnelData} title="Conversion" />);
    expect(screen.getByText("Conversion")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Funnel data={funnelData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// BulletChart
// ---------------------------------------------------------------------------

describe("BulletChart", () => {
  const bulletData = [
    {
      id: "revenue",
      title: "Revenue",
      ranges: [150, 225, 300],
      measures: [220],
      markers: [250],
    },
  ];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <BulletChart data={bulletData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<BulletChart data={bulletData} title="Performance" />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <BulletChart data={bulletData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Waterfall
// ---------------------------------------------------------------------------

describe("Waterfall", () => {
  const waterfallData = [
    { label: "Revenue", value: 500000 },
    { label: "COGS", value: -200000 },
    { label: "Net", type: "total" as const },
  ];

  it("renders without crashing with minimal valid data", () => {
    const { container } = renderWithProvider(
      <Waterfall data={waterfallData} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("shows title when provided", () => {
    renderWithProvider(<Waterfall data={waterfallData} title="P&L Bridge" />);
    expect(screen.getByText("P&L Bridge")).toBeInTheDocument();
  });

  it("shows loading state when loading=true", () => {
    const { container } = renderWithProvider(
      <Waterfall data={waterfallData} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});
