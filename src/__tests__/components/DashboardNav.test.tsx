import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardNav, type DashboardNavTab } from "@/components/layout/DashboardNav";
import { MetricProvider } from "@/lib/MetricProvider";

// Mock ResizeObserver for indicator calculations
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as any;

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Common tabs
// ---------------------------------------------------------------------------

const TABS: DashboardNavTab[] = [
  { value: "overview", label: "Overview" },
  { value: "revenue", label: "Revenue" },
  { value: "users", label: "Users" },
];

const TABS_WITH_BADGES: DashboardNavTab[] = [
  { value: "overview", label: "Overview", badge: 1250 },
  { value: "revenue", label: "Revenue", badge: 98400, badgeFormat: "currency" },
  { value: "users", label: "Users", badge: 3200 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DashboardNav", () => {
  beforeEach(() => {
    // Reset URL params between tests
    window.history.replaceState({}, "", window.location.pathname);
  });

  it("renders all tab labels", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="nav" />
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("active tab gets aria-selected", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} defaultValue="revenue" data-testid="nav" />
    );
    const tabs = screen.getAllByRole("tab");
    const revenueTab = tabs.find((t) => t.textContent?.includes("Revenue"))!;
    const overviewTab = tabs.find((t) => t.textContent?.includes("Overview"))!;

    expect(revenueTab.getAttribute("aria-selected")).toBe("true");
    expect(overviewTab.getAttribute("aria-selected")).toBe("false");
  });

  it("first tab is active by default when no defaultValue", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="nav" />
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
  });

  it("clicking a tab calls onChange with the tab value", () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DashboardNav tabs={TABS} onChange={onChange} data-testid="nav" />
    );
    fireEvent.click(screen.getByText("Revenue"));
    expect(onChange).toHaveBeenCalledWith("revenue");
  });

  it("clicking a tab updates active state", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="nav" />
    );
    fireEvent.click(screen.getByText("Users"));

    const tabs = screen.getAllByRole("tab");
    const usersTab = tabs.find((t) => t.textContent?.includes("Users"))!;
    expect(usersTab.getAttribute("aria-selected")).toBe("true");
  });

  it("keyboard navigation: ArrowRight moves to next tab", () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DashboardNav tabs={TABS} onChange={onChange} data-testid="nav" />
    );

    const tablist = screen.getByRole("tablist");
    // Fire ArrowRight from the tablist
    fireEvent.keyDown(tablist, { key: "ArrowRight" });

    // Should have moved to "revenue" (index 1)
    expect(onChange).toHaveBeenCalledWith("revenue");
  });

  it("keyboard navigation: ArrowLeft wraps around to last tab", () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DashboardNav tabs={TABS} onChange={onChange} data-testid="nav" />
    );

    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });

    // Should wrap to last tab "users"
    expect(onChange).toHaveBeenCalledWith("users");
  });

  it("keyboard navigation: Home goes to first tab, End goes to last", () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DashboardNav tabs={TABS} defaultValue="revenue" onChange={onChange} data-testid="nav" />
    );

    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(onChange).toHaveBeenCalledWith("users");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("badge renders formatted number", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS_WITH_BADGES} data-testid="nav" />
    );
    // 1250 with compact format should render as "1.3K" (rounds up)
    expect(screen.getByText("1.3K")).toBeInTheDocument();
    // 3200 with compact format should render as "3.2K"
    expect(screen.getByText("3.2K")).toBeInTheDocument();
  });

  it("badge with currency format renders correctly", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS_WITH_BADGES} data-testid="nav" />
    );
    // 98400 with currency format
    expect(screen.getByText("$98.4K")).toBeInTheDocument();
  });

  it("syncUrl writes to URL params on tab click", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} syncUrl="tab" data-testid="nav" />
    );

    fireEvent.click(screen.getByText("Revenue"));

    const url = new URL(window.location.href);
    expect(url.searchParams.get("tab")).toBe("revenue");
  });

  it("syncUrl reads initial value from URL", () => {
    // Set URL param before rendering
    const url = new URL(window.location.href);
    url.searchParams.set("view", "users");
    window.history.replaceState({}, "", url.toString());

    renderWithProvider(
      <DashboardNav tabs={TABS} syncUrl="view" data-testid="nav" />
    );

    const tabs = screen.getAllByRole("tab");
    const usersTab = tabs.find((t) => t.textContent?.includes("Users"))!;
    expect(usersTab.getAttribute("aria-selected")).toBe("true");
  });

  it("renders tablist with correct role and aria-label", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="nav" />
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    expect(tablist.getAttribute("aria-label")).toBe("Dashboard navigation");
  });

  it("controlled value prop overrides internal state", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} value="users" data-testid="nav" />
    );

    const tabs = screen.getAllByRole("tab");
    const usersTab = tabs.find((t) => t.textContent?.includes("Users"))!;
    expect(usersTab.getAttribute("aria-selected")).toBe("true");

    // Click overview — should NOT change active since it's controlled
    fireEvent.click(screen.getByText("Overview"));

    // Users should still be selected (controlled mode — internal state changes but value prop wins)
    expect(usersTab.getAttribute("aria-selected")).toBe("true");
  });

  it("data-testid passthrough", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="my-nav" />
    );
    expect(screen.getByTestId("my-nav")).toBeInTheDocument();
  });

  it("stores tab values in data-dashboard-tabs attribute", () => {
    renderWithProvider(
      <DashboardNav tabs={TABS} data-testid="nav" />
    );
    const nav = screen.getByTestId("nav");
    expect(nav.getAttribute("data-dashboard-tabs")).toBe("overview,revenue,users");
  });
});
