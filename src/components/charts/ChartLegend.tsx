"use client";

/**
 * Shared chart legend component for all chart types.
 *
 * Renders interactive series items with color indicator, label, and optional value.
 * - Click: toggle one series on/off
 * - Cmd/Ctrl+Click: solo — show only that series, hide all others
 * - Hover: highlights the item
 * - Keyboard: focusable buttons with aria-pressed
 *
 * Shows a hint message when all series are hidden.
 */

import { cn } from "@/lib/utils";

export interface ChartLegendItem {
  id: string;
  label: string;
  color: string;
  /** Optional summary value displayed next to the label (e.g. latest value, total) */
  value?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  hidden: Set<string>;
  onToggle: (id: string, meta?: boolean) => void;
  toggleable?: boolean;
  /** Additional class name for the outer container */
  className?: string;
  /** Layout orientation. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Callback when hovering a legend item (for chart highlight). null = hover ended. */
  onHover?: (id: string | null) => void;
}

export function ChartLegend({
  items,
  hidden,
  onToggle,
  toggleable = true,
  className,
  orientation = "horizontal",
  onHover,
}: ChartLegendProps) {
  const allHidden = items.length > 0 && items.every((item) => hidden.has(item.id));

  return (
    <div
      role="group"
      aria-label="Chart legend"
      className={cn(
        "mt-3 flex flex-wrap gap-1.5",
        orientation === "vertical" ? "flex-col items-start" : "items-center justify-center",
        className
      )}
    >
      {items.map((item) => {
        const isHidden = hidden.has(item.id);

        // Color indicator — rounded rect, more visible than a dot
        const indicator = (
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 flex-shrink-0 rounded-[3px] transition-all",
              isHidden && "!bg-[var(--muted)] opacity-40",
            )}
            style={!isHidden ? { backgroundColor: item.color } : undefined}
          />
        );

        const label = (
          <span
            className={cn(
              "transition-colors",
              isHidden ? "text-[var(--muted)] line-through decoration-1" : "text-[var(--foreground)] opacity-70",
            )}
          >
            {item.label}
          </span>
        );

        const valueEl = item.value && !isHidden ? (
          <span className="font-[family-name:var(--font-mono)] font-semibold text-[var(--foreground)]">
            {item.value}
          </span>
        ) : null;

        if (!toggleable) {
          return (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium"
            >
              {indicator}
              {label}
              {valueEl}
            </span>
          );
        }

        return (
          <button
            key={item.id}
            onClick={(e) => onToggle(item.id, e.metaKey || e.ctrlKey)}
            onMouseEnter={() => onHover?.(item.id)}
            onMouseLeave={() => onHover?.(null)}
            aria-pressed={!isHidden}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
              "hover:bg-[var(--card-glow)]",
              isHidden && "opacity-50",
            )}
            title="Click to toggle. Ctrl/⌘+click to solo."
          >
            {indicator}
            {label}
            {valueEl}
          </button>
        );
      })}

      {/* All-hidden hint */}
      {allHidden && toggleable && (
        <span className="rounded-md px-2 py-1 text-[10px] font-medium text-[var(--mu-color-warning)]">
          All hidden — click to restore
        </span>
      )}
    </div>
  );
}
