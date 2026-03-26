/**
 * Shared chart types used across AreaChart, BarChart, and DonutChart.
 */

export interface LegendConfig {
  position?: "top" | "bottom";
  toggleable?: boolean;
}

export interface ReferenceLine {
  axis: "x" | "y";
  value: number | string;
  label?: string;
  color?: string;
  style?: "solid" | "dashed";
}

export interface ThresholdBand {
  from: number;
  to: number;
  color?: string;
  label?: string;
  opacity?: number;
}

// ---------------------------------------------------------------------------
// Click event payloads
// ---------------------------------------------------------------------------

/** Payload for AreaChart/LineChart `onPointClick` */
export interface PointClickEvent {
  id: string;
  value: number;
  label: string;
  seriesId: string;
  x: string | number;
  y: number;
}

/** Payload for BarChart `onBarClick` */
export interface BarClickEvent {
  id: string | number;
  value: number | null;
  label: string;
  key: string;
  indexValue: string | number;
}

/** Payload for DonutChart `onSliceClick` */
export interface SliceClickEvent {
  id: string;
  value: number;
  label: string;
  percentage: number;
}

/** Payload for HeatMap `onCellClick` */
export interface CellClickEvent {
  id: string;
  value: number | null;
  label: string;
  seriesId: string;
  x: string;
}

/** Payload for ScatterPlot `onNodeClick` */
export interface ScatterNodeClickEvent {
  id: string;
  serieId: string;
  x: number | string | Date;
  y: number | string | Date;
  label: string;
}
