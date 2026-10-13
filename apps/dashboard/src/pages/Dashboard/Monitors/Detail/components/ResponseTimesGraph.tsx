import {
  Box,
  Button,
  Stack,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/joy";
import moment from "moment";
import { FunctionComponent, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useMonitorMetrics } from "../../../../../hooks/monitors.query";
import { buildResponseTimeChartOptions } from "../graph/responseTimeChartOptions";
import {
  buildResponseTimeSeries,
  ChartMode,
} from "../graph/responseTimeSeries";

interface ResponseTimesGraphProps {
  monitorId: number;
  interval: number;
  start?: string;
  end?: string;
}

const ResponseTimesGraph: FunctionComponent<ResponseTimesGraphProps> = (
  props,
) => {
  const theme = useTheme();
  const [chartMode, setChartMode] = useState<ChartMode>("breakdown");

  const { data, isPending } = useMonitorMetrics(
    props.monitorId,
    props.start,
    props.end,
  );

  const startMs = props.start ? moment(props.start).valueOf() : undefined;
  const endMs = props.end ? moment(props.end).valueOf() : undefined;

  const hasAnomalyData = !!data?.metrics?.some((m) => m.name === "Expected");

  const options = useMemo(
    () =>
      buildResponseTimeChartOptions({
        palette: theme.palette,
        mode: chartMode,
        interval: props.interval,
        startMs,
        endMs,
      }),
    [theme.palette, chartMode, props.interval, startMs, endMs],
  );

  const series = useMemo(
    () => buildResponseTimeSeries(data?.metrics, chartMode),
    [data?.metrics, chartMode],
  );

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Typography level="title-sm">Performance Graph</Typography>
        <ToggleButtonGroup
          value={chartMode}
          onChange={(_, value) => value && setChartMode(value as ChartMode)}
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{
            '& [aria-pressed="true"]': {
              bgcolor: "background.level3",
              color: "text.primary",
            },
          }}
        >
          <Button value="breakdown">Timing Breakdown</Button>
          <Button value="anomaly" disabled={!hasAnomalyData && !isPending}>
            Anomaly & Forecast
          </Button>
        </ToggleButtonGroup>
      </Stack>
      <Chart
        key={chartMode}
        options={options}
        series={series}
        height={400}
        type="line"
      />
    </Box>
  );
};

export default ResponseTimesGraph;
