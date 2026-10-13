import { Box, IconButton, Stack, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { PublicMaintenance } from "../../api";
import { MaintenanceFilter, selectListedEvents } from "./calendarUtils";
import MaintenanceEventList from "./MaintenanceEventList";
import MonthGrid from "./MonthGrid";

interface CalendarProps {
  maintenanceEvents?: PublicMaintenance[];
}

const Calendar: FunctionComponent<CalendarProps> = ({
  maintenanceEvents = [],
}) => {
  // Captured once on mount; used as "today" for the month and the filters.
  const [now] = useState(() => new Date());
  const [{ year, month }, setVisibleMonth] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState<MaintenanceFilter>("upcoming");

  const changeMonth = (delta: -1 | 1) => {
    const target = new Date(year, month + delta, 1);
    setVisibleMonth({ year: target.getFullYear(), month: target.getMonth() });
    setSelectedDate(null);
  };

  const listedEvents = selectListedEvents(
    maintenanceEvents,
    filter,
    now,
    selectedDate ? { year, month, day: selectedDate } : null,
  );

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
        <IconButton
          onClick={() => changeMonth(-1)}
          sx={{ color: "text.secondary" }}
        >
          <FaChevronLeft size={16} />
        </IconButton>
        <Typography variant="subtitle1" fontWeight="600">
          {monthName}
        </Typography>
        <IconButton
          onClick={() => changeMonth(1)}
          sx={{ color: "text.secondary" }}
        >
          <FaChevronRight size={16} />
        </IconButton>
      </Stack>

      <MonthGrid
        year={year}
        month={month}
        events={maintenanceEvents}
        selectedDay={selectedDate}
        onSelectDay={(day) => {
          setSelectedDate(day);
          setPage(0);
        }}
      />

      <MaintenanceEventList
        title={
          selectedDate
            ? `Maintenance for ${new Date(year, month, selectedDate).toLocaleDateString()}`
            : "Maintenance Events"
        }
        events={listedEvents}
        showFilter={!selectedDate}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(0);
        }}
        page={page}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setPage(0);
        }}
      />
    </Box>
  );
};

export default Calendar;
