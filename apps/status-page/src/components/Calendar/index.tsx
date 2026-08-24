import {
  Table,
  Tooltip,
  Typography,
  Box,
  TablePagination,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { FunctionComponent, useEffect, useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { PublicMaintenance } from "../../api";

interface CalendarProps {
  maintenanceEvents?: PublicMaintenance[];
}

const Calendar: FunctionComponent<CalendarProps> = ({
  maintenanceEvents = [],
}) => {
  const [monthTable, setMonthTable] = useState<(number | undefined)[][]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const generateCalendar = (y: number, m: number) => {
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const firstDayWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const firstDayDate = firstDay.getDate();
    const lastDayDate = lastDay.getDate();

    const weeks: (number | undefined)[][] = [[], [], [], [], [], []];

    let currentWeek = 0;

    for (let i = 0; i < firstDayWeekday; i++) {
      weeks[currentWeek].push(undefined);
    }

    for (let i = firstDayDate; i <= lastDayDate; i++) {
      weeks[currentWeek].push(i);
      if (weeks[currentWeek].length === 7) {
        currentWeek++;
      }
    }

    while (
      weeks[currentWeek] &&
      weeks[currentWeek].length < 7 &&
      weeks[currentWeek].length > 0
    ) {
      weeks[currentWeek].push(undefined);
    }

    // Remove completely empty trailing weeks
    const validWeeks = weeks.filter((week) => week.length > 0);
    setMonthTable(validWeeks);
  };

  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const getMaintenanceForDay = (day: number) => {
    const checkDate = new Date(year, month, day);
    // Set time to middle of day to avoid timezone boundaries
    checkDate.setHours(12, 0, 0, 0);

    return maintenanceEvents.filter((m) => {
      const start = new Date(m.startAt);
      const end = new Date(m.endAt);

      // Zero out times for date comparison
      const startDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        0,
        0,
        0,
        0,
      );
      const endDate = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999,
      );

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const filteredEvents = useMemo(() => {
    let events = maintenanceEvents;
    if (selectedDate) {
      events = getMaintenanceForDay(selectedDate);
    }

    // Sort by startAt descending
    return [...events].sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
    );
  }, [maintenanceEvents, selectedDate, year, month]);

  const paginatedEvents = useMemo(() => {
    return filteredEvents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredEvents, page, rowsPerPage]);

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <IconButton onClick={handlePrevMonth} sx={{ color: "text.secondary" }}>
          <FaChevronLeft size={16} />
        </IconButton>
        <Typography variant="subtitle1" fontWeight="600">
          {monthName}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: "text.secondary" }}>
          <FaChevronRight size={16} />
        </IconButton>
      </Stack>

      <Table
        sx={{
          "& thead": {
            "& th": {
              textAlign: "center",
              padding: 2,
              width: "calc(100% / 7)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              color: "text.secondary",
              fontWeight: 600,
              border: "none",
            },
          },

          "& tr": {
            "& td": {
              textAlign: "center",
              padding: 2,
              fontSize: 16,
              width: "calc(100% / 7)",
              border: "1px solid rgba(255,255,255,0.05)",
              transition: "all 0.2s ease",
            },
          },
        }}
      >
        <thead>
          <tr>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          {monthTable.map((m, mIdx) => (
            <tr key={`week-${mIdx}`}>
              {m.map((d, dIdx) => {
                const dayMaintenance = d ? getMaintenanceForDay(d) : [];
                const hasMaintenance = dayMaintenance.length > 0;

                const isSelected = selectedDate === d;
                let bg = "transparent";
                if (isSelected) bg = "rgba(59, 130, 246, 0.3)";
                else if (hasMaintenance) bg = "rgba(59, 130, 246, 0.15)";
                else if (d) bg = "rgba(255,255,255,0.02)";

                return (
                  <td
                    key={`day-${mIdx}-${dIdx}`}
                    style={{
                      backgroundColor: bg,
                      color:
                        hasMaintenance || isSelected ? "#60a5fa" : "inherit",
                      fontWeight:
                        hasMaintenance || isSelected ? "bold" : "normal",
                      padding: 0,
                      cursor: d ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (d) {
                        setSelectedDate(isSelected ? null : d);
                        setPage(0);
                      }
                    }}
                  >
                    <Tooltip
                      title={
                        hasMaintenance ? (
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Maintenance Events:
                            </Typography>
                            {dayMaintenance.map((m, i) => (
                              <Box
                                key={m.id}
                                mb={i < dayMaintenance.length - 1 ? 2 : 0}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {m.title}
                                </Typography>
                                <Typography variant="caption">
                                  {new Date(m.startAt).toLocaleTimeString()} -{" "}
                                  {new Date(m.endAt).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          ""
                        )
                      }
                      placement="top"
                      arrow
                    >
                      <Box sx={{ width: "100%", height: "100%", padding: 2 }}>
                        {d || ""}
                      </Box>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      <Box sx={{ mt: 3, px: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedDate
            ? `Maintenance for ${new Date(year, month, selectedDate).toLocaleDateString()}`
            : "All Maintenance Events"}
        </Typography>
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
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
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

        {filteredEvents.length > 0 && (
          <TablePagination
            component="div"
            count={filteredEvents.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
