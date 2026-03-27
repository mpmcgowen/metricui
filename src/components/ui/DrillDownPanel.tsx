"use client";

import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrillDown, type DrillDownTrigger, type DrillDownContent } from "@/lib/DrillDownContext";
import { useFocusTrap } from "@/lib/useFocusTrap";

// ---------------------------------------------------------------------------
// DrillDownOverlay — portal-rendered slide-over panel
// ---------------------------------------------------------------------------

export interface DrillDownOverlayProps {
  /** Optional render function — called with the active trigger on every render.
   *  Return ReactNode to override drill content with live data. Return null/undefined to fall through to stored content. */
  renderContent?: (trigger: DrillDownTrigger) => ReactNode | null | undefined;
}

export function DrillDownOverlay(props?: DrillDownOverlayProps) {
  const renderContent = props?.renderContent;
  const drill = useDrillDown();
  const mode = drill?.activeTrigger?.mode ?? "slide-over";
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusTrap = useFocusTrap(!!drill?.isOpen);

  useEffect(() => setMounted(true), []);

  // Animate in/out
  useEffect(() => {
    if (drill?.isOpen) {
      // Delay to allow the portal to mount before transitioning
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
    }
  }, [drill?.isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (drill?.isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [drill?.isOpen]);

  // Focus trap — focus the panel when it opens
  useEffect(() => {
    if (visible && panelRef.current) {
      panelRef.current.focus();
    }
  }, [visible, drill?.depth]);

  if (!mounted || !drill?.isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9998]">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={drill.close}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={(el) => {
          (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (focusTrap.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        onKeyDown={focusTrap.onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={drill.activeTrigger?.title ?? "Detail view"}
        tabIndex={-1}
        className={cn(
          "flex flex-col bg-[var(--background)] shadow-2xl shadow-black/20 outline-none",
          "transition-all duration-300 ease-out",
          mode === "modal"
            ? cn(
                "absolute left-1/2 top-1/2 max-h-[85vh] w-full max-w-3xl rounded-xl border border-[var(--card-border)]",
                visible ? "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100" : "-translate-x-1/2 -translate-y-1/2 scale-95 opacity-0",
              )
            : cn(
                "absolute right-0 top-0 bottom-0 w-full max-w-2xl",
                visible ? "translate-x-0" : "translate-x-full",
              ),
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[var(--card-border)] px-6 py-4">
          {/* Breadcrumbs */}
          {drill.breadcrumbs.length > 1 && (
            <nav aria-label="Drill-down breadcrumbs" className="mb-2 flex items-center gap-1 text-xs text-[var(--muted)]">
              <button
                onClick={drill.close}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Dashboard
              </button>
              {drill.breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {i < drill.breadcrumbs.length - 1 ? (
                    <button
                      onClick={() => drill.goTo(i + 1)}
                      className="hover:text-[var(--foreground)] transition-colors"
                    >
                      {crumb.title}
                    </button>
                  ) : (
                    <span className="font-medium text-[var(--foreground)]">{crumb.title}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={drill.depth > 1 ? drill.back : drill.close}
                className="rounded-md p-1 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                aria-label={drill.depth > 1 ? "Go back" : "Close"}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {drill.activeTrigger?.title}
                </h2>
                {drill.activeTrigger?.field && drill.activeTrigger?.value && (
                  <p className="text-xs text-[var(--muted)]">
                    {drill.activeTrigger.field}: {String(drill.activeTrigger.value)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={drill.close}
              className="rounded-md p-1 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent && drill.activeTrigger
            ? (renderContent(drill.activeTrigger) ?? <DrillContentRenderer content={drill.activeContent} />)
            : <DrillContentRenderer content={drill.activeContent} />}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Drill content renderer — calls render functions for reactive content
// ---------------------------------------------------------------------------

function DrillContentRenderer({ content }: { content: DrillDownContent | null }) {
  if (content === null) return null;
  if (typeof content === "function") return <>{content()}</>;
  return <>{content}</>;
}

// ---------------------------------------------------------------------------
// Helper: open a drill from a chart click event
// ---------------------------------------------------------------------------

export interface DrillDownRenderProps {
  trigger: DrillDownTrigger;
}

/**
 * Hook that returns an `openDrill` function for use in chart click handlers.
 *
 * @example
 * ```tsx
 * const openDrill = useDrillDownAction();
 *
 * <BarChart
 *   onBarClick={(e) => openDrill(
 *     { title: e.label, field: "country", value: e.indexValue },
 *     <DataTable data={filterBy(accounts, "country", e.indexValue)} />
 *   )}
 * />
 * ```
 */
export function useDrillDownAction() {
  const drill = useDrillDown();
  return (trigger: DrillDownTrigger, content: DrillDownContent) => {
    drill?.open(trigger, content);
  };
}
