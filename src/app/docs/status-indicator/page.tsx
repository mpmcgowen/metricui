"use client";

import { useState, useMemo } from "react";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { StatusRule, StatusSize } from "@/components/ui/StatusIndicator";
import { DataTable } from "@/components/tables/DataTable";
import {
  Toggle,
  NumberInput,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample rules
// ---------------------------------------------------------------------------

const healthRules: StatusRule[] = [
  { min: 90, color: "emerald", label: "Healthy", pulse: false },
  { min: 60, max: 90, color: "amber", label: "Degraded" },
  { max: 60, color: "red", label: "Critical", pulse: true },
];

const uptimeRules: StatusRule[] = [
  { min: 99.9, color: "emerald", label: "Operational" },
  { min: 99, max: 99.9, color: "amber", label: "Partial Outage" },
  { max: 99, color: "red", label: "Major Outage", pulse: true },
];

// ---------------------------------------------------------------------------
// Table data for integration example
// ---------------------------------------------------------------------------

const serviceData = [
  { service: "API Gateway", uptime: 99.98, latency: 12, status: 99.98 },
  { service: "Auth Service", uptime: 99.82, latency: 45, status: 99.82 },
  { service: "Database", uptime: 98.5, latency: 120, status: 98.5 },
  { service: "CDN", uptime: 99.99, latency: 3, status: 99.99 },
  { service: "Search", uptime: 99.1, latency: 85, status: 99.1 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StatusIndicatorDocs() {
  // --- Core ---
  const [value, setValue] = useState(95);
  const [size, setSize] = useState<string>("md");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // --- Appearance ---
  const [showValue, setShowValue] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Thresholds ---
  const [thresh1, setThresh1] = useState(90);
  const [thresh1Color, setThresh1Color] = useState("emerald");
  const [thresh1Label, setThresh1Label] = useState("Healthy");
  const [thresh2, setThresh2] = useState(60);
  const [thresh2Color, setThresh2Color] = useState("amber");
  const [thresh2Label, setThresh2Label] = useState("Degraded");
  const [thresh3Color, setThresh3Color] = useState("red");
  const [thresh3Label, setThresh3Label] = useState("Critical");

  // --- Trend ---
  const [enableTrend, setEnableTrend] = useState(false);

  // --- Derived ---
  const rules: StatusRule[] = useMemo(
    () => [
      { min: thresh1, color: thresh1Color, label: thresh1Label, pulse: false },
      { min: thresh2, max: thresh1, color: thresh2Color, label: thresh2Label },
      { max: thresh2, color: thresh3Color, label: thresh3Label, pulse },
    ],
    [thresh1, thresh1Color, thresh1Label, thresh2, thresh2Color, thresh2Label, thresh3Color, thresh3Label, pulse],
  );

  const trend = enableTrend ? [88, 90, 92, 94, value] : undefined;

  // --- Code gen ---
  const codeLines = [`<StatusIndicator`];
  codeLines.push(`  value={${value}}`);
  codeLines.push(`  rules={[`);
  codeLines.push(`    { min: ${thresh1}, color: "${thresh1Color}", label: "${thresh1Label}" },`);
  codeLines.push(`    { min: ${thresh2}, max: ${thresh1}, color: "${thresh2Color}", label: "${thresh2Label}" },`);
  codeLines.push(`    { max: ${thresh2}, color: "${thresh3Color}", label: "${thresh3Label}"${pulse ? ", pulse: true" : ""} },`);
  codeLines.push(`  ]}`);
  if (size !== "md") codeLines.push(`  size="${size}"`);
  if (showValue) codeLines.push(`  showValue`);
  if (title) codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (enableTrend) codeLines.push(`  trend={[88, 90, 92, 94, ${value}]}`);
  if (loading) codeLines.push(`  loading`);
  codeLines.push(`/>`);

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        {/* Header */}
        <div className="border-b border-[var(--card-border)] px-8 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Component
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--foreground)]">
            StatusIndicator
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Rule-based status display with threshold coloring, pulse animation,
            and five size modes (dot, sm, md, lg, card). Perfect for health
            dashboards, service monitors, and table status cells.
          </p>
        </div>

        {/* Live Preview */}
        <div className="flex-1 px-8 py-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
            <StatusIndicator
              value={value}
              rules={rules}
              size={size as StatusSize}
              showValue={showValue}
              title={title || undefined}
              subtitle={subtitle || undefined}
              trend={trend}
              loading={loading}
            />
          </div>

          {/* Size Gallery */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              All Sizes
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {(["dot", "sm", "md", "lg"] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-[var(--muted)]">{s}</span>
                  <StatusIndicator value={value} rules={rules} size={s} />
                </div>
              ))}
            </div>
          </div>

          {/* Rules Example */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Threshold Rules — Drag the value slider to see color changes
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <StatusIndicator value={95} rules={healthRules} size="md" showValue />
              <StatusIndicator value={75} rules={healthRules} size="md" showValue />
              <StatusIndicator value={40} rules={healthRules} size="md" showValue />
            </div>
          </div>

          {/* Card Mode Example */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Card Mode — Sits naturally next to KpiCards
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatusIndicator
                value={99.98}
                rules={uptimeRules}
                size="card"
                title="API Gateway"
                showValue
                trend={[99.9, 99.95, 99.98]}
              />
              <StatusIndicator
                value={99.5}
                rules={uptimeRules}
                size="card"
                title="Auth Service"
                subtitle="Intermittent latency spikes"
                showValue
                trend={[99.9, 99.7, 99.5]}
              />
              <StatusIndicator
                value={97.2}
                rules={uptimeRules}
                size="card"
                title="Database"
                subtitle="Investigating root cause"
                showValue
                trend={[99.5, 98.8, 97.2]}
              />
            </div>
          </div>

          {/* Table Integration Example */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Table Integration — StatusIndicator inside DataTable cells
            </p>
            <DataTable
              data={serviceData}
              title="Service Health"
              subtitle="Current status across infrastructure"
              columns={[
                { key: "service", header: "Service", sortable: true },
                {
                  key: "status",
                  header: "Status",
                  sortable: true,
                  render: (v) => (
                    <StatusIndicator
                      value={Number(v)}
                      rules={uptimeRules}
                      size="sm"
                    />
                  ),
                },
                {
                  key: "uptime",
                  header: "Uptime",
                  sortable: true,
                  align: "right",
                  render: (v) => `${Number(v).toFixed(2)}%`,
                },
                {
                  key: "latency",
                  header: "Latency",
                  sortable: true,
                  align: "right",
                  render: (v) => `${v}ms`,
                },
              ]}
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
      <div className="w-full shrink-0 border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:shrink lg:overflow-y-auto lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the indicator update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <NumberInput label="value" value={value} onChange={setValue} min={0} max={100} step={1} />
          <Select
            label="size"
            value={size}
            onChange={setSize}
            options={[
              { label: "dot", value: "dot" },
              { label: "sm", value: "sm" },
              { label: "md (default)", value: "md" },
              { label: "lg", value: "lg" },
              { label: "card", value: "card" },
            ]}
            description="Display mode"
          />
          <TextInput label="title" value={title} onChange={setTitle} placeholder="e.g. System Health" />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} placeholder="e.g. Last checked 2m ago" />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Toggle label="showValue" value={showValue} onChange={setShowValue} description="Display the numeric value" />
          <Toggle label="pulse" value={pulse} onChange={setPulse} description="Pulse on critical state" />
        </ControlSection>

        {/* Rules */}
        <ControlSection title="Rules">
          <NumberInput label="Healthy ≥" value={thresh1} onChange={setThresh1} min={0} max={100} step={1} />
          <TextInput label="Healthy color" value={thresh1Color} onChange={setThresh1Color} />
          <TextInput label="Healthy label" value={thresh1Label} onChange={setThresh1Label} />
          <NumberInput label="Degraded ≥" value={thresh2} onChange={setThresh2} min={0} max={100} step={1} />
          <TextInput label="Degraded color" value={thresh2Color} onChange={setThresh2Color} />
          <TextInput label="Degraded label" value={thresh2Label} onChange={setThresh2Label} />
          <TextInput label="Critical color" value={thresh3Color} onChange={setThresh3Color} />
          <TextInput label="Critical label" value={thresh3Label} onChange={setThresh3Label} />
        </ControlSection>

        {/* Trend */}
        <ControlSection title="Trend" defaultOpen={false}>
          <Toggle label="Enable trend" value={enableTrend} onChange={setEnableTrend} description="Show trend arrow from recent values" />
        </ControlSection>

        {/* Data States */}
        <ControlSection title="Data States" defaultOpen={false}>
          <Toggle label="loading" value={loading} onChange={setLoading} description="Show skeleton placeholder" />
        </ControlSection>
      </div>
    </div>
  );
}
