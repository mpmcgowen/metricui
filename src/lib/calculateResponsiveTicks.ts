/**
 * Shared X-axis tick thinning based on container width.
 *
 * Used by AreaChart, BarChart, LineChart, etc. to prevent label overlap.
 * Returns undefined when all labels fit, or an array of evenly-spaced ticks
 * (always including first and last) when thinning is needed.
 *
 * Auto-estimates label width from the longest label string so date labels
 * ("2026-01-15") get more spacing than short labels ("Jan").
 */
export function calculateResponsiveTicks(
  labels: (string | number)[],
  containerWidth: number,
  options?: { minSpacing?: number; marginOffset?: number }
): (string | number)[] | undefined {
  const count = labels.length;
  if (count <= 1) return undefined;

  const marginOffset = options?.marginOffset ?? 76;

  // Auto-estimate spacing from the longest label (~6px per char at 10px mono font + 16px gap)
  const longestLabel = labels.reduce<number>(
    (max, l) => Math.max(max, String(l).length),
    0,
  );
  const estimatedLabelWidth = longestLabel * 6 + 16;
  const minSpacing = options?.minSpacing ?? Math.max(40, estimatedLabelWidth);

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
