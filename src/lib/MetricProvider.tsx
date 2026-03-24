"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MotionConfig } from "./motion";
import { DEFAULT_MOTION_CONFIG } from "./motion";
import type { CardVariant, NullDisplay, ChartNullMode } from "./types";
import { SERIES_COLORS } from "./chartColors";
import { THEME_PRESETS, type ThemePreset } from "./themes";

// ---------------------------------------------------------------------------
// Theme (dark mode)
// ---------------------------------------------------------------------------

export type ColorScheme = "light" | "dark";

interface ThemeContextValue {
  theme: ColorScheme;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  isDark: false,
  toggle: () => {},
});

/**
 * Returns the current color scheme and a toggle function.
 * Reads from the nearest MetricProvider (or falls back to "light").
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

// ---------------------------------------------------------------------------
// Config type
// ---------------------------------------------------------------------------

export interface MetricConfig {
  /** BCP 47 locale string. Default: "en-US" */
  locale: string;
  /** ISO 4217 currency code. Default: "USD" */
  currency: string;
  /** Global animation toggle. Default: true */
  animate: boolean;
  /** Spring physics config for charts and derived durations. */
  motionConfig: MotionConfig;
  /** Default card variant across all components. Default: "default" */
  variant: CardVariant;
  /** Default series color palette for charts. Default: SERIES_COLORS */
  colors: string[];
  /** How null/undefined values are displayed in cards/tables. Default: "dash" */
  nullDisplay: NullDisplay;
  /** How charts handle null/missing data points. Default: "gap" */
  chartNullMode: ChartNullMode;
  /** Global compact/dense layout toggle. Default: false */
  dense: boolean;
  /** Default empty state template (message and icon). */
  emptyState: { message?: string; icon?: React.ReactNode };
  /** Default error state template (message). */
  errorState: { message?: string };
  /** Global loading toggle — when true, all components show skeletons. Default: false */
  loading: boolean;
  /** Noise texture on card surfaces. Default: true */
  texture: boolean;
  /** Global export toggle — when true, all components show export buttons. Default: false */
  exportable: boolean;
  /** Print mode — auto-generates report header/footer/captions when printing. Default: false */
  printMode: boolean | { title?: string; subtitle?: string; logo?: string; footer?: string };
}

/** Fully-resolved defaults — used when no provider is present. */
const DEFAULT_CONFIG: MetricConfig = {
  locale: "en-US",
  currency: "USD",
  animate: true,
  motionConfig: DEFAULT_MOTION_CONFIG,
  variant: "default",
  colors: SERIES_COLORS,
  nullDisplay: "dash",
  chartNullMode: "gap",
  dense: false,
  emptyState: {},
  errorState: {},
  loading: false,
  texture: true,
  exportable: false,
  printMode: false,
};

export { DEFAULT_CONFIG as DEFAULT_METRIC_CONFIG };

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const MetricConfigContext = createContext<MetricConfig>(DEFAULT_CONFIG);

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Returns the full resolved MetricConfig from the nearest provider. */
export function useMetricConfig(): MetricConfig {
  return useContext(MetricConfigContext);
}

/** Backward-compatible locale hook. */
export interface LocaleDefaults {
  locale: string;
  currency: string;
}

export function useLocale(): LocaleDefaults {
  const config = useMetricConfig();
  return { locale: config.locale, currency: config.currency };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

type MetricProviderProps = Partial<Omit<MetricConfig, "emptyState" | "errorState">> & {
  emptyState?: { message?: string; icon?: React.ReactNode };
  errorState?: { message?: string };
  /** Theme preset name or custom ThemePreset object. Sets accent color and chart palette. */
  theme?: string | ThemePreset;
  /** Color scheme. "auto" detects system preference. Default: "auto" for root, inherited for nested. */
  colorScheme?: ColorScheme | "auto";
  children: React.ReactNode;
};

/**
 * Global config provider for MetricUI.
 *
 * Nested providers merge with their parent — only the fields you specify
 * are overridden, everything else inherits.
 */
export function MetricProvider({ children, theme, colorScheme = "auto", ...overrides }: MetricProviderProps) {
  // Read parent context so nested providers merge instead of replace
  const parent = useContext(MetricConfigContext);
  // --- Dark mode state ---
  // Detect initial scheme synchronously to avoid a light→dark flash.
  // Check: explicit prop > localStorage > html.dark class > system preference
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    if (colorScheme !== "auto") return colorScheme;
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("metricui-theme") as ColorScheme | null;
    if (stored) return stored;
    if (document.documentElement.classList.contains("dark")) return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (colorScheme !== "auto") {
      setScheme(colorScheme);
      return;
    }
    // Re-sync if system preference changes while mounted
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("metricui-theme")) {
        setScheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [colorScheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", scheme === "dark");
    if (colorScheme === "auto") {
      localStorage.setItem("metricui-theme", scheme);
    }
  }, [scheme, colorScheme]);

  const themeValue = useMemo<ThemeContextValue>(() => ({
    theme: scheme,
    isDark: scheme === "dark",
    toggle: () => setScheme((s) => (s === "light" ? "dark" : "light")),
  }), [scheme]);

  // Resolve theme preset
  const resolvedTheme = useMemo((): ThemePreset | null => {
    if (!theme) return null;
    if (typeof theme === "string") return THEME_PRESETS[theme] ?? null;
    return theme;
  }, [theme]);

  const value = useMemo(() => {
    const merged: MetricConfig = { ...parent };

    // Apply theme preset: sets colors if not explicitly overridden
    if (resolvedTheme && overrides.colors === undefined) {
      merged.colors = resolvedTheme.colors;
    }

    // Apply each override only if explicitly provided (not undefined)
    for (const key of Object.keys(overrides) as (keyof typeof overrides)[]) {
      if (overrides[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (merged as any)[key] = overrides[key];
      }
    }
    return merged;
  }, [parent, overrides, resolvedTheme]);

  // Set print-friendly document title during print
  useEffect(() => {
    if (!value.printMode) return;
    const printTitle = typeof value.printMode === "object" && value.printMode.title
      ? value.printMode.title
      : "Dashboard Report";
    const originalTitle = document.title;
    const onBeforePrint = () => { document.title = printTitle; };
    const onAfterPrint = () => { document.title = originalTitle; };
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [value.printMode]);

  // Apply accent color as CSS variable override via inline style
  const style = useMemo((): React.CSSProperties | undefined => {
    if (!resolvedTheme) return undefined;
    return {
      "--accent": resolvedTheme.accent,
      "--accent-dark": resolvedTheme.accentDark,
    } as React.CSSProperties;
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
    <MetricConfigContext.Provider value={value}>
      <div
        style={style}
        className={resolvedTheme ? "contents [.dark_&]:![--accent:var(--accent-dark)]" : "contents"}
        data-metricui=""
        data-variant={value.variant}
        data-dense={value.dense ? "true" : undefined}
        data-texture={value.texture === false ? "false" : undefined}
      >
        {value.printMode && <PrintHeaderLazy config={typeof value.printMode === "object" ? value.printMode : {}} />}
        {children}
        {value.printMode && <PrintFooterLazy config={typeof value.printMode === "object" ? value.printMode : {}} />}
      </div>
    </MetricConfigContext.Provider>
    </ThemeContext.Provider>
  );
}

// Lazy print components — avoids circular dependency with src/components/
function PrintHeaderLazy({ config }: { config: { title?: string; subtitle?: string; logo?: string; footer?: string } }) {
  return (
    <div className="mu-print-header">
      <div>
        {config.logo && <img src={config.logo} alt="" style={{ height: 32, marginBottom: 8 }} />}
        <div className="mu-print-header-title">{config.title ?? "Dashboard Report"}</div>
        {config.subtitle && <div style={{ fontSize: "10pt", color: "#6b7280", marginTop: 2 }}>{config.subtitle}</div>}
      </div>
      <div className="mu-print-header-meta">
        <div>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
      </div>
    </div>
  );
}

function PrintFooterLazy({ config }: { config: { title?: string; subtitle?: string; logo?: string; footer?: string } }) {
  const title = config.title ?? "Dashboard Report";
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="mu-print-footer">
      {config.footer ? config.footer.replace("{title}", title).replace("{date}", date) : `${title} · Printed ${date}`}
    </div>
  );
}
