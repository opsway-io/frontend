import { FunctionComponent, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
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

  const { data, error, isLoading } = useMonitorMetrics(props.monitorId);

  const options: ApexOptions = useMemo(() => {
    return {
      markers: {
        size: 0,
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
        stacked: true,
      },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      fill: {
        type: "solid",
      },
      colors: [
        theme.palette.info.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        "#9b59b6", // TODO: use theme color
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
        range: props.interval,
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
  }, [theme, props.interval]);

  const metrics = useMemo(() => {
    return data
      ? data?.metrics?.map((metric) => {
          return {
            name: metric?.name,
            data: metric?.timing?.map((time) => {
              return {
                x: time.start,
                y: time.timing,
              };
            }),
          };
        })
      : [];
  }, [data]);

  return (
    <Box sx={{}}>
      <Chart options={options} series={metrics} height={400} type="area" />
    </Box>
  );
};

export default ResponseTimesGraph;
