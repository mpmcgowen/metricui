import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies variant styles — success", () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("emerald");
  });

  it("applies variant styles — warning", () => {
    const { container } = render(<Badge variant="warning">Warn</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("amber");
  });

  it("applies variant styles — danger", () => {
    const { container } = render(<Badge variant="danger">Error</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("red");
  });

  it("applies variant styles — info", () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("blue");
  });

  it("applies variant styles — outline", () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("border-current");
  });

  it("shows dot when dot=true", () => {
    const { container } = render(<Badge dot={true}>Status</Badge>);
    const dot = container.querySelector(".rounded-full.h-1\\.5");
    expect(dot).toBeInTheDocument();
  });

  it("shows icon when icon provided", () => {
    render(
      <Badge icon={<span data-testid="badge-icon">*</span>}>
        With Icon
      </Badge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });

  it("shows dismiss button when onDismiss provided", () => {
    const onDismiss = vi.fn();
    render(<Badge onDismiss={onDismiss}>Dismissable</Badge>);
    const dismissBtn = screen.getByLabelText("Dismiss");
    expect(dismissBtn).toBeInTheDocument();
    fireEvent.click(dismissBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("applies size classes — sm", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("text-[length:var(--mu-text-2xs)]");
  });

  it("applies size classes — md (default)", () => {
    const { container } = render(<Badge>Medium</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("text-xs");
  });

  it("applies size classes — lg", () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.firstElementChild!;
    expect(badge.className).toContain("text-sm");
  });

  it("applies data-testid", () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});
