/**
 * MetricUI 0.3.0 — Interaction Types
 *
 * Shared types for cross-filtering, linked hover, and value flash.
 */

// ---------------------------------------------------------------------------
// Cross-Filter
// ---------------------------------------------------------------------------

export interface CrossFilterSelection {
  /** The field/dimension name (e.g., "browser", "region", the indexBy column) */
  field: string;
  /** The selected value */
  value: string | number;
}

export interface CrossFilterState {
  /** The current selection, or null if nothing is selected */
  selection: CrossFilterSelection | null;
  /** Set or toggle a selection */
  select: (selection: CrossFilterSelection) => void;
  /** Clear the current selection */
  clear: () => void;
  /** True when a selection is active */
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Linked Hover
// ---------------------------------------------------------------------------

export interface LinkedHoverState {
  /** The x-axis value (timestamp, label) currently being hovered */
  hoveredIndex: string | number | null;
  /** The series/category ID being hovered (from legend) */
  hoveredSeries: string | null;
  /** Which component emitted the hover */
  sourceId?: string;
  /** Set the hovered x-axis index */
  setHoveredIndex: (index: string | number | null, sourceId?: string) => void;
  /** Set the hovered series (from legend interaction) */
  setHoveredSeries: (seriesId: string | null, sourceId?: string) => void;
}

// ---------------------------------------------------------------------------
// Value Flash
// ---------------------------------------------------------------------------

export interface ValueFlashOptions {
  /** Duration of the flash animation in ms. Default: 600 */
  duration?: number;
  /** Disable flash entirely. Default: false */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Cross-filter prop shape (used by charts and tables)
// ---------------------------------------------------------------------------

export type CrossFilterProp = boolean | { field?: string };
