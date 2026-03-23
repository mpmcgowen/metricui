/**
 * MetricUI Global Formatting Engine
 *
 * Smart number formatting with shorthand strings or full config objects.
 * Every component in MetricUI uses this under the hood.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormatStyle = "number" | "currency" | "percent" | "duration" | "custom";

/**
 * Compact mode:
 *   - `true` / `"auto"` — automatically picks K / M / B / T based on magnitude
 *   - `"thousands"` — always divide by 1,000 and append K
 *   - `"millions"` — always divide by 1,000,000 and append M
 *   - `"billions"` — always divide by 1,000,000,000 and append B
 *   - `"trillions"` — always divide by 1,000,000,000,000 and append T
 *   - `false` — no compacting, show full number
 */
export type CompactMode = boolean | "auto" | "thousands" | "millions" | "billions" | "trillions";

/**
 * Duration input unit — what does the raw number represent?
 * Default: "seconds"
 */
export type DurationInput = "milliseconds" | "seconds" | "minutes" | "hours";

/**
 * Duration output style:
 *   - `"compact"` — "5m 30s" (default)
 *   - `"long"` — "5 minutes 30 seconds"
 *   - `"clock"` — "5:30" or "1:23:45"
 *   - `"narrow"` — "5.5m" (single unit, decimal)
 */
export type DurationStyle = "compact" | "long" | "clock" | "narrow";

/**
 * Smallest unit to display in duration output.
 * e.g. "minutes" means "2h 30m" (no seconds), "hours" means "3d 4h" (no minutes).
 * Default: "seconds"
 */
export type DurationPrecision = "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";

/**
 * Percent input mode:
 *   - `"whole"` (default) — value is already 12 meaning 12%
 *   - `"decimal"` — value is 0.12 meaning 12%, we multiply by 100
 */
export type PercentInput = "whole" | "decimal";

export interface FormatConfig {
  style: FormatStyle;
  currency?: string;
  compact?: CompactMode;
  precision?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  /** What the raw percent value represents. Default: "whole" (12 = 12%) */
  percentInput?: PercentInput;
  /** What unit the input value is in (for duration). Default: "seconds" */
  durationInput?: DurationInput;
  /** How to display the duration. Default: "compact" */
  durationStyle?: DurationStyle;
  /** Smallest unit to show. "minutes" → "2h 30m", "hours" → "3d 4h". Default: "seconds" */
  durationPrecision?: DurationPrecision;
}

/**
 * How to format a value. Pass a string shorthand or a full config object.
 *
 * **String shorthands:**
 * - `"number"` — 1,234 (locale-aware thousands separator)
 * - `"currency"` — $1.2K (uses provider's currency, auto-compacts)
 * - `"percent"` — 4.2% (value 4.2 → "4.2%")
 * - `"duration"` — 1h 2m 5s (from seconds by default)
 * - `"compact"` — 2.4M (auto-picks K/M/B/T)
 * - `"custom"` — use with `{ style: "custom", prefix, suffix }`
 *
 * **Config object:** `{ style: "currency", compact: "millions", precision: 2 }`
 *
 * @example
 * format="currency"
 * format="percent"
 * format="compact"
 * format={{ style: "currency", compact: "millions", precision: 1 }}
 * format={{ style: "custom", prefix: "$", suffix: "/mo" }}
 */
export type FormatOption = FormatStyle | "compact" | FormatConfig;

/**
 * Build a FormatConfig with less boilerplate.
 *
 * @example
 * format={fmt("currency", { precision: 2 })}
 * format={fmt("compact")}
 * format={fmt("percent", { percentInput: "decimal" })}
 */
export function fmt(style: FormatStyle | "compact", overrides?: Partial<Omit<FormatConfig, "style">>): FormatConfig {
  return { ...resolveFormat(style), ...overrides };
}

// ---------------------------------------------------------------------------
// Resolve shorthand → full config
// ---------------------------------------------------------------------------

const defaults: Record<FormatStyle, FormatConfig> = {
  number: { style: "number", compact: true, locale: "en-US" },
  currency: { style: "currency", currency: "USD", compact: true, locale: "en-US" },
  percent: { style: "percent", precision: 0, locale: "en-US" },
  duration: { style: "duration", locale: "en-US" },
  custom: { style: "custom", locale: "en-US" },
};

export interface LocaleDefaults {
  locale?: string;
  currency?: string;
}

export function resolveFormat(fmt?: FormatOption, localeDefaults?: LocaleDefaults): FormatConfig {
  if (!fmt) return { ...defaults.number, ...localeDefaults };
  if (typeof fmt === "string") {
    // Handle "compact" shorthand → number with compact: true
    if (fmt === "compact") return { ...defaults.number, compact: true, ...localeDefaults };
    return { ...defaults[fmt], ...localeDefaults };
  }
  // User-provided fields in fmt win over provider defaults
  return { ...defaults[fmt.style], ...localeDefaults, ...fmt };
}

// ---------------------------------------------------------------------------
// Core formatter
// ---------------------------------------------------------------------------

export function formatValue(value: number, fmt?: FormatOption, localeDefaults?: LocaleDefaults): string {
  const config = resolveFormat(fmt, localeDefaults);

  if (config.style === "duration") {
    return formatDuration(value, config);
  }

  if (config.style === "percent") {
    const p = config.precision ?? 0;
    const displayVal = config.percentInput === "decimal" ? value * 100 : value;
    const formatted = displayVal.toFixed(p);
    return `${config.prefix ?? ""}${formatted}%${config.suffix ?? ""}`;
  }

  const compactMode: CompactMode = config.compact === true ? "auto" : (config.compact ?? "auto");
  const shouldCompact = compactMode !== false;

  if (config.style === "currency") {
    const locale = config.locale ?? "en-US";
    const currency = config.currency ?? "USD";

    if (shouldCompact) {
      const { scaled, symbol } = compactNumber(value, compactMode as CompactMode);
      const p = config.precision ?? 1;
      const base = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: symbol ? p : 0,
        maximumFractionDigits: symbol ? p : (config.precision ?? 0),
      }).format(scaled);
      return `${config.prefix ?? ""}${base}${symbol}${config.suffix ?? ""}`;
    }

    const base = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: config.precision ?? 0,
      maximumFractionDigits: config.precision ?? 2,
    }).format(value);
    return `${config.prefix ?? ""}${base}${config.suffix ?? ""}`;
  }

  // number (default)
  if (shouldCompact) {
    const { scaled, symbol } = compactNumber(value, compactMode as CompactMode);
    const p = config.precision ?? 1;
    const precision = symbol ? p : (config.precision ?? 0);
    const base = new Intl.NumberFormat(config.locale ?? "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    }).format(scaled);
    return `${config.prefix ?? ""}${base}${symbol}${config.suffix ?? ""}`;
  }

  const base = new Intl.NumberFormat(config.locale ?? "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: config.precision ?? 2,
  }).format(value);
  return `${config.prefix ?? ""}${base}${config.suffix ?? ""}`;
}

/**
 * Format the raw (uncompacted) value — used in tooltips on hover.
 */
export function formatValueRaw(value: number, fmt?: FormatOption, localeDefaults?: LocaleDefaults): string {
  const config = resolveFormat(fmt, localeDefaults);

  if (config.style === "duration") return formatDuration(value, config);

  if (config.style === "percent") {
    const displayVal = config.percentInput === "decimal" ? value * 100 : value;
    return `${displayVal.toFixed(config.precision ?? 2)}%`;
  }

  if (config.style === "currency") {
    return new Intl.NumberFormat(config.locale ?? "en-US", {
      style: "currency",
      currency: config.currency ?? "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat(config.locale ?? "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Compact numbers: 1.2B, 345K, etc.
// ---------------------------------------------------------------------------

interface CompactResult {
  scaled: number;
  symbol: string;
}

function compactNumber(value: number, mode: CompactMode = "auto"): CompactResult {
  // Hardcoded scale
  if (mode === "trillions") return { scaled: value / 1_000_000_000_000, symbol: "T" };
  if (mode === "billions") return { scaled: value / 1_000_000_000, symbol: "B" };
  if (mode === "millions") return { scaled: value / 1_000_000, symbol: "M" };
  if (mode === "thousands") return { scaled: value / 1_000, symbol: "K" };

  // Auto: pick scale based on magnitude
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return { scaled: value / 1_000_000_000_000, symbol: "T" };
  if (abs >= 1_000_000_000) return { scaled: value / 1_000_000_000, symbol: "B" };
  if (abs >= 1_000_000) return { scaled: value / 1_000_000, symbol: "M" };
  if (abs >= 1_000) return { scaled: value / 1_000, symbol: "K" };
  return { scaled: value, symbol: "" };
}

// ---------------------------------------------------------------------------
// Duration formatting
// ---------------------------------------------------------------------------

const MONTH_SECONDS = 2_592_000; // 30 days
const WEEK_SECONDS = 604_800;
const DAY_SECONDS = 86_400;
const HOUR_SECONDS = 3_600;
const MINUTE_SECONDS = 60;

/** Normalize any input unit to seconds */
function toSeconds(value: number, input: DurationInput = "seconds"): number {
  switch (input) {
    case "milliseconds": return value / 1_000;
    case "minutes": return value * 60;
    case "hours": return value * 3_600;
    default: return value;
  }
}

/** Order of units from largest to smallest */
const unitOrder: DurationPrecision[] = ["months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];

interface DurationParts {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
}

function decompose(totalSeconds: number, precision: DurationPrecision = "seconds"): DurationParts {
  const abs = Math.abs(totalSeconds);
  const cutoff = unitOrder.indexOf(precision);

  // Round the last unit, floor everything above it
  const rnd = (val: number, isLast: boolean) => isLast ? Math.round(val) : Math.floor(val);

  let remainder = abs;
  const months = cutoff >= 0 ? rnd(remainder / MONTH_SECONDS, cutoff === 0) : 0;
  remainder -= Math.floor(remainder / MONTH_SECONDS) * MONTH_SECONDS;
  const weeks = cutoff >= 1 ? rnd(remainder / WEEK_SECONDS, cutoff === 1) : 0;
  remainder -= Math.floor(remainder / WEEK_SECONDS) * WEEK_SECONDS;
  const days = cutoff >= 2 ? rnd(remainder / DAY_SECONDS, cutoff === 2) : 0;
  remainder -= Math.floor(remainder / DAY_SECONDS) * DAY_SECONDS;
  const hours = cutoff >= 3 ? rnd(remainder / HOUR_SECONDS, cutoff === 3) : 0;
  remainder -= Math.floor(remainder / HOUR_SECONDS) * HOUR_SECONDS;
  const minutes = cutoff >= 4 ? rnd(remainder / MINUTE_SECONDS, cutoff === 4) : 0;
  remainder -= Math.floor(remainder / MINUTE_SECONDS) * MINUTE_SECONDS;
  const seconds = cutoff >= 5 ? rnd(remainder, cutoff === 5) : 0;
  const ms = cutoff >= 6 ? Math.round((remainder - Math.floor(remainder)) * 1_000) : 0;

  return { months, weeks, days, hours, minutes, seconds, ms };
}

function formatDuration(value: number, config: FormatConfig): string {
  const totalSeconds = toSeconds(value, config.durationInput);
  const style = config.durationStyle ?? "compact";
  const precision = config.durationPrecision ?? "seconds";
  const prefix = config.prefix ?? "";
  const suffix = config.suffix ?? "";
  const sign = totalSeconds < 0 ? "-" : "";

  // --- Narrow: single decimal unit (e.g. "5.5m", "2.3h") ---
  if (style === "narrow") {
    const abs = Math.abs(totalSeconds);
    const p = config.precision ?? 1;
    let result: string;
    if (abs >= MONTH_SECONDS && unitOrder.indexOf(precision) <= 0)
      result = `${(abs / MONTH_SECONDS).toFixed(p)}mo`;
    else if (abs >= WEEK_SECONDS && unitOrder.indexOf(precision) <= 1)
      result = `${(abs / WEEK_SECONDS).toFixed(p)}w`;
    else if (abs >= DAY_SECONDS && unitOrder.indexOf(precision) <= 2)
      result = `${(abs / DAY_SECONDS).toFixed(p)}d`;
    else if (abs >= HOUR_SECONDS && unitOrder.indexOf(precision) <= 3)
      result = `${(abs / HOUR_SECONDS).toFixed(p)}h`;
    else if (abs >= MINUTE_SECONDS && unitOrder.indexOf(precision) <= 4)
      result = `${(abs / MINUTE_SECONDS).toFixed(p)}m`;
    else if (abs >= 1 && unitOrder.indexOf(precision) <= 5)
      result = `${abs.toFixed(p)}s`;
    else result = `${Math.round(abs * 1_000)}ms`;
    return `${prefix}${sign}${result}${suffix}`;
  }

  // --- Clock: "1:23:45" or "5:30" ---
  if (style === "clock") {
    const parts = decompose(totalSeconds, precision);
    let result: string;
    if (parts.months > 0) {
      result = `${parts.months}mo ${parts.weeks}w ${parts.days}d`;
    } else if (parts.weeks > 0) {
      result = `${parts.weeks}w ${parts.days}d ${pad(parts.hours)}h`;
    } else if (parts.days > 0) {
      result = `${parts.days}d ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
    } else if (parts.hours > 0) {
      result = `${parts.hours}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
    } else {
      result = `${parts.minutes}:${pad(parts.seconds)}`;
    }
    return `${prefix}${sign}${result}${suffix}`;
  }

  // --- Compact ("5m 30s") and Long ("5 minutes 30 seconds") ---
  const parts = decompose(totalSeconds, precision);
  const isLong = style === "long";
  const labels = isLong
    ? { mo: " month", w: " week", d: " day", h: " hour", m: " minute", s: " second", ms: " millisecond" }
    : { mo: "mo", w: "w", d: "d", h: "h", m: "m", s: "s", ms: "ms" };

  const segments: string[] = [];
  if (parts.months > 0) segments.push(`${parts.months}${labels.mo}${isLong && parts.months !== 1 ? "s" : ""}`);
  if (parts.weeks > 0) segments.push(`${parts.weeks}${labels.w}${isLong && parts.weeks !== 1 ? "s" : ""}`);
  if (parts.days > 0) segments.push(`${parts.days}${labels.d}${isLong && parts.days !== 1 ? "s" : ""}`);
  if (parts.hours > 0) segments.push(`${parts.hours}${labels.h}${isLong && parts.hours !== 1 ? "s" : ""}`);
  if (parts.minutes > 0) segments.push(`${parts.minutes}${labels.m}${isLong && parts.minutes !== 1 ? "s" : ""}`);
  if (parts.seconds > 0) segments.push(`${parts.seconds}${labels.s}${isLong && parts.seconds !== 1 ? "s" : ""}`);
  if (segments.length === 0 && parts.ms > 0) segments.push(`${parts.ms}${labels.ms}`);
  if (segments.length === 0) segments.push(`0${labels.s}`);

  const result = segments.join(" ");
  return `${prefix}${sign}${result}${suffix}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Change / comparison formatting
// ---------------------------------------------------------------------------

export type ComparisonMode = "absolute" | "percent" | "both";

export interface ComparisonResult {
  percentChange: number;
  absoluteChange: number;
  trend: "positive" | "negative" | "neutral";
  label: string;
}

export function computeComparison(
  current: number,
  previous: number,
  opts?: {
    mode?: ComparisonMode;
    invertTrend?: boolean;
    format?: FormatOption;
    localeDefaults?: LocaleDefaults;
  }
): ComparisonResult {
  const absoluteChange = current - previous;
  const invert = opts?.invertTrend ?? false;
  const mode = opts?.mode ?? "percent";

  // --- Handle previous === 0 edge case ---
  if (previous === 0) {
    const isUp = current > 0;
    const isDown = current < 0;
    let trend: "positive" | "negative" | "neutral" = "neutral";
    if (isUp) trend = invert ? "negative" : "positive";
    if (isDown) trend = invert ? "positive" : "negative";

    // Can't compute percent change from zero — fall back to absolute for the label
    const absFmt = formatValue(Math.abs(absoluteChange), opts?.format, opts?.localeDefaults);
    const absStr = `${absoluteChange >= 0 ? "+" : "-"}${absFmt}`;
    let label: string;
    if (current === 0) {
      label = "\u2014"; // em dash for 0 → 0
    } else {
      // Show absolute change regardless of requested mode
      label = absStr;
    }

    return {
      percentChange: current === 0 ? 0 : current > 0 ? Infinity : -Infinity,
      absoluteChange,
      trend,
      label,
    };
  }

  const percentChange = ((current - previous) / Math.abs(previous)) * 100;

  const isUp = absoluteChange > 0;
  const isDown = absoluteChange < 0;

  let trend: "positive" | "negative" | "neutral" = "neutral";
  if (isUp) trend = invert ? "negative" : "positive";
  if (isDown) trend = invert ? "positive" : "negative";

  let label: string;

  const absFmt = formatValue(Math.abs(absoluteChange), opts?.format, opts?.localeDefaults);
  const pctStr = `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}%`;
  const absStr = `${absoluteChange >= 0 ? "+" : "-"}${absFmt}`;

  switch (mode) {
    case "absolute":
      label = absStr;
      break;
    case "both":
      label = `${absStr} (${pctStr})`;
      break;
    case "percent":
    default:
      label = pctStr;
      break;
  }

  return { percentChange, absoluteChange, trend, label };
}

// ---------------------------------------------------------------------------
// Conditional formatting
// ---------------------------------------------------------------------------

export type SimpleOperator = "above" | "below" | "between" | "equals" | "not_equals" | "at_or_above" | "at_or_below";

/** A single check (used standalone or inside compound rules) */
export interface ConditionCheck {
  operator: SimpleOperator;
  value?: number;
  min?: number;
  max?: number;
}

/** Simple condition — one check, one color */
export interface SimpleCondition {
  when: SimpleOperator;
  value?: number;
  min?: number;
  max?: number;
  /** Named color ("emerald", "red") or any CSS color ("#ff6b6b", "rgb(...)") */
  color: string;
}

/** Compound condition — multiple checks combined with AND/OR */
export interface CompoundCondition {
  when: "and" | "or";
  rules: ConditionCheck[];
  /** Named color ("emerald", "red") or any CSS color ("#ff6b6b", "rgb(...)") */
  color: string;
}

export type Condition = SimpleCondition | CompoundCondition;

/** Check if a color string is a raw CSS value (hex, rgb, hsl) vs a named token */
export function isCustomColor(color: string): boolean {
  return color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl");
}

/** Evaluate a single check against a value */
function checkPasses(value: number, check: ConditionCheck): boolean {
  switch (check.operator) {
    case "above": return check.value !== undefined && value > check.value;
    case "at_or_above": return check.value !== undefined && value >= check.value;
    case "below": return check.value !== undefined && value < check.value;
    case "at_or_below": return check.value !== undefined && value <= check.value;
    case "between": return check.min !== undefined && check.max !== undefined && value >= check.min && value <= check.max;
    case "equals": return check.value !== undefined && value === check.value;
    case "not_equals": return check.value !== undefined && value !== check.value;
    default: return false;
  }
}

export function evaluateConditions(value: number, conditions?: Condition[]): string | null {
  if (!conditions || conditions.length === 0) return null;

  for (const c of conditions) {
    // Compound: AND / OR
    if (c.when === "and" || c.when === "or") {
      const compound = c as CompoundCondition;
      const results = compound.rules.map((r) => checkPasses(value, r));
      const match = c.when === "and"
        ? results.every(Boolean)
        : results.some(Boolean);
      if (match) return c.color;
      continue;
    }

    // Simple
    const simple = c as SimpleCondition;
    const check: ConditionCheck = { operator: simple.when, value: simple.value, min: simple.min, max: simple.max };
    if (checkPasses(value, check)) return c.color;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Goal / target
// ---------------------------------------------------------------------------

export interface GoalConfig {
  value: number;
  label?: string;
  /** Show the progress bar. Default: true */
  showProgress?: boolean;
  /** Show the goal target value (e.g. "of $100K"). Default: false */
  showTarget?: boolean;
  /** Show the remaining amount (e.g. "$21.6K remaining"). Default: false */
  showRemaining?: boolean;
  /** Color for the progress bar. Named or CSS color. Default: uses accent */
  color?: string;
  /** Color when goal is complete. Default: "emerald" */
  completeColor?: string;
}

export function computeGoalProgress(current: number, goal: GoalConfig) {
  const progress = Math.min((current / goal.value) * 100, 100);
  const remaining = Math.max(goal.value - current, 0);
  const isComplete = current >= goal.value;
  const overshoot = current > goal.value ? current - goal.value : 0;
  return { progress, remaining, isComplete, overshoot };
}
