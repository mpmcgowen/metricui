Now I'll produce the complete MetricCore API specification. Given the enormous scope, I'll write it in structured sections directly as my response, and also save it to the plan file.

---

# MetricCore (`@metricui/core`) -- Complete API Surface Design

## Table of Contents

1. [Foundation Types & Generics](#1-foundation-types--generics)
2. [Layout Hooks](#2-layout-hooks)
3. [Scale Hooks](#3-scale-hooks)
4. [Data Processing Utilities](#4-data-processing-utilities)
5. [Animation System](#5-animation-system)
6. [Structural Components (SVG)](#6-structural-components-svg)
7. [Geometry Renderers](#7-geometry-renderers)
8. [Interaction Layer](#8-interaction-layer)
9. [Tooltip System](#9-tooltip-system)
10. [Accessibility Primitives](#10-accessibility-primitives)
11. [Utility Hooks](#11-utility-hooks)
12. [Full Composition Examples](#12-full-composition-examples)

---

## 1. Foundation Types & Generics

Every type in MetricCore flows from the generic data shape `TDatum`. The consumer defines what their data looks like, and that type propagates through scales, accessors, renderers, and event handlers.

```typescript
// ============================================================================
// @metricui/core/types
// ============================================================================

// --- Accessor pattern ---
// An accessor is either a key of TDatum or a function that extracts a value.
// This is the core pattern that makes the entire library type-safe.
type Accessor<TDatum, TValue> = keyof TDatum | ((datum: TDatum, index: number) => TValue);

// --- Margin / Padding ---
interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Shorthand: number applies to all sides, partial fills missing with 0
type MarginInput = number | Partial<Margin>;

// --- Dimensions ---
interface Dimensions {
  width: number;
  height: number;
}

interface ChartDimensions extends Dimensions {
  margin: Margin;
  innerWidth: number;   // width - margin.left - margin.right
  innerHeight: number;  // height - margin.top - margin.bottom
}

// --- Scale types (wrappers around D3 scale return types) ---
// These are the output types from the useScale hooks.
// They carry the same interface as D3 scales but are branded for type safety.

interface ScaleLinear {
  (value: number): number;
  domain(): [number, number];
  range(): [number, number];
  ticks(count?: number): number[];
  tickFormat(count?: number, specifier?: string): (d: number) => string;
  nice(count?: number): ScaleLinear;
  copy(): ScaleLinear;
  invert(value: number): number;
}

interface ScaleLog {
  (value: number): number;
  domain(): [number, number];
  range(): [number, number];
  ticks(count?: number): number[];
  tickFormat(count?: number, specifier?: string): (d: number) => string;
  nice(): ScaleLog;
  copy(): ScaleLog;
  invert(value: number): number;
  base(): number;
}

interface ScaleBand {
  (value: string): number | undefined;
  domain(): string[];
  range(): [number, number];
  bandwidth(): number;
  step(): number;
  paddingInner(): number;
  paddingOuter(): number;
  align(): number;
  copy(): ScaleBand;
}

interface ScalePoint {
  (value: string): number | undefined;
  domain(): string[];
  range(): [number, number];
  step(): number;
  padding(): number;
  copy(): ScalePoint;
}

interface ScaleTime {
  (value: Date): number;
  domain(): [Date, Date];
  range(): [number, number];
  ticks(count?: number): Date[];
  tickFormat(count?: number, specifier?: string): (d: Date) => string;
  nice(count?: number): ScaleTime;
  copy(): ScaleTime;
  invert(value: number): Date;
}

interface ScaleOrdinal<TRange = string> {
  (value: string): TRange;
  domain(): string[];
  range(): TRange[];
  copy(): ScaleOrdinal<TRange>;
}

// Union of all scale types
type AnyScale = ScaleLinear | ScaleLog | ScaleBand | ScalePoint | ScaleTime | ScaleOrdinal;

// A continuous scale (supports .invert())
type ContinuousScale = ScaleLinear | ScaleLog | ScaleTime;

// --- Position types for axis ---
type AxisPosition = 'top' | 'right' | 'bottom' | 'left';

// --- Event types ---
// All chart events carry the datum typed to the consumer's generic.

interface ChartPointerEvent<TDatum> {
  datum: TDatum;
  index: number;
  /** SVG-local coordinates */
  svgX: number;
  svgY: number;
  /** Client coordinates (for tooltip positioning) */
  clientX: number;
  clientY: number;
  /** The native browser event */
  nativeEvent: PointerEvent;
}

interface ChartClickEvent<TDatum> extends ChartPointerEvent<TDatum> {}

interface ChartHoverEvent<TDatum> extends ChartPointerEvent<TDatum> {}

interface ChartFocusEvent<TDatum> {
  datum: TDatum;
  index: number;
  nativeEvent: FocusEvent;
}

interface ChartDragEvent<TDatum> {
  datum: TDatum;
  index: number;
  deltaX: number;
  deltaY: number;
  svgX: number;
  svgY: number;
  nativeEvent: PointerEvent;
}

// --- Curve interpolation (maps to d3-shape curve factories) ---
type CurveType =
  | 'linear'
  | 'basis'
  | 'basisClosed'
  | 'basisOpen'
  | 'bundle'
  | 'cardinal'
  | 'cardinalClosed'
  | 'cardinalOpen'
  | 'catmullRom'
  | 'catmullRomClosed'
  | 'catmullRomOpen'
  | 'monotoneX'
  | 'monotoneY'
  | 'natural'
  | 'step'
  | 'stepAfter'
  | 'stepBefore';

// --- Easing ---
type EasingFunction = (t: number) => number;

// --- Interpolation ---
// A function that takes a start value, end value, and progress (0..1),
// and returns the interpolated value. This is what makes the animation
// system extensible -- springs, physics, etc. can all be implemented
// as custom InterpolationFn.
type InterpolationFn<T> = (from: T, to: T, t: number) => T;

// --- Gradient / Pattern definitions ---
interface LinearGradientStop {
  offset: string;    // e.g. "0%", "100%"
  color: string;
  opacity?: number;
}

interface LinearGradientDef {
  type: 'linearGradient';
  id: string;
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  stops: LinearGradientStop[];
}

interface PatternLinesDef {
  type: 'patternLines';
  id: string;
  spacing?: number;
  rotation?: number;
  lineWidth?: number;
  color: string;
  background?: string;
}

interface PatternDotsDef {
  type: 'patternDots';
  id: string;
  size?: number;
  padding?: number;
  color: string;
  background?: string;
}

type DefsItem = LinearGradientDef | PatternLinesDef | PatternDotsDef;
```

**Description**: These are the foundational types that every other primitive in MetricCore depends on. The `Accessor<TDatum, TValue>` pattern is the single most important type -- it allows both `"revenue"` (a key) and `(d) => d.revenue` (a function) to be used interchangeably throughout the API. All event types carry the consumer's `TDatum` generic so event handlers are fully typed.

---

## 2. Layout Hooks

### `useChartDimensions`

```typescript
// Uses: none (pure math)
function useChartDimensions(config: {
  width: number;
  height: number;
  margin?: MarginInput;
}): ChartDimensions;
```

**Description**: Takes the outer SVG dimensions and a margin specification, returns fully computed chart dimensions including `innerWidth` and `innerHeight`. Pure math -- no DOM measurement, no visual output. The margin shorthand (`margin={20}` expands to `{top:20,right:20,bottom:20,left:20}`) is resolved here.

**Usage**:
```tsx
const dims = useChartDimensions({ width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 60 } });
// dims.innerWidth === 720, dims.innerHeight === 340
```

### `useContainerSize`

```typescript
// Uses: none (ResizeObserver)
function useContainerSize(): {
  ref: React.RefObject<HTMLDivElement>;
  width: number;
  height: number;
};
```

**Description**: Attaches a `ResizeObserver` to a container div and returns the current pixel dimensions. Updated on resize. Returns `0, 0` before first measurement. The `ref` must be attached to a DOM element by the consumer.

**Usage**:
```tsx
const { ref, width, height } = useContainerSize();
return <div ref={ref} style={{ width: '100%', height: 400 }}><ChartSvg width={width} height={height}>...</ChartSvg></div>;
```

---

## 3. Scale Hooks

All scale hooks wrap D3 scale constructors. They are memoized -- the returned scale only changes when inputs change.

### `useLinearScale`

```typescript
// Uses: d3-scale (scaleLinear)
function useLinearScale(config: {
  domain?: [number, number];         // explicit domain, OR:
  data?: unknown[];                  // compute domain from data
  accessor?: Accessor<any, number>;  // used with data to extract values
  range: [number, number];
  nice?: boolean;                    // default: false
  clamp?: boolean;                   // default: false
  includeZero?: boolean;             // default: false — force 0 into domain
  padding?: number;                  // fractional padding added to domain extent
}): ScaleLinear;
```

**Description**: Creates a D3 linear scale. When `data` and `accessor` are provided instead of `domain`, the domain is auto-computed from the data extent. `includeZero` ensures the domain always contains 0 (common for bar charts). `padding` extends the domain by a fraction of its extent (e.g., `0.1` adds 10% breathing room).

**Uses**: `d3-scale` (`scaleLinear`)

### `useLogScale`

```typescript
// Uses: d3-scale (scaleLog)
function useLogScale(config: {
  domain?: [number, number];
  data?: unknown[];
  accessor?: Accessor<any, number>;
  range: [number, number];
  base?: number;    // default: 10
  nice?: boolean;
  clamp?: boolean;
}): ScaleLog;
```

**Description**: Creates a D3 logarithmic scale. Same auto-domain pattern as `useLinearScale`.

**Uses**: `d3-scale` (`scaleLog`)

### `useTimeScale`

```typescript
// Uses: d3-scale (scaleTime)
function useTimeScale(config: {
  domain?: [Date, Date];
  data?: unknown[];
  accessor?: Accessor<any, Date>;
  range: [number, number];
  nice?: boolean;
  clamp?: boolean;
}): ScaleTime;
```

**Description**: Creates a D3 time scale for date-based axes.

**Uses**: `d3-scale` (`scaleTime`)

### `useBandScale`

```typescript
// Uses: d3-scale (scaleBand)
function useBandScale(config: {
  domain: string[];
  range: [number, number];
  paddingInner?: number;   // default: 0
  paddingOuter?: number;   // default: 0
  align?: number;          // default: 0.5
}): ScaleBand;
```

**Description**: Creates a D3 band scale for categorical axes (used by bar charts). The `domain` is the list of category values in display order.

**Uses**: `d3-scale` (`scaleBand`)

### `usePointScale`

```typescript
// Uses: d3-scale (scalePoint)
function usePointScale(config: {
  domain: string[];
  range: [number, number];
  padding?: number;   // default: 0.5
}): ScalePoint;
```

**Description**: Creates a D3 point scale for categorical axes where each category maps to a single point (used by line/area charts with categorical x-axes).

**Uses**: `d3-scale` (`scalePoint`)

### `useOrdinalScale`

```typescript
// Uses: d3-scale (scaleOrdinal)
function useOrdinalScale<TRange = string>(config: {
  domain: string[];
  range: TRange[];
}): ScaleOrdinal<TRange>;
```

**Description**: Creates a D3 ordinal scale that maps discrete domain values to discrete range values. Commonly used for color mapping.

**Uses**: `d3-scale` (`scaleOrdinal`)

---

## 4. Data Processing Utilities

### `useStackedData`

```typescript
// Uses: d3-shape (stack)
function useStackedData<TDatum>(config: {
  data: TDatum[];
  keys: string[];
  order?: 'none' | 'ascending' | 'descending' | 'reverse' | 'insideOut';
  offset?: 'none' | 'diverging' | 'expand' | 'silhouette' | 'wiggle';
}): {
  /** One Series per key, each containing [lower, upper] pairs per datum */
  series: Array<{
    key: string;
    data: Array<{ datum: TDatum; lower: number; upper: number }>;
  }>;
};
```

**Description**: Computes stacked layout using D3 stack generator. Returns lower and upper bounds for each datum in each series, suitable for rendering stacked bars or stacked areas. The `offset: 'expand'` mode normalizes to 100% stacking.

**Uses**: `d3-shape` (`stack`, `stackOrderNone`, etc.)

### `usePieLayout`

```typescript
// Uses: d3-shape (pie)
function usePieLayout<TDatum>(config: {
  data: TDatum[];
  value: Accessor<TDatum, number>;
  sort?: ((a: TDatum, b: TDatum) => number) | null;  // null = input order
  startAngle?: number;    // radians, default: 0
  endAngle?: number;      // radians, default: 2 * Math.PI
  padAngle?: number;      // radians, default: 0
}): Array<{
  datum: TDatum;
  index: number;
  value: number;
  startAngle: number;
  endAngle: number;
  padAngle: number;
}>;
```

**Description**: Computes pie/donut arc angles from data values using D3's pie layout generator. Returns angle data that feeds into the `Arcs` renderer.

**Uses**: `d3-shape` (`pie`)

### `useTreemapLayout`

```typescript
// Uses: d3-hierarchy (treemap, hierarchy)
function useTreemapLayout<TDatum>(config: {
  data: TDatum;
  children: Accessor<TDatum, TDatum[] | undefined>;
  value: Accessor<TDatum, number>;
  tile?: 'squarify' | 'binary' | 'dice' | 'slice' | 'sliceDice';
  width: number;
  height: number;
  padding?: number;
  innerPadding?: number;
  round?: boolean;
}): Array<{
  datum: TDatum;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  depth: number;
  value: number;
}>;
```

**Description**: Computes treemap rectangle positions using D3 hierarchy and treemap layout.

**Uses**: `d3-hierarchy` (`hierarchy`, `treemap`, `treemapSquarify`, etc.)

### `useSankeyLayout`

```typescript
// Uses: d3-sankey (sankey, sankeyLinkHorizontal)
function useSankeyLayout(config: {
  nodes: Array<{ id: string; [key: string]: unknown }>;
  links: Array<{ source: string; target: string; value: number }>;
  width: number;
  height: number;
  nodeWidth?: number;       // default: 24
  nodePadding?: number;     // default: 8
  nodeAlign?: 'left' | 'right' | 'center' | 'justify';
  iterations?: number;      // default: 6
}): {
  nodes: Array<{
    id: string;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    value: number;
    sourceLinks: unknown[];
    targetLinks: unknown[];
  }>;
  links: Array<{
    source: { id: string; x0: number; x1: number; y0: number; y1: number };
    target: { id: string; x0: number; x1: number; y0: number; y1: number };
    value: number;
    width: number;
    y0: number;
    y1: number;
    path: string;   // pre-computed SVG path via sankeyLinkHorizontal
  }>;
};
```

**Description**: Computes sankey node positions and link paths using D3's sankey layout.

**Uses**: `d3-sankey` (`sankey`, `sankeyLinkHorizontal`, `sankeyLeft`/`Right`/`Center`/`Justify`)

### `useVoronoi`

```typescript
// Uses: d3-delaunay (Delaunay)
function useVoronoi<TDatum>(config: {
  points: Array<{ x: number; y: number; datum: TDatum }>;
  width: number;
  height: number;
}): {
  /** Find the nearest datum to a given SVG coordinate */
  find: (x: number, y: number) => { datum: TDatum; index: number; distance: number } | null;
};
```

**Description**: Builds a Delaunay triangulation / Voronoi diagram from point coordinates for nearest-point hit detection. Used by line charts and scatter plots where hovering should snap to the nearest data point.

**Uses**: `d3-delaunay` (`Delaunay.from`)

### `useGeoProjection`

```typescript
// Uses: d3-geo (geoMercator, geoNaturalEarth1, geoEqualEarth, geoOrthographic, geoPath)
function useGeoProjection(config: {
  type: 'mercator' | 'naturalEarth1' | 'equalEarth' | 'orthographic';
  width: number;
  height: number;
  scale?: number;
  center?: [number, number];       // [longitude, latitude]
  rotation?: [number, number, number];
  fitFeatures?: GeoJSON.FeatureCollection;  // auto-fit to these features
}): {
  projection: d3.GeoProjection;
  pathGenerator: d3.GeoPath;
};
```

**Description**: Creates a D3 geo projection and path generator for rendering geographic shapes.

**Uses**: `d3-geo` (`geoMercator`, `geoNaturalEarth1`, `geoEqualEarth`, `geoOrthographic`, `geoPath`)

---

## 5. Animation System

The animation system is built entirely on `requestAnimationFrame`. No external animation libraries. The consumer provides an easing function (or uses one of the built-in ones). Custom interpolation functions allow implementing springs, physics, or any other animation model.

### Easing Functions

```typescript
// Uses: none (pure math, NOT d3-ease -- zero opinions)
// These are provided as a convenience. The consumer can pass any (t: number) => number.

const easings: {
  linear: EasingFunction;
  easeInQuad: EasingFunction;
  easeOutQuad: EasingFunction;
  easeInOutQuad: EasingFunction;
  easeInCubic: EasingFunction;
  easeOutCubic: EasingFunction;
  easeInOutCubic: EasingFunction;
  easeInQuart: EasingFunction;
  easeOutQuart: EasingFunction;
  easeInOutQuart: EasingFunction;
  easeInSine: EasingFunction;
  easeOutSine: EasingFunction;
  easeInOutSine: EasingFunction;
  easeInExpo: EasingFunction;
  easeOutExpo: EasingFunction;
  easeInOutExpo: EasingFunction;
};
```

### `useAnimatedValue`

```typescript
// Uses: none (requestAnimationFrame)
function useAnimatedValue<T = number>(
  target: T,
  config: {
    duration: number;                      // ms
    easing: EasingFunction;
    interpolate?: InterpolationFn<T>;      // default: numeric lerp for numbers
    immediate?: boolean;                   // skip animation, jump to target
    onComplete?: () => void;
  }
): {
  value: T;
  isAnimating: boolean;
};
```

**Description**: Animates a single value from its previous value to a new target whenever `target` changes. Uses `requestAnimationFrame` internally. For numbers, the default interpolation is linear. For other types (colors, paths, objects), the consumer supplies a custom `interpolate` function. Setting `immediate: true` skips animation and jumps to the target.

**Usage**:
```tsx
const { value: barHeight } = useAnimatedValue(computedHeight, { duration: 300, easing: easings.easeOutCubic });
return <rect height={barHeight} />;
```

### `useAnimatedPath`

```typescript
// Uses: none (requestAnimationFrame, string interpolation)
function useAnimatedPath(
  targetPath: string,
  config: {
    duration: number;
    easing: EasingFunction;
    immediate?: boolean;
  }
): {
  path: string;
  isAnimating: boolean;
};
```

**Description**: Animates an SVG path `d` attribute between two path strings. Uses point-by-point interpolation when the paths have the same number of commands, and falls back to a morphing approach (sampling points) when they differ. Designed for line chart transitions.

### `useTransitionGroup`

```typescript
// Uses: none (requestAnimationFrame)
interface TransitionItem<TDatum, TAnimatedProps> {
  datum: TDatum;
  key: string;
  animated: TAnimatedProps;
  phase: 'entering' | 'active' | 'exiting';
}

function useTransitionGroup<TDatum, TAnimatedProps>(
  data: TDatum[],
  config: {
    key: Accessor<TDatum, string>;
    from: (datum: TDatum) => TAnimatedProps;     // enter start values
    enter: (datum: TDatum) => TAnimatedProps;    // enter end / steady state
    update: (datum: TDatum) => TAnimatedProps;   // values when datum changes
    exit: (datum: TDatum) => TAnimatedProps;     // exit end values
    duration: number;
    easing: EasingFunction;
    interpolate?: InterpolationFn<TAnimatedProps>;
  }
): TransitionItem<TDatum, TAnimatedProps>[];
```

**Description**: Manages enter/update/exit transitions for a list of data items. Each item is tracked by its key. When new items appear, they animate from `from` to `enter`. When existing items change, they animate to `update`. When items are removed, they animate to `exit` and are then removed from the returned list. This is the core primitive for animating bars entering/exiting, line points changing, pie slices growing, etc.

**Usage**:
```tsx
const transitions = useTransitionGroup(data, {
  key: 'id',
  from: (d) => ({ opacity: 0, y: innerHeight }),
  enter: (d) => ({ opacity: 1, y: yScale(d.value) }),
  update: (d) => ({ opacity: 1, y: yScale(d.value) }),
  exit: (d) => ({ opacity: 0, y: innerHeight }),
  duration: 400,
  easing: easings.easeOutCubic,
});
// transitions[i].animated.opacity, transitions[i].animated.y, transitions[i].phase
```

### `usePreviousValue`

```typescript
// Uses: none (React ref)
function usePreviousValue<T>(value: T): T | undefined;
```

**Description**: Returns the value from the previous render. Useful for computing deltas or triggering animations when a value changes.

---

## 6. Structural Components (SVG)

### `ChartSvg`

```typescript
// Uses: none
interface ChartSvgProps {
  width: number;
  height: number;
  margin?: MarginInput;
  viewBox?: string;                // override automatic viewBox
  preserveAspectRatio?: string;    // default: 'xMidYMid meet'
  className?: string;
  style?: React.CSSProperties;
  defs?: DefsItem[];               // gradient/pattern definitions
  role?: string;                   // default: 'img'
  'aria-label': string;            // REQUIRED -- accessible by default
  'aria-describedby'?: string;
  'aria-roledescription'?: string;  // default: 'chart'
  children: React.ReactNode;
}

declare const ChartSvg: React.FC<ChartSvgProps>;
```

**Description**: The root SVG element for every chart. Sets up `viewBox` from width/height, renders `<defs>` for gradients/patterns, and creates a `<g>` transform for the margin offset. Children are rendered inside the margin-offset group. Requires `aria-label` -- you cannot render a chart without describing it.

The `defs` prop accepts an array of gradient and pattern definitions which are rendered as `<defs>` children. Elements reference them via `fill="url(#gradientId)"`.

**Usage**:
```tsx
<ChartSvg width={800} height={400} margin={{ top: 20, right: 20, bottom: 40, left: 60 }} aria-label="Monthly revenue bar chart">
  <GridLines ... />
  <Bars ... />
  <Axis ... />
</ChartSvg>
```

### `Axis`

```typescript
// Uses: none (renders ticks from scale)
interface AxisProps {
  scale: AnyScale;
  position: AxisPosition;
  // Tick configuration
  tickCount?: number;                          // suggested count (scale may adjust)
  tickValues?: (string | number | Date)[];     // explicit tick positions
  tickSize?: number;                           // tick mark length in px
  tickPadding?: number;                        // gap between tick mark and label
  tickFormat?: (value: any, index: number) => string;
  tickRotation?: number;                       // degrees
  // Title
  title?: string;
  titleOffset?: number;                        // distance from axis line
  titleProps?: React.SVGAttributes<SVGTextElement>;
  // Styling (no defaults -- consumer decides everything)
  lineProps?: React.SVGAttributes<SVGLineElement>;
  tickLineProps?: React.SVGAttributes<SVGLineElement>;
  tickLabelProps?: (value: any, index: number) => React.SVGAttributes<SVGTextElement>;
  // Visibility
  hideLine?: boolean;
  hideTicks?: boolean;
  hideTickLabels?: boolean;
  // Accessibility
  'aria-label'?: string;
  // Animation
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare const Axis: React.FC<AxisProps>;
```

**Description**: Renders an axis (ticks, labels, line, optional title) for any scale at any position. Tick positions are computed from the scale. The consumer controls all styling through prop functions -- there are no default font sizes, colors, or stroke widths. `tickLabelProps` is a function that receives each tick value and returns SVG text attributes, enabling per-tick styling (e.g., bold the current month).

**Usage**:
```tsx
<Axis
  scale={xScale}
  position="bottom"
  tickLabelProps={() => ({ fontSize: 11, fill: '#6b7280', textAnchor: 'middle' })}
  lineProps={{ stroke: '#e5e7eb' }}
/>
```

### `GridLines`

```typescript
// Uses: none (reads ticks from scale)
interface GridLinesProps {
  xScale?: AnyScale;
  yScale?: AnyScale;
  width: number;         // inner chart width
  height: number;        // inner chart height
  xTickCount?: number;
  yTickCount?: number;
  xTickValues?: (string | number | Date)[];
  yTickValues?: (string | number | Date)[];
  lineProps?: React.SVGAttributes<SVGLineElement>;
  xLineProps?: React.SVGAttributes<SVGLineElement>;
  yLineProps?: React.SVGAttributes<SVGLineElement>;
}

declare const GridLines: React.FC<GridLinesProps>;
```

**Description**: Renders horizontal grid lines (from yScale ticks) and/or vertical grid lines (from xScale ticks). Pass one or both scales. The consumer styles the lines through props -- no default stroke colors or dash patterns.

**Usage**:
```tsx
<GridLines yScale={yScale} width={innerWidth} height={innerHeight} lineProps={{ stroke: '#f3f4f6', strokeDasharray: '4 2' }} />
```

### `ReferenceLine`

```typescript
// Uses: none
interface ReferenceLineProps {
  scale: ContinuousScale | ScaleBand;
  value: number | string | Date;
  orientation: 'horizontal' | 'vertical';
  length: number;             // how far the line extends (innerWidth or innerHeight)
  label?: string;
  labelPosition?: 'start' | 'end';
  labelProps?: React.SVGAttributes<SVGTextElement>;
  lineProps?: React.SVGAttributes<SVGLineElement>;
  // Accessibility
  'aria-label'?: string;
}

declare const ReferenceLine: React.FC<ReferenceLineProps>;
```

**Description**: Renders a single reference line at a specific data value (e.g., a target line, an average line). The line is positioned using the provided scale.

**Usage**:
```tsx
<ReferenceLine scale={yScale} value={75000} orientation="horizontal" length={innerWidth} label="Target" lineProps={{ stroke: '#ef4444', strokeDasharray: '6 3' }} />
```

### `ThresholdBand`

```typescript
// Uses: none
interface ThresholdBandProps {
  scale: ContinuousScale;
  from: number | Date;
  to: number | Date;
  orientation: 'horizontal' | 'vertical';
  length: number;             // extent in the other direction
  label?: string;
  labelProps?: React.SVGAttributes<SVGTextElement>;
  rectProps?: React.SVGAttributes<SVGRectElement>;
  // Accessibility
  'aria-label'?: string;
}

declare const ThresholdBand: React.FC<ThresholdBandProps>;
```

**Description**: Renders a shaded rectangular region between two scale values. Used for danger zones, target ranges, confidence intervals, etc.

**Usage**:
```tsx
<ThresholdBand scale={yScale} from={0} to={50000} orientation="horizontal" length={innerWidth} rectProps={{ fill: '#fee2e2', opacity: 0.5 }} label="Below target" />
```

### `ClipPath`

```typescript
// Uses: none
interface ClipPathProps {
  id: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  padding?: MarginInput;
}

declare const ClipPath: React.FC<ClipPathProps>;
```

**Description**: Renders an SVG `<clipPath>` definition. Elements reference it via `clipPath="url(#id)"`. Useful for constraining line/area paths to the chart area so they don't overflow during transitions.

**Usage**:
```tsx
<ClipPath id="chart-clip" width={innerWidth} height={innerHeight} />
<g clipPath="url(#chart-clip)"><LinePath ... /></g>
```

### `Defs`

```typescript
// Uses: none
interface DefsProps {
  items: DefsItem[];
}

declare const Defs: React.FC<DefsProps>;
```

**Description**: Renders SVG `<defs>` containing gradients and patterns. Can be used standalone (outside ChartSvg) or implicitly through ChartSvg's `defs` prop.

**Usage**:
```tsx
<Defs items={[{ type: 'linearGradient', id: 'areaFill', x1: '0', y1: '0', x2: '0', y2: '1', stops: [{ offset: '0%', color: '#3b82f6', opacity: 0.3 }, { offset: '100%', color: '#3b82f6', opacity: 0 }] }]} />
```

---

## 7. Geometry Renderers

Each renderer handles one visual shape. They receive pre-computed layout data and scales, and render SVG elements. They are fully independent -- no renderer knows about any other renderer or any structural component.

### `Bars`

```typescript
// Uses: none (positioning from scales passed in)
interface BarsProps<TDatum> {
  data: TDatum[];
  xScale: ScaleBand;
  yScale: ScaleLinear;
  x: Accessor<TDatum, string>;
  y: Accessor<TDatum, number>;
  /** For grouped bars: which group key this bar belongs to */
  groupScale?: ScaleBand;
  groupKey?: Accessor<TDatum, string>;
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Corner radius */
  rx?: number;
  ry?: number;
  /** Per-bar styling */
  style?: (datum: TDatum, index: number) => React.SVGAttributes<SVGRectElement>;
  /** Per-bar className */
  className?: (datum: TDatum, index: number) => string;
  /** Events */
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  onFocus?: (event: ChartFocusEvent<TDatum>) => void;
  onBlur?: (event: ChartFocusEvent<TDatum>) => void;
  /** Animation */
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  /** Render prop for custom bar content (e.g., labels inside bars) */
  children?: (props: {
    datum: TDatum;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => React.ReactNode;
  // Accessibility
  role?: string;                    // default: 'listitem'
  'aria-label'?: (datum: TDatum, index: number) => string;
}

declare function Bars<TDatum>(props: BarsProps<TDatum>): React.ReactElement;
```

**Description**: Renders a set of `<rect>` elements positioned by band and linear scales. Supports vertical and horizontal orientation, grouped bars (via `groupScale`), and per-bar styling. The `style` function receives each datum and returns SVG attributes (fill, stroke, opacity, etc.), giving the consumer full control. The `children` render prop allows placing content (labels, icons) inside each bar.

**Uses**: None -- all scale computation happens externally.

**Usage**:
```tsx
<Bars data={data} xScale={xScale} yScale={yScale} x="month" y="revenue" rx={4} style={(d) => ({ fill: d.revenue > 0 ? '#3b82f6' : '#ef4444' })} />
```

### `LinePath`

```typescript
// Uses: d3-shape (line, curveMonotoneX, etc.)
interface LinePathProps<TDatum> {
  data: TDatum[];
  x: Accessor<TDatum, number>;    // already scaled x position
  y: Accessor<TDatum, number>;    // already scaled y position
  curve?: CurveType;              // default: none (consumer decides)
  defined?: (datum: TDatum, index: number) => boolean;   // gap handling
  pathProps?: React.SVGAttributes<SVGPathElement>;
  className?: string;
  // Animation
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare function LinePath<TDatum>(props: LinePathProps<TDatum>): React.ReactElement;
```

**Description**: Renders a single `<path>` element from data points using D3's line generator. The `x` and `y` accessors should return already-scaled pixel values (the consumer applies scales before passing data, or uses accessor functions that apply scales inline). The `defined` function controls gap rendering -- return `false` for null data points to create line breaks. The `curve` prop selects the D3 curve interpolation.

**Uses**: `d3-shape` (`line`, curve factories)

**Usage**:
```tsx
<LinePath data={series} x={(d) => xScale(d.date)} y={(d) => yScale(d.value)} curve="monotoneX" defined={(d) => d.value !== null} pathProps={{ stroke: '#3b82f6', strokeWidth: 2, fill: 'none' }} />
```

### `Area`

```typescript
// Uses: d3-shape (area, curveMonotoneX, etc.)
interface AreaProps<TDatum> {
  data: TDatum[];
  x: Accessor<TDatum, number>;
  y0: Accessor<TDatum, number>;    // bottom edge (baseline)
  y1: Accessor<TDatum, number>;    // top edge
  curve?: CurveType;
  defined?: (datum: TDatum, index: number) => boolean;
  pathProps?: React.SVGAttributes<SVGPathElement>;
  className?: string;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare function Area<TDatum>(props: AreaProps<TDatum>): React.ReactElement;
```

**Description**: Renders a filled `<path>` using D3's area generator. `y0` is the baseline (often `innerHeight` for area-under-line, or a lower bound for stacked areas) and `y1` is the data edge. Supports the same curve interpolation and gap handling as `LinePath`.

**Uses**: `d3-shape` (`area`, curve factories)

**Usage**:
```tsx
<Area data={series} x={(d) => xScale(d.date)} y0={innerHeight} y1={(d) => yScale(d.value)} curve="monotoneX" pathProps={{ fill: 'url(#areaGradient)' }} />
```

### `Points`

```typescript
// Uses: none
interface PointsProps<TDatum> {
  data: TDatum[];
  x: Accessor<TDatum, number>;
  y: Accessor<TDatum, number>;
  /** Render function for each point. Default: circle */
  renderPoint?: (props: {
    datum: TDatum;
    index: number;
    cx: number;
    cy: number;
  }) => React.ReactNode;
  /** Default circle radius (used when renderPoint is not provided) */
  r?: number;
  style?: (datum: TDatum, index: number) => React.SVGAttributes<SVGCircleElement>;
  className?: (datum: TDatum, index: number) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  onFocus?: (event: ChartFocusEvent<TDatum>) => void;
  onBlur?: (event: ChartFocusEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  role?: string;
  'aria-label'?: (datum: TDatum, index: number) => string;
}

declare function Points<TDatum>(props: PointsProps<TDatum>): React.ReactElement;
```

**Description**: Renders scatter dots / data point markers. By default renders `<circle>` elements, but the `renderPoint` prop allows any SVG content per point (squares, diamonds, custom icons). Used both for scatter plots and for dots on line charts.

**Usage**:
```tsx
<Points data={data} x={(d) => xScale(d.x)} y={(d) => yScale(d.y)} r={4} style={(d) => ({ fill: colorScale(d.category) })} />
```

### `Arcs`

```typescript
// Uses: d3-shape (arc)
interface ArcDatum {
  startAngle: number;
  endAngle: number;
  padAngle: number;
  /** These are set by the consumer -- ArcDatum is extended with whatever the consumer needs */
  [key: string]: unknown;
}

interface ArcsProps<TDatum extends ArcDatum> {
  data: TDatum[];
  innerRadius: number;
  outerRadius: number;
  cornerRadius?: number;
  /** Per-arc style */
  style?: (datum: TDatum, index: number) => React.SVGAttributes<SVGPathElement>;
  className?: (datum: TDatum, index: number) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  onFocus?: (event: ChartFocusEvent<TDatum>) => void;
  onBlur?: (event: ChartFocusEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  /** Render prop for arc content (e.g. labels on slices) */
  children?: (props: {
    datum: TDatum;
    index: number;
    path: string;
    centroid: [number, number];
  }) => React.ReactNode;
  role?: string;
  'aria-label'?: (datum: TDatum, index: number) => string;
}

declare function Arcs<TDatum extends ArcDatum>(props: ArcsProps<TDatum>): React.ReactElement;
```

**Description**: Renders pie/donut arc `<path>` elements using D3's arc generator. The `data` is the output of `usePieLayout` (or any array of objects with `startAngle`/`endAngle`). The `children` render prop provides the arc centroid for label positioning. The component must be rendered inside a `<g>` transformed to the center of the pie.

**Uses**: `d3-shape` (`arc`)

**Usage**:
```tsx
<g transform={`translate(${cx}, ${cy})`}>
  <Arcs data={arcs} innerRadius={80} outerRadius={140} cornerRadius={3} style={(d) => ({ fill: colorScale(d.datum.label) })} />
</g>
```

### `Cells`

```typescript
// Uses: none
interface CellsProps<TDatum> {
  data: TDatum[];
  x: Accessor<TDatum, number>;
  y: Accessor<TDatum, number>;
  width: Accessor<TDatum, number>;
  height: Accessor<TDatum, number>;
  rx?: number;
  ry?: number;
  style?: (datum: TDatum, index: number) => React.SVGAttributes<SVGRectElement>;
  className?: (datum: TDatum, index: number) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  children?: (props: {
    datum: TDatum;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => React.ReactNode;
  role?: string;
  'aria-label'?: (datum: TDatum, index: number) => string;
}

declare function Cells<TDatum>(props: CellsProps<TDatum>): React.ReactElement;
```

**Description**: Renders a grid of `<rect>` elements for heatmaps. Each cell's position and size are determined by accessors. The `children` render prop allows placing labels inside cells. The consumer maps their data to pixel positions using scales before passing to this component.

**Usage**:
```tsx
<Cells data={heatData} x={(d) => xScale(d.col)} y={(d) => yScale(d.row)} width={xScale.bandwidth()} height={yScale.bandwidth()} style={(d) => ({ fill: colorScale(d.value) })} />
```

### `Links`

```typescript
// Uses: none (paths pre-computed by useSankeyLayout)
interface LinksProps<TLink> {
  data: TLink[];
  path: Accessor<TLink, string>;      // SVG path string
  width: Accessor<TLink, number>;     // stroke width
  style?: (datum: TLink, index: number) => React.SVGAttributes<SVGPathElement>;
  className?: (datum: TLink, index: number) => string;
  onClick?: (event: ChartClickEvent<TLink>) => void;
  onHover?: (event: ChartHoverEvent<TLink>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TLink>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  role?: string;
  'aria-label'?: (datum: TLink, index: number) => string;
}

declare function Links<TLink>(props: LinksProps<TLink>): React.ReactElement;
```

**Description**: Renders Sankey flow paths as `<path>` elements with variable stroke width. The path geometry and widths are pre-computed by `useSankeyLayout`.

**Usage**:
```tsx
<Links data={layout.links} path={(l) => l.path} width={(l) => l.width} style={(l) => ({ stroke: colorScale(l.source.id), strokeOpacity: 0.4, fill: 'none' })} />
```

### `TreemapRects`

```typescript
// Uses: none (layout pre-computed by useTreemapLayout)
interface TreemapRectsProps<TDatum> {
  data: Array<{ datum: TDatum; x0: number; y0: number; x1: number; y1: number; depth: number; value: number }>;
  rx?: number;
  ry?: number;
  style?: (node: { datum: TDatum; depth: number; value: number }, index: number) => React.SVGAttributes<SVGRectElement>;
  className?: (node: { datum: TDatum; depth: number; value: number }, index: number) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  children?: (props: {
    datum: TDatum;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
  }) => React.ReactNode;
  role?: string;
  'aria-label'?: (node: { datum: TDatum; value: number }, index: number) => string;
}

declare function TreemapRects<TDatum>(props: TreemapRectsProps<TDatum>): React.ReactElement;
```

**Description**: Renders treemap rectangles from pre-computed layout positions. The `children` render prop allows rendering labels inside each rectangle.

### `BumpPaths`

```typescript
// Uses: d3-shape (line, curveBasis or curveMonotoneX)
interface BumpSeries<TDatum> {
  id: string;
  data: Array<{ datum: TDatum; x: number; y: number }>;
}

interface BumpPathsProps<TDatum> {
  series: BumpSeries<TDatum>[];
  curve?: CurveType;
  style?: (series: BumpSeries<TDatum>, index: number) => React.SVGAttributes<SVGPathElement>;
  className?: (series: BumpSeries<TDatum>, index: number) => string;
  /** Render dots at each data point */
  renderPoint?: (props: {
    datum: TDatum;
    seriesId: string;
    cx: number;
    cy: number;
  }) => React.ReactNode;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare function BumpPaths<TDatum>(props: BumpPathsProps<TDatum>): React.ReactElement;
```

**Description**: Renders bump chart ranking paths -- smooth lines connecting ranked positions across categories/time periods.

**Uses**: `d3-shape` (`line`, curve factories)

### `BulletRanges`

```typescript
// Uses: none
interface BulletData {
  ranges: number[];     // background ranges (e.g., [poor, satisfactory, good])
  measures: number[];   // actual values (bars)
  markers: number[];    // target markers (lines)
  title?: string;
}

interface BulletRangesProps {
  data: BulletData;
  scale: ScaleLinear;
  width: number;
  height: number;
  orientation?: 'horizontal' | 'vertical';
  rangeStyle?: (value: number, index: number) => React.SVGAttributes<SVGRectElement>;
  measureStyle?: (value: number, index: number) => React.SVGAttributes<SVGRectElement>;
  markerStyle?: (value: number, index: number) => React.SVGAttributes<SVGLineElement>;
  measureWidth?: number;    // fraction of range height, 0-1
  markerSize?: number;      // px
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare const BulletRanges: React.FC<BulletRangesProps>;
```

**Description**: Renders the three layers of a bullet chart: background ranges (qualitative bands), measure bars (quantitative), and marker lines (comparative). Based on Stephen Few's bullet graph specification.

### `FunnelSegments`

```typescript
// Uses: none
interface FunnelSegment<TDatum> {
  datum: TDatum;
  x: number;
  y: number;
  width: number;
  height: number;
  topWidth: number;     // width at top of trapezoid
  bottomWidth: number;  // width at bottom of trapezoid
}

interface FunnelSegmentsProps<TDatum> {
  segments: FunnelSegment<TDatum>[];
  style?: (segment: FunnelSegment<TDatum>, index: number) => React.SVGAttributes<SVGPathElement>;
  className?: (segment: FunnelSegment<TDatum>, index: number) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  children?: (props: {
    datum: TDatum;
    index: number;
    centroid: [number, number];
    width: number;
    height: number;
  }) => React.ReactNode;
  role?: string;
  'aria-label'?: (segment: FunnelSegment<TDatum>, index: number) => string;
}

declare function FunnelSegments<TDatum>(props: FunnelSegmentsProps<TDatum>): React.ReactElement;
```

**Description**: Renders funnel chart trapezoid segments as `<path>` elements. The consumer pre-computes segment geometry (how wide each stage is) and passes it in. The `children` render prop provides centroids for label placement.

### `useFunnelLayout`

```typescript
// Uses: none (pure math)
function useFunnelLayout<TDatum>(config: {
  data: TDatum[];
  value: Accessor<TDatum, number>;
  width: number;
  height: number;
  spacing?: number;        // gap between segments in px
  shape?: 'trapezoid' | 'rectangle';  // rectangle = all same width
}): FunnelSegment<TDatum>[];
```

**Description**: Computes funnel segment positions and widths proportional to values. Returns an array suitable for `FunnelSegmentsProps.segments`.

### `RadarPolygons`

```typescript
// Uses: none (pure math for polar coordinates)
interface RadarPolygonsProps<TDatum> {
  data: Array<{
    id: string;
    points: Array<{ datum: TDatum; angle: number; radius: number; x: number; y: number }>;
  }>;
  style?: (series: { id: string }, index: number) => React.SVGAttributes<SVGPolygonElement>;
  fillStyle?: (series: { id: string }, index: number) => React.SVGAttributes<SVGPolygonElement>;
  className?: (series: { id: string }, index: number) => string;
  /** Whether to render fill polygons beneath stroke polygons */
  showFill?: boolean;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
}

declare function RadarPolygons<TDatum>(props: RadarPolygonsProps<TDatum>): React.ReactElement;
```

**Description**: Renders radar/spider chart polygons. Each series is a closed polygon connecting data points at polar coordinates.

### `useRadarLayout`

```typescript
// Uses: d3-scale (scaleLinear for radius)
function useRadarLayout<TDatum>(config: {
  data: TDatum[];
  dimensions: string[];                     // spoke labels
  dimensionAccessor: Accessor<TDatum, string>;
  valueAccessor: Accessor<TDatum, number>;
  seriesAccessor: Accessor<TDatum, string>;
  maxValue?: number;       // explicit max, or auto from data
  radius: number;          // pixel radius
}): {
  series: Array<{
    id: string;
    points: Array<{ datum: TDatum; angle: number; radius: number; x: number; y: number }>;
  }>;
  gridLevels: Array<{ radius: number; points: Array<{ x: number; y: number }> }>;
  axes: Array<{ label: string; angle: number; x: number; y: number }>;
};
```

**Description**: Computes radar chart layout: polar coordinates for each data point, concentric grid levels, and axis spoke positions.

**Uses**: `d3-scale` (`scaleLinear` for radius mapping)

### `RadarGrid`

```typescript
// Uses: none
interface RadarGridProps {
  levels: Array<{ radius: number; points: Array<{ x: number; y: number }> }>;
  axes: Array<{ label: string; angle: number; x: number; y: number }>;
  gridStyle?: React.SVGAttributes<SVGPolygonElement>;
  spokeStyle?: React.SVGAttributes<SVGLineElement>;
  labelProps?: (label: string, index: number) => React.SVGAttributes<SVGTextElement>;
}

declare const RadarGrid: React.FC<RadarGridProps>;
```

**Description**: Renders the radar chart background grid: concentric polygons and spoke lines with labels at each axis.

### `CalendarCells`

```typescript
// Uses: d3-time (timeWeek, timeMonth, etc. for date positioning)
interface CalendarCellsProps<TDatum> {
  data: TDatum[];
  date: Accessor<TDatum, Date>;
  value: Accessor<TDatum, number | null>;
  from: Date;
  to: Date;
  cellSize: number;
  cellGap?: number;           // default: 0
  cellRadius?: number;        // default: 0
  weekStart?: 0 | 1;         // 0 = Sunday, 1 = Monday
  style?: (datum: TDatum | null, date: Date) => React.SVGAttributes<SVGRectElement>;
  className?: (datum: TDatum | null, date: Date) => string;
  onClick?: (event: ChartClickEvent<TDatum>) => void;
  onHover?: (event: ChartHoverEvent<TDatum>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TDatum>) => void;
  /** Month label rendering */
  monthLabelProps?: (month: Date) => React.SVGAttributes<SVGTextElement>;
  /** Day-of-week label rendering */
  weekdayLabelProps?: (day: number) => React.SVGAttributes<SVGTextElement>;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  role?: string;
  'aria-label'?: (datum: TDatum | null, date: Date) => string;
}

declare function CalendarCells<TDatum>(props: CalendarCellsProps<TDatum>): React.ReactElement;
```

**Description**: Renders a GitHub-style calendar heatmap. Each day is a `<rect>` positioned in a week/day-of-week grid. The `style` function receives each datum (or null for days with no data) and the date, returning fill colors and other SVG attributes. Month and weekday labels are optional via their respective props.

**Uses**: `d3-time` (`timeWeek`, `timeMonth`, `timeDays` for date iteration and week computation)

### `GeoPaths`

```typescript
// Uses: d3-geo (geoPath -- via useGeoProjection output)
interface GeoPathsProps<TFeature> {
  features: TFeature[];
  pathGenerator: d3.GeoPath;
  style?: (feature: TFeature, index: number) => React.SVGAttributes<SVGPathElement>;
  className?: (feature: TFeature, index: number) => string;
  onClick?: (event: ChartClickEvent<TFeature>) => void;
  onHover?: (event: ChartHoverEvent<TFeature>) => void;
  onHoverEnd?: (event: ChartHoverEvent<TFeature>) => void;
  animate?: {
    duration: number;
    easing: EasingFunction;
  };
  role?: string;
  'aria-label'?: (feature: TFeature, index: number) => string;
}

declare function GeoPaths<TFeature>(props: GeoPathsProps<TFeature>): React.ReactElement;
```

**Description**: Renders geographic regions as `<path>` elements using a pre-computed D3 path generator (from `useGeoProjection`). Each GeoJSON feature becomes an SVG path. The consumer controls fill colors through the `style` function based on their data-to-feature join.

**Uses**: Receives `d3-geo`'s `geoPath` generator (from `useGeoProjection`)

**Usage**:
```tsx
const { pathGenerator } = useGeoProjection({ type: 'naturalEarth1', width, height, fitFeatures: world });
<GeoPaths features={world.features} pathGenerator={pathGenerator} style={(f) => ({ fill: colorScale(dataMap.get(f.id)?.value ?? 0) })} />
```

---

## 8. Interaction Layer

### `InteractionOverlay`

```typescript
// Uses: none
interface InteractionOverlayProps {
  width: number;
  height: number;
  onPointerMove?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: PointerEvent }) => void;
  onPointerLeave?: (event: { nativeEvent: PointerEvent }) => void;
  onPointerDown?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: PointerEvent }) => void;
  onPointerUp?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: PointerEvent }) => void;
  onClick?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: PointerEvent }) => void;
  // Touch
  onTouchStart?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: TouchEvent }) => void;
  onTouchMove?: (event: { svgX: number; svgY: number; clientX: number; clientY: number; nativeEvent: TouchEvent }) => void;
  onTouchEnd?: (event: { nativeEvent: TouchEvent }) => void;
  /** Cursor style. Default: none (consumer decides) */
  cursor?: string;
  className?: string;
}

declare const InteractionOverlay: React.FC<InteractionOverlayProps>;
```

**Description**: An invisible `<rect>` covering the chart area that captures pointer and touch events. Converts client coordinates to SVG-local coordinates. This is the low-level building block -- it does not do hit detection, just coordinate translation. Used as the event surface for Voronoi-based hit detection, crosshair tracking, etc.

### `useVoronoiInteraction`

```typescript
// Uses: d3-delaunay (via useVoronoi)
function useVoronoiInteraction<TDatum>(config: {
  points: Array<{ x: number; y: number; datum: TDatum }>;
  width: number;
  height: number;
  /** Maximum distance in px for a point to be considered "hit" */
  maxDistance?: number;
}): {
  /** Pass to InteractionOverlay's onPointerMove */
  onPointerMove: (event: { svgX: number; svgY: number; clientX: number; clientY: number }) => void;
  /** Pass to InteractionOverlay's onPointerLeave */
  onPointerLeave: () => void;
  /** Pass to InteractionOverlay's onClick */
  onClick: (event: { svgX: number; svgY: number; clientX: number; clientY: number }) => void;
  /** Currently hovered datum (null when nothing is hovered) */
  hoveredDatum: TDatum | null;
  hoveredIndex: number | null;
  /** Position for tooltip anchoring */
  hoveredPosition: { svgX: number; svgY: number; clientX: number; clientY: number } | null;
  /** Set hover imperatively (for keyboard navigation) */
  setHoveredIndex: (index: number | null) => void;
};
```

**Description**: Combines `useVoronoi` with pointer event handlers. On pointer move, finds the nearest datum and exposes it as state. Designed to be wired to `InteractionOverlay` callbacks and then consumed by tooltip and highlight renderers.

### `useElementInteraction`

```typescript
// Uses: none
function useElementInteraction<TDatum>(): {
  /** Currently hovered datum */
  hoveredDatum: TDatum | null;
  hoveredIndex: number | null;
  hoveredPosition: { svgX: number; svgY: number; clientX: number; clientY: number } | null;
  /** Call from an element's onHover to set hover state */
  onHover: (event: ChartHoverEvent<TDatum>) => void;
  /** Call from an element's onHoverEnd to clear hover state */
  onHoverEnd: () => void;
  /** Set hover imperatively (for keyboard navigation) */
  setHoveredIndex: (index: number | null) => void;
};
```

**Description**: Manages hover state for element-level hit detection (bars, arcs, cells -- where each SVG element handles its own pointer events). Unlike Voronoi interaction, this does not need coordinates -- each element triggers hover directly.

### `useDrag`

```typescript
// Uses: none
function useDrag<TDatum>(config: {
  onDragStart?: (event: ChartDragEvent<TDatum>) => void;
  onDrag?: (event: ChartDragEvent<TDatum>) => void;
  onDragEnd?: (event: ChartDragEvent<TDatum>) => void;
}): {
  /** Bind to an element's pointer handlers to enable dragging */
  dragProps: {
    onPointerDown: (event: React.PointerEvent) => void;
  };
  isDragging: boolean;
};
```

**Description**: Provides drag interaction for chart elements (e.g., dragging reference lines, brush selection).

---

## 9. Tooltip System

### `useTooltip`

```typescript
// Uses: none
function useTooltip<TDatum>(): {
  /** Show the tooltip at a position with data */
  show: (config: {
    datum: TDatum;
    clientX: number;
    clientY: number;
    svgX?: number;
    svgY?: number;
  }) => void;
  /** Hide the tooltip */
  hide: () => void;
  /** Current tooltip state */
  isVisible: boolean;
  datum: TDatum | null;
  position: { clientX: number; clientY: number; svgX?: number; svgY?: number } | null;
};
```

**Description**: Manages tooltip visibility and positioning state. This is pure state management -- no rendering. The consumer calls `show()` with a datum and position (from interaction handlers), and `hide()` on pointer leave. The tooltip content and appearance is entirely the consumer's responsibility.

### `TooltipPortal`

```typescript
// Uses: none (React portal)
interface TooltipPortalProps {
  isVisible: boolean;
  clientX: number;
  clientY: number;
  /** Anchor point relative to cursor. Default: none (consumer decides) */
  anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  /** Offset from the anchor point in px */
  offset?: { x?: number; y?: number };
  /** Clamp to viewport edges. Default: false (no opinion) */
  clampToViewport?: boolean;
  /** Viewport padding when clamping (px) */
  viewportPadding?: number;
  /** Positioning mode */
  mode?: 'follow-cursor' | 'snap-to-point';
  /** When mode is snap-to-point, these are the SVG-local coords of the snap target */
  snapX?: number;
  snapY?: number;
  /** Reference to the chart SVG element (for coordinate conversion in snap mode) */
  svgRef?: React.RefObject<SVGSVGElement>;
  /** Pointer events on the tooltip container. Default: 'none' */
  pointerEvents?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

declare const TooltipPortal: React.FC<TooltipPortalProps>;
```

**Description**: Renders tooltip content in a React portal, absolutely positioned in the document. Handles viewport clamping (nudging the tooltip back into view if it overflows an edge) and two positioning modes: `follow-cursor` (tooltip tracks the mouse) and `snap-to-point` (tooltip anchors to a data point's SVG position). The `children` are the consumer's tooltip content -- MetricCore provides zero tooltip UI.

**Usage**:
```tsx
const { isVisible, datum, position } = useTooltip();
<TooltipPortal isVisible={isVisible} clientX={position?.clientX ?? 0} clientY={position?.clientY ?? 0} clampToViewport anchor="top-center" offset={{ y: -12 }}>
  <MyCustomTooltip data={datum} />
</TooltipPortal>
```

---

## 10. Accessibility Primitives

### `ChartDescription`

```typescript
// Uses: none
interface ChartDescriptionProps {
  /** Unique ID (referenced by aria-describedby on the SVG) */
  id: string;
  /** Short summary for screen readers, e.g. "Bar chart showing monthly revenue for 2025" */
  summary: string;
  /** Longer description of trends, e.g. "Revenue increased 12% from January to June" */
  description?: string;
}

declare const ChartDescription: React.FC<ChartDescriptionProps>;
```

**Description**: Renders a visually hidden `<div>` with chart summary text, linked to the SVG via `aria-describedby`. Screen readers announce this when the chart receives focus.

### `DataTable`

```typescript
// Uses: none
interface DataTableProps<TDatum> {
  data: TDatum[];
  columns: Array<{
    key: string;
    header: string;
    accessor: Accessor<TDatum, string | number>;
    format?: (value: any) => string;
  }>;
  /** Caption for the table (visible to screen readers) */
  caption: string;
  /** Visually hidden by default. Set false to make visible. */
  hidden?: boolean;     // default: true
  className?: string;
}

declare function DataTable<TDatum>(props: DataTableProps<TDatum>): React.ReactElement;
```

**Description**: Renders an HTML `<table>` as a screen-reader fallback for chart data. Hidden visually by default (using `clip-rect` / `sr-only` pattern) but fully accessible to assistive technology. When `hidden` is `false`, renders as a visible data table (useful for a "show data" toggle).

### `useKeyboardNavigation`

```typescript
// Uses: none
function useKeyboardNavigation<TDatum>(config: {
  data: TDatum[];
  /** Callback when focused datum changes */
  onFocusChange: (index: number | null) => void;
  /** Layout mode for arrow key behavior */
  orientation?: 'horizontal' | 'vertical' | 'grid';
  /** For grid mode: number of columns */
  columns?: number;
  /** Whether navigation wraps around */
  wrap?: boolean;    // default: false
}): {
  /** Spread onto the focusable container element */
  containerProps: {
    tabIndex: 0;
    role: 'list';
    onKeyDown: (event: React.KeyboardEvent) => void;
    'aria-activedescendant': string | undefined;
  };
  /** The currently focused index */
  focusedIndex: number | null;
  /** ID for each data element (for aria-activedescendant) */
  getItemId: (index: number) => string;
  /** Props to spread onto each data element */
  getItemProps: (index: number) => {
    id: string;
    role: 'listitem';
    'aria-label': undefined;    // consumer must supply via their own aria-label
    'aria-selected': boolean;
    tabIndex: -1;
  };
};
```

**Description**: Enables keyboard navigation through chart data points using arrow keys. Left/Right for horizontal, Up/Down for vertical, both for grid. Enter/Space trigger click. Escape clears focus. Manages `aria-activedescendant` for screen reader announcement of the focused element.

### `FocusRing`

```typescript
// Uses: none
interface FocusRingProps {
  /** The SVG element to highlight */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Shape of the focus ring */
  shape?: 'rect' | 'circle';
  /** For circle: center coords and radius instead of x/y/width/height */
  cx?: number;
  cy?: number;
  r?: number;
  /** Ring offset from the element edge */
  offset?: number;        // default: 2
  /** Ring styling (no defaults -- consumer decides) */
  ringProps?: React.SVGAttributes<SVGRectElement | SVGCircleElement>;
  /** Whether to show the ring */
  visible: boolean;
}

declare const FocusRing: React.FC<FocusRingProps>;
```

**Description**: Renders a visible focus indicator around a chart element when it is keyboard-focused. The consumer positions and styles it. Used in conjunction with `useKeyboardNavigation`.

### `useLiveRegion`

```typescript
// Uses: none
function useLiveRegion(): {
  /** Announce a message to screen readers */
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
  /** Render this once in your component tree */
  LiveRegion: React.FC;
};
```

**Description**: Manages an ARIA live region for announcing dynamic data changes to screen readers. Call `announce()` when data updates (e.g., "Revenue chart updated: 5 new data points"). The `LiveRegion` component renders the hidden `aria-live` div.

---

## 11. Utility Hooks

### `useColorScale`

```typescript
// Uses: d3-scale (scaleOrdinal or scaleSequential), d3-scale-chromatic (optional)
function useColorScale(config:
  | {
      type: 'ordinal';
      domain: string[];
      range: string[];
    }
  | {
      type: 'sequential';
      domain: [number, number];
      range: [string, string];         // two-stop gradient interpolated
    }
  | {
      type: 'sequential';
      domain: [number, number];
      interpolator: (t: number) => string;   // e.g., d3.interpolateBlues
    }
  | {
      type: 'diverging';
      domain: [number, number, number];   // [min, midpoint, max]
      range: [string, string, string];
    }
): (value: string | number) => string;
```

**Description**: Creates a color mapping function from data values to colors. Supports ordinal (categorical), sequential (continuous), and diverging scales. The consumer provides the colors -- MetricCore does not ship any color palettes.

**Uses**: `d3-scale` (`scaleOrdinal`, `scaleSequential`, `scaleDiverging`), optionally `d3-scale-chromatic` (if consumer provides chromatic interpolators)

### ~~`useFormatValue`~~ — REMOVED

**Rationale**: Value formatting is application-level logic, not a charting primitive. Consumers have their own formatting needs (Intl.NumberFormat, d3-format, custom). MetricCore should not have opinions about what formats exist or how values are displayed. Consumers pass pre-formatted strings or format functions to tick labels, tooltips, and accessibility descriptions.

### `useContainerSize` (covered in section 2)

### `usePreviousValue` (covered in section 5)

---

## 12. Full Composition Examples

### Example 1: Full Bar Chart

```tsx
import {
  useContainerSize, useChartDimensions, useBandScale, useLinearScale,
  useElementInteraction, useTooltip, useKeyboardNavigation, useLiveRegion,
  ChartSvg, Axis, GridLines, Bars, InteractionOverlay, TooltipPortal,
  ChartDescription, FocusRing, DataTable, easings,
} from '@metricui/core';

interface SalesRow { month: string; revenue: number }

function SalesBarChart({ data }: { data: SalesRow[] }) {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({ width, height, margin: { top: 20, right: 20, bottom: 40, left: 60 } });

  const xScale = useBandScale({ domain: data.map(d => d.month), range: [0, dims.innerWidth], paddingInner: 0.3 });
  const yScale = useLinearScale({ data, accessor: (d) => d.revenue, range: [dims.innerHeight, 0], nice: true, includeZero: true });

  const { hoveredDatum, hoveredIndex, hoveredPosition, onHover, onHoverEnd } = useElementInteraction<SalesRow>();
  const tooltip = useTooltip<SalesRow>();
  const { containerProps, focusedIndex, getItemId, getItemProps } = useKeyboardNavigation({
    data, onFocusChange: (i) => { /* highlight bar */ }, orientation: 'horizontal',
  });
  const { announce, LiveRegion } = useLiveRegion();

  return (
    <div ref={ref} style={{ width: '100%', height: 400 }}>
      <ChartDescription id="bar-desc" summary={`Bar chart showing monthly revenue. ${data.length} months.`} />
      <ChartSvg width={width} height={height} margin={dims.margin} aria-label="Monthly revenue" aria-describedby="bar-desc">
        <GridLines yScale={yScale} width={dims.innerWidth} height={dims.innerHeight} lineProps={{ stroke: '#f3f4f6' }} />
        <Bars<SalesRow>
          data={data} xScale={xScale} yScale={yScale} x="month" y="revenue" rx={4}
          style={(d, i) => ({
            fill: hoveredIndex === i ? '#2563eb' : '#3b82f6',
            cursor: 'pointer',
          })}
          onHover={(e) => { onHover(e); tooltip.show({ datum: e.datum, clientX: e.clientX, clientY: e.clientY }); }}
          onHoverEnd={() => { onHoverEnd(); tooltip.hide(); }}
          aria-label={(d) => `${d.month}: $${d.revenue.toLocaleString()}`}
        />
        <Axis scale={xScale} position="bottom" tickLabelProps={() => ({ fontSize: 11, fill: '#6b7280', textAnchor: 'middle' })} />
        <Axis scale={yScale} position="left" tickFormat={(v) => `$${v / 1000}k`} tickLabelProps={() => ({ fontSize: 11, fill: '#6b7280', textAnchor: 'end' })} />
        {focusedIndex !== null && (
          <FocusRing x={xScale(data[focusedIndex].month)!} y={yScale(data[focusedIndex].revenue)} width={xScale.bandwidth()} height={dims.innerHeight - yScale(data[focusedIndex].revenue)} visible ringProps={{ stroke: '#1d4ed8', strokeWidth: 2, fill: 'none' }} />
        )}
      </ChartSvg>
      <TooltipPortal isVisible={tooltip.isVisible} clientX={tooltip.position?.clientX ?? 0} clientY={tooltip.position?.clientY ?? 0} clampToViewport anchor="top-center" offset={{ y: -12 }}>
        <div style={{ background: '#1f2937', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
          <strong>{tooltip.datum?.month}</strong>: ${tooltip.datum?.revenue.toLocaleString()}
        </div>
      </TooltipPortal>
      <DataTable data={data} columns={[{ key: 'month', header: 'Month', accessor: 'month' }, { key: 'revenue', header: 'Revenue', accessor: 'revenue', format: (v) => `$${v.toLocaleString()}` }]} caption="Monthly revenue data" />
      <LiveRegion />
    </div>
  );
}
```

### Example 2: Full Line Chart

```tsx
import {
  useContainerSize, useChartDimensions, useTimeScale, useLinearScale,
  useVoronoiInteraction, useTooltip, useKeyboardNavigation,
  ChartSvg, Axis, GridLines, LinePath, Area, Points,
  InteractionOverlay, TooltipPortal, ClipPath, ChartDescription, DataTable,
  easings,
} from '@metricui/core';

interface TimeSeriesPoint { date: Date; value: number | null }

function RevenueLineChart({ data }: { data: TimeSeriesPoint[] }) {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({ width, height, margin: { top: 20, right: 20, bottom: 40, left: 60 } });

  const xScale = useTimeScale({ data, accessor: (d) => d.date, range: [0, dims.innerWidth] });
  const yScale = useLinearScale({ data, accessor: (d) => d.value ?? 0, range: [dims.innerHeight, 0], nice: true, includeZero: true });

  const validPoints = data.filter(d => d.value !== null).map(d => ({
    x: xScale(d.date), y: yScale(d.value!), datum: d,
  }));

  const voronoi = useVoronoiInteraction({ points: validPoints, width: dims.innerWidth, height: dims.innerHeight, maxDistance: 50 });
  const tooltip = useTooltip<TimeSeriesPoint>();

  return (
    <div ref={ref} style={{ width: '100%', height: 400 }}>
      <ChartDescription id="line-desc" summary={`Line chart showing revenue over time. ${data.length} data points.`} />
      <ChartSvg
        width={width} height={height} margin={dims.margin}
        aria-label="Revenue over time" aria-describedby="line-desc"
        defs={[{ type: 'linearGradient', id: 'areaFill', x1: '0', y1: '0', x2: '0', y2: '1', stops: [{ offset: '0%', color: '#3b82f6', opacity: 0.3 }, { offset: '100%', color: '#3b82f6', opacity: 0 }] }]}
      >
        <ClipPath id="line-clip" width={dims.innerWidth} height={dims.innerHeight} />
        <GridLines yScale={yScale} width={dims.innerWidth} height={dims.innerHeight} lineProps={{ stroke: '#f3f4f6' }} />
        <g clipPath="url(#line-clip)">
          <Area<TimeSeriesPoint> data={data} x={(d) => xScale(d.date)} y0={dims.innerHeight} y1={(d) => yScale(d.value ?? 0)} curve="monotoneX" defined={(d) => d.value !== null} pathProps={{ fill: 'url(#areaFill)' }} />
          <LinePath<TimeSeriesPoint> data={data} x={(d) => xScale(d.date)} y={(d) => yScale(d.value ?? 0)} curve="monotoneX" defined={(d) => d.value !== null} pathProps={{ stroke: '#3b82f6', strokeWidth: 2, fill: 'none' }} />
        </g>
        {voronoi.hoveredDatum && (
          <Points data={[voronoi.hoveredDatum]} x={(d) => xScale(d.date)} y={(d) => yScale(d.value!)} r={5} style={() => ({ fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 })} />
        )}
        <Axis scale={xScale} position="bottom" tickLabelProps={() => ({ fontSize: 11, fill: '#6b7280', textAnchor: 'middle' })} />
        <Axis scale={yScale} position="left" tickFormat={(v) => `$${v / 1000}k`} tickLabelProps={() => ({ fontSize: 11, fill: '#6b7280', textAnchor: 'end' })} />
        <InteractionOverlay width={dims.innerWidth} height={dims.innerHeight}
          onPointerMove={(e) => { voronoi.onPointerMove(e); if (voronoi.hoveredDatum) tooltip.show({ datum: voronoi.hoveredDatum, clientX: e.clientX, clientY: e.clientY }); }}
          onPointerLeave={() => { voronoi.onPointerLeave(); tooltip.hide(); }}
        />
      </ChartSvg>
      <TooltipPortal isVisible={tooltip.isVisible} clientX={tooltip.position?.clientX ?? 0} clientY={tooltip.position?.clientY ?? 0} clampToViewport anchor="top-center" offset={{ y: -12 }}>
        <div style={{ background: '#1f2937', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
          {tooltip.datum?.date.toLocaleDateString()}: ${tooltip.datum?.value?.toLocaleString()}
        </div>
      </TooltipPortal>
      <DataTable data={data} columns={[{ key: 'date', header: 'Date', accessor: (d) => d.date.toLocaleDateString() }, { key: 'value', header: 'Revenue', accessor: 'value', format: (v) => v !== null ? `$${v.toLocaleString()}` : 'N/A' }]} caption="Revenue time series data" />
    </div>
  );
}
```

### Example 3: Full Pie/Donut Chart

```tsx
import {
  useContainerSize, useChartDimensions, usePieLayout, useColorScale,
  useElementInteraction, useTooltip, useKeyboardNavigation,
  ChartSvg, Arcs, TooltipPortal, ChartDescription, DataTable, FocusRing,
  easings,
} from '@metricui/core';

interface SliceData { label: string; value: number }

function BrowserDonut({ data, colors }: { data: SliceData[]; colors: string[] }) {
  const { ref, width, height } = useContainerSize();
  const dims = useChartDimensions({ width, height, margin: 20 });

  const radius = Math.min(dims.innerWidth, dims.innerHeight) / 2;
  const arcs = usePieLayout({ data, value: 'value', padAngle: 0.02 });
  const colorScale = useColorScale({ type: 'ordinal', domain: data.map(d => d.label), range: colors });

  const { hoveredIndex, onHover, onHoverEnd } = useElementInteraction();
  const tooltip = useTooltip<SliceData>();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div ref={ref} style={{ width: '100%', height: 400 }}>
      <ChartDescription id="pie-desc" summary={`Donut chart showing browser market share. ${data.length} browsers.`} />
      <ChartSvg width={width} height={height} margin={dims.margin} aria-label="Browser market share" aria-describedby="pie-desc">
        <g transform={`translate(${dims.innerWidth / 2}, ${dims.innerHeight / 2})`}>
          <Arcs
            data={arcs} innerRadius={radius * 0.6} outerRadius={radius} cornerRadius={3}
            style={(d, i) => ({
              fill: colorScale(d.datum.label),
              opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1,
              cursor: 'pointer',
            })}
            onHover={(e) => { onHover(e); tooltip.show({ datum: e.datum.datum, clientX: e.clientX, clientY: e.clientY }); }}
            onHoverEnd={() => { onHoverEnd(); tooltip.hide(); }}
            aria-label={(d) => `${d.datum.label}: ${d.datum.value} (${Math.round(d.datum.value / total * 100)}%)`}
          />
        </g>
      </ChartSvg>
      <TooltipPortal isVisible={tooltip.isVisible} clientX={tooltip.position?.clientX ?? 0} clientY={tooltip.position?.clientY ?? 0} clampToViewport>
        <div style={{ background: '#1f2937', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
          <strong>{tooltip.datum?.label}</strong>: {tooltip.datum?.value} ({Math.round((tooltip.datum?.value ?? 0) / total * 100)}%)
        </div>
      </TooltipPortal>
      <DataTable data={data} columns={[{ key: 'label', header: 'Browser', accessor: 'label' }, { key: 'value', header: 'Users', accessor: 'value' }, { key: 'pct', header: '%', accessor: (d) => `${Math.round(d.value / total * 100)}%` }]} caption="Browser market share data" />
    </div>
  );
}
```

---

## Summary: Complete Inventory

| Category | Export | Type | D3 Module |
|----------|--------|------|-----------|
| **Types** | `Accessor`, `Margin`, `MarginInput`, `Dimensions`, `ChartDimensions` | type | -- |
| | `ScaleLinear`, `ScaleLog`, `ScaleBand`, `ScalePoint`, `ScaleTime`, `ScaleOrdinal`, `AnyScale`, `ContinuousScale` | type | -- |
| | `ChartPointerEvent`, `ChartClickEvent`, `ChartHoverEvent`, `ChartFocusEvent`, `ChartDragEvent` | type | -- |
| | `CurveType`, `EasingFunction`, `InterpolationFn` | type | -- |
| | `AxisPosition`, `DefsItem`, `LinearGradientDef`, `PatternLinesDef`, `PatternDotsDef` | type | -- |
| | `TransitionItem` | type | -- |
| **Layout Hooks** | `useChartDimensions` | hook | -- |
| | `useContainerSize` | hook | -- |
| **Scale Hooks** | `useLinearScale` | hook | d3-scale |
| | `useLogScale` | hook | d3-scale |
| | `useTimeScale` | hook | d3-scale |
| | `useBandScale` | hook | d3-scale |
| | `usePointScale` | hook | d3-scale |
| | `useOrdinalScale` | hook | d3-scale |
| **Data Processing** | `useStackedData` | hook | d3-shape |
| | `usePieLayout` | hook | d3-shape |
| | `useTreemapLayout` | hook | d3-hierarchy |
| | `useSankeyLayout` | hook | d3-sankey |
| | `useVoronoi` | hook | d3-delaunay |
| | `useGeoProjection` | hook | d3-geo |
| | `useFunnelLayout` | hook | -- |
| | `useRadarLayout` | hook | d3-scale |
| **Animation** | `easings` | object | -- |
| | `useAnimatedValue` | hook | -- |
| | `useAnimatedPath` | hook | -- |
| | `useTransitionGroup` | hook | -- |
| | `usePreviousValue` | hook | -- |
| **Structural SVG** | `ChartSvg` | component | -- |
| | `Axis` | component | -- |
| | `GridLines` | component | -- |
| | `ReferenceLine` | component | -- |
| | `ThresholdBand` | component | -- |
| | `ClipPath` | component | -- |
| | `Defs` | component | -- |
| **Geometry Renderers** | `Bars` | component | -- |
| | `LinePath` | component | d3-shape |
| | `Area` | component | d3-shape |
| | `Points` | component | -- |
| | `Arcs` | component | d3-shape |
| | `Cells` | component | -- |
| | `Links` | component | -- |
| | `TreemapRects` | component | -- |
| | `BumpPaths` | component | d3-shape |
| | `BulletRanges` | component | -- |
| | `FunnelSegments` | component | -- |
| | `RadarPolygons` | component | -- |
| | `RadarGrid` | component | -- |
| | `CalendarCells` | component | d3-time |
| | `GeoPaths` | component | d3-geo |
| **Interaction** | `InteractionOverlay` | component | -- |
| | `useVoronoiInteraction` | hook | d3-delaunay |
| | `useElementInteraction` | hook | -- |
| | `useDrag` | hook | -- |
| **Tooltip** | `useTooltip` | hook | -- |
| | `TooltipPortal` | component | -- |
| **Accessibility** | `ChartDescription` | component | -- |
| | `DataTable` | component | -- |
| | `useKeyboardNavigation` | hook | -- |
| | `FocusRing` | component | -- |
| | `useLiveRegion` | hook | -- |
| **Utilities** | `useColorScale` | hook | d3-scale |

**Total: 21 hooks, 20 components, 1 constants object, ~20 type exports.**

Every export is independently importable. No circular dependencies. Hooks work without components. Components work without hooks (pass pre-computed values). Accessibility is baked in: `ChartSvg` requires `aria-label`, geometry renderers accept `aria-label` per datum, `DataTable` and `ChartDescription` are first-class primitives, `useKeyboardNavigation` and `FocusRing` wire up keyboard access, and `useLiveRegion` handles dynamic announcements.

---

### Critical Files for Implementation

These are the files that would need to be created first, as everything else depends on them:

- `/packages/core/src/types.ts` -- All foundation types, generics, accessor pattern, event types, scale types
- `/packages/core/src/hooks/useAnimatedValue.ts` -- The rAF interpolation engine that powers all animation (useAnimatedPath and useTransitionGroup are built on top of this)
- `/packages/core/src/components/ChartSvg.tsx` -- The root SVG structural component that every chart composition starts with
- `/packages/core/src/hooks/useScales.ts` -- All six scale hooks (useLinearScale, useBandScale, useTimeScale, etc.) wrapping D3 scale constructors
- `/packages/core/src/hooks/useVoronoiInteraction.ts` -- The Voronoi-based interaction hook that combines d3-delaunay with pointer event state management (critical for line/scatter charts)