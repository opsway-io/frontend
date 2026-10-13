import { Card } from "@mui/joy";
import { FunctionComponent } from "react";
import { ReportData } from "../../../../../api/endpoints/reports";
import IncidentChart from "./IncidentChart";
import MonitorCell from "./MonitorCell";
import ReportSection from "./ReportSection";
import ReportTable from "./ReportTable";

interface IncidentSectionProps {
  data: ReportData;
  rows: NonNullable<ReportData["incident"]>;
  monitorNames: Record<number, string>;
  monitorName: (monitorId: number) => string;
}

const IncidentSection: FunctionComponent<IncidentSectionProps> = ({
  data,
  rows,
  monitorNames,
  monitorName,
}) => (
  <ReportSection title="Incidents Report">
    <Card>
      <IncidentChart data={data} monitorNames={monitorNames} />
    </Card>
    <ReportTable
      ariaLabel="incident table"
      columns={[
        { label: "Monitor" },
        { label: "Incident Count", align: "right" },
      ]}
    >
      {rows.map((row) => (
        <tr key={row.monitorId}>
          <td>
            <MonitorCell name={monitorName(row.monitorId)} id={row.monitorId} />
          </td>
          <td className="align-right">{row.count}</td>
        </tr>
      ))}
    </ReportTable>
  </ReportSection>
);

export default IncidentSection;
