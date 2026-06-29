"use client";

import * as React from "react";
import {
  type DateRange,
  type DayButton,
  getDefaultClassNames,
} from "react-day-picker";

import { toDateKey } from "@/lib/booking/calendar-utils";
import type { CalendarDay } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

type PriceCalendarProps = {
  layout: "desktop" | "mobile";
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  priceMap: Record<string, CalendarDay>;
  isDayDisabled: (date: Date) => boolean;
  className?: string;
};

function createPriceDayButton(priceMap: Record<string, CalendarDay>) {
  return function PriceDayButton({
    day,
    modifiers,
    className,
    ...props
  }: React.ComponentProps<typeof DayButton>) {
    const defaultClassNames = getDefaultClassNames();
    const ref = React.useRef<HTMLButtonElement>(null);
    const dateKey = toDateKey(day.date);
    const dayData = priceMap[dateKey];
    const isUnavailable = dayData ? !dayData.available : false;
    const inRange =
      modifiers.range_start ||
      modifiers.range_middle ||
      modifiers.range_end;

    React.useEffect(() => {
      if (modifiers.focused) ref.current?.focus();
    }, [modifiers.focused]);

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        data-range-start={modifiers.range_start}
        data-range-end={modifiers.range_end}
        data-range-middle={modifiers.range_middle}
        className={cn(
          "relative isolate z-10 flex h-10 w-full min-w-0 flex-col items-start justify-center gap-0 rounded-none border-0 px-2 py-0 text-left leading-none font-normal",
          "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-20 group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ink/20",
          isUnavailable && !inRange && "bg-surface text-ink-muted opacity-70",
          inRange &&
            "bg-ink text-white hover:bg-ink hover:text-white",
          modifiers.range_start && "rounded-l-full",
          modifiers.range_end && "rounded-r-full",
          modifiers.range_middle && "rounded-none",
          defaultClassNames.day,
          className
        )}
        {...props}
      >
        <span className="text-caption leading-[18px] tracking-label">
          {day.date.getDate()}
        </span>
        {dayData ? (
          <span
            className={cn(
              "text-micro leading-none tracking-label",
              inRange ? "text-white/90" : "text-ink"
            )}
          >
            {dayData.rateFromValue}€
          </span>
        ) : null}
      </Button>
    );
  };
}

export function PriceCalendar({
  layout,
  month,
  onMonthChange,
  selected,
  onSelect,
  priceMap,
  isDayDisabled,
  className,
}: PriceCalendarProps) {
  const PriceDayButton = React.useMemo(
    () => createPriceDayButton(priceMap),
    [priceMap]
  );

  const monthCount = layout === "desktop" ? 2 : 6;

  return (
    <Calendar
      mode="range"
      month={month}
      onMonthChange={onMonthChange}
      selected={selected}
      onSelect={onSelect}
      disabled={isDayDisabled}
      excludeDisabled
      numberOfMonths={monthCount}
      showOutsideDays={false}
      className={cn(
        "mx-auto bg-white p-0 [--cell-size:56px]",
        layout === "desktop" && "px-4 pb-4",
        layout === "mobile" && "w-full px-4 pb-4",
        className
      )}
      classNames={{
        months:
          layout === "mobile"
            ? "flex flex-col gap-8"
            : "relative flex flex-row items-start justify-center gap-8",
        month: cn(
          "flex flex-col gap-2",
          layout === "desktop" ? "w-[460px]" : "w-full"
        ),
        month_caption:
          "flex h-8 w-full items-center justify-center px-0 text-base font-semibold text-ink",
        caption_label: "text-base font-semibold text-ink",
        nav:
          layout === "desktop"
            ? "absolute inset-x-0 top-0 flex w-full items-center justify-end gap-1 pr-4"
            : "hidden",
        button_previous: "hidden",
        button_next:
          layout === "desktop"
            ? "size-8 p-0 text-ink hover:bg-transparent"
            : "hidden",
        weekdays: "flex w-full",
        weekday:
          "flex h-7 flex-1 items-center justify-center text-caption font-normal tracking-label text-ink-muted",
        week: "mt-0 flex w-full",
        day: cn(
          "relative h-10 flex-1 p-0 text-center select-none",
          "first:[&:has([data-range-start=true])]:rounded-l-full",
          "last:[&:has([data-range-end=true])]:rounded-r-full"
        ),
        range_start:
          "rounded-l-full bg-ink after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-ink",
        range_middle: "rounded-none bg-ink",
        range_end:
          "rounded-r-full bg-ink after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-ink",
        disabled: "opacity-100",
        outside: "opacity-50",
        today: "bg-transparent",
      }}
      components={{
        DayButton: PriceDayButton,
        PreviousMonthButton: () => <span className="hidden" />,
      }}
    />
  );
}
