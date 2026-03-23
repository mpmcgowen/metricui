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
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { CrossFilterProvider, useCrossFilter } from "@/lib/CrossFilterContext";
import { LinkedHoverProvider } from "@/lib/LinkedHoverContext";
import { FilterTags } from "@/components/filters/FilterTags";
import {
  repoStats,
  commitActivity,
  languages,
  recentIssues,
  recentPulls,
  releases,
} from "@/data/github";
import { Sparkline } from "@/components/charts/Sparkline";
import { Gauge } from "@/components/charts/Gauge";
import {
  Star,
  GitFork,
  CircleDot,
  Eye,
  GitPullRequest,
  Tag,
  Clock,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
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
// Expanded row helpers
// ---------------------------------------------------------------------------

/** Days between two ISO dates (or now) */
function daysBetween(from: string, to?: string | null): number {
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : Date.now();
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
}

/** Generate fake-but-plausible weekly comment activity from total + dates */
function commentTimeline(total: number, weeks: number): number[] {
  if (total === 0 || weeks === 0) return Array(Math.max(weeks, 4)).fill(0);
  const len = Math.max(weeks, 4);
  const result: number[] = [];
  let remaining = total;
  // heavier at start, taper off
  for (let i = 0; i < len; i++) {
    const weight = Math.max(0.1, 1 - i / len) + Math.random() * 0.5;
    const val = Math.round(weight * (remaining / (len - i)));
    const clamped = Math.min(val, remaining);
    result.push(clamped);
    remaining -= clamped;
  }
  if (remaining > 0) result[0] += remaining;
  return result;
}

/** Engagement score: weighted combo of comments + reactions + age penalty */
function engagementScore(comments: number, reactions: number, ageDays: number): number {
  const raw = (comments * 3) + (reactions * 5);
  const agePenalty = Math.max(0.3, 1 - ageDays / 365);
  return Math.min(100, Math.round(raw * agePenalty));
}

// ---------------------------------------------------------------------------
// Helpers — date filtering
// ---------------------------------------------------------------------------

/** Convert a unix timestamp (seconds) to a Date */
function weekTsToDate(ts: number): Date {
  return new Date(ts * 1000);
}

/** Check if a Date falls within a DateRange (inclusive) */
function inRange(d: Date, start: Date, end: Date): boolean {
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GitHubDashboard() {
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
        <CrossFilterProvider>
        <DashboardContent />
        </CrossFilterProvider>
        </FilterProvider>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardContent — reads filter state, derives all data
// ---------------------------------------------------------------------------

function DashboardContent() {
  const filters = useMetricFilters();
  const crossFilter = useCrossFilter();
  const [view, setView] = useState<string>("Issues");
  const [labelFilter, setLabelFilter] = useState<string[]>([]);

  // --- Period-filtered commit activity ---
  const periodCommits = useMemo(() => {
    if (!filters?.period) return commitActivity;
    return commitActivity.filter((w) => {
      const weekDate = weekTsToDate(w.week);
      return inRange(weekDate, filters.period!.start, filters.period!.end);
    });
  }, [filters?.period]);

  // Comparison-period commits (for previous period badges)
  const comparisonCommits = useMemo(() => {
    if (!filters?.comparisonPeriod) return null;
    return commitActivity.filter((w) => {
      const weekDate = weekTsToDate(w.week);
      return inRange(weekDate, filters.comparisonPeriod!.start, filters.comparisonPeriod!.end);
    });
  }, [filters?.comparisonPeriod]);

  // --- Period-filtered issues ---
  const periodIssues = useMemo(() => {
    let issues = recentIssues;
    if (filters?.period) {
      issues = issues.filter((i) =>
        inRange(new Date(i.createdAt), filters.period!.start, filters.period!.end)
      );
    }
    return issues;
  }, [filters?.period]);

  // --- Period-filtered PRs ---
  const periodPulls = useMemo(() => {
    let pulls = recentPulls;
    if (filters?.period) {
      pulls = pulls.filter((p) =>
        inRange(new Date(p.createdAt), filters.period!.start, filters.period!.end)
      );
    }
    return pulls;
  }, [filters?.period]);

  // --- Period-filtered releases ---
  const periodReleases = useMemo(() => {
    let rels = releases;
    if (filters?.period) {
      rels = rels.filter((r) =>
        inRange(new Date(r.publishedAt), filters.period!.start, filters.period!.end)
      );
    }
    return rels;
  }, [filters?.period]);

  // --- Cross-filter: if a day-of-week is selected, narrow commits further ---
  const activeDayFilter = crossFilter?.selection?.field === "day" ? String(crossFilter.selection.value) : null;
  // Commit area data (flat rows for AreaChart)
  const commitAreaData = useMemo(
    () => periodCommits.map((w) => ({
      week: weekTimestampToLabel(w.week),
      commits: activeDayFilter
        ? w.days[DAY_NAMES.indexOf(activeDayFilter)] ?? 0
        : w.total,
    })),
    [periodCommits, activeDayFilter]
  );

  // Sparkline from weekly totals
  const commitSparkline = useMemo(
    () => periodCommits.map((w) =>
      activeDayFilter
        ? w.days[DAY_NAMES.indexOf(activeDayFilter)] ?? 0
        : w.total
    ),
    [periodCommits, activeDayFilter]
  );

  // Total commits
  const totalCommits = useMemo(
    () => commitSparkline.reduce((sum, v) => sum + v, 0),
    [commitSparkline]
  );

  // Comparison total
  const comparisonTotalCommits = useMemo(() => {
    if (!comparisonCommits) return null;
    return comparisonCommits.reduce((sum, w) =>
      sum + (activeDayFilter ? (w.days[DAY_NAMES.indexOf(activeDayFilter)] ?? 0) : w.total), 0);
  }, [comparisonCommits, activeDayFilter]);

  // Commits per day-of-week for bar chart
  const commitsByDay = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    for (const w of periodCommits) {
      for (let d = 0; d < 7; d++) {
        totals[d] += w.days[d];
      }
    }
    return totals.map((count, i) => ({
      day: DAY_NAMES[i],
      commits: count,
    }));
  }, [periodCommits]);

  // Heatmap: day-of-week x week — use last 26 from period-filtered set
  const recentWeeks = useMemo(() => periodCommits.slice(-26), [periodCommits]);
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

  // Language breakdown as flat rows (static — not time-dependent)
  const languageData = useMemo(() => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([lang, bytes]) => ({
        language: lang,
        share: Math.round((bytes / total) * 1000) / 10,
      }));
  }, []);

  // PR stats (from period-filtered data)
  const prStats = useMemo(() => {
    const merged = periodPulls.filter((p) => p.mergedAt !== null).length;
    const open = periodPulls.filter((p) => p.state === "open").length;
    const closed = periodPulls.filter(
      (p) => p.state === "closed" && p.mergedAt === null
    ).length;
    return { merged, open, closed };
  }, [periodPulls]);

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
      periodReleases.map((r) => ({
        tag: r.tag,
        name: r.name,
        author: r.author,
        published: formatDate(r.publishedAt),
        prerelease: r.prerelease,
      })),
    [periodReleases]
  );

  // Unique labels for dropdown (from period-filtered issues)
  const allLabels = useMemo(() => {
    const labelSet = new Set<string>();
    for (const issue of periodIssues) {
      for (const l of issue.labels) {
        if (!["CLA Signed", "Resolution: Stale"].includes(l)) {
          labelSet.add(l);
        }
      }
    }
    return [...labelSet].sort().map((l) => ({
      value: l,
      label: l,
      count: periodIssues.filter((i) => i.labels.includes(l)).length,
    }));
  }, [periodIssues]);

  // Filtered issues (period + label filter)
  const filteredIssues = useMemo(() => {
    if (labelFilter.length === 0) return periodIssues;
    return periodIssues.filter((i) =>
      labelFilter.some((l) => i.labels.includes(l))
    );
  }, [labelFilter, periodIssues]);

  // Open issue count — from period-filtered set
  const openIssueCount = useMemo(
    () => filteredIssues.filter((i) => i.state === "open").length,
    [filteredIssues]
  );

  return (
    <>
        {/* ── Period Selector ── */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PeriodSelector
              presets={["30d", "90d", "quarter", "ytd", "year"]}
              comparison
            />
            <SegmentToggle
              options={[
                { value: "Issues", label: "Issues", icon: <CircleDot className="h-3.5 w-3.5" />, badge: labelFilter.length > 0 ? filteredIssues.length : periodIssues.length },
                { value: "Pull Requests", label: "Pull Requests", icon: <GitPullRequest className="h-3.5 w-3.5" />, badge: periodPulls.length },
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

        <MetricProvider theme="slate" variant="outlined">
        <LinkedHoverProvider>
        <MetricGrid className="mt-6">

          {/* ── Overview ── */}
          <MetricGrid.Section title="Overview" />
          <KpiCard
            title="Stars"
            value={repoStats.stars}
            format="compact"
            icon={<Star className="h-3.5 w-3.5" />}
            description="Total GitHub stars. A measure of community interest and project visibility."
            animate={{ countUp: true }}
          />
          <KpiCard
            title="Forks"
            value={repoStats.forks}
            format="compact"
            icon={<GitFork className="h-3.5 w-3.5" />}
            description="Active forks of the repository. Indicates downstream development and contribution potential."
            animate={{ countUp: true, delay: 100 }}
          />
          <KpiCard
            title="Open Issues"
            value={labelFilter.length > 0 ? openIssueCount : periodIssues.filter((i) => i.state === "open").length}
            format="number"
            description={labelFilter.length > 0 ? `Showing ${openIssueCount} open of ${filteredIssues.length} filtered issues.` : `Issues created in the selected period that are currently open.`}
            icon={<CircleDot className="h-3.5 w-3.5" />}
            animate={{ countUp: true, delay: 200 }}
          />
          <KpiCard
            title={`Commits${activeDayFilter ? ` (${activeDayFilter})` : ""}`}
            value={totalCommits}
            format="number"
            sparkline={{ data: commitSparkline, type: "bar" }}
            icon={<GitPullRequest className="h-3.5 w-3.5" />}
            comparison={comparisonTotalCommits != null ? { value: comparisonTotalCommits, label: "prev period" } : undefined}
            description={({ value }) => `${value.toLocaleString()} commits${activeDayFilter ? ` on ${activeDayFilter}s` : ""} in the selected period. Sparkline shows weekly volume.`}
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
                value: (periodReleases[0]?.tag ?? releases[0]?.tag) ?? "\u2014",
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
            subtitle={`Last ${recentWeeks.length} weeks — commits by day of week`}
            description="GitHub-style contribution heatmap. Darker cells indicate more commits on that day."
            height={220}
            crossFilter
          />
          <AreaChart
            data={commitAreaData}
            index="week"
            categories={["commits"]}
            title="Weekly Commits"
            subtitle={`${periodCommits.length}-week trend${activeDayFilter ? ` (${activeDayFilter}s only)` : ""}`}
            description="Total commits to the default branch per week. Spikes often correlate with release cycles."
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
            crossFilter
          />
          <DonutChart
            data={languageData}
            index="language"
            categories={["share"]}
            title="Languages"
            description="Percentage of codebase by language, measured in bytes via GitHub's linguist."
            height={280}
            showPercentage
            innerRadius={0.65}
            crossFilter
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
              renderExpanded={(row: Record<string, unknown>) => {
                const created = row.createdAt as string;
                const closed = row.closedAt as string | null;
                const comments = (row.comments as number) ?? 0;
                const reactions = (row.reactions as number) ?? 0;
                const labels = (row.labels as string[]) ?? [];
                const ageDays = daysBetween(created);
                const ageWeeks = Math.max(1, Math.ceil(ageDays / 7));
                const score = engagementScore(comments, reactions, ageDays);
                const timeline = commentTimeline(comments, Math.min(ageWeeks, 12));
                const ttc = closed ? daysBetween(created, closed) : null;

                return (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
                    {/* Left: timeline + metadata */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Comment Activity
                        </p>
                        <div className="mt-1.5">
                          <Sparkline
                            data={timeline}
                            type="bar"
                            height={36}
                            color={comments > 10 ? "#6366F1" : undefined}
                            interactive
                            format="number"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {labels.filter(l => !["CLA Signed", "Resolution: Stale"].includes(l)).map((l: string) => (
                          <Badge key={l} size="sm" variant="outline">{l}</Badge>
                        ))}
                        {labels.filter(l => !["CLA Signed", "Resolution: Stale"].includes(l)).length === 0 && (
                          <span className="text-xs text-[var(--muted)]">No labels</span>
                        )}
                      </div>
                    </div>

                    {/* Middle: key stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <DetailGrid.Item label="Age">
                        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm">
                          <Clock className="h-3 w-3 text-[var(--muted)]" />
                          {ageDays < 1 ? "today" : ageDays < 30 ? `${ageDays}d` : ageDays < 365 ? `${Math.floor(ageDays / 30)}mo` : `${(ageDays / 365).toFixed(1)}y`}
                        </span>
                      </DetailGrid.Item>
                      {ttc !== null && (
                        <DetailGrid.Item label="Time to Close">
                          <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm">
                            <AlertCircle className="h-3 w-3 text-[var(--muted)]" />
                            {ttc < 1 ? "<1d" : ttc < 30 ? `${ttc}d` : `${Math.floor(ttc / 30)}mo`}
                          </span>
                        </DetailGrid.Item>
                      )}
                      <DetailGrid.Item label="Comments">
                        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm">
                          <MessageSquare className="h-3 w-3 text-[var(--muted)]" />
                          {comments}
                        </span>
                      </DetailGrid.Item>
                      <DetailGrid.Item label="Reactions">
                        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm">
                          <ThumbsUp className="h-3 w-3 text-[var(--muted)]" />
                          {reactions}
                        </span>
                      </DetailGrid.Item>
                    </div>

                    {/* Right: engagement gauge */}
                    <div className="flex items-center justify-center">
                      <Gauge
                        value={score}
                        min={0}
                        max={100}
                        title="Engagement"
                        height={100}

                        arcAngle={180}
                        thresholds={[
                          { value: 30, color: "gray" },
                          { value: 60, color: "amber" },
                          { value: 100, color: "emerald" },
                        ]}
                        dense
                        variant="ghost"
                      />
                    </div>
                  </div>
                );
              }}
              rowConditions={[
                { when: (row: Record<string, unknown>) => (row.reactions as number) > 20, className: "bg-amber-50/30 dark:bg-amber-950/15" },
              ]}
            />
          ) : (
            <DataTable
              data={periodPulls as never[]}
              columns={prColumns as never[]}
              title="Recent Pull Requests"
              pageSize={8}
              dense
              multiSort
              searchable
              renderExpanded={(row: Record<string, unknown>) => {
                const created = row.createdAt as string;
                const closed = row.closedAt as string | null;
                const merged = row.mergedAt as string | null;
                const isDraft = Boolean(row.draft);
                const ageDays = daysBetween(created);
                const ttm = merged ? daysBetween(created, merged) : null;
                const ttc = closed ? daysBetween(created, closed) : null;
                const labels = ((row.labels as string[]) ?? []).filter(l => !["CLA Signed", "Resolution: Stale"].includes(l));

                // Simulated review/CI data based on state
                const reviewStatus = merged ? "approved" : isDraft ? "pending" : row.state === "open" ? "in review" : "changes requested";
                const ciStatus = merged ? "passed" : row.state === "open" ? "running" : "failed";

                return (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                    {/* Left: metadata grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                      <DetailGrid.Item label="Author">
                        <span className="font-[family-name:var(--font-mono)] text-sm">{String(row.user)}</span>
                      </DetailGrid.Item>
                      <DetailGrid.Item label="Age">
                        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm">
                          <Clock className="h-3 w-3 text-[var(--muted)]" />
                          {ageDays < 1 ? "today" : ageDays < 30 ? `${ageDays}d` : `${Math.floor(ageDays / 30)}mo`}
                        </span>
                      </DetailGrid.Item>
                      {ttm !== null && (
                        <DetailGrid.Item label="Time to Merge">
                          <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--mu-color-positive)]">
                            {ttm < 1 ? "<1d" : ttm < 30 ? `${ttm}d` : `${Math.floor(ttm / 30)}mo`}
                          </span>
                        </DetailGrid.Item>
                      )}
                      {ttc !== null && !merged && (
                        <DetailGrid.Item label="Time to Close">
                          <span className="font-[family-name:var(--font-mono)] text-sm">
                            {ttc < 1 ? "<1d" : ttc < 30 ? `${ttc}d` : `${Math.floor(ttc / 30)}mo`}
                          </span>
                        </DetailGrid.Item>
                      )}
                      <DetailGrid.Item label="Review">
                        <StatusIndicator
                          value={reviewStatus === "approved" ? 100 : reviewStatus === "in review" ? 50 : reviewStatus === "pending" ? 0 : 25}
                          size="sm"
                          rules={[
                            { min: 90, color: "emerald", label: "Approved" },
                            { min: 40, max: 90, color: "blue", label: "In Review" },
                            { min: 1, max: 40, color: "red", label: "Changes Requested" },
                            { color: "gray", label: "Pending" },
                          ]}
                        />
                      </DetailGrid.Item>
                      <DetailGrid.Item label="CI">
                        <StatusIndicator
                          value={ciStatus === "passed" ? 100 : ciStatus === "running" ? 50 : 0}
                          size="sm"
                          rules={[
                            { min: 90, color: "emerald", label: "Passed" },
                            { min: 40, max: 90, color: "amber", label: "Running", pulse: true },
                            { color: "red", label: "Failed" },
                          ]}
                        />
                      </DetailGrid.Item>
                      {labels.length > 0 && (
                        <DetailGrid.Item label="Labels">
                          <span className="flex flex-wrap gap-1.5">
                            {labels.map((l: string) => (
                              <Badge key={l} size="sm" variant="outline">{l}</Badge>
                            ))}
                          </span>
                        </DetailGrid.Item>
                      )}
                      {isDraft && (
                        <DetailGrid.Item label="Status">
                          <Badge size="sm" variant="outline" color="gray">Draft — not ready for review</Badge>
                        </DetailGrid.Item>
                      )}
                    </div>

                    {/* Right: lifecycle gauge */}
                    <div className="flex items-center justify-center">
                      <Gauge
                        value={merged ? 100 : row.state === "open" ? Math.min(90, ageDays) : 0}
                        min={0}
                        max={100}
                        title="Lifecycle"
                        subtitle={merged ? "Merged" : row.state === "open" ? "Open" : "Closed"}
                        height={100}

                        arcAngle={180}
                        thresholds={[
                          { value: 30, color: "emerald" },
                          { value: 70, color: "amber" },
                          { value: 100, color: "red" },
                        ]}
                        dense
                        variant="ghost"
                      />
                    </div>
                  </div>
                );
              }}
            />
          )}

          {/* ── Releases ── */}
          <MetricGrid.Section title="Releases" border />
          <Callout
            variant="info"
            title={`Latest Release: ${(periodReleases[0]?.tag ?? releases[0]?.tag) ?? "—"}`}
            icon={<Tag className="h-5 w-5" />}
            dense
          >
            {(periodReleases[0] ?? releases[0])?.name} — published {formatDate((periodReleases[0] ?? releases[0])?.publishedAt ?? "")} by {(periodReleases[0] ?? releases[0])?.author}
          </Callout>
          <DataTable
            data={releaseData}
            title="Recent Releases"
            pageSize={10}
            dense
          />

        </MetricGrid>
        </LinkedHoverProvider>
        </MetricProvider>
    </>
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
