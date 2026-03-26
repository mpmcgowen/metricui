"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { BaseComponentProps } from "@/lib/types";
import {
  useMetricFilters,
  PRESET_LABELS,
  type PeriodPreset,
  type ComparisonMode,
  type DateRange,
} from "@/lib/FilterContext";
import { Calendar, ChevronDown, ArrowLeftRight, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PeriodSelectorProps extends BaseComponentProps {
  /** Which presets to show. Default: ["7d", "30d", "90d", "month", "quarter", "ytd"] */
  presets?: PeriodPreset[];
  /** Allow custom date range. Default: true */
  allowCustom?: boolean;
  /** Show comparison toggle. Default: false */
  comparison?: boolean;
  /** Comparison mode options. Default: ["previous", "year-over-year"] */
  comparisonOptions?: ComparisonMode[];
  /** Standalone mode — fires onChange instead of using FilterContext */
  onChange?: (period: DateRange, preset: PeriodPreset | null) => void;
  /** Standalone comparison callback */
  onComparisonChange?: (mode: ComparisonMode, period: DateRange | null) => void;
  /** Dense mode */
  dense?: boolean;
}

// ---------------------------------------------------------------------------
// Date formatting helper
// ---------------------------------------------------------------------------

function formatDateShort(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromInputValue(val: string): Date | null {
  const d = new Date(val + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

// ---------------------------------------------------------------------------
// Comparison labels
// ---------------------------------------------------------------------------

const COMPARISON_LABELS: Record<ComparisonMode, string> = {
  none: "No comparison",
  previous: "vs previous period",
  "year-over-year": "vs same period last year",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PeriodSelector = forwardRef<HTMLDivElement, PeriodSelectorProps>(
  function PeriodSelector(
    {
      presets = ["7d", "30d", "90d", "month", "quarter", "ytd"],
      allowCustom = true,
      comparison = false,
      comparisonOptions = ["previous", "year-over-year"],
      onChange,
      onComparisonChange,
      dense: denseProp,
      className,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const filters = useMetricFilters();
    const resolvedDense = denseProp ?? config.dense;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [customOpen, setCustomOpen] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Active state (from context or local) ---
    const activePreset = filters?.preset ?? null;
    const activePeriod = filters?.period ?? null;
    const activeComparison = filters?.comparisonMode ?? "none";

    // --- Display label ---
    const displayLabel = useMemo(() => {
      if (activePreset) return PRESET_LABELS[activePreset];
      if (activePeriod) {
        return `${formatDateShort(activePeriod.start)} – ${formatDateShort(activePeriod.end)}`;
      }
      return "Select period";
    }, [activePreset, activePeriod]);

    // --- Handlers ---
    const handlePreset = useCallback((preset: PeriodPreset) => {
      if (filters) {
        filters.setPreset(preset);
      }
      if (onChange) {
        // Compute range for standalone mode
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        // Simplified — use the context helper via import
        onChange({ start: new Date(), end }, preset);
      }
      setDropdownOpen(false);
      setCustomOpen(false);
    }, [filters, onChange]);

    const handleCustomApply = useCallback(() => {
      const start = fromInputValue(customStart);
      const end = fromInputValue(customEnd);
      if (!start || !end || start > end) return;
      end.setHours(23, 59, 59, 999);
      if (filters) {
        filters.setCustomRange(start, end);
      }
      if (onChange) {
        onChange({ start, end }, null);
      }
      setDropdownOpen(false);
      setCustomOpen(false);
    }, [customStart, customEnd, filters, onChange]);

    const handleComparisonChange = useCallback((mode: ComparisonMode) => {
      if (filters) {
        filters.setComparisonMode(mode);
      }
      if (onComparisonChange) {
        onComparisonChange(mode, null);
      }
    }, [filters, onComparisonChange]);

    // --- Click outside ---
    useEffect(() => {
      if (!dropdownOpen) return;
      function handleClick(e: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setDropdownOpen(false);
          setCustomOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdownOpen]);

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn("relative inline-flex items-center gap-2", className)}
      >
        {/* Main trigger button */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] font-medium text-[var(--foreground)] transition-colors",
              "hover:border-gray-300 dark:hover:border-gray-600",
              "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
              resolvedDense ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
            )}
          >
            <Calendar className={resolvedDense ? "h-3 w-3 text-[var(--muted)]" : "h-3.5 w-3.5 text-[var(--muted)]"} />
            <span>{displayLabel}</span>
            <ChevronDown className={cn(
              "text-[var(--muted)] transition-transform",
              resolvedDense ? "h-3 w-3" : "h-3.5 w-3.5",
              dropdownOpen && "rotate-180",
            )} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className={cn(
                "absolute left-0 top-full z-50 mt-1.5 min-w-[220px] rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1.5 shadow-xl shadow-black/[0.08] dark:shadow-black/40",
              )}
            >
              {/* Preset buttons */}
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    activePreset === preset
                      ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
                      : "text-[var(--foreground)] hover:bg-[var(--card-glow)]",
                  )}
                >
                  {PRESET_LABELS[preset]}
                </button>
              ))}

              {/* Custom range */}
              {allowCustom && (
                <>
                  <div className="my-1 border-t border-[var(--card-border)]" />
                  {!customOpen ? (
                    <button
                      onClick={() => {
                        setCustomOpen(true);
                        if (activePeriod) {
                          setCustomStart(toInputValue(activePeriod.start));
                          setCustomEnd(toInputValue(activePeriod.end));
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        !activePreset && activePeriod
                          ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
                          : "text-[var(--foreground)] hover:bg-[var(--card-glow)]",
                      )}
                    >
                      <Calendar className="h-3.5 w-3.5 text-[var(--muted)]" />
                      Custom range
                    </button>
                  ) : (
                    <div className="px-2 py-2">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                        Custom Range
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full rounded-md border border-[var(--card-border)] bg-[var(--background)] px-2 py-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                        <span className="text-xs text-[var(--muted)]">–</span>
                        <input
                          type="date"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full rounded-md border border-[var(--card-border)] bg-[var(--background)] px-2 py-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <button
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                        className="mt-2 w-full rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Comparison toggle */}
        {comparison && activePeriod && (
          <div className="relative">
            <button
              onClick={() => {
                // Cycle through: none → previous → year-over-year → none
                const modes: ComparisonMode[] = ["none", ...comparisonOptions];
                const currentIdx = modes.indexOf(activeComparison);
                const nextIdx = (currentIdx + 1) % modes.length;
                handleComparisonChange(modes[nextIdx]);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border transition-colors",
                resolvedDense ? "px-2 py-1.5 text-[10px]" : "px-2.5 py-2 text-xs",
                activeComparison !== "none"
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] font-medium text-[var(--accent)]"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-gray-300 dark:hover:border-gray-600",
              )}
              title={COMPARISON_LABELS[activeComparison]}
            >
              <ArrowLeftRight className={resolvedDense ? "h-3 w-3" : "h-3.5 w-3.5"} />
              {activeComparison !== "none" && (
                <span>{activeComparison === "previous" ? "vs prev" : "vs YoY"}</span>
              )}
              {activeComparison !== "none" && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComparisonChange("none");
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); handleComparisonChange("none"); } }}
                  className="ml-0.5 rounded-full p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          </div>
        )}

        {/* Active period display (when comparison is active) */}
        {comparison && activeComparison !== "none" && activePeriod && filters?.comparisonPeriod && (
          <span className={cn(
            "text-[var(--muted)]",
            resolvedDense ? "text-[10px]" : "text-xs",
          )}>
            comparing {formatDateShort(filters.comparisonPeriod.start)} – {formatDateShort(filters.comparisonPeriod.end)}
          </span>
        )}
      </div>
    );
  },
);
