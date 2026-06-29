"use client";

import type { ReactNode } from "react";

import { CalendarConfirmBar } from "@/components/booking/calendar/calendar-confirm-bar";
import { CalendarLegend } from "@/components/booking/calendar/calendar-legend";
import { CalendarTabs } from "@/components/booking/calendar/calendar-tabs";
import { PriceCalendar } from "@/components/booking/calendar/price-calendar";
import type { CalendarPanelProps } from "@/hooks/use-calendar-availability";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function CalendarSkeleton({ layout }: { layout: "desktop" | "mobile" }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <Skeleton className="mx-auto h-8 w-32 rounded-none" />
      <div
        className={cn(
          "grid gap-4",
          layout === "desktop" ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {Array.from({ length: layout === "desktop" ? 2 : 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}

export function CalendarContentPanel({
  layout,
  month,
  onMonthChange,
  selected,
  onSelect,
  isLoading,
  isError,
  priceMap,
  isDayDisabled,
}: CalendarPanelProps) {
  if (isLoading) {
    return <CalendarSkeleton layout={layout} />;
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-ink-muted">
        Failed to load calendar availability.
      </div>
    );
  }

  return (
    <PriceCalendar
      layout={layout}
      month={month}
      onMonthChange={onMonthChange}
      selected={selected}
      onSelect={onSelect}
      priceMap={priceMap}
      isDayDisabled={isDayDisabled}
    />
  );
}

type DesktopCalendarPanelProps = CalendarPanelProps & {
  selectedNights: number | null;
  from: Date | null;
  to: Date | null;
  onConfirm: () => void;
};

export function DesktopCalendarPanel({
  selectedNights,
  from,
  to,
  onConfirm,
  ...contentProps
}: DesktopCalendarPanelProps) {
  return (
    <div className="hidden min-h-0 flex-1 flex-col md:flex">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CalendarContentPanel {...contentProps} />
        <CalendarLegend />
      </div>
      <CalendarConfirmBar
        layout="desktop"
        nights={selectedNights}
        from={from}
        to={to}
        onConfirm={onConfirm}
      />
    </div>
  );
}

type MobileCalendarPanelProps = CalendarPanelProps & {
  activeTab: "accommodation" | "dates";
  propertyName: string | undefined;
  selectedNights: number | null;
  from: Date | null;
  to: Date | null;
  onConfirm: () => void;
  onTabChange: (tab: "accommodation" | "dates") => void;
};

type CalendarTabsWrapperProps = {
  activeTab: "accommodation" | "dates";
  onTabChange: (tab: "accommodation" | "dates") => void;
  propertyName: string | undefined;
  datesContent: ReactNode;
};

function CalendarTabsWrapper({
  activeTab,
  onTabChange,
  propertyName,
  datesContent,
}: CalendarTabsWrapperProps) {
  return (
    <CalendarTabs
      activeTab={activeTab}
      onTabChange={onTabChange}
      propertyName={propertyName}
      accommodationContent={
        <div className="p-6 text-center text-ink-muted">
          <p className="font-serif text-xl text-ink">
            {propertyName ?? "Selected property"}
          </p>
          <p className="mt-2 text-sm">Switch to Dates to choose your stay.</p>
        </div>
      }
      datesContent={datesContent}
    />
  );
}

export function MobileCalendarPanel({
  activeTab,
  propertyName,
  selectedNights,
  from,
  to,
  onConfirm,
  onTabChange,
  ...contentProps
}: MobileCalendarPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col md:hidden">
      <CalendarTabsWrapper
        activeTab={activeTab}
        onTabChange={onTabChange}
        propertyName={propertyName}
        datesContent={
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CalendarContentPanel {...contentProps} />
            </div>
          </div>
        }
      />
      <CalendarConfirmBar
        layout="mobile"
        nights={selectedNights}
        from={from}
        to={to}
        onConfirm={onConfirm}
        className={activeTab === "dates" ? undefined : "hidden"}
      />
    </div>
  );
}
