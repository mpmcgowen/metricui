"use client";

import { forwardRef, useState, Children, isValidElement, type ReactNode } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import { useMetricConfig } from "@/lib/MetricProvider";
import { FilterTags, type FilterTagsProps } from "./FilterTags";
import { useMetricFilters, useActiveFilterCount } from "@/lib/FilterContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import type { CardVariant } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterBarProps {
  children: ReactNode;
  position?: "inline";
  /** Stick to the top of the viewport when scrolling. Default: false */
  sticky?: boolean;
  badge?: ReactNode;
  tags?: boolean | Omit<FilterTagsProps, "className">;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  variant?: CardVariant;
  dense?: boolean;
  className?: string;
  classNames?: { root?: string; controls?: string; tags?: string; summary?: string };
  id?: string;
  "data-testid"?: string;
}

interface SlotProps { children: ReactNode }

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

function FilterBarNav({ children }: SlotProps) { return <>{children}</>; }
FilterBarNav.displayName = "FilterBar.Nav";

function FilterBarPrimary({ children }: SlotProps) { return <>{children}</>; }
FilterBarPrimary.displayName = "FilterBar.Primary";

function FilterBarSecondary({ children }: SlotProps) { return <>{children}</>; }
FilterBarSecondary.displayName = "FilterBar.Secondary";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseChildren(children: ReactNode) {
  let nav: ReactNode[] = [];
  let primary: ReactNode[] = [];
  let secondary: ReactNode[] = [];
  let foundSlot = false;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const name = (child.type as { displayName?: string })?.displayName ?? "";
    if (name === "FilterBar.Nav") { foundSlot = true; nav = Children.toArray((child.props as SlotProps).children); }
    else if (name === "FilterBar.Primary") { foundSlot = true; primary = Children.toArray((child.props as SlotProps).children); }
    else if (name === "FilterBar.Secondary") { foundSlot = true; secondary = Children.toArray((child.props as SlotProps).children); }
  });
  if (!foundSlot) primary = Children.toArray(children);
  return { nav, primary, secondary };
}

function useActiveFilterCountWithCrossFilter(): number {
  const base = useActiveFilterCount();
  const cf = useCrossFilter();
  return base + (cf?.isActive ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Accordion — pure CSS grid-rows transition
// ---------------------------------------------------------------------------

function Accordion({ open, children, className }: { open: boolean; children: ReactNode; className?: string }) {
  const [settled, setSettled] = useState(open);

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      onTransitionEnd={() => setSettled(open)}
    >
      <div className={open && settled ? "overflow-visible" : "overflow-hidden"}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const FilterBarInner = forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    children, position = "inline", sticky = false, badge, tags = true, collapsible = true,
    defaultCollapsed = false, variant, dense, className, classNames, id,
    "data-testid": dataTestId,
  },
  ref,
) {
  const config = useMetricConfig();
  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [secondaryExpanded, setSecondaryExpanded] = useState(false);

  const { nav, primary, secondary } = parseChildren(children);
  const hasNav = nav.length > 0;
  const hasSecondary = secondary.length > 0;
  const activeCount = useActiveFilterCountWithCrossFilter();
  const hasActive = activeCount > 0;
  const filters = useMetricFilters();
  const cf = useCrossFilter();


  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-metric-card=""
      data-variant={resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      data-position={position}
      className={cn(
        "noise-texture border transition-shadow duration-300",
        CARD_CLASSES,
        HOVER_CLASSES,
        sticky && "sticky top-3 z-30 backdrop-blur-xl",
        classNames?.root,
        className,
      )}
      style={sticky ? { background: "color-mix(in srgb, var(--card-bg) 80%, transparent)" } : undefined}
    >
      {/* ── Nav tabs — rendered above the filter header ── */}
      {hasNav && (
        <div className="flex items-center border-b border-[var(--card-border)] px-[var(--mu-padding)]">
          {nav}
        </div>
      )}

      {/* ── Header — always visible ── */}
      <button
        onClick={() => collapsible && setCollapsed((c) => !c)}
        className={cn(
          "flex w-full items-center gap-2 px-[var(--mu-padding)]",
          "text-left text-[var(--muted)] hover:text-[var(--foreground)] transition-colors",
          resolvedDense ? "py-2 text-[10px]" : "py-2.5 text-xs",
          classNames?.summary,
        )}
      >
        {collapsed ? (
          <div className="flex-1 min-w-0">
            {hasActive ? (
              <FilterTags maxVisible={4} dismissible={false} clearAll={false} showCrossFilter dense />
            ) : (
              <span>Filters</span>
            )}
          </div>
        ) : (
          <span className="flex-1 font-medium text-[var(--foreground)]">
            Filters
            {activeCount > 0 && (
              <span className={cn(
                "ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] font-[family-name:var(--font-mono)] text-[10px] font-bold text-white",
                activeCount > 9 ? "px-1" : "",
              )}>
                {activeCount}
              </span>
            )}
          </span>
        )}
        {badge && (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full font-medium tabular-nums",
            "border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] text-[var(--accent)]",
            resolvedDense ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
          )}>
            {badge}
          </span>
        )}
        {collapsible && (
          collapsed
            ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            : <ChevronUp className="h-3.5 w-3.5 shrink-0" />
        )}
      </button>

      {/* ── Body — accordion expand/collapse ── */}
      <Accordion open={!collapsed}>
        {/* Controls */}
        <div className={cn(
          "border-t border-[var(--card-border)] px-[var(--mu-padding)]",
          resolvedDense ? "py-2" : "py-3",
          classNames?.controls,
        )}>
          <div className="flex flex-wrap items-center gap-2">
            {primary}
            {hasSecondary && (
              <button
                onClick={() => setSecondaryExpanded((x) => !x)}
                aria-expanded={secondaryExpanded}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-[var(--card-border)]",
                  "bg-[var(--card-bg)] font-medium text-[var(--muted)]",
                  "transition-colors hover:text-[var(--foreground)]",
                  resolvedDense ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                )}
              >
                {secondaryExpanded ? (
                  <>Less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>+{secondary.length} more <ChevronDown className="h-3 w-3" /></>
                )}
              </button>
            )}
            {hasActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  filters?.clearAll();
                  cf?.clear();
                }}
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full text-[var(--muted)]",
                  "transition-colors hover:text-[var(--foreground)]",
                  resolvedDense ? "text-[10px]" : "text-xs",
                )}
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Secondary panel */}
          {hasSecondary && (
            <Accordion open={secondaryExpanded}>
              <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--card-border)] pt-2">
                {secondary}
              </div>
            </Accordion>
          )}
        </div>

        {/* Tags */}
        {tags !== false && hasActive && (
          <div className={cn(
            "border-t border-[var(--card-border)] px-[var(--mu-padding)]",
            resolvedDense ? "py-1.5" : "py-2",
            classNames?.tags,
          )}>
            <FilterTags showCrossFilter clearAll={false} dense={resolvedDense} {...(typeof tags === "object" ? tags : {})} />
          </div>
        )}
      </Accordion>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const FilterBar = Object.assign(FilterBarInner, {
  Nav: FilterBarNav,
  Primary: FilterBarPrimary,
  Secondary: FilterBarSecondary,
});

(FilterBar as unknown as { __gridHint: string }).__gridHint = "full";
