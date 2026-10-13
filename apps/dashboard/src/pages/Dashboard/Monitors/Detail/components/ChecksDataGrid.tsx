import { Box } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../../../../components/DataGrid/DataGrid";
import { useMonitorChecks } from "../../../../../hooks/monitors.query";
import PaginationControls from "../../components/PaginationControls";
import checksColumns from "./checksColumns";

const CHECKS_PER_PAGE = 5;

interface ChecksDataGridProps {
  monitorId: number;
}

const ChecksDataGrid: FunctionComponent<ChecksDataGridProps> = ({
  monitorId,
}) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const { data, isPending } = useMonitorChecks(
    monitorId,
    offset,
    CHECKS_PER_PAGE,
  );

  return (
    <>
      <DataGrid
        columns={checksColumns}
        rows={data?.checks || []}
        rowHeight={44}
        pageSize={0}
        loading={isPending}
        onRowClick={(row) =>
          navigate(`/monitors/${monitorId}/checks/${row.id}`)
        }
      />
      <Box sx={{ pt: 1.5 }}>
        <PaginationControls
          page={Math.floor(offset / CHECKS_PER_PAGE)}
          hasNext={(data?.checks.length || 0) >= CHECKS_PER_PAGE}
          onPrevious={() => setOffset(offset - CHECKS_PER_PAGE)}
          onNext={() => setOffset(offset + CHECKS_PER_PAGE)}
        />
      </Box>
    </>
  );
};

export default ChecksDataGrid;
