import { describe, it, expect } from "vitest";
import { DEFAULT_MOTION_CONFIG, springDuration, type MotionConfig } from "@/lib/motion";

// ---------------------------------------------------------------------------
// DEFAULT_MOTION_CONFIG
// ---------------------------------------------------------------------------

describe("DEFAULT_MOTION_CONFIG", () => {
  it("has mass of 1", () => {
    expect(DEFAULT_MOTION_CONFIG.mass).toBe(1);
  });

  it("has tension of 170", () => {
    expect(DEFAULT_MOTION_CONFIG.tension).toBe(170);
  });

  it("has friction of 26", () => {
    expect(DEFAULT_MOTION_CONFIG.friction).toBe(26);
  });

  it("has clamp enabled", () => {
    expect(DEFAULT_MOTION_CONFIG.clamp).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// springDuration
// ---------------------------------------------------------------------------

describe("springDuration", () => {
  it("returns a number", () => {
    expect(typeof springDuration(DEFAULT_MOTION_CONFIG)).toBe("number");
  });

  it("returns value in [400, 3000] range for default config", () => {
    const duration = springDuration(DEFAULT_MOTION_CONFIG);
    expect(duration).toBeGreaterThanOrEqual(400);
    expect(duration).toBeLessThanOrEqual(3000);
  });

  it("returns approximately 1576ms for default config", () => {
    const duration = springDuration(DEFAULT_MOTION_CONFIG);
    // Math.round((Math.PI * Math.sqrt(1 * 170) / 26) * 1000) ≈ 1576
    expect(duration).toBeGreaterThanOrEqual(1400);
    expect(duration).toBeLessThanOrEqual(1700);
  });

  it("clamps to minimum of 400ms for very fast springs", () => {
    const fast: MotionConfig = { mass: 0.01, tension: 1000, friction: 100, clamp: true };
    const duration = springDuration(fast);
    expect(duration).toBe(400);
  });

  it("clamps to maximum of 3000ms for very slow springs", () => {
    const slow: MotionConfig = { mass: 100, tension: 10000, friction: 1, clamp: true };
    const duration = springDuration(slow);
    expect(duration).toBe(3000);
  });

  it("increases with more mass", () => {
    const light: MotionConfig = { mass: 1, tension: 170, friction: 26, clamp: true };
    const heavy: MotionConfig = { mass: 4, tension: 170, friction: 26, clamp: true };
    expect(springDuration(heavy)).toBeGreaterThan(springDuration(light));
  });

  it("decreases with more friction", () => {
    const low: MotionConfig = { mass: 1, tension: 170, friction: 20, clamp: true };
    const high: MotionConfig = { mass: 1, tension: 170, friction: 40, clamp: true };
    expect(springDuration(high)).toBeLessThan(springDuration(low));
  });
});
