import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricProvider } from "@/lib/MetricProvider";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { DataTable } from "@/components/tables/DataTable";

// Mock Nivo (jsdom has no layout)
vi.mock("@nivo/line", () => ({ ResponsiveLine: () => <div data-testid="nivo-line" /> }));
vi.mock("@nivo/bar", () => ({ ResponsiveBar: () => <div data-testid="nivo-bar" /> }));
vi.mock("@nivo/pie", () => ({ ResponsivePie: () => <div data-testid="nivo-pie" /> }));
vi.mock("@/lib/useContainerSize", () => ({ useContainerSize: () => ({ ref: { current: null }, width: 600 }) }));
vi.mock("@/lib/useChartLegend", () => ({
  useChartLegend: (count: number) => ({
    hidden: new Set(),
    toggle: () => {},
    legendConfig: {},
    allHidden: false,
  }),
}));

function W({ children }: { children: React.ReactNode }) {
  return <MetricProvider>{children}</MetricProvider>;
}

describe("Edge cases", () => {
  // ─── KpiCard ───────────────────────────────────────────────────────

  describe("KpiCard", () => {
    it("renders with null value", () => {
      render(<W><KpiCard title="Test" value={null} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with undefined value", () => {
      render(<W><KpiCard title="Test" value={undefined} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with 0 value", () => {
      render(<W><KpiCard title="Test" value={0} /></W>);
      expect(screen.getByText("0")).toBeTruthy();
    });

    it("renders with negative value", () => {
      render(<W><KpiCard title="Test" value={-1234} format="number" /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with very large value", () => {
      render(<W><KpiCard title="Test" value={999999999999} format="compact" /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with NaN value", () => {
      render(<W><KpiCard title="Test" value={NaN} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with Infinity value", () => {
      render(<W><KpiCard title="Test" value={Infinity} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with empty string value", () => {
      render(<W><KpiCard title="Test" value="" /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with very long title", () => {
      const longTitle = "A".repeat(500);
      render(<W><KpiCard title={longTitle} value={100} /></W>);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it("renders with emoji in title", () => {
      render(<W><KpiCard title="Revenue 💰" value={100} /></W>);
      expect(screen.getByText("Revenue 💰")).toBeTruthy();
    });

    it("renders with comparison to zero", () => {
      render(<W><KpiCard title="Test" value={100} comparison={{ value: 0 }} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with comparison where both values are zero", () => {
      render(<W><KpiCard title="Test" value={0} comparison={{ value: 0 }} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with empty sparkline data", () => {
      render(<W><KpiCard title="Test" value={100} sparkline={{ data: [] }} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });

    it("renders with single sparkline point", () => {
      render(<W><KpiCard title="Test" value={100} sparkline={{ data: [42] }} /></W>);
      expect(screen.getByText("Test")).toBeTruthy();
    });
  });

  // ─── StatGroup ─────────────────────────────────────────────────────

  describe("StatGroup", () => {
    it("renders with empty stats array", () => {
      render(<W><StatGroup stats={[]} /></W>);
      // Should show empty state via DataStateWrapper
      expect(document.querySelector("[role='status']")).toBeTruthy();
    });

    it("renders with null values in stats", () => {
      render(
        <W>
          <StatGroup stats={[
            { label: "A", value: null as unknown as number },
            { label: "B", value: 100 },
          ]} />
        </W>
      );
      expect(screen.getByText("B")).toBeTruthy();
    });

    it("renders with very long labels", () => {
      render(
        <W>
          <StatGroup stats={[
            { label: "A".repeat(200), value: 100 },
          ]} />
        </W>
      );
      expect(screen.getByText("A".repeat(200))).toBeTruthy();
    });
  });

  // ─── DataTable ─────────────────────────────────────────────────────

  describe("DataTable", () => {
    it("renders with empty data array", () => {
      render(<W><DataTable data={[]} /></W>);
      // Should handle gracefully
    });

    it("renders with empty columns array", () => {
      render(<W><DataTable data={[{ a: 1 }]} columns={[]} /></W>);
    });

    it("renders with null values in cells", () => {
      render(
        <W>
          <DataTable
            data={[
              { name: "A", value: null },
              { name: "B", value: undefined },
              { name: "C", value: 0 },
            ]}
          />
        </W>
      );
      expect(screen.getByText("A")).toBeTruthy();
      expect(screen.getByText("C")).toBeTruthy();
    });

    it("renders with 1000 rows without crashing", () => {
      const bigData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Row ${i}`,
        value: Math.random() * 1000,
      }));
      render(<W><DataTable data={bigData} /></W>);
      // Should render (pagination limits visible rows)
    });

    it("renders with negative numbers", () => {
      render(
        <W>
          <DataTable
            data={[
              { metric: "Loss", value: -5000 },
              { metric: "Gain", value: 3000 },
            ]}
          />
        </W>
      );
      expect(screen.getByText("Loss")).toBeTruthy();
    });

    it("renders with emoji in data", () => {
      render(
        <W>
          <DataTable
            data={[{ name: "🚀 Launch", status: "✅ Done" }]}
          />
        </W>
      );
      expect(screen.getByText("🚀 Launch")).toBeTruthy();
    });

    it("renders with very long cell content", () => {
      render(
        <W>
          <DataTable
            data={[{ description: "X".repeat(1000) }]}
          />
        </W>
      );
    });
  });

  // ─── Format edge cases ─────────────────────────────────────────────

  describe("Format edge cases", () => {
    it("handles currency format with zero", () => {
      render(<W><KpiCard title="Revenue" value={0} format="currency" /></W>);
      expect(screen.getByText("Revenue")).toBeTruthy();
    });

    it("handles percent format with value > 1", () => {
      render(<W><KpiCard title="Rate" value={1.5} format="percent" /></W>);
      expect(screen.getByText("Rate")).toBeTruthy();
    });

    it("handles compact format with very small number", () => {
      render(<W><KpiCard title="Tiny" value={0.001} format="compact" /></W>);
      expect(screen.getByText("Tiny")).toBeTruthy();
    });

    it("handles compact format with negative", () => {
      render(<W><KpiCard title="Loss" value={-1500000} format="compact" /></W>);
      expect(screen.getByText("Loss")).toBeTruthy();
    });
  });

  // ─── Data state edge cases ─────────────────────────────────────────

  describe("Data state edge cases", () => {
    it("handles error as string", () => {
      render(<W><KpiCard title="Test" value={0} error="Something broke" /></W>);
      expect(screen.getByText("Something broke")).toBeTruthy();
    });

    it("handles empty as string", () => {
      render(<W><KpiCard title="Test" value={0} empty="Nothing here" /></W>);
      expect(screen.getByText("Nothing here")).toBeTruthy();
    });

    it("handles loading + error simultaneously (error wins)", () => {
      render(<W><KpiCard title="Test" value={0} loading error="Failed" /></W>);
      // Error should take precedence
      expect(screen.getByText("Failed")).toBeTruthy();
    });

    it("handles all states simultaneously", () => {
      render(
        <W>
          <KpiCard
            title="Test"
            value={0}
            loading
            error="Failed"
            empty="No data"
            stale={{ since: new Date() }}
          />
        </W>
      );
      // Should not crash — error takes priority
      expect(screen.getByText("Failed")).toBeTruthy();
    });
  });
});
