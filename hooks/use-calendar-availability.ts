"use client";

import { useCallback, useMemo } from "react";
import type { DateRange } from "react-day-picker";

import {
  buildPriceMap,
  getVisibleRange,
  isDayDisabled,
} from "@/lib/booking/calendar-utils";
import type { CalendarDay } from "@/lib/booking/types";
import { useCalendar } from "@/hooks/use-booking-queries";

export function useCalendarAvailability(
  property: string | null,
  month: Date,
  layout: "desktop" | "mobile",
  enabled: boolean
) {
  const range = useMemo(() => getVisibleRange(month, layout), [month, layout]);

  const {
    data: calendar,
    isLoading,
    isError,
  } = useCalendar(property, range.start, range.end, enabled);

  const priceMap = useMemo(
    () => buildPriceMap(calendar?.days ?? []),
    [calendar?.days]
  );

  const isDayDisabledFn = useCallback(
    (date: Date) => isDayDisabled(date, priceMap),
    [priceMap]
  );

  return {
    isLoading,
    isError,
    priceMap,
    isDayDisabled: isDayDisabledFn,
  };
}

export type CalendarPanelProps = {
  layout: "desktop" | "mobile";
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  isLoading: boolean;
  isError: boolean;
  priceMap: Record<string, CalendarDay>;
  isDayDisabled: (date: Date) => boolean;
};
