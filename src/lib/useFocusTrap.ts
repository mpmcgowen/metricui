"use client";

import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus trap for dialog/sidebar panels.
 *
 * Returns a ref to attach to the container element and an onKeyDown handler.
 * Traps Tab/Shift+Tab within the container and auto-focuses the first
 * focusable element on mount.
 *
 * @param active — whether the trap is active (e.g., panel is open)
 *
 * @example
 * ```tsx
 * const { containerRef, onKeyDown } = useFocusTrap(isOpen);
 * <div ref={containerRef} onKeyDown={onKeyDown} role="dialog" aria-modal="true">
 *   ...
 * </div>
 * ```
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save previous focus and auto-focus first element on activation
  useEffect(() => {
    if (!active) return;

    // Save the element that had focus before the trap opened
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Auto-focus the first focusable element inside the container
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    }, 50); // Small delay for mount/animation

    return () => {
      clearTimeout(timer);
      // Return focus to the previously focused element on cleanup
      previousFocusRef.current?.focus();
    };
  }, [active]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  return { containerRef, onKeyDown };
}
