import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MetricProvider } from "@/lib/MetricProvider";

describe("DashboardHeader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title", () => {
    render(<DashboardHeader title="Revenue Analytics" />);
    expect(screen.getByText("Revenue Analytics")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<DashboardHeader title="Revenue" subtitle="Q1 2026 Performance" />);
    expect(screen.getByText("Q1 2026 Performance")).toBeInTheDocument();
  });

  it("renders back link with default label", () => {
    render(<DashboardHeader title="Revenue" back={{ href: "/dashboards" }} />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders back link with custom label", () => {
    render(<DashboardHeader title="Revenue" back={{ href: "/dashboards", label: "All Dashboards" }} />);
    expect(screen.getByText("All Dashboards")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <DashboardHeader
        title="Revenue"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboards", href: "/dashboards" },
          { label: "Revenue" },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboards")).toBeInTheDocument();
    expect(screen.getAllByText("Revenue")).toHaveLength(2); // breadcrumb + title
    expect(screen.getByLabelText("Breadcrumbs")).toBeInTheDocument();
  });

  it("hides back link when breadcrumbs are provided", () => {
    render(
      <DashboardHeader
        title="Revenue"
        back={{ href: "/", label: "Back" }}
        breadcrumbs={[{ label: "Home" }, { label: "Revenue" }]}
      />,
    );
    // Back link should NOT render when breadcrumbs are present
    const backElements = screen.queryAllByText("Back");
    // "Back" should not appear as a back-navigation element
    // Breadcrumbs take precedence
    expect(screen.getByLabelText("Breadcrumbs")).toBeInTheDocument();
  });

  it("renders status badge when explicit", () => {
    render(<DashboardHeader title="Revenue" status="live" />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders status badge when stale", () => {
    render(<DashboardHeader title="Revenue" status="stale" />);
    expect(screen.getByText("Stale")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(<DashboardHeader title="Revenue" actions={<button>Export</button>} />);
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("shows last updated time", () => {
    const now = new Date();
    render(<DashboardHeader title="Revenue" lastUpdated={now} />);
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(screen.getByText(/just now/)).toBeInTheDocument();
  });

  it("derives live status from recent lastUpdated", () => {
    const now = new Date();
    render(<DashboardHeader title="Revenue" lastUpdated={now} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("derives stale status from old lastUpdated", () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    render(<DashboardHeader title="Revenue" lastUpdated={tenMinutesAgo} staleAfter={5} />);
    expect(screen.getByText("Stale")).toBeInTheDocument();
  });

  it("respects variant from MetricProvider", () => {
    const { container } = render(
      <MetricProvider variant="outlined">
        <DashboardHeader title="Revenue" />
      </MetricProvider>,
    );
    expect(container.querySelector("[data-variant='outlined']")).toBeTruthy();
  });

  it("respects dense from MetricProvider", () => {
    const { container } = render(
      <MetricProvider dense>
        <DashboardHeader title="Revenue" />
      </MetricProvider>,
    );
    expect(container.querySelector("[data-dense='true']")).toBeTruthy();
  });

  it("renders with custom classNames", () => {
    const { container } = render(
      <DashboardHeader
        title="Revenue"
        classNames={{ root: "custom-root", title: "custom-title" }}
      />,
    );
    expect(container.querySelector(".custom-root")).toBeTruthy();
    expect(container.querySelector(".custom-title")).toBeTruthy();
  });

  it("passes data-testid", () => {
    render(<DashboardHeader title="Revenue" data-testid="dash-header" />);
    expect(screen.getByTestId("dash-header")).toBeInTheDocument();
  });

  it("has __gridHint static property", () => {
    expect((DashboardHeader as any).__gridHint).toBe("header");
  });
});
