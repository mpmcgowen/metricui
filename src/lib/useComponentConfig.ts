"use client";

import { useMemo } from "react";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import type { LocaleDefaults, MetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import type { CardVariant } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComponentConfigOptions {
  /** Component's animate prop */
  animate?: boolean;
  /** Component's variant prop */
  variant?: CardVariant;
  /** Component's height prop */
  height?: number;
  /** Component's dense prop */
  dense?: boolean;
  /** Minimum height override (e.g., Choropleth uses 400) */
  minHeight?: number;
}

export interface ComponentConfigResult {
  /** Current theme */
  theme: "light" | "dark";
  /** Whether dark mode is active */
  isDark: boolean;
  /** Locale defaults for formatting */
  localeDefaults: LocaleDefaults;
  /** Full MetricProvider config */
  config: MetricConfig;
  /** Resolved animate value (prop ?? config) */
  resolvedAnimate: boolean;
  /** Resolved variant value (prop ?? config) */
  resolvedVariant: CardVariant;
  /** Resolved dense value (prop ?? config) */
  resolvedDense: boolean;
  /** Dense-aware values (chartHeight, padding, etc.) */
  denseValues: ReturnType<typeof useDenseValues>;
  /** Resolved height (prop ?? denseValues.chartHeight ?? minHeight) */
  resolvedHeight: number;
  /** Container ref — attach to the sizing wrapper div */
  containerRef: ReturnType<typeof useContainerSize>["ref"];
  /** Measured container width in px */
  containerWidth: number;
  /** Nivo theme object, responsive to container width */
  nivoTheme: ReturnType<typeof useChartTheme>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shared config resolution for all visual components.
 *
 * Replaces the 10 hook calls + 4 resolved values that were
 * copy-pasted across every chart, card, and table component.
 *
 * @example
 * ```tsx
 * const ctx = useComponentConfig({ animate, variant, height });
 *
 * // Use ctx.isDark, ctx.localeDefaults, ctx.resolvedHeight, etc.
 * // Attach ctx.containerRef to a wrapper div for responsive sizing.
 * ```
 */
export function useComponentConfig(opts: ComponentConfigOptions = {}): ComponentConfigResult {
  const { animate: animateProp, variant, height, dense, minHeight } = opts;

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();

  const resolvedAnimate = animateProp ?? config.animate ?? true;
  const resolvedVariant = (variant ?? config.variant ?? "default") as CardVariant;
  const resolvedDense = dense ?? config.dense ?? false;

  const denseValues = useDenseValues();
  const baseHeight = height ?? denseValues.chartHeight;
  const resolvedHeight = minHeight ? Math.max(baseHeight, minHeight) : baseHeight;

  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  return {
    theme,
    isDark,
    localeDefaults,
    config,
    resolvedAnimate,
    resolvedVariant,
    resolvedDense,
    denseValues,
    resolvedHeight,
    containerRef,
    containerWidth,
    nivoTheme,
  };
}
