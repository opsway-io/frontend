import { FunctionComponent, useMemo, useState } from "react";
import {
  Box,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMonitorMetrics } from "../../../../../hooks/monitors.query";
import moment from "moment";

interface ResponseTimesGraphProps {
  monitorId: number;
  interval: number;
}

const ResponseTimesGraph: FunctionComponent<ResponseTimesGraphProps> = (
  props,
) => {
  const theme = useTheme();
  const [chartMode, setChartMode] = useState<"breakdown" | "anomaly">(
    "breakdown",
  );

  const { data, isLoading } = useMonitorMetrics(props.monitorId);

  // Check if anomalies/predictions are present in data
  const hasAnomalyData = useMemo(() => {
    return !!data?.metrics?.some((m) => m.name === "Expected");
  }, [data]);

  const options: ApexOptions = useMemo(() => {
    const isAnomalyMode = chartMode === "anomaly";
    return {
      markers: {
        size: 0,
        hover: {
          size: 4,
        },
        colors: isAnomalyMode
        ? [
            theme.palette.text.secondary,
            theme.palette.primary.main,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.error.main,
          ]
        : [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.info.main,
          ],
      },
      chart: {
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        zoom: {
          enabled: true,
        },
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
        gradient: isAnomalyMode ? undefined : {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      colors: isAnomalyMode
        ? [
            theme.palette.text.secondary, // Expected: Gray
            theme.palette.primary.main, // Actual: Blue
            theme.palette.text.disabled, // Confidence Upper Bound
            theme.palette.text.disabled, // Confidence Lower Bound
            theme.palette.error.main, // Anomaly: Red
          ]
        : [
            "#008FFB", // DNS - Blue
            "#00E396", // TCP - Green
            "#FEB019", // TLS - Yellow
            "#FF4560", // Processing - Red
            "#775DD0", // Transfer - Purple
          ],
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        },
      },
      xaxis: {
        axisBorder: {
          show: true,
          color: theme.palette.divider,
        },
        range: isAnomalyMode ? props.interval + 86400000 : props.interval,
        type: "datetime",
        tickAmount: 10,
        labels: {
          formatter: (value) => {
            if (props.interval > 86400000 * 3) {
              return moment(value).format("MMM DD");
            }
            return moment(value).format("MMM DD, HH:mm");
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      yaxis: {
        type: "numeric",
        labels: {
          formatter: (value) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(2)} s`;
            }
            return `${Math.round(value)} ms`;
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: (value: any) => {
            if (value == null) return "N/A";
            if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
            return `${Math.round(value)} ms`;
          }
        }
      },
      legend: {
        labels: {
          colors: "#ddd",
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
    };
  }, [theme, props.interval, chartMode]);

  const metrics = useMemo(() => {
    if (!data || !data.metrics) return [];

    if (chartMode === "breakdown") {
      // Show first 5 series (standard timing phases breakdown)
      return data.metrics
        .filter((m) =>
          ["DNS", "TCP", "TLS", "Processing", "Transfer"].includes(m.name),
        )
        .map((metric) => ({
          name: metric.name,
          type: "area" as const,
          data: metric.timing.map((t) => ({
            x: moment(t.start).valueOf(),
            y: t.timing,
          })),
        }));
    } else {
      // Show Anomaly Detection series
      const dns = data.metrics.find((m) => m.name === "DNS")?.timing || [];
      const tcp = data.metrics.find((m) => m.name === "TCP")?.timing || [];
      const tls = data.metrics.find((m) => m.name === "TLS")?.timing || [];
      const processing =
        data.metrics.find((m) => m.name === "Processing")?.timing || [];
      const transfer =
        data.metrics.find((m) => m.name === "Transfer")?.timing || [];

      const expected =
        data.metrics.find((m) => m.name === "Expected")?.timing || [];
      const upper =
        data.metrics.find((m) => m.name === "Upper Limit")?.timing || [];
      const lower =
        data.metrics.find((m) => m.name === "Lower Limit")?.timing || [];
      const anomaly =
        data.metrics.find((m) => m.name === "Anomaly")?.timing || [];

      // Parse dates using local timezone context to properly align ClickHouse local dates with Go's UTC forecast dates
      // Map over `expected` for ALL arrays to guarantee perfectly identical x values

      const expectedData = expected.map((e) => ({
        x: moment(e.start).valueOf(),
        y: e.timing,
      }));

      const actualData = expected.map((e, idx) => {
        const d = dns[idx];
        if (d) {
          const val =
            d.timing +
            (tcp[idx]?.timing || 0) +
            (tls[idx]?.timing || 0) +
            (processing[idx]?.timing || 0) +
            (transfer[idx]?.timing || 0);
          return {
            x: moment(e.start).valueOf(),
            y: val,
          };
        }
        return {
          x: moment(e.start).valueOf(),
          y: null,
        };
      });

      const upperData = expected.map((e, idx) => ({
        x: moment(e.start).valueOf(),
        y: upper[idx] ? upper[idx].timing : null,
      }));

      const lowerData = expected.map((e, idx) => ({
        x: moment(e.start).valueOf(),
        y: lower[idx] ? lower[idx].timing : null,
      }));

      const anomalyData = expected.map((e, idx) => {
        const a = anomaly[idx];
        if (a) {
          return {
            x: moment(e.start).valueOf(),
            y: a.timing > 0 ? a.timing : null,
          };
        }
        return {
          x: moment(e.start).valueOf(),
          y: null,
        };
      });

      return [
        {
          name: "Expected Time (Profile)",
          type: "line" as const,
          data: expectedData,
        },
        {
          name: "Actual Response Time",
          type: "line" as const,
          data: actualData,
        },
        {
          name: "Confidence Upper Bound",
          type: "line" as const,
          data: upperData,
        },
        {
          name: "Confidence Lower Bound",
          type: "line" as const,
          data: lowerData,
        },
        {
          name: "Anomaly Detected",
          type: "scatter" as const,
          data: anomalyData,
        },
      ];
    }
  }, [data, chartMode]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Performance Graph
        </Typography>
        <ToggleButtonGroup
          value={chartMode}
          exclusive
          onChange={(_, value) => value && setChartMode(value)}
          size="small"
        >
          <ToggleButton value="breakdown">Timing Breakdown</ToggleButton>
          <ToggleButton
            value="anomaly"
            disabled={!hasAnomalyData && !isLoading}
          >
            Anomaly & Forecast
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Chart key={chartMode} options={options} series={metrics} height={400} type="line" />
    </Box>
  );
};

export default ResponseTimesGraph;
