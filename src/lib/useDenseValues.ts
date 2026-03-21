import { useMemo } from "react";
import { useMetricConfig } from "./MetricProvider";

/** Numeric dense values for chart height/margins (Nivo requires JS numbers). */
export interface DenseValues {
  chartHeight: number;
  marginTop: number;
  marginBottom: number;
  marginBottomWithLabel: number;
  gridGap: number;
}

const NORMAL: DenseValues = {
  chartHeight: 300,
  marginTop: 16,
  marginBottom: 32,
  marginBottomWithLabel: 48,
  gridGap: 16,
};

const DENSE: DenseValues = {
  chartHeight: 200,
  marginTop: 6,
  marginBottom: 18,
  marginBottomWithLabel: 32,
  gridGap: 8,
};

/** Returns pre-computed numeric dense values from config.dense. */
export function useDenseValues(): DenseValues {
  const config = useMetricConfig();
  return useMemo(() => (config.dense ? DENSE : NORMAL), [config.dense]);
}
