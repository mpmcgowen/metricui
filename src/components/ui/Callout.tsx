"use client";

import { forwardRef, useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useComponentConfig } from "@/lib/useComponentConfig";
import { formatValue, type FormatOption } from "@/lib/format";
import { CARD_CLASSES } from "@/lib/styles";
import type { DataComponentProps, DrillDownConfig } from "@/lib/types";
import { useComponentInteraction } from "@/lib/useComponentInteraction";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  ChevronDown,
  ArrowUpRight as DrillIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CalloutVariant = "info" | "warning" | "success" | "error";

export interface CalloutRule {
  /** Minimum value for this rule (inclusive). Omit for fallback. */
  min?: number;
  /** Maximum value for this rule (exclusive). Omit for no upper bound. */
  max?: number;
  /** Variant to apply */
  variant: CalloutVariant;
  /** Title text. Supports {value} placeholder. */
  title?: string;
  /** Message text. Supports {value} placeholder. */
  message?: string;
  /** Icon override */
  icon?: React.ReactNode;
}

export interface CalloutMetric {
  /** Numeric value to display */
  value: number;
  /** Format option */
  format?: FormatOption;
  /** Label next to the value */
  label?: string;
}

export interface CalloutAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
}

export interface CalloutProps extends DataComponentProps {
  /** Visual variant. Default: "info". Ignored when `rules` is used. */
  variant?: CalloutVariant;
  /** Title text */
  title?: string;
  /** Body content */
  children?: React.ReactNode;
  /** Icon override. Default: auto-picked per variant. Set to `null` to hide. */
  icon?: React.ReactNode | null;

  // --- Data-driven mode ---
  /** Value to evaluate against rules */
  value?: number | null;
  /** Rules evaluated top-to-bottom. First match wins. */
  rules?: CalloutRule[];

  // --- Metric display ---
  /** Embedded formatted metric value */
  metric?: CalloutMetric;

  // --- Interactions ---
  /** Show dismiss button. Default: false */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss after N milliseconds. 0 = never. */
  autoDismiss?: number;
  /** Action button */
  action?: CalloutAction;

  // --- Collapsible detail ---
  /** Collapsible detail content — hidden by default, toggle to show */
  detail?: React.ReactNode;
  /** Whether detail starts expanded. Default: false */
  detailOpen?: boolean;

  // --- Drill-down ---
  /** Drill-down. `true` = auto, function = custom content, or legacy `{ onClick }`. */
  drillDown?: true | ((event: { title: string; value: string | number }) => React.ReactNode) | DrillDownConfig;
  /** Drill-down panel mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";

  // --- Standard MetricUI props ---
  /** Sub-element class overrides */
  classNames?: {
    root?: string;
    icon?: string;
    title?: string;
    body?: string;
    metric?: string;
    action?: string;
  };
}

// ---------------------------------------------------------------------------
// Variant styles
// ---------------------------------------------------------------------------

const VARIANT_STYLES: Record<
  CalloutVariant,
  {
    bg: string;
    border: string;
    icon: string;
    title: string;
    text: string;
    actionBg: string;
    actionText: string;
  }
> = {
  info: {
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    border: "border-[var(--mu-color-info)]/20",
    icon: "text-[var(--mu-color-info)]",
    title: "text-blue-900 dark:text-blue-200",
    text: "text-blue-800 dark:text-blue-300",
    actionBg: "bg-[var(--mu-color-info)]/10 hover:bg-[var(--mu-color-info)]/20",
    actionText: "text-[var(--mu-color-info)]",
  },
  warning: {
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    border: "border-[var(--mu-color-warning)]/20",
    icon: "text-[var(--mu-color-warning)]",
    title: "text-amber-900 dark:text-amber-200",
    text: "text-amber-800 dark:text-amber-300",
    actionBg: "bg-[var(--mu-color-warning)]/10 hover:bg-[var(--mu-color-warning)]/20",
    actionText: "text-[var(--mu-color-warning)]",
  },
  success: {
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    border: "border-[var(--mu-color-positive)]/20",
    icon: "text-[var(--mu-color-positive)]",
    title: "text-emerald-900 dark:text-emerald-200",
    text: "text-emerald-800 dark:text-emerald-300",
    actionBg: "bg-[var(--mu-color-positive)]/10 hover:bg-[var(--mu-color-positive)]/20",
    actionText: "text-[var(--mu-color-positive)]",
  },
  error: {
    bg: "bg-red-50/60 dark:bg-red-950/20",
    border: "border-[var(--mu-color-negative)]/20",
    icon: "text-[var(--mu-color-negative)]",
    title: "text-red-900 dark:text-red-200",
    text: "text-red-800 dark:text-red-300",
    actionBg: "bg-[var(--mu-color-negative)]/10 hover:bg-[var(--mu-color-negative)]/20",
    actionText: "text-[var(--mu-color-negative)]",
  },
};

const DEFAULT_ICONS: Record<CalloutVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
};

const DENSE_ICONS: Record<CalloutVariant, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
};

// ---------------------------------------------------------------------------
// Rule matching
// ---------------------------------------------------------------------------

function matchRule(
  value: number | null | undefined,
  rules: CalloutRule[]
): CalloutRule | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return rules[rules.length - 1] ?? null;
  }
  for (const rule of rules) {
    const minOk = rule.min === undefined || value >= rule.min;
    const maxOk = rule.max === undefined || value < rule.max;
    if (minOk && maxOk) return rule;
  }
  return rules[rules.length - 1] ?? null;
}

function interpolate(template: string | undefined, value: number | null | undefined): string | undefined {
  if (!template) return undefined;
  if (value === null || value === undefined) return template;
  return template.replace(/\{value\}/g, String(value));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  function Callout(
    {
      variant: variantProp = "info",
      title: titleProp,
      children,
      icon: iconProp,
      value,
      rules,
      metric,
      dismissible = false,
      onDismiss,
      autoDismiss = 0,
      action,
      detail,
      detailOpen: detailOpenProp = false,
      drillDown,
      drillDownMode,
      dense: denseProp,
      className,
      classNames,
      id,
      "data-testid": dataTestId,
      aiContext: _aiContext,
    },
    ref
  ) {
    const ctx = useComponentConfig({ dense: denseProp });
    const resolvedDense = ctx.resolvedDense;

    const interaction = useComponentInteraction({
      drillDown,
      drillDownMode,
      crossFilter: undefined,
      defaultField: titleProp ?? "callout",
      tooltipHint: undefined,
      data: [],
    });

    const [dismissed, setDismissed] = useState(false);
    const [detailExpanded, setDetailExpanded] = useState(detailOpenProp);
    const [fading, setFading] = useState(false);

    // --- Rule matching ---
    const matched = useMemo(
      () => (rules ? matchRule(value, rules) : null),
      [value, rules]
    );

    const resolvedVariant = matched?.variant ?? variantProp;
    const resolvedTitle = matched
      ? interpolate(matched.title, value) ?? titleProp
      : titleProp;
    const resolvedMessage = matched
      ? interpolate(matched.message, value)
      : undefined;
    const resolvedIcon =
      iconProp !== undefined
        ? iconProp
        : matched?.icon ?? (resolvedDense ? DENSE_ICONS[resolvedVariant] : DEFAULT_ICONS[resolvedVariant]);

    const styles = VARIANT_STYLES[resolvedVariant];

    // --- Formatted metric ---
    const formattedMetric = useMemo(() => {
      if (!metric) return null;
      return formatValue(metric.value, metric.format, ctx.localeDefaults);
    }, [metric, ctx.localeDefaults]);

    // --- Dismiss handler ---
    const handleDismiss = useCallback(() => {
      setFading(true);
      setTimeout(() => {
        setDismissed(true);
        onDismiss?.();
      }, 200);
    }, [onDismiss]);

    // --- Auto-dismiss ---
    useEffect(() => {
      if (autoDismiss <= 0 || dismissed) return;
      const timer = setTimeout(handleDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }, [autoDismiss, dismissed, handleDismiss]);

    // --- Hide if dismissed ---
    if (dismissed) return null;

    // --- Determine if there's body content ---
    const hasBody = !!(children || resolvedMessage);
    const hasMetric = !!(metric && formattedMetric);

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        data-component="Callout"
        data-variant={resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        role="alert"
        onClick={interaction.isInteractive ? () => interaction.handleClick({ title: titleProp ?? "Callout", value: value ?? 0 }) : undefined}
        className={cn(
          "relative border transition-all duration-200",
          CARD_CLASSES,
          styles.bg,
          styles.border,
          resolvedDense ? "px-3 py-2.5" : "px-4 py-3.5",
          fading && "opacity-0 scale-[0.98]",
          interaction.isInteractive && "group cursor-pointer",
          className,
          classNames?.root
        )}
      >
        <div className="flex gap-3">
          {/* Icon */}
          {resolvedIcon !== null && (
            <div
              className={cn(
                "flex-shrink-0 mt-0.5",
                styles.icon,
                classNames?.icon
              )}
            >
              {resolvedIcon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            {resolvedTitle && (
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "font-semibold leading-snug",
                    resolvedDense ? "text-sm" : "text-sm",
                    styles.title,
                    classNames?.title
                  )}
                >
                  {resolvedTitle}
                </p>
              </div>
            )}

            {/* Metric */}
            {hasMetric && (
              <div
                className={cn(
                  "flex items-baseline gap-2",
                  resolvedTitle ? "mt-1.5" : "",
                  classNames?.metric
                )}
              >
                <span
                  className={cn(
                    "font-[family-name:var(--font-mono)] font-bold",
                    resolvedDense ? "text-xl" : "text-2xl",
                    styles.title
                  )}
                >
                  {formattedMetric}
                </span>
                {metric?.label && (
                  <span className={cn("text-xs font-medium", styles.text, "opacity-70")}>
                    {metric.label}
                  </span>
                )}
              </div>
            )}

            {/* Body */}
            {hasBody && (
              <div
                className={cn(
                  "leading-relaxed",
                  resolvedDense ? "text-xs" : "text-sm",
                  resolvedTitle || hasMetric ? "mt-1" : "",
                  styles.text,
                  classNames?.body
                )}
              >
                {resolvedMessage ?? children}
              </div>
            )}

            {/* Collapsible detail */}
            {detail && (
              <div className={cn("mt-2", resolvedDense ? "text-xs" : "text-sm")}>
                <button
                  onClick={() => setDetailExpanded(!detailExpanded)}
                  className={cn(
                    "inline-flex items-center gap-1 font-medium transition-colors",
                    styles.text,
                    "opacity-70 hover:opacity-100"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      detailExpanded ? "rotate-0" : "-rotate-90"
                    )}
                  />
                  {detailExpanded ? "Hide details" : "Show details"}
                </button>
                {detailExpanded && (
                  <div
                    className={cn(
                      "mt-2 leading-relaxed",
                      styles.text,
                      "opacity-80"
                    )}
                  >
                    {detail}
                  </div>
                )}
              </div>
            )}

            {/* Action */}
            {action && (
              <div className={cn("mt-3", classNames?.action)}>
                <button
                  onClick={action.onClick}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors",
                    resolvedDense ? "text-xs" : "text-sm",
                    styles.actionBg,
                    styles.actionText
                  )}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                "flex-shrink-0 rounded-md p-1 transition-colors",
                styles.text,
                "opacity-40 hover:opacity-70"
              )}
              aria-label="Dismiss"
            >
              <X className={resolvedDense ? "h-3.5 w-3.5" : "h-4 w-4"} />
            </button>
          )}
        </div>
        {drillDown && (
          <span className="absolute bottom-2 right-2 text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-60" aria-hidden>
            <DrillIcon className="h-3 w-3" />
          </span>
        )}
      </div>
    );
  }
);

// Grid hint — callouts are full-width in MetricGrid
(Callout as any).__gridHint = "full"; // eslint-disable-line @typescript-eslint/no-explicit-any

// Error boundary wrapper
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const CalloutWithBoundary = withErrorBoundary(Callout, "Callout");
