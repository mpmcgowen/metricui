"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/cards/KpiCard";
import { StatGroup } from "@/components/cards/StatGroup";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Callout } from "@/components/ui/Callout";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { MetricProvider } from "@/lib/MetricProvider";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { FilterProvider } from "@/lib/FilterContext";
import { FilterTags } from "@/components/filters/FilterTags";
import {
  repoStats,
  commitActivity,
  languages,
  recentIssues,
  recentPulls,
  releases,
} from "@/data/github";
import {
  Star,
  GitFork,
  CircleDot,
  Eye,
  GitPullRequest,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function weekTimestampToLabel(ts: number): string {
  const d = new Date(ts * 1000);
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function daysAgo(iso: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 30) return `${diff}d ago`;
  if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
  return `${Math.floor(diff / 365)}y ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GitHubDashboard() {
  // --- Commit activity as flat rows (unified format) ---
  const commitAreaData = useMemo(
    () => commitActivity.map((w) => ({
      week: weekTimestampToLabel(w.week),
      commits: w.total,
    })),
    []
  );

  // Sparkline from weekly totals
  const commitSparkline = useMemo(
    () => commitActivity.map((w) => w.total),
    []
  );

  // Total commits in last 52 weeks
  const totalCommits = useMemo(
    () => commitActivity.reduce((sum, w) => sum + w.total, 0),
    []
  );

  // Commits per day-of-week for bar chart
  const commitsByDay = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    for (const w of commitActivity) {
      for (let d = 0; d < 7; d++) {
        totals[d] += w.days[d];
      }
    }
    return totals.map((count, i) => ({
      day: DAY_NAMES[i],
      commits: count,
    }));
  }, []);

  // Heatmap: day-of-week x week as flat rows (unified format)
  const recentWeeks = useMemo(() => commitActivity.slice(-26), []);
  const weekLabels = useMemo(() => recentWeeks.map((w) => weekTimestampToLabel(w.week)), [recentWeeks]);
  const heatmapData = useMemo(() => {
    return DAY_NAMES.map((day, dayIdx) => {
      const row: Record<string, string | number> = { day };
      recentWeeks.forEach((w, i) => {
        row[weekLabels[i]] = w.days[dayIdx];
      });
      return row;
    });
  }, [recentWeeks, weekLabels]);

  // Language breakdown as flat rows (unified format)
  const languageData = useMemo(() => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([lang, bytes]) => ({
        language: lang,
        share: Math.round((bytes / total) * 1000) / 10,
      }));
  }, []);

  // PR stats
  const prStats = useMemo(() => {
    const merged = recentPulls.filter((p) => p.mergedAt !== null).length;
    const open = recentPulls.filter((p) => p.state === "open").length;
    const closed = recentPulls.filter(
      (p) => p.state === "closed" && p.mergedAt === null
    ).length;
    return { merged, open, closed };
  }, []);

  // Issue table columns
  const issueColumns = useMemo(
    () => [
      {
        key: "number" as const,
        header: "#",
        width: 60,
        sortable: true,
      },
      {
        key: "title" as const,
        header: "Title",
        render: (val: unknown, row: (typeof recentIssues)[0]) => (
          <span className="flex items-center gap-2">
            <span className="max-w-[300px] truncate inline-block">
              {String(val)}
            </span>
            {row.labels
              .filter((l) => !["CLA Signed", "Resolution: Stale"].includes(l))
              .slice(0, 2)
              .map((l) => (
                <Badge key={l} size="sm" variant="outline">
                  {l}
                </Badge>
              ))}
          </span>
        ),
      },
      {
        key: "state" as const,
        header: "State",
        type: "badge" as const,
        width: 80,
        badgeColor: (v: unknown) => v === "open" ? "#10B981" : "#8B5CF6",
      },
      {
        key: "user" as const,
        header: "Author",
        width: 120,
      },
      {
        key: "comments" as const,
        header: "Comments",
        type: "number" as const,
        width: 90,
        sortable: true,
      },
      {
        key: "reactions" as const,
        header: "Reactions",
        type: "number" as const,
        width: 90,
        sortable: true,
      },
      {
        key: "updatedAt" as const,
        header: "Updated",
        type: "date" as const,
        width: 100,
      },
    ],
    []
  );

  // PR table columns
  const prColumns = useMemo(
    () => [
      {
        key: "number" as const,
        header: "#",
        width: 60,
        sortable: true,
      },
      {
        key: "title" as const,
        header: "Title",
        render: (val: unknown, row: (typeof recentPulls)[0]) => (
          <span className="flex items-center gap-2">
            <span className="max-w-[300px] truncate inline-block">
              {String(val)}
            </span>
            {row.draft && (
              <Badge size="sm" variant="outline" color="gray">
                draft
              </Badge>
            )}
          </span>
        ),
      },
      {
        key: "state" as const,
        header: "State",
        width: 80,
        render: (val: unknown, row: (typeof recentPulls)[0]) => {
          const merged = row.mergedAt !== null;
          return (
            <Badge
              size="sm"
              color={merged ? "purple" : val === "open" ? "emerald" : "red"}
              variant="outline"
            >
              {merged ? "merged" : String(val)}
            </Badge>
          );
        },
      },
      {
        key: "user" as const,
        header: "Author",
        width: 120,
      },
      {
        key: "createdAt" as const,
        header: "Created",
        type: "date" as const,
        width: 100,
      },
    ],
    []
  );

  // Release table
  const releaseData = useMemo(
    () =>
      releases.map((r) => ({
        tag: r.tag,
        name: r.name,
        author: r.author,
        published: formatDate(r.publishedAt),
        prerelease: r.prerelease,
      })),
    []
  );

  const [view, setView] = useState<string>("Issues");
  const [labelFilter, setLabelFilter] = useState<string[]>([]);

  // Unique labels for dropdown
  const allLabels = useMemo(() => {
    const labelSet = new Set<string>();
    for (const issue of recentIssues) {
      for (const l of issue.labels) {
        if (!["CLA Signed", "Resolution: Stale"].includes(l)) {
          labelSet.add(l);
        }
      }
    }
    return [...labelSet].sort().map((l) => ({
      value: l,
      label: l,
      count: recentIssues.filter((i) => i.labels.includes(l)).length,
    }));
  }, []);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (labelFilter.length === 0) return recentIssues;
    return recentIssues.filter((i) =>
      labelFilter.some((l) => i.labels.includes(l))
    );
  }, [labelFilter]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* ── Code Hero ── */}
        <div className="flex items-center justify-between">
          <div />
          <ThemeToggle />
        </div>
        <SourceReveal />

        {/* ── Header ── */}
        <div className="mt-8">
          <DashboardHeader
            title="facebook/react"
            subtitle={`${repoStats.description} — Repository Analytics`}
            back={{ href: "/docs/kpi-card", label: "Docs" }}
            variant="flat"
          />
        </div>

        <FilterProvider defaultPreset="90d">

        {/* ── Period Selector ── */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PeriodSelector
              presets={["30d", "90d", "quarter", "ytd", "year"]}
              comparison
            />
            <SegmentToggle
              options={[
                { value: "Issues", label: "Issues", icon: <CircleDot className="h-3.5 w-3.5" />, badge: labelFilter.length > 0 ? filteredIssues.length : recentIssues.length },
                { value: "Pull Requests", label: "Pull Requests", icon: <GitPullRequest className="h-3.5 w-3.5" />, badge: recentPulls.length },
              ]}
              value={view}
              onChange={(v) => setView(v as string)}
              size="sm"
            />
            {view === "Issues" && allLabels.length > 0 && (
              <DropdownFilter
                label="Label"
                options={allLabels}
                multiple
                showAll
                value={labelFilter}
                onChange={(v) => setLabelFilter(v as string[])}
                dense
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator
              value={1}
              size="sm"
              rules={[{ min: 1, color: "emerald", label: "CI Passing", pulse: true }]}
            />
            <StatusIndicator
              value={1}
              size="sm"
              rules={[{ min: 1, color: "emerald", label: "Security" }]}
            />
            <StatusIndicator
              value={1}
              size="sm"
              rules={[{ min: 1, color: "amber", label: "Deps Outdated" }]}
            />
            <StatusIndicator
              value={1}
              size="sm"
              rules={[{ min: 1, color: "blue", label: "Docs" }]}
            />
          </div>
        </div>

        <FilterTags className="mt-3" />

        <MetricProvider variant="outlined">
        <MetricGrid className="mt-6">

          {/* ── Overview ── */}
          <MetricGrid.Section title="Overview" />
          <KpiCard
            title="Stars"
            value={repoStats.stars}
            format="compact"
            icon={<Star className="h-3.5 w-3.5" />}
            animate={{ countUp: true }}
          />
          <KpiCard
            title="Forks"
            value={repoStats.forks}
            format="compact"
            icon={<GitFork className="h-3.5 w-3.5" />}
            animate={{ countUp: true, delay: 100 }}
          />
          <KpiCard
            title="Open Issues"
            value={labelFilter.length > 0 ? filteredIssues.length : repoStats.openIssues}
            format="number"
            description={labelFilter.length > 0 ? `Filtered from ${repoStats.openIssues}` : undefined}
            icon={<CircleDot className="h-3.5 w-3.5" />}
            animate={{ countUp: true, delay: 200 }}
          />
          <KpiCard
            title="Commits (52 weeks)"
            value={totalCommits}
            format="number"
            sparkline={{ data: commitSparkline, type: "bar" }}
            icon={<GitPullRequest className="h-3.5 w-3.5" />}
            animate={{ countUp: true, delay: 300 }}
          />
          <StatGroup
            stats={[
              {
                label: "Watchers",
                value: repoStats.watchers,
                format: "compact",
                icon: <Eye className="h-3 w-3" />,
              },
              {
                label: "License",
                value: repoStats.license,
              },
              {
                label: "Latest Release",
                value: releases[0]?.tag ?? "\u2014",
                icon: <Tag className="h-3 w-3" />,
              },
              {
                label: "Last Push",
                value: daysAgo(repoStats.pushedAt),
              },
              {
                label: "Age",
                value: `${Math.floor((Date.now() - new Date(repoStats.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365))} years`,
              },
            ]}
            dense
          />

          {/* ── Development Activity ── */}
          <MetricGrid.Section title="Development Activity" border />
          <HeatMap
            data={heatmapData}
            index="day"
            categories={weekLabels}
            title="Contribution Activity"
            subtitle="Last 26 weeks — commits by day of week"
            height={220}
          />
          <AreaChart
            data={commitAreaData}
            index="week"
            categories={["commits"]}
            title="Weekly Commits"
            subtitle="52-week trend"
            format="number"
            height={280}
            curve="monotoneX"
            enableArea
            gradient
          />
          <BarChart
            data={commitsByDay}
            index="day"
            categories={["commits"]}
            title="Commits by Day"
            format="number"
            height={280}
          />
          <DonutChart
            data={languageData}
            index="language"
            categories={["share"]}
            title="Languages"
            height={280}
            showPercentage
            innerRadius={0.65}
          />

          {/* ── Pull Requests & Issues ── */}
          <MetricGrid.Section
            title="Pull Requests & Issues"
            badge={
              <div className="flex gap-2">
                <Badge size="sm" color="emerald">{prStats.open} open</Badge>
                <Badge size="sm" color="purple">{prStats.merged} merged</Badge>
                <Badge size="sm" color="red">{prStats.closed} closed</Badge>
              </div>
            }
          />
          {view === "Issues" ? (
            <DataTable
              data={filteredIssues as never[]}
              columns={issueColumns as never[]}
              title="Recent Issues"
              subtitle={labelFilter.length > 0 ? `Filtered by: ${labelFilter.join(", ")}` : "Click a row to expand — Shift+click headers to multi-sort"}
              pageSize={8}
              dense
              multiSort
              searchable
              renderExpanded={(row: Record<string, unknown>) => (
                <DetailGrid columns={3}>
                  <DetailGrid.Item label="Labels">
                    <span className="flex flex-wrap gap-1.5">
                      {((row.labels as string[]) ?? []).map((l: string) => (
                        <Badge key={l} size="sm" variant="outline">{l}</Badge>
                      ))}
                      {((row.labels as string[]) ?? []).length === 0 && <span className="text-[var(--muted)]">No labels</span>}
                    </span>
                  </DetailGrid.Item>
                  <DetailGrid.Item label="Comments">
                    <span className="font-[family-name:var(--font-mono)]">{String(row.comments ?? 0)}</span>
                  </DetailGrid.Item>
                  <DetailGrid.Item label="Reactions">
                    <span className="font-[family-name:var(--font-mono)]">{String(row.reactions ?? 0)}</span>
                  </DetailGrid.Item>
                </DetailGrid>
              )}
              rowConditions={[
                { when: (row: Record<string, unknown>) => (row.reactions as number) > 20, className: "bg-amber-50/30 dark:bg-amber-950/15" },
              ]}
            />
          ) : (
            <DataTable
              data={recentPulls as never[]}
              columns={prColumns as never[]}
              title="Recent Pull Requests"
              pageSize={8}
              dense
              multiSort
              searchable
              renderExpanded={(row: Record<string, unknown>) => (
                <DetailGrid columns={3}>
                  <DetailGrid.Item label="Title">
                    {String(row.title)}
                  </DetailGrid.Item>
                  <DetailGrid.Item label="Status">
                    <span className="flex items-center gap-1.5">
                      {row.mergedAt ? (
                        <Badge size="sm" color="purple">Merged</Badge>
                      ) : row.state === "open" ? (
                        <Badge size="sm" color="emerald">Open</Badge>
                      ) : (
                        <Badge size="sm" color="red">Closed</Badge>
                      )}
                      {Boolean(row.draft) && <Badge size="sm" variant="outline" color="gray">Draft</Badge>}
                    </span>
                  </DetailGrid.Item>
                  <DetailGrid.Item label="Author">
                    {String(row.user)}
                  </DetailGrid.Item>
                </DetailGrid>
              )}
            />
          )}

          {/* ── Releases ── */}
          <MetricGrid.Section title="Releases" border />
          <Callout
            variant="info"
            title={`Latest Release: ${releases[0]?.tag ?? "—"}`}
            icon={<Tag className="h-5 w-5" />}
            dense
          >
            {releases[0]?.name} — published {formatDate(releases[0]?.publishedAt ?? "")} by {releases[0]?.author}
          </Callout>
          <DataTable
            data={releaseData}
            title="Recent Releases"
            pageSize={10}
            dense
          />

        </MetricGrid>
        </MetricProvider>
        </FilterProvider>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Source Reveal — GitHub-themed (monochrome, tighter)
// ---------------------------------------------------------------------------

const DASHBOARD_SOURCE = `import { KpiCard, StatGroup, AreaChart, BarChart,
  DonutChart, HeatMap, DataTable, DashboardHeader,
  MetricGrid, Callout } from "metricui";
import { repoStats, commitActivity, languages } from "./data";

export default function GitHubDashboard() {
  const commits = commitActivity.map(w => ({
    week: formatWeek(w.week), commits: w.total,
  }));

  return (
    <>
      <DashboardHeader title="facebook/react" />

      <MetricGrid>
        <MetricGrid.Section title="Overview" />
        <KpiCard title="Stars" value={repoStats.stars} format="compact" />
        <KpiCard title="Forks" value={repoStats.forks} format="compact" />
        <KpiCard title="Open Issues" value={repoStats.openIssues} />
        <KpiCard title="Commits" value={totalCommits}
          sparkline={{ data: commits.map(c => c.commits) }} />
        <StatGroup stats={stats} dense />

        <MetricGrid.Section title="Development Activity" />
        <HeatMap data={heatmapData} index="day" categories={weekLabels}
          title="Contribution Activity" />
        <AreaChart data={commits} index="week" categories={["commits"]}
          title="Weekly Commits" enableArea gradient />
        <BarChart data={commitsByDay} index="day" categories={["commits"]}
          title="Commits by Day" />
        <DonutChart data={langs} index="language" categories={["share"]}
          title="Languages" showPercentage />

        <MetricGrid.Section title="Pull Requests & Issues" />
        <DataTable data={recentIssues} title="Issues" dense />
        <DataTable data={recentPulls} title="Pull Requests" dense />

        <MetricGrid.Section title="Releases" />
        <Callout variant="info" title="Latest Release: v19.1.0" />
        <DataTable data={releases} title="Recent Releases" dense />
      </MetricGrid>
    </>
  );
}`;

function SourceReveal() {
  const [expanded, setExpanded] = useState(false);
  const lineCount = DASHBOARD_SOURCE.split("\n").length;

  return (
    <div className="mt-6">
      <div className="text-center mb-5">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
          Static data. {lineCount} lines. Zero boilerplate.
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          One data shape. Every chart.
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Flat rows flow into AreaChart, BarChart, DonutChart, HeatMap — no reshaping.
        </p>
      </div>

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-[var(--card-border)] bg-[#0d0d10] transition-all duration-500",
            expanded ? "max-h-[2000px]" : "max-h-[300px]"
          )}
        >
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[11px] text-gray-500 font-mono">dashboard.tsx</span>
          </div>
          <div className="overflow-x-auto p-4 pt-3">
            <pre className="font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.7]">
              {DASHBOARD_SOURCE.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-6 flex-shrink-0 text-right text-gray-600 select-none">
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

        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 rounded-b-xl bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/80 to-transparent" />
        )}
      </div>

      <div className="mt-3 flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {expanded ? "Collapse" : `View full source (${lineCount} lines)`}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal syntax highlighting
// ---------------------------------------------------------------------------

function colorize(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const rules: { pattern: RegExp; className: string }[] = [
    { pattern: /^(\s*\/\/.*)$/, className: "text-gray-500" },
    { pattern: /\{\/\*.*?\*\/\}/, className: "text-gray-500" },
    { pattern: /\b(import|export|from|default|function|const|return|map|reduce)\b/, className: "text-purple-400" },
    { pattern: /<\/?([A-Z]\w*)/, className: "text-cyan-400" },
    { pattern: /"([^"]*)"/, className: "text-emerald-400" },
    { pattern: /\b(\w+)=/, className: "text-sky-300" },
    { pattern: /\b(\d+)\b/, className: "text-amber-400" },
    { pattern: /([{}()\[\]])/, className: "text-gray-500" },
  ];

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

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }

    parts.push(
      <span key={key++} className={rule.className}>
        {match[0]}
      </span>
    );

    remaining = remaining.slice(idx + match[0].length);
  }

  return <>{parts}</>;
}
