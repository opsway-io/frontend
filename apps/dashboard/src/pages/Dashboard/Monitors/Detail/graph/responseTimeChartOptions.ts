import { Theme } from "@mui/joy";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import { ChartMode } from "./responseTimeSeries";

const DAY_MS = 86400000;

interface ChartOptionsInput {
  palette: Theme["palette"];
  mode: ChartMode;
  /** Visible range in ms when no custom range is set. */
  interval: number;
  startMs?: number;
  endMs?: number;
}

const formatDuration = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;

const buildResponseTimeChartOptions = ({
  palette,
  mode,
  interval,
  startMs,
  endMs,
}: ChartOptionsInput): ApexOptions => {
  const isAnomalyMode = mode === "anomaly";
  const isCustomRange = startMs != null && endMs != null;

  // Resolved (non CSS-var) colors, ApexCharts can't read CSS variables.
  const anomalyColors = [
    palette.text.secondary, // Expected
    palette.info[400], // Actual
    palette.text.tertiary, // Confidence upper bound
    palette.text.tertiary, // Confidence lower bound
    palette.danger[500], // Anomaly
  ];
  // Matches the phase legend and phases bar in the checks table.
  const breakdownColors = [
    palette.info[400], // DNS
    palette.success[500], // TCP
    palette.warning[500], // TLS
    palette.semantic.reports, // Processing
    palette.danger[500], // Transfer
    palette.neutral[500], // Overhead
  ];
  const colors = isAnomalyMode ? anomalyColors : breakdownColors;

  return {
    markers: { size: 0, hover: { size: 4 }, colors },
    chart: {
      background: "transparent",
      foreColor: palette.text.secondary,
      fontFamily: "inherit",
      toolbar: { show: false },
      animations: { enabled: false },
      zoom: { enabled: true },
      stacked: !isAnomalyMode,
    },
    stroke: {
      curve: "smooth",
      width: isAnomalyMode ? [2, 3, 1, 1, 0] : 2,
      dashArray: isAnomalyMode ? [5, 0, 5, 5, 0] : 0,
    },
    fill: {
      type: isAnomalyMode ? "solid" : "gradient",
      opacity: isAnomalyMode ? [1, 1, 1, 1, 1] : 0.8,
      gradient: isAnomalyMode
        ? undefined
        : {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
    },
    colors,
    grid: {
      borderColor: palette.divider,
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    xaxis: {
      axisBorder: { show: true, color: palette.divider },
      // The anomaly forecast reaches one day into the future.
      range: isCustomRange
        ? undefined
        : isAnomalyMode
          ? interval + DAY_MS
          : interval,
      min: startMs,
      max: endMs,
      type: "datetime",
      tickAmount: 10,
      labels: {
        formatter: (value) =>
          moment(value).format(
            interval > DAY_MS * 3 ? "MMM DD" : "MMM DD, HH:mm",
          ),
        style: { colors: palette.text.secondary },
      },
      tooltip: {
        enabled: true,
        formatter: (value: string) =>
          moment(value).format("DD MMM YYYY, HH:mm:ss"),
      },
    },
    yaxis: {
      labels: {
        formatter: formatDuration,
        style: { colors: palette.text.secondary },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      theme: "dark",
      shared: true,
      intersect: false,
      x: { format: "dd MMM yyyy, HH:mm:ss" },
      y: {
        formatter: (value?: number | null) =>
          value == null ? "N/A" : formatDuration(value),
      },
    },
    legend: {
      labels: { colors: palette.text.secondary },
      onItemHover: { highlightDataSeries: false },
    },
  };
};

export { buildResponseTimeChartOptions };
