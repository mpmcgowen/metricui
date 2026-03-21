/**
 * MetricUI Dynamic Template Engine
 *
 * Resolves dynamic strings, template strings, and render functions
 * against a computed context object.
 */

import type { ComparisonResult } from "./format";

// ---------------------------------------------------------------------------
// Context — everything a template/function can reference
// ---------------------------------------------------------------------------

export interface MetricContext {
  /** Raw numeric value */
  value: number;
  /** All formatted strings */
  formatted: {
    value: string;
    rawValue: string;
  };
  /** Comparison result (if comparison was provided) */
  comparison: {
    trend: "positive" | "negative" | "neutral";
    percentChange: number;
    absoluteChange: number;
    label: string;
  } | null;
  /** Goal progress (if goal was provided) */
  goal: {
    target: number;
    progress: number;
    remaining: number;
    isComplete: boolean;
    label: string;
  } | null;
  /** Condition result */
  conditionColor: string | null;
}

// ---------------------------------------------------------------------------
// Dynamic value type — string, template, or function
// ---------------------------------------------------------------------------

/** A value that can be static, a template string, or a render function */
export type DynamicString = string | ((context: MetricContext) => string | undefined);
export type DynamicReactNode =
  | string
  | React.ReactNode
  | ((context: MetricContext) => React.ReactNode | undefined);

// ---------------------------------------------------------------------------
// Template resolution
// ---------------------------------------------------------------------------

const TEMPLATE_RE = /\{\{(\w+(?:\.\w+)*)\}\}/g;

/**
 * Resolves a dynamic value against a context.
 *
 * - Static string: returned as-is (unless it contains {{...}} templates)
 * - Template string: `"Revenue is {{formatted.value}}"` → `"Revenue is $78.4K"`
 * - Function: called with the full context
 */
export function resolveString(
  input: DynamicString | undefined,
  context: MetricContext
): string | undefined {
  if (input === undefined) return undefined;
  if (typeof input === "function") return input(context);

  // Check for template patterns
  if (TEMPLATE_RE.test(input)) {
    TEMPLATE_RE.lastIndex = 0; // reset regex state
    return input.replace(TEMPLATE_RE, (_match, path: string) => {
      return getNestedValue(context, path) ?? "";
    });
  }

  return input;
}

/**
 * Resolves a dynamic ReactNode (string, element, or function).
 */
export function resolveReactNode(
  input: DynamicReactNode | undefined,
  context: MetricContext
): React.ReactNode | undefined {
  if (input === undefined) return undefined;
  if (typeof input === "function") return input(context);

  // Only do template interpolation on strings
  if (typeof input === "string" && TEMPLATE_RE.test(input)) {
    TEMPLATE_RE.lastIndex = 0;
    return input.replace(TEMPLATE_RE, (_match, path: string) => {
      return getNestedValue(context, path) ?? "";
    });
  }

  return input;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: object, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return "";
    if (typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[key];
  }

  if (current === null || current === undefined) return "";
  if (typeof current === "number") return String(current);
  if (typeof current === "boolean") return String(current);
  return String(current);
}

// ---------------------------------------------------------------------------
// Build context from component state
// ---------------------------------------------------------------------------

export function buildMetricContext(params: {
  value: number;
  formattedValue: string;
  rawValue: string;
  comparison: ComparisonResult | null;
  goalProgress: { progress: number; remaining: number; isComplete: boolean } | null;
  goalConfig: { value: number; label?: string } | null;
  conditionColor: string | null;
}): MetricContext {
  return {
    value: params.value,
    formatted: {
      value: params.formattedValue,
      rawValue: params.rawValue,
    },
    comparison: params.comparison
      ? {
          trend: params.comparison.trend,
          percentChange: params.comparison.percentChange,
          absoluteChange: params.comparison.absoluteChange,
          label: params.comparison.label,
        }
      : null,
    goal: params.goalProgress && params.goalConfig
      ? {
          target: params.goalConfig.value,
          progress: params.goalProgress.progress,
          remaining: params.goalProgress.remaining,
          isComplete: params.goalProgress.isComplete,
          label: params.goalConfig.label ?? "Target",
        }
      : null,
    conditionColor: params.conditionColor,
  };
}
