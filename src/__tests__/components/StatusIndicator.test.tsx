import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatusIndicator, type StatusRule } from "@/components/ui/StatusIndicator";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Common rules
// ---------------------------------------------------------------------------

const HEALTH_RULES: StatusRule[] = [
  { min: 90, color: "emerald", label: "Healthy", pulse: false },
  { min: 70, max: 90, color: "amber", label: "Warning", pulse: true },
  { max: 70, color: "red", label: "Critical", pulse: true },
];

const SIMPLE_RULES: StatusRule[] = [
  { min: 50, color: "green", label: "Good" },
  { max: 50, color: "red", label: "Bad" },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("StatusIndicator", () => {
  it("matches the correct rule based on value — high value matches first rule", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("matches the correct rule based on value — mid value matches second rule", () => {
    renderWithProvider(
      <StatusIndicator
        value={80}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("matches the correct rule based on value — low value matches third rule", () => {
    renderWithProvider(
      <StatusIndicator
        value={50}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("uses last rule as fallback for null values", () => {
    renderWithProvider(
      <StatusIndicator
        value={null}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    // Last rule is "Critical"
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("pulse animation applied when matched rule has pulse: true", () => {
    const { container } = renderWithProvider(
      <StatusIndicator
        value={80}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    // Warning rule has pulse: true — the icon container should have animate-pulse
    const pulseEl = container.querySelector(".animate-pulse");
    expect(pulseEl).toBeTruthy();
  });

  it("no pulse animation when matched rule has pulse: false", () => {
    const { container } = renderWithProvider(
      <StatusIndicator
        value={95}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    // Healthy rule has pulse: false
    const pulseEl = container.querySelector(".animate-pulse");
    expect(pulseEl).toBeNull();
  });

  it("dot size renders correctly", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="dot"
        data-testid="status"
      />
    );
    const el = screen.getByTestId("status");
    expect(el.tagName).toBe("SPAN");
    // Dot mode should have rounded-full and small dimensions
    expect(el.className).toContain("rounded-full");
    expect(el.className).toContain("h-2.5");
    expect(el.className).toContain("w-2.5");
  });

  it("sm size renders dot + label inline", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="sm"
        data-testid="status"
      />
    );
    const el = screen.getByTestId("status");
    expect(el.className).toContain("inline-flex");
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("md size renders icon + label", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="md"
        data-testid="status"
      />
    );
    expect(screen.getByText("Good")).toBeInTheDocument();
    const el = screen.getByTestId("status");
    expect(el.className).toContain("inline-flex");
  });

  it("lg size renders title and label", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="lg"
        title="System Status"
        data-testid="status"
      />
    );
    expect(screen.getByText("System Status")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("card mode wraps in CardShell", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="card"
        title="System Health"
        data-testid="status"
      />
    );
    const el = screen.getByTestId("status");
    // CardShell renders with data-metric-card attribute
    expect(el.getAttribute("data-metric-card")).not.toBeNull();
    // CardShell renders data-component
    expect(el.getAttribute("data-component")).toBe("StatusIndicator");
    // Title should be rendered
    expect(screen.getByText("System Health")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("showValue displays the numeric value", () => {
    renderWithProvider(
      <StatusIndicator
        value={85}
        rules={HEALTH_RULES}
        size="md"
        showValue
        data-testid="status"
      />
    );
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("onClick makes element clickable", () => {
    const onClick = vi.fn();
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="md"
        onClick={onClick}
        data-testid="status"
      />
    );
    const el = screen.getByTestId("status");
    expect(el.className).toContain("cursor-pointer");
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("loading state shows skeleton", () => {
    const { container } = renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="md"
        loading
        data-testid="status"
      />
    );
    const pulseEl = container.querySelector(".animate-pulse");
    expect(pulseEl).toBeTruthy();
    // Should not show the actual label
    expect(screen.queryByText("Good")).not.toBeInTheDocument();
  });

  it("trend arrows display correctly", () => {
    renderWithProvider(
      <StatusIndicator
        value={95}
        rules={SIMPLE_RULES}
        size="lg"
        trend={[80, 90, 95]}
        data-testid="status"
      />
    );
    // Last value > previous = uptrend
    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("boundary value: exactly at min threshold matches the rule", () => {
    renderWithProvider(
      <StatusIndicator
        value={90}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    // value=90 should match min:90 (inclusive) = "Healthy"
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("boundary value: exactly at max threshold does NOT match (exclusive)", () => {
    renderWithProvider(
      <StatusIndicator
        value={70}
        rules={HEALTH_RULES}
        size="md"
        data-testid="status"
      />
    );
    // value=70 hits min:70 max:90 (min inclusive, max exclusive) = "Warning"
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });
});
