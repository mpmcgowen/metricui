/**
 * Peer dependency runtime guard.
 *
 * Validates that a Nivo (or other) peer dependency was successfully imported.
 * Call this at the top of each chart component's render body.
 *
 * When the dep IS installed: the check is a single `typeof` — effectively free.
 * When the dep is NOT installed: throws a clear error that the ErrorBoundary catches,
 * displaying an actionable install command instead of a cryptic module error.
 */

const INSTALL_HINTS: Record<string, string[]> = {
  "@nivo/bar": ["BarChart", "BarLineChart", "Sparkline (bar type)", "Waterfall"],
  "@nivo/line": ["AreaChart", "LineChart", "Sparkline (line type)"],
  "@nivo/pie": ["DonutChart", "Gauge"],
  "@nivo/heatmap": ["HeatMap"],
  "@nivo/bullet": ["BulletChart"],
  "@nivo/funnel": ["Funnel"],
  "@nivo/treemap": ["Treemap"],
  "@nivo/radar": ["Radar"],
  "@nivo/sankey": ["Sankey"],
  "@nivo/geo": ["Choropleth"],
  "@nivo/bump": ["Bump"],
};

export function assertPeer(
  dep: unknown,
  packageName: string,
  componentName: string
): asserts dep is Function {
  if (dep != null) return;

  const uses = INSTALL_HINTS[packageName];
  const usedBy = uses ? `\nUsed by: ${uses.join(", ")}` : "";

  throw new Error(
    `Missing dependency: "${packageName}" is required by ${componentName} but was not found.\n\n` +
    `Install it:\n\n  npm install ${packageName}\n${usedBy}`
  );
}
