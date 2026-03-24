"use client";

import { TooltipWrapper } from "./TooltipWrapper";

// ---------------------------------------------------------------------------
// Action hint resolver — shared across all chart components
// ---------------------------------------------------------------------------

/**
 * Resolves the tooltip action hint string based on the chart's interactive props.
 * Priority: drillDown > crossFilter. Returns undefined if no action or hints disabled.
 *
 * @param tooltipHint - Per-component override: `true` = auto, `string` = custom, `false`/`undefined` = respect global
 * @param globalHint - Global setting from MetricConfig.tooltipHint
 * @param hasDrillDown - Whether drillDown prop is set
 * @param hasCrossFilter - Whether crossFilter prop is active
 */
export function resolveActionHint(
  tooltipHint: boolean | string | undefined,
  globalHint: boolean,
  hasDrillDown: boolean,
  hasCrossFilter: boolean,
): string | undefined {
  // Explicit false = off
  if (tooltipHint === false) return undefined;
  // Custom string = use it directly
  if (typeof tooltipHint === "string") return tooltipHint;
  // No action = nothing to hint
  if (!hasDrillDown && !hasCrossFilter) return undefined;
  // Check global toggle (tooltipHint prop === true or undefined both respect global)
  if (tooltipHint !== true && !globalHint) return undefined;
  // Auto-resolve
  if (hasDrillDown) return "Click to drill down";
  return "Click to filter";
}

/**
 * Shared tooltip component for AreaChart, BarChart, and DonutChart.
 *
 * Renders a styled tooltip container with an optional header and a list of
 * color-dot + label + value items. Matches the AreaChart tooltip design
 * (the gold standard). Automatically nudges into viewport via TooltipWrapper.
 */

export interface ChartTooltipItem {
  color: string;
  label: string;
  value: string;
  /** Optional secondary line below the item (e.g. percentage) */
  secondary?: string;
}

export interface ChartTooltipProps {
  header?: string;
  items: ChartTooltipItem[];
  /** Optional comparison / previous-period items shown in a separate section */
  comparisonItems?: ChartTooltipItem[];
  /** Optional label for the comparison section. Default: "Previous period" */
  comparisonLabel?: string;
  /** Subtle hint shown at the bottom, e.g. "Click to drill down" */
  actionHint?: string;
  /** Additional class name for the tooltip container */
  className?: string;
}

export function ChartTooltip({ header, items, comparisonItems, comparisonLabel = "Previous period", actionHint, className }: ChartTooltipProps) {
  return (
    <TooltipWrapper>
    <div style={{ padding: "8px", margin: "-8px" }}>
    <div
      className={className}
      style={{
        background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
        backdropFilter: "blur(12px) saturate(1.4)",
        WebkitBackdropFilter: "blur(12px) saturate(1.4)",
        border: "1px solid var(--card-border)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
        minWidth: "140px",
      }}
    >
      {header && (
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--muted)",
            marginBottom: "6px",
          }}
        >
          {header}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "2px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--foreground)",
                  opacity: 0.7,
                }}
              >
                {item.label}
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--foreground)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {item.value}
            </span>
          </div>
          {item.secondary && (
            <div
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                textAlign: "right",
                marginTop: "2px",
              }}
            >
              {item.secondary}
            </div>
          )}
        </div>
      ))}

      {/* Comparison / previous period section */}
      {comparisonItems && comparisonItems.length > 0 && (
        <>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--muted)",
              marginTop: "6px",
              paddingTop: "5px",
              borderTop: "1px solid var(--card-border)",
              opacity: 0.7,
            }}
          >
            {comparisonLabel}
          </div>
          {comparisonItems.map((item, i) => (
            <div key={`cmp-${i}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "2px 0",
                  opacity: 0.55,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "2px",
                      borderRadius: "1px",
                      backgroundColor: item.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--foreground)",
                      opacity: 0.7,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
      {actionHint && (
        <div
          style={{
            fontSize: "9px",
            color: "var(--muted)",
            marginTop: "6px",
            paddingTop: "5px",
            borderTop: "1px solid var(--card-border)",
            opacity: 0.6,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {actionHint}
        </div>
      )}
    </div>
    </div>
    </TooltipWrapper>
  );
}
