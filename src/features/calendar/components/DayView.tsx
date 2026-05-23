"use client";

import { useCalendarStore } from "../store";
import { TimeGridView } from "./TimeGridView";

export function DayView() {
  const currentDate = useCalendarStore(state => state.currentDate);
  return <TimeGridView days={[currentDate]} />;
}
