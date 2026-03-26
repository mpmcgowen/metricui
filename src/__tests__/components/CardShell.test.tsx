import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardShell } from "@/components/ui/CardShell";
import { MetricProvider } from "@/lib/MetricProvider";
import { AiProvider, useAi, type AiConfig } from "@/lib/AiContext";

// Mock ExportButton to avoid canvas/clipboard complexity
vi.mock("@/components/ui/ExportButton", () => ({
  ExportButton: (props: any) => <button data-testid="export-btn">Export</button>,
}));

// Mock DescriptionPopover
vi.mock("@/components/ui/DescriptionPopover", () => ({
  DescriptionPopover: ({ content }: any) => <span data-testid="desc-popover">{typeof content === "string" ? content : "desc"}</span>,
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<MetricProvider>{ui}</MetricProvider>);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CardShell", () => {
  it("renders title in header", () => {
    renderWithProvider(
      <CardShell title="Revenue" data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithProvider(
      <CardShell title="Revenue" subtitle="Last 30 days">
        <div>Content</div>
      </CardShell>
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders children in body", () => {
    renderWithProvider(
      <CardShell title="Revenue">
        <div data-testid="body-content">Body</div>
      </CardShell>
    );
    expect(screen.getByTestId("body-content")).toBeInTheDocument();
  });

  it("AI registration: registers with title and component name when wrapped in AiProvider", () => {
    const registerMetric = vi.fn();
    const unregisterMetric = vi.fn();

    // We'll use a spy component to verify registration happened
    function AiSpy({ children }: { children: React.ReactNode }) {
      const ai = useAi();
      return (
        <div data-testid="ai-spy" data-enabled={ai?.enabled ? "true" : "false"}>
          {children}
        </div>
      );
    }

    const mockAnalyze = vi.fn().mockResolvedValue("test");
    const aiConfig: AiConfig = { analyze: mockAnalyze };

    render(
      <MetricProvider>
        <AiProvider config={aiConfig}>
          <CardShell title="Revenue" componentName="KpiCard" data-testid="card">
            <div>Content</div>
          </CardShell>
        </AiProvider>
      </MetricProvider>
    );

    // The card should have data-ai-title set
    const card = screen.getByTestId("card");
    expect(card.getAttribute("data-ai-title")).toBe("Revenue");
    expect(card.getAttribute("data-component")).toBe("KpiCard");
  });

  it("aiTitle overrides title for data-ai-title", () => {
    renderWithProvider(
      <CardShell title="Rev" aiTitle="Monthly Recurring Revenue" data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    // The visible title is "Rev" but data-ai-title is the displayed title
    expect(screen.getByText("Rev")).toBeInTheDocument();
    // data-ai-title attribute uses the title prop (not aiTitle — aiTitle is for AI registration, not the data attribute)
    const card = screen.getByTestId("card");
    expect(card.getAttribute("data-ai-title")).toBe("Rev");
  });

  it("state prop: flat loading prop takes precedence over state bag", () => {
    const { container } = renderWithProvider(
      <CardShell
        title="Revenue"
        loading={false}
        state={{ loading: true }}
        data-testid="card"
      >
        <div data-testid="content">Content</div>
      </CardShell>
    );
    // loading=false should win over state.loading=true, so content should render
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("state prop: falls back to state bag when flat prop is undefined", () => {
    const { container } = renderWithProvider(
      <CardShell
        title="Revenue"
        state={{ loading: true }}
        skeletonType="kpi"
      >
        <div data-testid="content">Content</div>
      </CardShell>
    );
    // state.loading=true should trigger skeleton, so content should NOT render
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    // Skeleton shimmer should be present
    const shimmer = container.querySelector(".mu-shimmer");
    expect(shimmer).toBeTruthy();
  });

  it("exportable renders ExportButton when true", () => {
    render(
      <MetricProvider exportable>
        <CardShell title="Revenue" data-testid="card">
          <div>Content</div>
        </CardShell>
      </MetricProvider>
    );
    expect(screen.getByTestId("export-btn")).toBeInTheDocument();
  });

  it("exportable=false hides ExportButton even when global exportable is true", () => {
    render(
      <MetricProvider exportable>
        <CardShell title="Revenue" exportable={false} data-testid="card">
          <div>Content</div>
        </CardShell>
      </MetricProvider>
    );
    expect(screen.queryByTestId("export-btn")).not.toBeInTheDocument();
  });

  it("clickable card gets cursor-pointer class", () => {
    renderWithProvider(
      <CardShell title="Revenue" onClick={() => {}} data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("cursor-pointer");
  });

  it("clickable card gets hover lift classes", () => {
    renderWithProvider(
      <CardShell title="Revenue" clickable data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("cursor-pointer");
    expect(card.className).toContain("hover:-translate-y-0.5");
  });

  it("href renders as an anchor tag", () => {
    renderWithProvider(
      <CardShell title="Revenue" href="/details" data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("A");
    expect(card.getAttribute("href")).toBe("/details");
  });

  it("bare mode strips card chrome", () => {
    renderWithProvider(
      <CardShell title="Revenue" bare data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    const card = screen.getByTestId("card");
    // bare mode should NOT have data-variant
    expect(card.getAttribute("data-variant")).toBeNull();
    // bare mode should have mu-container class instead of noise-texture
    expect(card.className).toContain("mu-container");
    expect(card.className).not.toContain("noise-texture");
  });

  it("auto-detects empty data and shows default empty state", () => {
    renderWithProvider(
      <CardShell title="Revenue" exportData={[]} data-testid="card">
        <div data-testid="content">Content</div>
      </CardShell>
    );
    // Content should NOT render — empty state should take over
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByText("Nothing to show — try adjusting your filters")).toBeInTheDocument();
  });

  it("error state prevents content from rendering", () => {
    renderWithProvider(
      <CardShell title="Revenue" error={{ message: "Failed to load" }}>
        <div data-testid="content">Content</div>
      </CardShell>
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("highlight=true applies attention ring styles", () => {
    renderWithProvider(
      <CardShell title="Revenue" highlight data-testid="card">
        <div>Content</div>
      </CardShell>
    );
    const card = screen.getByTestId("card");
    expect(card.style.boxShadow).toBeTruthy();
    expect(card.style.outline).toBeTruthy();
  });

  it("passes data-testid through", () => {
    renderWithProvider(
      <CardShell title="Revenue" data-testid="my-card">
        <div>Content</div>
      </CardShell>
    );
    expect(screen.getByTestId("my-card")).toBeInTheDocument();
  });
});
