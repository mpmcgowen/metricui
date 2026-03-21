"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import type { EmptyState, ErrorState, StaleState } from "@/lib/types";
import { useMetricConfig } from "@/lib/MetricProvider";

interface DataStateWrapperProps {
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
  children: React.ReactNode;
  className?: string;
}

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("mu-shimmer rounded-lg", className)}
      style={style}
    />
  );
}

/** Inner skeleton content for KPI cards — no wrapper, caller provides the card shell. */
export function KpiSkeletonContent() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="mt-3 h-8 w-28" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  );
}

/** @deprecated Use KpiSkeletonContent inside your own card shell */
export function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <KpiSkeletonContent />
    </div>
  );
}

/** Inner skeleton content for charts — no wrapper, caller provides the card shell. */
export function ChartSkeletonContent({ height = 300 }: { height?: number }) {
  return (
    <>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-1.5 h-2.5 w-44" />
      <Skeleton className="mt-4 rounded-lg" style={{ height }} />
    </>
  );
}

/** @deprecated Use ChartSkeletonContent inside your own card shell */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <ChartSkeletonContent height={height} />
    </div>
  );
}

function EmptyDisplay({ config, globalDefaults }: { config: EmptyState; globalDefaults?: { message?: string; icon?: React.ReactNode } }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 text-[var(--muted)] opacity-40">
        {config.icon ?? globalDefaults?.icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <p className="text-sm text-[var(--muted)]">
        {config.message ?? globalDefaults?.message ?? "No data available"}
      </p>
      {config.action && <div className="mt-3">{config.action}</div>}
    </div>
  );
}

function ErrorDisplay({ config, globalDefaults }: { config: ErrorState; globalDefaults?: { message?: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 text-[var(--mu-color-negative)]">
        <AlertCircle className="h-10 w-10" />
      </div>
      <p className="text-sm text-red-600 dark:text-red-400">
        {config.message ?? globalDefaults?.message ?? "Something went wrong"}
      </p>
      {config.retry && (
        <button
          onClick={config.retry}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}

function StaleIndicator({ config }: { config: StaleState }) {
  const minutes = config.since
    ? Math.round((Date.now() - config.since.getTime()) / 60000)
    : 0;
  const isWarning = config.warningAfter !== undefined && minutes >= config.warningAfter;
  const label = config.since
    ? minutes < 1
      ? "Just now"
      : minutes < 60
        ? `${minutes}m ago`
        : `${Math.round(minutes / 60)}h ago`
    : "Unknown";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        isWarning
          ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isWarning ? "bg-amber-500 animate-pulse" : "bg-gray-400"
        )}
      />
      Updated {label}
    </div>
  );
}

export function DataStateWrapper({
  loading,
  empty,
  error,
  stale,
  children,
  className,
}: DataStateWrapperProps) {
  const config = useMetricConfig();

  if (error) {
    return (
      <div className={className}>
        <ErrorDisplay config={error} globalDefaults={config.errorState} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {stale && (
        <div className="absolute right-4 top-4 z-10">
          <StaleIndicator config={stale} />
        </div>
      )}
      {loading ? (
        <KpiSkeleton />
      ) : empty ? (
        <EmptyDisplay config={empty} globalDefaults={config.emptyState} />
      ) : (
        children
      )}
    </div>
  );
}
