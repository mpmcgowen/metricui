/**
 * MetricUI Theme Presets
 *
 * Each preset defines a brand color that drives the entire dashboard aesthetic:
 * accent color (CSS variable), chart series palette, and light/dark variants.
 *
 * Pass a preset name to <MetricProvider theme="emerald"> or use the
 * ThemePreset type to define custom themes.
 */

export interface ThemePreset {
  /** Display name */
  name: string;
  /** Primary accent color for light mode */
  accent: string;
  /** Primary accent color for dark mode */
  accentDark: string;
  /** Chart series color palette (8 colors, colorblind-safe) */
  colors: string[];
}

// ---------------------------------------------------------------------------
// Built-in presets
// ---------------------------------------------------------------------------

export const THEME_PRESETS: Record<string, ThemePreset> = {
  indigo: {
    name: "Indigo",
    accent: "#4F46E5",
    accentDark: "#818CF8",
    colors: ["#6366F1", "#06B6D4", "#F59E0B", "#EC4899", "#10B981", "#F97316", "#8B5CF6", "#14B8A6"],
  },
  emerald: {
    name: "Emerald",
    accent: "#059669",
    accentDark: "#34D399",
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#6366F1", "#F97316", "#14B8A6", "#8B5CF6"],
  },
  rose: {
    name: "Rose",
    accent: "#E11D48",
    accentDark: "#FB7185",
    colors: ["#F43F5E", "#6366F1", "#06B6D4", "#F59E0B", "#10B981", "#8B5CF6", "#F97316", "#14B8A6"],
  },
  amber: {
    name: "Amber",
    accent: "#D97706",
    accentDark: "#FBBF24",
    colors: ["#F59E0B", "#6366F1", "#06B6D4", "#EC4899", "#10B981", "#F97316", "#8B5CF6", "#14B8A6"],
  },
  cyan: {
    name: "Cyan",
    accent: "#0891B2",
    accentDark: "#22D3EE",
    colors: ["#06B6D4", "#6366F1", "#F59E0B", "#EC4899", "#10B981", "#F97316", "#8B5CF6", "#14B8A6"],
  },
  violet: {
    name: "Violet",
    accent: "#7C3AED",
    accentDark: "#A78BFA",
    colors: ["#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899", "#10B981", "#F97316", "#6366F1", "#14B8A6"],
  },
  slate: {
    name: "Slate",
    accent: "#475569",
    accentDark: "#94A3B8",
    colors: ["#64748B", "#3B82F6", "#F59E0B", "#EC4899", "#10B981", "#F97316", "#8B5CF6", "#06B6D4"],
  },
  orange: {
    name: "Orange",
    accent: "#EA580C",
    accentDark: "#FB923C",
    colors: ["#F97316", "#6366F1", "#06B6D4", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6", "#14B8A6"],
  },
};

/** List of preset names for iteration */
export const PRESET_NAMES = Object.keys(THEME_PRESETS) as (keyof typeof THEME_PRESETS)[];

/** Default preset */
export const DEFAULT_THEME = "indigo";
