import { Table } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";

interface CalendarProps {
  idk?: string;
}

const Calendar: FunctionComponent<CalendarProps> = () => {
  const [monthTable, setMonthTable] = useState<(number | undefined)[][]>([]);

  useEffect(() => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayWeekday = firstDay.getDay();

    const firstDayDate = firstDay.getDate();
    const lastDayDate = lastDay.getDate();

    const firstWeek = [];
    const secondWeek = [];
    const thirdWeek = [];
    const fourthWeek = [];
    const fifthWeek = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      firstWeek.push(undefined);
    }

    for (let i = firstDayDate; i <= 7 - firstDayWeekday; i++) {
      firstWeek.push(i);
    }

    for (let i = 8 - firstDayWeekday; i <= 14 - firstDayWeekday; i++) {
      secondWeek.push(i);
    }

    for (let i = 15 - firstDayWeekday; i <= 21 - firstDayWeekday; i++) {
      thirdWeek.push(i);
    }

    for (let i = 22 - firstDayWeekday; i <= 28 - firstDayWeekday; i++) {
      fourthWeek.push(i);
    }

    for (let i = 29 - firstDayWeekday; i <= lastDayDate; i++) {
      fifthWeek.push(i);
    }

    for (let i = lastDayDate + 1; i <= 35 - firstDayWeekday; i++) {
      fifthWeek.push(undefined);
    }

    setMonthTable([firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek]);
  }, []);

  return (
    <Table
      sx={{
        "& thead": {
          "& th": {
            textAlign: "center",
            padding: 2,
            width: "calc(100% / 7)",
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        },

        "& tr": {
          "& td": {
            textAlign: "center",
            padding: 2,
            fontSize: 18,
            width: "calc(100% / 7)",
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        },
      }}
    >
      <thead>
        <tr>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
          <th>Sunday</th>
        </tr>
      </thead>
      <tbody>
        {monthTable.map((m) => (
          <tr>
            {m.map((d) => (
              <td>{d}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Calendar;
