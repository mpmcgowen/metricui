import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/tables/DataTable";
import type { Column } from "@/components/tables/DataTable";
import { MetricProvider } from "@/lib/MetricProvider";

type Row = { name: string; revenue: number; users: number };

const columns: Column<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "revenue", header: "Revenue", sortable: true },
  { key: "users", header: "Users", sortable: true },
];

const data: Row[] = [
  { name: "Alpha", revenue: 100, users: 50 },
  { name: "Beta", revenue: 200, users: 30 },
  { name: "Gamma", revenue: 150, users: 80 },
];

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <MetricProvider>{ui}</MetricProvider>
  );
}

describe("DataTable", () => {
  it("renders rows and columns", () => {
    renderWithProvider(
      <DataTable data={data} columns={columns} />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("sorting works — click header, rows reorder", () => {
    renderWithProvider(
      <DataTable data={data} columns={columns} />
    );
    // Click Revenue header to sort ascending
    fireEvent.click(screen.getByText("Revenue"));
    const cells = screen.getAllByText(/Alpha|Beta|Gamma/);
    // After ascending sort by revenue: Alpha (100), Gamma (150), Beta (200)
    expect(cells[0].textContent).toBe("Alpha");
    expect(cells[1].textContent).toBe("Gamma");
    expect(cells[2].textContent).toBe("Beta");
  });

  it("pagination renders when pageSize set", () => {
    renderWithProvider(
      <DataTable data={data} columns={columns} pageSize={2} />
    );
    // Should show pagination controls
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    renderWithProvider(
      <DataTable data={[]} columns={columns} />
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading=true", () => {
    const { container } = renderWithProvider(
      <DataTable data={data} columns={columns} loading={true} />
    );
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("search filters rows when searchable=true", () => {
    renderWithProvider(
      <DataTable data={data} columns={columns} searchable={true} />
    );
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Beta" } });
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
  });

  it("applies data-testid", () => {
    renderWithProvider(
      <DataTable
        data={data}
        columns={columns}
        data-testid="my-table"
      />
    );
    expect(screen.getByTestId("my-table")).toBeInTheDocument();
  });

  it("shows title and subtitle when provided", () => {
    renderWithProvider(
      <DataTable
        data={data}
        columns={columns}
        title="Sales Data"
        subtitle="Q1 2026"
      />
    );
    expect(screen.getByText("Sales Data")).toBeInTheDocument();
    expect(screen.getByText("Q1 2026")).toBeInTheDocument();
  });

  it("shows error state when error prop is set", () => {
    renderWithProvider(
      <DataTable
        data={data}
        columns={columns}
        error={{ message: "Failed to load" }}
      />
    );
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("applies dense mode via data attribute", () => {
    renderWithProvider(
      <DataTable data={data} columns={columns} dense={true} data-testid="dt-dense" />
    );
    const el = screen.getByTestId("dt-dense");
    expect(el.getAttribute("data-dense")).toBe("true");
  });
});
