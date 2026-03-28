"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { CardShell } from "@/components/ui/CardShell";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { formatValue, evaluateConditions, isCustomColor, type FormatOption, type Condition } from "@/lib/format";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/charts/Sparkline";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { StatusRule, StatusSize } from "@/components/ui/StatusIndicator";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useScrollIndicators } from "@/lib/useScrollIndicators";
import { devWarn, devWarnDeprecated } from "@/lib/devWarnings";
import type { CardVariant, DataComponentProps, EmptyState, ErrorState, StaleState, NullDisplay, ExportableConfig, DataRow } from "@/lib/types";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronRight, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Column type system & color maps
// ---------------------------------------------------------------------------

export type ColumnType = "text" | "number" | "currency" | "percent" | "link" | "badge" | "sparkline" | "status" | "progress" | "date" | "bar";

const NUMERIC_TYPES = new Set<ColumnType>(["number", "currency", "percent", "bar"]);
const CENTER_TYPES = new Set<ColumnType>(["sparkline", "progress"]);
const RIGHT_TYPES = new Set<ColumnType>(["number", "currency", "percent", "bar"]);

const conditionColorMap: Record<string, string> = {
  emerald: "var(--mu-color-positive)", green: "var(--mu-color-positive)",
  red: "var(--mu-color-negative)", amber: "var(--mu-color-warning)",
  yellow: "var(--mu-color-warning)", blue: "var(--mu-color-info)",
  indigo: "#6366F1", purple: "#8B5CF6", pink: "#EC4899", cyan: "#06B6D4",
};

function resolveConditionColor(color: string): string {
  return isCustomColor(color) ? color : (conditionColorMap[color] ?? color);
}

const BADGE_COLOR_MAP: Record<string, string> = {
  active: "#10B981", success: "#10B981", completed: "#10B981", healthy: "#10B981",
  inactive: "#EF4444", failed: "#EF4444", error: "#EF4444", critical: "#EF4444",
  pending: "#F59E0B", warning: "#F59E0B",
};

const BADGE_VARIANT_MAP: Record<string, "success" | "danger" | "warning" | "default"> = {
  active: "success", success: "success", completed: "success", healthy: "success",
  inactive: "danger", failed: "danger", error: "danger", critical: "danger",
  pending: "warning", warning: "warning",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Column<T = DataRow> {
  key: string;
  header?: string;
  /** @deprecated Use `header` instead */
  label?: string;
  type?: ColumnType;
  format?: FormatOption;
  align?: "left" | "center" | "right";
  width?: string | number;
  sortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
  pin?: "left";
  wrap?: boolean;
  conditions?: Condition[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkHref?: (value: any, row: T) => string;
  linkTarget?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  badgeColor?: (value: any, row: T) => string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  badgeVariant?: (value: any, row: T) => "default" | "success" | "warning" | "danger" | "info" | "outline" | undefined;
  statusRules?: StatusRule[];
  statusSize?: StatusSize;
  dateFormat?: Intl.DateTimeFormatOptions;
}

export type ColumnDef<T> = Column<T>;

export interface RowCondition<T> {
  when: (row: T, index: number) => boolean;
  className: string;
}

export interface FooterRow {
  [key: string]: React.ReactNode;
}

export interface DataTableProps<T extends DataRow = DataRow> extends DataComponentProps {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: ColumnDef<any>[];
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: React.ReactNode;
  action?: React.ReactNode;
  pageSize?: number;
  pagination?: boolean;
  maxRows?: number;
  onViewAll?: () => void;
  striped?: boolean;
  dense?: boolean;
  onRowClick?: (row: T, index: number) => void;
  /** Drill-down. `true` for auto-generated detail view, or a function for custom content. Clicking a row opens the drill-down panel. Takes priority over crossFilter. */
  drillDown?: true | ((row: DataRow, index: number) => React.ReactNode);
  /** Drill-down presentation mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  nullDisplay?: NullDisplay;
  footer?: FooterRow;
  stickyHeader?: boolean;
  classNames?: {
    root?: string; header?: string; table?: string; thead?: string;
    tbody?: string; row?: string; cell?: string; footer?: string; pagination?: string;
  };
  searchable?: boolean;
  animate?: boolean;
  scrollIndicators?: boolean;
  rowConditions?: RowCondition<T>[];
  /** Enable Shift+click multi-column sorting. Default: false (single sort) */
  multiSort?: boolean;
  /** Render expanded detail panel below a row. Enables chevron toggle on each row. */
  renderExpanded?: (row: T, index: number) => React.ReactNode;
  /** Field name containing child rows for hierarchical/grouped display. Children must have the same shape as parent rows. */
  childrenField?: string;
  /** Start grouped rows expanded. Default: false */
  defaultExpanded?: boolean;
  /** Field name whose value is compared against linkedHover.hoveredIndex to highlight rows. */
  linkedIndexField?: string;
  /** Enable cross-filter selection. Pass `true` to use the first column's key as the field, or `{ field }` to override. */
  crossFilter?: boolean | { field?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SortDirection = "asc" | "desc" | null;

function resolveHeader<T>(col: Column<T>): string {
  return col.header ?? col.label ?? String(col.key);
}

function getNestedValue(obj: DataRow, key: string): unknown {
  return obj[key];
}

function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) return true;
  return false;
}

function keyToHeader(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T|\s)/;

function inferColumnType<T extends DataRow>(data: T[], key: string): { type?: ColumnType; format?: FormatOption; align?: "left" | "center" | "right" } {
  // Sample up to 20 rows for type detection
  const sample = data.slice(0, 20);
  const values = sample.map((row) => row[key]).filter((v) => v != null);
  if (values.length === 0) return {};

  const first = values[0];

  // Boolean → badge
  if (typeof first === "boolean") {
    return { type: "badge", align: "center" };
  }

  // Number → right-aligned, sortable, number format
  if (typeof first === "number") {
    return { format: "number", align: "right" };
  }

  // Date object → date
  if (first instanceof Date) {
    return { type: "date", align: "left" };
  }

  // ISO date string → date
  if (typeof first === "string" && ISO_DATE_RE.test(first)) {
    return { type: "date", align: "left" };
  }

  // Low-cardinality string (≤10 unique values) → badge
  if (typeof first === "string") {
    const unique = new Set(values as string[]);
    if (unique.size <= 10 && unique.size < values.length) {
      return { type: "badge", align: "left" };
    }
  }

  // Array of numbers → sparkline
  if (Array.isArray(first) && first.length > 0 && typeof first[0] === "number") {
    return { type: "sparkline", align: "center" };
  }

  return {};
}

function inferColumns<T extends DataRow>(data: T[]): ColumnDef<T>[] {
  if (data.length === 0) return [];
  const firstRow = data[0];
  return Object.keys(firstRow).map((key) => {
    const inferred = inferColumnType(data, key);
    return {
      key,
      header: keyToHeader(key),
      sortable: true,
      ...inferred,
    };
  });
}

function inferAlignFromType(type?: ColumnType): "left" | "center" | "right" | undefined {
  if (!type) return undefined;
  if (RIGHT_TYPES.has(type)) return "right";
  if (CENTER_TYPES.has(type)) return "center";
  return "left";
}

function inferFormatFromType(type?: ColumnType): FormatOption | undefined {
  if (type === "currency") return "currency";
  if (type === "percent") return "percent";
  if (type === "number") return "number";
  return undefined;
}

function isNumericColumn<T>(col: ColumnDef<T>, data: T[]): boolean {
  if (col.type) return NUMERIC_TYPES.has(col.type);
  if (col.format) return true;
  for (const row of data) {
    const val = getNestedValue(row as DataRow, col.key as string);
    if (val != null) return isNumeric(val);
  }
  return false;
}

function inferAlign<T>(col: ColumnDef<T>, data: T[]): "left" | "center" | "right" {
  if (col.align) return col.align;
  const typeAlign = inferAlignFromType(col.type);
  if (typeAlign) return typeAlign;
  if (col.format) return "right";
  for (const row of data) {
    const val = getNestedValue(row as DataRow, col.key as string);
    if (val != null) return isNumeric(val) ? "right" : "left";
  }
  return "left";
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TableSkeleton<T>({ columns, rows = 5 }: { columns: ColumnDef<T>[]; rows?: number; dense?: boolean }) {
  const py = "py-[var(--mu-table-py)]";
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--card-border)]">
            {columns.map((_, i) => (
              <th key={i} className={cn("whitespace-nowrap px-5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]", py)}>
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} className="border-b border-[var(--card-border)]/50">
              {columns.map((_, ci) => (
                <td key={ci} className={cn("px-5", py)}>
                  <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" style={{ width: `${45 + ((ri * 7 + ci * 13) % 40)}%`, animationDelay: `${(ri * columns.length + ci) * 50}ms` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header helper
// ---------------------------------------------------------------------------

function renderHeader(title?: string, subtitle?: string, description?: string | React.ReactNode, action?: React.ReactNode) {
  if (!title && !action) return null;
  return (
    <div className="flex items-start justify-between px-5 pb-2 pt-5">
      <div>
        <div className="flex items-center gap-1.5">
          {title && <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{title}</span>}
          {description && <DescriptionPopover content={typeof description === "string" ? description : description} />}
        </div>
        {subtitle && <p className="mt-0.5 text-[11px] text-[var(--muted)]">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DataTableInner<T extends DataRow = DataRow>(
  {
    data, columns: columnsProp, title, subtitle, description, footnote, action,
    pageSize, pagination: paginationProp, maxRows, onViewAll, striped = false, dense,
    onRowClick, drillDown, drillDownMode, nullDisplay, footer, variant, className, exportable: exportableProp, loading, empty, error, stale,
    id, "data-testid": dataTestId, aiContext, stickyHeader, classNames, searchable,
    scrollIndicators: scrollIndicatorsProp, rowConditions,
    multiSort: multiSortProp, renderExpanded,
    childrenField, defaultExpanded: defaultExpandedProp,
    linkedIndexField,
    crossFilter: crossFilterProp,
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useComponentConfig({ variant, dense });
  const resolvedDense = ctx.resolvedDense;
  const resolvedVariant = ctx.resolvedVariant;
  const resolvedNullDisplay = nullDisplay ?? ctx.config.nullDisplay;
  const resolvedLoading = loading ?? ctx.config.loading;
  const resolvedScrollIndicators = scrollIndicatorsProp ?? true;
  const resolvedExportable = exportableProp !== undefined ? exportableProp : ctx.config.exportable;
  const overrideExportData = typeof exportableProp === "object" && exportableProp.data ? exportableProp.data : undefined;

  const resolvedColumns = useMemo(() => columnsProp ?? inferColumns(data), [columnsProp, data]);

  // --- Interaction (shared with all components) ---
  // Wrap DataTable's (row, index) drillDown function to match the hook's (event) interface
  const wrappedDrillDown = useMemo(() => {
    if (!drillDown || drillDown === true) return drillDown;
    // drillDown is (row, index) => ReactNode — wrap it
    return (event: { title: string; value: string | number; row?: DataRow; index?: number }) =>
      drillDown(event.row ?? ({} as DataRow), event.index ?? 0);
  }, [drillDown]);

  const interaction = useComponentInteraction({
    drillDown: wrappedDrillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: (resolvedColumns[0]?.key as string) ?? "id",
    tooltipHint: undefined,
    data: data as DataRow[],
  });

  const columns = resolvedColumns;

  // Dev warnings
  if (process.env.NODE_ENV !== "production") {
    for (const col of resolvedColumns) {
      if (col.label && !col.header) {
        devWarnDeprecated("DataTable", "column.label", "column.header");
        break; // warn once
      }
    }

    if (data.length > 0 && columns.length > 0) {
      const firstRow = data[0] as DataRow;
      for (const col of columns) {
        if (col.key && !(String(col.key) in firstRow)) {
          devWarn(`DataTable.column.${String(col.key)}`, `<DataTable> column key "${String(col.key)}" not found in data. Available keys: ${Object.keys(firstRow).join(", ")}`);
        }
      }
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const { showLeft, showRight } = useScrollIndicators(scrollRef);

  // --- Multi-sort state ---
  const [sorts, setSorts] = useState<{ key: string; dir: "asc" | "desc" }[]>([]);
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    if (!defaultExpandedProp || !childrenField) return new Set();
    // Initialize all parent rows as expanded
    const set = new Set<number>();
    data.forEach((row, i) => {
      const children = (row as DataRow)[childrenField];
      if (Array.isArray(children) && children.length > 0) set.add(i);
    });
    return set;
  });

  const enablePagination = paginationProp ?? (pageSize != null && pageSize > 0);
  const effectivePageSize = pageSize ?? 10;

  const handleSort = useCallback((key: string, shiftKey = false) => {
    setSorts((prev) => {
      const existing = prev.findIndex((s) => s.key === key);

      if (multiSortProp && shiftKey) {
        // Multi-sort: Shift+click appends/cycles secondary sort (max 3)
        if (existing >= 0) {
          const s = prev[existing];
          if (s.dir === "asc") return prev.map((x, i) => i === existing ? { ...x, dir: "desc" as const } : x);
          // desc → remove
          return prev.filter((_, i) => i !== existing);
        }
        if (prev.length >= 3) return prev; // cap at 3
        return [...prev, { key, dir: "asc" as const }];
      }

      // Single sort: replace (or cycle existing)
      if (existing >= 0 && prev.length === 1) {
        const s = prev[0];
        if (s.dir === "asc") return [{ key, dir: "desc" as const }];
        return []; // desc → clear
      }
      return [{ key, dir: "asc" as const }];
    });
    setPage(0);
  }, [multiSortProp]);

  // Compat helpers for header rendering
  const getSortDir = useCallback((key: string): "asc" | "desc" | null => {
    const s = sorts.find((s) => s.key === key);
    return s?.dir ?? null;
  }, [sorts]);
  const getSortIndex = useCallback((key: string): number | null => {
    if (!multiSortProp || sorts.length <= 1) return null;
    const idx = sorts.findIndex((s) => s.key === key);
    return idx >= 0 ? idx + 1 : null;
  }, [sorts, multiSortProp]);

  const toggleExpanded = useCallback((index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const sorted = useMemo(() => {
    if (sorts.length === 0) return data;
    return [...data].sort((a, b) => {
      for (const { key, dir } of sorts) {
        const aVal = getNestedValue(a as DataRow, key);
        const bVal = getNestedValue(b as DataRow, key);
        if (aVal === bVal) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = aVal < bVal ? -1 : 1;
        return dir === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }, [data, sorts]);

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return sorted;
    const term = search.toLowerCase();
    return sorted.filter((row) =>
      columns.some((col) => { const val = getNestedValue(row as DataRow, col.key as string); return val != null && String(val).toLowerCase().includes(term); })
    );
  }, [sorted, search, searchable, columns]);

  const effectiveMaxRows = (!showAll && maxRows && !enablePagination) ? maxRows : undefined;
  const truncated = effectiveMaxRows ? filtered.slice(0, effectiveMaxRows) : filtered;
  const hasMore = maxRows != null && !showAll && !enablePagination && filtered.length > maxRows;
  const totalPages = enablePagination ? Math.ceil(truncated.length / effectivePageSize) : 1;
  const paged = enablePagination ? truncated.slice(page * effectivePageSize, (page + 1) * effectivePageSize) : truncated;

  // --- Hierarchical row flattening ---
  interface FlatRow { row: T; depth: number; parentIdx: number; hasChildren: boolean; flatIdx: number }
  const isGrouped = !!childrenField;

  const flatRows = useMemo((): FlatRow[] => {
    if (!isGrouped) {
      return paged.map((row, i) => ({
        row,
        depth: 0,
        parentIdx: -1,
        hasChildren: false,
        flatIdx: enablePagination ? page * effectivePageSize + i : i,
      }));
    }

    const result: FlatRow[] = [];
    let flatIdx = 0;
    for (let i = 0; i < paged.length; i++) {
      const row = paged[i];
      const children = (row as DataRow)[childrenField!];
      const hasChildren = Array.isArray(children) && children.length > 0;
      const parentFlatIdx = flatIdx;
      const globalIdx = enablePagination ? page * effectivePageSize + i : i;

      result.push({ row, depth: 0, parentIdx: -1, hasChildren, flatIdx: globalIdx });
      flatIdx++;

      if (hasChildren && expanded.has(globalIdx)) {
        for (const child of children as T[]) {
          result.push({ row: child, depth: 1, parentIdx: parentFlatIdx, hasChildren: false, flatIdx: -1 });
          flatIdx++;
        }
      }
    }
    return result;
  }, [paged, isGrouped, childrenField, expanded, enablePagination, page, effectivePageSize]);

  const alignments = useMemo(() => columns.map((col) => inferAlign(col, data)), [columns, data]);
  const isMonoColumn = useMemo(() => columns.map((col) => isNumericColumn(col, data)), [columns, data]);

  const columnMaxValues = useMemo(() => {
    const maxes: Record<string, number> = {};
    for (const col of columns) {
      if (col.type === "bar") {
        let max = 0;
        for (const row of data) { const v = getNestedValue(row as DataRow, col.key as string); if (typeof v === "number" && v > max) max = v; }
        maxes[col.key as string] = max;
      }
    }
    return maxes;
  }, [columns, data]);

  const cellPy = "py-[var(--mu-table-py)]";
  const cellPx = "px-[var(--mu-table-px)]";
  const resolvedNullText = resolvedNullDisplay === "zero" ? "0" : resolvedNullDisplay === "dash" ? "\u2014" : resolvedNullDisplay === "blank" ? "" : resolvedNullDisplay === "N/A" ? "N/A" : resolvedNullDisplay;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderTypedCell(col: ColumnDef<T>, value: any, row: T): React.ReactNode {
    const fmt = col.format ?? inferFormatFromType(col.type);
    switch (col.type) {
      case "text": return String(value);
      case "number": case "currency": case "percent":
        return typeof value === "number" ? formatValue(value, fmt, ctx.localeDefaults) : String(value);
      case "link": {
        const href = col.linkHref ? col.linkHref(value, row) : String(value);
        const isExt = col.linkTarget === "_blank";
        return (
          <a href={href} target={col.linkTarget} rel={isExt ? "noopener noreferrer" : undefined}
            className="inline-flex max-w-full items-center gap-1 truncate text-[var(--accent)] underline-offset-2 hover:underline"
            onClick={(e) => e.stopPropagation()}>
            <span className="truncate">{String(value)}</span>
            {isExt && <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 opacity-60" />}
          </a>
        );
      }
      case "badge": {
        const strVal = String(value).toLowerCase();
        return <Badge variant={col.badgeVariant?.(value, row) ?? BADGE_VARIANT_MAP[strVal] ?? "default"} color={col.badgeColor?.(value, row) ?? BADGE_COLOR_MAP[strVal]} size="sm">{String(value)}</Badge>;
      }
      case "sparkline": {
        const d = Array.isArray(value) ? value : [];
        return <div className="inline-flex items-center" style={{ width: 80, height: 20 }}><Sparkline data={d} height={20} width={80} animate={false} /></div>;
      }
      case "status": {
        const numVal = typeof value === "number" ? value : parseFloat(String(value));
        return <StatusIndicator value={isNaN(numVal) ? null : numVal} rules={col.statusRules ?? []} size={col.statusSize ?? "sm"} />;
      }
      case "progress": {
        const numVal = typeof value === "number" ? value : parseFloat(String(value));
        return <div className="w-full min-w-[60px] max-w-[120px] mx-auto"><ProgressBar value={isNaN(numVal) ? 0 : numVal} /></div>;
      }
      case "date": {
        const d = value instanceof Date ? value : new Date(String(value));
        if (isNaN(d.getTime())) return String(value);
        return new Intl.DateTimeFormat(ctx.localeDefaults.locale ?? "en-US", col.dateFormat ?? { year: "numeric", month: "short", day: "numeric" }).format(d);
      }
      case "bar":
        return typeof value === "number" ? formatValue(value, fmt, ctx.localeDefaults) : String(value);
      default: return String(value);
    }
  }

  const formatCell = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (col: ColumnDef<T>, value: any, row: T, index: number): React.ReactNode => {
      if (col.render) return col.render(value, row, index);
      if (value === null || value === undefined) return resolvedNullText;
      if (col.type) return renderTypedCell(col, value, row);
      if (col.format && typeof value === "number") return formatValue(value, col.format, ctx.localeDefaults);
      if (typeof value === "number" && !col.format) return value.toLocaleString(ctx.localeDefaults.locale);
      return String(value ?? "");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctx.localeDefaults, resolvedNullText, columnMaxValues]
  );

  // --- Data states handled by CardShell (except loading, which uses custom TableSkeleton) ---
  const resolvedEmpty = !resolvedLoading && (empty || data.length === 0) ? (empty ?? { message: "No data available" }) : undefined;

  return (
    <CardShell
      ref={ref}
      id={id}
      data-testid={dataTestId}
      componentName="DataTable"
      aiTitle={title}
      aiContext={aiContext}
      variant={resolvedVariant}
      dense={resolvedDense}
      error={error}
      empty={resolvedEmpty}
      stale={stale}
      exportable={resolvedExportable}
      exportData={overrideExportData ?? (data as DataRow[])}
      className={cn("p-0", className)}
      classNames={{ root: classNames?.root }}
    >
      {resolvedLoading ? (
        <>
          {renderHeader(title, subtitle, description, action)}
          <TableSkeleton columns={columns} rows={effectivePageSize > 5 ? 5 : effectivePageSize} dense={resolvedDense} />
        </>
      ) : (
      <>
      {renderHeader(title, subtitle, description, action)}

      {searchable && (
        <div className="px-5">
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="mb-3 w-full rounded-lg border border-[var(--card-border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
        </div>
      )}

      {/* Table with scroll indicators */}
      <div className="relative">
        {resolvedScrollIndicators && showLeft && (
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6" style={{ background: "linear-gradient(to right, var(--mu-card-bg), transparent)" }} />
        )}
        {resolvedScrollIndicators && showRight && (
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6" style={{ background: "linear-gradient(to left, var(--mu-card-bg), transparent)" }} />
        )}

        <div ref={scrollRef} className="overflow-x-auto">
          <table className={cn("w-full text-sm", classNames?.table)}>
            <thead className={cn(stickyHeader && "sticky top-0 z-20 bg-[var(--card-bg)]", classNames?.thead)}>
              <tr className="border-b border-[var(--card-border)]">
                {/* Expand/group column header */}
              {(renderExpanded || isGrouped) && <th className={cn("w-8", cellPy)} />}
              {columns.map((col, ci) => {
                  const align = alignments[ci];
                  const isSortable = col.sortable === true;
                  const dir = getSortDir(String(col.key));
                  const sortIdx = getSortIndex(String(col.key));
                  return (
                    <th key={String(col.key)}
                      className={cn(
                        "whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]",
                        cellPx, cellPy,
                        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
                        isSortable && "cursor-pointer select-none transition-colors hover:text-[var(--foreground)]",
                        col.pin === "left" && "sticky left-0 z-10 bg-[var(--card-bg)]",
                      )}
                      style={col.width ? { width: typeof col.width === "number" ? `${col.width}px` : col.width } : undefined}
                      onClick={(e) => isSortable && handleSort(String(col.key), e.shiftKey)}>
                      <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end")}>
                        {resolveHeader(col)}
                        {isSortable && (dir
                          ? (<span className="inline-flex items-center">
                              {dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              {sortIdx && <span className="ml-0.5 text-[8px] font-bold text-[var(--accent)]">{sortIdx}</span>}
                            </span>)
                          : <ChevronsUpDown className="h-3 w-3 opacity-50" />)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {flatRows.map((flatRow, ri) => {
                const { row, depth, hasChildren, flatIdx: gi } = flatRow;
                const isChild = depth > 0;
                const isParent = hasChildren;
                const rcClasses = rowConditions?.filter((rc) => rc.when(row, gi)).map((rc) => rc.className).join(" ") ?? "";
                const showExpandChevron = renderExpanded || isGrouped;
                const isLinkedHighlight = linkedIndexField && interaction.linkedHover?.hoveredIndex != null && (row as DataRow)[linkedIndexField] === interaction.linkedHover.hoveredIndex;
                return (
                  <React.Fragment key={ri}>
                  <tr className={cn(
                    "group/row border-b border-[var(--card-border)]/50 transition-all hover:bg-[var(--card-glow)]",
                    striped && ri % 2 === 1 && "bg-[var(--card-glow)]/50",
                    (onRowClick || interaction.isInteractive) && "cursor-pointer",
                    expanded.has(gi) && "bg-[var(--card-glow)]/30",
                    isParent && "font-medium",
                    isChild && "text-[var(--muted)]",
                    rcClasses,
                  )} style={{
                    ...(isLinkedHighlight ? { backgroundColor: "color-mix(in srgb, var(--accent) 5%, transparent)" } : {}),
                    transition: "all 200ms ease",
                  }} onClick={() => {
                    onRowClick?.(row, gi);
                    if (interaction.isInteractive) {
                      const rowRecord = row as DataRow;
                      const firstCol = columns[0]?.key;
                      const titleVal = firstCol ? String(rowRecord[firstCol] ?? "") : `Row ${gi + 1}`;
                      interaction.handleClick({ title: titleVal, value: interaction.crossFilterField ? rowRecord[interaction.crossFilterField] as string | number : gi, row: rowRecord, index: gi });
                    }
                  }}>
                    {/* Expand/group chevron */}
                    {showExpandChevron && (
                      <td className={cn("w-8 text-center", cellPy)} style={isChild ? { paddingLeft: depth * 16 } : undefined}>
                        {(isParent || (renderExpanded && !isChild)) ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleExpanded(gi); }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-[var(--muted)] transition-all hover:bg-[var(--card-glow)] hover:text-[var(--foreground)]"
                            aria-expanded={expanded.has(gi)}
                            aria-label={isParent ? "Expand group" : "Expand row"}
                          >
                            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expanded.has(gi) && "rotate-90")} />
                          </button>
                        ) : null}
                      </td>
                    )}
                    {columns.map((col, ci) => {
                      const align = alignments[ci];
                      const isMono = isMonoColumn[ci];
                      const value = getNestedValue(row as DataRow, col.key as string);
                      const isPinned = col.pin === "left";
                      const isBar = col.type === "bar";
                      const isWrapped = col.wrap === true;

                      let condStyle: React.CSSProperties | undefined;
                      if (col.conditions && typeof value === "number") {
                        const cr = evaluateConditions(value, col.conditions);
                        if (cr) condStyle = { color: resolveConditionColor(cr) };
                      }

                      let barStyle: React.CSSProperties | undefined;
                      if (isBar && typeof value === "number") {
                        const max = columnMaxValues[col.key as string] || 1;
                        const pct = Math.min((value / max) * 100, 100);
                        const bc = col.conditions ? evaluateConditions(value, col.conditions) : null;
                        barStyle = { position: "absolute" as const, left: 0, top: 0, height: "100%", width: `${pct}%`, backgroundColor: bc ? resolveConditionColor(bc) : "var(--accent)", opacity: 0.15 };
                      }

                      return (
                        <td key={String(col.key)}
                          title={value != null && !col.render && !col.type ? String(value) : undefined}
                          className={cn(
                            "overflow-hidden text-ellipsis text-[var(--foreground)]",
                            isWrapped ? "whitespace-normal" : "whitespace-nowrap",
                            isWrapped && "max-w-[300px]", cellPx, cellPy,
                            align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
                            isPinned && "sticky left-0 z-10 bg-[var(--card-bg)]",
                            isPinned && "group-hover/row:bg-[var(--card-glow)]",
                            isBar && "relative",
                          )}
                          style={{
                            ...(isWrapped && col.width ? { maxWidth: typeof col.width === "number" ? `${col.width}px` : col.width } : {}),
                            ...(isChild && ci === 0 ? { paddingLeft: `${depth * 20 + 12}px` } : {}),
                          }}>
                          {isBar && barStyle && <div style={barStyle} />}
                          <span className={cn("text-[13px]", isMono ? "font-[family-name:var(--font-mono)]" : "font-[family-name:var(--font-sans)]", isBar && "relative z-[1]", isChild && "opacity-80")} style={condStyle}>
                            {formatCell(col, value, row, gi)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {/* Expanded detail panel (not for grouped child rows — they expand inline) */}
                  {renderExpanded && !isChild && expanded.has(gi) && (
                    <tr className="border-b border-[var(--card-border)]/50">
                      <td colSpan={columns.length + 1} className="p-0">
                        <div className="overflow-hidden transition-all">
                          <div className={cn("border-l-2 border-[var(--accent)]/30 px-5 py-4", cellPx)}>
                            {renderExpanded(row, gi)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {footer && (
              <tfoot>
                <tr className="border-t-2 border-[var(--card-border)]">
                  {(renderExpanded || isGrouped) && <td className={cellPy} />}
                  {columns.map((col, ci) => {
                    const align = alignments[ci];
                    const isMono = isMonoColumn[ci];
                    return (
                      <td key={String(col.key)}
                        className={cn("whitespace-nowrap font-semibold text-[var(--foreground)]", cellPx, cellPy,
                          align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
                          col.pin === "left" && "sticky left-0 z-10 bg-[var(--card-bg)]")}>
                        <span className={cn("text-[13px]", isMono ? "font-[family-name:var(--font-mono)]" : "font-[family-name:var(--font-sans)]")}>
                          {footer[col.key as string] ?? ""}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {hasMore && (
        <div className="border-t border-[var(--card-border)] px-5 py-3 text-center">
          <button onClick={() => { onViewAll ? onViewAll() : setShowAll(true); }}
            className="text-xs font-medium text-[var(--accent)] transition-colors hover:opacity-80">
            View all {data.length} rows
          </button>
        </div>
      )}

      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--card-border)] px-5 py-3">
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">
            {page * effectivePageSize + 1}&ndash;{Math.min((page + 1) * effectivePageSize, truncated.length)} of {truncated.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="rounded-md px-3 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="rounded-md px-3 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--card-glow)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}

      {footnote && (
        <div className="border-t border-[var(--card-border)] px-5 py-3 text-[10px] leading-snug text-[var(--muted)]">
          {footnote}
        </div>
      )}
      </>
      )}
    </CardShell>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <T extends DataRow = DataRow>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement | null;

(DataTable as any).__gridHint = "table"; // eslint-disable-line @typescript-eslint/no-explicit-any
