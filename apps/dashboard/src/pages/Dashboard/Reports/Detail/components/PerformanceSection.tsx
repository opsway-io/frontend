import { Card } from "@mui/joy";
import { FunctionComponent } from "react";
import { ReportData } from "../../../../../api/endpoints/reports";
import MonitorCell from "./MonitorCell";
import PerformanceChart from "./PerformanceChart";
import ReportSection from "./ReportSection";
import ReportTable from "./ReportTable";

interface PerformanceSectionProps {
  data: ReportData;
  rows: NonNullable<ReportData["performance"]>;
  monitorNames: Record<number, string>;
  monitorName: (monitorId: number) => string;
}

const PerformanceSection: FunctionComponent<PerformanceSectionProps> = ({
  data,
  rows,
  monitorNames,
  monitorName,
}) => (
  <ReportSection title="Performance Report">
    <Card>
      <PerformanceChart data={data} monitorNames={monitorNames} />
    </Card>
    <ReportTable
      ariaLabel="performance table"
      columns={[
        { label: "Monitor" },
        { label: "Avg. Response Time", align: "right" },
        { label: "P95", align: "right" },
        { label: "P99", align: "right" },
      ]}
    >
      {rows.map((row) => (
        <tr key={row.MonitorID}>
          <td>
            <MonitorCell name={monitorName(row.MonitorID)} id={row.MonitorID} />
          </td>
          <td className="align-right">
            {row.AverageResponseTime.toFixed(0)} ms
          </td>
          <td className="align-right">{row.P95.toFixed(0)} ms</td>
          <td className="align-right">{row.P99.toFixed(0)} ms</td>
        </tr>
      ))}
    </ReportTable>
  </ReportSection>
);

export default PerformanceSection;
