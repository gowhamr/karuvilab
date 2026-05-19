"use client";

import { useMemo } from "react";
import { getTamilDate, toTamilNumeral } from "../lib/tamil-calendar";
import { getFestivalForTamilDate } from "../lib/tamil-festivals";

export function useTamilCalendar(date: Date) {
  return useMemo(() => {
    const tamilDate = getTamilDate(date);
    const festival = getFestivalForTamilDate(tamilDate);
    const tamilDayNumeral = toTamilNumeral(tamilDate.day);
    
    return {
      ...tamilDate,
      festival,
      tamilDayNumeral
    };
  }, [date]);
}
