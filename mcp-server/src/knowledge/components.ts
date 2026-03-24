/**
 * MetricUI MCP Server — Component Knowledge Base
 *
 * Auto-generated from source. Every prop, default, and description
 * is copied directly from the component source files.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface PropDef {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  deprecated?: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
}

export interface ComponentDef {
  name: string;
  importName: string;
  category: "chart" | "card" | "table" | "ui";
  tier: "free";
  description: string;
  longDescription: string;
  props: PropDef[];
  dataShape?: string;
  minimalExample: string;
  examples: ComponentExample[];
  relatedComponents: string[];
  configFields: string[];
  notes: string[];
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

export const COMPONENTS: ComponentDef[] = [
  // =========================================================================
  // PeriodSelector
  // =========================================================================
  {
    name: "PeriodSelector",
    importName: "PeriodSelector",
    category: "ui",
    tier: "free",
    description: "A date-range picker with preset periods, custom ranges, and comparison toggle.",
    longDescription:
      "PeriodSelector is MetricUI's first filter component. It shows a dropdown with preset time periods (7d, 30d, quarter, etc.) and optional custom date-range inputs. When used with FilterProvider, it writes to shared context so any component can read the active period via useMetricFilters(). It also supports standalone usage via onChange. The comparison toggle cycles through none/previous/year-over-year and auto-computes the comparison date range. Uses forwardRef.",
    props: [
      { name: "presets", type: "PeriodPreset[]", required: false, default: '["7d","30d","90d","month","quarter","ytd"]', description: "Which preset periods to show in the dropdown." },
      { name: "allowCustom", type: "boolean", required: false, default: "true", description: "Show the custom date-range inputs below presets." },
      { name: "comparison", type: "boolean", required: false, default: "false", description: "Show the comparison toggle button next to the selector." },
      { name: "comparisonOptions", type: "ComparisonMode[]", required: false, default: '["previous","year-over-year"]', description: "Which comparison modes to cycle through when comparison is enabled." },
      { name: "onChange", type: "(period: DateRange, preset: PeriodPreset | null) => void", required: false, description: "Standalone callback fired when a period is selected. Works without FilterProvider." },
      { name: "onComparisonChange", type: "(mode: ComparisonMode, period: DateRange | null) => void", required: false, description: "Standalone callback for comparison mode changes." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact mode with reduced padding and font sizes. Falls back to MetricProvider config." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
    ],
    dataShape: `// PeriodSelector reads/writes these types via FilterContext
interface DateRange { start: Date; end: Date; }
type PeriodPreset = "7d" | "14d" | "30d" | "90d" | "month" | "quarter" | "ytd" | "year" | "all";
type ComparisonMode = "previous" | "year-over-year" | "none";`,
    minimalExample: `<FilterProvider>
  <PeriodSelector />
</FilterProvider>`,
    examples: [
      {
        title: "PeriodSelector with comparison",
        description: "Shows the selector with comparison toggle enabled and a default preset.",
        code: `<FilterProvider defaultPreset="30d">
  <PeriodSelector comparison />
</FilterProvider>`,
      },
      {
        title: "Standalone PeriodSelector with onChange",
        description: "Use without FilterProvider for simple use cases.",
        code: `<PeriodSelector
  presets={["7d", "30d", "90d"]}
  onChange={(period, preset) => {
    fetchData(period.start, period.end);
  }}
/>`,
      },
      {
        title: "Reading active period from context",
        description: "Use useMetricFilters() to read the selected period in any child component.",
        code: `function MyChart() {
  const filters = useMetricFilters();
  if (!filters?.period) return <p>Select a period</p>;
  const { start, end } = filters.period;
  // Fetch data for this range
  return <AreaChart data={fetchedData} />;
}`,
      },
    ],
    relatedComponents: ["FilterProvider", "KpiCard", "AreaChart", "MetricProvider"],
    configFields: ["dense"],
    notes: [
      "PeriodSelector is UI only — it tells you what the user selected, but does not filter data. You bring the data.",
      "Without FilterProvider, use onChange for standalone mode. Context is optional.",
      "Comparison periods are auto-computed. 'previous' shifts backward by the range duration. 'year-over-year' shifts back one year.",
      "Uses forwardRef. Passes through id, data-testid, and className.",
      "Dense mode inherits from MetricProvider or can be set per-component.",
    ],
  },
  // =========================================================================
  // SegmentToggle
  // =========================================================================
  {
    name: "SegmentToggle",
    importName: "SegmentToggle",
    category: "ui",
    tier: "free",
    description: "A pill-style toggle for switching between segments with single/multi-select, icons, badges, and FilterContext integration.",
    longDescription:
      "SegmentToggle is a segmented control for switching between views, granularities, or filter dimensions. It supports string[] shorthand or full SegmentOption[] with icons, badge counts (formatted via the format engine), and per-segment color accents. In single-select mode, a sliding indicator animates between segments. In multi-select mode, at least one segment must always remain selected. When used with FilterProvider via the `field` prop, it reads/writes to shared context dimensions. Uses forwardRef.",
    props: [
      { name: "options", type: "SegmentOption[] | string[]", required: true, description: "Segment options. Pass string[] as shorthand — each string becomes { value: str, label: str }." },
      { name: "value", type: "string | string[]", required: false, description: "Controlled active segment(s)." },
      { name: "defaultValue", type: "string | string[]", required: false, default: "first option", description: "Default value for uncontrolled mode." },
      { name: "onChange", type: "(value: string | string[]) => void", required: false, description: "Change handler. Receives string in single mode, string[] in multiple mode." },
      { name: "multiple", type: "boolean", required: false, default: "false", description: "Allow multiple selections. At least one must always remain selected." },
      { name: "field", type: "string", required: false, description: "FilterContext field name. When set, reads/writes to FilterContext dimensions." },
      { name: "orientation", type: '"horizontal" | "vertical"', required: false, default: '"horizontal"', description: "Layout orientation." },
      { name: "size", type: '"sm" | "md" | "lg"', required: false, default: '"md"', description: "Size variant." },
      { name: "fullWidth", type: "boolean", required: false, default: "false", description: "Stretch segments to fill container." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact mode. Falls back to MetricProvider config." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "classNames", type: "{ root?, option?, indicator?, badge? }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
    ],
    dataShape: `interface SegmentOption {
  value: string;       // Unique value
  label?: string;      // Display label (defaults to value)
  icon?: ReactNode;    // Icon before label
  badge?: number;      // Badge count (formatted via format engine)
  badgeFormat?: FormatOption;  // Badge format option
  color?: string;      // Active accent color
}`,
    minimalExample: `<SegmentToggle options={["Daily", "Weekly", "Monthly"]} />`,
    examples: [
      {
        title: "SegmentToggle with icons and badges",
        description: "Segments with icons and formatted badge counts.",
        code: `<SegmentToggle options={[
  { value: "active", label: "Active", badge: 1234, icon: <Users className="h-3.5 w-3.5" /> },
  { value: "churned", label: "Churned", badge: 56, icon: <UserMinus className="h-3.5 w-3.5" /> },
]} />`,
      },
      {
        title: "Multi-select SegmentToggle",
        description: "Allow selecting multiple segments at once.",
        code: `<SegmentToggle
  options={["Frontend", "Backend", "Mobile"]}
  multiple
  defaultValue={["Frontend"]}
/>`,
      },
      {
        title: "SegmentToggle connected to FilterContext",
        description: "Use the field prop to read/write to FilterContext dimensions.",
        code: `<FilterProvider>
  <SegmentToggle options={["Issues", "PRs"]} field="view" />
  {/* Other components read filters.dimensions.view */}
</FilterProvider>`,
      },
    ],
    relatedComponents: ["PeriodSelector", "FilterProvider", "MetricProvider"],
    configFields: ["dense"],
    notes: [
      "SegmentToggle is UI only — it captures the selection, but does not filter data. You bring the data.",
      "Without FilterProvider, use onChange for standalone mode. Context is optional.",
      "In single-select mode, a sliding indicator animates between segments using the motion system.",
      "In multi-select mode, at least one segment must always remain selected.",
      "Badge counts are formatted through the format engine (compact by default).",
      "Uses forwardRef. Passes through id, data-testid, className, and classNames.",
    ],
  },
  // =========================================================================
  // DropdownFilter
  // =========================================================================
  {
    name: "DropdownFilter",
    importName: "DropdownFilter",
    category: "ui",
    tier: "free",
    description: "A single or multi-select dropdown for dimension filtering with search, grouped options, count badges, and FilterContext integration.",
    longDescription:
      "DropdownFilter is a versatile dropdown selector for filtering by dimensions like region, plan, status, etc. It supports single and multi-select modes, search filtering (auto-enabled when >8 options), grouped options with section headers, count badges, and an 'All' option to clear selections. When used with FilterProvider via the `field` prop, it reads/writes to shared context dimensions. Uses forwardRef.",
    props: [
      { name: "label", type: "string", required: true, description: "Label shown on the trigger button." },
      { name: "options", type: "DropdownOption[] | string[]", required: true, description: "Options to display. Pass string[] as shorthand — each string becomes { value: str, label: str }." },
      { name: "value", type: "string | string[]", required: false, description: "Controlled selected value(s)." },
      { name: "defaultValue", type: "string | string[]", required: false, description: "Default value for uncontrolled mode." },
      { name: "onChange", type: "(value: string | string[]) => void", required: false, description: "Change handler. Receives string in single mode, string[] in multiple mode." },
      { name: "multiple", type: "boolean", required: false, default: "false", description: "Allow multiple selections." },
      { name: "searchable", type: "boolean", required: false, default: "auto (true when > 8 options)", description: "Show search input inside dropdown." },
      { name: "searchPlaceholder", type: "string", required: false, default: '"Search..."', description: "Placeholder text for search input." },
      { name: "field", type: "string", required: false, description: "FilterContext field name. When set, reads/writes to FilterContext dimensions." },
      { name: "showAll", type: "boolean", required: false, default: "true (in multiple mode)", description: "Show 'All' option that clears selection." },
      { name: "allLabel", type: "string", required: false, default: '"All"', description: "Label for the All option." },
      { name: "maxHeight", type: "number", required: false, default: "280", description: "Max height of dropdown in px." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact mode. Falls back to MetricProvider config." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "classNames", type: "{ root?, trigger?, dropdown?, option?, search? }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
    ],
    dataShape: `interface DropdownOption {
  value: string;       // Unique value
  label?: string;      // Display label (defaults to value)
  count?: number;      // Optional count badge
  icon?: ReactNode;    // Icon rendered before label
  group?: string;      // Group this option belongs to
}`,
    minimalExample: `<DropdownFilter label="Region" options={["US", "EU", "APAC"]} />`,
    examples: [
      {
        title: "DropdownFilter with count badges",
        description: "Multi-select dropdown with count badges on each option.",
        code: `<DropdownFilter
  label="Plan"
  options={[
    { value: "free", label: "Free", count: 8421 },
    { value: "pro", label: "Pro", count: 1089 },
    { value: "enterprise", label: "Enterprise", count: 312 },
  ]}
  multiple
  showAll
/>`,
      },
      {
        title: "Searchable DropdownFilter with groups",
        description: "Grouped options with search for long lists.",
        code: `<DropdownFilter
  label="Region"
  options={[
    { value: "us", label: "United States", group: "Americas" },
    { value: "ca", label: "Canada", group: "Americas" },
    { value: "gb", label: "United Kingdom", group: "Europe" },
    { value: "de", label: "Germany", group: "Europe" },
    { value: "jp", label: "Japan", group: "Asia-Pacific" },
  ]}
  multiple
  searchable
/>`,
      },
      {
        title: "DropdownFilter connected to FilterContext",
        description: "Use the field prop to read/write to FilterContext dimensions.",
        code: `<FilterProvider>
  <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
  {/* Other components read filters.dimensions.region */}
</FilterProvider>`,
      },
    ],
    relatedComponents: ["SegmentToggle", "PeriodSelector", "FilterProvider", "MetricProvider"],
    configFields: ["dense"],
    notes: [
      "DropdownFilter is UI only — it captures the selection, but does not filter data. You bring the data.",
      "Without FilterProvider, use onChange for standalone mode. Context is optional.",
      "Search is auto-enabled when there are more than 8 options. Override with searchable prop.",
      "The 'All' option is shown by default in multiple mode. It clears all selections.",
      "Grouped options render with section headers. Set the group property on each DropdownOption.",
      "Uses forwardRef. Passes through id, data-testid, className, and classNames.",
    ],
  },
  // =========================================================================
  // FilterTags
  // =========================================================================
  {
    name: "FilterTags",
    importName: "FilterTags",
    category: "ui",
    tier: "free",
    description: "Context-driven filter chips that automatically display active filters from FilterProvider.",
    longDescription:
      "FilterTags reads from FilterContext and renders removable chips for the active period, comparison mode, and dimension filters. It requires no manual wiring — just place it inside a FilterProvider. Users can dismiss individual filters or clear all at once. Supports maxVisible overflow, custom labels, exclude/include filtering, and custom formatters. Uses forwardRef.",
    props: [
      { name: "exclude", type: "string[]", required: false, description: "Fields to exclude from display. Use '_period' and '_comparison' for built-in tags." },
      { name: "include", type: "string[]", required: false, description: "Whitelist — if set, only these fields show." },
      { name: "labels", type: "Record<string, string>", required: false, description: "Custom labels for dimension fields. Default: capitalized field name." },
      { name: "formatPeriod", type: "(range: DateRange, preset: PeriodPreset | null) => string", required: false, description: "Custom period formatter." },
      { name: "formatDimension", type: "(field: string, values: string[]) => string", required: false, description: "Custom dimension value formatter." },
      { name: "dismissible", type: "boolean", required: false, default: "true", description: "Show dismiss buttons on each chip." },
      { name: "clearAll", type: "boolean", required: false, default: "true", description: "Show 'Clear all' button when multiple filters active." },
      { name: "clearAllLabel", type: "string", required: false, default: '"Clear all"', description: "Label for the clear all button." },
      { name: "onClear", type: "(field: string) => void", required: false, description: "Callback when a specific filter is cleared." },
      { name: "onClearAll", type: "() => void", required: false, description: "Callback when all filters are cleared." },
      { name: "maxVisible", type: "number", required: false, default: "0", description: "Max visible chips before collapsing. 0 = no limit. Shows '+N more' button." },
      { name: "showPeriod", type: "boolean", required: false, default: "true", description: "Show the period filter as a tag." },
      { name: "showComparison", type: "boolean", required: false, default: "true", description: "Show the comparison mode as a tag." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact mode. Falls back to MetricProvider config." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "classNames", type: "{ root?, chip?, clearAll? }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
    ],
    minimalExample: `<FilterProvider defaultPreset="30d">
  <FilterTags />
</FilterProvider>`,
    examples: [
      {
        title: "FilterTags with full filter setup",
        description: "FilterTags automatically shows chips for active filters from PeriodSelector and DropdownFilter.",
        code: `<FilterProvider defaultPreset="30d">
  <PeriodSelector comparison />
  <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
  <FilterTags />
</FilterProvider>`,
      },
      {
        title: "FilterTags with custom labels and maxVisible",
        description: "Override field labels and collapse overflow.",
        code: `<FilterTags
  labels={{ region: "Market", plan: "Tier" }}
  maxVisible={3}
/>`,
      },
      {
        title: "FilterTags with exclude",
        description: "Hide period and specific dimension tags.",
        code: `<FilterTags exclude={["_period", "plan"]} />`,
      },
    ],
    relatedComponents: ["FilterProvider", "PeriodSelector", "DropdownFilter", "SegmentToggle"],
    configFields: ["dense"],
    notes: [
      "FilterTags reads from FilterContext automatically — no manual wiring needed.",
      "It renders nothing when no filters are active.",
      "Period and comparison tags use special keys '_period' and '_comparison' for exclude/include.",
      "Dismiss buttons call clearDimension() / setPeriod() / setComparisonMode() on the FilterContext.",
      "Clear all calls filterContext.clearAll() which resets to the FilterProvider defaults.",
      "maxVisible collapses overflow into a '+N more' button.",
      "Uses forwardRef. Passes through id, data-testid, className, and classNames.",
    ],
  },
  // =========================================================================
  // KpiCard
  // =========================================================================
  {
    name: "KpiCard",
    importName: "KpiCard",
    category: "card",
    tier: "free",
    description: "A metric card showing a single KPI with optional comparison, sparkline, goal progress, and conditional formatting.",
    longDescription:
      "KpiCard is the core building block of MetricUI dashboards. It displays a single key performance indicator with rich features: comparison badges (single or multiple), inline sparklines, goal progress bars, conditional color formatting, copy-to-clipboard, drill-down links, dynamic string templates, and full data-state handling (loading/empty/error/stale). It uses forwardRef and supports all standard HTML div attributes via id and data-testid.",
    props: [
      { name: "title", type: "DynamicString", required: true, description: "Card title. Can be a static string or a template function receiving MetricContext." },
      { name: "value", type: "number | string | null | undefined", required: true, description: "The metric value. Pass a number for formatted display. Pass a string (e.g. '6:42 AM', 'Operational') for non-numeric KPIs — displayed as-is, no formatting applied. Pass null or undefined for null-state display." },
      { name: "format", type: "FormatOption", required: false, description: "How to format numeric values. Shorthand: 'currency', 'percent', 'compact', 'number', 'duration'. Or FormatConfig object: { style, suffix?, prefix?, precision?, compact?, currency?, locale? }. For custom units: { style: 'number', suffix: '°F', compact: false }. Ignored when value is a string." },
      { name: "comparison", type: "ComparisonConfig | ComparisonConfig[]", required: false, description: "Single comparison or array of comparisons. Each comparison computes change from a previous value and shows a trend badge." },
      { name: "goal", type: "GoalConfig", required: false, description: "Goal/target configuration. Shows a progress bar below the value." },
      { name: "conditions", type: "Condition[]", required: false, description: "Conditional formatting rules. First matching condition colors the value text." },
      { name: "sparklineData", type: "number[]", required: false, description: "Sparkline data points.", deprecated: "Use `sparkline` config instead" },
      { name: "sparklinePreviousPeriod", type: "number[]", required: false, description: "Previous period sparkline overlay.", deprecated: "Use `sparkline` config instead" },
      { name: "sparklineType", type: "SparklineType", required: false, description: "Sparkline visualization type.", deprecated: "Use `sparkline` config instead" },
      { name: "sparklineInteractive", type: "boolean", required: false, description: "Enable sparkline hover tooltip.", deprecated: "Use `sparkline` config instead" },
      { name: "sparkline", type: "{ data: number[]; previousPeriod?: number[]; type?: SparklineType; interactive?: boolean }", required: false, description: "Sparkline configuration object — alternative to individual sparkline* props." },
      { name: "icon", type: "React.ReactNode", required: false, description: "Icon rendered next to the title." },
      { name: "description", type: "DynamicReactNode", required: false, description: "Description content shown in a popover next to the title." },
      { name: "subtitle", type: "DynamicString", required: false, description: "Subtitle shown below the title." },
      { name: "footnote", type: "DynamicString", required: false, description: "Small footnote at the bottom of the card." },
      { name: "comparisonLabel", type: "DynamicString", required: false, description: "Label shown next to the primary comparison badge (e.g. 'vs last month')." },
      { name: "tooltip", type: "TooltipConfig", required: false, description: "Custom tooltip configuration for the value." },
      { name: "onClick", type: "() => void", required: false, description: "Click handler for the entire card." },
      { name: "href", type: "string", required: false, description: "Turns the card into a link (<a> tag)." },
      { name: "drillDown", type: "boolean | DrillDownConfig | ((event: { value: number | string; title: string }) => React.ReactNode)", required: false, description: "Enable drill-down on card click. `true` auto-generates a detail panel. Pass a DrillDownConfig for the legacy hover-corner link. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper for boolean/function modes." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
      { name: "copyable", type: "boolean", required: false, description: "Show a copy button that copies the raw formatted value to clipboard." },
      { name: "animate", type: "boolean | AnimationConfig", required: false, description: "Enable count-up animation. `true` enables default, or pass AnimationConfig for fine control. Falls back to config.animate." },
      { name: "highlight", type: "boolean | string", required: false, description: "Attention ring around the card. `true` uses accent color, or pass a CSS color string." },
      { name: "trendIcon", type: "TrendIconConfig", required: false, description: "Custom trend icons for comparison badges (up/down/neutral)." },
      { name: "nullDisplay", type: "NullDisplay", required: false, default: '"dash"', description: 'What to show when value is null/undefined/NaN/Infinity. Falls back to config.nullDisplay.' },
      { name: "titlePosition", type: "TitlePosition", required: false, default: '"top"', description: "Where the title appears relative to the value: 'top', 'bottom', or 'hidden'." },
      { name: "titleAlign", type: "TitleAlign", required: false, default: '"left"', description: "Horizontal alignment for card content: 'left', 'center', or 'right'." },
      { name: "loading", type: "boolean", required: false, description: "Show a skeleton placeholder." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state configuration with message, icon, and action." },
      { name: "error", type: "ErrorState", required: false, description: "Error state configuration with message and retry callback." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator shown in the top-right corner." },
      { name: "state", type: "{ loading?: boolean; empty?: EmptyState; error?: ErrorState; stale?: StaleState }", required: false, description: "Grouped data state configuration — alternative to individual loading/empty/error/stale props." },
      { name: "variant", type: "CardVariant", required: false, description: "Visual variant: 'default', 'outlined', 'ghost', 'elevated', or any custom string. CSS-variable-driven via [data-variant]. Falls back to config.variant." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact/dense layout with reduced padding. Falls back to config.dense." },
      { name: "accent", type: "string", required: false, description: "Override border color with a custom accent CSS color." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "classNames", type: "{ root?: string; title?: string; value?: string; comparison?: string; sparkline?: string; goal?: string; footnote?: string }", required: false, description: "Sub-element class name overrides for granular styling." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
      { name: "onCopy", type: "(value: string) => void", required: false, description: "Callback when value is copied (requires copyable)." },
    ],
    dataShape: `// KpiCard accepts a numeric or string value
interface KpiCardData {
  value: number | string | null | undefined;
  // Optional comparison previous value(s)
  comparison?: { value: number; label?: string };
  // Optional sparkline data
  sparklineData?: number[];
}`,
    minimalExample: `<KpiCard
  title="Revenue"
  value={142300}
  format="currency"
/>`,
    examples: [
      {
        title: "KPI with comparison and sparkline",
        description: "Shows a KPI card with period-over-period comparison and an inline sparkline.",
        code: `<KpiCard
  title="Monthly Revenue"
  value={142300}
  format="currency"
  comparison={{ value: 128500, label: "vs last month" }}
  sparkline={{
    data: [98, 105, 110, 108, 120, 135, 142],
    type: "line",
    interactive: true,
  }}
/>`,
      },
      {
        title: "KPI with goal progress and conditional formatting",
        description: "Shows a goal progress bar and conditionally colors the value based on thresholds.",
        code: `<KpiCard
  title="Conversion Rate"
  value={4.2}
  format="percent"
  goal={{ value: 5, showTarget: true, showRemaining: true }}
  conditions={[
    { when: "above", value: 4, color: "emerald" },
    { when: "between", min: 2, max: 4, color: "amber" },
    { when: "below", value: 2, color: "red" },
  ]}
/>`,
      },
      {
        title: "KPI with multiple comparisons and copy",
        description: "Multiple comparison badges, copyable value, and drill-down link.",
        code: `<KpiCard
  title="Active Users"
  value={12450}
  format="compact"
  comparison={[
    { value: 11200, label: "vs last week" },
    { value: 9800, label: "vs last month", mode: "both" },
  ]}
  copyable
  onCopy={(v) => console.log("Copied:", v)}
  drillDown={{ label: "View breakdown", onClick: () => router.push("/users") }}
/>`,
      },
    ],
    relatedComponents: ["StatGroup", "Sparkline", "Badge"],
    configFields: ["variant", "animate", "dense", "nullDisplay", "motionConfig"],
    notes: [
      "Uses forwardRef — you can pass a ref to the root div.",
      "When `href` is provided, the root element becomes an <a> tag.",
      "The `sparkline` object prop takes precedence over individual sparklineData/sparklineType/etc props.",
      "The `state` object prop takes precedence over individual loading/empty/error/stale props.",
      "Dynamic strings (DynamicString) can be a plain string or a function receiving MetricContext.",
      "Condition colors can be named tokens ('emerald', 'red', 'amber', etc.) or raw CSS colors ('#ff6b6b', 'rgb(...)').",
    ],
  },

  // =========================================================================
  // StatGroup
  // =========================================================================
  {
    name: "StatGroup",
    importName: "StatGroup",
    category: "card",
    tier: "free",
    description: "A row/grid of mini stat cells, perfect for summary bars at the top of dashboards.",
    longDescription:
      "StatGroup renders an array of stat items in a responsive grid. Each cell shows a label, formatted value, and optional comparison badge. Supports auto-detected grid columns, custom column count, per-stat format overrides, and click handlers. Uses forwardRef.",
    props: [
      { name: "stats", type: "StatItem[]", required: true, description: "Array of stat items to display." },
      { name: "title", type: "string", required: false, description: "Group title above the grid." },
      { name: "subtitle", type: "string", required: false, description: "Group subtitle below the title." },
      { name: "variant", type: "CardVariant", required: false, description: "Visual variant: 'default', 'outlined', 'ghost', 'elevated', or any custom string. CSS-variable-driven via [data-variant]. Falls back to config.variant." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact/dense layout. CSS-variable-driven via [data-dense]. Falls back to config.dense." },
      { name: "columns", type: "1 | 2 | 3 | 4 | 5 | 6", required: false, description: "Override column count. Auto-detected from stat count by default." },
      { name: "format", type: "FormatOption", required: false, description: "Default format applied to all numeric values. Per-stat format overrides this." },
      { name: "loading", type: "boolean", required: false, default: "false", description: "Show skeleton placeholders." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; grid?: string; cell?: string; label?: string; value?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
      { name: "onStatClick", type: "(stat: StatItem, index: number) => void", required: false, description: "Click handler for individual stats." },
      { name: "nullDisplay", type: 'NullDisplay', required: false, default: '"dash"', description: "What to show when a stat value is null/undefined. Falls back to config.nullDisplay." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animations. Currently reserved for future use." },
      { name: "drillDown", type: "boolean | ((event: { stat: StatItem; index: number }) => React.ReactNode)", required: false, description: "Enable drill-down on stat click. `true` auto-generates a detail panel. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `interface StatItem {
  label: string;
  value: string | number;
  change?: number;               // Legacy change percentage
  previousValue?: number;         // For auto-computed comparison
  comparisonMode?: ComparisonMode;
  invertTrend?: boolean;
  format?: FormatOption;
  icon?: React.ReactNode;
}`,
    minimalExample: `<StatGroup
  stats={[
    { label: "Revenue", value: 142300, format: "currency" },
    { label: "Users", value: 12450, format: "compact" },
    { label: "Conversion", value: 4.2, format: "percent" },
  ]}
/>`,
    examples: [
      {
        title: "StatGroup with comparisons",
        description: "Stats with previous period comparisons and a title.",
        code: `<StatGroup
  title="This Week"
  stats={[
    { label: "Revenue", value: 142300, previousValue: 128500, format: "currency" },
    { label: "Orders", value: 1284, previousValue: 1150 },
    { label: "AOV", value: 110.8, previousValue: 111.7, format: "currency", invertTrend: true },
    { label: "Churn", value: 2.1, previousValue: 2.8, format: "percent", invertTrend: true },
  ]}
  columns={4}
/>`,
      },
      {
        title: "Dense stat group with click handler",
        description: "Compact layout with click-to-drill-down.",
        code: `<StatGroup
  stats={metrics}
  dense
  variant="ghost"
  onStatClick={(stat, idx) => setSelectedMetric(stat.label)}
/>`,
      },
    ],
    relatedComponents: ["KpiCard", "Badge"],
    configFields: ["variant", "dense", "nullDisplay"],
    notes: [
      "Uses forwardRef.",
      "Grid columns auto-detect from stat count when `columns` is not set.",
      "Per-stat `format` overrides the group-level `format`.",
      "Supports both legacy `change` (direct percentage) and computed `previousValue` comparisons.",
    ],
  },

  // =========================================================================
  // AreaChart
  // =========================================================================
  {
    name: "AreaChart",
    importName: "AreaChart",
    category: "chart",
    tier: "free",
    description: "A time-series area chart with gradient fills, stacking, dual Y-axis, comparison overlays, and reference lines.",
    longDescription:
      "AreaChart renders one or more data series as filled area lines with gradient fills. Supports gradient fills, stacking (normal and 100% percent), per-series styling, reference lines, threshold bands, dual Y-axis, comparison period overlays (dashed lines), interactive legends with toggle, and responsive tick thinning. Also accepts a simpleData shorthand for single-series use cases.",
    props: [
      { name: "data", type: "{ id: string; data: { x: string | number; y: number | null }[] }[]", required: true, description: "Array of data series. Each series has an id and array of {x, y} data points. y: null creates gaps." },
      { name: "index", type: "string", required: false, description: "Column key for the x-axis labels. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Columns to plot as series. Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? }). If omitted with index, auto-inferred as all number columns." },
      { name: "simpleData", type: "{ label: string; value: number | null }[]", required: false, description: "Simple data format for single-series. Converted to full series internally. `data` takes precedence." },
      { name: "simpleDataId", type: "string", required: false, default: '"Value"', description: "Series name when using simpleData." },
      { name: "comparisonData", type: "{ id: string; data: { x: string | number; y: number | null }[] }[]", required: false, description: "Previous period data rendered as dashed overlay lines at 50% opacity. Same shape as `data`. Use for period-over-period comparison — e.g., this month vs last month. Series IDs must match `data` series IDs." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover content." },
      { name: "footnote", type: "string", required: false, description: "Footnote below the chart." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot in the top-right corner of the header." },
      { name: "format", type: "FormatOption", required: false, description: "Format for Y-axis values and tooltips." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px. Dense mode defaults to 220." },
      { name: "curve", type: "CurveType", required: false, default: '"monotoneX"', description: 'Curve interpolation: "basis", "cardinal", "catmullRom", "linear", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore".' },
      { name: "enablePoints", type: "boolean", required: false, default: "false", description: "Show data points on the line." },
      { name: "enableArea", type: "boolean", required: false, default: "true", description: "Show filled area under the line." },
      { name: "gradient", type: "boolean", required: false, default: "true", description: "Use gradient fill instead of flat opacity." },
      { name: "areaOpacity", type: "number", required: false, default: "0.08", description: "Area fill opacity when gradient is false." },
      { name: "stacked", type: "boolean", required: false, default: "false", description: "Stack multiple series." },
      { name: "stackMode", type: '"normal" | "percent"', required: false, default: '"normal"', description: 'Stack mode. "normal" stacks raw values, "percent" normalizes to 100%.' },
      { name: "enableGridX", type: "boolean", required: false, default: "false", description: "Show vertical grid lines." },
      { name: "enableGridY", type: "boolean", required: false, default: "true", description: "Show horizontal grid lines." },
      { name: "referenceLines", type: "ReferenceLine[]", required: false, description: "Horizontal or vertical reference lines for targets, averages, or benchmarks. Each: `{ axis: 'x'|'y', value: number|string, label?: string, color?: string, style?: 'solid'|'dashed'|'dotted' }`. Rendered on top of the chart area." },
      { name: "thresholds", type: "ThresholdBand[]", required: false, description: "Colored horizontal range bands for danger/warning/safe zones. Each: `{ from: number, to: number, color: string, opacity?: number, label?: string }`. Rendered behind the chart area. Great for SLA targets, budget limits, or performance zones." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend with series toggle. `true` shows default legend. LegendConfig: `{ position?, orientation?, toggleable?, className? }`. Cmd/Ctrl+click to solo a series. ARIA keyboard accessible." },
      { name: "xAxisLabel", type: "string", required: false, description: "Label displayed along the X-axis. Use to clarify units or context (e.g., 'Month', 'Date'). Auto-hidden at narrow widths (<400px)." },
      { name: "yAxisLabel", type: "string", required: false, description: "Label displayed along the Y-axis. Use to clarify units or context (e.g., 'Revenue ($)', 'Users'). Auto-hidden at narrow widths (<400px)." },
      { name: "rightAxisSeries", type: "string[]", required: false, description: "Series IDs to plot on a separate right Y-axis. Use for dual-axis charts where series have different scales (e.g., revenue on left, percentage on right)." },
      { name: "rightAxisFormat", type: "FormatOption", required: false, description: "Format for the right Y-axis values and tooltips. Typically different from the left axis (e.g., left='currency', right='percent')." },
      { name: "rightAxisLabel", type: "string", required: false, description: "Label for the right Y-axis." },
      { name: "lineWidth", type: "number", required: false, default: "2", description: "Line width in px." },
      { name: "lineStyle", type: '"solid" | "dashed" | "dotted"', required: false, default: '"solid"', description: "Line stroke style." },
      { name: "pointSize", type: "number", required: false, default: "6", description: "Point radius in px." },
      { name: "pointColor", type: 'string | { from: string; modifiers?: any[] }', required: false, default: '"var(--card-bg)"', description: 'Point fill color. Default creates hollow ring effect. Use { from: "serieColor" } for solid.' },
      { name: "pointBorderWidth", type: "number", required: false, default: "2", description: "Point border width in px." },
      { name: "pointBorderColor", type: "string", required: false, description: "Point border color. Default: series color." },
      { name: "seriesStyles", type: "Record<string, SeriesStyle>", required: false, description: "Per-series visual overrides keyed by series ID. Override color, lineWidth, lineStyle ('solid'|'dashed'|'dotted'), pointSize, pointColor, pointBorderWidth for individual series. E.g., make one series dashed while others are solid." },
      { name: "colors", type: "string[]", required: false, description: "Series colors. Default: theme series palette (SERIES_COLORS)." },
      { name: "onPointClick", type: "(point: { id: string; value: number; label: string; seriesId: string; x: string | number; y: number }) => void", required: false, description: "Click handler for data points." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout — reduces margins and default height." },
      { name: "chartNullMode", type: "ChartNullMode", required: false, default: '"gap"', description: 'How null/missing data points are handled: "gap", "zero", or "connect".' },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable chart animation. Falls back to config.animate." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]. Falls back to config.variant." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state configuration." },
      { name: "error", type: "ErrorState", required: false, description: "Error state configuration." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator." },
      { name: "crossFilter", type: "boolean | { field: string }", required: false, description: "Enable cross-filter signal on click. true uses the index field, { field } overrides. Emits selection via CrossFilterProvider — does NOT change chart appearance. Dev reads selection with useCrossFilter() and filters their own data." },
      { name: "drillDown", type: "boolean | ((event: { indexValue: string; data: Record<string, unknown> }) => React.ReactNode)", required: false, description: "Enable drill-down on click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper. When both drillDown and crossFilter are set, drillDown wins." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `// Full series format
type Datum = { x: string | number; y: number | null };
type SeriesData = { id: string; data: Datum[] };

// Simple format (single series)
type SimpleData = { label: string; value: number | null }[];`,
    minimalExample: `<AreaChart
  data={[{ id: "Revenue", data: [
    { x: "Jan", y: 4000 }, { x: "Feb", y: 4500 },
    { x: "Mar", y: 5200 }, { x: "Apr", y: 4800 },
  ]}]}
  format="currency"
/>`,
    examples: [
      {
        title: "Stacked area with comparison",
        description: "Two stacked series with previous period dashed overlay.",
        code: `<AreaChart
  data={[
    { id: "Organic", data: months.map(m => ({ x: m.label, y: m.organic })) },
    { id: "Paid", data: months.map(m => ({ x: m.label, y: m.paid })) },
  ]}
  comparisonData={[
    { id: "Organic", data: prevMonths.map(m => ({ x: m.label, y: m.organic })) },
    { id: "Paid", data: prevMonths.map(m => ({ x: m.label, y: m.paid })) },
  ]}
  stacked
  format="compact"
  title="Traffic Sources"
  yAxisLabel="Visitors"
/>`,
      },
      {
        title: "100% stacked area",
        description: "Percent stacked to show composition over time.",
        code: `<AreaChart
  data={channelData}
  stackMode="percent"
  title="Channel Mix"
  legend
/>`,
      },
      {
        title: "Simple data format",
        description: "Single series using the simpleData shorthand.",
        code: `<AreaChart
  simpleData={[
    { label: "Mon", value: 120 },
    { label: "Tue", value: 145 },
    { label: "Wed", value: 132 },
    { label: "Thu", value: 168 },
    { label: "Fri", value: 155 },
  ]}
  title="Daily Signups"
/>`,
      },
      {
        title: "Reference lines, threshold bands, and comparison overlay",
        description: "Revenue trend with a dashed target line, colored danger/safe zones, previous period overlay, and dual-axis.",
        code: `<AreaChart
  data={[
    { id: "Revenue", data: months.map(m => ({ x: m.label, y: m.revenue })) },
  ]}
  comparisonData={[
    { id: "Revenue", data: prevMonths.map(m => ({ x: m.label, y: m.revenue })) },
  ]}
  referenceLines={[
    { axis: "y", value: 50000, label: "Target", color: "#10B981", style: "dashed" },
    { axis: "y", value: 30000, label: "Break-even", color: "#F59E0B", style: "dotted" },
  ]}
  thresholds={[
    { from: 0, to: 30000, color: "#EF4444", opacity: 0.06, label: "Below target" },
    { from: 50000, to: 100000, color: "#10B981", opacity: 0.04 },
  ]}
  format="currency"
  title="Revenue Trend"
  subtitle="vs previous period"
  xAxisLabel="Month"
  yAxisLabel="Revenue ($)"
  height={360}
/>`,
      },
      {
        title: "Dual Y-axis with per-series styling",
        description: "Revenue on left axis, conversion rate on right axis, with custom line styles per series.",
        code: `<AreaChart
  data={[
    { id: "Revenue", data: months.map(m => ({ x: m.label, y: m.revenue })) },
    { id: "Conversion", data: months.map(m => ({ x: m.label, y: m.cvr })) },
  ]}
  rightAxisSeries={["Conversion"]}
  format="currency"
  rightAxisFormat="percent"
  yAxisLabel="Revenue"
  rightAxisLabel="CVR %"
  seriesStyles={{
    Revenue: { lineWidth: 2.5 },
    Conversion: { lineStyle: "dashed", lineWidth: 1.5 },
  }}
  title="Revenue & Conversion"
  legend
/>`,
      },
    ],
    relatedComponents: ["LineChart", "BarChart", "BarLineChart", "Sparkline"],
    configFields: ["animate", "variant", "dense", "chartNullMode", "colors", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "X-axis ticks are automatically thinned based on container width.",
      "Left Y-axis is hidden at container widths below 300px.",
      "When using rightAxisSeries, right-axis data is internally normalized to the left scale and de-normalized for tooltips.",
      "Comparison data renders as dashed lines at 50% opacity.",
      "simpleData is converted to full series format internally; `data` takes precedence when non-empty.",
      "crossFilter prop emits a selection signal on click — it does NOT change the chart's appearance. The dev reads the selection via useCrossFilter() and filters their own data.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
    ],
  },

  // =========================================================================
  // LineChart
  // =========================================================================
  {
    name: "LineChart",
    importName: "LineChart",
    category: "chart",
    tier: "free",
    description: "A line chart — AreaChart with area fill disabled. Shows clean unbroken lines by default.",
    longDescription:
      "LineChart is a thin wrapper around AreaChart that sets enableArea=false, enablePoints=true, and pointSize=0 by default. This gives clean lines without dots while keeping the hover mesh active. All AreaChart props are available except enableArea, gradient, and areaOpacity.",
    props: [
      // All AreaChart props minus enableArea, gradient, areaOpacity
      { name: "data", type: "{ id: string; data: { x: string | number; y: number | null }[] }[]", required: true, description: "Array of data series." },
      { name: "index", type: "string", required: false, description: "Column key for the x-axis labels. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Columns to plot as series. Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? }). If omitted with index, auto-inferred as all number columns." },
      { name: "simpleData", type: "{ label: string; value: number | null }[]", required: false, description: "Simple data format for single-series." },
      { name: "simpleDataId", type: "string", required: false, default: '"Value"', description: "Series name when using simpleData." },
      { name: "comparisonData", type: "{ id: string; data: { x: string | number; y: number | null }[] }[]", required: false, description: "Previous period data as dashed overlay." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for Y-axis values and tooltips." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "curve", type: "CurveType", required: false, default: '"monotoneX"', description: "Curve interpolation." },
      { name: "enablePoints", type: "boolean", required: false, default: "true", description: "Show data points. Note: default pointSize is 0 so they are invisible until sized up." },
      { name: "stacked", type: "boolean", required: false, default: "false", description: "Stack multiple series." },
      { name: "lineWidth", type: "number", required: false, default: "2", description: "Line width in px." },
      { name: "lineStyle", type: '"solid" | "dashed" | "dotted"', required: false, default: '"solid"', description: "Line stroke style." },
      { name: "pointSize", type: "number", required: false, default: "0", description: "Point radius in px. 0 hides dots but keeps hover mesh active." },
      { name: "colors", type: "string[]", required: false, description: "Series colors." },
      { name: "seriesStyles", type: "Record<string, SeriesStyle>", required: false, description: "Per-series style overrides." },
      { name: "referenceLines", type: "ReferenceLine[]", required: false, description: "Reference lines." },
      { name: "thresholds", type: "ThresholdBand[]", required: false, description: "Threshold bands." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend configuration." },
      { name: "xAxisLabel", type: "string", required: false, description: "X-axis label." },
      { name: "yAxisLabel", type: "string", required: false, description: "Y-axis label." },
      { name: "rightAxisSeries", type: "string[]", required: false, description: "Series assigned to right Y-axis." },
      { name: "rightAxisFormat", type: "FormatOption", required: false, description: "Right Y-axis format." },
      { name: "rightAxisLabel", type: "string", required: false, description: "Right Y-axis label." },
      { name: "onPointClick", type: "(point: { id: string; value: number; label: string; seriesId: string; x: string | number; y: number }) => void", required: false, description: "Click handler." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout." },
      { name: "chartNullMode", type: "ChartNullMode", required: false, default: '"gap"', description: "Null handling mode." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator." },
    ],
    dataShape: `// Same as AreaChart
type Datum = { x: string | number; y: number | null };
type SeriesData = { id: string; data: Datum[] };`,
    minimalExample: `<LineChart
  data={[{ id: "Users", data: [
    { x: "Jan", y: 1200 }, { x: "Feb", y: 1350 },
    { x: "Mar", y: 1100 }, { x: "Apr", y: 1500 },
  ]}]}
  title="Active Users"
/>`,
    examples: [
      {
        title: "Multi-series line chart with visible dots",
        description: "Multiple lines with data point dots visible.",
        code: `<LineChart
  data={[
    { id: "Desktop", data: trafficData.desktop },
    { id: "Mobile", data: trafficData.mobile },
    { id: "Tablet", data: trafficData.tablet },
  ]}
  pointSize={6}
  title="Traffic by Device"
  legend
/>`,
      },
      {
        title: "Line chart with reference line",
        description: "A target line at a specific Y value.",
        code: `<LineChart
  data={conversionData}
  format="percent"
  referenceLines={[
    { axis: "y", value: 3.5, label: "Target", color: "#10B981", style: "dashed" },
  ]}
  title="Conversion Rate"
/>`,
      },
    ],
    relatedComponents: ["AreaChart", "BarChart", "Sparkline"],
    configFields: ["animate", "variant", "dense", "chartNullMode", "colors", "motionConfig"],
    notes: [
      "LineChart is Omit<AreaChartProps, 'enableArea' | 'gradient' | 'areaOpacity'>.",
      "enablePoints defaults to true but pointSize defaults to 0, resulting in invisible points. Set pointSize > 0 to show dots.",
      "All AreaChart features (dual axis, stacking, comparison, etc.) are available.",
    ],
  },

  // =========================================================================
  // BarChart
  // =========================================================================
  {
    name: "BarChart",
    importName: "BarChart",
    category: "chart",
    tier: "free",
    description: "A bar chart supporting vertical/horizontal layouts, grouped/stacked/percent modes, presets, comparison bars, target bars, and sorting.",
    longDescription:
      "BarChart renders categorical data as bars . Supports six built-in presets (default, grouped, stacked, percent, horizontal, horizontal-grouped), comparison data as dashed outline bars, target data as ghost bars, negative value coloring, per-key style overrides, reference lines, threshold bands, value labels, and bar sorting. Responsive margins and tick thinning adapt to container width.",
    props: [
      { name: "preset", type: "BarChartPreset", required: false, description: 'One-prop configuration shortcut. "default" = vertical stacked, "grouped" = side-by-side bars, "stacked" = stacked bars, "percent" = 100% normalized stack, "horizontal" = horizontal bars, "horizontal-grouped" = horizontal side-by-side. Individual props override preset values.' },
      { name: "data", type: "Record<string, string | number>[]", required: true, description: "Array of data rows. Each row is an object with the indexBy field and numeric keys." },
      { name: "index", type: "string", required: false, description: "Column key for the x-axis labels. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Columns to plot as series. Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? }). If omitted with index, auto-inferred as all number columns." },
      { name: "keys", type: "string[]", required: true, description: "Keys (series names) to render as bars." },
      { name: "indexBy", type: "string", required: true, description: "Field name used as the category axis." },
      { name: "comparisonData", type: "Record<string, string | number>[]", required: false, description: "Previous period data rendered as dashed outline bars behind the actual bars. Same row shape as `data`. Shows period-over-period comparison at a glance." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover content." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for value-axis labels and tooltips." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "layout", type: '"vertical" | "horizontal"', required: false, default: '"vertical"', description: "Bar layout direction." },
      { name: "groupMode", type: '"stacked" | "grouped" | "percent"', required: false, default: '"stacked"', description: 'How multiple keys are displayed. "percent" normalizes to 100%.' },
      { name: "padding", type: "number", required: false, default: "0.3", description: "Gap between bar groups (0-1)." },
      { name: "innerPadding", type: "number", required: false, description: "Gap between bars in a group. Default: 4 for grouped, -1 for stacked (overlap to eliminate anti-aliasing gaps)." },
      { name: "borderRadius", type: "number", required: false, default: "4", description: "Corner radius on bars. Set to 0 for stacked modes." },
      { name: "enableLabels", type: "boolean", required: false, default: "false", description: "Show formatted value labels on bars." },
      { name: "labelPosition", type: '"inside" | "outside" | "auto"', required: false, default: '"auto"', description: "Where labels appear." },
      { name: "sort", type: '"none" | "asc" | "desc"', required: false, default: '"none"', description: "Sort bars by total value. 'desc' puts highest bars first — great for leaderboards and ranked comparisons." },
      { name: "enableNegative", type: "boolean", required: false, default: "false", description: "Enable diverging colors for negative values. Positive bars use series color, negative bars use negativeColor. Use for P&L, variance, or NPS charts." },
      { name: "negativeColor", type: "string", required: false, default: '"#EF4444"', description: "Color for negative-value bars when enableNegative is true." },
      { name: "targetData", type: "Record<string, number>[]", required: false, description: "Target/goal values rendered as semi-transparent ghost bars behind actual bars. Same shape as `data`. Use for actual-vs-target comparisons (e.g., sales targets, quotas)." },
      { name: "targetColor", type: "string", required: false, description: "Color for target bars. Default: theme-aware muted color." },
      { name: "seriesStyles", type: "Record<string, BarSeriesStyle>", required: false, description: "Per-key color overrides. BarSeriesStyle has { color?: string }." },
      { name: "colors", type: "string[]", required: false, description: "Series colors. Default: theme series palette." },
      { name: "referenceLines", type: "ReferenceLine[]", required: false, description: "Horizontal or vertical reference lines for targets, averages, or benchmarks. Each: `{ axis: 'x'|'y', value, label?, color?, style? }`." },
      { name: "thresholds", type: "ThresholdBand[]", required: false, description: "Colored range bands for danger/warning/safe zones. Each: `{ from, to, color, opacity?, label? }`. Rendered behind bars." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend with series toggle. Cmd/Ctrl+click to solo. Default: shown for multi-key data." },
      { name: "xAxisLabel", type: "string", required: false, description: "Label along the X-axis (category axis in vertical mode, value axis in horizontal). Auto-hidden at narrow widths." },
      { name: "yAxisLabel", type: "string", required: false, description: "Label along the Y-axis (value axis in vertical mode, category axis in horizontal). Auto-hidden at narrow widths." },
      { name: "onBarClick", type: "(bar: { id: string | number; value: number | null; label: string; key: string; indexValue: string | number }) => void", required: false, description: "Click handler for bars. Use for drill-down navigation — e.g., click a bar to navigate to detail view for that category." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout." },
      { name: "chartNullMode", type: "ChartNullMode", required: false, default: '"gap"', description: 'Null handling. Only "zero" transforms bar data.' },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator." },
      { name: "grouped", type: "boolean", required: false, description: "Legacy grouped mode.", deprecated: 'Use groupMode="grouped" instead' },
      { name: "crossFilter", type: "boolean | { field: string }", required: false, description: "Enable cross-filter signal on click. true uses the indexBy field, { field } overrides. Emits selection via CrossFilterProvider — does NOT change chart appearance. Dev reads selection with useCrossFilter() and filters their own data." },
      { name: "drillDown", type: "boolean | ((event: { indexValue: string; data: Record<string, unknown> }) => React.ReactNode)", required: false, description: "Enable drill-down on click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper. When both drillDown and crossFilter are set, drillDown wins." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `// Each row has an index field + numeric fields for each key
type BarData = Record<string, string | number>[];

// Example:
const data = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 4500, expenses: 2100 },
];
const keys = ["revenue", "expenses"];
const indexBy = "month";`,
    minimalExample: `<BarChart
  data={[
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 4500 },
    { month: "Mar", revenue: 5200 },
  ]}
  keys={["revenue"]}
  indexBy="month"
  format="currency"
/>`,
    examples: [
      {
        title: "Grouped bar chart with comparison",
        description: "Side-by-side bars with previous period outline.",
        code: `<BarChart
  preset="grouped"
  data={monthlyData}
  keys={["revenue", "expenses"]}
  indexBy="month"
  comparisonData={previousMonthlyData}
  format="currency"
  title="Revenue vs Expenses"
  legend
/>`,
      },
      {
        title: "Horizontal sorted bar chart",
        description: "Horizontal bars sorted descending with targets.",
        code: `<BarChart
  preset="horizontal"
  data={salesByRep}
  keys={["sales"]}
  indexBy="rep"
  sort="desc"
  targetData={salesTargets}
  format="currency"
  title="Sales by Rep"
/>`,
      },
      {
        title: "Percent stacked bar chart",
        description: "100% stacked showing composition.",
        code: `<BarChart
  preset="percent"
  data={channelData}
  keys={["organic", "paid", "referral"]}
  indexBy="month"
  title="Channel Mix"
  legend
/>`,
      },
      {
        title: "Leaderboard with targets, reference line, and sorting",
        description: "Horizontal sorted bars with target ghost bars and a team average reference line.",
        code: `<BarChart
  preset="horizontal"
  data={[
    { rep: "Alice", deals: 28 },
    { rep: "Bob", deals: 22 },
    { rep: "Carol", deals: 35 },
    { rep: "Dave", deals: 18 },
    { rep: "Eve", deals: 31 },
  ]}
  keys={["deals"]}
  indexBy="rep"
  sort="desc"
  targetData={[
    { rep: "Alice", deals: 25 },
    { rep: "Bob", deals: 25 },
    { rep: "Carol", deals: 25 },
    { rep: "Dave", deals: 25 },
    { rep: "Eve", deals: 25 },
  ]}
  referenceLines={[{ axis: "x", value: 25, label: "Team Target", color: "#10B981", style: "dashed" }]}
  enableLabels
  title="Sales Leaderboard"
  subtitle="Deals closed vs target"
/>`,
      },
      {
        title: "Negative value chart with diverging colors",
        description: "Show positive and negative values with automatic color divergence.",
        code: `<BarChart
  data={[
    { metric: "Revenue", change: 12.5 },
    { metric: "Users", change: 8.2 },
    { metric: "Churn", change: -3.1 },
    { metric: "Costs", change: -7.4 },
    { metric: "NPS", change: 15.0 },
  ]}
  keys={["change"]}
  indexBy="metric"
  enableNegative
  enableLabels
  format="percent"
  title="Month-over-Month Changes"
  yAxisLabel="Change %"
/>`,
      },
    ],
    relatedComponents: ["AreaChart", "BarLineChart", "DonutChart"],
    configFields: ["animate", "variant", "dense", "chartNullMode", "colors", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "Presets set sensible defaults; individual props override preset values.",
      'innerPadding defaults to -1 for stacked mode to eliminate SVG anti-aliasing gaps between segments.',
      'borderRadius is automatically set to 0 for stacked and percent modes.',
      "Horizontal layout auto-computes left margin from longest category label.",
      "The HoverDimLayer dims non-hovered bar groups for visual focus.",
      "crossFilter prop emits a selection signal on click — it does NOT change the chart's appearance. The dev reads the selection via useCrossFilter() and filters their own data.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
    ],
  },

  // =========================================================================
  // BarLineChart
  // =========================================================================
  {
    name: "BarLineChart",
    importName: "BarLineChart",
    category: "chart",
    tier: "free",
    description: "A dual-axis combo chart with bars on the left Y-axis and lines on the right Y-axis.",
    longDescription:
      "BarLineChart combines a bar chart (left axis) with one or more line series (right axis) in a single visualization. The bar data uses the standard BarChart format while lines use the AreaChart series format. Lines are rendered as a custom SVG layer on top of the bar chart, with their own right-axis scale. Supports grouped/stacked bar modes, interactive legends, and all standard chart features.",
    props: [
      { name: "data", type: "Record<string, string | number>[]", required: false, description: "Flat row data for unified format. Use with index and categories (categories with axis: 'right' become line series)." },
      { name: "index", type: "string", required: false, description: "Column key for the x-axis labels. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Columns to plot as series. Categories with axis: 'right' become line series on the right Y-axis, the rest become bars. Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? })." },
      { name: "barData", type: "Record<string, string | number>[]", required: true, description: "Bar data — same shape as BarChart data. Legacy format." },
      { name: "barKeys", type: "string[]", required: true, description: "Keys for bars." },
      { name: "indexBy", type: "string", required: true, description: "Index field name." },
      { name: "lineData", type: "{ id: string; data: { x: string | number; y: number | null }[] }[]", required: true, description: "Line data — same shape as AreaChart/LineChart data. Legacy format." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for bar values (left Y-axis)." },
      { name: "lineFormat", type: "FormatOption", required: false, description: "Format for line values (right Y-axis)." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "colors", type: "string[]", required: false, description: "Bar colors. Default: theme palette." },
      { name: "lineColors", type: "string[]", required: false, description: "Line colors. Default: theme palette offset after bar keys." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend configuration." },
      { name: "groupMode", type: '"stacked" | "grouped"', required: false, default: '"stacked"', description: "How multiple bar keys are displayed." },
      { name: "padding", type: "number", required: false, default: "0.3", description: "Gap between bar groups." },
      { name: "borderRadius", type: "number", required: false, default: "4", description: "Corner radius on bars." },
      { name: "lineWidth", type: "number", required: false, default: "2", description: "Line width in px." },
      { name: "enablePoints", type: "boolean", required: false, default: "true", description: "Show data points on lines." },
      { name: "pointSize", type: "number", required: false, default: "5", description: "Point radius in px." },
      { name: "curve", type: "CurveType", required: false, default: '"monotoneX"', description: "Line interpolation." },
      { name: "enableArea", type: "boolean", required: false, default: "false", description: "Fill area under lines." },
      { name: "xAxisLabel", type: "string", required: false, description: "X-axis label." },
      { name: "yAxisLabel", type: "string", required: false, description: "Left Y-axis label (bars)." },
      { name: "rightAxisLabel", type: "string", required: false, description: "Right Y-axis label (lines)." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout." },
      { name: "chartNullMode", type: "ChartNullMode", required: false, default: '"gap"', description: "Null handling mode." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "drillDown", type: "boolean | ((event: { indexValue: string; data: Record<string, unknown> }) => React.ReactNode)", required: false, description: "Enable drill-down on click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `// Bar data: same as BarChart
type BarData = Record<string, string | number>[];

// Line data: same as AreaChart series
type LineSeriesData = { id: string; data: { x: string | number; y: number | null }[] };`,
    minimalExample: `<BarLineChart
  barData={[
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 4500 },
  ]}
  barKeys={["revenue"]}
  indexBy="month"
  lineData={[{ id: "Margin", data: [
    { x: "Jan", y: 0.42 }, { x: "Feb", y: 0.45 },
  ]}]}
  format="currency"
  lineFormat="percent"
/>`,
    examples: [
      {
        title: "Revenue bars with margin % line",
        description: "Bars show absolute revenue, line shows profit margin percentage.",
        code: `<BarLineChart
  barData={monthlyData}
  barKeys={["revenue"]}
  indexBy="month"
  lineData={[{ id: "Profit Margin", data: marginData }]}
  format="currency"
  lineFormat="percent"
  title="Revenue & Margin"
  yAxisLabel="Revenue"
  rightAxisLabel="Margin %"
  legend
/>`,
      },
      {
        title: "Stacked bars with trend line",
        description: "Multiple stacked bar keys with a cumulative line.",
        code: `<BarLineChart
  barData={salesData}
  barKeys={["online", "inStore"]}
  indexBy="quarter"
  lineData={[{ id: "Growth Rate", data: growthData }]}
  groupMode="stacked"
  format="currency"
  lineFormat="percent"
  title="Sales & Growth"
/>`,
      },
    ],
    relatedComponents: ["BarChart", "AreaChart", "LineChart"],
    configFields: ["animate", "variant", "dense", "chartNullMode", "colors", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Lines are rendered as a custom SVG layer on top of the bar chart.",
      "The right Y-axis scale is computed from line data min/max with 5% padding.",
      "Line colors default to config.colors offset by the number of bar keys.",
      "Combined legend shows both bar keys and line series with toggle support.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
    ],
  },

  // =========================================================================
  // DonutChart
  // =========================================================================
  {
    name: "DonutChart",
    importName: "DonutChart",
    category: "chart",
    tier: "free",
    description: "A donut/pie chart with center content, percentage display, arc labels, and interactive legends.",
    longDescription:
      "DonutChart renders categorical data as proportional slices . Supports configurable inner radius (0 = pie, 0.6 = donut), center content (value + label or custom ReactNode), arc labels, arc link labels, percentage display, slice sorting, zero-slice hiding, per-slice color overrides, and interactive legends with toggle. Also accepts a simpleData shorthand (plain key-value object).",
    props: [
      { name: "data", type: "DonutDatum[]", required: true, description: "Array of slices with id, label, value, and optional color." },
      { name: "index", type: "string", required: false, description: "Column key for slice labels. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Column to use as slice values (typically one entry). Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? }). If omitted with index, auto-inferred as all number columns." },
      { name: "simpleData", type: "Record<string, number>", required: false, description: 'Simple key-value object like { "Chrome": 45, "Firefox": 25 }. Converted to DonutDatum[] internally. `data` takes precedence.' },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for values in tooltips and labels." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "innerRadius", type: "number", required: false, default: "0.6", description: "Inner radius ratio (0-1). 0 = pie chart." },
      { name: "padAngle", type: "number", required: false, default: "0.7", description: "Gap between slices in degrees." },
      { name: "cornerRadius", type: "number", required: false, default: "3", description: "Rounded slice edges in px." },
      { name: "startAngle", type: "number", required: false, default: "0", description: "Start angle in degrees." },
      { name: "endAngle", type: "number", required: false, default: "360", description: "End angle in degrees." },
      { name: "sortSlices", type: '"desc" | "asc" | "none"', required: false, default: '"desc"', description: "Sort slices by value." },
      { name: "activeOuterRadiusOffset", type: "number", required: false, default: "4", description: "Hover expansion offset in px. Dense mode defaults to 2." },
      { name: "enableArcLabels", type: "boolean", required: false, default: "false", description: "Show value labels on slices." },
      { name: "arcLabelsSkipAngle", type: "number", required: false, default: "10", description: "Minimum angle to show arc label (degrees)." },
      { name: "enableArcLinkLabels", type: "boolean", required: false, default: "false", description: "Show lines connecting slices to external labels." },
      { name: "arcLinkLabelsSkipAngle", type: "number", required: false, default: "10", description: "Minimum angle to show arc link label." },
      { name: "showPercentage", type: "boolean", required: false, default: "false", description: "Show percentages instead of raw values in tooltips/labels." },
      { name: "centerValue", type: "string", required: false, description: "Big number displayed in the donut center." },
      { name: "centerLabel", type: "string", required: false, description: "Label below the center value." },
      { name: "centerContent", type: "React.ReactNode", required: false, description: "Custom ReactNode for full control of center content." },
      { name: "borderWidth", type: "number", required: false, default: "1", description: "Slice border width." },
      { name: "colors", type: "string[]", required: false, description: "Series colors. Default: theme palette." },
      { name: "seriesStyles", type: "Record<string, DonutSeriesStyle>", required: false, description: "Per-slice color overrides keyed by slice id." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend configuration. Default: shown with toggle." },
      { name: "hideZeroSlices", type: "boolean", required: false, default: "true", description: "Hide slices with value 0 or null." },
      { name: "onSliceClick", type: "(slice: { id: string; value: number; label: string; percentage: number }) => void", required: false, description: "Click handler for slices." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout." },
      { name: "chartNullMode", type: "ChartNullMode", required: false, description: "Included for API consistency. No behavioral change for donut." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
      { name: "crossFilter", type: "boolean | { field: string }", required: false, description: "Enable cross-filter signal on click. true uses the slice id field, { field } overrides. Emits selection via CrossFilterProvider — does NOT change chart appearance. Dev reads selection with useCrossFilter() and filters their own data." },
      { name: "drillDown", type: "boolean | ((event: { id: string; value: number; label: string; percentage: number }) => React.ReactNode)", required: false, description: "Enable drill-down on slice click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper. When both drillDown and crossFilter are set, drillDown wins." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `interface DonutDatum {
  id: string;
  label: string;
  value: number;
  color?: string;  // Optional per-slice color
}

// Simple format alternative:
type SimpleDonutData = Record<string, number>;
// e.g. { "Chrome": 45, "Firefox": 25, "Safari": 20, "Edge": 10 }`,
    minimalExample: `<DonutChart
  data={[
    { id: "chrome", label: "Chrome", value: 45 },
    { id: "firefox", label: "Firefox", value: 25 },
    { id: "safari", label: "Safari", value: 20 },
    { id: "edge", label: "Edge", value: 10 },
  ]}
  title="Browser Share"
/>`,
    examples: [
      {
        title: "Donut with center value and percentages",
        description: "Shows total in center with percentage display.",
        code: `<DonutChart
  data={browserData}
  centerValue="100K"
  centerLabel="Total Users"
  showPercentage
  enableArcLabels
  title="Browser Share"
/>`,
      },
      {
        title: "Simple data format with custom center",
        description: "Using the simpleData shorthand with custom center content.",
        code: `<DonutChart
  simpleData={{ Desktop: 60, Mobile: 35, Tablet: 5 }}
  centerContent={<div className="text-center"><span className="text-2xl font-bold">60%</span><br/><span className="text-xs text-muted">Desktop</span></div>}
  title="Traffic by Device"
/>`,
      },
      {
        title: "Half donut (gauge style)",
        description: "Semi-circle using startAngle/endAngle.",
        code: `<DonutChart
  data={gaugeData}
  startAngle={-90}
  endAngle={90}
  innerRadius={0.7}
  centerValue="78%"
  centerLabel="Health Score"
  sortSlices="none"
/>`,
      },
    ],
    relatedComponents: ["BarChart", "Badge"],
    configFields: ["animate", "variant", "dense", "chartNullMode", "colors", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "Legend always shows (alwaysShow: true) regardless of series count.",
      "simpleData is converted to DonutDatum[] internally; `data` takes precedence when non-empty.",
      "Center content is rendered using SVG foreignObject for centerContent, or native SVG text for centerValue/centerLabel.",
      "Set innerRadius to 0 for a pie chart (no hole).",
      "Stable color assignments — DonutChart remembers which color belongs to which slice across data changes. Filtering down to one slice keeps its original color. No dev action needed.",
      "crossFilter prop emits a selection signal on click — it does NOT change the chart's appearance. The dev reads the selection via useCrossFilter() and filters their own data.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
    ],
  },

  // =========================================================================
  // Sparkline
  // =========================================================================
  {
    name: "Sparkline",
    importName: "Sparkline",
    category: "chart",
    tier: "free",
    description: "A tiny inline chart (line or bar) for embedding in cards, tables, and tight spaces.",
    longDescription:
      "Sparkline is a pure SVG micro-chart that renders in minimal space. Supports line and bar variants, trend-based auto-coloring, gradient fill, interactive hover tooltips, endpoint dots, min/max indicators, reference lines, shaded bands, and smooth curve interpolation. Designed for embedding inside KpiCard or table cells. Fully responsive — fills its container when width/height are not specified.",
    props: [
      { name: "data", type: "(number | null)[]", required: true, description: "Data points. null values create gaps in the line." },
      { name: "trend", type: '"positive" | "negative" | "neutral"', required: false, default: '"neutral"', description: "Trend direction for auto-coloring." },
      { name: "color", type: "string", required: false, description: "Override color (CSS color string). Defaults to theme-aware trend color." },
      { name: "type", type: "SparklineType", required: false, default: '"line"', description: '"line" or "bar".' },
      { name: "height", type: "number", required: false, default: "40", description: "Height in px. Set to undefined to fill container." },
      { name: "width", type: "number", required: false, description: "Width in px. Default: fills container." },
      { name: "curve", type: '"monotoneX" | "linear" | "step" | "natural"', required: false, default: '"monotoneX"', description: "Curve interpolation for line type." },
      { name: "fill", type: "boolean", required: false, default: "true", description: "Show gradient area fill under the line." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Entrance animation. Falls back to config.animate." },
      { name: "showEndpoints", type: "boolean", required: false, default: "false", description: "Show dots on first and last data points." },
      { name: "showMinMax", type: "boolean", required: false, default: "false", description: "Show dots + subtle labels on min/max values." },
      { name: "trendColoring", type: 'boolean | "invert"', required: false, default: "false", description: 'Auto-color based on trend direction. Pass "invert" to flip (green = down, red = up).' },
      { name: "referenceLine", type: "SparklineReferenceLine", required: false, description: "Horizontal reference line (e.g., average or target)." },
      { name: "band", type: "SparklineBand", required: false, description: "Shaded band region (e.g., normal range)." },
      { name: "interactive", type: "boolean", required: false, default: "false", description: "Enable interactive tooltip on hover." },
      { name: "format", type: "FormatOption", required: false, description: "Format option for tooltip values." },
      { name: "formatTooltip", type: "(value: number) => string", required: false, description: "Legacy: direct tooltip formatter function. Takes precedence over `format`." },
      { name: "strokeWidth", type: "number", required: false, default: "1.5", description: "Line stroke width in px." },
      { name: "className", type: "string", required: false, description: "Additional CSS class for the root container." },
      { name: "classNames", type: "{ root?: string; svg?: string; tooltip?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    dataShape: `// Simple numeric array with optional null gaps
type SparklineData = (number | null)[];`,
    minimalExample: `<Sparkline
  data={[10, 15, 12, 18, 14, 22, 19]}
  trend="positive"
/>`,
    examples: [
      {
        title: "Interactive sparkline with reference line",
        description: "Hover to see values, with an average reference line.",
        code: `<Sparkline
  data={dailyRevenue}
  trend="positive"
  interactive
  format="currency"
  referenceLine={{ value: avgRevenue, label: "Avg", style: "dashed" }}
  showMinMax
/>`,
      },
      {
        title: "Bar sparkline with band",
        description: "Bar type with a normal range band.",
        code: `<Sparkline
  data={uptimeData}
  type="bar"
  color="#10B981"
  band={{ from: 99, to: 100, color: "#10B981", opacity: 0.1 }}
  referenceLine={{ value: 99.9, label: "SLA", style: "dashed" }}
  interactive
  format="percent"
/>`,
      },
      {
        title: "Trend coloring with endpoints",
        description: "Auto-colors based on whether the trend is up or down.",
        code: `<Sparkline
  data={[45, 42, 38, 41, 35, 32]}
  trendColoring
  trend="negative"
  showEndpoints
/>`,
      },
    ],
    relatedComponents: ["KpiCard", "AreaChart", "LineChart"],
    configFields: ["animate", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "When placed inside a sized container, omit height/width to fill it automatically.",
      "The line sparkline uses clip-path animation for a draw-on entrance effect.",
      "Bar sparkline uses scaleY animation per bar with staggered delays.",
      "formatTooltip (legacy function) takes precedence over the format prop.",
      "Null values in the data array create visible gaps between line segments.",
    ],
  },

  // =========================================================================
  // DataTable
  // =========================================================================
  {
    name: "DataTable",
    importName: "DataTable",
    category: "table",
    tier: "free",
    description: "A data table with sorting, pagination, search, formatting, sticky headers, pinned columns, and a footer row.",
    longDescription:
      "DataTable renders tabular data with rich features: column auto-inference from data shape, sortable columns, client-side pagination, client-side search, per-column format options, custom cell renderers, sticky headers, pinned left columns, alternating row striping, null display handling, summary footer rows, and full data-state handling. Generic over the row type T.",
    props: [
      { name: "data", type: "T[]", required: true, description: "Row data array." },
      { name: "columns", type: "Column<T>[]", required: false, description: "Column definitions. When omitted, columns are auto-inferred from the first row." },
      { name: "title", type: "string", required: false, description: "Card title." },
      { name: "subtitle", type: "string", required: false, description: "Card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover content." },
      { name: "footnote", type: "string", required: false, description: "Footnote below the table." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot (top-right)." },
      { name: "pageSize", type: "number", required: false, description: "Page size for pagination. Set to enable pagination." },
      { name: "pagination", type: "boolean", required: false, description: "Enable pagination. Default: true when pageSize is set." },
      { name: "maxRows", type: "number", required: false, description: 'Max visible rows. Shows "View all" when exceeded.' },
      { name: "onViewAll", type: "() => void", required: false, description: 'Callback when "View all" is clicked.' },
      { name: "striped", type: "boolean", required: false, default: "false", description: "Alternating row backgrounds." },
      { name: "dense", type: "boolean", required: false, description: "Compact row height. Falls back to config.dense." },
      { name: "onRowClick", type: "(row: T, index: number) => void", required: false, description: "Row click handler." },
      { name: "nullDisplay", type: "NullDisplay", required: false, default: '"dash"', description: "What to show when a cell value is null/undefined." },
      { name: "footer", type: "FooterRow", required: false, description: "Summary/totals footer row. Object keyed by column key with ReactNode values." },
      { name: "variant", type: "CardVariant", required: false, description: "Visual variant (supports custom strings). CSS-variable-driven via [data-variant]." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "loading", type: "boolean", required: false, description: "Show skeleton rows." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state configuration." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "stickyHeader", type: "boolean", required: false, description: "Sticky table header on scroll." },
      { name: "classNames", type: "{ root?: string; header?: string; table?: string; thead?: string; tbody?: string; row?: string; cell?: string; footer?: string; pagination?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "searchable", type: "boolean", required: false, description: "Show a search input above the table for client-side filtering." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animations. Currently reserved for future use." },
      { name: "scrollIndicators", type: "boolean", required: false, description: "Show left/right fade indicators when the table is horizontally scrollable." },
      { name: "rowConditions", type: "RowCondition<T>[]", required: false, description: "Conditional row styling. Each entry has a `when(row, index) => boolean` predicate and a `className` to apply when true." },
      { name: "multiSort", type: "boolean", required: false, default: "false", description: "Enable Shift+click multi-column sorting. Default: false (single sort)." },
      { name: "renderExpanded", type: "(row: T, index: number) => React.ReactNode", required: false, description: "Render expanded detail panel below a row. Enables chevron toggle on each row." },
      { name: "crossFilter", type: "boolean | { field: string }", required: false, description: "Enable cross-filter signal on row click. true uses the first column key, { field } overrides. Emits selection via CrossFilterProvider — does NOT change table appearance. Dev reads selection with useCrossFilter() and filters their own data." },
      { name: "drillDown", type: "boolean | ((event: { row: T; index: number }) => React.ReactNode)", required: false, description: "Enable drill-down on row click. `true` auto-generates a summary KPI row + detail view from the row data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper. When both drillDown and crossFilter are set, drillDown wins." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `type ColumnType = "text" | "number" | "currency" | "percent" | "link" | "badge" | "sparkline" | "status" | "progress" | "date" | "bar";

interface Column<T> {
  key: string;                   // Property key on the data object
  header?: string;               // Column header text (preferred)
  label?: string;                // @deprecated — use header
  type?: ColumnType;             // Column type — auto-formats and auto-aligns. See ColumnType docs.
  format?: FormatOption;         // Auto-format numeric values (overrides type-inferred format)
  align?: "left" | "center" | "right";  // Default: left for text, right for numbers, center for sparkline/progress
  width?: string | number;       // Column width (CSS value)
  sortable?: boolean;            // Enable sorting
  render?: (value: any, row: T, index: number) => React.ReactNode;  // Custom cell renderer
  pin?: "left";                  // Sticky column on horizontal scroll
  wrap?: boolean;                // Allow text wrapping in cells (default: truncate)
  conditions?: Condition[];      // Conditional cell coloring based on value
  linkHref?: (value: any, row: T) => string;     // URL resolver for type:"link" columns
  linkTarget?: string;           // Link target attribute (e.g. "_blank")
  badgeColor?: (value: any, row: T) => string | undefined;    // Custom badge color for type:"badge"
  badgeVariant?: (value: any, row: T) => BadgeVariant | undefined;  // Custom badge variant for type:"badge"
  statusRules?: StatusRule[];    // Threshold rules for type:"status" columns
  statusSize?: StatusSize;       // Display size for type:"status" columns
  dateFormat?: Intl.DateTimeFormatOptions;  // Intl format options for type:"date" columns
}

interface RowCondition<T> {
  when: (row: T, index: number) => boolean;  // Predicate — return true to apply className
  className: string;                          // CSS class to apply to matching rows
}

interface FooterRow {
  [key: string]: React.ReactNode;
}`,
    minimalExample: `<DataTable
  data={[
    { name: "Acme Corp", revenue: 142300, growth: 12.5 },
    { name: "Globex", revenue: 98700, growth: -3.2 },
    { name: "Initech", revenue: 67400, growth: 8.1 },
  ]}
/>`,
    examples: [
      {
        title: "Table with columns, formatting, and pagination",
        description: "Explicit columns with format, sorting, and pagination.",
        code: `<DataTable
  data={salesData}
  columns={[
    { key: "company", header: "Company", sortable: true, pin: "left" },
    { key: "revenue", header: "Revenue", format: "currency", sortable: true },
    { key: "growth", header: "Growth", format: "percent", sortable: true },
    { key: "status", header: "Status", render: (v) => <Badge variant={v === "active" ? "success" : "danger"}>{v}</Badge> },
  ]}
  pageSize={10}
  searchable
  striped
  title="Sales Report"
  footer={{ company: "Total", revenue: "$308,400", growth: "" }}
/>`,
      },
      {
        title: "Auto-inferred table with row click",
        description: "Columns auto-detected from data, with row click handler.",
        code: `<DataTable
  data={users}
  onRowClick={(row) => router.push(\`/users/\${row.id}\`)}
  maxRows={5}
  onViewAll={() => router.push("/users")}
  stickyHeader
/>`,
      },
      {
        title: "Column types with multi-sort, expandable rows, and row conditions",
        description: "Using column types for automatic rendering, multi-sort, expandable detail rows, and conditional row highlighting.",
        code: `<DataTable
  data={servers}
  multiSort
  scrollIndicators
  renderExpanded={(row) => (
    <div className="p-4">
      <p>Region: {row.region}</p>
      <p>Last deployed: {row.lastDeploy}</p>
    </div>
  )}
  rowConditions={[
    { when: (row) => row.uptime < 95, className: "bg-red-500/10" },
    { when: (row) => row.uptime >= 99.9, className: "bg-emerald-500/10" },
  ]}
  columns={[
    { key: "name", header: "Server", type: "text", sortable: true, pin: "left" },
    { key: "revenue", header: "Revenue", type: "currency", sortable: true },
    { key: "uptime", header: "Uptime", type: "percent", sortable: true, conditions: [
      { when: "below", value: 95, color: "red" },
      { when: "above", value: 99, color: "emerald" },
    ]},
    { key: "status", header: "Status", type: "badge" },
    { key: "health", header: "Health", type: "status", statusRules: [
      { min: 90, color: "emerald", label: "Healthy" },
      { min: 50, max: 90, color: "amber", label: "Degraded" },
      { max: 50, color: "red", label: "Critical", pulse: true },
    ], statusSize: "sm" },
    { key: "trend", header: "Trend", type: "sparkline" },
    { key: "lastSeen", header: "Last Seen", type: "date", dateFormat: { dateStyle: "medium" } },
    { key: "load", header: "Load", type: "bar" },
    { key: "docs", header: "Docs", type: "link", linkHref: (v, row) => row.docsUrl, linkTarget: "_blank" },
  ]}
  pageSize={10}
  searchable
  striped
  title="Server Fleet"
/>`,
      },
    ],
    relatedComponents: ["Badge", "KpiCard"],
    configFields: ["variant", "dense", "nullDisplay"],
    notes: [
      "Generic component — TypeScript infers T from the data prop.",
      "When columns are omitted, they are auto-inferred from the first row's keys with camelCase-to-Title-Case conversion.",
      "Sort cycles through: asc -> desc -> none. With multiSort, Shift+click adds secondary/tertiary sorts.",
      "Column `header` is preferred over `label` (which is deprecated).",
      "Auto-alignment: numeric types (number, currency, percent, bar) right-align. sparkline/progress center-align. Everything else left-aligns.",
      "Column types auto-render: 'currency'/'percent'/'number' auto-format values, 'badge' renders a Badge, 'status' renders StatusIndicator, 'sparkline' renders a Sparkline, 'link' renders a clickable link, 'progress' renders a ProgressBar, 'date' formats via Intl.DateTimeFormat, 'bar' renders inline bar chart.",
      "The pagination component shows 'Previous' / 'Next' buttons with row range indicator.",
      "Search filters across all column values using case-insensitive string matching.",
      "renderExpanded adds a chevron toggle column. Clicking a row expands/collapses the detail panel.",
      "rowConditions apply CSS classes to rows matching predicates — useful for highlighting warnings or critical rows.",
      "crossFilter prop emits a selection signal on row click — it does NOT change the table's appearance. The dev reads the selection via useCrossFilter() and filters their own data.",
      "drillDown={true} auto-generates a summary KPI row + detail view from the clicked row. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
    ],
  },

  // =========================================================================
  // Badge
  // =========================================================================
  {
    name: "Badge",
    importName: "Badge",
    category: "ui",
    tier: "free",
    description: "A small status indicator with variant colors, dot/icon prefix, and optional dismiss button.",
    longDescription:
      "Badge is a lightweight inline status indicator. Supports six semantic variants (default, success, warning, danger, info, outline), three sizes (sm, md, lg), status dots, custom icons, custom colors via inline CSS color-mix, and a dismiss button. Uses forwardRef to an HTMLSpanElement.",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Badge content (text or elements)." },
      { name: "variant", type: '"default" | "success" | "warning" | "danger" | "info" | "outline"', required: false, default: '"default"', description: "Semantic color variant." },
      { name: "dot", type: "boolean", required: false, default: "false", description: "Show a colored dot indicator before the text." },
      { name: "icon", type: "React.ReactNode", required: false, description: "Custom icon before the text. Takes precedence over dot." },
      { name: "size", type: '"sm" | "md" | "lg"', required: false, default: '"md"', description: "Badge size." },
      { name: "color", type: "string", required: false, description: "Custom color — sets text color and tinted background via CSS color-mix." },
      { name: "onDismiss", type: "() => void", required: false, description: "Show a dismiss (X) button and call this on click." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    minimalExample: `<Badge variant="success">Active</Badge>`,
    examples: [
      {
        title: "Badges with different variants",
        description: "Showing all semantic variants.",
        code: `<div className="flex gap-2">
  <Badge variant="success" dot>Active</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="danger">Failed</Badge>
  <Badge variant="info">New</Badge>
  <Badge variant="outline">Draft</Badge>
</div>`,
      },
      {
        title: "Custom color badge with dismiss",
        description: "Using a custom color with dismiss callback.",
        code: `<Badge
  color="#6366F1"
  onDismiss={() => removeTag(tag)}
  size="lg"
>
  {tag}
</Badge>`,
      },
    ],
    relatedComponents: ["KpiCard", "DataTable"],
    configFields: [],
    notes: [
      "Uses forwardRef to HTMLSpanElement.",
      "When `color` is provided, variant styles are bypassed in favor of inline CSS using color-mix.",
      "The `icon` prop takes precedence over `dot` — if both are set, only icon is shown.",
      "Size 'sm': 10px text, 'md': 12px text (xs), 'lg': 14px text (sm).",
    ],
  },
  // -------------------------------------------------------------------------
  // Gauge
  // -------------------------------------------------------------------------
  {
    name: "Gauge",
    importName: "Gauge",
    category: "chart",
    tier: "free",
    description: "A minimal arc gauge showing where a value sits in a range with optional threshold zones and target marker.",
    longDescription:
      "Gauge renders a 270° (or 180°) arc with a fill showing the current value's position between min and max. Threshold zones provide colored segments on the track (e.g. green/amber/red zones). An optional target marker shows a goal tick on the arc. The value is displayed large and centered. Uses forwardRef — attach a ref to the root div. Integrates with MetricProvider, format engine, comparisons, and data states.",
    props: [
      { name: "value", type: "number | null | undefined", required: true, description: "Current value. Pass null/undefined for null state display." },
      { name: "min", type: "number", required: false, default: "0", description: "Minimum value for the gauge range." },
      { name: "max", type: "number", required: false, default: "100", description: "Maximum value for the gauge range." },
      { name: "title", type: "string", required: false, description: "Title displayed above the gauge." },
      { name: "subtitle", type: "string", required: false, description: "Subtitle displayed below the centered value." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Popover content for the ? icon next to the title." },
      { name: "format", type: "FormatOption", required: false, description: "Format for the centered value and min/max labels." },
      { name: "comparison", type: "ComparisonConfig | ComparisonConfig[]", required: false, description: "Comparison badge(s) below the gauge." },
      { name: "comparisonLabel", type: "string", required: false, description: "Label for the primary comparison." },
      { name: "thresholds", type: "GaugeThreshold[]", required: false, description: "Threshold breakpoints for colored zones on the arc. Array of { value, color }." },
      { name: "target", type: "number", required: false, description: "Target marker rendered as a tick on the arc." },
      { name: "targetLabel", type: "string", required: false, description: "Label for the target marker." },
      { name: "arcAngle", type: "180 | 270", required: false, default: "270", description: "Arc sweep angle. 270° has a gap at the bottom, 180° is a semicircle." },
      { name: "strokeWidth", type: "number", required: false, default: "12", description: "Thickness of the arc in px." },
      { name: "color", type: "string", required: false, default: "var(--accent)", description: "Fill arc color. If thresholds provided and no color, auto-picks from threshold zone." },
      { name: "showMinMax", type: "boolean", required: false, default: "true", description: "Show formatted min/max labels at arc endpoints." },
      { name: "showValue", type: "boolean", required: false, default: "true", description: "Show the large centered value text." },
      { name: "icon", type: "React.ReactNode", required: false, description: "Icon next to the title." },
      { name: "size", type: "number", required: false, default: "200", description: "SVG viewBox size in px." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]. Reads from MetricProvider." },
      { name: "dense", type: "boolean", required: false, description: "Compact padding. Reads from MetricProvider." },
      { name: "animate", type: "boolean | AnimationConfig", required: false, description: "Animate arc fill and count-up. Reads from MetricProvider." },
      { name: "nullDisplay", type: "NullDisplay", required: false, description: "What to show when value is null. Reads from MetricProvider." },
      { name: "loading", type: "boolean", required: false, description: "Show skeleton placeholder." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state config." },
      { name: "error", type: "ErrorState", required: false, description: "Error state config." },
      { name: "stale", type: "StaleState", required: false, description: "Stale data indicator." },
      { name: "className", type: "string", required: false, description: "Additional class names for the outer card." },
      { name: "classNames", type: "{ root?: string; arc?: string; value?: string; title?: string }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id for testing frameworks." },
      { name: "drillDown", type: "boolean | ((event: { value: number; title: string }) => React.ReactNode)", required: false, description: "Enable drill-down on gauge click. `true` auto-generates a detail panel. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: undefined,
    minimalExample: `<Gauge value={73} title="CPU Usage" format="percent" />`,
    examples: [
      {
        title: "Gauge with thresholds",
        description: "Colored zones showing good/warning/critical ranges.",
        code: `<Gauge
  value={73}
  title="CPU Usage"
  format="percent"
  thresholds={[
    { value: 60, color: "emerald" },
    { value: 80, color: "amber" },
    { value: 100, color: "red" },
  ]}
/>`,
      },
      {
        title: "Gauge with target and comparison",
        description: "Budget utilization with a target marker and comparison to last period.",
        code: `<Gauge
  value={67500}
  min={0}
  max={100000}
  title="Budget Utilization"
  format="currency"
  target={80000}
  targetLabel="Target"
  comparison={{ value: 58200 }}
  comparisonLabel="vs last quarter"
  animate={{ countUp: true }}
/>`,
      },
      {
        title: "NPS Score gauge",
        description: "Net Promoter Score with negative minimum and custom arc.",
        code: `<Gauge
  value={72}
  min={-100}
  max={100}
  title="NPS Score"
  format="number"
  thresholds={[
    { value: 0, color: "red" },
    { value: 30, color: "amber" },
    { value: 70, color: "emerald" },
  ]}
  showMinMax
/>`,
      },
    ],
    relatedComponents: ["KpiCard", "Sparkline"],
    configFields: ["variant", "animate", "dense", "nullDisplay", "motionConfig"],
    notes: [
      "Uses partial arc rendering for gauge display.",
      "When thresholds are provided and no explicit color prop, the fill arc auto-picks the color of the zone the current value falls in.",
      "The 270° arc has a ~90° gap at the bottom. The 180° arc is a semicircle with a flat bottom.",
      "Uses role='meter' with aria-valuenow/min/max for accessibility.",
      "Fill animation uses CSS strokeDashoffset transition, duration derived from motionConfig.",
    ],
  },
  // -------------------------------------------------------------------------
  // HeatMap
  // -------------------------------------------------------------------------
  {
    name: "HeatMap",
    importName: "HeatMap",
    category: "chart",
    tier: "free",
    description: "Two-dimensional matrix with color intensity. Day×hour usage, correlation, activity grids.",
    longDescription:
      "HeatMap renders a matrix of colored cells showing the relationship between two dimensions. Built with sequential or diverging color scales, rounded cell corners, formatted cell labels, responsive axes, and rich tooltips. Uses ChartContainer for consistent card styling.",
    props: [
      { name: "data", type: "{ id: string; data: { x: string; y: number | null }[] }[]", required: true, description: "Array of series. Each series is a row, each datum is a column cell." },
      { name: "index", type: "string", required: false, description: "Column key for row IDs. Used with the unified flat-row data format. If omitted with categories, auto-inferred as the first string column." },
      { name: "categories", type: "Category[]", required: false, description: "Columns to use as cell columns. Accepts plain strings or CategoryConfig objects ({ key, label?, format?, color?, axis? }). If omitted with index, auto-inferred as all number columns." },
      { name: "simpleData", type: "Record<string, Record<string, number | null>>", required: false, description: "Simple 2D object format. Converted to series internally. data takes precedence." },
      { name: "title", type: "string", required: false, description: "Card title." },
      { name: "subtitle", type: "string", required: false, description: "Card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Popover description." },
      { name: "footnote", type: "string", required: false, description: "Footnote below the chart." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot in the header." },
      { name: "format", type: "FormatOption", required: false, description: "Format for cell values and tooltips." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "colorScale", type: '"sequential" | "diverging"', required: false, default: '"sequential"', description: "Color scale type." },
      { name: "colors", type: "string[]", required: false, description: "Custom color stops. Overrides colorScale." },
      { name: "emptyColor", type: "string", required: false, description: "Color for null/missing cells." },
      { name: "borderRadius", type: "number", required: false, default: "4", description: "Cell corner radius." },
      { name: "enableLabels", type: "boolean", required: false, default: "false", description: "Show values inside cells." },
      { name: "forceSquare", type: "boolean", required: false, default: "false", description: "Force cells to be square." },
      { name: "cellPadding", type: "number", required: false, default: "0.05", description: "Inner padding between cells (0-1)." },
      { name: "hoverTarget", type: '"cell" | "row" | "column" | "rowColumn"', required: false, default: '"cell"', description: "What to highlight on hover. 'cell' = single cell, 'row' = entire row, 'column' = entire column, 'rowColumn' = cross-hair highlighting both row and column. Use 'rowColumn' for comparing patterns across dimensions." },
      { name: "onCellClick", type: "(cell: { serieId: string; x: string; value: number | null }) => void", required: false, description: "Click handler for cells." },
      { name: "animate", type: "boolean", required: false, description: "Enable animation. Reads from MetricProvider." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant (supports custom strings). CSS-variable-driven via [data-variant]. Reads from MetricProvider." },
      { name: "dense", type: "boolean", required: false, description: "Dense mode. Reads from MetricProvider." },
      { name: "className", type: "string", required: false, description: "Additional class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Show skeleton." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
      { name: "crossFilter", type: "boolean | { field: string }", required: false, description: "Enable cross-filter signal on click. true uses the row id field, { field } overrides. Emits selection via CrossFilterProvider — does NOT change chart appearance. Dev reads selection with useCrossFilter() and filters their own data." },
      { name: "drillDown", type: "boolean | ((event: { serieId: string; x: string; y: number }) => React.ReactNode)", required: false, description: "Enable drill-down on cell click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper. When both drillDown and crossFilter are set, drillDown wins." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `// Each series is a row, each datum is a column
type HeatMapSeries = {
  id: string;           // Row label (e.g. "Monday")
  data: {
    x: string;          // Column label (e.g. "9am")
    y: number | null;   // Cell value
  }[];
};

// Or use simpleData shorthand:
const simpleData = {
  Mon: { "9am": 12, "10am": 45, "11am": 78 },
  Tue: { "9am": 23, "10am": 56, "11am": 92 },
};`,
    minimalExample: `<HeatMap
  data={[
    { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }] },
    { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }] },
  ]}
  title="Weekly Activity"
/>`,
    examples: [
      {
        title: "Activity heatmap with labels",
        description: "Day × hour usage grid with values displayed inside cells.",
        code: `<HeatMap
  data={activityData}
  title="User Activity"
  subtitle="Sessions by day and hour"
  format="number"
  enableLabels
  borderRadius={6}
  height={320}
/>`,
      },
      {
        title: "Diverging correlation matrix",
        description: "Correlation values from -1 to 1 with red-green diverging scale.",
        code: `<HeatMap
  data={correlationData}
  title="Metric Correlations"
  colorScale="diverging"
  enableLabels
  forceSquare
  format={{ style: "number", precision: 2 }}
/>`,
      },
      {
        title: "Interactive activity heatmap with cross-hair hover and drill-down",
        description: "Day x hour grid with row+column highlighting and click to drill down.",
        code: `<HeatMap
  simpleData={{
    Mon: { "9am": 12, "10am": 45, "11am": 78, "12pm": 92, "1pm": 85 },
    Tue: { "9am": 23, "10am": 56, "11am": 92, "12pm": 110, "1pm": 95 },
    Wed: { "9am": 34, "10am": 67, "11am": 88, "12pm": 105, "1pm": 78 },
    Thu: { "9am": 18, "10am": 42, "11am": 65, "12pm": 88, "1pm": 72 },
    Fri: { "9am": 8, "10am": 28, "11am": 45, "12pm": 62, "1pm": 55 },
  }}
  title="Peak Activity Hours"
  subtitle="Sessions by day and time"
  hoverTarget="rowColumn"
  enableLabels
  colors={["#f0fdf4", "#86efac", "#22c55e", "#15803d", "#14532d"]}
  onCellClick={(cell) => setDrill({ day: cell.serieId, hour: cell.x })}
  height={280}
/>`,
      },
    ],
    relatedComponents: ["BarChart", "DataTable"],
    configFields: ["variant", "animate", "dense"],
    notes: [
      "Uses forwardRef — attach a ref to the root div.",
      "Uses ChartContainer for consistent card styling.",
      "simpleData shorthand converts { row: { col: value } } to the series format automatically.",
      "Sequential color scale uses blues scheme. Diverging uses red-yellow-green.",
      "Custom colors array overrides the preset color scales.",
      "crossFilter prop emits a selection signal on click — it does NOT change the chart's appearance. The dev reads the selection via useCrossFilter() and filters their own data.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
    ],
  },
  // =========================================================================
  // StatusIndicator
  // =========================================================================
  {
    name: "StatusIndicator",
    importName: "StatusIndicator",
    category: "ui" as const,
    tier: "free",
    description: "Rule-based status display with threshold coloring, pulse animation, and five size modes.",
    longDescription:
      "StatusIndicator evaluates a numeric value against an ordered list of rules and renders the matching status with color, icon, and label. Supports five size modes: dot (tiny inline circle), sm (dot + label), md (icon badge + label), lg (prominent standalone), and card (full card shell matching KpiCard). Features include pulse animation for attention states, trend arrows, time-in-state display, named colors (emerald, red, amber, blue, gray, purple, cyan) or custom CSS colors, and loading skeletons. Uses forwardRef.",
    props: [
      { name: "value", type: "number | null | undefined", required: true, description: "The value to evaluate against rules. Not displayed unless showValue is true." },
      { name: "rules", type: "StatusRule[]", required: true, description: "Rules evaluated top-to-bottom. First match wins. Last rule with no min/max is the fallback." },
      { name: "size", type: "StatusSize", required: false, default: '"md"', description: 'Display mode: "dot", "sm", "md", "lg", or "card".' },
      { name: "showValue", type: "boolean", required: false, default: "false", description: "Show the underlying numeric value." },
      { name: "title", type: "string", required: false, description: 'Title label (shown in "card" and "lg" sizes).' },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "subtitle", type: "string", required: false, description: "Subtitle or secondary text." },
      { name: "since", type: "Date", required: false, description: "How long the indicator has been in the current state." },
      { name: "trend", type: "number[]", required: false, description: "History of recent values — shown as a trend arrow." },
      { name: "tooltip", type: "string", required: false, description: "Tooltip content on hover. Defaults to the matched rule's label." },
      { name: "onClick", type: "() => void", required: false, description: "Click handler." },
      { name: "loading", type: "boolean", required: false, description: "Loading state — shows skeleton." },
      { name: "className", type: "string", required: false, description: "Additional class names." },
      { name: "classNames", type: "{ root?: string; icon?: string; label?: string; value?: string }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    dataShape: `interface StatusRule {
  min?: number;   // Minimum value (inclusive). Omit for fallback.
  max?: number;   // Maximum value (exclusive). Omit for no upper bound.
  color: string;  // Named color or CSS color string.
  icon?: React.ReactNode;
  label?: string; // e.g. "Healthy", "Critical"
  pulse?: boolean;
}

type StatusSize = "dot" | "sm" | "md" | "lg" | "card";`,
    minimalExample: `<StatusIndicator
  value={95}
  rules={[
    { min: 90, color: "emerald", label: "Healthy" },
    { min: 60, max: 90, color: "amber", label: "Degraded" },
    { max: 60, color: "red", label: "Critical" },
  ]}
/>`,
    examples: [
      {
        title: "Service health card",
        description: "Card-mode StatusIndicator with title, trend, and value display.",
        code: `<StatusIndicator
  value={99.98}
  rules={[
    { min: 99.9, color: "emerald", label: "Operational" },
    { min: 99, max: 99.9, color: "amber", label: "Partial Outage" },
    { max: 99, color: "red", label: "Major Outage", pulse: true },
  ]}
  size="card"
  title="API Gateway"
  showValue
  trend={[99.9, 99.95, 99.98]}
/>`,
      },
      {
        title: "Inline table status",
        description: "Dot or sm size inside a DataTable cell renderer.",
        code: `<DataTable
  data={services}
  columns={[
    { key: "name", header: "Service" },
    {
      key: "uptime",
      header: "Status",
      render: (v) => (
        <StatusIndicator
          value={Number(v)}
          rules={[
            { min: 99.9, color: "emerald", label: "Operational" },
            { min: 99, max: 99.9, color: "amber", label: "Degraded" },
            { max: 99, color: "red", label: "Down" },
          ]}
          size="sm"
        />
      ),
    },
  ]}
/>`,
      },
    ],
    relatedComponents: ["KpiCard", "Badge", "DataTable"],
    configFields: ["variant", "dense", "loading"],
    notes: [
      "Uses forwardRef — you can pass a ref to the root element.",
      "Rules are evaluated top-to-bottom; first match wins. The last rule acts as fallback if no min/max match.",
      "Named colors (emerald, green, red, amber, yellow, blue, gray, purple, cyan) map to CSS variables. Any other string is treated as a raw CSS color.",
      "Card mode uses the same CARD_CLASSES and HOVER_CLASSES as KpiCard for visual consistency.",
      "The dot size is ideal for inline use in tables or next to text. The card size is a full card shell.",
    ],
  },

  // =========================================================================
  // Callout
  // =========================================================================
  {
    name: "Callout",
    importName: "Callout",
    category: "ui" as const,
    tier: "free",
    description: "Styled message block with info, warning, success, and error variants. Supports data-driven rules, embedded metrics, collapsible detail, action buttons, and auto-dismiss.",
    longDescription:
      "Callout is a versatile alert/message component for dashboards. It supports four visual variants (info, warning, success, error), data-driven mode where a numeric value is evaluated against rules to auto-select variant and message, embedded formatted metrics, dismissible with fade animation and auto-dismiss timer, collapsible detail sections, action buttons, dense mode, and full classNames customization. Uses forwardRef.",
    props: [
      { name: "variant", type: "CalloutVariant", required: false, default: '"info"', description: 'Visual variant: "info", "warning", "success", or "error". Ignored when rules is used.' },
      { name: "title", type: "string", required: false, description: "Title text." },
      { name: "children", type: "React.ReactNode", required: false, description: "Body content." },
      { name: "icon", type: "React.ReactNode | null", required: false, description: "Icon override. Default: auto-picked per variant. Set to null to hide." },
      { name: "value", type: "number | null", required: false, description: "Value to evaluate against rules (data-driven mode)." },
      { name: "rules", type: "CalloutRule[]", required: false, description: "Rules evaluated top-to-bottom. First match wins. Supports {value} placeholder in title/message." },
      { name: "metric", type: "CalloutMetric", required: false, description: "Embedded formatted metric value with label." },
      { name: "dismissible", type: "boolean", required: false, default: "false", description: "Show dismiss button." },
      { name: "onDismiss", type: "() => void", required: false, description: "Callback when dismissed." },
      { name: "autoDismiss", type: "number", required: false, default: "0", description: "Auto-dismiss after N milliseconds. 0 = never." },
      { name: "action", type: "CalloutAction", required: false, description: "Action button with label and onClick." },
      { name: "detail", type: "React.ReactNode", required: false, description: "Collapsible detail content — hidden by default, toggle to show." },
      { name: "detailOpen", type: "boolean", required: false, default: "false", description: "Whether detail starts expanded." },
      { name: "dense", type: "boolean", required: false, default: "false", description: "Compact layout. Falls back to config.dense." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; icon?: string; title?: string; body?: string; metric?: string; action?: string }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "drillDown", type: "boolean | ((event: { value: number | null; variant: CalloutVariant }) => React.ReactNode)", required: false, description: "Enable drill-down on callout click. `true` auto-generates a detail panel. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `interface CalloutRule {
  min?: number;     // Minimum value (inclusive). Omit for fallback.
  max?: number;     // Maximum value (exclusive). Omit for no upper bound.
  variant: CalloutVariant;  // Variant to apply.
  title?: string;   // Title text. Supports {value} placeholder.
  message?: string; // Message text. Supports {value} placeholder.
  icon?: React.ReactNode;
}

interface CalloutMetric {
  value: number;
  format?: FormatOption;
  label?: string;
}

interface CalloutAction {
  label: string;
  onClick: () => void;
}

type CalloutVariant = "info" | "warning" | "success" | "error";`,
    minimalExample: `<Callout variant="info" title="Heads up">
  This is an informational message.
</Callout>`,
    examples: [
      {
        title: "Data-driven alert",
        description: "Callout that auto-selects variant and message based on a numeric value.",
        code: `<Callout
  value={cpuUsage}
  rules={[
    { min: 90, variant: "error", title: "CPU Critical", message: "Usage at {value}%. Scale up immediately." },
    { min: 70, max: 90, variant: "warning", title: "CPU High", message: "Usage at {value}%. Monitor closely." },
    { max: 70, variant: "success", title: "CPU Normal", message: "Usage at {value}%. All good." },
  ]}
/>`,
      },
      {
        title: "Metric callout with action",
        description: "Success callout with an embedded formatted metric and action button.",
        code: `<Callout
  variant="success"
  title="Revenue milestone reached"
  metric={{ value: 1000000, format: "currency", label: "total revenue" }}
  action={{ label: "View report", onClick: () => router.push("/reports") }}
>
  Your team crossed the $1M revenue mark this quarter.
</Callout>`,
      },
      {
        title: "Dismissible warning with detail",
        description: "Warning callout with collapsible detail section and dismiss button.",
        code: `<Callout
  variant="warning"
  title="3 services experiencing elevated latency"
  dismissible
  detail={
    <div className="space-y-1">
      <p>API Gateway: p99 450ms (threshold: 200ms)</p>
      <p>Auth Service: p99 320ms (threshold: 150ms)</p>
      <p>Search: p99 280ms (threshold: 100ms)</p>
    </div>
  }
>
  Some services are responding slower than expected.
</Callout>`,
      },
    ],
    relatedComponents: ["StatusIndicator", "Badge", "KpiCard"],
    configFields: ["dense"],
    notes: [
      "Uses forwardRef — you can pass a ref to the root element.",
      "Rules are evaluated top-to-bottom; first match wins. Use {value} placeholder in title/message for interpolation.",
      "The metric prop uses the format engine — pass any FormatOption (currency, percent, compact, etc.).",
      "Dismissible callouts fade out with a 200ms animation before removing from the DOM.",
      "autoDismiss sets a timer in milliseconds; useful for transient success messages.",
      "Has role='alert' for screen readers.",
      "In MetricGrid, Callout takes full width automatically (__gridHint = 'full').",
    ],
  },

  // -------------------------------------------------------------------------
  // SectionHeader
  // -------------------------------------------------------------------------
  {
    name: "SectionHeader",
    importName: "SectionHeader",
    category: "ui" as const,
    tier: "free",
    description: "Standalone section title with subtitle, description popover, action slot, and inline badge. For separating dashboard sections.",
    longDescription:
      "SectionHeader renders an uppercase, accent-colored section title with optional subtitle, description popover (? icon), right-aligned action slot, and inline badge. Supports border, spacing control, dense mode, and classNames overrides. MetricGrid.Section is a convenience wrapper that delegates to SectionHeader internally for automatic full-width span in grid layouts. Uses forwardRef.",
    props: [
      { name: "title", type: "string", required: true, description: "Section title — rendered uppercase, tracked, accent-colored." },
      { name: "subtitle", type: "string", required: false, description: "Subtitle — rendered below title in muted text." },
      { name: "description", type: "string | React.ReactNode", required: false, description: 'Description — renders as a "?" popover next to the title.' },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot — rendered right-aligned. Buttons, links, toggles." },
      { name: "badge", type: "React.ReactNode", required: false, description: "Badge or status indicator — rendered inline after the title." },
      { name: "border", type: "boolean", required: false, default: "false", description: "Bottom border for visual separation." },
      { name: "spacing", type: "boolean", required: false, default: "true", description: "Top margin. Set false when you control spacing externally." },
      { name: "dense", type: "boolean", required: false, description: "Dense mode — smaller text. Falls back to config.dense." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the root element." },
      { name: "classNames", type: "{ root?: string; title?: string; subtitle?: string; action?: string }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    minimalExample: `<SectionHeader title="Revenue" />`,
    examples: [
      {
        title: "With subtitle and border",
        description: "Section header with subtitle and bottom border for visual separation.",
        code: `<SectionHeader
  title="Performance"
  subtitle="Last 30 days compared to previous period"
  border
/>`,
      },
      {
        title: "With action and badge",
        description: "Section header with a right-aligned action link and inline badge.",
        code: `<SectionHeader
  title="Recent Orders"
  subtitle="Last 7 days"
  action={<button className="text-xs text-[var(--accent)]">View all</button>}
  badge={<Badge variant="info" size="sm">3 new</Badge>}
/>`,
      },
      {
        title: "With description popover",
        description: "Section header with a description popover for contextual info.",
        code: `<SectionHeader
  title="Revenue"
  description="Revenue includes recurring subscriptions, one-time purchases, and services. Refunds excluded."
/>`,
      },
    ],
    relatedComponents: ["MetricGrid", "DashboardHeader", "Badge"],
    configFields: ["dense"],
    notes: [
      "Uses forwardRef — you can pass a ref to the root element.",
      "MetricGrid.Section is a convenience wrapper that delegates to SectionHeader with automatic full-width grid span.",
      "Title renders uppercase with tracking-widest and accent color by default.",
      "Dense mode reduces title from 10px to 9px and subtitle from text-sm to text-xs.",
      "spacing=true (default) adds mt-8 (or mt-4 in dense mode). Set spacing=false when you control spacing externally.",
    ],
  },

  // -------------------------------------------------------------------------
  // Divider
  // -------------------------------------------------------------------------
  {
    name: "Divider",
    importName: "Divider",
    category: "ui" as const,
    tier: "free",
    description: "Themed horizontal or vertical rule with optional centered label or icon.",
    longDescription:
      "Divider renders a separator line between dashboard sections. Supports horizontal and vertical orientations, solid/dashed/dotted line styles, optional centered label or icon, accent coloring, configurable spacing (none/sm/md/lg), and dense mode. Sets role='separator' and aria-orientation for accessibility. Uses forwardRef. Grid hint 'full' ensures full-width inside MetricGrid.",
    props: [
      { name: "label", type: "string", required: false, description: "Label centered in the divider line." },
      { name: "icon", type: "React.ReactNode", required: false, description: "Icon centered in the divider line (replaces label)." },
      { name: "orientation", type: '"horizontal" | "vertical"', required: false, default: '"horizontal"', description: "Divider orientation." },
      { name: "variant", type: '"solid" | "dashed" | "dotted"', required: false, default: '"solid"', description: "Line style." },
      { name: "spacing", type: '"none" | "sm" | "md" | "lg"', required: false, default: '"md"', description: "Vertical spacing around horizontal dividers / horizontal spacing around vertical dividers. 'none' removes spacing." },
      { name: "accent", type: "boolean", required: false, default: "false", description: "Use accent color for the line instead of muted border color." },
      { name: "dense", type: "boolean", required: false, description: "Dense mode — halves spacing values. Falls back to config.dense." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    minimalExample: `<Divider />`,
    examples: [
      {
        title: "Divider with label",
        description: "Centered label between two line segments.",
        code: `<Divider label="or" />`,
      },
      {
        title: "Dashed accent divider",
        description: "Dashed line style with accent coloring.",
        code: `<Divider variant="dashed" accent />`,
      },
      {
        title: "Vertical divider between elements",
        description: "Vertical separator between side-by-side content.",
        code: `<div className="flex h-16 items-center">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`,
      },
    ],
    relatedComponents: ["SectionHeader", "MetricGrid", "DashboardHeader"],
    configFields: ["dense"],
    notes: [
      "Uses forwardRef — you can pass a ref to the root element.",
      "Sets role='separator' and aria-orientation for accessibility.",
      "Icon takes precedence over label when both are provided.",
      "Grid hint is 'full' — dividers span full width inside MetricGrid.",
      "Dense mode halves all spacing values (e.g. md goes from my-4 to my-2).",
      "Accent mode colors both the line and any label/icon text.",
    ],
  },

  // -------------------------------------------------------------------------
  // Funnel
  // -------------------------------------------------------------------------
  {
    name: "Funnel",
    importName: "Funnel",
    category: "chart" as const,
    tier: "free",
    description: "Conversion funnel chart showing value drop-off between stages. ",
    longDescription:
      "Funnel renders a series of stages showing how values decrease through a process (e.g. signup pipeline). Supports vertical and horizontal layouts, smooth or linear interpolation, configurable shape blending (rectangles to smooth trapezoids), conversion rate annotations between stages, separator lines, custom colors per stage, interactive legends with toggle, click handlers with percentage data, and the simpleData shorthand (plain key-value object). Integrates with MetricProvider, format engine, and data states.",
    props: [
      { name: "data", type: "FunnelDatumInput[]", required: true, description: "Array of funnel stages with id, label, value, and optional color." },
      { name: "simpleData", type: "Record<string, number>", required: false, description: 'Simple key-value object like { "Visited": 10000, "Signed Up": 4200 }. Converted to FunnelDatumInput[] internally. data takes precedence.' },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for values in tooltips and labels." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "direction", type: '"vertical" | "horizontal"', required: false, default: '"vertical"', description: "Funnel layout direction." },
      { name: "interpolation", type: '"smooth" | "linear"', required: false, default: '"smooth"', description: "Edge curve interpolation." },
      { name: "spacing", type: "number", required: false, default: "4", description: "Gap between stages in px." },
      { name: "shapeBlending", type: "number", required: false, default: "0.66", description: "Shape blending factor (0 = rectangles, 1 = smooth funnel)." },
      { name: "fillOpacity", type: "number", required: false, default: "1", description: "Fill opacity." },
      { name: "borderWidth", type: "number", required: false, default: "0", description: "Border width." },
      { name: "enableLabel", type: "boolean", required: false, default: "true", description: "Show value labels on each stage." },
      { name: "enableSeparators", type: "boolean", required: false, default: "true", description: "Show separator lines between stages." },
      { name: "showConversionRate", type: "boolean", required: false, default: "false", description: "Show conversion rate percentages between stages." },
      { name: "currentPartSizeExtension", type: "number", required: false, default: "10", description: "Hover expansion size in px." },
      { name: "colors", type: "string[]", required: false, description: "Stage colors. Default: theme series palette." },
      { name: "legend", type: "boolean | LegendConfig", required: false, description: "Legend configuration." },
      { name: "onPartClick", type: "(part: { id: string; value: number; label: string; percentage: number }) => void", required: false, description: "Click handler for funnel stages." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant. CSS-variable-driven via [data-variant]." },
      { name: "dense", type: "boolean", required: false, description: "Compact layout." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string; legend?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
      { name: "drillDown", type: "boolean | ((event: { id: string; value: number; label: string; percentage: number }) => React.ReactNode)", required: false, description: "Enable drill-down on stage click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `interface FunnelDatumInput {
  id: string;        // Unique identifier
  label: string;     // Display label
  value: number;     // Value at this stage
  color?: string;    // Optional custom color
}

// Simple format alternative:
type SimpleFunnelData = Record<string, number>;
// e.g. { "Visited": 10000, "Signed Up": 4200, "Subscribed": 1400 }`,
    minimalExample: `<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
  ]}
  title="Signup Funnel"
/>`,
    examples: [
      {
        title: "Funnel with conversion rates",
        description: "Vertical funnel showing step-to-step conversion percentages.",
        code: `<Funnel
  data={[
    { id: "visited", label: "Visited", value: 10000 },
    { id: "signed-up", label: "Signed Up", value: 4200 },
    { id: "activated", label: "Activated", value: 2800 },
    { id: "subscribed", label: "Subscribed", value: 1400 },
    { id: "retained", label: "Retained", value: 980 },
  ]}
  title="Conversion Funnel"
  showConversionRate
  height={360}
/>`,
      },
      {
        title: "Horizontal funnel",
        description: "Horizontal layout for wider containers.",
        code: `<Funnel
  data={pipelineData}
  direction="horizontal"
  title="Sales Pipeline"
  height={240}
/>`,
      },
      {
        title: "Simple data format",
        description: "Using the simpleData shorthand — no ids or labels needed.",
        code: `<Funnel
  data={[]}
  simpleData={{
    "Leads": 5000,
    "Qualified": 2800,
    "Proposal": 1200,
    "Closed Won": 450,
  }}
  title="Sales Pipeline"
/>`,
      },
    ],
    relatedComponents: ["DonutChart", "BarChart"],
    configFields: ["animate", "variant", "dense", "colors", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "simpleData is converted to FunnelDatumInput[] internally; data takes precedence when non-empty.",
      "Conversion rate annotations are rendered as a custom SVG layer.",
      "Tooltips show absolute value and percentage of the first stage's value.",
      "The onPartClick callback includes a percentage field (relative to first stage).",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
    ],
  },

  // -------------------------------------------------------------------------
  // BulletChart
  // -------------------------------------------------------------------------
  {
    name: "BulletChart",
    importName: "BulletChart",
    category: "chart" as const,
    tier: "free",
    description: "Bullet chart for comparing actual values against targets with qualitative range bands. ",
    longDescription:
      "BulletChart renders one or more horizontal (or vertical) bars comparing an actual measured value against a target marker, overlaid on qualitative range bands (e.g. poor / satisfactory / good). Supports full BulletDatum format and a simpleData shorthand (label/value/target/max/zones). Auto-calculates height from item count, provides theme-aware range colors, configurable measure and marker sizes, title positioning, and axis visibility. Integrates with MetricProvider, format engine, and data states.",
    props: [
      { name: "data", type: "BulletDatum[]", required: false, description: "Full bullet data with id, title, ranges, measures, markers." },
      { name: "simpleData", type: "SimpleBulletData[]", required: false, description: "Simple shorthand format: label, value, target, max, zones. data takes precedence." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for values in tooltips." },
      { name: "height", type: "number", required: false, description: "Height in px. Default: auto-calculated from item count." },
      { name: "layout", type: '"horizontal" | "vertical"', required: false, default: '"horizontal"', description: "Layout direction." },
      { name: "spacing", type: "number", required: false, default: "40", description: "Gap between bullet items in px." },
      { name: "rangeColors", type: "string[]", required: false, description: "Range color scheme. Default: theme-aware greens." },
      { name: "measureColors", type: "string[]", required: false, description: "Measure (bar) color scheme. Default: theme accent." },
      { name: "markerColors", type: "string[]", required: false, description: "Marker color scheme. Default: theme foreground." },
      { name: "measureSize", type: "number", required: false, default: "0.4", description: "Size of the measure bar relative to the range (0-1)." },
      { name: "markerSize", type: "number", required: false, default: "0.6", description: "Size of the marker relative to the range height." },
      { name: "titlePosition", type: '"before" | "after"', required: false, default: '"before"', description: "Title position relative to the bullet." },
      { name: "showAxis", type: "boolean", required: false, default: "true", description: "Show axis." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant." },
      { name: "dense", type: "boolean", required: false, description: "Compact layout." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
    ],
    dataShape: `interface BulletDatum {
  id: string;
  title?: React.ReactNode;
  ranges: number[];      // Cumulative endpoints: [150, 225, 300]
  measures: number[];    // Actual value bars
  markers?: number[];    // Target marker lines
}

interface SimpleBulletData {
  label: string;
  value: number;
  target?: number;
  max?: number;          // Default: auto from target or value * 1.2
  zones?: number[];      // Percentages of max. Default: [60, 80, 100]
}`,
    minimalExample: `<BulletChart
  simpleData={[
    { label: "Revenue", value: 850000, target: 1000000 },
    { label: "NPS", value: 72, target: 80, max: 100 },
  ]}
  title="Performance"
/>`,
    examples: [
      {
        title: "Full data format",
        description: "Using the full BulletDatum format with explicit ranges, measures, and markers.",
        code: `<BulletChart
  data={[
    {
      id: "revenue",
      title: "Revenue",
      ranges: [600000, 800000, 1000000],
      measures: [850000],
      markers: [1000000],
    },
    {
      id: "satisfaction",
      title: "Satisfaction",
      ranges: [50, 70, 100],
      measures: [78],
      markers: [85],
    },
  ]}
  title="Q1 Performance"
/>`,
      },
      {
        title: "Simple data format",
        description: "Using the simpleData shorthand for the common value-vs-target case.",
        code: `<BulletChart
  simpleData={[
    { label: "MRR", value: 85000, target: 100000, max: 120000 },
    { label: "NPS Score", value: 72, target: 80, max: 100 },
    { label: "Response Time", value: 120, target: 100, max: 200 },
  ]}
  title="SaaS Metrics"
/>`,
      },
      {
        title: "OKR Scorecard",
        description: "Stacked bullets for a compact objectives scorecard.",
        code: `<BulletChart
  simpleData={[
    { label: "Revenue", value: 850000, target: 1000000, max: 1200000 },
    { label: "Active Users", value: 3200, target: 5000, max: 6000 },
    { label: "NPS", value: 72, target: 80, max: 100 },
    { label: "Churn Rate", value: 3.2, target: 2.5, max: 5 },
  ]}
  title="Q1 OKR Scorecard"
  subtitle="Actuals vs targets"
  spacing={32}
/>`,
      },
    ],
    relatedComponents: ["Gauge", "KpiCard", "StatGroup"],
    configFields: ["animate", "variant", "dense", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses forwardRef — attach a ref to the root div.",
      "simpleData auto-generates ranges from zone percentages (default: [60, 80, 100]). data takes precedence when non-empty.",
      "Height auto-calculates from item count when not specified.",
      "Range colors are theme-aware (light green shades in light mode, dark green shades in dark mode).",
      "Marker lines represent targets; measures are the actual value bars.",
      "The tooltip uses ChartTooltip and respects the format prop.",
    ],
  },

  // -------------------------------------------------------------------------
  // Waterfall
  // -------------------------------------------------------------------------
  {
    name: "Waterfall",
    importName: "Waterfall",
    category: "chart" as const,
    tier: "free",
    description: "Waterfall chart showing sequential positive and negative changes from a starting value. ",
    longDescription:
      "Waterfall renders a series of bars showing how individual positive and negative values contribute to a running total. Uses a stacked spacer technique — transparent spacer bars create the floating effect. Supports value, subtotal, and total item types. Subtotals show the running total without resetting; totals show and reset. Connector lines (dashed) link adjacent bars. Positive bars are green, negative are red, subtotal/total bars use the accent color. Integrates with MetricProvider, format engine, and data states.",
    props: [
      { name: "data", type: "WaterfallItem[]", required: true, description: "Array of waterfall items with label, value, optional type and color." },
      { name: "title", type: "string", required: false, description: "Chart card title." },
      { name: "subtitle", type: "string", required: false, description: "Chart card subtitle." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Description popover." },
      { name: "footnote", type: "string", required: false, description: "Footnote." },
      { name: "action", type: "React.ReactNode", required: false, description: "Action slot." },
      { name: "format", type: "FormatOption", required: false, description: "Format for axis labels, bar value labels, and tooltips." },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in px." },
      { name: "positiveColor", type: "string", required: false, description: "Color for positive (increase) bars. Default: theme positive color." },
      { name: "negativeColor", type: "string", required: false, description: "Color for negative (decrease) bars. Default: theme negative color." },
      { name: "totalColor", type: "string", required: false, description: "Color for subtotal/total bars. Default: theme accent." },
      { name: "connectors", type: "boolean", required: false, default: "true", description: "Show dashed connector lines between bars." },
      { name: "enableLabels", type: "boolean", required: false, default: "true", description: "Show value labels on bars." },
      { name: "borderRadius", type: "number", required: false, default: "3", description: "Corner radius on bars." },
      { name: "padding", type: "number", required: false, default: "0.35", description: "Padding between bars (0-1)." },
      { name: "enableGridY", type: "boolean", required: false, default: "true", description: "Show Y-axis grid lines." },
      { name: "yAxisLabel", type: "string", required: false, description: "Y-axis label." },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable/disable animation." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant." },
      { name: "dense", type: "boolean", required: false, description: "Compact layout." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?: string; header?: string; chart?: string }", required: false, description: "Sub-element class name overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
      { name: "loading", type: "boolean", required: false, description: "Loading state." },
      { name: "empty", type: "EmptyState", required: false, description: "Empty state." },
      { name: "error", type: "ErrorState", required: false, description: "Error state." },
      { name: "stale", type: "StaleState", required: false, description: "Stale indicator." },
      { name: "drillDown", type: "boolean | ((event: { label: string; value: number; runningTotal: number }) => React.ReactNode)", required: false, description: "Enable drill-down on bar click. `true` auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for full control over the panel content. Requires DrillDown.Root wrapper." },
      { name: "drillDownMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Presentation mode for the drill-down panel. "slide-over" (default) slides from the right, full height. "modal" renders centered and compact.' },
    ],
    dataShape: `interface WaterfallItem {
  label: string;          // Display label
  value?: number;         // Positive for increase, negative for decrease. Ignored for subtotal/total.
  type?: "value" | "subtotal" | "total";  // Default: "value". subtotal/total are auto-computed.
  color?: string;         // Custom color override for this bar
}`,
    minimalExample: `<Waterfall
  data={[
    { label: "Revenue", value: 500000 },
    { label: "COGS", value: -200000 },
    { label: "Net", type: "total" },
  ]}
  title="P&L Bridge"
  format="currency"
/>`,
    examples: [
      {
        title: "P&L bridge with subtotal",
        description: "Full P&L waterfall with gross profit subtotal and net income total.",
        code: `<Waterfall
  data={[
    { label: "Revenue", value: 500000 },
    { label: "COGS", value: -200000 },
    { label: "Gross Profit", type: "subtotal" },
    { label: "OpEx", value: -100000 },
    { label: "Marketing", value: -50000 },
    { label: "Net Income", type: "total" },
  ]}
  title="P&L Bridge"
  format="currency"
  height={320}
/>`,
      },
      {
        title: "Quarterly revenue changes",
        description: "Showing how quarterly changes contribute to the annual total.",
        code: `<Waterfall
  data={[
    { label: "Q1", value: 120000 },
    { label: "Q2", value: 45000 },
    { label: "Q3", value: -30000 },
    { label: "Q4", value: 65000 },
    { label: "FY Total", type: "total" },
  ]}
  title="Quarterly Revenue"
  format="currency"
/>`,
      },
    ],
    relatedComponents: ["BarChart", "BulletChart", "KpiCard"],
    configFields: ["animate", "variant", "dense", "motionConfig"],
    notes: [
      "Uses forwardRef.",
      "Uses a stacked spacer technique — transparent spacer bars create the floating effect.",
      "Positive values show in green, negative in red, subtotal/total bars use the accent color.",
      "Connector lines (dashed) link adjacent bar tops. Disabled for total bars that start from zero.",
      "Items with type 'subtotal' show the running total without resetting. Items with type 'total' show and reset.",
      "Tooltips show item value plus running total for non-total items.",
      "Custom colors per bar override the default positive/negative/total coloring.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the chart's source data. Pass a render function for custom panel content. Requires DrillDown.Root wrapper.",
    ],
  },

  // -------------------------------------------------------------------------
  // MetricGrid
  // -------------------------------------------------------------------------
  {
    name: "MetricGrid",
    importName: "MetricGrid",
    category: "ui" as const,
    tier: "free",
    description: "Smart auto-layout grid for dashboards. Drop components in, it figures out the layout from component types.",
    longDescription:
      "MetricGrid automatically detects what MetricUI components are inside it and creates the right dashboard layout. KPI cards go in equal-width rows, two charts get a 2:1 split, tables go full width. Zero Tailwind classes needed. Override with MetricGrid.Item when the auto-layout isn't right. MetricGrid.Section adds labeled dividers between groups.",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "MetricUI components. Layout is auto-detected from component types." },
      { name: "columns", type: "number", required: false, default: "4", description: "Max small items (KPIs, Gauges) per row." },
      { name: "gap", type: "number", required: false, default: "16", description: "Gap between items in px. Dense mode uses 12." },
      { name: "className", type: "string", required: false, description: "Additional class names." },
      { name: "id", type: "string", required: false, description: "HTML id." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    dataShape: undefined,
    minimalExample: `<MetricGrid>
  <KpiCard title="Revenue" value={78400} format="currency" />
  <KpiCard title="Users" value={3200} />
  <KpiCard title="Conversion" value={4.2} format="percent" />
  <AreaChart data={data} title="Revenue Over Time" />
  <DonutChart data={slices} title="Traffic Sources" />
  <DataTable data={rows} title="Top Pages" />
</MetricGrid>`,
    examples: [
      {
        title: "Dashboard with sections",
        description: "Labeled sections dividing the dashboard into groups.",
        code: `<MetricGrid>
  <MetricGrid.Section title="Overview" subtitle="Key metrics" />
  <KpiCard title="Revenue" value={78400} format="currency" />
  <KpiCard title="Users" value={3200} />
  <KpiCard title="Conversion" value={4.2} format="percent" />

  <MetricGrid.Section title="Performance" />
  <AreaChart data={revenueData} title="Revenue Over Time" />
  <DonutChart data={trafficData} title="Traffic Sources" />

  <MetricGrid.Section title="Details" />
  <DataTable data={tableData} title="Top Pages" />
</MetricGrid>`,
      },
      {
        title: "Manual override with MetricGrid.Item",
        description: "Force a chart to full width instead of auto-pairing.",
        code: `<MetricGrid>
  <KpiCard title="Revenue" value={78400} format="currency" />
  <KpiCard title="Users" value={3200} />

  <MetricGrid.Item span="full">
    <AreaChart data={data} title="Revenue Over Time" />
  </MetricGrid.Item>

  <DataTable data={tableData} title="Details" />
</MetricGrid>`,
      },
    ],
    relatedComponents: ["KpiCard", "AreaChart", "DataTable"],
    configFields: ["dense"],
    notes: [
      "Auto-layout rules: consecutive KPIs → equal-width row, two charts → 2:1 split, single chart → full width, table → full width.",
      "Items in the same row always fill the space evenly. 3 KPIs = thirds, not 3 + gap.",
      "Unknown component types default to full width — no lock-in.",
      "MetricGrid.Section renders a full-width labeled divider with the same muted uppercase style.",
      "MetricGrid.Item accepts span='sm'|'md'|'lg'|'full' or a column count number.",
      "Responsive: 4 cols at lg, 2 at sm, 1 below 640px.",
      "Reveal-on-scroll: each grid cell animates in with a staggered 60ms fade+slide. Respects animate={false} and prefers-reduced-motion.",
    ],
  },

  // =========================================================================
  // DashboardHeader
  // =========================================================================
  {
    name: "DashboardHeader",
    importName: "DashboardHeader",
    category: "ui" as const,
    tier: "free",
    description: "Top-level dashboard identity bar with title, live/stale status, auto-ticking 'Updated Xm ago', breadcrumbs, back navigation, and action slots.",
    longDescription:
      "DashboardHeader is the page-level header for MetricUI dashboards. It displays the dashboard title with an optional subtitle, description popover, and a status badge (live/stale/offline/loading) with pulsing dot animation. Pass `lastUpdated` to enable an auto-ticking 'Updated Xm ago' label that turns amber when stale. Supports breadcrumb navigation, back button, and an action slot for filters/controls (e.g., PeriodSelector). Uses the card shell styling and noise texture. Uses forwardRef.",
    props: [
      { name: "title", type: "string", required: true, description: "Dashboard title. Rendered as an h1 in monospace font." },
      { name: "subtitle", type: "string", required: false, description: "Secondary label below the title." },
      { name: "description", type: "string | React.ReactNode", required: false, description: "Content shown in a '?' popover next to the title. Use for dashboard explanation or data source info." },
      { name: "lastUpdated", type: "Date", required: false, description: "Timestamp of last data refresh. Enables auto-ticking 'Updated Xm ago' label (ticks every 15s). Turns amber when older than staleAfter minutes. Also auto-derives status to 'live' or 'stale' if status prop is not set." },
      { name: "staleAfter", type: "number", required: false, default: "5", description: "Minutes before 'last updated' turns amber and status auto-switches to 'stale'. Default: 5 minutes." },
      { name: "status", type: "DashboardStatus", required: false, description: "Status badge: 'live' (green pulsing dot), 'stale' (amber dot), 'offline' (red dot), 'loading' (gray pulsing dot). Auto-derived from lastUpdated/staleAfter if not set explicitly." },
      { name: "back", type: "{ href?: string; label?: string; onClick?: () => void }", required: false, description: "Back navigation link/button. Shows arrow icon + label. Rendered as <a> if href provided, <button> otherwise. Hidden when breadcrumbs are present." },
      { name: "breadcrumbs", type: "BreadcrumbItem[]", required: false, description: "Breadcrumb trail. Each item: { label, href?, onClick? }. Last item is styled as current page. Chevron separators between items." },
      { name: "actions", type: "React.ReactNode", required: false, description: "Right-aligned action slot. Place PeriodSelector, SegmentToggle, buttons, or any controls here." },
      { name: "variant", type: "CardVariant", required: false, description: "Card variant. Falls back to MetricProvider." },
      { name: "dense", type: "boolean", required: false, description: "Compact layout. Falls back to MetricProvider." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names." },
      { name: "classNames", type: "{ root?, title?, subtitle?, breadcrumbs?, status?, actions? }", required: false, description: "Sub-element class overrides." },
      { name: "id", type: "string", required: false, description: "HTML id attribute." },
      { name: "data-testid", type: "string", required: false, description: "Test id." },
    ],
    dataShape: `interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

type DashboardStatus = "live" | "stale" | "offline" | "loading";`,
    minimalExample: `<DashboardHeader title="Sales Dashboard" />`,
    examples: [
      {
        title: "Live dashboard with auto-updating status and filters",
        description: "Shows live status, auto-ticking timestamp, and PeriodSelector in the actions slot.",
        code: `<DashboardHeader
  title="Revenue Dashboard"
  subtitle="Real-time SaaS metrics"
  lastUpdated={new Date()}
  actions={<PeriodSelector comparison />}
/>`,
      },
      {
        title: "Dashboard with breadcrumbs and description",
        description: "Breadcrumb navigation trail with explanation popover.",
        code: `<DashboardHeader
  title="Customer Cohort Analysis"
  description="Monthly cohort retention rates computed from Stripe subscription events. Updated every 6 hours."
  breadcrumbs={[
    { label: "Dashboards", href: "/dashboards" },
    { label: "Customers", href: "/dashboards/customers" },
    { label: "Cohort Analysis" },
  ]}
  lastUpdated={lastRefresh}
  staleAfter={360}
/>`,
      },
      {
        title: "Dashboard with back navigation and multiple actions",
        description: "Back button, manual status, and multiple controls in actions.",
        code: `<DashboardHeader
  title="Order Details"
  subtitle={\`Order #\${orderId}\`}
  back={{ label: "All Orders", onClick: () => router.push("/orders") }}
  status="live"
  actions={
    <div className="flex items-center gap-2">
      <SegmentToggle options={["Summary", "Timeline", "Items"]} />
      <button onClick={refresh}>Refresh</button>
    </div>
  }
/>`,
      },
    ],
    relatedComponents: ["MetricProvider", "MetricGrid", "SectionHeader", "PeriodSelector"],
    configFields: ["variant", "dense"],
    notes: [
      "Uses forwardRef — attach a ref to the root div.",
      "Wrapped in ErrorBoundary for graceful error handling.",
      "Has __gridHint = 'header' for MetricGrid auto-layout — always renders full-width at the top.",
      "The status badge has a pulsing dot animation for 'live' and 'loading' states.",
      "lastUpdated auto-ticks every 15s — no manual polling needed.",
      "If both back and breadcrumbs are provided, breadcrumbs take priority (back is hidden).",
      "Uses the card shell (border, noise texture) for consistent visual hierarchy with other MetricUI components.",
    ],
  },

  // =========================================================================
  // FilterProvider
  // =========================================================================
  {
    name: "FilterProvider",
    importName: "FilterProvider",
    category: "ui" as const,
    tier: "free",
    description: "Context provider that wires PeriodSelector, DropdownFilter, SegmentToggle, and FilterTags together into a shared filter state.",
    longDescription:
      "FilterProvider creates a shared FilterContext that all MetricUI filter components read from and write to. Place it above your filter controls and dashboard content. PeriodSelector writes the selected period, DropdownFilter/SegmentToggle write dimension values, and FilterTags reads everything to display active filters. Your data-fetching components read the filter state via the useMetricFilters() hook. FilterProvider handles comparison period auto-computation and reset logic.",
    props: [
      { name: "defaultPreset", type: "PeriodPreset", required: false, description: "Default time period preset on mount. E.g., '30d', '7d', 'quarter'." },
      { name: "defaultDimensions", type: "Record<string, string[]>", required: false, description: "Default dimension filter values. E.g., { region: ['US', 'EU'], plan: ['pro'] }." },
      { name: "children", type: "React.ReactNode", required: true, description: "Child components that can read/write filter context." },
    ],
    dataShape: `// useMetricFilters() hook return shape:
interface FilterState {
  period: { start: Date; end: Date } | null;
  preset: PeriodPreset | null;
  comparisonMode: ComparisonMode;
  comparisonPeriod: { start: Date; end: Date } | null;
  dimensions: Record<string, string[]>;
  setPeriod: (range: DateRange, preset: PeriodPreset | null) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  setDimension: (field: string, values: string[]) => void;
  clearDimension: (field: string) => void;
  clearAll: () => void;
}`,
    minimalExample: `<FilterProvider defaultPreset="30d">
  <PeriodSelector comparison />
  <YourDashboardContent />
</FilterProvider>`,
    examples: [
      {
        title: "Complete filter system with all components",
        description: "FilterProvider wiring PeriodSelector, DropdownFilter, SegmentToggle, and FilterTags together.",
        code: `<FilterProvider defaultPreset="30d">
  <DashboardHeader
    title="Sales Dashboard"
    lastUpdated={new Date()}
    actions={<PeriodSelector comparison />}
  />
  <div className="flex items-center gap-2 mt-4">
    <SegmentToggle options={["All", "Enterprise", "SMB"]} field="segment" />
    <DropdownFilter label="Region" options={regions} field="region" multiple showAll />
  </div>
  <FilterTags />

  {/* Your dashboard reads filters via useMetricFilters() */}
  <DashboardContent />
</FilterProvider>`,
      },
      {
        title: "Reading filter state in a custom component",
        description: "Use useMetricFilters() to read the active filters and fetch data.",
        code: `import { useMetricFilters } from "metricui";

function SalesChart() {
  const filters = useMetricFilters();
  const { period, dimensions, comparisonPeriod } = filters;

  const data = useSalesData({
    start: period?.start,
    end: period?.end,
    region: dimensions.region,
    segment: dimensions.segment,
  });

  return (
    <AreaChart
      data={data.current}
      comparisonData={comparisonPeriod ? data.comparison : undefined}
      title="Sales Trend"
      format="currency"
    />
  );
}`,
      },
    ],
    relatedComponents: ["PeriodSelector", "DropdownFilter", "SegmentToggle", "FilterTags", "DashboardHeader"],
    configFields: [],
    notes: [
      "FilterProvider is UI-only — it manages filter state, not data fetching. You bring the data.",
      "Comparison periods are auto-computed. 'previous' shifts backward by the range duration. 'year-over-year' shifts back one year.",
      "clearAll() resets to defaultPreset and defaultDimensions.",
      "FilterProvider can be nested for sub-dashboard filter scopes.",
      "Without FilterProvider, all filter components work in standalone mode via onChange callbacks.",
    ],
  },

  // =========================================================================
  // CrossFilterProvider
  // =========================================================================
  {
    name: "CrossFilterProvider",
    importName: "CrossFilterProvider",
    category: "ui" as const,
    tier: "free",
    description: "Context provider for cross-filtering. Charts with crossFilter prop emit selections; dev reads state via useCrossFilter() and filters their own data.",
    longDescription:
      "CrossFilterProvider creates a shared cross-filter context. Wrap it around your dashboard and add crossFilter prop to charts/tables. When a user clicks a bar, slice, or row, the chart emits a selection signal ({ field, value }). The provider holds the selection — it NEVER touches data or visuals. The dev reads the selection via useCrossFilter() and filters their own data before passing it to charts. Toggle behavior: clicking the same value deselects. Press Escape to clear. Same signal-only philosophy as FilterProvider.",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Child components that participate in cross-filtering." },
    ],
    dataShape: `// useCrossFilter() hook return shape:
interface CrossFilterState {
  selection: { field: string; value: string } | null;
  isActive: boolean;
  select: (field: string, value: string) => void;
  clear: () => void;
}`,
    minimalExample: `<CrossFilterProvider>
  <BarChart data={data} keys={["revenue"]} indexBy="region" crossFilter />
  <DataTable data={filteredData} columns={columns} />
</CrossFilterProvider>`,
    examples: [
      {
        title: "Cross-filter a dashboard by clicking a bar chart",
        description: "Click a bar to select a region, then filter other charts. Signal only — dev filters the data.",
        code: `import { CrossFilterProvider, useCrossFilter, BarChart, AreaChart, DataTable } from "metricui";

function Dashboard() {
  return (
    <CrossFilterProvider>
      <BarChart
        data={regionData}
        keys={["revenue"]}
        indexBy="region"
        crossFilter
        title="Revenue by Region"
      />
      <FilteredContent />
    </CrossFilterProvider>
  );
}

function FilteredContent() {
  const { selection, isActive } = useCrossFilter();

  // Dev filters their own data based on the selection
  const filtered = isActive
    ? allData.filter(d => d.region === selection!.value)
    : allData;

  return (
    <>
      <AreaChart data={toSeries(filtered)} title="Revenue Trend" format="currency" />
      <DataTable data={filtered} columns={columns} title="Transactions" />
    </>
  );
}`,
      },
      {
        title: "Cross-filter with explicit field override",
        description: "Override the field name emitted by the crossFilter prop.",
        code: `<CrossFilterProvider>
  <DonutChart
    data={browserData}
    crossFilter={{ field: "browser" }}
    title="Browser Share"
  />
  <FilteredCharts />
</CrossFilterProvider>`,
      },
    ],
    relatedComponents: ["FilterProvider", "BarChart", "DonutChart", "AreaChart", "HeatMap", "DataTable"],
    configFields: [],
    notes: [
      "CrossFilterProvider is SIGNAL ONLY — it holds the selection state but NEVER touches data or visuals. The dev reads the selection and filters their own data.",
      "Toggle behavior: clicking the same value again deselects it. Press Escape to clear.",
      "useCrossFilter() returns { selection, isActive, select, clear }.",
      "Charts with crossFilter={true} use their index/indexBy field. crossFilter={{ field: 'name' }} overrides.",
      "CrossFilterProvider is a filter, not a visual interaction — it belongs alongside FilterProvider.",
    ],
  },

  // =========================================================================
  // LinkedHoverProvider
  // =========================================================================
  {
    name: "LinkedHoverProvider",
    importName: "LinkedHoverProvider",
    category: "ui" as const,
    tier: "free",
    description: "Syncs hover state across sibling charts — crosshairs and tooltips move together.",
    longDescription:
      "LinkedHoverProvider wraps multiple charts and synchronizes hover state across them. When the user hovers over a point on one chart, all sibling charts inside the provider show their crosshairs and tooltips at the same x-axis position. Charts auto-participate when inside the provider — no extra prop needed. Shares hoveredIndex (x-axis value) and hoveredSeries across all children.",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Charts that should sync hover state." },
    ],
    dataShape: `// useLinkedHover() hook return shape:
interface LinkedHoverState {
  hoveredIndex: string | number | null;
  hoveredSeries: string | null;
}`,
    minimalExample: `<LinkedHoverProvider>
  <AreaChart data={revenueData} title="Revenue" />
  <AreaChart data={usersData} title="Users" />
</LinkedHoverProvider>`,
    examples: [
      {
        title: "Synchronized hover across two charts",
        description: "Hovering over one chart shows crosshairs on both. No extra props needed.",
        code: `<LinkedHoverProvider>
  <div className="grid grid-cols-2 gap-4">
    <AreaChart data={revenueData} title="Revenue" format="currency" />
    <AreaChart data={sessionsData} title="Sessions" format="compact" />
  </div>
</LinkedHoverProvider>`,
      },
    ],
    relatedComponents: ["AreaChart", "LineChart", "BarChart", "BarLineChart"],
    configFields: [],
    notes: [
      "Charts auto-participate when inside LinkedHoverProvider — no extra prop needed.",
      "Visual coordination only — syncs crosshairs and tooltips, does not filter data.",
      "Shares hoveredIndex (x-axis value) and hoveredSeries across siblings.",
      "useLinkedHover() hook returns { hoveredIndex, hoveredSeries } for custom usage.",
    ],
  },

  // =========================================================================
  // DrillDown.Root
  // =========================================================================
  {
    name: "DrillDown.Root",
    importName: "DrillDown",
    category: "ui" as const,
    tier: "free",
    description: "Provider wrapper that manages the drill-down stack and renders the overlay panel. Wrap your dashboard (or a section) in DrillDown.Root to enable drill-down on child components.",
    longDescription:
      "DrillDown.Root is the context provider for the drill-down system. It manages a stack of drill panels (up to 4 levels deep), renders the slide-over or modal overlay, and provides breadcrumb navigation, back/close buttons, and Escape/backdrop-click dismissal. Any child component with a `drillDown` prop will open its panel inside this root. Use `useDrillDown()` to read state (isOpen, breadcrumbs, depth) and `useDrillDownAction()` to imperatively open drills.",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Dashboard content that contains components with drillDown props." },
      { name: "defaultMode", type: 'DrillDownMode', required: false, default: '"slide-over"', description: 'Default presentation mode for drill panels. "slide-over" slides from the right, full height. "modal" renders centered and compact. Individual components can override via drillDownMode.' },
      { name: "maxDepth", type: "number", required: false, default: "4", description: "Maximum nesting depth for drill-down navigation." },
      { name: "className", type: "string", required: false, description: "Additional CSS class names for the overlay container." },
    ],
    minimalExample: `<DrillDown.Root>
  <BarChart data={data} index="region" categories={["revenue"]} drillDown />
</DrillDown.Root>`,
    examples: [
      {
        title: "Zero-config drill-down",
        description: "Wrap in DrillDown.Root and add drillDown={true} to any chart. Clicking a bar auto-generates a summary KPI row + filtered DataTable.",
        code: `import { DrillDown, BarChart, MetricProvider } from "metricui";

<MetricProvider theme="indigo">
  <DrillDown.Root>
    <BarChart
      data={salesByRegion}
      index="region"
      categories={["revenue", "orders"]}
      drillDown
      title="Sales by Region"
    />
  </DrillDown.Root>
</MetricProvider>`,
      },
      {
        title: "Custom drill-down with nested navigation",
        description: "Pass a render function for full control. The event contains the clicked element's data. Nest another drillDown component inside for multi-level navigation.",
        code: `import { DrillDown, BarChart, KpiCard, DataTable, MetricGrid } from "metricui";

<DrillDown.Root>
  <BarChart
    data={salesByRegion}
    index="region"
    categories={["revenue", "orders"]}
    title="Sales by Region"
    drillDown={(event) => (
      <MetricGrid>
        <KpiCard title="Region" value={event.indexValue} />
        <KpiCard title="Revenue" value={event.data.revenue} format="currency" />
        <DataTable
          data={getOrdersForRegion(event.indexValue)}
          columns={orderColumns}
          title={\`Orders in \${event.indexValue}\`}
          drillDown
        />
      </MetricGrid>
    )}
  />
</DrillDown.Root>`,
      },
      {
        title: "Modal presentation mode",
        description: "Use drillDownMode='modal' for a centered, compact overlay instead of a full-height slide-over.",
        code: `<DrillDown.Root>
  <DonutChart
    data={browserShare}
    title="Browser Share"
    drillDown
    drillDownMode="modal"
  />
</DrillDown.Root>`,
      },
    ],
    relatedComponents: ["BarChart", "DonutChart", "AreaChart", "HeatMap", "BarLineChart", "Funnel", "Waterfall", "DataTable", "KpiCard", "StatGroup", "Gauge", "Callout"],
    configFields: [],
    notes: [
      "DrillDown.Root must wrap any components that use the drillDown prop.",
      "drillDown={true} auto-generates a summary KPI row + filtered DataTable from the component's source data — zero config needed.",
      "drillDown={(event) => <CustomContent />} gives full control over what appears in the panel.",
      "Two presentation modes: 'slide-over' (default, full height from right) and 'modal' (centered, compact).",
      "Navigation: breadcrumbs for nested drills (up to 4 levels), back arrow, close X, Escape key, backdrop click.",
      "When both drillDown and crossFilter are set on the same component, drillDown wins.",
      "useDrillDown() returns { isOpen, breadcrumbs, depth, back, close } for reading state in custom components.",
      "useDrillDownAction() returns openDrill(trigger, content) for imperative use outside of chart click handlers.",
    ],
  },
];
