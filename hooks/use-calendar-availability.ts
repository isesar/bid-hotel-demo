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
  month: Date
) {
  const desktopRange = useMemo(
    () => getVisibleRange(month, "desktop"),
    [month]
  );
  const mobileRange = useMemo(() => getVisibleRange(month, "mobile"), [month]);

  const {
    data: desktopCalendar,
    isLoading: desktopLoading,
    isError: desktopError,
  } = useCalendar(property, desktopRange.start, desktopRange.end);

  const {
    data: mobileCalendar,
    isLoading: mobileLoading,
    isError: mobileError,
  } = useCalendar(property, mobileRange.start, mobileRange.end);

  const desktopPriceMap = useMemo(
    () => buildPriceMap(desktopCalendar?.days ?? []),
    [desktopCalendar?.days]
  );
  const mobilePriceMap = useMemo(
    () => buildPriceMap(mobileCalendar?.days ?? []),
    [mobileCalendar?.days]
  );

  const desktopDisabled = useCallback(
    (date: Date) => isDayDisabled(date, desktopPriceMap),
    [desktopPriceMap]
  );
  const mobileDisabled = useCallback(
    (date: Date) => isDayDisabled(date, mobilePriceMap),
    [mobilePriceMap]
  );

  return {
    desktopLoading,
    desktopError,
    mobileLoading,
    mobileError,
    desktopPriceMap,
    mobilePriceMap,
    desktopDisabled,
    mobileDisabled,
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
