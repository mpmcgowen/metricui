import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("SectionHeader", () => {
  it("renders title", () => {
    renderWithProvider(<SectionHeader title="Revenue" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" subtitle="Monthly breakdown" />
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Monthly breakdown")).toBeInTheDocument();
  });

  it("renders description popover trigger", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" description="Detailed info about this section" />
    );
    const trigger = screen.getByLabelText("More info");
    expect(trigger).toBeInTheDocument();
  });

  it("renders action slot", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" action={<button>View all</button>} />
    );
    expect(screen.getByText("View all")).toBeInTheDocument();
  });

  it("renders badge inline", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" badge={<span>NEW</span>} />
    );
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("applies border class when border=true", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" border data-testid="bordered" />
    );
    const el = screen.getByTestId("bordered");
    expect(el.className).toContain("border-b");
  });

  it("applies spacing class by default, no spacing when spacing=false", () => {
    const { rerender } = renderWithProvider(
      <SectionHeader title="Revenue" data-testid="spaced" />
    );
    const el = screen.getByTestId("spaced");
    expect(el.className).toContain("mt-");

    rerender(
      <MetricProvider>
        <SectionHeader title="Revenue" spacing={false} data-testid="unspaced" />
      </MetricProvider>
    );
    const el2 = screen.getByTestId("unspaced");
    expect(el2.className).not.toContain("mt-");
  });

  it("dense mode reduces text sizes", () => {
    const { rerender } = renderWithProvider(
      <SectionHeader title="Revenue" data-testid="normal" />
    );
    const normalEl = screen.getByTestId("normal");
    const normalTitle = normalEl.querySelector("p");
    expect(normalTitle?.className).toContain("text-[length:var(--mu-text-2xs)]");

    rerender(
      <MetricProvider>
        <SectionHeader title="Revenue" dense data-testid="dense" />
      </MetricProvider>
    );
    const denseEl = screen.getByTestId("dense");
    const denseTitle = denseEl.querySelector("p");
    expect(denseTitle?.className).toContain("text-[9px]");
  });

  it("data-testid passthrough", () => {
    renderWithProvider(
      <SectionHeader title="Revenue" data-testid="my-header" />
    );
    expect(screen.getByTestId("my-header")).toBeInTheDocument();
  });

  it("works inside a grid layout (half-width)", () => {
    renderWithProvider(
      <div className="grid grid-cols-2 gap-4">
        <SectionHeader title="Left Section" data-testid="left" />
        <SectionHeader title="Right Section" data-testid="right" />
      </div>
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
    expect(screen.getByText("Left Section")).toBeInTheDocument();
    expect(screen.getByText("Right Section")).toBeInTheDocument();
  });
});
