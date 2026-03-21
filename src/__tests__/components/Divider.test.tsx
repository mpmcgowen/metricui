import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Divider } from "@/components/ui/Divider";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("Divider", () => {
  it("renders horizontal divider by default", () => {
    renderWithProvider(<Divider data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el).toBeInTheDocument();
    expect(el.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("renders with label centered", () => {
    renderWithProvider(<Divider label="or" data-testid="div" />);
    expect(screen.getByText("or")).toBeInTheDocument();
    const el = screen.getByTestId("div");
    expect(el.getAttribute("role")).toBe("separator");
  });

  it("renders with icon", () => {
    renderWithProvider(
      <Divider icon={<span data-testid="icon">★</span>} data-testid="div" />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("vertical orientation works", () => {
    renderWithProvider(<Divider orientation="vertical" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.getAttribute("aria-orientation")).toBe("vertical");
    expect(el.className).toContain("border-l");
  });

  it("dashed variant applies border-dashed", () => {
    renderWithProvider(<Divider variant="dashed" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("border-dashed");
  });

  it("dotted variant applies border-dotted", () => {
    renderWithProvider(<Divider variant="dotted" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("border-dotted");
  });

  it("accent color mode applies accent border class", () => {
    renderWithProvider(<Divider accent data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("border-[var(--accent)]");
  });

  it("spacing none removes spacing classes", () => {
    renderWithProvider(<Divider spacing="none" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).not.toContain("my-");
  });

  it("spacing sm applies my-2", () => {
    renderWithProvider(<Divider spacing="sm" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("my-2");
  });

  it("spacing md applies my-4 (default)", () => {
    renderWithProvider(<Divider data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("my-4");
  });

  it("spacing lg applies my-8", () => {
    renderWithProvider(<Divider spacing="lg" data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.className).toContain("my-8");
  });

  it("dense mode reduces spacing", () => {
    renderWithProvider(<Divider dense spacing="md" data-testid="div" />);
    const el = screen.getByTestId("div");
    // Dense md = my-2 instead of my-4
    expect(el.className).toContain("my-2");
    expect(el.className).not.toContain("my-4");
  });

  it("sets role=separator and aria-orientation", () => {
    renderWithProvider(<Divider data-testid="div" />);
    const el = screen.getByTestId("div");
    expect(el.getAttribute("role")).toBe("separator");
    expect(el.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("data-testid passthrough", () => {
    renderWithProvider(<Divider data-testid="my-divider" />);
    expect(screen.getByTestId("my-divider")).toBeInTheDocument();
  });
});
