import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

/**
 * Apply an opacity to any CSS color string.
 *
 * Supports:
 *   - Hex colors: "#ff0000" → "#ff00001A" (for 0.1)
 *   - rgb(): "rgb(255, 0, 0)" → "rgba(255, 0, 0, 0.1)"
 *   - hsl(): "hsl(0, 100%, 50%)" → "hsla(0, 100%, 50%, 0.1)"
 *   - rgba()/hsla(): replaces existing alpha
 */
export function withOpacity(color: string, opacity: number): string {
  const c = color.trim();

  // Hex color
  if (c.startsWith("#")) {
    const hex = Math.round(opacity * 255).toString(16).padStart(2, "0");
    // Strip existing alpha if 8-digit hex
    const base = c.length === 9 ? c.slice(0, 7) : c.length === 5 ? c.slice(0, 4) : c;
    return `${base}${hex}`;
  }

  // rgba() — replace existing alpha
  if (c.startsWith("rgba(")) {
    const inner = c.slice(5, -1);
    const parts = inner.split(",");
    if (parts.length >= 3) {
      return `rgba(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, ${opacity})`;
    }
    return c;
  }

  // rgb() — convert to rgba()
  if (c.startsWith("rgb(")) {
    const inner = c.slice(4, -1);
    return `rgba(${inner}, ${opacity})`;
  }

  // hsla() — replace existing alpha
  if (c.startsWith("hsla(")) {
    const inner = c.slice(5, -1);
    const parts = inner.split(",");
    if (parts.length >= 3) {
      return `hsla(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, ${opacity})`;
    }
    return c;
  }

  // hsl() — convert to hsla()
  if (c.startsWith("hsl(")) {
    const inner = c.slice(4, -1);
    return `hsla(${inner}, ${opacity})`;
  }

  // Fallback: just return as-is
  return c;
}
