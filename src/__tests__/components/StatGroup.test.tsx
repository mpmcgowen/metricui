import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatGroup } from "@/components/cards/StatGroup";
import type { StatItem } from "@/components/cards/StatGroup";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

const basicStats: StatItem[] = [
  { label: "Users", value: 1200 },
  { label: "Revenue", value: "$45K" },
  { label: "Orders", value: 320 },
];

describe("StatGroup", () => {
  it("renders all stat items", () => {
    const { container } = renderWithProvider(<StatGroup stats={basicStats} animate={false} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    // Numeric values rendered through KpiCard's format engine
    expect(container.textContent).toContain("1.2K"); // 1200 compact
    expect(container.textContent).toContain("$45K"); // pre-formatted string
    expect(container.textContent).toContain("320"); // small number
  });

  it("shows trend indicators for items with previousValue", () => {
    const statsWithTrend: StatItem[] = [
      { label: "Users", value: 1200, previousValue: 1000 },
      { label: "Revenue", value: 500, previousValue: 600 },
    ];
    renderWithProvider(<StatGroup stats={statsWithTrend} />);
    // Should show comparison labels like "+20.0%" and "-16.7%"
    expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
    expect(screen.getByText(/16\.7%/)).toBeInTheDocument();
  });

  it("shows loading skeleton when loading=true", () => {
    const { container } = renderWithProvider(
      <StatGroup stats={basicStats} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".mu-shimmer");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("applies dense mode via data attribute", () => {
    const { container } = renderWithProvider(
      <StatGroup stats={basicStats} dense={true} data-testid="sg-dense" />
    );
    // Dense mode sets data-dense on the grid wrapper
    const grid = container.querySelector("[data-dense='true']");
    expect(grid).toBeInTheDocument();
  });

  it("applies data-testid", () => {
    renderWithProvider(
      <StatGroup stats={basicStats} data-testid="stat-group" />
    );
    expect(screen.getByTestId("stat-group")).toBeInTheDocument();
  });

  it("renders title and subtitle when provided", () => {
    renderWithProvider(
      <StatGroup
        stats={basicStats}
        title="Key Metrics"
        subtitle="Updated daily"
      />
    );
    expect(screen.getByText("Key Metrics")).toBeInTheDocument();
    expect(screen.getByText("Updated daily")).toBeInTheDocument();
  });

  it("applies variant via data attribute", () => {
    const { container } = renderWithProvider(
      <StatGroup stats={basicStats} variant="outlined" />
    );
    const grid = container.querySelector("[data-variant='outlined']");
    expect(grid).toBeInTheDocument();
  });
});
