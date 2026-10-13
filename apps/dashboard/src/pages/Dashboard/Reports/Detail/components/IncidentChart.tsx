import { useTheme } from "@mui/joy";
import { FunctionComponent, useMemo } from "react";
import Chart from "react-apexcharts";
import { ReportData } from "../../../../../api/endpoints/reports";

interface IncidentChartProps {
  data: ReportData;
  /** Monitor names by id. */
  monitorNames: Record<number, string>;
}

const IncidentChart: FunctionComponent<IncidentChartProps> = ({
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
            (i) => monitorNames[i.monitorId] || `Monitor ${i.monitorId}`,
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
      colors: [theme.palette.danger[500]],
      tooltip: {
        theme: "dark" as const,
      },
    }),
    [theme, data, monitorNames],
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

export default IncidentChart;
