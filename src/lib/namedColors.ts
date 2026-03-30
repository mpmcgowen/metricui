/**
 * Named color → CSS color resolution.
 *
 * Single source of truth for converting named colors ("emerald", "red")
 * to CSS color values. Used by Headline, ProgressBar, Gauge, KpiCard conditions.
 */

export const NAMED_COLORS: Record<string, string> = {
  emerald: "#10B981",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
  yellow: "#F59E0B",
  blue: "#3B82F6",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  pink: "#EC4899",
  cyan: "#06B6D4",
  orange: "#F97316",
  rose: "#F43F5E",
  slate: "#64748B",
  violet: "#8B5CF6",
};

/**
 * Resolve a named color to a CSS color value.
 * Returns the input unchanged if not a known name (assumes CSS color).
 */
export function resolveNamedColor(color: string): string {
  return NAMED_COLORS[color] ?? color;
}

/**
 * Check if a string is a known named color.
 */
export function isNamedColor(color: string): boolean {
  return color in NAMED_COLORS;
}
