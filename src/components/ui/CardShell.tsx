"use client";

import { forwardRef, useRef, useEffect, useId, type ReactNode } from "react";
import { useAi } from "@/lib/AiContext";
import { cn } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { ExportButton } from "@/components/ui/ExportButton";
import { ChartSkeletonContent, KpiSkeletonContent, DataStateWrapper } from "@/components/ui/DataStateWrapper";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { CardVariant, DataRow, EmptyState, ErrorState, StaleState, ExportableConfig } from "@/lib/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CardShellProps {
  children: ReactNode;

  // --- Identity ---
  title?: string;
  subtitle?: string;
  description?: string | ReactNode;
  footnote?: string;
  action?: ReactNode;
  /** Content rendered below the main body (e.g., chart legends) */
  below?: ReactNode;
  /** Component name for error boundary diagnostics */
  componentName?: string;

  // --- Interaction ---
  /** Makes the card clickable. */
  onClick?: () => void;
  /** Makes the card a link. */
  href?: string;
  /** Cursor pointer without onClick (e.g., when drillDown handles the click) */
  clickable?: boolean;

  // --- Visual ---
  variant?: CardVariant;
  dense?: boolean;
  /** Strip all card chrome — bare content only */
  bare?: boolean;
  /** Custom border color */
  accent?: string;
  /** Attention ring. `true` uses accent, or pass a CSS color. */
  highlight?: boolean | string;
  /** Additional inline styles on the card root */
  style?: React.CSSProperties;
  /** CSS class for value flash animation */
  flashClass?: string;

  // --- Layout ---
  /** Min-height for the body area (used by charts) */
  height?: number;
  /** Skeleton type for loading state */
  skeletonType?: "kpi" | "chart";

  // --- Data states ---
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;

  // --- Export ---
  exportable?: ExportableConfig;
  /** Auto-passed source data for CSV export */
  exportData?: DataRow[];
  /** Formatted value for clipboard copy (KPIs) */
  copyValue?: string;

  // --- Drill-down indicator ---
  drillDownIcon?: ReactNode;

  // --- Styling ---
  className?: string;
  classNames?: {
    root?: string;
    header?: string;
    body?: string;
    footnote?: string;
  };
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CardShell = forwardRef<HTMLElement, CardShellProps>(function CardShell(
  {
    children,
    title,
    subtitle,
    description,
    footnote,
    action,
    below,
    componentName,
    onClick,
    href,
    clickable,
    variant,
    dense,
    bare,
    accent,
    highlight,
    style,
    flashClass,
    height,
    skeletonType = "chart",
    loading,
    empty,
    error,
    stale,
    exportable: exportableProp,
    exportData,
    copyValue,
    drillDownIcon,
    className,
    classNames,
    id,
    "data-testid": dataTestId,
  },
  ref,
) {
  const config = useMetricConfig();
  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;
  const resolvedLoading = loading ?? config.loading;
  const resolvedExportable = exportableProp !== undefined ? !!exportableProp : config.exportable;
  const overrideExportData = typeof exportableProp === "object" && exportableProp.data ? exportableProp.data : undefined;
  const cardRef = useRef<HTMLElement>(null);

  // --- AI context: register this component's data for prompt building ---
  const ai = useAi();
  const aiId = useId();
  useEffect(() => {
    if (!ai || !title || bare) return;
    const titleStr = typeof title === "string" ? title : "";
    if (!titleStr) return;

    // Build a data summary from exportData (first few rows) or copyValue
    const dataSummary: Record<string, unknown> = {};
    if (copyValue) dataSummary.value = copyValue;
    if (exportData && exportData.length > 0) {
      // Include summary stats, not raw rows
      dataSummary.rows = exportData.length;
      if (exportData.length <= 5) {
        dataSummary.data = exportData;
      } else {
        dataSummary.sample = exportData.slice(0, 3);
        dataSummary.total = exportData.length;
      }
    }

    ai.registerMetric(aiId, {
      component: componentName ?? "Unknown",
      title: titleStr,
      data: dataSummary,
    });

    return () => ai.unregisterMetric(aiId);
  }, [ai, aiId, title, componentName, exportData, copyValue, bare]);

  const isClickable = !!(onClick || href || clickable);
  const Tag: "a" | "div" = href ? "a" : "div";

  // --- Merge refs ---
  const setRef = (el: HTMLElement | null) => {
    (cardRef as React.MutableRefObject<HTMLElement | null>).current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  // --- Data state early returns ---
  if (resolvedLoading) {
    return (
      <div
        data-variant={bare ? undefined : resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        className={cn(
          bare ? "mu-container" : cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES),
          classNames?.root,
          className,
        )}
      >
        {skeletonType === "kpi" ? <KpiSkeletonContent /> : <ChartSkeletonContent height={height ?? 300} />}
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-variant={bare ? undefined : resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        className={cn(
          bare ? "mu-container" : cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES),
          classNames?.root,
          className,
        )}
      >
        <DataStateWrapper error={error}><div /></DataStateWrapper>
      </div>
    );
  }

  // Explicit empty state
  if (empty) {
    return (
      <div
        data-variant={bare ? undefined : resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        className={cn(
          bare ? "mu-container" : cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES),
          classNames?.root,
          className,
        )}
      >
        <DataStateWrapper empty={empty}><div /></DataStateWrapper>
      </div>
    );
  }

  // Auto-detect empty data — show smart default when exportData is an empty array
  if (exportData && Array.isArray(exportData) && exportData.length === 0) {
    const autoEmpty = config.emptyState?.message
      ? config.emptyState
      : { message: "Nothing to show — try adjusting your filters" };
    return (
      <div
        data-variant={bare ? undefined : resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        className={cn(
          bare ? "mu-container" : cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES),
          classNames?.root,
          className,
        )}
      >
        {title && (
          <div className="mb-4">
            <span className="text-[length:var(--mu-title-size)] font-medium tracking-wide uppercase text-[var(--muted)]">{title}</span>
          </div>
        )}
        <DataStateWrapper empty={autoEmpty}><div /></DataStateWrapper>
      </div>
    );
  }

  // --- Highlight styles ---
  const highlightStyle: React.CSSProperties = {};
  if (accent) highlightStyle.borderColor = accent;
  if (highlight === true) {
    highlightStyle.boxShadow = "0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)";
    highlightStyle.outline = "2px solid color-mix(in srgb, var(--accent) 30%, transparent)";
    highlightStyle.outlineOffset = "2px";
  } else if (typeof highlight === "string") {
    highlightStyle.boxShadow = `0 0 0 2px ${highlight}40`;
    highlightStyle.outline = `2px solid ${highlight}40`;
    highlightStyle.outlineOffset = "2px";
  }

  return (
    <Tag
      {...(href ? { href } : {})}
      ref={setRef as never}
      id={id}
      data-testid={dataTestId}
      data-component={componentName}
      data-ai-title={typeof title === "string" ? title : undefined}
      data-metric-card=""
      data-variant={bare ? undefined : resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      onClick={onClick}
      className={cn(
        "h-full",
        bare
          ? cn("mu-container group relative", "px-[var(--mu-padding-x-bare)] py-[var(--mu-padding-y-bare)] sm:px-[var(--mu-padding-x-bare-sm)]")
          : cn(
              "noise-texture group relative flex flex-col border p-[var(--mu-padding)] transition-all duration-300",
              CARD_CLASSES,
              HOVER_CLASSES,
              isClickable && "cursor-pointer",
            ),
        flashClass,
        classNames?.root,
        className,
      )}
      style={{ ...highlightStyle, ...style } as React.CSSProperties}
    >
      {/* Stale indicator */}
      {stale && (
        <div className="absolute right-3 top-3 z-10">
          <DataStateWrapper stale={stale}><div /></DataStateWrapper>
        </div>
      )}

      {/* Export button */}
      {resolvedExportable && (
        <div className="absolute right-2 top-2 z-10">
          <ExportButton
            title={title ?? componentName ?? "Export"}
            targetRef={cardRef}
            data={overrideExportData ?? exportData}
            copyValue={copyValue}
            dense={resolvedDense}
          />
        </div>
      )}

      {/* Header */}
      {(title || action) && (
        <div className={cn("mb-4 flex items-start justify-between", classNames?.header)}>
          <div>
            <div className="flex items-center gap-1.5">
              {title && (
                <span className="truncate text-[length:var(--mu-title-size)] font-medium tracking-wide uppercase text-[var(--muted)]">
                  {title}
                </span>
              )}
              {description && (
                <DescriptionPopover content={typeof description === "string" ? description : description} />
              )}
            </div>
            {subtitle && (
              <p className="mu-chart-subtitle mt-0.5 text-[11px] text-[var(--muted)] opacity-80">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-1 flex-shrink-0">{action}</div>}
        </div>
      )}

      {/* Body */}
      <ErrorBoundary componentName={componentName ?? "CardShell"}>
        <div
          className={cn("flex-1", classNames?.body)}
          style={height ? { minHeight: height } : undefined}
        >
          {children}
        </div>
      </ErrorBoundary>

      {/* Below slot (legends, etc.) */}
      {below}

      {/* Footnote */}
      {footnote && (
        <p className={cn("mt-3 text-[10px] leading-snug text-[var(--muted)] opacity-75", classNames?.footnote)}>
          {footnote}
        </p>
      )}

      {/* Drill-down indicator */}
      {drillDownIcon}
    </Tag>
  );
});
