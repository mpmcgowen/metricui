/**
 * MetricUI Unified Data Transform
 *
 * Converts a flat row-based data format into the Nivo-specific shapes
 * each chart type requires. This enables a single, portable API:
 *
 *   <BarChart data={rows} index="month" categories={["revenue", "costs"]} />
 *   <AreaChart data={rows} index="month" categories={["revenue", "costs"]} />
 *
 * Swap chart type, keep the same data — it just works.
 */

import type { FormatOption } from "./format";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Category config — either a plain key string or a rich config object.
 *
 * Plain:  categories={["revenue", "costs"]}
 * Rich:   categories={[{ key: "revenue", format: "currency" }, { key: "churn", format: "percent", axis: "right" }]}
 * Mixed:  categories={["revenue", { key: "churn", format: "percent" }]}
 */
export interface CategoryConfig {
  /** Column key in the data row */
  key: string;
  /** Display label (defaults to key) */
  label?: string;
  /** Format for this category's values */
  format?: FormatOption;
  /** Override color for this category */
  color?: string;
  /** Assign to right Y-axis (used by BarLineChart and AreaChart dual-axis) */
  axis?: "left" | "right";
}

/** A category can be a plain string or a full config object */
export type Category = string | CategoryConfig;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a Category to a full CategoryConfig */
export function resolveCategory(cat: Category): CategoryConfig {
  return typeof cat === "string" ? { key: cat } : cat;
}

/** Extract just the key strings from a categories array */
export function categoryKeys(categories: Category[]): string[] {
  return categories.map((c) => (typeof c === "string" ? c : c.key));
}

/** Extract color overrides as a map (key → color), skipping unset */
export function categoryColors(categories: Category[]): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const cat of categories) {
    if (typeof cat !== "string" && cat.color) {
      colors[cat.key] = cat.color;
    }
  }
  return colors;
}

/** Extract right-axis series IDs */
export function rightAxisCategories(categories: Category[]): string[] {
  return categories
    .map(resolveCategory)
    .filter((c) => c.axis === "right")
    .map((c) => c.label ?? c.key);
}

/** Extract per-category format overrides */
export function categoryFormats(categories: Category[]): Record<string, FormatOption> {
  const formats: Record<string, FormatOption> = {};
  for (const cat of categories) {
    if (typeof cat !== "string" && cat.format) {
      formats[cat.key] = cat.format;
    }
  }
  return formats;
}

// ---------------------------------------------------------------------------
// Auto-inference
// ---------------------------------------------------------------------------

/**
 * Infer index and categories from the first data row.
 * - Index = first string-valued key
 * - Categories = all number-valued keys
 */
export function inferSchema<T extends Record<string, unknown>>(
  data: T[]
): { index: string; categories: string[] } | null {
  if (!data.length) return null;
  const row = data[0];
  let index: string | null = null;
  const categories: string[] = [];

  for (const [key, value] of Object.entries(row)) {
    if (index === null && typeof value === "string") {
      index = key;
    } else if (typeof value === "number") {
      categories.push(key);
    }
  }

  if (!index || categories.length === 0) return null;
  return { index, categories };
}

// ---------------------------------------------------------------------------
// Transform: flat rows → Nivo Line/Area series
// ---------------------------------------------------------------------------

/**
 * Converts flat rows into Nivo's `ResponsiveLine` data format.
 *
 * Input:  [{ month: "Jan", revenue: 100, costs: 50 }]
 * Output: [{ id: "revenue", data: [{ x: "Jan", y: 100 }] },
 *          { id: "costs",   data: [{ x: "Jan", y: 50 }] }]
 */
export function toLineSeries<T extends Record<string, unknown>>(
  data: T[],
  index: string,
  categories: Category[]
): { id: string; data: { x: string | number; y: number | null }[] }[] {
  return categories.map(resolveCategory).map((cat) => ({
    id: cat.label ?? cat.key,
    data: data.map((row) => ({
      x: row[index] as string | number,
      y: row[cat.key] == null ? null : Number(row[cat.key]),
    })),
  }));
}

// ---------------------------------------------------------------------------
// Transform: flat rows → Nivo Bar data (passthrough + keys extraction)
// ---------------------------------------------------------------------------

/**
 * For BarChart, the flat row format is already what Nivo expects.
 * This function just validates and returns the keys/indexBy from categories.
 *
 * Input:  data=[{ month: "Jan", revenue: 100 }], index="month", categories=["revenue"]
 * Output: { data, keys: ["revenue"], indexBy: "month" }
 */
export function toBarData<T extends Record<string, unknown>>(
  data: T[],
  index: string,
  categories: Category[]
): {
  data: Record<string, string | number>[];
  keys: string[];
  indexBy: string;
} {
  return {
    data: data as unknown as Record<string, string | number>[],
    keys: categoryKeys(categories),
    indexBy: index,
  };
}

// ---------------------------------------------------------------------------
// Transform: flat rows → Nivo Pie/Donut data
// ---------------------------------------------------------------------------

/**
 * Converts flat rows into DonutChart data.
 *
 * With one category (typical):
 *   data=[{ browser: "Chrome", share: 65 }], index="browser", categories=["share"]
 *   → [{ id: "Chrome", label: "Chrome", value: 65 }]
 *
 * The index column becomes the slice label, the single category is the value.
 */
export function toDonutData<T extends Record<string, unknown>>(
  data: T[],
  index: string,
  categories: Category[]
): { id: string; label: string; value: number; color?: string }[] {
  const cat = resolveCategory(categories[0]);
  const colorOverrides = categoryColors(categories);

  return data.map((row) => ({
    id: String(row[index]),
    label: String(row[index]),
    value: Number(row[cat.key]) || 0,
    ...(colorOverrides[cat.key] ? { color: colorOverrides[cat.key] } : {}),
  }));
}

// ---------------------------------------------------------------------------
// Transform: flat rows → Nivo HeatMap series
// ---------------------------------------------------------------------------

/**
 * Converts flat rows into HeatMap series format.
 *
 * Input:  [{ day: "Mon", "9am": 12, "10am": 45 }], index="day", categories=["9am","10am"]
 * Output: [{ id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }] }]
 */
export function toHeatMapSeries<T extends Record<string, unknown>>(
  data: T[],
  index: string,
  categories: Category[]
): { id: string; data: { x: string; y: number | null }[] }[] {
  const keys = categoryKeys(categories);
  return data.map((row) => ({
    id: String(row[index]),
    data: keys.map((key) => ({
      x: key,
      y: row[key] == null ? null : Number(row[key]),
    })),
  }));
}

// ---------------------------------------------------------------------------
// Transform: flat rows → BarLineChart split
// ---------------------------------------------------------------------------

/**
 * Splits flat rows into bar data and line data for BarLineChart.
 * Categories with `axis: "right"` become line series, the rest become bars.
 *
 * Input:  data=[{ month: "Jan", revenue: 100, margin: 0.45 }]
 *         index="month"
 *         categories=[{ key: "revenue" }, { key: "margin", axis: "right" }]
 * Output: {
 *   barData: [{ month: "Jan", revenue: 100 }],
 *   barKeys: ["revenue"],
 *   lineData: [{ id: "margin", data: [{ x: "Jan", y: 0.45 }] }],
 *   indexBy: "month"
 * }
 */
export function toBarLineData<T extends Record<string, unknown>>(
  data: T[],
  index: string,
  categories: Category[]
): {
  barData: Record<string, string | number>[];
  barKeys: string[];
  lineData: { id: string; data: { x: string | number; y: number | null }[] }[];
  indexBy: string;
} {
  const resolved = categories.map(resolveCategory);
  const barCats = resolved.filter((c) => c.axis !== "right");
  const lineCats = resolved.filter((c) => c.axis === "right");

  const barKeys = barCats.map((c) => c.key);
  const barData = data.map((row) => {
    const out: Record<string, string | number> = { [index]: row[index] as string | number };
    for (const cat of barCats) {
      out[cat.key] = row[cat.key] == null ? 0 : Number(row[cat.key]);
    }
    return out;
  });

  const lineData = lineCats.map((cat) => ({
    id: cat.label ?? cat.key,
    data: data.map((row) => ({
      x: row[index] as string | number,
      y: row[cat.key] == null ? null : Number(row[cat.key]),
    })),
  }));

  return { barData, barKeys, lineData, indexBy: index };
}
