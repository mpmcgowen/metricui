/**
 * Shared motion / animation configuration for MetricUI.
 *
 * All Nivo chart components and useCountUp consume these values
 * so animation timing feels consistent across the library.
 */

export interface MotionConfig {
  mass: number;
  tension: number;
  friction: number;
  clamp: boolean;
}

/** Default spring config — used by all Nivo charts and derived for useCountUp duration. */
export const DEFAULT_MOTION_CONFIG: MotionConfig = {
  mass: 1,
  tension: 170,
  friction: 26,
  clamp: true,
};

/**
 * Derive an approximate animation duration (ms) from spring parameters.
 *
 * Uses a damped harmonic oscillator settling-time approximation.
 * Result is clamped to [400, 3000] ms for sanity.
 */
export function springDuration(config: MotionConfig): number {
  const { mass, tension, friction } = config;
  const raw = Math.round((Math.PI * Math.sqrt(mass * tension) / friction) * 1000);
  return Math.max(400, Math.min(raw, 3000));
}
