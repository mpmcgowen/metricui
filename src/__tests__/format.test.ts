import { describe, it, expect } from "vitest";
import {
  formatValue,
  computeComparison,
  evaluateConditions,
  computeGoalProgress,
  isCustomColor,
  fmt,
  resolveFormat,
  type Condition,
} from "@/lib/format";

// ---------------------------------------------------------------------------
// formatValue — currency
// ---------------------------------------------------------------------------

describe("formatValue — currency", () => {
  it("formats thousands with K suffix", () => {
    expect(formatValue(78_400, "currency")).toBe("$78.4K");
  });

  it("formats millions with M suffix", () => {
    expect(formatValue(1_200_000, "currency")).toBe("$1.2M");
  });

  it("formats billions with B suffix", () => {
    expect(formatValue(2_500_000_000, "currency")).toBe("$2.5B");
  });

  it("formats trillions with T suffix", () => {
    expect(formatValue(1_500_000_000_000, "currency")).toBe("$1.5T");
  });

  it("formats small values without compact suffix", () => {
    expect(formatValue(42, "currency")).toBe("$42");
  });

  it("formats zero", () => {
    expect(formatValue(0, "currency")).toBe("$0");
  });

  it("formats negative values", () => {
    expect(formatValue(-5_000, "currency")).toBe("-$5.0K");
  });

  it("respects explicit precision", () => {
    expect(formatValue(78_400, fmt("currency", { precision: 2 }))).toBe("$78.40K");
  });

  it("formats non-compact currency", () => {
    expect(formatValue(1234.56, fmt("currency", { compact: false, precision: 2 }))).toBe("$1,234.56");
  });
});

// ---------------------------------------------------------------------------
// formatValue — number
// ---------------------------------------------------------------------------

describe("formatValue — number", () => {
  it("formats thousands", () => {
    expect(formatValue(3_200, "number")).toBe("3.2K");
  });

  it("formats millions", () => {
    expect(formatValue(1_200_000, "number")).toBe("1.2M");
  });

  it("formats small numbers without suffix", () => {
    expect(formatValue(999, "number")).toBe("999");
  });

  it("formats zero", () => {
    expect(formatValue(0, "number")).toBe("0");
  });

  it("formats negative numbers", () => {
    expect(formatValue(-4_500, "number")).toBe("-4.5K");
  });

  it("handles default (no format option) as number compact", () => {
    // No format option defaults to number with compact: true
    expect(formatValue(5_000)).toBe("5K");
  });
});

// ---------------------------------------------------------------------------
// formatValue — percent
// ---------------------------------------------------------------------------

describe("formatValue — percent", () => {
  it("formats whole percent with one decimal", () => {
    expect(formatValue(4.2, "percent")).toBe("4.2%");
  });

  it("formats integer percent", () => {
    expect(formatValue(100, "percent")).toBe("100.0%");
  });

  it("handles decimal input mode", () => {
    expect(formatValue(0.12, fmt("percent", { percentInput: "decimal" }))).toBe("12.0%");
  });

  it("handles zero", () => {
    expect(formatValue(0, "percent")).toBe("0.0%");
  });

  it("handles negative percent", () => {
    expect(formatValue(-3.5, "percent")).toBe("-3.5%");
  });

  it("respects custom precision", () => {
    expect(formatValue(4.256, fmt("percent", { precision: 2 }))).toBe("4.26%");
  });
});

// ---------------------------------------------------------------------------
// formatValue — duration
// ---------------------------------------------------------------------------

describe("formatValue — duration", () => {
  it("formats hours and minutes in compact style (default)", () => {
    expect(formatValue(3720, "duration")).toBe("1h 2m");
  });

  it("formats minutes and seconds", () => {
    expect(formatValue(330, "duration")).toBe("5m 30s");
  });

  it("formats zero duration", () => {
    expect(formatValue(0, "duration")).toBe("0s");
  });

  it("formats clock style", () => {
    expect(formatValue(330, fmt("duration", { durationStyle: "clock" }))).toBe("5:30");
  });

  it("formats clock style with hours", () => {
    expect(formatValue(5025, fmt("duration", { durationStyle: "clock" }))).toBe("1:23:45");
  });

  it("formats narrow style", () => {
    expect(formatValue(330, fmt("duration", { durationStyle: "narrow" }))).toBe("330.0s");
  });

  it("formats long style", () => {
    expect(formatValue(330, fmt("duration", { durationStyle: "long" }))).toBe("5 minutes 30 seconds");
  });

  it("handles milliseconds input", () => {
    expect(formatValue(5000, fmt("duration", { durationInput: "milliseconds" }))).toBe("5s");
  });

  it("handles minutes input", () => {
    expect(formatValue(90, fmt("duration", { durationInput: "minutes" }))).toBe("1h 30m");
  });

  it("handles hours input", () => {
    expect(formatValue(2.5, fmt("duration", { durationInput: "hours" }))).toBe("2h 30m");
  });

  it("respects durationPrecision", () => {
    // 7384 seconds = 2h 3m 4s → with precision "minutes" should omit seconds
    expect(formatValue(7380, fmt("duration", { durationPrecision: "minutes" }))).toBe("2h 3m");
  });
});

// ---------------------------------------------------------------------------
// formatValue — compact modes
// ---------------------------------------------------------------------------

describe("formatValue — compact modes", () => {
  it("forces thousands", () => {
    expect(formatValue(1_500_000, fmt("number", { compact: "thousands" }))).toBe("1,500K");
  });

  it("forces millions", () => {
    expect(formatValue(1_500_000_000, fmt("number", { compact: "millions" }))).toBe("1,500M");
  });

  it("auto picks appropriate scale", () => {
    expect(formatValue(500, fmt("number", { compact: "auto" }))).toBe("500");
    expect(formatValue(5_000, fmt("number", { compact: "auto" }))).toBe("5K");
    expect(formatValue(5_000_000, fmt("number", { compact: "auto" }))).toBe("5M");
  });

  it("no compacting with compact: false", () => {
    expect(formatValue(1_234_567, fmt("number", { compact: false }))).toBe("1,234,567");
  });
});

// ---------------------------------------------------------------------------
// formatValue — locale
// ---------------------------------------------------------------------------

describe("formatValue — locale", () => {
  it("formats with de-DE locale (dots as thousands separator)", () => {
    const result = formatValue(1_234_567, fmt("number", { compact: false, locale: "de-DE" }));
    // German uses . for thousands and , for decimals
    expect(result).toContain("1.234.567");
  });

  it("formats currency with ja-JP locale and JPY", () => {
    const result = formatValue(5_000, fmt("currency", { locale: "ja-JP", currency: "JPY" }));
    // Yen symbol and compact
    expect(result).toContain("5");
    expect(result).toMatch(/[¥￥]/);
  });

  it("uses localeDefaults when no explicit locale", () => {
    const result = formatValue(5_000, "currency", { locale: "en-GB", currency: "GBP" });
    expect(result).toContain("£");
  });
});

// ---------------------------------------------------------------------------
// formatValue — prefix / suffix
// ---------------------------------------------------------------------------

describe("formatValue — prefix / suffix", () => {
  it("adds prefix", () => {
    expect(formatValue(100, fmt("number", { compact: false, prefix: "~" }))).toBe("~100");
  });

  it("adds suffix", () => {
    expect(formatValue(100, fmt("number", { compact: false, suffix: " users" }))).toBe("100 users");
  });

  it("adds both prefix and suffix", () => {
    expect(formatValue(42, fmt("percent", { prefix: "≈", suffix: " avg" }))).toBe("≈42.0% avg");
  });
});

// ---------------------------------------------------------------------------
// computeComparison
// ---------------------------------------------------------------------------

describe("computeComparison", () => {
  it("computes positive percent change", () => {
    const result = computeComparison(120, 100);
    expect(result.percentChange).toBeCloseTo(20);
    expect(result.absoluteChange).toBe(20);
    expect(result.trend).toBe("positive");
    expect(result.label).toBe("+20.0%");
  });

  it("computes negative percent change", () => {
    const result = computeComparison(80, 100);
    expect(result.percentChange).toBeCloseTo(-20);
    expect(result.absoluteChange).toBe(-20);
    expect(result.trend).toBe("negative");
    expect(result.label).toBe("-20.0%");
  });

  it("returns neutral for no change", () => {
    const result = computeComparison(100, 100);
    expect(result.percentChange).toBe(0);
    expect(result.trend).toBe("neutral");
    expect(result.label).toBe("+0.0%");
  });

  it("handles invertTrend (down is good)", () => {
    const result = computeComparison(80, 100, { invertTrend: true });
    expect(result.trend).toBe("positive"); // Down is good when inverted
  });

  it("handles invertTrend for positive change", () => {
    const result = computeComparison(120, 100, { invertTrend: true });
    expect(result.trend).toBe("negative"); // Up is bad when inverted
  });

  it("handles previous = 0", () => {
    const result = computeComparison(50, 0);
    expect(result.percentChange).toBe(Infinity);
    expect(result.absoluteChange).toBe(50);
    expect(result.trend).toBe("positive");
  });

  it("handles both current and previous = 0", () => {
    const result = computeComparison(0, 0);
    expect(result.percentChange).toBe(0);
    expect(result.trend).toBe("neutral");
    expect(result.label).toBe("\u2014"); // em dash
  });

  it("returns absolute mode label", () => {
    const result = computeComparison(150, 100, { mode: "absolute" });
    expect(result.label).toContain("+");
  });

  it("returns both mode label", () => {
    const result = computeComparison(150, 100, { mode: "both" });
    expect(result.label).toContain("+");
    expect(result.label).toContain("%");
  });

  it("handles negative values correctly", () => {
    const result = computeComparison(-50, -100);
    expect(result.percentChange).toBeCloseTo(50);
    expect(result.absoluteChange).toBe(50);
    expect(result.trend).toBe("positive");
  });
});

// ---------------------------------------------------------------------------
// evaluateConditions
// ---------------------------------------------------------------------------

describe("evaluateConditions", () => {
  it("returns null for empty conditions", () => {
    expect(evaluateConditions(50)).toBeNull();
    expect(evaluateConditions(50, [])).toBeNull();
  });

  it("matches above condition", () => {
    const conditions: Condition[] = [{ when: "above", value: 90, color: "emerald" }];
    expect(evaluateConditions(95, conditions)).toBe("emerald");
    expect(evaluateConditions(85, conditions)).toBeNull();
  });

  it("matches below condition", () => {
    const conditions: Condition[] = [{ when: "below", value: 20, color: "red" }];
    expect(evaluateConditions(15, conditions)).toBe("red");
    expect(evaluateConditions(25, conditions)).toBeNull();
  });

  it("matches between condition (inclusive)", () => {
    const conditions: Condition[] = [{ when: "between", min: 10, max: 50, color: "amber" }];
    expect(evaluateConditions(30, conditions)).toBe("amber");
    expect(evaluateConditions(10, conditions)).toBe("amber"); // inclusive
    expect(evaluateConditions(50, conditions)).toBe("amber"); // inclusive
    expect(evaluateConditions(51, conditions)).toBeNull();
  });

  it("matches equals condition", () => {
    const conditions: Condition[] = [{ when: "equals", value: 42, color: "blue" }];
    expect(evaluateConditions(42, conditions)).toBe("blue");
    expect(evaluateConditions(43, conditions)).toBeNull();
  });

  it("matches not_equals condition", () => {
    const conditions: Condition[] = [{ when: "not_equals", value: 0, color: "emerald" }];
    expect(evaluateConditions(5, conditions)).toBe("emerald");
    expect(evaluateConditions(0, conditions)).toBeNull();
  });

  it("matches at_or_above condition", () => {
    const conditions: Condition[] = [{ when: "at_or_above", value: 100, color: "emerald" }];
    expect(evaluateConditions(100, conditions)).toBe("emerald");
    expect(evaluateConditions(99, conditions)).toBeNull();
  });

  it("matches at_or_below condition", () => {
    const conditions: Condition[] = [{ when: "at_or_below", value: 10, color: "red" }];
    expect(evaluateConditions(10, conditions)).toBe("red");
    expect(evaluateConditions(11, conditions)).toBeNull();
  });

  it("returns first matching condition", () => {
    const conditions: Condition[] = [
      { when: "above", value: 90, color: "emerald" },
      { when: "above", value: 50, color: "amber" },
    ];
    expect(evaluateConditions(95, conditions)).toBe("emerald");
  });

  it("evaluates compound AND condition", () => {
    const conditions: Condition[] = [
      {
        when: "and",
        rules: [
          { operator: "above", value: 10 },
          { operator: "below", value: 50 },
        ],
        color: "amber",
      },
    ];
    expect(evaluateConditions(30, conditions)).toBe("amber");
    expect(evaluateConditions(5, conditions)).toBeNull();
    expect(evaluateConditions(60, conditions)).toBeNull();
  });

  it("evaluates compound OR condition", () => {
    const conditions: Condition[] = [
      {
        when: "or",
        rules: [
          { operator: "below", value: 10 },
          { operator: "above", value: 90 },
        ],
        color: "red",
      },
    ];
    expect(evaluateConditions(5, conditions)).toBe("red");
    expect(evaluateConditions(95, conditions)).toBe("red");
    expect(evaluateConditions(50, conditions)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// computeGoalProgress
// ---------------------------------------------------------------------------

describe("computeGoalProgress", () => {
  it("computes progress percentage", () => {
    const result = computeGoalProgress(50, { value: 100 });
    expect(result.progress).toBe(50);
  });

  it("computes remaining amount", () => {
    const result = computeGoalProgress(70, { value: 100 });
    expect(result.remaining).toBe(30);
  });

  it("caps progress at 100%", () => {
    const result = computeGoalProgress(150, { value: 100 });
    expect(result.progress).toBe(100);
  });

  it("detects completion", () => {
    const result = computeGoalProgress(100, { value: 100 });
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("detects overshoot", () => {
    const result = computeGoalProgress(130, { value: 100 });
    expect(result.isComplete).toBe(true);
    expect(result.overshoot).toBe(30);
  });

  it("handles zero current", () => {
    const result = computeGoalProgress(0, { value: 100 });
    expect(result.progress).toBe(0);
    expect(result.remaining).toBe(100);
    expect(result.isComplete).toBe(false);
  });

  it("remaining is never negative", () => {
    const result = computeGoalProgress(200, { value: 100 });
    expect(result.remaining).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// isCustomColor
// ---------------------------------------------------------------------------

describe("isCustomColor", () => {
  it("detects hex colors", () => {
    expect(isCustomColor("#ff6b6b")).toBe(true);
    expect(isCustomColor("#FFF")).toBe(true);
  });

  it("detects rgb colors", () => {
    expect(isCustomColor("rgb(255, 0, 0)")).toBe(true);
    expect(isCustomColor("rgba(255, 0, 0, 0.5)")).toBe(true);
  });

  it("detects hsl colors", () => {
    expect(isCustomColor("hsl(120, 100%, 50%)")).toBe(true);
    expect(isCustomColor("hsla(120, 100%, 50%, 0.5)")).toBe(true);
  });

  it("returns false for named colors", () => {
    expect(isCustomColor("emerald")).toBe(false);
    expect(isCustomColor("red")).toBe(false);
    expect(isCustomColor("amber")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// fmt helper
// ---------------------------------------------------------------------------

describe("fmt helper", () => {
  it("creates a currency config", () => {
    const config = fmt("currency");
    expect(config.style).toBe("currency");
    expect(config.currency).toBe("USD");
    expect(config.compact).toBe(true);
  });

  it("creates a number config", () => {
    const config = fmt("number");
    expect(config.style).toBe("number");
    expect(config.compact).toBe(true);
  });

  it("creates a compact config", () => {
    const config = fmt("compact");
    expect(config.style).toBe("number");
    expect(config.compact).toBe(true);
  });

  it("creates a percent config", () => {
    const config = fmt("percent");
    expect(config.style).toBe("percent");
    expect(config.precision).toBe(1);
  });

  it("creates a duration config", () => {
    const config = fmt("duration");
    expect(config.style).toBe("duration");
  });

  it("applies overrides", () => {
    const config = fmt("currency", { precision: 2, currency: "EUR" });
    expect(config.style).toBe("currency");
    expect(config.precision).toBe(2);
    expect(config.currency).toBe("EUR");
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("formatValue — edge cases", () => {
  it("handles NaN gracefully", () => {
    const result = formatValue(NaN, "number");
    // Intl.NumberFormat.format(NaN) returns "NaN"
    expect(result).toBe("NaN");
  });

  it("handles Infinity gracefully", () => {
    const result = formatValue(Infinity, "number");
    // Intl.NumberFormat.format(Infinity) returns "∞"
    expect(result).toContain("∞");
  });

  it("handles negative Infinity gracefully", () => {
    const result = formatValue(-Infinity, "number");
    expect(result).toContain("∞");
    expect(result).toContain("-");
  });

  it("handles value = 0 for all styles", () => {
    expect(formatValue(0, "number")).toBe("0");
    expect(formatValue(0, "currency")).toBe("$0");
    expect(formatValue(0, "percent")).toBe("0.0%");
    expect(formatValue(0, "duration")).toBe("0s");
  });

  it("handles very small positive values", () => {
    expect(formatValue(0.001, "number")).toBe("0");
    expect(formatValue(0.001, "percent")).toBe("0.0%");
  });
});
