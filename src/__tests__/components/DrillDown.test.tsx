import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { DrillDown, useDrillDownAction } from "@/components/ui/DrillDown";
import { useDrillDown } from "@/lib/DrillDownContext";
import { MetricProvider } from "@/lib/MetricProvider";

// ---------------------------------------------------------------------------
// Spy component that reads drill-down context
// ---------------------------------------------------------------------------

function DrillSpy() {
  const drill = useDrillDown();
  return (
    <div data-testid="drill-spy">
      <span data-testid="is-open">{drill?.isOpen ? "true" : "false"}</span>
      <span data-testid="depth">{String(drill?.depth ?? 0)}</span>
      <span data-testid="breadcrumbs">
        {drill?.breadcrumbs.map((b) => b.title).join(",") ?? ""}
      </span>
    </div>
  );
}

/** Component that opens a drill level when clicked */
function DrillOpener({ title, content }: { title: string; content?: React.ReactNode }) {
  const drill = useDrillDown();
  return (
    <button
      data-testid={`open-${title}`}
      onClick={() => drill?.open({ title }, content ?? <div>Content for {title}</div>)}
    >
      Open {title}
    </button>
  );
}

/** Component that uses useDrillDownAction hook */
function ActionHookUser() {
  const openDrill = useDrillDownAction();
  return (
    <button
      data-testid="action-hook"
      onClick={() => openDrill({ title: "Via Hook" }, <div>Hook content</div>)}
    >
      Use Action
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DrillDown", () => {
  it("Root renders children", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <div data-testid="child">Hello</div>
        </DrillDown.Root>
      </MetricProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("useDrillDownAction returns a callable function", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <ActionHookUser />
        </DrillDown.Root>
      </MetricProvider>
    );
    // Button exists and is clickable (function was returned)
    expect(screen.getByTestId("action-hook")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("action-hook"));
    // Panel should open with the title
    expect(screen.getByText("Via Hook")).toBeInTheDocument();
  });

  it("opening a drill sets isOpen to true", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="Level1" />
        </DrillDown.Root>
      </MetricProvider>
    );
    expect(screen.getByTestId("is-open").textContent).toBe("false");

    fireEvent.click(screen.getByTestId("open-Level1"));

    expect(screen.getByTestId("is-open").textContent).toBe("true");
    expect(screen.getByTestId("depth").textContent).toBe("1");
  });

  it("back button pops one level", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="Level1" />
          <DrillOpener title="Level2" />
        </DrillDown.Root>
      </MetricProvider>
    );

    // Open two levels
    fireEvent.click(screen.getByTestId("open-Level1"));
    fireEvent.click(screen.getByTestId("open-Level2"));
    expect(screen.getByTestId("depth").textContent).toBe("2");

    // Click back (the ArrowLeft button with "Go back" label when depth > 1)
    const backButton = screen.getByLabelText("Go back");
    fireEvent.click(backButton);

    expect(screen.getByTestId("depth").textContent).toBe("1");
    expect(screen.getByTestId("is-open").textContent).toBe("true");
  });

  it("close button closes all levels", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="Level1" />
          <DrillOpener title="Level2" />
        </DrillDown.Root>
      </MetricProvider>
    );

    fireEvent.click(screen.getByTestId("open-Level1"));
    fireEvent.click(screen.getByTestId("open-Level2"));
    expect(screen.getByTestId("depth").textContent).toBe("2");

    // Click the X close button
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(screen.getByTestId("is-open").textContent).toBe("false");
    expect(screen.getByTestId("depth").textContent).toBe("0");
  });

  it("Escape key pops one level (calls back)", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="Level1" />
          <DrillOpener title="Level2" />
        </DrillDown.Root>
      </MetricProvider>
    );

    fireEvent.click(screen.getByTestId("open-Level1"));
    fireEvent.click(screen.getByTestId("open-Level2"));
    expect(screen.getByTestId("depth").textContent).toBe("2");

    // Escape goes back one level
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByTestId("depth").textContent).toBe("1");

    // Another Escape closes entirely
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByTestId("depth").textContent).toBe("0");
    expect(screen.getByTestId("is-open").textContent).toBe("false");
  });

  it("max depth (4) replaces top level instead of going deeper", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="L1" />
          <DrillOpener title="L2" />
          <DrillOpener title="L3" />
          <DrillOpener title="L4" />
          <DrillOpener title="L5" />
        </DrillDown.Root>
      </MetricProvider>
    );

    // Open 4 levels (the max)
    fireEvent.click(screen.getByTestId("open-L1"));
    fireEvent.click(screen.getByTestId("open-L2"));
    fireEvent.click(screen.getByTestId("open-L3"));
    fireEvent.click(screen.getByTestId("open-L4"));
    expect(screen.getByTestId("depth").textContent).toBe("4");

    // Opening a 5th should replace the top level, keeping depth at 4
    fireEvent.click(screen.getByTestId("open-L5"));
    expect(screen.getByTestId("depth").textContent).toBe("4");

    // The breadcrumbs should show L1,L2,L3,L5 (L4 was replaced by L5)
    expect(screen.getByTestId("breadcrumbs").textContent).toBe("L1,L2,L3,L5");
  });

  it("breadcrumbs show for nested drills (depth > 1)", () => {
    render(
      <MetricProvider>
        <DrillDown.Root>
          <DrillSpy />
          <DrillOpener title="Countries" />
          <DrillOpener title="United States" />
        </DrillDown.Root>
      </MetricProvider>
    );

    // Single level — no breadcrumbs nav
    fireEvent.click(screen.getByTestId("open-Countries"));
    expect(screen.queryByLabelText("Drill-down breadcrumbs")).not.toBeInTheDocument();

    // Two levels — breadcrumbs should appear
    fireEvent.click(screen.getByTestId("open-United States"));
    expect(screen.getByLabelText("Drill-down breadcrumbs")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
    // "United States" appears both as the panel title and as the breadcrumb — use getAllByText
    expect(screen.getAllByText("United States").length).toBeGreaterThanOrEqual(1);
  });
});
