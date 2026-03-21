"use client";

import { useState, useEffect, useRef } from "react";
import type { MotionConfig } from "./motion";
import { springDuration } from "./motion";

interface CountUpOptions {
  duration?: number;
  delay?: number;
  enabled?: boolean;
  /** Derive duration from spring config when duration is not set explicitly. */
  motionConfig?: MotionConfig;
}

/**
 * Animates a number from the previous target to the new target.
 *
 * On first render (or when re-enabled), animates from 0.
 * On subsequent target changes, animates from the old value.
 * Uses easeOutExpo for a satisfying deceleration.
 */
export function useCountUp(target: number, options?: CountUpOptions): number {
  const { duration, delay = 0, enabled = true, motionConfig } = options ?? {};
  const effectiveDuration = duration ?? (motionConfig ? springDuration(motionConfig) : 1200);

  const [value, setValue] = useState(enabled ? 0 : target);
  const prevTargetRef = useRef<number>(enabled ? 0 : target);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      prevTargetRef.current = target;
      return;
    }

    const from = prevTargetRef.current;

    const timeout = setTimeout(() => {
      startTime.current = null;

      function tick(now: number) {
        if (startTime.current === null) startTime.current = now;
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / effectiveDuration, 1);

        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(from + eased * (target - from));

        if (progress < 1) {
          rafId.current = requestAnimationFrame(tick);
        } else {
          setValue(target);
          prevTargetRef.current = target;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
      // Snap to current target so re-animation starts from here
      prevTargetRef.current = target;
    };
  }, [target, effectiveDuration, delay, enabled]);

  return value;
}
