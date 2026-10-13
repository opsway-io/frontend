import { useTheme } from "@mui/joy";
import { FunctionComponent, useMemo } from "react";
import Chart from "react-apexcharts";
import { ReportData } from "../../../../../api/endpoints/reports";

interface PerformanceChartProps {
  data: ReportData;
  /** Monitor names by id. */
  monitorNames: Record<number, string>;
}

const PerformanceChart: FunctionComponent<PerformanceChartProps> = ({
  data,
  monitorNames,
}) => {
  const theme = useTheme();

  const options = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        toolbar: { show: false },
        animations: { enabled: false },
        background: "transparent",
        fontFamily: "inherit",
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories:
          data.performance?.map(
            (p) => monitorNames[p.MonitorID] || `Monitor ${p.MonitorID}`,
          ) || [],
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      yaxis: {
        title: {
          text: "Response Time (ms)",
          style: {
            color: theme.palette.text.secondary,
          },
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        theme.palette.info[400],
        theme.palette.warning[500],
        theme.palette.danger[500],
      ],
      tooltip: {
        theme: "dark" as const,
        y: {
          formatter: function (val: number) {
            return Math.round(val) + " ms";
          },
        },
      },
      legend: {
        labels: {
          colors: theme.palette.text.primary,
        },
      },
    }),
    [theme, data, monitorNames],
  );

  const series = useMemo(() => {
    if (!data.performance) return [];
    return [
      {
        name: "Average",
        data: data.performance.map((p) => p.AverageResponseTime),
      },
      {
        name: "P95",
        data: data.performance.map((p) => p.P95),
      },
      {
        name: "P99",
        data: data.performance.map((p) => p.P99),
      },
    ];
  }, [data]);

  if (!data.performance || data.performance.length === 0) return null;

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default PerformanceChart;
