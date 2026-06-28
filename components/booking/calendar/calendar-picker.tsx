"use client";

import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import {
  buildPriceMap,
  getNightCount,
  getVisibleRange,
  isDayDisabled,
} from "@/lib/booking/calendar-utils";
import { useBookingParams } from "@/lib/booking/search-params";
import { cn } from "@/lib/utils";
import { useCalendar, useProperties } from "@/hooks/use-booking-queries";

import { AccommodationDialog } from "@/components/booking/accomodation/accommodation-dialog";
import { CalendarConfirmBar } from "@/components/booking/calendar/calendar-confirm-bar";
import { CalendarLegend } from "@/components/booking/calendar/calendar-legend";
import { CalendarTabs } from "@/components/booking/calendar/calendar-tabs";
import { PaginationDots } from "@/components/booking/pagination-dots";
import { PriceCalendar } from "@/components/booking/calendar/price-calendar";
import { Skeleton } from "@/components/ui/skeleton";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555992336-03a23c7b10cb?auto=format&fit=crop&w=1920&q=80";

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

export function CalendarPicker() {
  const router = useRouter();
  const [{ property, checkin, nights }, setParams] = useBookingParams();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"accommodation" | "dates">(
    "dates"
  );
  const [month, setMonth] = useState(() => checkin ?? new Date());
  const [selected, setSelected] = useState<DateRange | undefined>(() => {
    if (!checkin) return undefined;
    const from = checkin;
    const to = nights && nights > 0 ? addDays(from, nights) : undefined;
    return to ? { from, to } : { from };
  });

  const { data: propertiesData } = useProperties();
  const propertyName = propertiesData?.properties.find(
    (item) => item.id === property
  )?.name;

  const desktopRange = useMemo(
    () => getVisibleRange(month, "desktop"),
    [month]
  );
  const mobileRange = useMemo(() => getVisibleRange(month, "mobile"), [month]);

  const {
    data: desktopCalendar,
    isLoading: desktopLoading,
    isError: desktopError,
  } = useCalendar(property || null, desktopRange.start, desktopRange.end);

  const {
    data: mobileCalendar,
    isLoading: mobileLoading,
    isError: mobileError,
  } = useCalendar(property || null, mobileRange.start, mobileRange.end);

  useEffect(() => {
    if (!property) {
      router.replace("/book/hotels");
    }
  }, [property, router]);

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

  const selectedNights =
    selected?.from && selected?.to
      ? getNightCount(selected.from, selected.to)
      : null;

  const handleConfirm = useCallback(async () => {
    if (!property || !selected?.from || !selected?.to) return;

    const nightCount = getNightCount(selected.from, selected.to);

    await setParams({
      checkin: selected.from,
      nights: nightCount,
    });

    const checkinParam = format(selected.from, "yyyy-MM-dd");
    router.push(
      `/book/rooms?property=${encodeURIComponent(property)}&checkin=${checkinParam}&nights=${nightCount}`
    );
  }, [property, router, selected, setParams]);

  const handleTabChange = useCallback(
    (tab: "accommodation" | "dates") => {
      if (tab === "accommodation") {
        router.push(
          property
            ? `/book/hotels?property=${encodeURIComponent(property)}`
            : "/book/hotels"
        );
        return;
      }
      setActiveTab(tab);
    },
    [property, router]
  );

  if (!property) {
    return null;
  }

  const desktopCalendarContent = desktopLoading ? (
    <CalendarSkeleton layout="desktop" />
  ) : desktopError ? (
    <div className="p-10 text-center text-ink-muted">
      Failed to load calendar availability.
    </div>
  ) : (
    <PriceCalendar
      layout="desktop"
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={setSelected}
      priceMap={desktopPriceMap}
      isDayDisabled={desktopDisabled}
    />
  );

  const mobileCalendarContent = mobileLoading ? (
    <CalendarSkeleton layout="mobile" />
  ) : mobileError ? (
    <div className="p-10 text-center text-ink-muted">
      Failed to load calendar availability.
    </div>
  ) : (
    <PriceCalendar
      layout="mobile"
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={setSelected}
      priceMap={mobilePriceMap}
      isDayDisabled={mobileDisabled}
    />
  );

  return (
    <div className="relative min-h-screen flex-1">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-cover bg-center",
          open ? "max-md:hidden" : "block"
        )}
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      <AccommodationDialog
        open={open}
        onOpenChange={setOpen}
        desktopTitle="DATES"
        mobileTitle="SEARCH"
        preventOutsideClose
        contentClassName="md:flex md:max-h-[90vh] md:h-[760px] md:w-full md:max-w-[1100px] md:flex-col"
      >
        <div className="hidden min-h-0 flex-1 flex-col md:flex">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {desktopCalendarContent}
            <CalendarLegend />
          </div>
          <CalendarConfirmBar
            layout="desktop"
            nights={selectedNights}
            from={selected?.from ?? null}
            to={selected?.to ?? null}
            onConfirm={handleConfirm}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:hidden">
          <CalendarTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            propertyName={propertyName}
            accommodationContent={
              <div className="p-6 text-center text-ink-muted">
                <p className="font-serif text-xl text-ink">
                  {propertyName ?? "Selected property"}
                </p>
                <p className="mt-2 text-sm">
                  Switch to Dates to choose your stay.
                </p>
              </div>
            }
            datesContent={
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {mobileCalendarContent}
                </div>
              </div>
            }
          />
          <CalendarConfirmBar
            layout="mobile"
            nights={selectedNights}
            from={selected?.from ?? null}
            to={selected?.to ?? null}
            onConfirm={handleConfirm}
            className={activeTab === "dates" ? undefined : "hidden"}
          />
        </div>
      </AccommodationDialog>

      {open && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[60] hidden md:block">
          <PaginationDots activeIndex={1} />
        </div>
      )}
    </div>
  );
}
