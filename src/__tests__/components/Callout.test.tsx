import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Callout } from "@/components/ui/Callout";
import { MetricProvider } from "@/lib/MetricProvider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

describe("Callout", () => {
  it("renders with title and children", () => {
    renderWithProvider(
      <Callout title="Heads up" data-testid="callout">
        Something happened.
      </Callout>
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened.")).toBeInTheDocument();
    expect(screen.getByTestId("callout")).toBeInTheDocument();
  });

  it("shows correct variant styling via data-variant — info", () => {
    renderWithProvider(<Callout variant="info" title="Info" />);
    const root = screen.getByRole("alert");
    expect(root.getAttribute("data-variant")).toBe("info");
    expect(root.className).toContain("blue");
  });

  it("shows correct variant styling via data-variant — warning", () => {
    renderWithProvider(<Callout variant="warning" title="Warning" />);
    const root = screen.getByRole("alert");
    expect(root.getAttribute("data-variant")).toBe("warning");
    expect(root.className).toContain("amber");
  });

  it("shows correct variant styling via data-variant — success", () => {
    renderWithProvider(<Callout variant="success" title="Success" />);
    const root = screen.getByRole("alert");
    expect(root.getAttribute("data-variant")).toBe("success");
    expect(root.className).toContain("emerald");
  });

  it("shows correct variant styling via data-variant — error", () => {
    renderWithProvider(<Callout variant="error" title="Error" />);
    const root = screen.getByRole("alert");
    expect(root.getAttribute("data-variant")).toBe("error");
    expect(root.className).toContain("red");
  });

  it("dismissible — click dismiss button hides the callout", () => {
    renderWithProvider(
      <Callout title="Dismissable" dismissible data-testid="dismiss-callout">
        Content
      </Callout>
    );
    expect(screen.getByTestId("dismiss-callout")).toBeInTheDocument();
    const dismissBtn = screen.getByLabelText("Dismiss");
    expect(dismissBtn).toBeInTheDocument();
    fireEvent.click(dismissBtn);
    // After clicking dismiss, the fading class is applied immediately
    // (the component removes from DOM after 200ms setTimeout)
    expect(screen.getByTestId("dismiss-callout").className).toContain("opacity-0");
  });

  it("data-driven — renders correct variant based on value and rules", () => {
    const rules = [
      { min: 80, variant: "success" as const, title: "All good", message: "Score is {value}" },
      { min: 50, max: 80, variant: "warning" as const, title: "Watch out", message: "Score is {value}" },
      { max: 50, variant: "error" as const, title: "Critical", message: "Score is {value}" },
    ];

    // High value -> success
    const { rerender } = renderWithProvider(
      <Callout value={90} rules={rules} />
    );
    expect(screen.getByRole("alert").getAttribute("data-variant")).toBe("success");
    expect(screen.getByText("All good")).toBeInTheDocument();
    expect(screen.getByText("Score is 90")).toBeInTheDocument();

    // Mid value -> warning
    rerender(
      <MetricProvider>
        <Callout value={60} rules={rules} />
      </MetricProvider>
    );
    expect(screen.getByRole("alert").getAttribute("data-variant")).toBe("warning");
    expect(screen.getByText("Watch out")).toBeInTheDocument();

    // Low value -> error
    rerender(
      <MetricProvider>
        <Callout value={30} rules={rules} />
      </MetricProvider>
    );
    expect(screen.getByRole("alert").getAttribute("data-variant")).toBe("error");
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("shows formatted metric when metric prop is provided", () => {
    renderWithProvider(
      <Callout
        variant="success"
        title="Revenue milestone"
        metric={{ value: 1000000, format: "currency", label: "total" }}
      />
    );
    const root = screen.getByRole("alert");
    expect(root.textContent).toContain("total");
    // The formatted value should be present (exact format depends on locale)
    expect(root.textContent).toMatch(/1,000,000|1\.0M|\$1,000,000/);
  });

  it("shows action button and fires onClick", () => {
    const onClick = vi.fn();
    renderWithProvider(
      <Callout
        variant="warning"
        title="Action needed"
        action={{ label: "Fix now", onClick }}
      />
    );
    const actionBtn = screen.getByText("Fix now");
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders detail section when expanded", () => {
    renderWithProvider(
      <Callout
        variant="info"
        title="Details available"
        detail={<p>Detailed information here</p>}
        detailOpen
      />
    );
    expect(screen.getByText("Detailed information here")).toBeInTheDocument();
    expect(screen.getByText("Hide details")).toBeInTheDocument();
  });

  it("toggles detail section on click", () => {
    renderWithProvider(
      <Callout
        variant="info"
        title="Toggle test"
        detail={<p>Hidden detail</p>}
      />
    );
    // Detail hidden by default
    expect(screen.queryByText("Hidden detail")).not.toBeInTheDocument();
    expect(screen.getByText("Show details")).toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText("Show details"));
    expect(screen.getByText("Hidden detail")).toBeInTheDocument();
    expect(screen.getByText("Hide details")).toBeInTheDocument();
  });

  it("has role=alert for accessibility", () => {
    renderWithProvider(<Callout variant="error" title="Error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("applies data-testid", () => {
    renderWithProvider(<Callout data-testid="my-callout" title="Test" />);
    expect(screen.getByTestId("my-callout")).toBeInTheDocument();
  });
});
