"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseDropdownOptions {
  /** Called when the dropdown opens/closes */
  onOpenChange?: (open: boolean) => void;
  /** Number of items (for arrow key wrapping) */
  itemCount?: number;
}

export interface UseDropdownResult {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown and return focus to trigger */
  close: () => void;
  /** Toggle open/closed */
  toggle: () => void;
  /** Index of the currently focused item (-1 = none) */
  activeIndex: number;
  /** Set the active item index */
  setActiveIndex: (index: number) => void;
  /** Props to spread on the trigger element */
  triggerProps: {
    ref: React.RefObject<HTMLButtonElement | null>;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    "aria-expanded": boolean;
    "aria-haspopup": "listbox";
  };
  /** Props to spread on the dropdown panel/listbox */
  listProps: {
    ref: React.RefObject<HTMLDivElement | null>;
    role: "listbox";
    tabIndex: -1;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  /** Get props for an individual option item */
  getItemProps: (index: number) => {
    role: "option";
    "aria-selected": boolean;
    tabIndex: number;
    onMouseEnter: () => void;
    ref: (el: HTMLElement | null) => void;
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shared dropdown behavior for DropdownFilter, PeriodSelector, ExportButton.
 *
 * Handles: open/close, Escape to close, click outside, arrow key navigation,
 * Home/End, roving tabindex, focus management, ARIA attributes.
 *
 * @example
 * ```tsx
 * const dropdown = useDropdown({ itemCount: options.length });
 *
 * <button {...dropdown.triggerProps}>Filter</button>
 * {dropdown.isOpen && (
 *   <div {...dropdown.listProps}>
 *     {options.map((opt, i) => (
 *       <div key={opt} {...dropdown.getItemProps(i)} onClick={() => { select(opt); dropdown.close(); }}>
 *         {opt}
 *       </div>
 *     ))}
 *   </div>
 * )}
 * ```
 */
export function useDropdown(options: UseDropdownOptions = {}): UseDropdownResult {
  const { onOpenChange, itemCount = 0 } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    onOpenChange?.(false);
    // Return focus to trigger
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Focus the active item when it changes
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);

  // Shared keyboard handler for arrow navigation
  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(Math.max(0, itemCount - 1));
          break;
      }
    },
    [itemCount, close],
  );

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) open();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    },
    [isOpen, open, close],
  );

  const getItemProps = useCallback(
    (index: number) => ({
      role: "option" as const,
      "aria-selected": index === activeIndex,
      tabIndex: index === activeIndex ? 0 : -1,
      onMouseEnter: () => setActiveIndex(index),
      ref: (el: HTMLElement | null) => {
        itemRefs.current[index] = el;
      },
    }),
    [activeIndex],
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    activeIndex,
    setActiveIndex,
    triggerProps: {
      ref: triggerRef,
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox" as const,
    },
    listProps: {
      ref: listRef,
      role: "listbox" as const,
      tabIndex: -1 as const,
      onKeyDown: handleListKeyDown,
    },
    getItemProps,
  };
}
