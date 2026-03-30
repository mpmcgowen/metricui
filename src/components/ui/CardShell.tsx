"use client";

import { forwardRef, useRef, useEffect, useId, type ReactNode } from "react";
import { useAi } from "@/lib/AiContext";
import { cn } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { ExportButton } from "@/components/ui/ExportButton";
import { ChartSkeletonContent, KpiSkeletonContent, DataStateWrapper } from "@/components/ui/DataStateWrapper";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Sparkles } from "lucide-react";
import { Headline as HeadlineDisplay } from "./Headline";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { CardVariant, DataRow, EmptyState, ErrorState, StaleState, ExportableConfig, DataComponentProps } from "@/lib/types";

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
  /** Headline number in the card header — big value with optional comparison and conditions */
  headline?: import("@/lib/types").HeadlineProp;
  /** Content rendered below the main body (e.g., chart legends) */
  below?: ReactNode;
  /** Component name for error boundary diagnostics */
  componentName?: string;
  /** AI context — dev-provided hint about this specific component. Included in AI prompts. */
  aiContext?: string;
  /** AI-only title — used for registration when the component renders its own title (e.g., KpiCard). Not rendered. */
  aiTitle?: string;

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
  empty?: EmptyState | string;
  error?: ErrorState | string;
  stale?: StaleState;
  /** Data state configuration — alternative to individual loading/empty/error/stale props */
  state?: DataComponentProps["state"];

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
  /** ARIA role for accessibility (e.g., "img" for charts) */
  role?: string;
  /** ARIA label for accessibility */
  "aria-label"?: string;
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
    headline,
    below,
    componentName,
    aiContext,
    aiTitle,
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
    loading: loadingProp,
    empty: emptyProp,
    error: errorProp,
    stale: staleProp,
    state: stateConfig,
    exportable: exportableProp,
    exportData,
    copyValue,
    drillDownIcon,
    className,
    classNames,
    id,
    "data-testid": dataTestId,
    role: roleProp,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const config = useMetricConfig();
  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;
  // --- Merge state grouping with flat props (flat props take precedence, then state config, then global config) ---
  const loading = loadingProp ?? stateConfig?.loading;
  const empty = emptyProp ?? stateConfig?.empty;
  const error = errorProp ?? stateConfig?.error;
  const stale = staleProp ?? stateConfig?.stale;
  const resolvedLoading = loading ?? config.loading;
  const resolvedExportable = exportableProp !== undefined ? !!exportableProp : config.exportable;
  const overrideExportData = typeof exportableProp === "object" && exportableProp.data ? exportableProp.data : undefined;
  const cardRef = useRef<HTMLElement>(null);

  // --- AI context: register this component for prompt building + re-rendering ---
  const ai = useAi();
  const aiId = useId();
  const childrenRef = useRef<ReactNode>(null);
  childrenRef.current = children; // always holds latest children

  useEffect(() => {
    const titleStr = aiTitle || (typeof title === "string" ? title : "");
    if (!ai || !titleStr || bare) return;

    // Build rich data context the LLM can understand
    const dataSummary: Record<string, unknown> = {};
    if (copyValue) dataSummary.value = copyValue;
    if (exportData && exportData.length > 0) {
      dataSummary.rowCount = exportData.length;
      // Include full data for small datasets, smart summary for large ones
      if (exportData.length <= 20) {
        dataSummary.rows = exportData;
      } else {
        // Top rows + column summary for large datasets
        dataSummary.first10 = exportData.slice(0, 10);
        dataSummary.columns = Object.keys(exportData[0]);
        // Compute basic stats for numeric columns
        const stats: Record<string, { min: number; max: number; avg: number }> = {};
        for (const key of Object.keys(exportData[0])) {
          const vals = exportData.map((r) => r[key]).filter((v): v is number => typeof v === "number");
          if (vals.length > 0) {
            stats[key] = {
              min: Math.min(...vals),
              max: Math.max(...vals),
              avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
            };
          }
        }
        if (Object.keys(stats).length > 0) dataSummary.stats = stats;
      }
    }

    ai.registerMetric(aiId, {
      component: componentName ?? "Unknown",
      title: titleStr,
      data: dataSummary,
      aiContext: aiContext || undefined,
      render: () => childrenRef.current,
      height,
    });

    return () => ai.unregisterMetric(aiId);
  }, [ai, aiId, title, aiTitle, componentName, exportData, copyValue, bare, aiContext, height]);

  const isClickable = !!(onClick || href || clickable);
  const Tag: "a" | "div" = href ? "a" : "div";

  // --- Merge refs ---
  const setRef = (el: HTMLElement | null) => {
    (cardRef as React.MutableRefObject<HTMLElement | null>).current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  // --- Data state early returns (error > loading > empty) ---
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
      : { message: config.messages.noResults };
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
      role={roleProp}
      aria-label={ariaLabel}
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
              "noise-texture group relative flex flex-col border p-[var(--mu-padding)] transition-all duration-[var(--mu-transition-duration)]",
              CARD_CLASSES,
              HOVER_CLASSES,
              isClickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-[var(--mu-transition-duration)]",
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

      {/* Action buttons — top right, visible on hover */}
      {(resolvedExportable || (ai?.enabled && (aiTitle || typeof title === "string"))) && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5">
          {/* AI sparkle */}
          {ai?.enabled && (aiTitle || typeof title === "string") && !bare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                ai.openWith(aiTitle || (typeof title === "string" ? title : "") || "");
              }}
              className={cn(
                "rounded-md p-1 text-[var(--muted)] opacity-0 transition-all",
                "group-hover:opacity-60 hover:!opacity-100 hover:text-[var(--accent)]",
                "focus:opacity-100",
                resolvedDense ? "p-0.5" : "p-1",
              )}
              aria-label="Ask AI about this"
            >
              <Sparkles className="h-3 w-3" />
            </button>
          )}
          {/* Export */}
          {resolvedExportable && (
            <ExportButton
              title={title ?? componentName ?? "Export"}
              targetRef={cardRef}
              data={overrideExportData ?? exportData}
              copyValue={copyValue}
              dense={resolvedDense}
            />
          )}
        </div>
      )}

      {/* Header */}
      {(title || action || headline) && (
        <div className={cn("mb-4 flex items-start justify-between", classNames?.header)}>
          <div className="min-w-0">
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
              <p className="mu-chart-subtitle mt-0.5 text-[length:var(--mu-text-xs)] text-[var(--muted)] opacity-80">
                {subtitle}
              </p>
            )}
            {headline && <HeadlineDisplay headline={headline} />}
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
        <p className={cn("mt-3 text-[length:var(--mu-text-2xs)] leading-snug text-[var(--muted)]", classNames?.footnote)}>
          {footnote}
        </p>
      )}

    </Tag>
  );
});
