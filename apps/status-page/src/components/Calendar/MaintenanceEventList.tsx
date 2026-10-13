import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { PublicMaintenance } from "../../api";
import { MaintenanceFilter } from "./calendarUtils";

interface MaintenanceEventListProps {
  title: string;
  events: PublicMaintenance[];
  showFilter: boolean;
  filter: MaintenanceFilter;
  onFilterChange: (filter: MaintenanceFilter) => void;
  page: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

/** Paginated table of maintenance windows shown below the calendar. */
const MaintenanceEventList: FunctionComponent<MaintenanceEventListProps> = ({
  title,
  events,
  showFilter,
  filter,
  onFilterChange,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const pageEvents = events.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ mt: 3, px: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h6">{title}</Typography>
        {showFilter && (
          <FormControl size="small">
            <Select
              value={filter}
              onChange={(e) =>
                onFilterChange(e.target.value as MaintenanceFilter)
              }
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              }}
            >
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="past">Past</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        )}
      </Stack>
      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }} />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "text.secondary",
                fontWeight: "600",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              Title
            </TableCell>
            <TableCell
              sx={{
                color: "text.secondary",
                fontWeight: "600",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              Start Time
            </TableCell>
            <TableCell
              sx={{
                color: "text.secondary",
                fontWeight: "600",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              End Time
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageEvents.length > 0 ? (
            pageEvents.map((event) => (
              <TableRow
                key={event.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <Typography variant="body2" fontWeight="500">
                    {event.title}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {new Date(event.startAt).toLocaleString()}
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {new Date(event.endAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                sx={{ py: 4, borderColor: "rgba(255,255,255,0.05)" }}
              >
                <Typography color="text.secondary">
                  No maintenance events found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {events.length > 0 && (
        <TablePagination
          component="div"
          count={events.length}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        />
      )}
    </Box>
  );
};

export default MaintenanceEventList;
