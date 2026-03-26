"use client";

import { DataTable } from "@/components/tables/DataTable";
import type { ColumnDef } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTablePlayground } from "@/components/docs/playgrounds/DataTablePlayground";

const component = getComponent("data-table")!;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const basicData = [
  { name: "Acme Corp", revenue: 142300, growth: 12.5 },
  { name: "Globex Inc", revenue: 98700, growth: -3.2 },
  { name: "Initech", revenue: 67400, growth: 8.1 },
  { name: "Umbrella Corp", revenue: 54200, growth: 22.4 },
  { name: "Stark Industries", revenue: 189000, growth: 15.7 },
];

// Column-types showcase data
type ProductRow = {
  product: string;
  price: number;
  growth: number;
  status: string;
  trend: number[];
  progress: number;
  category: string;
};

const productData: ProductRow[] = [
  { product: "Analytics Pro", price: 4999, growth: 18.3, status: "active", trend: [22, 28, 35, 31, 42, 48, 55], progress: 82, category: "SaaS" },
  { product: "Data Vault", price: 2499, growth: -4.1, status: "churned", trend: [45, 42, 38, 35, 30, 28, 25], progress: 34, category: "Storage" },
  { product: "Cloud Suite", price: 7850, growth: 12.7, status: "active", trend: [60, 62, 58, 65, 70, 75, 78], progress: 91, category: "Platform" },
  { product: "ML Pipeline", price: 3200, growth: 0.5, status: "trial", trend: [15, 18, 16, 20, 19, 22, 21], progress: 45, category: "AI/ML" },
  { product: "Edge CDN", price: 1299, growth: 31.2, status: "active", trend: [10, 15, 22, 30, 38, 45, 55], progress: 67, category: "Infra" },
];

const columnTypesColumns: ColumnDef<ProductRow>[] = [
  { key: "product", header: "Product", type: "text", sortable: true, pin: "left" },
  { key: "price", header: "Price", type: "currency", sortable: true },
  { key: "growth", header: "Growth", type: "percent", sortable: true },
  { key: "status", header: "Status", type: "badge", sortable: true },
  { key: "trend", header: "Trend (7d)", type: "sparkline" },
  { key: "progress", header: "Adoption", type: "progress" },
  { key: "category", header: "Category", type: "text" },
];

// Sort demo data
type SortRow = {
  name: string;
  department: string;
  revenue: number;
  deals: number;
};

const sortData: SortRow[] = [
  { name: "Alice Chen", department: "Enterprise", revenue: 285000, deals: 12 },
  { name: "Bob Park", department: "SMB", revenue: 142000, deals: 28 },
  { name: "Carol Diaz", department: "Enterprise", revenue: 310000, deals: 8 },
  { name: "Dan Kim", department: "SMB", revenue: 198000, deals: 35 },
  { name: "Eva Novak", department: "Enterprise", revenue: 275000, deals: 15 },
  { name: "Frank Li", department: "Mid-Market", revenue: 167000, deals: 18 },
];

const sortColumns: ColumnDef<SortRow>[] = [
  { key: "name", header: "Rep", type: "text", sortable: true },
  { key: "department", header: "Segment", type: "text", sortable: true },
  { key: "revenue", header: "Revenue", type: "currency", sortable: true },
  { key: "deals", header: "Deals", type: "number", sortable: true },
];

// Expandable rows data
type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: number;
  date: string;
};

const orderData: OrderRow[] = [
  { id: "ORD-001", customer: "Acme Corp", total: 12450, status: "completed", items: 3, date: "2024-03-15" },
  { id: "ORD-002", customer: "Globex Inc", total: 8920, status: "pending", items: 2, date: "2024-03-14" },
  { id: "ORD-003", customer: "Initech", total: 23100, status: "completed", items: 5, date: "2024-03-13" },
  { id: "ORD-004", customer: "Umbrella Corp", total: 4500, status: "failed", items: 1, date: "2024-03-12" },
];

const orderColumns: ColumnDef<OrderRow>[] = [
  { key: "id", header: "Order ID", type: "text" },
  { key: "customer", header: "Customer", type: "text", sortable: true },
  { key: "total", header: "Total", type: "currency", sortable: true },
  { key: "status", header: "Status", type: "badge" },
  { key: "items", header: "Items", type: "number" },
];

// Conditional formatting data
type MetricRow = {
  metric: string;
  value: number;
  target: number;
  delta: number;
};

const metricData: MetricRow[] = [
  { metric: "Uptime", value: 99.98, target: 99.9, delta: 0.08 },
  { metric: "Latency (ms)", value: 145, target: 100, delta: 45 },
  { metric: "Error Rate", value: 0.3, target: 1.0, delta: -0.7 },
  { metric: "Throughput", value: 8500, target: 10000, delta: -1500 },
  { metric: "Satisfaction", value: 4.7, target: 4.5, delta: 0.2 },
];

const conditionalColumns: ColumnDef<MetricRow>[] = [
  { key: "metric", header: "Metric", type: "text" },
  {
    key: "value",
    header: "Current",
    type: "number",
    sortable: true,
    conditions: [
      { when: "above", value: 99, color: "emerald" },
      { when: "between", min: 50, max: 99, color: "amber" },
      { when: "below", value: 50, color: "red" },
    ],
  },
  { key: "target", header: "Target", type: "number" },
  {
    key: "delta",
    header: "Delta",
    type: "number",
    sortable: true,
    conditions: [
      { when: "above", value: 0, color: "emerald" },
      { when: "below", value: 0, color: "red" },
    ],
  },
];

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "column-types", title: "Column Types", level: 2 },
  { id: "sorting", title: "Sorting & Multi-Sort", level: 2 },
  { id: "expandable-rows", title: "Expandable Rows", level: 2 },
  { id: "conditional-formatting", title: "Conditional Formatting", level: 2 },
  { id: "pagination-footer", title: "Pagination & Footer", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DataTableDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use DataTable when you need to display tabular data with rich formatting, sorting,
          pagination, and interactive features. It auto-infers columns from your data shape,
          supports typed columns (currency, badge, sparkline, progress, and more), multi-column
          sorting, expandable detail rows, conditional formatting, pinned columns, sticky headers,
          search, and footer rows. For displaying a single key metric, use{" "}
          <a href="/docs/kpi-card" className="font-medium text-[var(--accent)] hover:underline">
            KpiCard
          </a>{" "}
          instead.
        </p>

        {/* ----------------------------------------------------------------- */}
        {/* Basic Example */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass just <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">data</code> and
            columns are auto-inferred from the first row&apos;s keys. Numbers are right-aligned
            and formatted automatically.
          </p>
          <ComponentExample
            code={`<DataTable
  data={[
    { name: "Acme Corp", revenue: 142300, growth: 12.5 },
    { name: "Globex Inc", revenue: 98700, growth: -3.2 },
    { name: "Initech", revenue: 67400, growth: 8.1 },
  ]}
/>`}
          >
            <div className="w-full">
              <DataTable data={basicData} />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Column Types */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="column-types" title="Column Types">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">type</code> property
            on a column definition controls formatting, alignment, and rendering automatically.
            This is the most powerful feature of DataTable — set a type and the component handles
            everything else: currency columns get locale-aware formatting, badge columns auto-map
            status strings to semantic colors, sparkline columns render inline charts, and progress
            columns show bars. Numeric types (<code className="font-[family-name:var(--font-mono)] text-[12px]">number</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">currency</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">percent</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">bar</code>) use
            a monospace font for easy scanning; text columns use the body font.
          </p>

          <DataTable
            data={[
              { type: '"text"', renders: "Plain text", align: "Left", font: "Body" },
              { type: '"number"', renders: "Locale-formatted number", align: "Right", font: "Mono" },
              { type: '"currency"', renders: "Currency-formatted (e.g. $4,999)", align: "Right", font: "Mono" },
              { type: '"percent"', renders: "Percent with sign (e.g. +18.3%)", align: "Right", font: "Mono" },
              { type: '"badge"', renders: "Semantic Badge component", align: "Left", font: "Body" },
              { type: '"sparkline"', renders: "Inline Sparkline chart", align: "Center", font: "N/A" },
              { type: '"status"', renders: "StatusIndicator with rules", align: "Left", font: "Body" },
              { type: '"progress"', renders: "ProgressBar (0-100)", align: "Center", font: "N/A" },
              { type: '"bar"', renders: "Inline horizontal bar", align: "Right", font: "Mono" },
              { type: '"link"', renders: "Clickable link with icon", align: "Left", font: "Body" },
              { type: '"date"', renders: "Locale-formatted date", align: "Left", font: "Body" },
            ]}
            columns={[
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
              { key: "renders", header: "Renders as" },
              { key: "align", header: "Align" },
              { key: "font", header: "Font" },
            ]}
            dense
            variant="ghost"
            className="mb-6"
          />

          <ComponentExample
            code={`const columns: ColumnDef<ProductRow>[] = [
  { key: "product", header: "Product", type: "text", sortable: true, pin: "left" },
  { key: "price", header: "Price", type: "currency", sortable: true },
  { key: "growth", header: "Growth", type: "percent", sortable: true },
  { key: "status", header: "Status", type: "badge", sortable: true },
  { key: "trend", header: "Trend (7d)", type: "sparkline" },
  { key: "progress", header: "Adoption", type: "progress" },
  { key: "category", header: "Category", type: "text" },
];

<DataTable
  data={productData}
  columns={columns}
  title="Product Overview"
  striped
/>`}
          >
            <div className="w-full">
              <DataTable
                data={productData}
                columns={columnTypesColumns}
                title="Product Overview"
                striped
              />
            </div>
          </ComponentExample>

          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Badge columns automatically map common status strings like{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;active&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;pending&quot;</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">&quot;failed&quot;</code> to
            semantic colors. For custom mappings, use the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">badgeVariant</code> or{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">badgeColor</code> column
            properties. Status columns work with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">statusRules</code> for
            rule-based indicator rendering. Link columns use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">linkHref</code> to
            generate URLs dynamically.
          </p>
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Sorting & Multi-Sort */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="sorting" title="Sorting & Multi-Sort">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Columns with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sortable: true</code> cycle
            through ascending, descending, and none on click. Enable{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">multiSort</code> to
            allow Shift+click on additional columns for multi-level sorting (up to 3 levels).
            Active sort columns show numbered priority badges on their headers so users can see
            the sort hierarchy at a glance.
          </p>
          <ComponentExample
            code={`<DataTable
  data={salesReps}
  columns={[
    { key: "name", header: "Rep", type: "text", sortable: true },
    { key: "department", header: "Segment", type: "text", sortable: true },
    { key: "revenue", header: "Revenue", type: "currency", sortable: true },
    { key: "deals", header: "Deals", type: "number", sortable: true },
  ]}
  title="Sales Leaderboard"
  subtitle="Shift+click headers to multi-sort"
  multiSort
/>`}
          >
            <div className="w-full">
              <DataTable
                data={sortData}
                columns={sortColumns}
                title="Sales Leaderboard"
                subtitle="Shift+click headers to multi-sort"
                multiSort
              />
            </div>
          </ComponentExample>
          <CodeBlock
            code={`// Single sort (default) — click toggles asc → desc → none
<DataTable columns={[{ key: "name", sortable: true }]} ... />

// Multi-sort — Shift+click adds secondary/tertiary sort
<DataTable columns={columns} multiSort />
// Up to 3 sort levels. Priority badges (1, 2, 3) appear on headers.`}
            className="mt-4"
          />
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Expandable Rows */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="expandable-rows" title="Expandable Rows">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">renderExpanded</code> function
            to enable row expansion. Each row gets a chevron toggle on the left that reveals a
            detail panel below. The function receives the row data and index, and can return any
            React content.
          </p>
          <ComponentExample
            code={`<DataTable
  data={orders}
  columns={orderColumns}
  title="Recent Orders"
  renderExpanded={(row) => (
    <div className="space-y-2 text-sm text-[var(--muted)]">
      <p><strong>Order:</strong> {row.id}</p>
      <p><strong>Date:</strong> {row.date}</p>
      <p><strong>Items:</strong> {row.items} line items</p>
      <p><strong>Notes:</strong> Click any row to see its details.</p>
    </div>
  )}
/>`}
          >
            <div className="w-full">
              <DataTable
                data={orderData}
                columns={orderColumns}
                title="Recent Orders"
                renderExpanded={(row) => (
                  <div className="space-y-2 text-sm text-[var(--muted)]">
                    <p><strong className="text-[var(--foreground)]">Order:</strong> {row.id}</p>
                    <p><strong className="text-[var(--foreground)]">Date:</strong> {row.date}</p>
                    <p><strong className="text-[var(--foreground)]">Items:</strong> {row.items} line items</p>
                    <p><strong className="text-[var(--foreground)]">Shipping:</strong> Standard delivery, estimated 3-5 business days</p>
                  </div>
                )}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Conditional Formatting */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="conditional-formatting" title="Conditional Formatting">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Apply color rules at the column level with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">conditions</code> — the
            same system used by KpiCard. Rules are evaluated top-to-bottom; first match wins.
            Supports <code className="font-[family-name:var(--font-mono)] text-[12px]">above</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">below</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">between</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">equals</code>, and compound{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">and</code>/<code className="font-[family-name:var(--font-mono)] text-[12px]">or</code> rules.
            For row-level highlighting, use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">rowConditions</code> to
            apply CSS classes to entire rows based on a predicate function.
          </p>
          <ComponentExample
            code={`const columns = [
  { key: "metric", header: "Metric", type: "text" },
  {
    key: "value",
    header: "Current",
    type: "number",
    conditions: [
      { when: "above", value: 99, color: "emerald" },
      { when: "between", min: 50, max: 99, color: "amber" },
      { when: "below", value: 50, color: "red" },
    ],
  },
  { key: "target", header: "Target", type: "number" },
  {
    key: "delta",
    header: "Delta",
    type: "number",
    conditions: [
      { when: "above", value: 0, color: "emerald" },
      { when: "below", value: 0, color: "red" },
    ],
  },
];

<DataTable data={metrics} columns={columns} title="SLA Dashboard" />`}
          >
            <div className="w-full">
              <DataTable
                data={metricData}
                columns={conditionalColumns}
                title="SLA Dashboard"
              />
            </div>
          </ComponentExample>
          <CodeBlock
            code={`// Row-level conditions — apply a className to entire rows
<DataTable
  data={data}
  columns={columns}
  rowConditions={[
    {
      when: (row) => row.status === "critical",
      className: "bg-red-500/10",
    },
    {
      when: (row) => row.status === "warning",
      className: "bg-amber-500/10",
    },
  ]}
/>`}
            className="mt-4"
          />
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Pagination & Footer */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="pagination-footer" title="Pagination & Footer">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pageSize</code> to
            enable pagination with Previous/Next controls and a row range indicator. Use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">footer</code> to
            add a summary/totals row — pass an object keyed by column key with ReactNode values.
            Combine with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">searchable</code> for
            client-side filtering.
          </p>
          <ComponentExample
            code={`<DataTable
  data={productData}
  columns={[
    { key: "product", header: "Product", type: "text", pin: "left" },
    { key: "price", header: "Price", type: "currency" },
    { key: "growth", header: "Growth", type: "percent" },
    { key: "category", header: "Category", type: "text" },
  ]}
  title="Product Catalog"
  pageSize={3}
  searchable
  footer={{ product: "Total", price: "$19,798", growth: "", category: "" }}
/>`}
          >
            <div className="w-full">
              <DataTable
                data={productData}
                columns={[
                  { key: "product", header: "Product", type: "text" as const, pin: "left" as const },
                  { key: "price", header: "Price", type: "currency" as const },
                  { key: "growth", header: "Growth", type: "percent" as const },
                  { key: "category", header: "Category", type: "text" as const },
                ]}
                title="Product Catalog"
                pageSize={3}
                searchable
                footer={{ product: "Total", price: "$19,798", growth: "", category: "" }}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* ----------------------------------------------------------------- */}
        {/* Data States */}
        {/* ----------------------------------------------------------------- */}
        <DocSection id="data-states" title="Data States">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            DataTable handles loading, empty, and error states out of the box. The loading state
            renders animated skeleton rows that match your column layout.
          </p>
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
              <DataTable data={[]} loading title="Loading Table" />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Empty</p>
              <DataTable
                data={[]}
                title="Empty Table"
                empty={{ message: "No data matches your filters" }}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Loading — renders skeleton rows
<DataTable data={[]} loading />

// Empty state with custom message
<DataTable data={[]} empty={{ message: "No results found" }} />

// Error state
<DataTable data={[]} error={{ message: "Failed to load data" }} />

// Stale data indicator
<DataTable data={staleData} stale={{ message: "Data is 5 minutes old" }} />`}
            className="mt-4"
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

        {/* Data Shape */}
        {component.dataShape && (
          <DocSection id="data-shape" title="Data Shape">
            <CodeBlock code={component.dataShape} language="typescript" />
          </DocSection>
        )}

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {component.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI Insights analysis. See the <a href="/docs/ai-insights" className="font-medium text-[var(--accent)] hover:underline">AI Insights guide</a> for details.
            </li>
          </ul>
        </DocSection>

        {/* Playground */}
        <DocSection id="playground" title="Playground">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with every prop interactively. Adjust the controls on the right to see the
            component update in real time.
          </p>
          <div className="rounded-xl border border-[var(--card-border)]">
            <DataTablePlayground />
          </div>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
