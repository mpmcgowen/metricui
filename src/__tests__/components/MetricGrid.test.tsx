import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { MetricProvider } from "@/lib/MetricProvider";

// Mock useContainerSize to return usable dimensions
vi.mock("@/lib/useContainerSize", () => ({
  useContainerSize: () => ({
    ref: { current: null },
    width: 1200,
    height: 800,
  }),
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("MetricGrid", () => {
  it("renders children", () => {
    renderWithProvider(
      <MetricGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </MetricGrid>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies data-testid", () => {
    renderWithProvider(
      <MetricGrid data-testid="my-grid">
        <div>Content</div>
      </MetricGrid>
    );
    expect(screen.getByTestId("my-grid")).toBeInTheDocument();
  });
});

describe("MetricGrid.Section", () => {
  it("renders with title", () => {
    renderWithProvider(
      <MetricGrid>
        <MetricGrid.Section title="Overview" />
      </MetricGrid>
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("renders with subtitle", () => {
    renderWithProvider(
      <MetricGrid>
        <MetricGrid.Section title="Overview" subtitle="Key metrics" />
      </MetricGrid>
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Key metrics")).toBeInTheDocument();
  });
});

describe("MetricGrid.Item", () => {
  it("renders children", () => {
    renderWithProvider(
      <MetricGrid>
        <MetricGrid.Item>
          <div>Item Content</div>
        </MetricGrid.Item>
      </MetricGrid>
    );
    expect(screen.getByText("Item Content")).toBeInTheDocument();
  });
});
