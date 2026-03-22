/**
 * MetricUI MCP Server — Configuration & Theming Documentation
 */

// ---------------------------------------------------------------------------
// MetricConfig docs
// ---------------------------------------------------------------------------

export const METRIC_CONFIG_DOCS = `
# MetricProvider & MetricConfig

MetricProvider is the global configuration provider for all MetricUI components.
Wrap your app (or a subtree) to set defaults that every component inherits.

## Setup

\`\`\`tsx
import { MetricProvider } from "metricui";

function App() {
  return (
    <MetricProvider locale="en-US" currency="USD" animate dense={false}>
      {children}
    </MetricProvider>
  );
}
\`\`\`

## MetricConfig fields

| Field          | Type            | Default         | Description |
|----------------|-----------------|-----------------|-------------|
| locale         | string          | "en-US"         | BCP 47 locale string for number formatting |
| currency       | string          | "USD"           | ISO 4217 currency code |
| animate        | boolean         | true            | Global animation toggle for all charts and KpiCard count-up |
| motionConfig   | MotionConfig    | { mass: 1, tension: 170, friction: 26, clamp: true } | Spring physics config for charts |
| variant        | CardVariant     | "default"       | Default card variant across all components |
| theme          | string \\| ThemePreset | "indigo"  | Theme preset name or custom theme object. Sets accent color + chart palette in one prop. Built-in: indigo, emerald, rose, amber, cyan, violet, slate, orange. |
| colors         | string[]        | SERIES_COLORS   | Default series color palette for charts. Overridden by theme preset if set. |
| nullDisplay    | NullDisplay     | "dash"          | How null/undefined values are displayed in cards/tables |
| chartNullMode  | ChartNullMode   | "gap"           | How charts handle null/missing data points |
| dense          | boolean         | false           | Global compact/dense layout toggle |
| texture        | boolean         | true            | Enable/disable noise texture globally. Sets \`[data-texture]\` attribute. |
| emptyState     | { message?, icon? } | {}          | Default empty state template |
| errorState     | { message? }    | {}              | Default error state template |

## Nesting

MetricProvider supports nesting. Child providers merge with their parent — only
the fields you specify are overridden, everything else inherits.

\`\`\`tsx
<MetricProvider locale="en-US" currency="USD">
  {/* All components use USD */}
  <MetricProvider currency="EUR">
    {/* These components use EUR, still en-US locale */}
  </MetricProvider>
</MetricProvider>
\`\`\`

## Hooks

- \`useMetricConfig()\` — returns the full resolved MetricConfig
- \`useLocale()\` — returns { locale, currency } for the format engine

## How components consume config

Every component reads config via \`useMetricConfig()\` and uses it as fallback:

- \`variant ?? config.variant\`
- \`animate ?? config.animate\`
- \`dense ?? config.dense\`
- \`nullDisplay ?? config.nullDisplay\`
- \`chartNullMode ?? config.chartNullMode\`
- Colors: \`colors ?? config.colors\`
- Motion: \`config.motionConfig\` (controls chart animation physics via springDuration())

## DEFAULT_METRIC_CONFIG

The fully-resolved defaults object is exported as \`DEFAULT_METRIC_CONFIG\`:

\`\`\`ts
import { DEFAULT_METRIC_CONFIG } from "metricui";
\`\`\`

## SERIES_COLORS

The default chart color palette (8 colors, colorblind-safe):

\`\`\`ts
const SERIES_COLORS = [
  "#6366F1", // indigo
  "#06B6D4", // cyan
  "#F59E0B", // amber
  "#EC4899", // pink
  "#10B981", // emerald
  "#F97316", // orange
  "#8B5CF6", // violet
  "#14B8A6", // teal
];
\`\`\`

## Theme Presets

One prop transforms your entire dashboard's look. Theme presets set the accent color (light + dark mode) and the 8-color chart series palette:

\`\`\`tsx
<MetricProvider theme="emerald">
  {/* Every card, chart, and component picks up the emerald palette */}
</MetricProvider>
\`\`\`

### Built-in presets

| Preset   | Accent (light) | Accent (dark) | Vibe                    |
|----------|----------------|---------------|-------------------------|
| indigo   | #4F46E5        | #818CF8       | Default, professional   |
| emerald  | #059669        | #34D399       | Fresh, growth-oriented  |
| rose     | #E11D48        | #FB7185       | Bold, attention-grabbing|
| amber    | #D97706        | #FBBF24       | Warm, inviting          |
| cyan     | #0891B2        | #22D3EE       | Clean, technical        |
| violet   | #7C3AED        | #A78BFA       | Creative, modern        |
| slate    | #475569        | #94A3B8       | Neutral, understated    |
| orange   | #EA580C        | #FB923C       | Energetic, action       |

Each preset includes a colorblind-safe 8-color chart palette that harmonizes with the accent.

### Custom themes

Create your own brand theme:

\`\`\`tsx
import type { ThemePreset } from "metricui";

const brandTheme: ThemePreset = {
  name: "Brand",
  accent: "#FF6B00",
  accentDark: "#FF9A45",
  colors: ["#FF6B00", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4", "#14B8A6"],
};

<MetricProvider theme={brandTheme}>
\`\`\`
`;

// ---------------------------------------------------------------------------
// Format engine docs
// ---------------------------------------------------------------------------

export const FORMAT_ENGINE_DOCS = `
# Format Engine

MetricUI includes a powerful format engine that every component uses under the hood.
You can use it in two ways:

## 1. Shorthand strings

Pass a string to any \`format\` prop:

| Shorthand    | Description                                  | Example output |
|--------------|----------------------------------------------|---------------|
| "number"     | Auto-compact with K/M/B/T suffixes           | "1.2K", "3.5M" |
| "compact"    | Same as "number" with compact: true          | "1.2K", "3.5M" |
| "currency"   | Currency with compact suffixes               | "$1.2K", "$3.5M" |
| "percent"    | Percentage with 1 decimal                    | "12.5%" |
| "duration"   | Human-readable duration from seconds         | "5m 30s" |
| "custom"     | Base format — use prefix/suffix for anything | "12.5 items" |

## 2. FormatConfig objects

For fine control, pass an object:

\`\`\`ts
// Currency in EUR with 2 decimals, no compacting
format={{ style: "currency", currency: "EUR", compact: false, precision: 2 }}

// Percent where input is decimal (0.12 = 12%)
format={{ style: "percent", percentInput: "decimal" }}

// Duration from milliseconds, clock style
format={{ style: "duration", durationInput: "milliseconds", durationStyle: "clock" }}

// Compact to millions only
format={{ style: "number", compact: "millions" }}

// Custom prefix/suffix
format={{ style: "number", prefix: "~", suffix: " users", compact: false }}
\`\`\`

## 3. The fmt() helper

Build FormatConfig with less boilerplate:

\`\`\`ts
import { fmt } from "metricui";

format={fmt("currency", { precision: 2 })}
format={fmt("compact")}
format={fmt("percent", { percentInput: "decimal" })}
\`\`\`

## Compact mode options

| Value        | Behavior                                      |
|--------------|-----------------------------------------------|
| true / "auto"| Auto-pick K/M/B/T based on magnitude         |
| "thousands"  | Always divide by 1,000 and append K           |
| "millions"   | Always divide by 1,000,000 and append M       |
| "billions"   | Always divide by 1,000,000,000 and append B   |
| "trillions"  | Always divide by 1,000,000,000,000 and append T|
| false        | No compacting, show full number                |

## Duration styles

| Style    | Example output                |
|----------|-------------------------------|
| "compact"| "5m 30s", "2h 15m"           |
| "long"   | "5 minutes 30 seconds"       |
| "clock"  | "5:30", "2:15:30"            |
| "narrow" | "5.5m", "2.3h"               |

## Duration precision

Controls the smallest unit shown:

| Precision     | Example                    |
|---------------|----------------------------|
| "milliseconds"| "5m 30s 250ms"            |
| "seconds"     | "5m 30s" (default)        |
| "minutes"     | "2h 30m"                  |
| "hours"       | "3d 4h"                   |
| "days"        | "2w 3d"                   |
| "weeks"       | "1mo 2w"                  |
| "months"      | "14mo"                    |

## Conditional formatting

Use the \`conditions\` prop on KpiCard to color values based on thresholds:

\`\`\`tsx
conditions={[
  { when: "above", value: 100, color: "emerald" },
  { when: "between", min: 50, max: 100, color: "amber" },
  { when: "below", value: 50, color: "red" },
]}
\`\`\`

Supported operators: "above", "below", "between", "equals", "not_equals", "at_or_above", "at_or_below"

Named colors: "emerald"/"green", "red", "amber"/"yellow", "blue", "indigo", "purple", "pink", "cyan"
Custom CSS colors: "#ff6b6b", "rgb(255, 107, 107)", "hsl(0, 100%, 71%)"

Compound conditions with AND/OR:

\`\`\`tsx
conditions={[
  {
    when: "and",
    rules: [
      { operator: "above", value: 50 },
      { operator: "below", value: 100 },
    ],
    color: "amber",
  },
]}
\`\`\`

## Locale integration

The format engine respects MetricProvider's locale and currency settings.
Individual format configs can override with their own locale/currency fields.
`;

// ---------------------------------------------------------------------------
// Theming docs
// ---------------------------------------------------------------------------

export const THEMING_DOCS = `
# Theming

MetricUI uses CSS custom properties (variables) for theming, making it compatible
with any CSS framework or design system.

## Required CSS variables

Set these on your root element (or any parent container):

\`\`\`css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --card-glow: #f8fafc;
  --muted: #64748b;
  --accent: #6366f1;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card-bg: #1e293b;
  --card-border: #334155;
  --card-glow: #1e293b;
  --muted: #94a3b8;
  --accent: #818cf8;
}
\`\`\`

## Variable descriptions

| Variable       | Purpose                                        |
|----------------|------------------------------------------------|
| --background   | Page background color                          |
| --foreground   | Primary text color                             |
| --card-bg      | Card/container background                      |
| --card-border  | Card border and divider color                  |
| --card-glow    | Hover/ghost variant background tint            |
| --muted        | Secondary/muted text color                     |
| --accent       | Primary accent color (links, focus rings, etc) |
| --font-mono    | Monospace font family for values               |

## Card variants (CSS-variable-driven)

Variants are implemented via CSS custom properties set by \`[data-variant="..."]\` attribute
selectors. Components set \`data-variant\` on their root element; MetricProvider sets it on
a wrapper \`<div className="contents">\` so all children inherit.

### Variant CSS variables

| CSS Variable         | Purpose                        | Default value             |
|----------------------|--------------------------------|---------------------------|
| --mu-card-bg         | Card background                | var(--card-bg)            |
| --mu-card-border     | Border color                   | var(--card-border)        |
| --mu-card-border-w   | Border width                   | 1px                       |
| --mu-card-shadow     | Box shadow                     | none                      |
| --mu-card-radius     | Border radius                  | 1rem                      |
| --mu-cell-bg         | StatGroup cell background      | var(--mu-card-bg)         |
| --mu-hover-shadow    | Hover shadow on cards/charts   | light: 0 10px 15px -3px rgba(0,0,0,0.04), dark: rgba(0,0,0,0.3) |
| --mu-hover-border    | Hover border color             | light: #d1d5db, dark: #374151 |

### Semantic Color Variables

Trend colors (comparisons) and condition colors now use semantic CSS variables, making them
fully customizable via CSS overrides:

| CSS Variable          | Purpose                  | Light default | Dark default |
|-----------------------|--------------------------|---------------|--------------|
| --mu-color-positive   | Positive trend, success  | #059669       | #34d399      |
| --mu-color-negative   | Negative trend, error    | #ef4444       | #f87171      |
| --mu-color-warning    | Warning conditions       | #d97706       | #fbbf24      |
| --mu-color-info       | Info conditions          | #2563eb       | #60a5fa      |

### Texture Control

| CSS Variable          | Purpose                  | Default       |
|-----------------------|--------------------------|---------------|
| --mu-texture-opacity  | Noise texture opacity    | 0.3           |

Set \`--mu-texture-opacity: 0\` to hide the noise texture via CSS, or use the \`texture\` prop
on MetricProvider (\`texture={false}\`) to disable it globally. When disabled, the
\`[data-texture="false"]\` attribute hides the \`noise-texture::before\` pseudo-element.

### Shared Style Constants

\`CARD_CLASSES\` and \`HOVER_CLASSES\` are exported from \`metricui\` for internal use but are
available if you need to apply the same card shell styling to custom components.

### Built-in variant personalities

| Variant   | Background                    | Border                   | Extra                                    |
|-----------|-------------------------------|--------------------------|------------------------------------------|
| default   | var(--card-bg)                | 1px var(--card-border)   | clean bordered card                      |
| outlined  | transparent                   | 2px var(--card-border)   | inset shadow, 0.75rem radius             |
| ghost     | color-mix accent-tinted bg    | none (0px)               | no border                                |
| elevated  | var(--card-bg)                | transparent              | multi-layer shadow, 1.25rem radius       |

### Custom variants

\`CardVariant\` accepts any string: \`"default" | "outlined" | "ghost" | "elevated" | (string & {})\`.
To create a custom variant, define CSS variables under a \`[data-variant="..."]\` selector:

\`\`\`css
[data-variant="glass"] {
  --mu-card-bg: rgba(255,255,255,0.08);
  --mu-card-border: rgba(255,255,255,0.15);
  --mu-card-border-w: 1px;
  --mu-card-shadow: 0 8px 32px rgba(0,0,0,0.1);
  --mu-card-radius: 1rem;
  backdrop-filter: blur(12px);
}
\`\`\`

Then use it on any component:

\`\`\`tsx
<KpiCard variant="glass" title="Revenue" value={42000} format="currency" />
<MetricProvider variant="glass">{children}</MetricProvider>
\`\`\`

## Dense mode (CSS-variable-driven)

Dense mode is implemented via CSS variables set by \`[data-dense="true"]\` attribute selectors.
MetricProvider renders a wrapper \`<div className="contents">\` with \`data-dense\` so all
children inherit.

### Dense CSS variables

| CSS Variable           | Normal         | Dense          |
|------------------------|----------------|----------------|
| --mu-padding           | 1.25rem        | 0.625rem       |
| --mu-gap               | 1rem           | 0.5rem         |
| --mu-title-size        | 0.75rem        | 0.625rem       |
| --mu-value-size        | 1.875rem       | 1.25rem        |
| --mu-value-size-bare   | 1.5rem         | 1.125rem       |
| --mu-table-py          | 0.75rem        | 0.375rem       |
| --mu-table-px          | 1.25rem        | 0.75rem        |
| Chart height           | 300px          | 200px          |

Chart margins in dense mode are centralized via the \`useDenseValues()\` hook.

## Dark mode

MetricUI detects dark mode via the ThemeProvider (reads the \`dark\` class on the
document). All components automatically adapt using the CSS variables above.

## Customizing chart colors

Override the default series palette via MetricProvider:

\`\`\`tsx
<MetricProvider colors={["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]}>
  {children}
</MetricProvider>
\`\`\`

Or per-component via the \`colors\` prop on any chart.

## The noise-texture class

Cards and chart containers apply a \`noise-texture\` CSS class for a subtle
grain overlay. Control opacity with \`--mu-texture-opacity\` (default: 0.3, set to 0 to hide).
Disable globally via \`<MetricProvider texture={false}>\`, which sets \`[data-texture="false"]\`
and hides the \`noise-texture::before\` pseudo-element.

## Motion / animation

Animation timing is controlled by MotionConfig (spring physics):

\`\`\`tsx
import { DEFAULT_MOTION_CONFIG } from "metricui";

// Slower, bouncier animations
<MetricProvider motionConfig={{ mass: 1.5, tension: 120, friction: 20, clamp: false }}>

// Faster, snappier animations
<MetricProvider motionConfig={{ mass: 0.8, tension: 250, friction: 30, clamp: true }}>

// Disable all animation
<MetricProvider animate={false}>
\`\`\`
`;
