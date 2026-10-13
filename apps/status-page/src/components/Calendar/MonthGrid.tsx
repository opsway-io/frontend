import { Box, Table, Tooltip, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { PublicMaintenance } from "../../api";
import { buildMonthWeeks, getMaintenanceForDay } from "./calendarUtils";

interface MonthGridProps {
  year: number;
  month: number;
  events: PublicMaintenance[];
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Month table highlighting days with maintenance; days are selectable. */
const MonthGrid: FunctionComponent<MonthGridProps> = ({
  year,
  month,
  events,
  selectedDay,
  onSelectDay,
}) => {
  const weeks = buildMonthWeeks(year, month);

  return (
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
          {WEEKDAYS.map((weekday) => (
            <th key={weekday}>{weekday}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={`week-${weekIndex}`}>
            {week.map((d, dayIndex) => {
              const dayMaintenance = d
                ? getMaintenanceForDay(events, year, month, d)
                : [];
              const hasMaintenance = dayMaintenance.length > 0;

              const isSelected = selectedDay === d;
              let bg = "transparent";
              if (isSelected) bg = "rgba(59, 130, 246, 0.3)";
              else if (hasMaintenance) bg = "rgba(59, 130, 246, 0.15)";
              else if (d) bg = "rgba(255,255,255,0.02)";

              return (
                <td
                  key={`day-${weekIndex}-${dayIndex}`}
                  style={{
                    backgroundColor: bg,
                    color: hasMaintenance || isSelected ? "#60a5fa" : "inherit",
                    fontWeight:
                      hasMaintenance || isSelected ? "bold" : "normal",
                    padding: 0,
                    cursor: d ? "pointer" : "default",
                  }}
                  aria-label={d ? `${d}` : undefined}
                  onClick={() => {
                    if (d) onSelectDay(isSelected ? null : d);
                  }}
                >
                  <Tooltip
                    title={
                      hasMaintenance ? (
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Maintenance Events:
                          </Typography>
                          {dayMaintenance.map((event, i) => (
                            <Box
                              key={event.id}
                              mb={i < dayMaintenance.length - 1 ? 2 : 0}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {event.title}
                              </Typography>
                              <Typography variant="caption">
                                {new Date(event.startAt).toLocaleTimeString()} -{" "}
                                {new Date(event.endAt).toLocaleTimeString()}
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
  );
};

export default MonthGrid;
