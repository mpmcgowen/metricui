"use client";

import { useCallback, useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Gauge } from "@/components/charts/Gauge";
import { DataTable } from "@/components/tables/DataTable";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MetricProvider } from "@/lib/MetricProvider";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { FilterTags } from "@/components/filters/FilterTags";
import { useWikipediaStream } from "@/lib/useWikipediaStream";
import type { WikiEdit } from "@/lib/useWikipediaStream";
import {
  Globe,
  Pencil,
  Users,
  Bot,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WIKI_LABELS: Record<string, string> = {
  enwiki: "English",
  dewiki: "German",
  frwiki: "French",
  jawiki: "Japanese",
  eswiki: "Spanish",
  ruwiki: "Russian",
  zhwiki: "Chinese",
  itwiki: "Italian",
  ptwiki: "Portuguese",
  plwiki: "Polish",
  arwiki: "Arabic",
  nlwiki: "Dutch",
  wikidatawiki: "Wikidata",
  commonswiki: "Commons",
};

function wikiLabel(wiki: string): string {
  return WIKI_LABELS[wiki] ?? wiki.replace("wiki", "");
}

function timeAgo(unixTimestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unixTimestamp);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WikipediaDashboard() {
  const { connected, loading, recentEdits, stats } = useWikipediaStream();
  const [editFilter, setEditFilter] = useState<string>("All Edits");
  const [wikiFilter, setWikiFilter] = useState<string[]>([]);

  // Top wiki options for dropdown
  const wikiOptions = useMemo(() => {
    const topWikiKeys = [
      "enwiki", "dewiki", "frwiki", "jawiki", "eswiki",
      "ruwiki", "zhwiki", "itwiki", "ptwiki", "plwiki",
      "arwiki", "nlwiki", "wikidatawiki", "commonswiki",
    ];
    return topWikiKeys.map((key) => ({
      value: key,
      label: wikiLabel(key),
      count: stats.editsByWiki[key] ?? 0,
    }));
  }, [stats.editsByWiki]);

  // Filter edits based on segment toggle and wiki dropdown
  const filteredEdits = useMemo(() => {
    let edits = recentEdits;
    if (editFilter === "Human Only") edits = edits.filter((e) => !e.bot);
    if (editFilter === "Bot Only") edits = edits.filter((e) => e.bot);
    if (wikiFilter.length > 0) edits = edits.filter((e) => wikiFilter.includes(e.wiki));
    return edits;
  }, [recentEdits, editFilter, wikiFilter]);

  // Whether any filter is active
  const isFiltered = editFilter !== "All Edits" || wikiFilter.length > 0;

  // Recompute stats from filtered edits so every component reflects filters
  const filteredStats = useMemo(() => {
    if (!isFiltered) return stats;

    const totalEdits = filteredEdits.length;
    const botEditCount = filteredEdits.filter((e) => e.bot).length;
    const uniqueEditors = new Set(filteredEdits.map((e) => e.user)).size;

    const editsByWiki: Record<string, number> = {};
    const editsByType: Record<string, number> = {};
    let largestEdit: WikiEdit | null = null;
    let largestChange = 0;

    for (const edit of filteredEdits) {
      editsByWiki[edit.wiki] = (editsByWiki[edit.wiki] ?? 0) + 1;
      editsByType[edit.type] = (editsByType[edit.type] ?? 0) + 1;
      if (edit.lengthOld != null && edit.lengthNew != null) {
        const change = Math.abs(edit.lengthNew - edit.lengthOld);
        if (change > largestChange) {
          largestChange = change;
          largestEdit = edit;
        }
      }
    }

    // Scale editsPerMinute proportionally when filtered
    const ratio = stats.totalEdits > 0 ? totalEdits / stats.totalEdits : 0;
    const editsPerMinute = Math.round(stats.editsPerMinute * ratio);
    const editRate = Math.round(stats.editRate * ratio * 10) / 10;

    // Scale rate history proportionally for sparklines
    const editRateHistory = stats.editRateHistory.map((v) => Math.round(v * ratio));

    return {
      ...stats,
      totalEdits,
      editsPerMinute,
      uniqueEditors,
      botEditCount,
      largestEdit,
      editsByWiki,
      editsByType,
      editRate,
      editRateHistory,
    };
  }, [stats, filteredEdits, isFiltered]);

  // Top 10 wikis by edit count for bar chart
  const topWikis = useMemo(() => {
    const entries = Object.entries(filteredStats.editsByWiki)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    return entries.map(([wiki, count]) => ({
      wiki: wikiLabel(wiki),
      edits: count,
    }));
  }, [filteredStats.editsByWiki]);

  // Edit type breakdown as flat rows (unified format)
  const editTypeData = useMemo(() => {
    return Object.entries(filteredStats.editsByType).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  }, [filteredStats.editsByType]);

  // Edit velocity area chart — bot vs human over time
  const editVelocityData = useMemo(() => {
    const len = stats.humanRateHistory.length;
    if (len === 0) return [];

    const showHuman = editFilter !== "Bot Only";
    const showBot = editFilter !== "Human Only";

    const series: { id: string; data: { x: string; y: number }[] }[] = [];

    if (showHuman) {
      series.push({
        id: "Human",
        data: stats.humanRateHistory.map((v, i) => ({
          x: `${(len - i) * 5}s ago`,
          y: v,
        })),
      });
    }
    if (showBot) {
      series.push({
        id: "Bot",
        data: stats.botRateHistory.map((v, i) => ({
          x: `${(len - i) * 5}s ago`,
          y: v,
        })),
      });
    }

    return series;
  }, [stats.humanRateHistory, stats.botRateHistory, editFilter]);

  // Bot ratio for gauge (0-100)
  const botRatio =
    filteredStats.totalEdits > 0
      ? Math.round((filteredStats.botEditCount / filteredStats.totalEdits) * 100)
      : 0;

  // Largest edit byte change
  const largestEditBytes =
    filteredStats.largestEdit?.lengthNew != null && filteredStats.largestEdit?.lengthOld != null
      ? Math.abs(filteredStats.largestEdit.lengthNew - filteredStats.largestEdit.lengthOld)
      : 0;

  // Table columns
  const editColumns = useMemo(
    () => [
      {
        key: "timestamp" as const,
        header: "When",
        width: 80,
        render: (_: unknown, row: WikiEdit) => (
          <span className="text-[var(--muted)]">{timeAgo(row.timestamp)}</span>
        ),
      },
      {
        key: "title" as const,
        header: "Page",
        type: "text" as const,
        width: 280,
        sortable: true,
      },
      {
        key: "type" as const,
        header: "Type",
        type: "badge" as const,
        width: 80,
      },
      {
        key: "user" as const,
        header: "Editor",
        type: "text" as const,
        width: 120,
      },
      {
        key: "bot" as const,
        header: "Bot",
        type: "badge" as const,
        width: 60,
        badgeColor: (v: unknown) => v ? "#3B82F6" : undefined,
        render: (v: unknown) => v ? "bot" : "",
      },
      {
        key: "wiki" as const,
        header: "Wiki",
        width: 100,
        render: (val: unknown) => wikiLabel(String(val)),
      },
      {
        key: "lengthNew" as const,
        header: "\u0394 Bytes",
        type: "bar" as const,
        width: 100,
        sortable: true,
        render: (_: unknown, row: WikiEdit) => {
          if (row.lengthOld == null || row.lengthNew == null) return "\u2014";
          const delta = row.lengthNew - row.lengthOld;
          return `${delta > 0 ? "+" : ""}${delta.toLocaleString()}`;
        },
        conditions: [
          { when: "above" as const, value: 0, color: "emerald" },
          { when: "below" as const, value: 0, color: "red" },
        ],
      },
    ],
    []
  );

  // Expandable row content
  const renderEditExpanded = useCallback((row: WikiEdit) => (
    <DetailGrid columns={3}>
      <DetailGrid.Item label="Edit Comment">
        {row.comment || "No comment"}
      </DetailGrid.Item>
      <DetailGrid.Item label="Size Change">
        <span className="flex items-center gap-2 font-[family-name:var(--font-mono)]">
          {row.lengthOld != null && <span>{row.lengthOld.toLocaleString()}B</span>}
          {row.lengthOld != null && row.lengthNew != null && <span className="text-[var(--muted)]">→</span>}
          {row.lengthNew != null && <span>{row.lengthNew.toLocaleString()}B</span>}
        </span>
      </DetailGrid.Item>
      <DetailGrid.Item label="Flags">
        <span className="flex flex-wrap gap-1.5">
          {row.minor && <Badge size="sm" variant="outline">minor</Badge>}
          {row.bot && <Badge size="sm" variant="outline" color="blue">bot</Badge>}
          <Badge size="sm" variant="outline">{row.type}</Badge>
        </span>
      </DetailGrid.Item>
    </DetailGrid>
  ), []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* \u2500\u2500 Code Hero \u2500\u2500 */}
        <div className="flex items-center justify-between">
          <div />
          <ThemeToggle />
        </div>
        <SourceReveal />

        {/* \u2500\u2500 Dashboard Header \u2500\u2500 */}
        <div className="mt-8">
          <DashboardHeader
            title="Wikipedia Live Edits"
            subtitle="Real-time edits from Wikimedia EventStreams"
            status={connected ? "live" : loading ? "loading" : "offline"}
            back={{ href: "/docs/kpi-card", label: "Docs" }}
            variant="flat"
          />
        </div>

        {/* \u2500\u2500 Connection Health \u2500\u2500 */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusIndicator
              value={connected ? 1 : 0}
              size="sm"
              rules={[
                { min: 1, color: "emerald", label: "EventStream Connected", pulse: true },
                { max: 1, color: "red", label: "Disconnected" },
              ]}
            />
            <StatusIndicator
              value={stats.editRate}
              size="sm"
              rules={[
                { min: 5, color: "emerald", label: "High throughput" },
                { min: 1, max: 5, color: "amber", label: "Moderate throughput" },
                { max: 1, color: "red", label: "Low throughput" },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <SegmentToggle
              options={[
                { value: "All Edits", label: "All Edits", icon: <Pencil className="h-3.5 w-3.5" />, badge: stats.totalEdits },
                { value: "Human Only", label: "Human Only", icon: <Users className="h-3.5 w-3.5" />, badge: stats.totalEdits - stats.botEditCount },
                { value: "Bot Only", label: "Bot Only", icon: <Bot className="h-3.5 w-3.5" />, badge: stats.botEditCount },
              ]}
              value={editFilter}
              onChange={(v) => setEditFilter(v as string)}
              size="sm"
            />
            <DropdownFilter
              label="Wiki"
              options={wikiOptions}
              multiple
              showAll
              value={wikiFilter}
              onChange={(v) => setWikiFilter(v as string[])}
              dense
            />
          </div>
        </div>

        <FilterTags className="mt-3" />

        <MetricProvider loading={loading} variant="elevated">
          <MetricGrid className="mt-6">

            {/* \u2500\u2500 Live Metrics \u2500\u2500 */}
            <MetricGrid.Section title="Live Metrics" />
            <KpiCard
              title="Total Edits"
              value={filteredStats.totalEdits}
              format="number"
              sparkline={{ data: filteredStats.editRateHistory, type: "bar" }}
              icon={<Pencil className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Edit Rate"
              value={filteredStats.editRate}
              format={{ style: "custom", suffix: "/sec" }}
              sparkline={{ data: filteredStats.editRateHistory, type: "line" }}
              icon={<Zap className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Unique Editors"
              value={filteredStats.uniqueEditors}
              format="number"
              icon={<Users className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <KpiCard
              title="Bot Edits"
              value={filteredStats.botEditCount}
              format="number"
              description={`${botRatio}% automated`}
              icon={<Bot className="h-3.5 w-3.5" />}
              animate={{ countUp: true }}
            />
            <StatGroup
              stats={[
                {
                  label: "Edits / Min",
                  value: filteredStats.editsPerMinute,
                  icon: <Zap className="h-3 w-3" />,
                },
                {
                  label: "Active Wikis",
                  value: Object.keys(filteredStats.editsByWiki).length,
                  icon: <Globe className="h-3 w-3" />,
                },
                {
                  label: "Largest Edit",
                  value: largestEditBytes,
                  format: { style: "custom" as const, suffix: " B" },
                },
              ]}
              columns={3}
              dense
            />
            <Callout
              value={botRatio}
              rules={[
                { max: 20, variant: "success", title: "Low bot activity", message: "Only {value}% of edits are automated \u2014 human editors are leading." },
                { min: 20, max: 50, variant: "info", title: "Normal bot activity", message: "{value}% of edits are automated \u2014 typical for this time of day." },
                { min: 50, variant: "warning", title: "High bot activity", message: "{value}% of edits are automated \u2014 bots are dominating the edit stream." },
              ]}
              metric={{ value: botRatio, format: "percent", label: "bot ratio" }}
              dense
              dismissible
            />

            {/* \u2500\u2500 Edit Velocity \u2500\u2500 */}
            <MetricGrid.Section title="Edit Velocity" subtitle="Human vs bot edits per 5-second window" />
            <AreaChart
              data={editVelocityData}
              title="Edit Velocity"
              subtitle="Human vs bot edits per 5s window \u2014 live"
              format="number"
              height={310}
              stacked
              enableArea
              gradient
              loading={editVelocityData.length === 0}
            />

            {/* \u2500\u2500 Breakdown \u2500\u2500 */}
            <MetricGrid.Section title="Breakdown" subtitle="Distribution across languages, edit types, and automation" />
            <BarChart
              data={topWikis}
              index="wiki"
              categories={["edits"]}
              title="Edits by Language"
              subtitle="Top 10 most active wikis"
              format="number"
              height={300}
              sort="desc"
              layout="horizontal"
              loading={topWikis.length === 0}
            />
            <DonutChart
              data={editTypeData}
              index="type"
              categories={["count"]}
              title="Edit Types"
              height={300}
              showPercentage
              innerRadius={0.65}
              centerValue={filteredStats.totalEdits.toLocaleString()}
              centerLabel="total"
              loading={editTypeData.length === 0}
            />
            <Gauge
              value={botRatio}
              max={100}
              title="Bot Activity"
              format="percent"
              height={300}
              thresholds={[
                { value: 30, color: "emerald" },
                { value: 60, color: "amber" },
                { value: 100, color: "red" },
              ]}
            />

            {/* \u2500\u2500 Live Feed \u2500\u2500 */}
            <MetricGrid.Section title="Live Feed" subtitle="Recent edits streaming in real-time" />
            <DataTable
              data={filteredEdits as never[]}
              columns={editColumns as never[]}
              title={editFilter === "All Edits" ? "Recent Edits" : `Recent Edits (${editFilter})`}
              subtitle="Last 50 edits — click a row to expand details"
              pageSize={15}
              dense
              multiSort
              searchable
              renderExpanded={renderEditExpanded as never}
              rowConditions={[
                { when: (row: Record<string, unknown>) => row.bot === true, className: "bg-blue-50/30 dark:bg-blue-950/15" },
              ]}
            />

          </MetricGrid>
        </MetricProvider>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Source Reveal \u2014 "This entire dashboard is one file"
// ---------------------------------------------------------------------------

const DASHBOARD_SOURCE = `import { KpiCard, StatGroup, AreaChart, BarChart, DonutChart,
  Gauge, DataTable, Callout, DashboardHeader, StatusIndicator,
  MetricProvider, MetricGrid, SegmentToggle, DropdownFilter,
  FilterTags, FilterProvider } from "metricui";
import { useWikipediaStream } from "./useWikipediaStream";

export default function WikipediaDashboard() {
  const { connected, loading, recentEdits, stats } = useWikipediaStream();
  const [editFilter, setEditFilter] = useState("All Edits");
  const [wikiFilter, setWikiFilter] = useState([]);

  // Filter edits based on active filters
  const filteredEdits = useMemo(() => {
    let edits = recentEdits;
    if (editFilter === "Human Only") edits = edits.filter(e => !e.bot);
    if (editFilter === "Bot Only") edits = edits.filter(e => e.bot);
    if (wikiFilter.length > 0) edits = edits.filter(e => wikiFilter.includes(e.wiki));
    return edits;
  }, [recentEdits, editFilter, wikiFilter]);

  // Derive all stats from filtered data
  const botRatio = /* computed from filteredEdits */;
  const topWikis = /* computed from filteredEdits */;
  const editTypes = /* computed from filteredEdits */;

  return (
    <FilterProvider>
    <MetricProvider loading={loading}>
      <DashboardHeader title="Wikipedia Live Edits"
        subtitle="Real-time edits from Wikimedia EventStreams"
        status={connected ? "live" : "loading"} />

      {/* Filters — toggle bot/human, filter by wiki language */}
      <SegmentToggle
        options={["All Edits", "Human Only", "Bot Only"]}
        value={editFilter} onChange={setEditFilter} />
      <DropdownFilter label="Wiki" options={wikiOptions}
        multiple value={wikiFilter} onChange={setWikiFilter} />
      <FilterTags />

      <MetricGrid>
        <MetricGrid.Section title="Live Metrics" />
        <KpiCard title="Total Edits" value={filteredStats.totalEdits}
          format="number" sparkline={{ data: filteredStats.editRateHistory }}
          animate={{ countUp: true }} />
        <KpiCard title="Edit Rate" value={filteredStats.editRate}
          format={{ style: "custom", suffix: "/sec" }} />
        <KpiCard title="Unique Editors" value={filteredStats.uniqueEditors} />
        <KpiCard title="Bot Edits" value={filteredStats.botEditCount} />

        <Callout value={botRatio} rules={[
          { max: 20, variant: "success", title: "Low bot activity" },
          { min: 50, variant: "warning", title: "High bot activity" },
        ]} dismissible />

        <MetricGrid.Section title="Edit Velocity" />
        <AreaChart data={velocity} title="Edits Over Time"
          stacked enableArea gradient height={260} />

        <MetricGrid.Section title="Breakdown" />
        <BarChart data={topWikis} keys={["edits"]} indexBy="wiki"
          title="Edits by Language" layout="horizontal" sort="desc" />
        <DonutChart data={editTypes} title="Edit Types" showPercentage />
        <Gauge value={botRatio} max={100} title="Bot Activity"
          format="percent" thresholds={[
            { value: 30, color: "emerald" },
            { value: 60, color: "amber" },
            { value: 100, color: "red" },
          ]} />

        <MetricGrid.Section title="Live Feed" />
        <DataTable data={filteredEdits} title="Recent Edits"
          pageSize={15} dense />
      </MetricGrid>
    </MetricProvider>
    </FilterProvider>
  );
}`;

function SourceReveal() {
  const [expanded, setExpanded] = useState(false);
  const lineCount = DASHBOARD_SOURCE.split("\n").length;

  return (
    <div className="mt-6">
      <div className="text-center mb-5">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
          One file. {lineCount} lines. Live streaming data.
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          This is the entire dashboard.
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Every KPI, chart, and table below &mdash; powered by MetricUI.
        </p>
      </div>

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[#0d0d10] transition-all duration-500",
            expanded ? "max-h-[2000px]" : "max-h-[320px]"
          )}
        >
          {/* Line numbers + code */}
          <div className="overflow-x-auto p-5">
            <pre className="font-[family-name:var(--font-mono)] text-[13px] leading-relaxed">
              {DASHBOARD_SOURCE.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-6 flex-shrink-0 text-right text-[var(--muted)] opacity-30 select-none">
                    {i + 1}
                  </span>
                  <code className="text-gray-300">
                    {colorize(line)}
                  </code>
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Fade overlay (collapsed only) */}
        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 rounded-b-2xl bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/80 to-transparent" />
        )}
      </div>

      {/* Expand/collapse button \u2014 outside the relative container */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-2 text-sm font-medium text-[var(--foreground)] shadow-lg transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {expanded ? "Collapse" : `See the full source (${lineCount} lines)`}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal syntax highlighting (no dependency)
// ---------------------------------------------------------------------------

function colorize(line: string): React.ReactNode {
  // Simple regex-based highlighting \u2014 good enough for a demo
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const rules: { pattern: RegExp; className: string }[] = [
    // Comments
    { pattern: /^(\s*\/\/.*)$/, className: "text-gray-500" },
    // Import/export/const/function/return keywords
    { pattern: /\b(import|export|from|default|function|const|return)\b/, className: "text-purple-400" },
    // JSX tags
    { pattern: /<\/?([A-Z]\w*)/,  className: "text-cyan-400" },
    // Strings (double + single + backtick)
    { pattern: /"([^"]*)"/, className: "text-emerald-400" },
    // Props/attributes
    { pattern: /\b(\w+)=/, className: "text-sky-300" },
    // Numbers
    { pattern: /\b(\d+)\b/, className: "text-amber-400" },
    // Braces
    { pattern: /([{}()\[\]])/, className: "text-gray-500" },
  ];

  // Apply first matching rule to each segment
  while (remaining.length > 0) {
    let earliest: { match: RegExpMatchArray; rule: typeof rules[0] } | null = null;
    let earliestIdx = Infinity;

    for (const rule of rules) {
      const m = remaining.match(rule.pattern);
      if (m && m.index !== undefined && m.index < earliestIdx) {
        earliest = { match: m, rule };
        earliestIdx = m.index;
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    const { match, rule } = earliest;
    const idx = match.index!;

    // Text before the match
    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }

    // The matched text
    parts.push(
      <span key={key++} className={rule.className}>
        {match[0]}
      </span>
    );

    remaining = remaining.slice(idx + match[0].length);
  }

  return <>{parts}</>;
}
