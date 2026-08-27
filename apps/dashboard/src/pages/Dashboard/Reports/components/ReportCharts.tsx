import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material";
import { ReportData } from "../../../../api/endpoints/reports";

interface ReportChartsProps {
  data: ReportData;
  monitorsMap: Record<number, string>;
}

export const PerformanceChart = ({ data, monitorsMap }: ReportChartsProps) => {
  const theme = useTheme();

  const options = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        toolbar: { show: false },
        animations: { enabled: false },
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
            (p) => monitorsMap[p.monitorId] || `Monitor ${p.monitorId}`
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
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.error.main,
      ],
      tooltip: {
        theme: "dark",
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
    [theme, data, monitorsMap]
  );

  const series = useMemo(() => {
    if (!data.performance) return [];
    return [
      {
        name: "Average",
        data: data.performance.map((p) => p.averageResponseTime),
      },
      {
        name: "P95",
        data: data.performance.map((p) => p.p95),
      },
      {
        name: "P99",
        data: data.performance.map((p) => p.p99),
      },
    ];
  }, [data]);

  if (!data.performance || data.performance.length === 0) return null;

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export const IncidentChart = ({ data, monitorsMap }: ReportChartsProps) => {
  const theme = useTheme();

  const options = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        toolbar: { show: false },
        animations: { enabled: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories:
          data.incident?.map(
            (i) => monitorsMap[i.monitorId] || `Monitor ${i.monitorId}`
          ) || [],
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      colors: [theme.palette.error.main],
      tooltip: {
        theme: "dark",
      },
    }),
    [theme, data, monitorsMap]
  );

  const series = useMemo(() => {
    if (!data.incident) return [];
    return [
      {
        name: "Incidents",
        data: data.incident.map((i) => i.count),
      },
    ];
  }, [data]);

  if (!data.incident || data.incident.length === 0) return null;

  return <Chart options={options} series={series} type="bar" height={350} />;
};
