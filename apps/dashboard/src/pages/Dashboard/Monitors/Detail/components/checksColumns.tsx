import { Chip, Typography } from "@mui/joy";
import { IoLockClosed, IoWarning } from "react-icons/io5";
import { Check } from "../../../../../api/endpoints/monitors/checks";
import { GridColDef } from "../../../../../components/DataGrid/DataGrid";
import { isCertValid } from "../../../../../utilities/tls";
import { formatNanosecondsAsMilliseconds } from "../../models/checkPhases";
import CheckPhasesBar from "./CheckPhasesBar";

/** Column definitions for the monitor checks grid. */
const checksColumns: GridColDef<Check>[] = [
  {
    field: "statusCode",
    headerName: "Status",
    width: 72,
    align: "left",
    headerAlign: "left",
    sortable: false,
    renderCell: (col) => (
      <Chip variant="soft" color="success">
        {col.value}
      </Chip>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    width: 100,
    align: "left",
    headerAlign: "left",
    sortable: false,
  },
  {
    field: "tls",
    headerName: "TLS",
    width: 64,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (col) =>
      isCertValid(col.row.tls.notAfter) ? (
        <Chip variant="soft" color="success" aria-label="Valid certificate">
          <IoLockClosed style={{ verticalAlign: "middle" }} />
        </Chip>
      ) : (
        <Chip variant="soft" color="danger" aria-label="Invalid certificate">
          <IoWarning style={{ verticalAlign: "middle" }} />
        </Chip>
      ),
  },
  {
    field: "anomaly",
    headerName: "Anomaly",
    width: 110,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (col) =>
      col.row.anomaly ? (
        <Chip color="danger" variant="soft">
          Anomaly
        </Chip>
      ) : (
        <Chip color="success" variant="outlined">
          Normal
        </Chip>
      ),
  },
  {
    field: "timing",
    headerName: "Time",
    width: 150,
    align: "left",
    headerAlign: "left",
    sortable: false,
    renderCell: (col) => (
      <Typography level="body-sm" fontFamily="code">
        {formatNanosecondsAsMilliseconds(col.row.timing.total)}
      </Typography>
    ),
  },
  {
    field: "phases",
    headerName: "Phases",
    align: "left",
    headerAlign: "left",
    flex: 1,
    sortable: false,
    renderCell: (col) => <CheckPhasesBar check={col.row} />,
  },
  {
    field: "createdAt",
    headerName: "Timestamp",
    width: 300,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (col) => (
      <Typography level="body-sm" textColor="text.secondary">
        {new Date(col.value).toLocaleString()}
      </Typography>
    ),
  },
];

export default checksColumns;
