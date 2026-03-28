"use client";

import { forwardRef, useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { BaseComponentProps } from "@/lib/types";
import { useMetricFilters, PRESET_LABELS } from "@/lib/FilterContext";
import type { DateRange, PeriodPreset } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterTagsProps extends BaseComponentProps {
  /** Fields to exclude from display */
  exclude?: string[];
  /** Fields to include (whitelist — if set, only these show) */
  include?: string[];
  /** Custom labels for dimension fields. Default: uses the field name capitalized. */
  labels?: Record<string, string>;
  /** Custom period formatter. Default: preset label or "MMM D – MMM D" */
  formatPeriod?: (range: DateRange, preset: PeriodPreset | null) => string;
  /** Custom dimension value formatter. Default: joins with ", " */
  formatDimension?: (field: string, values: string[]) => string;
  /** Show dismiss buttons on each chip. Default: true */
  dismissible?: boolean;
  /** Show "Clear all" button when multiple filters active. Default: true */
  clearAll?: boolean;
  /** Label for the clear all button. Default: "Clear all" */
  clearAllLabel?: string;
  /** Callback when a specific filter is cleared */
  onClear?: (field: string) => void;
  /** Callback when all filters are cleared */
  onClearAll?: () => void;
  /** Max visible chips before collapsing. 0 = no limit. Default: 0 */
  maxVisible?: number;
  /** Show the period filter as a tag. Default: true */
  showPeriod?: boolean;
  /** Show the comparison mode as a tag. Default: true */
  showComparison?: boolean;
  /** Show the active cross-filter selection as a tag. Default: true */
  showCrossFilter?: boolean;
  /** Custom labels for cross-filter fields */
  crossFilterLabels?: Record<string, string>;
  /** Dense mode */
  dense?: boolean;
  /** Sub-element class overrides */
  classNames?: {
    root?: string;
    chip?: string;
    clearAll?: string;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function defaultFormatPeriod(range: DateRange, preset: PeriodPreset | null): string {
  if (preset) return PRESET_LABELS[preset];
  const s = range.start;
  const e = range.end;
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}`;
}

function defaultFormatDimension(_field: string, values: string[]): string {
  if (values.length <= 2) return values.join(", ");
  return `${values[0]}, ${values[1]} +${values.length - 2}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1").replace(/_/g, " ");
}

// ---------------------------------------------------------------------------
// Tag data
// ---------------------------------------------------------------------------

interface TagData {
  key: string;
  label: string;
  value: string;
  onDismiss?: () => void;
  /** Visual variant: "filter" (outlined) or "selection" (solid, for cross-filter) */
  variant?: "filter" | "selection";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const FilterTags = forwardRef<HTMLDivElement, FilterTagsProps>(
  function FilterTags(
    {
      exclude,
      include,
      labels,
      formatPeriod = defaultFormatPeriod,
      formatDimension = defaultFormatDimension,
      dismissible = true,
      clearAll = true,
      clearAllLabel = "Clear all",
      onClear,
      onClearAll,
      maxVisible = 0,
      showPeriod = true,
      showComparison = true,
      showCrossFilter = true,
      crossFilterLabels,
      dense: denseProp,
      className,
      classNames,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const filters = useMetricFilters();
    const crossFilter = useCrossFilter();
    const resolvedDense = denseProp ?? config.dense;

    const [expanded, setExpanded] = useState(false);

    // --- Build tag list from filter state ---
    const tags = useMemo((): TagData[] => {
      if (!filters) return [];
      const result: TagData[] = [];
      const excluded = new Set(exclude ?? []);
      const included = include ? new Set(include) : null;

      // Period tag
      if (showPeriod && filters.period) {
        if (!excluded.has("_period") && (!included || included.has("_period"))) {
          result.push({
            key: "_period",
            label: "Period",
            value: formatPeriod(filters.period, filters.preset),
            onDismiss: dismissible
              ? () => {
                  filters.setPeriod({ start: new Date(0), end: new Date() }, "all");
                  onClear?.("_period");
                }
              : undefined,
          });
        }
      }

      // Comparison tag
      if (showComparison && filters.comparisonMode !== "none") {
        if (!excluded.has("_comparison") && (!included || included.has("_comparison"))) {
          const compLabel = filters.comparisonMode === "previous" ? "vs previous period" : "vs year ago";
          result.push({
            key: "_comparison",
            label: "Comparing",
            value: compLabel,
            onDismiss: dismissible
              ? () => {
                  filters.setComparisonMode("none");
                  onClear?.("_comparison");
                }
              : undefined,
          });
        }
      }

      // Dimension tags
      for (const [field, values] of Object.entries(filters.dimensions)) {
        if (values.length === 0) continue;
        if (excluded.has(field)) continue;
        if (included && !included.has(field)) continue;

        const fieldLabel = labels?.[field] ?? capitalize(field);
        const valueLabel = formatDimension(field, values);

        result.push({
          key: field,
          label: fieldLabel,
          value: valueLabel,
          onDismiss: dismissible
            ? () => {
                filters.clearDimension(field);
                onClear?.(field);
              }
            : undefined,
        });
      }

      return result;
    }, [
      filters, exclude, include, labels, showPeriod, showComparison,
      formatPeriod, formatDimension, dismissible, onClear,
    ]);

    // --- Cross-filter selection tag (separate from dimension filters) ---
    const crossFilterTag = useMemo((): TagData | null => {
      if (!showCrossFilter || !crossFilter?.isActive || !crossFilter.selection) return null;
      const { field, value } = crossFilter.selection;
      const fieldLabel = crossFilterLabels?.[field] ?? labels?.[field] ?? capitalize(field);
      return {
        key: "_crossFilter",
        label: fieldLabel,
        value: String(value),
        variant: "selection",
        onDismiss: () => crossFilter.clear(),
      };
    }, [showCrossFilter, crossFilter?.isActive, crossFilter?.selection, crossFilterLabels, labels, crossFilter]);

    // --- Clear all handler ---
    const handleClearAll = useCallback(() => {
      if (filters) {
        filters.clearAll();
      }
      crossFilter?.clear();
      onClearAll?.();
    }, [filters, crossFilter, onClearAll]);

    // --- Don't render if no active filters ---
    const allTags = crossFilterTag ? [crossFilterTag, ...tags] : tags;
    if (allTags.length === 0) return null;

    // --- Visible tags (respect maxVisible) ---
    const visibleTags = maxVisible > 0 && !expanded
      ? allTags.slice(0, maxVisible)
      : allTags;
    const hiddenCount = maxVisible > 0 && !expanded
      ? allTags.length - maxVisible
      : 0;

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn(
          "flex flex-wrap items-center gap-1.5",
          className,
          classNames?.root,
        )}
      >
        {visibleTags.map((tag) => {
          const isSelection = tag.variant === "selection";
          return (
            <span
              key={tag.key}
              className={cn(
                "inline-flex items-center gap-1 rounded-full font-medium",
                isSelection
                  ? "border border-[var(--accent)] bg-[var(--accent)]/[0.15] text-[var(--accent)]"
                  : "border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] text-[var(--accent)]",
                resolvedDense ? "px-2 py-0.5 text-[length:var(--mu-text-2xs)]" : "px-2.5 py-1 text-xs",
                classNames?.chip,
              )}
            >
              {isSelection && (
                <svg className={resolvedDense ? "h-2.5 w-2.5" : "h-3 w-3"} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <circle cx="8" cy="8" r="4" />
                </svg>
              )}
              <span className={isSelection ? "text-[var(--accent)]/80" : "text-[var(--accent)]/60"}>
                {tag.label}:
              </span>
              <span>{tag.value}</span>
              {tag.onDismiss && (
                <button
                  onClick={tag.onDismiss}
                  className="ml-0.5 rounded-full p-0.5 opacity-50 transition-opacity hover:opacity-100"
                  aria-label={isSelection ? `Clear ${tag.label} selection` : `Remove ${tag.label} filter`}
                >
                  <X className={resolvedDense ? "h-2.5 w-2.5" : "h-3 w-3"} />
                </button>
              )}
            </span>
          );
        })}

        {/* Overflow indicator */}
        {hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className={cn(
              "rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]",
              resolvedDense ? "px-2 py-0.5 text-[length:var(--mu-text-2xs)]" : "px-2.5 py-1 text-xs",
            )}
          >
            +{hiddenCount} more
          </button>
        )}

        {/* Clear all */}
        {clearAll && allTags.length > 1 && (
          <button
            onClick={handleClearAll}
            className={cn(
              "rounded-full font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]",
              resolvedDense ? "px-1.5 py-0.5 text-[length:var(--mu-text-2xs)]" : "px-2 py-1 text-xs",
              classNames?.clearAll,
            )}
          >
            {clearAllLabel}
          </button>
        )}
      </div>
    );
  },
);
