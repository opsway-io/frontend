import moment from "moment";
import { getMonitorMetricsResponse } from "../../../../../api/endpoints/monitors/metrics";

type ChartMode = "breakdown" | "anomaly";
type Metric = getMonitorMetricsResponse["metrics"][number];

interface ChartSeries {
  name: string;
  type: "area" | "line" | "scatter";
  data: { x: number; y: number | null }[];
}

const breakdownMetricNames = [
  "DNS",
  "TCP",
  "TLS",
  "Processing",
  "Transfer",
  "Overhead",
];

const findTiming = (metrics: Metric[], name: string) =>
  metrics.find((m) => m.name === name)?.timing || [];

const buildBreakdownSeries = (metrics: Metric[]): ChartSeries[] =>
  metrics
    .filter((metric) => breakdownMetricNames.includes(metric.name))
    .map((metric) => ({
      name: metric.name,
      type: "area",
      data: metric.timing.map((t) => ({
        x: moment(t.start).valueOf(),
        y: t.timing,
      })),
    }));

/**
 * Anomaly series are aligned on the x values of the "Expected" forecast so
 * the local ClickHouse timestamps line up with the UTC forecast timestamps.
 */
const buildAnomalySeries = (metrics: Metric[]): ChartSeries[] => {
  const expected = findTiming(metrics, "Expected");
  const total = findTiming(metrics, "Total");
  const upper = findTiming(metrics, "Upper Limit");
  const lower = findTiming(metrics, "Lower Limit");
  const anomaly = findTiming(metrics, "Anomaly");

  const alignTo = (getY: (index: number) => number | null) =>
    expected.map((e, index) => ({
      x: moment(e.start).valueOf(),
      y: getY(index),
    }));

  return [
    {
      name: "Expected Time (Profile)",
      type: "line",
      data: alignTo((i) => expected[i].timing),
    },
    {
      name: "Actual Response Time",
      type: "line",
      data: alignTo((i) => total[i]?.timing ?? null),
    },
    {
      name: "Confidence Upper Bound",
      type: "line",
      data: alignTo((i) => upper[i]?.timing ?? null),
    },
    {
      name: "Confidence Lower Bound",
      type: "line",
      data: alignTo((i) => lower[i]?.timing ?? null),
    },
    {
      name: "Anomaly Detected",
      type: "scatter",
      // -1 marks "no anomaly" for a data point.
      data: alignTo((i) =>
        anomaly[i] && anomaly[i].timing !== -1 ? anomaly[i].timing : null,
      ),
    },
  ];
};

const buildResponseTimeSeries = (
  metrics: Metric[] | undefined,
  mode: ChartMode,
): ChartSeries[] => {
  if (!metrics) {
    return [];
  }

  return mode === "breakdown"
    ? buildBreakdownSeries(metrics)
    : buildAnomalySeries(metrics);
};

export { buildResponseTimeSeries };
export type { ChartMode };
