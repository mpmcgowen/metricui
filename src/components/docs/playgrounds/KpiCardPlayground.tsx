"use client";

import { useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import {
  Toggle,
  TextInput,
  NumberInput,
  Select,
  ColorInput,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";
import { DollarSign, Users, Activity, ArrowUpRight, Zap, Heart, Clock, Percent, ChevronUp, ChevronDown, ArrowUp, ArrowDown, CircleArrowUp, CircleArrowDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Icon map for the select
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ReactNode> = {
  none: undefined as unknown as React.ReactNode,
  dollar: <DollarSign className="h-3.5 w-3.5" />,
  users: <Users className="h-3.5 w-3.5" />,
  activity: <Activity className="h-3.5 w-3.5" />,
  arrow: <ArrowUpRight className="h-3.5 w-3.5" />,
  zap: <Zap className="h-3.5 w-3.5" />,
  heart: <Heart className="h-3.5 w-3.5" />,
  clock: <Clock className="h-3.5 w-3.5" />,
  percent: <Percent className="h-3.5 w-3.5" />,
};

// Trend icon presets
const trendIconPresets: Record<string, { up: React.ReactNode; down: React.ReactNode; neutral: React.ReactNode } | undefined> = {
  default: undefined,
  chevron: {
    up: <ChevronUp className="h-3 w-3" />,
    down: <ChevronDown className="h-3 w-3" />,
    neutral: <span className="text-[10px]">—</span>,
  },
  arrow: {
    up: <ArrowUp className="h-3 w-3" />,
    down: <ArrowDown className="h-3 w-3" />,
    neutral: <span className="text-[10px]">—</span>,
  },
  circle: {
    up: <CircleArrowUp className="h-3 w-3" />,
    down: <CircleArrowDown className="h-3 w-3" />,
    neutral: <span className="text-[10px]">—</span>,
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function KpiCardPlayground() {
  // --- Core ---
  const [title, setTitle] = useState("Revenue");
  const [value, setValue] = useState(78400);
  const [formatStyle, setFormatStyle] = useState("currency");
  const [compact, setCompact] = useState("auto");
  const [suffix, setSuffix] = useState("");
  const [prefix, setPrefix] = useState("");
  const [precision, setPrecision] = useState(1);
  const [iconKey, setIconKey] = useState("dollar");

  // --- Comparison ---
  const [showComparison, setShowComparison] = useState(true);
  const [comparisonValue, setComparisonValue] = useState(69700);
  const [comparisonLabel, setComparisonLabel] = useState("vs last month");
  const [comparisonMode, setComparisonMode] = useState("percent");
  const [invertTrend, setInvertTrend] = useState(false);

  // --- Multiple comparisons ---
  const [showSecondComparison, setShowSecondComparison] = useState(false);
  const [comparison2Value, setComparison2Value] = useState(65000);
  const [comparison2Label, setComparison2Label] = useState("vs last year");
  const [comparison2Mode, setComparison2Mode] = useState("percent");

  // --- Trend icons ---
  const [trendIconPreset, setTrendIconPreset] = useState("default");

  // --- Percent ---
  const [percentInput, setPercentInput] = useState("whole");

  // --- Duration ---
  const [durationInput, setDurationInput] = useState("seconds");
  const [durationStyle, setDurationStyle] = useState("compact");
  const [durationPrecision, setDurationPrecision] = useState("seconds");

  // --- Goal ---
  const [showGoal, setShowGoal] = useState(false);
  const [goalValue, setGoalValue] = useState(100000);
  const [goalLabel, setGoalLabel] = useState("Q1 Target");
  const [goalShowProgress, setGoalShowProgress] = useState(true);
  const [goalShowTarget, setGoalShowTarget] = useState(false);
  const [goalShowRemaining, setGoalShowRemaining] = useState(false);
  const [goalColor, setGoalColor] = useState("");
  const [goalCompleteColor, setGoalCompleteColor] = useState("");

  // --- Sparkline ---
  const [showSparkline, setShowSparkline] = useState(true);
  const [showPreviousPeriod, setShowPreviousPeriod] = useState(false);
  const [sparklineType, setSparklineType] = useState("line");
  const [sparklineInteractive, setSparklineInteractive] = useState(false);

  // --- Null handling ---
  const [simulateNull, setSimulateNull] = useState(false);
  const [nullDisplay, setNullDisplay] = useState("dash");

  // --- Conditions ---
  const [showConditions, setShowConditions] = useState(false);
  interface ConditionRule {
    type: "simple" | "and" | "or";
    when: string;
    value: number;
    rules: { operator: string; value: number }[];
    color: string;
  }
  const [condRules, setCondRules] = useState<ConditionRule[]>([
    { type: "simple", when: "above", value: 90000, rules: [], color: "emerald" },
    { type: "simple", when: "below", value: 50000, rules: [], color: "red" },
  ]);
  const updateRule = (idx: number, patch: Partial<ConditionRule>) => {
    setCondRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };
  const addRule = () => {
    setCondRules((prev) => [...prev, { type: "simple", when: "above", value: 0, rules: [], color: "amber" }]);
  };
  const removeRule = (idx: number) => {
    setCondRules((prev) => prev.filter((_, i) => i !== idx));
  };
  const addSubRule = (idx: number) => {
    setCondRules((prev) => prev.map((r, i) => i === idx ? { ...r, rules: [...r.rules, { operator: "above", value: 0 }] } : r));
  };
  const updateSubRule = (ruleIdx: number, subIdx: number, patch: Partial<{ operator: string; value: number }>) => {
    setCondRules((prev) => prev.map((r, i) => i === ruleIdx ? { ...r, rules: r.rules.map((sr, si) => si === subIdx ? { ...sr, ...patch } : sr) } : r));
  };
  const removeSubRule = (ruleIdx: number, subIdx: number) => {
    setCondRules((prev) => prev.map((r, i) => i === ruleIdx ? { ...r, rules: r.rules.filter((_, si) => si !== subIdx) } : r));
  };

  // --- Context ---
  const [description, setDescription] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [footnote, setFootnote] = useState("");

  // --- Interactivity ---
  const [copyable, setCopyable] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [highlight, setHighlight] = useState(false);
  const [highlightColor, setHighlightColor] = useState("");
  const [showDrillDown, setShowDrillDown] = useState(false);

  // --- Title layout ---
  const [titlePosition, setTitlePosition] = useState("top");
  const [titleAlign, setTitleAlign] = useState("left");

  // --- Variant ---
  const [variant, setVariant] = useState("default");

  // --- Format switch handler ---
  const handleFormatChange = (newFormat: string) => {
    setFormatStyle(newFormat);
    if (newFormat === "duration") {
      setDurationInput("seconds");
      setDurationStyle("compact");
      setDurationPrecision("seconds");
    }
    if (newFormat === "percent") {
      setPercentInput("whole");
    }
  };

  // --- Derived ---
  const showCompactControl = formatStyle === "currency" || formatStyle === "number";
  const showPrecisionControl = formatStyle !== "duration" || durationStyle === "narrow";

  // --- Build format config ---
  const compactValue = compact === "false" ? false : compact === "auto" ? true : compact;
  const hasDurationOverrides = formatStyle === "duration" && (durationInput !== "seconds" || durationStyle !== "compact" || durationPrecision !== "seconds");
  const hasFormatOverrides = suffix || prefix || (showCompactControl && compact !== "auto") || precision !== 1 || (formatStyle === "percent" && percentInput !== "whole") || hasDurationOverrides;
  const format = hasFormatOverrides
    ? {
        style: formatStyle as "number" | "currency" | "percent" | "duration",
        ...(showCompactControl ? { compact: compactValue as boolean | "auto" | "thousands" | "millions" | "billions" | "trillions" } : {}),
        ...(showPrecisionControl ? { precision } : {}),
        ...(suffix ? { suffix } : {}),
        ...(prefix ? { prefix } : {}),
        ...(formatStyle === "percent" && percentInput === "decimal" ? { percentInput: "decimal" as const } : {}),
        ...(formatStyle === "duration" ? {
          durationInput: durationInput as "seconds" | "milliseconds" | "minutes" | "hours",
          durationStyle: durationStyle as "compact" | "long" | "clock" | "narrow",
          durationPrecision: durationPrecision as "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds",
        } : {}),
      }
    : (formatStyle as "number" | "currency" | "percent" | "duration");

  // --- Build comparison(s) ---
  const comparisonProp = (() => {
    if (!showComparison) return undefined;
    const primary = {
      value: comparisonValue,
      mode: comparisonMode as "percent" | "absolute" | "both",
      invertTrend,
    };
    if (showSecondComparison) {
      return [
        primary,
        {
          value: comparison2Value,
          label: comparison2Label,
          mode: comparison2Mode as "percent" | "absolute" | "both",
        },
      ];
    }
    return primary;
  })();

  // --- Sparkline data ---
  const sparklineData = showSparkline
    ? [42, 45, 48, 51, 49, 55, 58, 62, 59, 65, 71, 78]
    : undefined;
  const sparklinePrevious = showPreviousPeriod
    ? [38, 40, 42, 44, 41, 47, 50, 53, 51, 56, 60, 65]
    : undefined;

  // --- Build code string ---
  const codeLines = [
    `<KpiCard`,
    `  title="${title}"`,
    simulateNull ? `  value={null}` : `  value={${value}}`,
  ];
  if (typeof format === "string") {
    codeLines.push(`  format="${format}"`);
  } else {
    const parts = Object.entries(format)
      .map(([k, v]) => `${k}: ${typeof v === "string" ? `"${v}"` : v}`)
      .join(", ");
    codeLines.push(`  format={{ ${parts} }}`);
  }
  if (iconKey !== "none") {
    const iconName = iconKey === "dollar" ? "DollarSign" : iconKey === "users" ? "Users" : iconKey === "activity" ? "Activity" : iconKey === "arrow" ? "ArrowUpRight" : iconKey === "zap" ? "Zap" : iconKey === "clock" ? "Clock" : iconKey === "percent" ? "Percent" : "Heart";
    codeLines.push(`  icon={<${iconName} />}`);
  }
  if (showComparison) {
    if (showSecondComparison) {
      codeLines.push(`  comparison={[`);
      const compParts1 = [`value: ${comparisonValue}`];
      if (comparisonMode !== "percent") compParts1.push(`mode: "${comparisonMode}"`);
      if (invertTrend) compParts1.push(`invertTrend: true`);
      codeLines.push(`    { ${compParts1.join(", ")} },`);
      const compParts2 = [`value: ${comparison2Value}`, `label: "${comparison2Label}"`];
      if (comparison2Mode !== "percent") compParts2.push(`mode: "${comparison2Mode}"`);
      codeLines.push(`    { ${compParts2.join(", ")} },`);
      codeLines.push(`  ]}`);
    } else {
      const compParts = [`value: ${comparisonValue}`];
      if (comparisonMode !== "percent") compParts.push(`mode: "${comparisonMode}"`);
      if (invertTrend) compParts.push(`invertTrend: true`);
      codeLines.push(`  comparison={{ ${compParts.join(", ")} }}`);
    }
    if (comparisonLabel) codeLines.push(`  comparisonLabel="${comparisonLabel}"`);
  }
  if (trendIconPreset !== "default") {
    codeLines.push(`  trendIcon={{ up: <${trendIconPreset === "chevron" ? "ChevronUp" : trendIconPreset === "arrow" ? "ArrowUp" : "CircleArrowUp"} />, down: <${trendIconPreset === "chevron" ? "ChevronDown" : trendIconPreset === "arrow" ? "ArrowDown" : "CircleArrowDown"} /> }}`);
  }
  if (showGoal) {
    const goalParts = [`value: ${goalValue}`, `label: "${goalLabel}"`];
    if (goalShowProgress) goalParts.push(`showProgress: true`);
    if (goalShowTarget) goalParts.push(`showTarget: true`);
    if (goalShowRemaining) goalParts.push(`showRemaining: true`);
    if (goalColor) goalParts.push(`color: "${goalColor}"`);
    if (goalCompleteColor) goalParts.push(`completeColor: "${goalCompleteColor}"`);
    codeLines.push(`  goal={{ ${goalParts.join(", ")} }}`);
  }
  if (showSparkline) {
    codeLines.push(`  sparklineData={[42, 45, 48, 51, 49, 55, 58, 62, 59, 65, 71, 78]}`);
    if (showPreviousPeriod) codeLines.push(`  sparklinePreviousPeriod={[38, 40, 42, ...]}`);
    if (sparklineType !== "line") codeLines.push(`  sparklineType="${sparklineType}"`);
    if (sparklineInteractive) codeLines.push(`  sparklineInteractive`);
  }
  if (simulateNull) {
    codeLines.push(`  nullDisplay="${nullDisplay}"`);
  }
  if (showConditions && condRules.length > 0) {
    codeLines.push(`  conditions={[`);
    for (const r of condRules) {
      if (r.type === "simple") {
        codeLines.push(`    { when: "${r.when}", value: ${r.value}, color: "${r.color}" },`);
      } else {
        const subs = r.rules.map((sr) => `{ operator: "${sr.operator}", value: ${sr.value} }`).join(", ");
        codeLines.push(`    { when: "${r.type}", rules: [${subs}], color: "${r.color}" },`);
      }
    }
    codeLines.push(`  ]}`);
  }
  if (description) codeLines.push(`  description="${description}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (footnote) codeLines.push(`  footnote="${footnote}"`);
  if (copyable) codeLines.push(`  copyable`);
  if (animate) codeLines.push(`  animate={{ countUp: true }}`);
  if (highlight && highlightColor) codeLines.push(`  highlight="${highlightColor}"`);
  else if (highlight) codeLines.push(`  highlight`);
  if (showDrillDown) codeLines.push(`  drillDown={{ label: "View details", onClick: () => {} }}`);
  if (titlePosition !== "top") codeLines.push(`  titlePosition="${titlePosition}"`);
  if (titleAlign !== "left") codeLines.push(`  titleAlign="${titleAlign}"`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col">
        {/* Live Preview */}
        <div className="px-2 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-sm">
            <KpiCard
              key={`${animate}-${value}-${formatStyle}-${simulateNull}`}
              title={title}
              value={simulateNull ? null : value}
              format={format}
              icon={iconKey !== "none" ? iconMap[iconKey] : undefined}
              comparison={comparisonProp}
              comparisonLabel={comparisonLabel || undefined}
              trendIcon={trendIconPresets[trendIconPreset]}
              goal={
                showGoal
                  ? {
                      value: goalValue,
                      label: goalLabel,
                      showProgress: goalShowProgress,
                      showTarget: goalShowTarget,
                      showRemaining: goalShowRemaining,
                      ...(goalColor ? { color: goalColor } : {}),
                      ...(goalCompleteColor ? { completeColor: goalCompleteColor } : {}),
                    }
                  : undefined
              }
              sparklineData={sparklineData}
              sparklinePreviousPeriod={sparklinePrevious}
              sparklineType={sparklineType as "line" | "bar"}
              sparklineInteractive={sparklineInteractive}
              nullDisplay={nullDisplay as "zero" | "dash" | "blank" | "N/A"}
              titlePosition={titlePosition as "top" | "bottom" | "hidden"}
              titleAlign={titleAlign as "left" | "center" | "right"}
              conditions={
                showConditions
                  ? condRules.map((r) =>
                      r.type === "simple"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? { when: r.when as any, value: r.value, color: r.color }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : { when: r.type as any, rules: r.rules.map((sr) => ({ operator: sr.operator as any, value: sr.value })), color: r.color }
                    )
                  : undefined
              }
              description={description || undefined}
              subtitle={subtitle || undefined}
              footnote={footnote || undefined}
              copyable={copyable}
              animate={animate ? { countUp: true } : undefined}
              highlight={highlight ? (highlightColor || true) : false}
              drillDown={showDrillDown ? { label: "View details", onClick: () => {} } : undefined}
              variant={variant as "default" | "outlined" | "ghost" | "elevated"}
            />
          </div>

          {/* Code */}
          <div className="mt-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Code
            </p>
            <CodePreview code={codeLines.join("\n")} />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full flex-shrink-0 overflow-y-auto border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the card update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <Select
            label="titlePosition"
            value={titlePosition}
            onChange={setTitlePosition}
            options={[
              { label: "top (default)", value: "top" },
              { label: "bottom", value: "bottom" },
              { label: "hidden", value: "hidden" },
            ]}
            description="Where the title sits relative to the value"
          />
          <Select
            label="titleAlign"
            value={titleAlign}
            onChange={setTitleAlign}
            options={[
              { label: "left (default)", value: "left" },
              { label: "center", value: "center" },
              { label: "right", value: "right" },
            ]}
            description="Horizontal alignment for title, value, and comparisons"
          />
          <NumberInput
            label="value"
            value={value}
            onChange={setValue}
            step={formatStyle === "percent" ? 0.1 : formatStyle === "duration" ? 10 : 100}
            description={
              formatStyle === "duration"
                ? `Raw value in ${durationInput} — try 3725 (≈1h 2m)`
                : formatStyle === "percent"
                  ? percentInput === "decimal" ? "Decimal — 0.12 will display as 12%" : "Whole — 12 will display as 12%"
                  : undefined
            }
          />
          <Select
            label="format"
            value={formatStyle}
            onChange={handleFormatChange}
            options={[
              { label: "currency", value: "currency" },
              { label: "number", value: "number" },
              { label: "percent", value: "percent" },
              { label: "duration", value: "duration" },
            ]}
          />

          {formatStyle === "percent" && (
            <Select
              label="percentInput"
              value={percentInput}
              onChange={setPercentInput}
              options={[
                { label: "whole (12 = 12%)", value: "whole" },
                { label: "decimal (0.12 = 12%)", value: "decimal" },
              ]}
              description="How your raw value represents the percentage"
            />
          )}

          {formatStyle === "duration" && (
            <>
              <Select
                label="durationInput"
                value={durationInput}
                onChange={setDurationInput}
                options={[
                  { label: "seconds", value: "seconds" },
                  { label: "milliseconds", value: "milliseconds" },
                  { label: "minutes", value: "minutes" },
                  { label: "hours", value: "hours" },
                ]}
                description="What unit your raw value is in"
              />
              <Select
                label="durationStyle"
                value={durationStyle}
                onChange={setDurationStyle}
                options={[
                  { label: 'compact — "5m 30s"', value: "compact" },
                  { label: 'long — "5 minutes 30 seconds"', value: "long" },
                  { label: 'clock — "5:30"', value: "clock" },
                  { label: 'narrow — "5.5m"', value: "narrow" },
                ]}
                description="How the duration is displayed"
              />
              <Select
                label="durationPrecision"
                value={durationPrecision}
                onChange={setDurationPrecision}
                options={[
                  { label: "months", value: "months" },
                  { label: "weeks", value: "weeks" },
                  { label: "days", value: "days" },
                  { label: "hours", value: "hours" },
                  { label: "minutes", value: "minutes" },
                  { label: "seconds", value: "seconds" },
                  { label: "milliseconds", value: "milliseconds" },
                ]}
                description="Smallest unit to display"
              />
            </>
          )}

          {showCompactControl && (
            <Select
              label="compact"
              value={compact}
              onChange={setCompact}
              options={[
                { label: "auto", value: "auto" },
                { label: "thousands (K)", value: "thousands" },
                { label: "millions (M)", value: "millions" },
                { label: "billions (B)", value: "billions" },
                { label: "trillions (T)", value: "trillions" },
                { label: "off", value: "false" },
              ]}
              description="Auto picks K/M/B/T by magnitude, or lock to a scale"
            />
          )}

          {showPrecisionControl && (
            <NumberInput
              label="precision"
              value={precision}
              onChange={setPrecision}
              min={0}
              max={4}
              description={formatStyle === "duration" ? "Decimal places for narrow style" : "Decimal places"}
            />
          )}

          <TextInput label="prefix" value={prefix} onChange={setPrefix} placeholder='e.g. "~"' />
          <TextInput label="suffix" value={suffix} onChange={setSuffix} placeholder='e.g. " users"' />
          <Select
            label="icon"
            value={iconKey}
            onChange={setIconKey}
            options={[
              { label: "None", value: "none" },
              { label: "DollarSign", value: "dollar" },
              { label: "Users", value: "users" },
              { label: "Activity", value: "activity" },
              { label: "ArrowUpRight", value: "arrow" },
              { label: "Zap", value: "zap" },
              { label: "Heart", value: "heart" },
              { label: "Clock", value: "clock" },
              { label: "Percent", value: "percent" },
            ]}
            description="Accepts any ReactNode — Lucide, Heroicons, SVGs, etc."
          />
        </ControlSection>

        {/* Comparison */}
        <ControlSection title="Comparison">
          <Toggle label="Enable" value={showComparison} onChange={setShowComparison} />
          {showComparison && (
            <>
              <NumberInput
                label="comparison.value"
                value={comparisonValue}
                onChange={setComparisonValue}
                step={formatStyle === "percent" ? 0.1 : formatStyle === "duration" ? 10 : 100}
                description="Previous period value — change is computed"
              />
              <TextInput label="comparisonLabel" value={comparisonLabel} onChange={setComparisonLabel} />
              <Select
                label="comparison.mode"
                value={comparisonMode}
                onChange={setComparisonMode}
                options={[
                  { label: "percent", value: "percent" },
                  { label: "absolute", value: "absolute" },
                  { label: "both", value: "both" },
                ]}
              />
              <Toggle label="invertTrend" value={invertTrend} onChange={setInvertTrend} description="Flip colors — for metrics where down is good (duration, churn)" />

              <div className="mt-2 border-t border-[var(--card-border)] pt-2">
                <Toggle label="Second comparison" value={showSecondComparison} onChange={setShowSecondComparison} description="Compare against multiple periods" />
                {showSecondComparison && (
                  <>
                    <NumberInput
                      label="comparison[1].value"
                      value={comparison2Value}
                      onChange={setComparison2Value}
                      step={formatStyle === "percent" ? 0.1 : formatStyle === "duration" ? 10 : 100}
                    />
                    <TextInput label="comparison[1].label" value={comparison2Label} onChange={setComparison2Label} />
                    <Select
                      label="comparison[1].mode"
                      value={comparison2Mode}
                      onChange={setComparison2Mode}
                      options={[
                        { label: "percent", value: "percent" },
                        { label: "absolute", value: "absolute" },
                        { label: "both", value: "both" },
                      ]}
                    />
                  </>
                )}
              </div>

              <Select
                label="trendIcon"
                value={trendIconPreset}
                onChange={setTrendIconPreset}
                options={[
                  { label: "Default (TrendingUp/Down)", value: "default" },
                  { label: "Chevron (ChevronUp/Down)", value: "chevron" },
                  { label: "Arrow (ArrowUp/Down)", value: "arrow" },
                  { label: "Circle (CircleArrowUp/Down)", value: "circle" },
                ]}
                description="Accepts any ReactNode — these are presets"
              />
            </>
          )}
        </ControlSection>

        {/* Goal */}
        <ControlSection title="Goal / Target" defaultOpen={false}>
          <Toggle label="Enable" value={showGoal} onChange={setShowGoal} />
          {showGoal && (
            <>
              <NumberInput label="goal.value" value={goalValue} onChange={setGoalValue} step={1000} />
              <TextInput label="goal.label" value={goalLabel} onChange={setGoalLabel} />
              <Toggle label="goal.showProgress" value={goalShowProgress} onChange={setGoalShowProgress} description="Show the progress bar" />
              <Toggle label="goal.showTarget" value={goalShowTarget} onChange={setGoalShowTarget} description='Show target value (e.g. "of $100K")' />
              <Toggle label="goal.showRemaining" value={goalShowRemaining} onChange={setGoalShowRemaining} description='Show remaining (e.g. "$21.6K left")' />
              <ColorInput label="goal.color" value={goalColor || "accent"} onChange={(v) => setGoalColor(v === "accent" ? "" : v)} description="Progress bar color" />
              <ColorInput label="goal.completeColor" value={goalCompleteColor || "emerald"} onChange={(v) => setGoalCompleteColor(v === "emerald" ? "" : v)} description="Color when goal is met" />
            </>
          )}
        </ControlSection>

        {/* Sparkline */}
        <ControlSection title="Sparkline">
          <Toggle label="Show sparkline" value={showSparkline} onChange={setShowSparkline} />
          {showSparkline && (
            <>
              <Select
                label="sparklineType"
                value={sparklineType}
                onChange={setSparklineType}
                options={[
                  { label: "line", value: "line" },
                  { label: "bar", value: "bar" },
                ]}
                description="Line chart or bar chart sparkline"
              />
              <Toggle
                label="sparklineInteractive"
                value={sparklineInteractive}
                onChange={setSparklineInteractive}
                description="Show value tooltips on hover"
              />
              <Toggle
                label="Previous period overlay"
                value={showPreviousPeriod}
                onChange={setShowPreviousPeriod}
                description="Faded line showing last period for comparison"
              />
            </>
          )}
        </ControlSection>

        {/* Null / Edge Values */}
        <ControlSection title="Null / Edge Values" defaultOpen={false}>
          <Toggle
            label="Simulate null value"
            value={simulateNull}
            onChange={setSimulateNull}
            description="Pass null to see how the card handles missing data"
          />
          <Select
            label="nullDisplay"
            value={nullDisplay}
            onChange={setNullDisplay}
            options={[
              { label: '— (dash)', value: "dash" },
              { label: "0 (formatted zero)", value: "zero" },
              { label: "(blank)", value: "blank" },
              { label: "N/A", value: "N/A" },
            ]}
            description="What to show when value is null, undefined, NaN, or Infinity"
          />
        </ControlSection>

        {/* Conditions */}
        <ControlSection title="Conditional Formatting" defaultOpen={false}>
          <Toggle label="Enable" value={showConditions} onChange={setShowConditions} />
          {showConditions && (
            <>
              {condRules.map((rule, idx) => (
                <div key={idx} className="mt-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                      Rule {idx + 1}
                    </p>
                    {condRules.length > 1 && (
                      <button
                        onClick={() => removeRule(idx)}
                        className="text-[10px] font-medium text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <Select
                    label="Type"
                    value={rule.type}
                    onChange={(v) => {
                      if (v === "simple") {
                        updateRule(idx, { type: "simple", rules: [] });
                      } else {
                        updateRule(idx, {
                          type: v as "and" | "or",
                          rules: rule.rules.length > 0 ? rule.rules : [
                            { operator: "above", value: 50000 },
                            { operator: "below", value: 90000 },
                          ],
                        });
                      }
                    }}
                    options={[
                      { label: "Simple", value: "simple" },
                      { label: "AND (all must match)", value: "and" },
                      { label: "OR (any must match)", value: "or" },
                    ]}
                  />

                  {rule.type === "simple" ? (
                    <>
                      <Select
                        label="Operator"
                        value={rule.when}
                        onChange={(v) => updateRule(idx, { when: v })}
                        options={[
                          { label: "above (>)", value: "above" },
                          { label: "at or above (>=)", value: "at_or_above" },
                          { label: "below (<)", value: "below" },
                          { label: "at or below (<=)", value: "at_or_below" },
                          { label: "equals (=)", value: "equals" },
                          { label: "not equals (!=)", value: "not_equals" },
                        ]}
                      />
                      <NumberInput label="Value" value={rule.value} onChange={(v) => updateRule(idx, { value: v })} step={1000} />
                    </>
                  ) : (
                    <>
                      {rule.rules.map((sr, si) => (
                        <div key={si} className="mt-1.5 flex items-end gap-1.5">
                          <div className="flex-1">
                            <Select
                              label={si === 0 ? "Conditions" : ""}
                              value={sr.operator}
                              onChange={(v) => updateSubRule(idx, si, { operator: v })}
                              options={[
                                { label: ">", value: "above" },
                                { label: ">=", value: "at_or_above" },
                                { label: "<", value: "below" },
                                { label: "<=", value: "at_or_below" },
                                { label: "=", value: "equals" },
                                { label: "!=", value: "not_equals" },
                              ]}
                            />
                          </div>
                          <div className="flex-1">
                            <NumberInput
                              label=""
                              value={sr.value}
                              onChange={(v) => updateSubRule(idx, si, { value: v })}
                              step={1000}
                            />
                          </div>
                          {rule.rules.length > 2 && (
                            <button
                              onClick={() => removeSubRule(idx, si)}
                              className="mb-2.5 text-[10px] text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addSubRule(idx)}
                        className="mt-1 text-[11px] font-medium text-[var(--accent)] hover:underline"
                      >
                        + Add condition
                      </button>
                    </>
                  )}

                  <ColorInput label="Color" value={rule.color} onChange={(v) => updateRule(idx, { color: v })} />
                </div>
              ))}
              <button
                onClick={addRule}
                className="mt-3 w-full rounded-lg border border-dashed border-[var(--card-border)] py-2 text-[11px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                + Add rule
              </button>
              <p className="mt-2 text-[10px] text-[var(--muted)] opacity-60">
                Rules are evaluated top to bottom — first match wins.
              </p>
            </>
          )}
        </ControlSection>

        {/* Context */}
        <ControlSection title="Context" defaultOpen={false}>
          <TextInput
            label="description"
            value={description}
            onChange={setDescription}
            placeholder="Shows as a hover popover on ?"
          />
          <TextInput
            label="subtitle"
            value={subtitle}
            onChange={setSubtitle}
            placeholder="Supports {{templates}}"
          />
          <TextInput
            label="footnote"
            value={footnote}
            onChange={setFootnote}
            placeholder="Small text below the card"
          />
        </ControlSection>

        {/* Interactivity */}
        <ControlSection title="Interactivity">
          <Toggle label="copyable" value={copyable} onChange={setCopyable} description="Click to copy raw value" />
          <Toggle label="animate" value={animate} onChange={setAnimate} description="Count-up animation on mount" />
          <Toggle label="highlight" value={highlight} onChange={setHighlight} description="Attention-drawing glow ring" />
          {highlight && (
            <ColorInput label="highlight color" value={highlightColor || "accent"} onChange={(v) => setHighlightColor(v === "accent" ? "" : v)} description="Ring color (default: accent)" />
          )}
          <Toggle label="drillDown" value={showDrillDown} onChange={setShowDrillDown} description="Hover link to view details" />
        </ControlSection>

        {/* Variant */}
        <ControlSection title="Theming" defaultOpen={false}>
          <Select
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { label: "default", value: "default" },
              { label: "outlined", value: "outlined" },
              { label: "ghost", value: "ghost" },
              { label: "elevated", value: "elevated" },
            ]}
          />
        </ControlSection>
      </div>
    </div>
  );
}
