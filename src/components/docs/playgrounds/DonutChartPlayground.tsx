"use client";

import { useState, useMemo } from "react";
import { DonutChart } from "@/components/charts/DonutChart";
import {
  Toggle,
  TextInput,
  NumberInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

const datasets: Record<string, { id: string; label: string; value: number }[]> = {
  traffic: [
    { id: "organic", label: "Organic", value: 42 },
    { id: "direct", label: "Direct", value: 26 },
    { id: "referral", label: "Referral", value: 16 },
    { id: "social", label: "Social", value: 10 },
    { id: "email", label: "Email", value: 6 },
  ],
  revenue: [
    { id: "saas", label: "SaaS", value: 48000 },
    { id: "consulting", label: "Consulting", value: 22000 },
    { id: "enterprise", label: "Enterprise", value: 18000 },
    { id: "marketplace", label: "Marketplace", value: 8500 },
    { id: "other", label: "Other", value: 3500 },
  ],
  browser: [
    { id: "chrome", label: "Chrome", value: 63.5 },
    { id: "safari", label: "Safari", value: 19.8 },
    { id: "firefox", label: "Firefox", value: 7.2 },
    { id: "edge", label: "Edge", value: 5.1 },
    { id: "brave", label: "Brave", value: 2.4 },
    { id: "other", label: "Other", value: 2.0 },
  ],
  expenses: [
    { id: "engineering", label: "Engineering", value: 145000 },
    { id: "marketing", label: "Marketing", value: 82000 },
    { id: "sales", label: "Sales", value: 68000 },
    { id: "operations", label: "Operations", value: 42000 },
    { id: "support", label: "Support", value: 31000 },
    { id: "hr", label: "HR", value: 22000 },
    { id: "legal", label: "Legal", value: 15000 },
  ],
};

const datasetDefaults: Record<string, { format: string; centerValue: string; centerLabel: string }> = {
  traffic: { format: "number", centerValue: "42%", centerLabel: "Organic" },
  revenue: { format: "currency", centerValue: "$100K", centerLabel: "Total Revenue" },
  browser: { format: "percent", centerValue: "63.5%", centerLabel: "Chrome" },
  expenses: { format: "currency", centerValue: "$405K", centerLabel: "Total Spend" },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function DonutChartPlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("traffic");
  const [useSimpleData, setUseSimpleData] = useState(false);
  const handleDatasetChange = (key: string) => {
    setDatasetKey(key);
    const d = datasetDefaults[key];
    if (d) {
      setFormatStyle(d.format);
      setCenterValue(d.centerValue);
      setCenterLabel(d.centerLabel);
    }
  };

  // --- Core ---
  const [title, setTitle] = useState("Traffic Sources");
  const [subtitle, setSubtitle] = useState("Distribution by channel");
  const [footnote, setFootnote] = useState("");
  const [description, setDescription] = useState("");

  // --- Format ---
  const [formatStyle, setFormatStyle] = useState("number");
  const [compact, setCompact] = useState("auto");
  const [precision, setPrecision] = useState(1);

  // --- Appearance ---
  const [height, setHeight] = useState(300);
  const [innerRadius, setInnerRadius] = useState(0.6);
  const [padAngle, setPadAngle] = useState(0.7);
  const [cornerRadius, setCornerRadius] = useState(3);
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(360);
  const [sortSlices, setSortSlices] = useState("desc");
  const [activeOuterRadiusOffset, setActiveOuterRadiusOffset] = useState(4);
  const [borderWidth, setBorderWidth] = useState(1);

  // --- Center ---
  const [centerValue, setCenterValue] = useState("42%");
  const [centerLabel, setCenterLabel] = useState("Organic");

  // --- Labels ---
  const [enableArcLabels, setEnableArcLabels] = useState(false);
  const [arcLabelsSkipAngle, setArcLabelsSkipAngle] = useState(10);
  const [enableArcLinkLabels, setEnableArcLinkLabels] = useState(false);
  const [arcLinkLabelsSkipAngle, setArcLinkLabelsSkipAngle] = useState(10);
  const [showPercentage, setShowPercentage] = useState(false);

  // --- Legend ---
  const [showLegend, setShowLegend] = useState(true);
  const [legendToggleable, setLegendToggleable] = useState(true);

  // --- Variant ---
  const [variant, setVariant] = useState("default");

  // --- Derived ---
  const data = datasets[datasetKey] ?? datasets.traffic;
  const simpleDataObj = useMemo(() => {
    const obj: Record<string, number> = {};
    for (const d of data) obj[d.label] = d.value;
    return obj;
  }, [data]);

  const compactValue = compact === "false" ? false : compact === "auto" ? true : compact;
  const format = useMemo(
    () => ({
      style: formatStyle as "currency" | "number" | "percent",
      compact: compactValue as boolean | "auto" | "thousands" | "millions" | "billions" | "trillions",
      precision,
    }),
    [formatStyle, compactValue, precision]
  );

  const legendProp = showLegend
    ? { position: "bottom" as const, toggleable: legendToggleable }
    : false;

  // --- Code gen ---
  const codeLines = [
    `<DonutChart`,
  ];
  if (useSimpleData) {
    const entries = data.slice(0, 3).map((d) => `"${d.label}": ${d.value}`).join(", ");
    codeLines.push(`  simpleData={{ ${entries}, ... }}`);
  } else {
    codeLines.push(`  data={[${data.slice(0, 2).map((d) => `{ id: "${d.id}", label: "${d.label}", value: ${d.value} }`).join(", ")}, ...]}`);
  }
  codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  const fmtParts = [`style: "${formatStyle}"`];
  if (compact !== "auto") fmtParts.push(`compact: ${compact === "false" ? "false" : `"${compact}"`}`);
  if (precision !== 1) fmtParts.push(`precision: ${precision}`);
  codeLines.push(`  format={{ ${fmtParts.join(", ")} }}`);
  if (height !== 300) codeLines.push(`  height={${height}}`);
  if (innerRadius !== 0.6) codeLines.push(`  innerRadius={${innerRadius}}`);
  if (padAngle !== 0.7) codeLines.push(`  padAngle={${padAngle}}`);
  if (cornerRadius !== 3) codeLines.push(`  cornerRadius={${cornerRadius}}`);
  if (startAngle !== 0) codeLines.push(`  startAngle={${startAngle}}`);
  if (endAngle !== 360) codeLines.push(`  endAngle={${endAngle}}`);
  if (sortSlices !== "desc") codeLines.push(`  sortSlices="${sortSlices}"`);
  if (activeOuterRadiusOffset !== 4) codeLines.push(`  activeOuterRadiusOffset={${activeOuterRadiusOffset}}`);
  if (borderWidth !== 1) codeLines.push(`  borderWidth={${borderWidth}}`);
  if (centerValue) codeLines.push(`  centerValue="${centerValue}"`);
  if (centerLabel) codeLines.push(`  centerLabel="${centerLabel}"`);
  if (enableArcLabels) codeLines.push(`  enableArcLabels`);
  if (enableArcLabels && arcLabelsSkipAngle !== 10) codeLines.push(`  arcLabelsSkipAngle={${arcLabelsSkipAngle}}`);
  if (enableArcLinkLabels) codeLines.push(`  enableArcLinkLabels`);
  if (enableArcLinkLabels && arcLinkLabelsSkipAngle !== 10) codeLines.push(`  arcLinkLabelsSkipAngle={${arcLinkLabelsSkipAngle}}`);
  if (showPercentage) codeLines.push(`  showPercentage`);
  if (!showLegend) codeLines.push(`  legend={false}`);
  else if (!legendToggleable) codeLines.push(`  legend={{ toggleable: false }}`);
  if (description) codeLines.push(`  description="${description}"`);
  if (footnote) codeLines.push(`  footnote="${footnote}"`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        {/* Live Preview */}
        <div className="flex-1 px-6 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
              <DonutChart
                data={useSimpleData ? [] : data}
                simpleData={useSimpleData ? simpleDataObj : undefined}
                title={title}
                subtitle={subtitle || undefined}
                description={description || undefined}
                footnote={footnote || undefined}
                format={format}
                height={height}
                innerRadius={innerRadius}
                padAngle={padAngle}
                cornerRadius={cornerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                sortSlices={sortSlices as "desc" | "asc" | "none"}
                activeOuterRadiusOffset={activeOuterRadiusOffset}
                borderWidth={borderWidth}
                centerValue={centerValue || undefined}
                centerLabel={centerLabel || undefined}
                enableArcLabels={enableArcLabels}
                arcLabelsSkipAngle={arcLabelsSkipAngle}
                enableArcLinkLabels={enableArcLinkLabels}
                arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
                showPercentage={showPercentage}
                legend={legendProp}
                variant={variant as "default" | "outlined" | "ghost" | "elevated"}
              />
          </div>

          {/* Code */}
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Code
            </p>
            <CodePreview code={codeLines.join("\n")} />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full shrink-0 border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:shrink lg:overflow-y-auto lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the chart update in real time
          </p>
        </div>

        {/* Data */}
        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={handleDatasetChange}
            options={[
              { label: "Traffic Sources", value: "traffic" },
              { label: "Revenue by Product", value: "revenue" },
              { label: "Browser Share", value: "browser" },
              { label: "Expense Breakdown", value: "expenses" },
            ]}
            description="Switch between sample datasets"
          />
          <Toggle
            label="Use simpleData"
            value={useSimpleData}
            onChange={setUseSimpleData}
            description='Pass { "Chrome": 45, ... } instead of full DonutDatum[]'
          />
        </ControlSection>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
          <TextInput label="description" value={description} onChange={setDescription} placeholder="Shows as a ? popover" />
          <TextInput label="footnote" value={footnote} onChange={setFootnote} />
        </ControlSection>

        {/* Formatting */}
        <ControlSection title="Format">
          <Select
            label="format.style"
            value={formatStyle}
            onChange={setFormatStyle}
            options={[
              { label: "number", value: "number" },
              { label: "currency", value: "currency" },
              { label: "percent", value: "percent" },
            ]}
            description="Applied to tooltips and arc labels"
          />
          <Select
            label="compact"
            value={compact}
            onChange={setCompact}
            options={[
              { label: "auto", value: "auto" },
              { label: "thousands (K)", value: "thousands" },
              { label: "millions (M)", value: "millions" },
              { label: "off", value: "false" },
            ]}
          />
          <NumberInput label="precision" value={precision} onChange={setPrecision} min={0} max={4} />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <NumberInput label="height" value={height} onChange={setHeight} min={150} max={600} step={50} />
          <NumberInput label="innerRadius" value={innerRadius} onChange={setInnerRadius} min={0} max={0.95} step={0.05} description="0 = pie chart, 0.6 = donut (default)" />
          <NumberInput label="padAngle" value={padAngle} onChange={setPadAngle} min={0} max={5} step={0.1} description="Gap between slices in degrees" />
          <NumberInput label="cornerRadius" value={cornerRadius} onChange={setCornerRadius} min={0} max={20} step={1} description="Rounded slice edges in px" />
          <NumberInput label="startAngle" value={startAngle} onChange={setStartAngle} min={-180} max={360} step={10} description="Start angle in degrees" />
          <NumberInput label="endAngle" value={endAngle} onChange={setEndAngle} min={0} max={360} step={10} description="End angle in degrees (360 = full circle)" />
          <Select
            label="sortSlices"
            value={sortSlices}
            onChange={setSortSlices}
            options={[
              { label: "descending (largest first)", value: "desc" },
              { label: "ascending", value: "asc" },
              { label: "none (data order)", value: "none" },
            ]}
            description="How slices are ordered"
          />
          <NumberInput label="activeOuterRadiusOffset" value={activeOuterRadiusOffset} onChange={setActiveOuterRadiusOffset} min={0} max={20} step={1} description="Hover expansion in px" />
          <NumberInput label="borderWidth" value={borderWidth} onChange={setBorderWidth} min={0} max={4} step={1} description="Border between slices" />
        </ControlSection>

        {/* Center */}
        <ControlSection title="Center">
          <TextInput label="centerValue" value={centerValue} onChange={setCenterValue} placeholder='e.g. "42%" or "$100K"' />
          <TextInput label="centerLabel" value={centerLabel} onChange={setCenterLabel} placeholder='e.g. "Organic" or "Total"' />
        </ControlSection>

        {/* Labels */}
        <ControlSection title="Labels">
          <Toggle label="enableArcLabels" value={enableArcLabels} onChange={setEnableArcLabels} description="Show value labels on slices" />
          {enableArcLabels && (
            <NumberInput label="arcLabelsSkipAngle" value={arcLabelsSkipAngle} onChange={setArcLabelsSkipAngle} min={0} max={45} step={1} description="Min angle to show label" />
          )}
          <Toggle label="enableArcLinkLabels" value={enableArcLinkLabels} onChange={setEnableArcLinkLabels} description="Lines connecting slices to external labels" />
          {enableArcLinkLabels && (
            <NumberInput label="arcLinkLabelsSkipAngle" value={arcLinkLabelsSkipAngle} onChange={setArcLinkLabelsSkipAngle} min={0} max={45} step={1} description="Min angle to show link label" />
          )}
          <Toggle label="showPercentage" value={showPercentage} onChange={setShowPercentage} description="Show percentages instead of raw values" />
        </ControlSection>

        {/* Legend */}
        <ControlSection title="Legend" defaultOpen={false}>
          <Toggle label="Show legend" value={showLegend} onChange={setShowLegend} description="Toggleable legend below the chart" />
          {showLegend && (
            <Toggle label="Toggleable" value={legendToggleable} onChange={setLegendToggleable} description="Click legend items to show/hide slices" />
          )}
        </ControlSection>

        {/* Theming */}
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
