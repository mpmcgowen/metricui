"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig, useLocale } from "@/lib/MetricProvider";
import type { BaseComponentProps } from "@/lib/types";
import { useMetricFilters } from "@/lib/FilterContext";
import { formatValue, type FormatOption } from "@/lib/format";
import { springDuration } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SegmentOption {
  /** Unique value for this segment */
  value: string;
  /** Display label. Defaults to value. */
  label?: string;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
  /** Badge count — formatted through the format engine */
  badge?: number;
  /** Badge format option */
  badgeFormat?: FormatOption;
  /** Color accent when this segment is active. Named color or CSS color. */
  color?: string;
}

export interface SegmentToggleProps extends BaseComponentProps {
  /** Segment options */
  options: SegmentOption[] | string[];
  /** Controlled value — the active segment(s) */
  value?: string | string[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selections. Default: false */
  multiple?: boolean;
  /** Filter context field name — when set, reads/writes to FilterContext dimensions */
  field?: string;
  /** Orientation. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Full width — segments stretch to fill container. Default: false */
  fullWidth?: boolean;
  /** Dense mode */
  dense?: boolean;
  /** Sub-element class overrides */
  classNames?: {
    root?: string;
    option?: string;
    indicator?: string;
    badge?: string;
  };
}

// ---------------------------------------------------------------------------
// Normalize options
// ---------------------------------------------------------------------------

function normalizeOptions(options: SegmentOption[] | string[]): SegmentOption[] {
  return options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
}

// ---------------------------------------------------------------------------
// Size styles
// ---------------------------------------------------------------------------

const SIZE_STYLES = {
  sm: { text: "text-[11px]", padding: "px-2.5 py-1", gap: "gap-1", badge: "text-[9px] px-1 py-0", iconSize: "h-3 w-3" },
  md: { text: "text-xs", padding: "px-3 py-1.5", gap: "gap-1.5", badge: "text-[10px] px-1.5 py-0.5", iconSize: "h-3.5 w-3.5" },
  lg: { text: "text-sm", padding: "px-4 py-2", gap: "gap-2", badge: "text-xs px-2 py-0.5", iconSize: "h-4 w-4" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const SegmentToggle = forwardRef<HTMLDivElement, SegmentToggleProps>(
  function SegmentToggle(
    {
      options: optionsProp,
      value: valueProp,
      defaultValue,
      onChange,
      multiple = false,
      field,
      orientation = "horizontal",
      size = "md",
      fullWidth = false,
      dense: denseProp,
      className,
      classNames,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const localeDefaults = useLocale();
    const filters = useMetricFilters();
    const resolvedDense = denseProp ?? config.dense;
    const resolvedSize = resolvedDense && size === "md" ? "sm" : size;
    const styles = SIZE_STYLES[resolvedSize];

    const options = useMemo(() => normalizeOptions(optionsProp), [optionsProp]);

    // --- Resolve active value(s) ---
    // Priority: controlled prop > filter context > internal state
    const [internalValue, setInternalValue] = useState<string[]>(() => {
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return options.length > 0 ? [options[0].value] : [];
    });

    const resolvedDefault = useMemo(() => {
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return options.length > 0 ? [options[0].value] : [];
    }, [defaultValue, options]);

    const activeValues = useMemo((): string[] => {
      if (valueProp !== undefined) {
        return Array.isArray(valueProp) ? valueProp : [valueProp];
      }
      if (field && filters) {
        const dimValues = filters.dimensions[field];
        if (dimValues && dimValues.length > 0) return dimValues;
        // Dimension cleared — return default, not stale internal state
        return resolvedDefault;
      }
      return internalValue;
    }, [valueProp, field, filters, internalValue, resolvedDefault]);

    // --- Click handler ---
    const handleClick = useCallback(
      (optionValue: string) => {
        let next: string[];

        if (multiple) {
          if (activeValues.includes(optionValue)) {
            next = activeValues.filter((v) => v !== optionValue);
            if (next.length === 0) next = [optionValue]; // prevent empty
          } else {
            next = [...activeValues, optionValue];
          }
        } else {
          next = [optionValue];
        }

        setInternalValue(next);

        if (field && filters) {
          // If selection equals the default, clear the dimension (default = no filter)
          const resolvedDefault = defaultValue
            ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue])
            : options.length > 0 ? [options[0].value] : [];
          const isDefault = next.length === resolvedDefault.length && next.every((v, i) => v === resolvedDefault[i]);
          if (isDefault) {
            filters.clearDimension(field);
          } else {
            filters.setDimension(field, next);
          }
        }

        if (onChange) {
          onChange(multiple ? next : next[0]);
        }
      },
      [activeValues, multiple, field, filters, onChange],
    );

    // --- Sliding indicator ---
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const animDuration = 200; // snappy — toggle indicators should feel instant

    useEffect(() => {
      if (multiple || !containerRef.current) {
        setIndicatorStyle({ display: "none" });
        return;
      }

      const activeIdx = options.findIndex((o) => activeValues.includes(o.value));
      if (activeIdx < 0) {
        setIndicatorStyle({ display: "none" });
        return;
      }

      const container = containerRef.current;
      const buttons = container.querySelectorAll<HTMLElement>("[data-segment-option]");
      const activeButton = buttons[activeIdx];

      if (!activeButton) {
        setIndicatorStyle({ display: "none" });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      if (orientation === "horizontal") {
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          top: buttonRect.top - containerRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
          transition: `all ${animDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        });
      } else {
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          top: buttonRect.top - containerRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
          transition: `all ${animDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        });
      }
    }, [activeValues, options, multiple, orientation, animDuration]);

    // --- Active segment color ---
    const activeColor = useMemo(() => {
      if (multiple) return null;
      const active = options.find((o) => activeValues.includes(o.value));
      return active?.color ?? null;
    }, [activeValues, options, multiple]);

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn(
          "inline-flex",
          orientation === "vertical" ? "flex-col" : "",
          fullWidth && "w-full",
          className,
          classNames?.root,
        )}
      >
        <div
          ref={containerRef}
          className={cn(
            "relative inline-flex rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5",
            orientation === "vertical" ? "flex-col" : "",
            fullWidth && "w-full",
          )}
        >
          {/* Sliding indicator (single-select mode only) */}
          {!multiple && (
            <div
              className={cn(
                "absolute rounded-md pointer-events-none",
                activeColor
                  ? ""
                  : "bg-[var(--accent)]/10",
                classNames?.indicator,
              )}
              style={{
                ...indicatorStyle,
                ...(activeColor
                  ? { backgroundColor: `color-mix(in srgb, ${activeColor} 12%, transparent)` }
                  : {}),
              }}
            />
          )}

          {/* Segment buttons */}
          {options.map((option) => {
            const isActive = activeValues.includes(option.value);
            const label = option.label ?? option.value;

            return (
              <button
                key={option.value}
                data-segment-option
                onClick={() => handleClick(option.value)}
                className={cn(
                  "relative z-10 inline-flex items-center justify-center font-medium transition-colors",
                  "rounded-md",
                  styles.text,
                  styles.padding,
                  styles.gap,
                  fullWidth && "flex-1",
                  isActive
                    ? multiple
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                  classNames?.option,
                )}
                style={
                  isActive && option.color
                    ? { color: option.color }
                    : undefined
                }
              >
                {option.icon && (
                  <span className={cn("flex-shrink-0", styles.iconSize)}>
                    {option.icon}
                  </span>
                )}
                <span>{label}</span>
                {option.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full font-[family-name:var(--font-mono)] font-semibold",
                      styles.badge,
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "bg-[var(--card-glow)] text-[var(--muted)]",
                      classNames?.badge,
                    )}
                    style={
                      isActive && option.color
                        ? {
                            color: option.color,
                            backgroundColor: `color-mix(in srgb, ${option.color} 12%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {formatValue(option.badge, option.badgeFormat ?? "compact", localeDefaults)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
