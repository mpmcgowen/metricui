"use client";

import { useMemo } from "react";
import { useTheme } from "@/lib/MetricProvider";

/**
 * Shared nivo theme hook for all chart components.
 *
 * Accepts optional containerWidth to scale axis/legend font sizes
 * responsively — smaller containers get smaller text to prevent overlap.
 */
export function useChartTheme(containerWidth?: number) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return useMemo(() => {
    // Scale font sizes based on container width
    const isNarrow = containerWidth !== undefined && containerWidth < 300;
    const isVeryNarrow = containerWidth !== undefined && containerWidth < 200;

    const tickFontSize = isVeryNarrow ? 8 : isNarrow ? 9 : 10;
    const legendFontSize = isVeryNarrow ? 9 : isNarrow ? 10 : 11;
    const textFontSize = isVeryNarrow ? 9 : isNarrow ? 10 : 11;

    return {
      background: "transparent",
      text: {
        fontSize: textFontSize,
        fill: "var(--muted)",
        fontFamily: "var(--font-mono)",
      },
      axis: {
        domain: { line: { stroke: "transparent" } },
        ticks: {
          line: { stroke: "transparent" },
          text: {
            fill: "var(--muted)",
            fontSize: tickFontSize,
            fontFamily: "var(--font-mono)",
          },
        },
        legend: {
          text: {
            fill: "var(--muted)",
            fontSize: legendFontSize,
            fontWeight: 500,
          },
        },
      },
      grid: {
        line: {
          stroke: "var(--card-border)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      },
      crosshair: {
        line: {
          stroke: "var(--muted)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      },
    };
  }, [isDark, containerWidth]);
}
