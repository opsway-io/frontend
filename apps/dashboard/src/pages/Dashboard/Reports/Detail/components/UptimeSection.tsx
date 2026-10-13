import { FunctionComponent } from "react";
import { ReportData } from "../../../../../api/endpoints/reports";
import MonitorCell from "./MonitorCell";
import ReportSection from "./ReportSection";
import ReportTable from "./ReportTable";

interface UptimeSectionProps {
  rows: NonNullable<ReportData["uptime"]>;
  monitorName: (monitorId: number) => string;
}

const UptimeSection: FunctionComponent<UptimeSectionProps> = ({
  rows,
  monitorName,
}) => (
  <ReportSection title="Uptime Report">
    <ReportTable
      ariaLabel="uptime table"
      columns={[
        { label: "Monitor" },
        { label: "URL" },
        { label: "Date / Month" },
        { label: "Uptime %", align: "right" },
      ]}
    >
      {rows.map((row) => (
        <tr key={`${row.MonitorID}-${row.Date}`}>
          <td>
            <MonitorCell name={monitorName(row.MonitorID)} id={row.MonitorID} />
          </td>
          <td>{row.Url}</td>
          <td>{row.Date}</td>
          <td className="align-right" style={{ fontWeight: 500 }}>
            {row.UptimePercentage.toFixed(2)}%
          </td>
        </tr>
      ))}
    </ReportTable>
  </ReportSection>
);

export default UptimeSection;
