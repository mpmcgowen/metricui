import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Headline } from "@/components/ui/Headline";
import { MetricProvider } from "@/lib/MetricProvider";

// Disable animation so useCountUp returns target immediately
function W({ children }: { children: React.ReactNode }) {
  return <MetricProvider animate={false}>{children}</MetricProvider>;
}

describe("Headline", () => {
  it("renders string shorthand", () => {
    render(<W><Headline headline="$1.2M total" /></W>);
    expect(screen.getByText("$1.2M total")).toBeTruthy();
  });

  it("renders formatted value with compact", () => {
    render(<W><Headline headline={{ value: 1200000, format: "compact" }} /></W>);
    expect(screen.getByText("1.2M")).toBeTruthy();
  });

  it("renders with label", () => {
    render(<W><Headline headline={{ value: 500, format: "number", label: "Total" }} /></W>);
    expect(screen.getByText("Total")).toBeTruthy();
    expect(screen.getByText("500")).toBeTruthy();
  });

  it("renders currency format", () => {
    const { container } = render(<W><Headline headline={{ value: 42000, format: "currency" }} /></W>);
    expect(container.textContent).toMatch(/\$.*42/);
  });

  it("renders percent format (whole input)", () => {
    const { container } = render(<W><Headline headline={{ value: 15, format: "percent" }} /></W>);
    expect(container.textContent).toMatch(/15/);
  });

  it("renders percent format (decimal input)", () => {
    const { container } = render(
      <W><Headline headline={{ value: 0.15, format: { style: "percent", percentInput: "decimal" } }} /></W>
    );
    expect(container.textContent).toMatch(/15/);
  });

  it("renders comparison badge", () => {
    const { container } = render(
      <W><Headline headline={{ value: 100, format: "number", comparison: { value: 80 } }} /></W>
    );
    // Should show some percentage change text
    expect(container.textContent).toMatch(/25|%/);
  });

  it("applies conditional color", () => {
    const { container } = render(
      <W>
        <Headline headline={{
          value: 150,
          format: "number",
          conditions: [{ when: "above", value: 100, color: "emerald" }],
        }} />
      </W>
    );
    const valueEl = container.querySelector("[style*='color']");
    expect(valueEl).toBeTruthy();
    // Browser may convert hex to rgb
    const style = valueEl?.getAttribute("style") ?? "";
    expect(style).toMatch(/color/);
    expect(style).toMatch(/#10B981|rgb\(16,\s*185,\s*129\)/);
  });

  it("renders zero value", () => {
    render(<W><Headline headline={{ value: 0, format: "number" }} /></W>);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("renders negative value", () => {
    const { container } = render(<W><Headline headline={{ value: -500, format: "number" }} /></W>);
    expect(container.textContent).toMatch(/-500/);
  });

  it("renders without label when not provided", () => {
    render(<W><Headline headline={{ value: 42, format: "number" }} /></W>);
    expect(screen.getByText("42")).toBeTruthy();
  });
});
