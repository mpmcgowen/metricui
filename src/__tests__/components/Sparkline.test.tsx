import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sparkline } from "@/components/charts/Sparkline";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Mock Nivo — jsdom has no layout engine so responsive wrappers break
// ---------------------------------------------------------------------------

vi.mock("@nivo/line", () => ({
  ResponsiveLine: (props: any) => (
    <div
      data-testid="nivo-line"
      data-enable-slices={props.enableSlices || "false"}
      data-animate={String(props.animate)}
      data-points={JSON.stringify(props.data?.[0]?.data?.length ?? 0)}
    />
  ),
}));

vi.mock("@nivo/bar", () => ({
  ResponsiveBar: (props: any) => (
    <div
      data-testid="nivo-bar"
      data-interactive={String(props.isInteractive)}
      data-animate={String(props.animate)}
      data-count={String(props.data?.length ?? 0)}
    />
  ),
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Sparkline", () => {
  it("renders with data (line type by default)", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30, 40, 50]} data-testid="spark" />
    );
    expect(screen.getByTestId("spark")).toBeInTheDocument();
    // Should render a Nivo line chart
    expect(screen.getByTestId("nivo-line")).toBeInTheDocument();
  });

  it("handles empty data array without crashing", () => {
    renderWithProvider(
      <Sparkline data={[]} data-testid="spark-empty" />
    );
    expect(screen.getByTestId("spark-empty")).toBeInTheDocument();
    expect(screen.getByTestId("nivo-line")).toBeInTheDocument();
  });

  it("handles single data point", () => {
    renderWithProvider(
      <Sparkline data={[42]} data-testid="spark-single" />
    );
    expect(screen.getByTestId("spark-single")).toBeInTheDocument();
    const nivoLine = screen.getByTestId("nivo-line");
    // Single data point should still produce a valid chart
    expect(nivoLine.getAttribute("data-points")).toBe("1");
  });

  it("bar type renders ResponsiveBar instead of ResponsiveLine", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} type="bar" data-testid="spark-bar" />
    );
    expect(screen.getByTestId("spark-bar")).toBeInTheDocument();
    expect(screen.getByTestId("nivo-bar")).toBeInTheDocument();
    expect(screen.queryByTestId("nivo-line")).not.toBeInTheDocument();
  });

  it("interactive sparkline enables slices for tooltip area", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} interactive data-testid="spark-interactive" />
    );
    const nivoLine = screen.getByTestId("nivo-line");
    expect(nivoLine.getAttribute("data-enable-slices")).toBe("x");
  });

  it("non-interactive sparkline disables slices", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} data-testid="spark-default" />
    );
    const nivoLine = screen.getByTestId("nivo-line");
    expect(nivoLine.getAttribute("data-enable-slices")).toBe("false");
  });

  it("respects height prop", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} height={60} data-testid="spark-height" />
    );
    const container = screen.getByTestId("spark-height");
    expect(container.style.height).toBe("60px");
  });

  it("uses 100% height when height prop is not set", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} data-testid="spark-auto" />
    );
    const container = screen.getByTestId("spark-auto");
    expect(container.style.height).toBe("100%");
  });

  it("respects width prop", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30]} width={120} data-testid="spark-width" />
    );
    const container = screen.getByTestId("spark-width");
    expect(container.style.width).toBe("120px");
  });

  it("bar type with interactive prop sets isInteractive", () => {
    renderWithProvider(
      <Sparkline data={[10, 20]} type="bar" interactive data-testid="spark-bar-int" />
    );
    const nivoBar = screen.getByTestId("nivo-bar");
    expect(nivoBar.getAttribute("data-interactive")).toBe("true");
  });

  it("bar type renders correct number of bars", () => {
    renderWithProvider(
      <Sparkline data={[10, 20, 30, 40]} type="bar" data-testid="spark-bar-count" />
    );
    const nivoBar = screen.getByTestId("nivo-bar");
    expect(nivoBar.getAttribute("data-count")).toBe("4");
  });

  it("applies custom className", () => {
    renderWithProvider(
      <Sparkline data={[10, 20]} className="my-custom-class" data-testid="spark-cls" />
    );
    const container = screen.getByTestId("spark-cls");
    expect(container.className).toContain("my-custom-class");
  });
});
