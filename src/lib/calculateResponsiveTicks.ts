/**
 * Shared X-axis tick thinning based on container width.
 *
 * Used by AreaChart and BarChart to prevent label overlap.
 * Returns undefined when all labels fit, or an array of evenly-spaced ticks
 * (always including first and last) when thinning is needed.
 */
export function calculateResponsiveTicks(
  labels: (string | number)[],
  containerWidth: number,
  options?: { minSpacing?: number; marginOffset?: number }
): (string | number)[] | undefined {
  const count = labels.length;
  if (count <= 1) return undefined;

  const minSpacing = options?.minSpacing ?? 50;
  const marginOffset = options?.marginOffset ?? 76;

  const availableWidth = containerWidth - marginOffset;
  const maxTicks = Math.max(2, Math.floor(availableWidth / minSpacing));
  if (maxTicks >= count) return undefined; // all fit

  // Pick evenly-spaced ticks, always including first and last
  const step = Math.ceil(count / maxTicks);
  const ticks: (string | number)[] = [];
  for (let i = 0; i < count; i += step) ticks.push(labels[i]);
  if (ticks[ticks.length - 1] !== labels[count - 1]) ticks.push(labels[count - 1]);
  return ticks;
}
