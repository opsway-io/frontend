import { PublicMaintenance } from "../../api";

export type MaintenanceFilter = "upcoming" | "past" | "all";

/** Day-of-month cells (Monday first) for each week; `undefined` pads. */
export const buildMonthWeeks = (
  year: number,
  month: number,
): (number | undefined)[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDayDate = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const weeks: (number | undefined)[][] = [[], [], [], [], [], []];
  let currentWeek = 0;

  for (let i = 0; i < firstDayWeekday; i++) {
    weeks[currentWeek].push(undefined);
  }

  for (let day = 1; day <= lastDayDate; day++) {
    weeks[currentWeek].push(day);
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
  return weeks.filter((week) => week.length > 0);
};

/** Maintenance windows that overlap the given calendar day. */
export const getMaintenanceForDay = (
  events: PublicMaintenance[],
  year: number,
  month: number,
  day: number,
) => {
  // Middle of the day avoids timezone boundary issues
  const checkDate = new Date(year, month, day, 12, 0, 0, 0);

  return events.filter((event) => {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    const startOfStartDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfEndDay = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23,
      59,
      59,
      999,
    );

    return checkDate >= startOfStartDay && checkDate <= endOfEndDay;
  });
};

const byStart = (a: PublicMaintenance, b: PublicMaintenance) =>
  new Date(a.startAt).getTime() - new Date(b.startAt).getTime();

/**
 * Events for the list below the calendar: either those on the selected day,
 * or all events narrowed by `filter`. Upcoming events are soonest first,
 * everything else most recent first.
 */
export const selectListedEvents = (
  events: PublicMaintenance[],
  filter: MaintenanceFilter,
  now: Date,
  selectedDay: { year: number; month: number; day: number } | null,
) => {
  if (selectedDay) {
    return getMaintenanceForDay(
      events,
      selectedDay.year,
      selectedDay.month,
      selectedDay.day,
    ).toSorted((a, b) => byStart(b, a));
  }

  if (filter === "upcoming") {
    return events.filter((e) => new Date(e.endAt) >= now).toSorted(byStart);
  }

  const filtered =
    filter === "past" ? events.filter((e) => new Date(e.endAt) < now) : events;
  return filtered.toSorted((a, b) => byStart(b, a));
};
