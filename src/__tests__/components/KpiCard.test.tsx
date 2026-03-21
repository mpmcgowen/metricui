import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "@/components/cards/KpiCard";
import { MetricProvider } from "@/lib/MetricProvider";

// Mock Sparkline since it uses canvas/SVG internals
vi.mock("@/components/charts/Sparkline", () => ({
  Sparkline: (props: any) => <div data-testid="sparkline-mock" />,
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("KpiCard", () => {
  it("renders with value and title", () => {
    const { container } = renderWithProvider(
      <KpiCard title="Revenue" value={1234} animate={false} />
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(container.textContent).toContain("1.2K");
  });

  it("formats value as currency when format='currency'", () => {
    const { container } = renderWithProvider(
      <KpiCard title="Revenue" value={78400} format="currency" animate={false} />
    );
    expect(container.textContent).toContain("$78.4K");
  });

  it("shows comparison badge when comparison prop is set", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={120}
        comparison={{ value: 100 }}
      />
    );
    // Should show a percentage change label
    expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
  });

  it("shows sparkline when sparkline.data provided", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={100}
        sparkline={{ data: [10, 20, 30, 40, 50] }}
      />
    );
    expect(screen.getByTestId("sparkline-mock")).toBeInTheDocument();
  });

  it("shows goal progress bar when goal provided", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={75}
        goal={{ value: 100 }}
      />
    );
    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("shows null display when value is null", () => {
    renderWithProvider(<KpiCard title="Revenue" value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = renderWithProvider(
      <KpiCard title="Revenue" value={100} loading={true} />
    );
    // KpiSkeleton renders animate-pulse divs
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("applies data-testid", () => {
    renderWithProvider(
      <KpiCard title="Revenue" value={100} data-testid="kpi-revenue" />
    );
    expect(screen.getByTestId("kpi-revenue")).toBeInTheDocument();
  });

  it("applies variant via data attribute", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={100}
        variant="outlined"
        data-testid="kpi-variant"
      />
    );
    const el = screen.getByTestId("kpi-variant");
    expect(el.getAttribute("data-variant")).toBe("outlined");
  });

  it("applies dense mode via data attribute", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={100}
        dense={true}
        data-testid="kpi-dense"
      />
    );
    const el = screen.getByTestId("kpi-dense");
    expect(el.getAttribute("data-dense")).toBe("true");
  });

  it("accepts custom variant string", () => {
    renderWithProvider(
      <KpiCard
        title="Revenue"
        value={100}
        variant="glass"
        data-testid="kpi-custom"
      />
    );
    const el = screen.getByTestId("kpi-custom");
    expect(el.getAttribute("data-variant")).toBe("glass");
  });

  it("renders subtitle when provided", () => {
    renderWithProvider(
      <KpiCard title="Revenue" value={100} subtitle="Last 30 days" />
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });
});
