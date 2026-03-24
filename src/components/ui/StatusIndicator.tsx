"use client";

import { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import { CardShell } from "@/components/ui/CardShell";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { Check, AlertTriangle, X, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatusRule {
  /** Minimum value for this rule (inclusive). Omit for the fallback/default rule. */
  min?: number;
  /** Maximum value for this rule (exclusive). Omit for no upper bound. */
  max?: number;
  /** Named color or CSS color string */
  color: string;
  /** Icon to display. Defaults to a colored dot. */
  icon?: React.ReactNode;
  /** Label shown next to the icon (e.g., "Healthy", "Critical") */
  label?: string;
  /** Pulse animation for attention states */
  pulse?: boolean;
}

export type StatusSize = "dot" | "sm" | "md" | "lg" | "card";

export interface StatusIndicatorProps {
  /** The value to evaluate against rules. Not displayed unless showValue is true. */
  value: number | null | undefined;
  /** Rules evaluated top-to-bottom. First match wins. Last rule with no min/max is the fallback. */
  rules: StatusRule[];
  /** Display mode. Default: "md" */
  size?: StatusSize;
  /** Show the underlying value. Default: false */
  showValue?: boolean;
  /** Title label (shown in "card" and "lg" sizes) */
  title?: string;
  /** Description popover */
  description?: string | React.ReactNode;
  /** Subtitle or secondary text */
  subtitle?: string;
  /** How long the indicator has been in the current state */
  since?: Date;
  /** History of recent values — shown as a trend arrow */
  trend?: number[];
  /** Tooltip content on hover. Defaults to the matched rule's label. */
  tooltip?: string;
  /** Click handler */
  onClick?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Additional class names */
  className?: string;
  /** Sub-element class overrides */
  classNames?: { root?: string; icon?: string; label?: string; value?: string };
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Named color map — matches our CSS variable system
// ---------------------------------------------------------------------------

const NAMED_COLORS: Record<string, { bg: string; text: string; dot: string; ring: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-[var(--mu-color-positive)]",
    dot: "bg-[var(--mu-color-positive)]",
    ring: "ring-[var(--mu-color-positive)]/20",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-[var(--mu-color-positive)]",
    dot: "bg-[var(--mu-color-positive)]",
    ring: "ring-[var(--mu-color-positive)]/20",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-[var(--mu-color-negative)]",
    dot: "bg-[var(--mu-color-negative)]",
    ring: "ring-[var(--mu-color-negative)]/20",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-[var(--mu-color-warning)]",
    dot: "bg-[var(--mu-color-warning)]",
    ring: "ring-[var(--mu-color-warning)]/20",
  },
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-[var(--mu-color-warning)]",
    dot: "bg-[var(--mu-color-warning)]",
    ring: "ring-[var(--mu-color-warning)]/20",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-[var(--mu-color-info)]",
    dot: "bg-[var(--mu-color-info)]",
    ring: "ring-[var(--mu-color-info)]/20",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-800/40",
    text: "text-[var(--muted)]",
    dot: "bg-[var(--muted)]",
    ring: "ring-[var(--muted)]/20",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    ring: "ring-purple-500/20",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500",
    ring: "ring-cyan-500/20",
  },
};

function isNamedColor(color: string): boolean {
  return color in NAMED_COLORS;
}

function resolveColor(color: string) {
  return NAMED_COLORS[color] ?? null;
}

// ---------------------------------------------------------------------------
// Rule matching
// ---------------------------------------------------------------------------

function matchRule(value: number | null | undefined, rules: StatusRule[]): StatusRule | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    // Return the last rule as fallback for null values
    return rules[rules.length - 1] ?? null;
  }
  for (const rule of rules) {
    const minOk = rule.min === undefined || value >= rule.min;
    const maxOk = rule.max === undefined || value < rule.max;
    if (minOk && maxOk) return rule;
  }
  // No match — use last rule as fallback
  return rules[rules.length - 1] ?? null;
}

// ---------------------------------------------------------------------------
// Time-in-state helper
// ---------------------------------------------------------------------------

function timeInState(since: Date): string {
  const seconds = Math.floor((Date.now() - since.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

// ---------------------------------------------------------------------------
// Trend arrow
// ---------------------------------------------------------------------------

function trendDirection(values: number[]): "up" | "down" | "flat" {
  if (values.length < 2) return "flat";
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (last > prev) return "up";
  if (last < prev) return "down";
  return "flat";
}

// ---------------------------------------------------------------------------
// Default icons per color
// ---------------------------------------------------------------------------

function defaultIcon(color: string, size: StatusSize): React.ReactNode {
  if (size === "dot") return null;
  const iconClass = size === "sm" ? "h-3 w-3" : size === "lg" || size === "card" ? "h-5 w-5" : "h-4 w-4";
  switch (color) {
    case "emerald":
    case "green":
      return <Check className={iconClass} />;
    case "red":
      return <X className={iconClass} />;
    case "amber":
    case "yellow":
      return <AlertTriangle className={iconClass} />;
    default:
      return <Minus className={iconClass} />;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  function StatusIndicator(
    {
      value,
      rules,
      size = "md",
      showValue = false,
      title,
      description,
      subtitle,
      since,
      trend,
      tooltip,
      onClick,
      loading,
      className,
      classNames,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const resolvedLoading = loading ?? config.loading;

    const matched = useMemo(() => matchRule(value, rules), [value, rules]);
    const named = matched ? resolveColor(matched.color) : null;
    const isCustomColor = matched && !named;

    const icon = matched?.icon ?? (matched ? defaultIcon(matched.color, size) : null);
    const label = matched?.label;
    const pulse = matched?.pulse ?? false;
    const trendDir = trend ? trendDirection(trend) : null;

    const tooltipText = tooltip ?? label ?? (matched ? `${matched.color}` : undefined);

    // ----- Dot mode (tiny inline) -----
    if (size === "dot") {
      if (resolvedLoading) {
        return <span className={cn("inline-block h-2.5 w-2.5 rounded-full animate-pulse bg-[var(--card-border)]", className)} />;
      }
      return (
        <span
          ref={ref}
          id={id}
          data-testid={dataTestId}
          title={tooltipText}
          className={cn(
            "inline-block h-2.5 w-2.5 rounded-full transition-colors",
            named?.dot,
            pulse && "animate-pulse",
            onClick && "cursor-pointer",
            className,
            classNames?.root,
          )}
          style={isCustomColor ? { backgroundColor: matched!.color } : undefined}
          onClick={onClick}
        />
      );
    }

    // ----- SM mode (dot + label, inline) -----
    if (size === "sm") {
      if (resolvedLoading) {
        return <span className={cn("inline-flex items-center gap-1.5 animate-pulse", className)}>
          <span className="h-2 w-2 rounded-full bg-[var(--card-border)]" />
          <span className="h-3 w-10 rounded bg-[var(--card-border)]" />
        </span>;
      }
      return (
        <span
          ref={ref}
          id={id}
          data-testid={dataTestId}
          title={tooltipText}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
            named?.text,
            onClick && "cursor-pointer",
            className,
            classNames?.root,
          )}
          style={isCustomColor ? { color: matched!.color } : undefined}
          onClick={onClick}
        >
          <span
            className={cn(
              "h-2 w-2 flex-shrink-0 rounded-full",
              named?.dot,
              pulse && "animate-pulse",
              classNames?.icon,
            )}
            style={isCustomColor ? { backgroundColor: matched!.color } : undefined}
          />
          {label && <span className={classNames?.label}>{label}</span>}
        </span>
      );
    }

    // ----- MD mode (icon + label, inline badge-like) -----
    if (size === "md") {
      if (resolvedLoading) {
        return <span className={cn("inline-flex items-center gap-2 animate-pulse", className)}>
          <span className="h-7 w-7 rounded-lg bg-[var(--card-border)]" />
          <span className="h-4 w-16 rounded bg-[var(--card-border)]" />
        </span>;
      }
      return (
        <span
          ref={ref}
          id={id}
          data-testid={dataTestId}
          title={tooltipText}
          className={cn(
            "inline-flex items-center gap-2 transition-colors",
            onClick && "cursor-pointer",
            className,
            classNames?.root,
          )}
          onClick={onClick}
        >
          <span
            className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ring-2",
              named?.bg,
              named?.text,
              named?.ring,
              pulse && "animate-pulse",
              classNames?.icon,
            )}
            style={isCustomColor ? {
              color: matched!.color,
              backgroundColor: `color-mix(in srgb, ${matched!.color} 12%, transparent)`,
              boxShadow: `0 0 0 2px color-mix(in srgb, ${matched!.color} 20%, transparent)`,
            } : undefined}
          >
            {icon}
          </span>
          <span className="flex flex-col">
            {label && (
              <span className={cn("text-sm font-medium text-[var(--foreground)]", classNames?.label)}>
                {label}
              </span>
            )}
            {showValue && value != null && (
              <span className={cn("text-xs text-[var(--muted)]", classNames?.value)}>
                {value}
              </span>
            )}
          </span>
        </span>
      );
    }

    // ----- LG mode (prominent, standalone) -----
    if (size === "lg") {
      if (resolvedLoading) {
        return (
          <div className={cn("flex items-center gap-3 animate-pulse", className)}>
            <span className="h-10 w-10 rounded-xl bg-[var(--card-border)]" />
            <div>
              <span className="block h-4 w-20 rounded bg-[var(--card-border)]" />
              <span className="mt-1 block h-3 w-28 rounded bg-[var(--card-border)]" />
            </div>
          </div>
        );
      }
      return (
        <div
          ref={ref}
          id={id}
          data-testid={dataTestId}
          title={tooltipText}
          className={cn(
            "flex items-center gap-3 transition-colors",
            onClick && "cursor-pointer",
            className,
            classNames?.root,
          )}
          onClick={onClick}
        >
          <span
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-2",
              named?.bg,
              named?.text,
              named?.ring,
              pulse && "animate-pulse",
              classNames?.icon,
            )}
            style={isCustomColor ? {
              color: matched!.color,
              backgroundColor: `color-mix(in srgb, ${matched!.color} 12%, transparent)`,
              boxShadow: `0 0 0 2px color-mix(in srgb, ${matched!.color} 20%, transparent)`,
            } : undefined}
          >
            {icon}
          </span>
          <div>
            {title && (
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                {title}
              </span>
            )}
            <div className="flex items-center gap-2">
              {label && (
                <span className={cn("text-sm font-semibold text-[var(--foreground)]", classNames?.label)}>
                  {label}
                </span>
              )}
              {trendDir && trendDir !== "flat" && (
                <span className={cn(
                  "text-[10px] font-medium",
                  trendDir === "up" ? "text-[var(--mu-color-positive)]" : "text-[var(--mu-color-negative)]",
                )}>
                  {trendDir === "up" ? "↑" : "↓"}
                </span>
              )}
              {since && (
                <span className="text-[10px] text-[var(--muted)] opacity-60">
                  {timeInState(since)}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-[var(--muted)] opacity-70">{subtitle}</p>
            )}
          </div>
        </div>
      );
    }

    // ----- Card mode (full card shell matching KpiCard) -----
    return (
      <CardShell
        ref={ref}
        id={id}
        data-testid={dataTestId}
        title={title}
        description={description}
        subtitle={subtitle}
        componentName="StatusIndicator"
        onClick={onClick}
        loading={resolvedLoading}
        skeletonType="kpi"
        className={className}
        classNames={{ root: classNames?.root }}
      >
        {/* Main status display */}
        <div className={cn("flex items-center gap-3", title ? "mt-3" : "")}>
          <span
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-2 transition-all",
              named?.bg,
              named?.text,
              named?.ring,
              pulse && "animate-pulse",
              classNames?.icon,
            )}
            style={isCustomColor ? {
              color: matched!.color,
              backgroundColor: `color-mix(in srgb, ${matched!.color} 12%, transparent)`,
              boxShadow: `0 0 0 2px color-mix(in srgb, ${matched!.color} 20%, transparent)`,
            } : undefined}
          >
            {icon}
          </span>
          <div className="min-w-0">
            {label && (
              <p className={cn(
                "font-[family-name:var(--font-mono)] text-lg font-semibold leading-tight text-[var(--foreground)]",
                classNames?.label,
              )}>
                {label}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              {showValue && value != null && (
                <span className={cn("text-xs text-[var(--muted)]", classNames?.value)}>
                  {value}
                </span>
              )}
              {trendDir && trendDir !== "flat" && (
                <span className={cn(
                  "text-xs font-semibold",
                  trendDir === "up" ? "text-[var(--mu-color-positive)]" : "text-[var(--mu-color-negative)]",
                )}>
                  {trendDir === "up" ? "↑ Rising" : "↓ Falling"}
                </span>
              )}
              {since && (
                <span className="text-[10px] text-[var(--muted)] opacity-60">
                  for {timeInState(since)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardShell>
    );
  },
);

// Grid hint for MetricGrid
(StatusIndicator as any).__gridHint = "kpi"; // eslint-disable-line @typescript-eslint/no-explicit-any

// Error boundary wrapper
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
const StatusIndicatorWithBoundary = withErrorBoundary(StatusIndicator, "StatusIndicator");
export { StatusIndicatorWithBoundary };
