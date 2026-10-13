import { Card, Table, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Check } from "../../../../../api/endpoints/monitors/checks";

interface CheckTLSCardProps {
  tls?: Check["tls"];
}

const CheckTLSCard: FunctionComponent<CheckTLSCardProps> = ({ tls }) => {
  const rows: [string, string | undefined][] = [
    ["Version", tls?.version],
    ["Cipher", tls?.cipher],
    ["Issuer", tls?.issuer],
    ["Subject", tls?.subject],
    ["Not before", tls?.notBefore?.toLocaleString()],
    ["Not after", tls?.notAfter?.toLocaleString()],
  ];

  return (
    <Card>
      <Typography level="title-md">TLS certificate</Typography>
      <Table
        size="sm"
        sx={{
          "--TableCell-paddingX": "0px",
          "& tr:last-of-type td": { borderBottom: "none" },
          "& td:first-of-type": { color: "text.tertiary", width: 150 },
          "& td": { wordBreak: "break-word" },
        }}
      >
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default CheckTLSCard;
