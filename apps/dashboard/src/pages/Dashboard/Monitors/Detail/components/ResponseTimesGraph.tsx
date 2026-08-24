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
        size: isAnomalyMode ? [0, 0, 0, 0, 6] : 0,
        hover: {
          size: 4,
        },
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
        width: isAnomalyMode ? [3, 2, 1.5, 1.5, 0] : 4,
        dashArray: isAnomalyMode ? [0, 0, 5, 5, 0] : 0,
      },
      fill: {
        type: "solid",
        opacity: isAnomalyMode ? [1, 0.8, 0.1, 0.1, 1] : 0.6,
      },
      colors: isAnomalyMode
        ? [
            theme.palette.primary.main, // Actual: Blue
            theme.palette.success.main, // Expected: Green
            theme.palette.text.secondary, // Upper Limit: Grey
            theme.palette.text.secondary, // Lower Limit: Grey
            theme.palette.error.main, // Anomaly: Red
          ]
        : [
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
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
            return moment(value).format("DD/MM-HH:mm");
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
            return `${value} ms`;
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
            x: new Date(t.start).getTime(),
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

      // Actual response time is the sum of all phases
      const actualData = dns.map((t, idx) => {
        const val =
          t.timing +
          (tcp[idx]?.timing || 0) +
          (tls[idx]?.timing || 0) +
          (processing[idx]?.timing || 0) +
          (transfer[idx]?.timing || 0);
        return {
          x: new Date(t.start).getTime(),
          y: val,
        };
      });

      const expectedData = expected.map((t) => ({
        x: new Date(t.start).getTime(),
        y: t.timing,
      }));

      const upperData = upper.map((t) => ({
        x: new Date(t.start).getTime(),
        y: t.timing,
      }));

      const lowerData = lower.map((t) => ({
        x: new Date(t.start).getTime(),
        y: t.timing,
      }));

      const anomalyData = anomaly.map((t) => {
        return {
          x: new Date(t.start).getTime(),
          y: t.timing > 0 ? t.timing : null, // null hides non-anomaly data points
        };
      });

      return [
        {
          name: "Actual Response Time",
          type: "line" as const,
          data: actualData,
        },
        {
          name: "Expected Time (Profile)",
          type: "line" as const,
          data: expectedData,
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
      <Chart options={options} series={metrics} height={400} type="line" />
    </Box>
  );
};

export default ResponseTimesGraph;
