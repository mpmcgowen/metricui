import { useState, useEffect, useCallback, type RefObject } from "react";

export interface ScrollIndicatorState {
  showLeft: boolean;
  showRight: boolean;
}

/**
 * Returns booleans for whether to show left/right fade gradients
 * on a horizontally scrollable container.
 */
export function useScrollIndicators(
  ref: RefObject<HTMLDivElement | null>,
): ScrollIndicatorState {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 1);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial check
    update();

    el.addEventListener("scroll", update, { passive: true });

    // Re-check on resize (content may change width)
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [ref, update]);

  return { showLeft, showRight };
}
