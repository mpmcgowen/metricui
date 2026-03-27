"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import { useMetricConfig } from "@/lib/MetricProvider";
import { formatValue, type FormatOption } from "@/lib/format";
import { useLocale } from "@/lib/MetricProvider";
import { useAi } from "@/lib/AiContext";
import type { BaseComponentProps, CardVariant } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardNavTab {
  /** Unique value for this tab */
  value: string;
  /** Display label */
  label: string;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
  /** Live badge — number formatted through the format engine */
  badge?: number | string;
  /** Badge format option */
  badgeFormat?: FormatOption;
}

export interface DashboardNavProps extends BaseComponentProps {
  /** Tab definitions */
  tabs: DashboardNavTab[];
  /** Controlled active tab value */
  value?: string;
  /** Default active tab (uncontrolled). Defaults to first tab. */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Mode: "tabs" swaps content, "scroll" smooth-scrolls to section IDs matching tab values */
  mode?: "tabs" | "scroll";
  /** Sync active tab to URL search param. Pass param name (e.g., "tab"). */
  syncUrl?: string;
  /** Stick to viewport top when scrolling. Default: false */
  sticky?: boolean;
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Compact layout. Default: false */
  dense?: boolean;
  /** Card variant */
  variant?: CardVariant;
}

// ---------------------------------------------------------------------------
// Size styles
// ---------------------------------------------------------------------------

const SIZE_STYLES = {
  sm: { text: "text-[11px]", padding: "px-3 py-2", gap: "gap-1.5", badge: "text-[9px] px-1.5 py-0", iconSize: "h-3 w-3" },
  md: { text: "text-xs", padding: "px-4 py-2.5", gap: "gap-2", badge: "text-[10px] px-1.5 py-0.5", iconSize: "h-3.5 w-3.5" },
  lg: { text: "text-sm", padding: "px-5 py-3", gap: "gap-2.5", badge: "text-xs px-2 py-0.5", iconSize: "h-4 w-4" },
};

// ---------------------------------------------------------------------------
// URL sync helpers
// ---------------------------------------------------------------------------

function getUrlParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get(param);
}

function setUrlParam(param: string, value: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.replaceState({}, "", url.toString());
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DashboardNav = forwardRef<HTMLDivElement, DashboardNavProps>(
  function DashboardNav(
    {
      tabs,
      value: valueProp,
      defaultValue,
      onChange,
      mode = "tabs",
      syncUrl,
      sticky = false,
      size = "md",
      dense: denseProp,
      variant,
      className,
      id,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const config = useMetricConfig();
    const localeDefaults = useLocale();
    const resolvedDense = denseProp ?? config.dense;
    const resolvedSize = resolvedDense && size === "md" ? "sm" : size;
    const styles = SIZE_STYLES[resolvedSize];
    const resolvedVariant = variant ?? config.variant;

    // --- Register tab navigator with AI context ---
    const ai = useAi();
    const handleTabClickRef = useRef<(value: string) => void>(undefined);

    useEffect(() => {
      if (!ai) return;
      ai.registerTabNavigator((tab: string) => {
        handleTabClickRef.current?.(tab);
      });
    }, [ai]);

    // --- Active tab state ---
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (syncUrl) {
        const fromUrl = getUrlParam(syncUrl);
        if (fromUrl && tabs.some((t) => t.value === fromUrl)) return fromUrl;
      }
      return defaultValue ?? tabs[0]?.value ?? "";
    });

    const activeValue = valueProp ?? internalValue;

    // Lock out observer updates briefly after a click to prevent scroll-through override
    const scrollLockRef = useRef(false);

    const handleTabClick = useCallback(
      (tabValue: string) => {
        setInternalValue(tabValue);
        if (syncUrl) setUrlParam(syncUrl, tabValue);

        if (mode === "scroll") {
          scrollLockRef.current = true;
          setTimeout(() => { scrollLockRef.current = false; }, 1000);

          const el = document.getElementById(tabValue);
          if (el) {
            const stickyEls = document.querySelectorAll<HTMLElement>(".sticky");
            let stickyOffset = 0;
            for (const s of stickyEls) {
              stickyOffset += s.getBoundingClientRect().height;
            }
            const y = el.getBoundingClientRect().top + window.scrollY - stickyOffset - 24;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }

        onChange?.(tabValue);
      },
      [mode, syncUrl, onChange],
    );

    // Keep ref updated for AI tab navigation
    handleTabClickRef.current = handleTabClick;

    // --- Keyboard navigation ---
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const currentIdx = tabs.findIndex((t) => t.value === activeValue);
        let nextIdx = -1;

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          nextIdx = (currentIdx + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          e.preventDefault();
          nextIdx = 0;
        } else if (e.key === "End") {
          e.preventDefault();
          nextIdx = tabs.length - 1;
        }

        if (nextIdx >= 0) {
          handleTabClick(tabs[nextIdx].value);
          // Focus the button
          const container = containerRef.current;
          if (container) {
            const buttons = container.querySelectorAll<HTMLElement>("[data-nav-tab]");
            buttons[nextIdx]?.focus();
          }
        }
      },
      [tabs, activeValue, handleTabClick],
    );

    // --- Scroll mode: highlight active section on scroll ---
    useEffect(() => {
      if (mode !== "scroll" || valueProp !== undefined) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (scrollLockRef.current) return;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setInternalValue(entry.target.id);
            }
          }
        },
        { rootMargin: "-10% 0px -80% 0px" },
      );

      for (const tab of tabs) {
        const el = document.getElementById(tab.value);
        if (el) observer.observe(el);
      }

      return () => observer.disconnect();
    }, [mode, tabs, valueProp]);

    // --- Sliding indicator ---
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const recalcIndicator = useCallback(() => {
      if (!containerRef.current) return;

      const activeIdx = tabs.findIndex((t) => t.value === activeValue);
      if (activeIdx < 0) {
        setIndicatorStyle({ display: "none" });
        return;
      }

      const container = containerRef.current;
      const buttons = container.querySelectorAll<HTMLElement>("[data-nav-tab]");
      const activeButton = buttons[activeIdx];

      if (!activeButton) {
        setIndicatorStyle({ display: "none" });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }, [activeValue, tabs]);

    useEffect(() => {
      recalcIndicator();
    }, [recalcIndicator]);

    // Recalculate indicator on container resize
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const ro = new ResizeObserver(() => recalcIndicator());
      ro.observe(container);
      return () => ro.disconnect();
    }, [recalcIndicator]);

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        data-dashboard-nav=""
        data-dashboard-tabs={tabs.map((t) => t.value).join(",")}
        className={cn(
          // When standalone (sticky), render as a full card
          sticky && "noise-texture border transition-shadow duration-300",
          sticky && CARD_CLASSES,
          sticky && HOVER_CLASSES,
          sticky && "sticky top-3 z-[31] backdrop-blur-xl",
          className,
        )}
        style={sticky ? { background: "color-mix(in srgb, var(--card-bg) 80%, transparent)" } : undefined}
      >
        <div
          ref={containerRef}
          role="tablist"
          aria-label="Dashboard navigation"
          onKeyDown={handleKeyDown}
          className="relative flex items-center px-[var(--mu-padding)]"
        >
          {/* Sliding underline indicator */}
          <div
            className="absolute bottom-0 h-[2px] bg-[var(--accent)]"
            style={indicatorStyle}
          />

          {/* Tab buttons */}
          {tabs.map((tab) => {
            const isActive = tab.value === activeValue;

            return (
              <button
                key={tab.value}
                data-nav-tab
                role="tab"
                aria-selected={isActive}
                aria-controls={mode === "tabs" ? `panel-${tab.value}` : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.value)}
                className={cn(
                  "relative inline-flex items-center justify-center font-medium transition-colors",
                  styles.text,
                  styles.padding,
                  styles.gap,
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                {tab.icon && (
                  <span className={cn("flex-shrink-0", styles.iconSize)}>
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full font-[family-name:var(--font-mono)] font-semibold",
                      styles.badge,
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "bg-[var(--card-glow)] text-[var(--muted)]",
                    )}
                  >
                    {typeof tab.badge === "number"
                      ? formatValue(tab.badge, tab.badgeFormat ?? "compact", localeDefaults)
                      : tab.badge}
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
