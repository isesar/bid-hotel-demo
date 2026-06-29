import {
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";

import type { CalendarDay } from "@/lib/booking/types";

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function buildPriceMap(days: CalendarDay[]) {
  return days.reduce<Record<string, CalendarDay>>((map, day) => {
    map[day.date] = day;
    return map;
  }, {});
}

export function getVisibleRange(month: Date, layout: "desktop" | "mobile") {
  const start = startOfMonth(month);
  const end = endOfMonth(
    addMonths(month, layout === "desktop" ? 1 : 5)
  );

  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export function isDayDisabled(date: Date, priceMap: Record<string, CalendarDay>) {
  const today = startOfDay(new Date());
  if (date < today) return true;

  const day = priceMap[toDateKey(date)];
  return day ? !day.available : false;
}

export function getNightCount(from: Date, to: Date) {
  return Math.max(differenceInCalendarDays(to, from), 1);
}

export function formatDateRange(from: Date, to: Date) {
  const sameYear = from.getFullYear() === to.getFullYear();
  const fromFormat = "d MMM";
  const toFormat = sameYear ? "d MMM yyyy" : "d MMM yyyy";

  return `${format(from, fromFormat)} - ${format(to, toFormat)}`;
}
