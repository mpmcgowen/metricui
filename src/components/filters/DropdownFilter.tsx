"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import { useMetricFilters } from "@/lib/FilterContext";
import { ChevronDown, Search, X, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DropdownOption {
  /** Unique value */
  value: string;
  /** Display label. Defaults to value. */
  label?: string;
  /** Optional count badge */
  count?: number;
  /** Icon rendered before label */
  icon?: React.ReactNode;
  /** Group this option belongs to */
  group?: string;
}

export interface DropdownFilterProps {
  /** Label shown on the trigger button */
  label: string;
  /** Options — array of objects or simple strings */
  options: DropdownOption[] | string[];
  /** Controlled selected value(s) */
  value?: string | string[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selections. Default: false */
  multiple?: boolean;
  /** Show search input inside dropdown. Default: auto (true when > 8 options) */
  searchable?: boolean;
  /** Placeholder text for search input. Default: "Search..." */
  searchPlaceholder?: string;
  /** Filter context field name — reads/writes to FilterContext dimensions */
  field?: string;
  /** Show "All" option that clears selection. Default: true for multiple mode */
  showAll?: boolean;
  /** Label for the "All" option. Default: "All" */
  allLabel?: string;
  /** Max height of dropdown in px. Default: 280 */
  maxHeight?: number;
  /** Dense mode */
  dense?: boolean;
  /** Additional class names */
  className?: string;
  /** Sub-element class overrides */
  classNames?: {
    root?: string;
    trigger?: string;
    dropdown?: string;
    option?: string;
    search?: string;
  };
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Normalize options
// ---------------------------------------------------------------------------

function normalizeOptions(options: DropdownOption[] | string[]): DropdownOption[] {
  return options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DropdownFilter = forwardRef<HTMLDivElement, DropdownFilterProps>(
  function DropdownFilter(
    {
      label,
      options: optionsProp,
      value: valueProp,
      defaultValue,
      onChange,
      multiple = false,
      searchable: searchableProp,
      searchPlaceholder = "Search...",
      field,
      showAll,
      allLabel = "All",
      maxHeight = 280,
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
    const resolvedDense = denseProp ?? config.dense;

    const options = useMemo(() => normalizeOptions(optionsProp), [optionsProp]);
    const resolvedSearchable = searchableProp ?? options.length > 8;
    const resolvedShowAll = showAll ?? multiple;

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // --- Resolve active value(s) ---
    const [internalValue, setInternalValue] = useState<string[]>(() => {
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return [];
    });

    const activeValues = useMemo((): string[] => {
      if (valueProp !== undefined) {
        return Array.isArray(valueProp) ? valueProp : [valueProp];
      }
      if (field && filters) {
        const dimValues = filters.dimensions[field];
        if (dimValues && dimValues.length > 0) return dimValues;
      }
      return internalValue;
    }, [valueProp, field, filters, internalValue]);

    // --- Filtered options ---
    const filteredOptions = useMemo(() => {
      if (!search) return options;
      const lower = search.toLowerCase();
      return options.filter(
        (opt) =>
          (opt.label ?? opt.value).toLowerCase().includes(lower) ||
          opt.value.toLowerCase().includes(lower)
      );
    }, [options, search]);

    // --- Grouped options ---
    const groups = useMemo(() => {
      const grouped = new Map<string | null, DropdownOption[]>();
      for (const opt of filteredOptions) {
        const group = opt.group ?? null;
        const list = grouped.get(group) ?? [];
        list.push(opt);
        grouped.set(group, list);
      }
      return grouped;
    }, [filteredOptions]);

    // --- Trigger label ---
    const triggerLabel = useMemo(() => {
      if (activeValues.length === 0) return label;
      if (!multiple) {
        const opt = options.find((o) => o.value === activeValues[0]);
        return opt?.label ?? opt?.value ?? label;
      }
      if (activeValues.length === 1) {
        const opt = options.find((o) => o.value === activeValues[0]);
        return opt?.label ?? opt?.value ?? label;
      }
      return `${label} (${activeValues.length})`;
    }, [activeValues, options, label, multiple]);

    // --- Click handler ---
    const handleSelect = useCallback(
      (optionValue: string) => {
        let next: string[];

        if (multiple) {
          if (activeValues.includes(optionValue)) {
            next = activeValues.filter((v) => v !== optionValue);
          } else {
            next = [...activeValues, optionValue];
          }
        } else {
          next = [optionValue];
          setOpen(false);
        }

        setInternalValue(next);

        if (field && filters) {
          filters.setDimension(field, next);
        }

        if (onChange) {
          onChange(multiple ? next : next[0]);
        }
      },
      [activeValues, multiple, field, filters, onChange],
    );

    const handleClearAll = useCallback(() => {
      setInternalValue([]);
      if (field && filters) {
        filters.clearDimension(field);
      }
      if (onChange) {
        onChange(multiple ? [] : "");
      }
    }, [field, filters, onChange, multiple]);

    // --- Click outside ---
    useEffect(() => {
      if (!open) return;
      function handleClick(e: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setOpen(false);
          setSearch("");
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // --- Focus search on open ---
    useEffect(() => {
      if (open && resolvedSearchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [open, resolvedSearchable]);

    const hasSelection = activeValues.length > 0;

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn("relative inline-block", className, classNames?.root)}
      >
        {/* Trigger */}
        <button
          onClick={() => {
            setOpen(!open);
            if (!open) setSearch("");
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border font-medium transition-colors",
            "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
            resolvedDense ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
            hasSelection
              ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] text-[var(--accent)]"
              : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:border-gray-300 dark:hover:border-gray-600",
            classNames?.trigger,
          )}
        >
          <span className="truncate max-w-[200px]">{triggerLabel}</span>
          {hasSelection && multiple && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); handleClearAll(); } }}
              className="rounded-full p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "text-[var(--muted)] transition-transform",
              resolvedDense ? "h-3 w-3" : "h-3.5 w-3.5",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute left-0 top-full z-50 mt-1.5 min-w-[200px] rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/[0.08] dark:shadow-black/40",
              classNames?.dropdown,
            )}
          >
            {/* Search */}
            {resolvedSearchable && (
              <div className="border-b border-[var(--card-border)] px-3 py-2">
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 flex-shrink-0 text-[var(--muted)]" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "w-full bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]",
                      resolvedDense ? "text-xs" : "text-sm",
                      classNames?.search,
                    )}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="overflow-y-auto p-1.5" style={{ maxHeight }}>
              {/* All option */}
              {resolvedShowAll && (
                <>
                  <button
                    onClick={handleClearAll}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                      resolvedDense ? "text-xs" : "text-sm",
                      activeValues.length === 0
                        ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
                        : "text-[var(--foreground)] hover:bg-[var(--card-glow)]",
                    )}
                  >
                    {multiple && (
                      <span className={cn(
                        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border",
                        activeValues.length === 0
                          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-[var(--card-border)]",
                      )}>
                        {activeValues.length === 0 && <Check className="h-3 w-3" />}
                      </span>
                    )}
                    {allLabel}
                  </button>
                  <div className="my-1 border-t border-[var(--card-border)]" />
                </>
              )}

              {/* Grouped options */}
              {[...groups.entries()].map(([group, opts], gi) => (
                <div key={group ?? gi}>
                  {group && (
                    <p className="mb-1 mt-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                      {group}
                    </p>
                  )}
                  {opts.map((option) => {
                    const isActive = activeValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                          resolvedDense ? "text-xs" : "text-sm",
                          isActive
                            ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
                            : "text-[var(--foreground)] hover:bg-[var(--card-glow)]",
                          classNames?.option,
                        )}
                      >
                        {/* Checkbox for multi-select */}
                        {multiple && (
                          <span className={cn(
                            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
                            isActive
                              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                              : "border-[var(--card-border)]",
                          )}>
                            {isActive && <Check className="h-3 w-3" />}
                          </span>
                        )}
                        {/* Icon */}
                        {option.icon && (
                          <span className="flex-shrink-0 text-[var(--muted)]">
                            {option.icon}
                          </span>
                        )}
                        {/* Label */}
                        <span className="flex-1 truncate">
                          {option.label ?? option.value}
                        </span>
                        {/* Count badge */}
                        {option.count !== undefined && (
                          <span className="flex-shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                            {option.count.toLocaleString()}
                          </span>
                        )}
                        {/* Single-select check */}
                        {!multiple && isActive && (
                          <Check className="h-3.5 w-3.5 flex-shrink-0 text-[var(--accent)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Empty state */}
              {filteredOptions.length === 0 && (
                <p className="px-3 py-4 text-center text-xs text-[var(--muted)]">
                  No options match &ldquo;{search}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
