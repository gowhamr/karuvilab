"use client";

import { useCalendarStore } from "../store";
import { getWeekDays } from "../utils";
import { TimeGridView } from "./TimeGridView";

export function WeekView() {
  const { currentDate } = useCalendarStore();
  const days = getWeekDays(currentDate);

  return <TimeGridView days={days} />;
}
