"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/tables/DataTable";
import type { ColumnDef } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import {
  Toggle,
  TextInput,
  NumberInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

type TopProduct = {
  product: string;
  revenue: number;
  units: number;
  growth: number;
  status: string;
};

type Transaction = {
  id: string;
  customer: string;
  amount: number;
  method: string;
  date: string;
  status: string;
};

type TeamMember = {
  name: string;
  role: string;
  deals: number;
  revenue: number;
  winRate: number;
  rank: number;
};

const topProducts: TopProduct[] = [
  { product: "Pro Plan", revenue: 128400, units: 856, growth: 24.5, status: "active" },
  { product: "Enterprise Plan", revenue: 96200, units: 124, growth: 18.2, status: "active" },
  { product: "Starter Plan", revenue: 45800, units: 1832, growth: -3.1, status: "active" },
  { product: "API Add-on", revenue: 34600, units: 412, growth: 42.8, status: "active" },
  { product: "Storage Add-on", revenue: 22100, units: 678, growth: 15.4, status: "active" },
  { product: "Analytics Add-on", revenue: 18900, units: 345, growth: 8.7, status: "new" },
  { product: "Support Premium", revenue: 15400, units: 189, growth: -5.2, status: "active" },
  { product: "Migration Service", revenue: 12800, units: 64, growth: 31.0, status: "new" },
  { product: "Training Package", revenue: 9600, units: 48, growth: -12.4, status: "sunset" },
  { product: "Legacy Plan", revenue: 4200, units: 210, growth: -28.6, status: "sunset" },
  { product: "Consulting Hours", revenue: 3800, units: 19, growth: 5.0, status: "active" },
  { product: "Custom Integration", revenue: 2400, units: 8, growth: 100.0, status: "new" },
];

const transactions: Transaction[] = [
  { id: "TXN-001", customer: "Acme Corp", amount: 12400, method: "Credit Card", date: "2025-03-15", status: "completed" },
  { id: "TXN-002", customer: "Globex Inc", amount: 8900, method: "Wire Transfer", date: "2025-03-14", status: "completed" },
  { id: "TXN-003", customer: "Initech", amount: 6200, method: "ACH", date: "2025-03-14", status: "pending" },
  { id: "TXN-004", customer: "Umbrella Corp", amount: 15800, method: "Credit Card", date: "2025-03-13", status: "completed" },
  { id: "TXN-005", customer: "Stark Industries", amount: 42000, method: "Wire Transfer", date: "2025-03-13", status: "completed" },
  { id: "TXN-006", customer: "Wayne Enterprises", amount: 28500, method: "ACH", date: "2025-03-12", status: "failed" },
  { id: "TXN-007", customer: "Cyberdyne Systems", amount: 9400, method: "Credit Card", date: "2025-03-12", status: "completed" },
  { id: "TXN-008", customer: "Soylent Corp", amount: 3200, method: "Credit Card", date: "2025-03-11", status: "refunded" },
  { id: "TXN-009", customer: "Oscorp", amount: 18700, method: "Wire Transfer", date: "2025-03-11", status: "completed" },
  { id: "TXN-010", customer: "LexCorp", amount: 7600, method: "ACH", date: "2025-03-10", status: "pending" },
  { id: "TXN-011", customer: "Massive Dynamic", amount: 22400, method: "Wire Transfer", date: "2025-03-10", status: "completed" },
  { id: "TXN-012", customer: "Aperture Science", amount: 5100, method: "Credit Card", date: "2025-03-09", status: "completed" },
];

const teamMembers: TeamMember[] = [
  { name: "Sarah Chen", role: "Sr. AE", deals: 24, revenue: 284000, winRate: 68, rank: 1 },
  { name: "Marcus Johnson", role: "Sr. AE", deals: 21, revenue: 256000, winRate: 62, rank: 2 },
  { name: "Priya Patel", role: "AE", deals: 18, revenue: 198000, winRate: 71, rank: 3 },
  { name: "James Wilson", role: "AE", deals: 15, revenue: 167000, winRate: 58, rank: 4 },
  { name: "Elena Rodriguez", role: "AE", deals: 14, revenue: 142000, winRate: 64, rank: 5 },
  { name: "David Kim", role: "Jr. AE", deals: 11, revenue: 98000, winRate: 52, rank: 6 },
  { name: "Lisa Thompson", role: "Jr. AE", deals: 9, revenue: 76000, winRate: 48, rank: 7 },
  { name: "Ahmed Hassan", role: "SDR", deals: 8, revenue: 64000, winRate: 44, rank: 8 },
];

// ---------------------------------------------------------------------------
// Column configs per dataset
// ---------------------------------------------------------------------------

const productColumns: ColumnDef<TopProduct>[] = [
  { key: "product", header: "Product", sortable: true, pin: "left" },
  { key: "revenue", header: "Revenue", sortable: true, format: "currency" },
  { key: "units", header: "Units Sold", sortable: true, format: "number" },
  {
    key: "growth",
    header: "Growth",
    sortable: true,
    align: "right",
    render: (v) => {
      const val = Number(v);
      return (
        <span
          className={
            val >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {val >= 0 ? "+" : ""}{val}%
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (v) => {
      const status = String(v);
      const variant = status === "active" ? "success" : status === "new" ? "info" : "warning";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

const transactionColumns: ColumnDef<Transaction>[] = [
  { key: "id", header: "ID", pin: "left" },
  { key: "customer", header: "Customer", sortable: true },
  { key: "amount", header: "Amount", sortable: true, format: "currency" },
  { key: "method", header: "Method" },
  { key: "date", header: "Date", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (v) => {
      const s = String(v);
      const variant = s === "completed" ? "success" : s === "pending" ? "warning" : s === "refunded" ? "info" : "danger";
      return <Badge variant={variant}>{s}</Badge>;
    },
  },
];

const teamColumns: ColumnDef<TeamMember>[] = [
  {
    key: "rank",
    header: "#",
    width: 48,
    align: "center",
    render: (v) => {
      const r = Number(v);
      return (
        <span className={r <= 3 ? "font-bold text-[var(--accent)]" : "text-[var(--muted)]"}>
          {r}
        </span>
      );
    },
  },
  { key: "name", header: "Name", sortable: true, pin: "left" },
  { key: "role", header: "Role" },
  { key: "deals", header: "Deals", sortable: true, align: "right", format: "number" },
  { key: "revenue", header: "Revenue", sortable: true, format: "currency" },
  {
    key: "winRate",
    header: "Win Rate",
    sortable: true,
    align: "right",
    render: (v) => {
      const val = Number(v);
      const color = val >= 65 ? "text-emerald-600 dark:text-emerald-400" : val >= 50 ? "text-[var(--foreground)]" : "text-red-600 dark:text-red-400";
      return <span className={color}>{val}%</span>;
    },
  },
];

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function DataTablePlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("products");

  // --- Core ---
  const [title, setTitle] = useState("Top Products");
  const [subtitle, setSubtitle] = useState("By revenue this quarter");
  const [footnote, setFootnote] = useState("");
  const [description, setDescription] = useState("");

  // --- Appearance ---
  const [striped, setStriped] = useState(false);
  const [dense, setDense] = useState(false);
  const [maxRows, setMaxRows] = useState(0);

  // --- Pagination ---
  const [enablePagination, setEnablePagination] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  // --- Footer ---
  const [showFooter, setShowFooter] = useState(false);

  // --- Variant ---
  const [variant, setVariant] = useState("default");

  // --- Data states ---
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // --- Handle dataset change ---
  const handleDatasetChange = (key: string) => {
    setDatasetKey(key);
    if (key === "products") {
      setTitle("Top Products");
      setSubtitle("By revenue this quarter");
    } else if (key === "transactions") {
      setTitle("Recent Transactions");
      setSubtitle("Last 30 days");
    } else {
      setTitle("Team Leaderboard");
      setSubtitle("Q1 2025 performance");
    }
  };

  // --- Derived ---
  const data = useMemo(() => {
    if (isEmpty) return [];
    switch (datasetKey) {
      case "transactions": return transactions;
      case "team": return teamMembers;
      default: return topProducts;
    }
  }, [datasetKey, isEmpty]);

  const columns = useMemo(() => {
    switch (datasetKey) {
      case "transactions": return transactionColumns;
      case "team": return teamColumns;
      default: return productColumns;
    }
  }, [datasetKey]);

  const footer = useMemo(() => {
    if (!showFooter) return undefined;
    switch (datasetKey) {
      case "products":
        return {
          product: "Total",
          revenue: "$391,200",
          units: "4,787",
          growth: "",
          status: "",
        };
      case "transactions":
        return {
          id: "",
          customer: "Total",
          amount: "$180,200",
          method: "",
          date: "",
          status: "",
        };
      case "team":
        return {
          rank: "",
          name: "Team Total",
          role: "",
          deals: "120",
          revenue: "$1,285,000",
          winRate: "",
        };
      default:
        return undefined;
    }
  }, [datasetKey, showFooter]);

  // --- Code gen ---
  const codeLines = useMemo(() => {
    const lines: string[] = [];
    lines.push(`<DataTable`);
    lines.push(`  data={${datasetKey === "products" ? "topProducts" : datasetKey === "transactions" ? "transactions" : "teamMembers"}}`);
    lines.push(`  columns={[`);
    const cols = datasetKey === "products" ? productColumns : datasetKey === "transactions" ? transactionColumns : teamColumns;
    for (const col of cols) {
      const parts = [`key: "${col.key}"`, `header: "${("header" in col ? col.header : "") || ""}"`];
      if (col.sortable) parts.push("sortable: true");
      if (col.format) parts.push(`format: "${col.format}"`);
      if (col.align) parts.push(`align: "${col.align}"`);
      if (col.pin) parts.push(`pin: "${col.pin}"`);
      if (col.render) parts.push("render: (v, row) => <...>");
      lines.push(`    { ${parts.join(", ")} },`);
    }
    lines.push(`  ]}`);
    lines.push(`  title="${title}"`);
    if (subtitle) lines.push(`  subtitle="${subtitle}"`);
    if (striped) lines.push(`  striped`);
    if (dense) lines.push(`  dense`);
    if (maxRows > 0) lines.push(`  maxRows={${maxRows}}`);
    if (enablePagination) lines.push(`  pageSize={${pageSize}}`);
    if (showFooter) lines.push(`  footer={{ product: "Total", revenue: "$391,200", ... }}`);
    if (description) lines.push(`  description="${description}"`);
    if (footnote) lines.push(`  footnote="${footnote}"`);
    if (variant !== "default") lines.push(`  variant="${variant}"`);
    lines.push(`/>`);
    return lines.join("\n");
  }, [datasetKey, title, subtitle, striped, dense, maxRows, enablePagination, pageSize, showFooter, description, footnote, variant]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col">
        {/* Live Preview */}
        <div className="px-2 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-4xl">
              <DataTable
                data={data as Record<string, unknown>[]}
                columns={columns as ColumnDef<Record<string, unknown>>[]}
                title={title}
                subtitle={subtitle || undefined}
                description={description || undefined}
                footnote={footnote || undefined}
                striped={striped}
                dense={dense}
                maxRows={maxRows > 0 ? maxRows : undefined}
                pageSize={enablePagination ? pageSize : undefined}
                pagination={enablePagination}
                footer={footer as Record<string, React.ReactNode> | undefined}
                variant={variant as "default" | "outlined" | "ghost" | "elevated"}
                loading={isLoading}
                empty={isEmpty ? { message: "No data matches your filters" } : undefined}
                onRowClick={(row) => {
                  // eslint-disable-next-line no-console
                  console.log("Row clicked:", row);
                }}
              />
          </div>

          {/* Code */}
          <div className="mt-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Code
            </p>
            <CodePreview code={codeLines} />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full flex-shrink-0 overflow-y-auto border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the table update in real time
          </p>
        </div>

        {/* Data */}
        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={handleDatasetChange}
            options={[
              { label: "Top Products (badges, growth)", value: "products" },
              { label: "Recent Transactions", value: "transactions" },
              { label: "Team Leaderboard (ranks)", value: "team" },
            ]}
            description="Switch between sample datasets"
          />
        </ControlSection>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
          <TextInput label="description" value={description} onChange={setDescription} placeholder="Shows as a ? popover" />
          <TextInput label="footnote" value={footnote} onChange={setFootnote} />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Toggle label="striped" value={striped} onChange={setStriped} description="Alternating row backgrounds" />
          <Toggle label="dense" value={dense} onChange={setDense} description="Compact row height" />
          <NumberInput label="maxRows" value={maxRows} onChange={setMaxRows} min={0} max={20} description='0 = show all. Otherwise shows "View all" link.' />
          <Toggle label="Show footer row" value={showFooter} onChange={setShowFooter} description="Summary/totals footer" />
        </ControlSection>

        {/* Pagination */}
        <ControlSection title="Pagination">
          <Toggle label="Enable pagination" value={enablePagination} onChange={setEnablePagination} description="Show prev/next controls" />
          {enablePagination && (
            <NumberInput label="pageSize" value={pageSize} onChange={setPageSize} min={1} max={50} description="Rows per page" />
          )}
        </ControlSection>

        {/* Data States */}
        <ControlSection title="Data States" defaultOpen={false}>
          <Toggle label="Loading" value={isLoading} onChange={setIsLoading} description="Shows skeleton placeholder rows" />
          <Toggle label="Empty" value={isEmpty} onChange={setIsEmpty} description="Shows empty state message" />
        </ControlSection>

        {/* Theming */}
        <ControlSection title="Theming" defaultOpen={false}>
          <Select
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { label: "default", value: "default" },
              { label: "outlined", value: "outlined" },
              { label: "ghost", value: "ghost" },
              { label: "elevated", value: "elevated" },
            ]}
          />
        </ControlSection>
      </div>
    </div>
  );
}
