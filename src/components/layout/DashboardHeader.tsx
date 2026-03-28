"use client";

import { forwardRef, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CARD_CLASSES } from "@/lib/styles";
import { useMetricConfig } from "@/lib/MetricProvider";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CardVariant } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export type DashboardStatus = "live" | "stale" | "offline" | "loading";

export interface DashboardHeaderProps {
  /** Dashboard title */
  title: string;
  /** Subtitle / secondary label */
  subtitle?: string;
  /** Description popover content */
  description?: string | React.ReactNode;
  /** Timestamp of last data update — enables "Updated Xm ago" auto-tick */
  lastUpdated?: Date;
  /** Minutes before "last updated" turns amber. Default: 5 */
  staleAfter?: number;
  /** Dashboard status badge. Auto-derived from lastUpdated/staleAfter if not set. */
  status?: DashboardStatus;
  /** Back navigation link */
  back?: { href?: string; label?: string; onClick?: () => void };
  /** Breadcrumb trail */
  breadcrumbs?: BreadcrumbItem[];
  /** Action slot — rendered right-aligned */
  actions?: React.ReactNode;
  /** Card variant override */
  variant?: CardVariant;
  /** Dense layout */
  dense?: boolean;
  className?: string;
  /** Sub-element class name overrides */
  classNames?: {
    root?: string;
    title?: string;
    subtitle?: string;
    breadcrumbs?: string;
    status?: string;
    actions?: string;
  };
  /** HTML id attribute */
  id?: string;
  /** Test id */
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const statusConfig: Record<DashboardStatus, { label: string; dot: string; text: string; pulse: boolean }> = {
  live: {
    label: "Live",
    dot: "bg-[var(--mu-color-positive)]",
    text: "text-[var(--mu-color-positive)]",
    pulse: true,
  },
  stale: {
    label: "Stale",
    dot: "bg-[var(--mu-color-warning)]",
    text: "text-[var(--mu-color-warning)]",
    pulse: false,
  },
  offline: {
    label: "Offline",
    dot: "bg-[var(--mu-color-negative)]",
    text: "text-[var(--mu-color-negative)]",
    pulse: false,
  },
  loading: {
    label: "Loading",
    dot: "bg-[var(--muted)]",
    text: "text-[var(--muted)]",
    pulse: true,
  },
};

function StatusBadge({ status, className }: { status: DashboardStatus; className?: string }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[length:var(--mu-text-xs)] font-medium", cfg.text, className)}>
      <span className="relative flex h-2 w-2">
        {cfg.pulse && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", cfg.dot)} />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", cfg.dot)} />
      </span>
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DashboardHeaderInner = forwardRef<HTMLDivElement, DashboardHeaderProps>(function DashboardHeader({
  title,
  subtitle,
  description,
  lastUpdated,
  staleAfter = 5,
  status: statusProp,
  back,
  breadcrumbs,
  actions,
  variant,
  dense,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
}, ref) {
  const config = useMetricConfig();
  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;

  // --- Auto-tick "updated X ago" ---
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => setTick((t) => t + 1), 15_000); // tick every 15s
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const timeAgo = lastUpdated ? formatTimeAgo(lastUpdated) : null;

  // --- Derive status from lastUpdated if not explicit ---
  const resolvedStatus = useMemo((): DashboardStatus | null => {
    if (statusProp) return statusProp;
    if (!lastUpdated) return null;
    const minutesAgo = (Date.now() - lastUpdated.getTime()) / 60_000;
    return minutesAgo > staleAfter ? "stale" : "live";
  }, [statusProp, lastUpdated, staleAfter]);

  const isStale = useMemo(() => {
    if (!lastUpdated) return false;
    return (Date.now() - lastUpdated.getTime()) / 60_000 > staleAfter;
  }, [lastUpdated, staleAfter]);

  const BackTag = back?.href ? "a" : "button";
  const backProps = back?.href ? { href: back.href } : { onClick: back?.onClick };

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-component="DashboardHeader"
      data-variant={resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      className={cn(
        "noise-texture relative border p-[var(--mu-padding)]",
        CARD_CLASSES,
        classNames?.root,
        className,
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumbs"
          className={cn("mb-3 flex items-center gap-1 text-[length:var(--mu-text-xs)] text-[var(--muted)]", classNames?.breadcrumbs)}
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            const CrumbTag = crumb.href ? "a" : crumb.onClick ? "button" : "span";
            const crumbProps = crumb.href
              ? { href: crumb.href }
              : crumb.onClick
                ? { onClick: crumb.onClick }
                : {};
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-40" />}
                <CrumbTag
                  {...(crumbProps as any)}
                  className={cn(
                    isLast
                      ? "font-medium text-[var(--foreground)]"
                      : "transition-colors hover:text-[var(--foreground)]",
                    (crumb.href || crumb.onClick) && !isLast && "cursor-pointer",
                  )}
                >
                  {crumb.label}
                </CrumbTag>
              </span>
            );
          })}
        </nav>
      )}

      {/* Back link */}
      {back && !breadcrumbs && (
        <BackTag
          {...(backProps as any)}
          className="mb-3 inline-flex items-center gap-1 text-[length:var(--mu-text-xs)] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>{back.label ?? "Back"}</span>
        </BackTag>
      )}

      {/* Main row: title block + actions */}
      <div className="mu-header-row flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className={cn(
                "truncate font-[family-name:var(--font-mono)] text-lg font-semibold leading-tight tracking-tight text-[var(--foreground)]",
                resolvedDense && "text-base",
                classNames?.title,
              )}
            >
              {title}
            </h1>
            {description && (
              <DescriptionPopover content={typeof description === "string" ? description : description} />
            )}
            {resolvedStatus && (
              <StatusBadge status={resolvedStatus} className={classNames?.status} />
            )}
          </div>

          {/* Subtitle + last updated */}
          {(subtitle || timeAgo) && (
            <div className="mt-1 flex items-center gap-2">
              {subtitle && (
                <p className={cn("text-xs text-[var(--muted)]", classNames?.subtitle)}>
                  {subtitle}
                </p>
              )}
              {subtitle && timeAgo && (
                <span className="text-[var(--card-border)]">·</span>
              )}
              {timeAgo && (
                <span
                  className={cn(
                    "text-[length:var(--mu-text-xs)] font-[family-name:var(--font-mono)] transition-colors",
                    isStale ? "text-[var(--mu-color-warning)]" : "text-[var(--muted)]",
                  )}
                >
                  Updated {timeAgo}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: actions */}
        {actions && (
          <div className={cn("mu-header-actions flex flex-shrink-0 items-center gap-2", classNames?.actions)}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Export with error boundary
// ---------------------------------------------------------------------------

export const DashboardHeader = withErrorBoundary(DashboardHeaderInner, "DashboardHeader");
(DashboardHeader as any).__gridHint = "header";
