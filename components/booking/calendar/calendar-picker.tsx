"use client";

import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";

import { getNightCount } from "@/lib/booking/calendar-utils";
import { useBookingParams } from "@/lib/booking/search-params";
import { cn } from "@/lib/utils";
import { useCalendarAvailability } from "@/hooks/use-calendar-availability";
import { useBookingRouteGuard } from "@/hooks/use-booking-route-guard";
import { useProperties } from "@/hooks/use-booking-queries";

import { AccommodationDialog } from "@/components/booking/accomodation/accommodation-dialog";
import {
  DesktopCalendarPanel,
  MobileCalendarPanel,
} from "@/components/booking/calendar/calendar-panels";
import { PaginationDots } from "@/components/booking/pagination-dots";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555992336-03a23c7b10cb?auto=format&fit=crop&w=1920&q=80";

export function CalendarPicker() {
  const router = useRouter();
  const [{ property, checkin, nights }, setParams] = useBookingParams();
  const { isReady } = useBookingRouteGuard();
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

  const {
    desktopLoading,
    desktopError,
    mobileLoading,
    mobileError,
    desktopPriceMap,
    mobilePriceMap,
    desktopDisabled,
    mobileDisabled,
  } = useCalendarAvailability(property || null, month);

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

  if (!isReady || !property) {
    return null;
  }

  const sharedPanelProps = {
    month,
    onMonthChange: setMonth,
    selected,
    onSelect: setSelected,
    selectedNights,
    from: selected?.from ?? null,
    to: selected?.to ?? null,
    onConfirm: handleConfirm,
  };

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
        <DesktopCalendarPanel
          layout="desktop"
          isLoading={desktopLoading}
          isError={desktopError}
          priceMap={desktopPriceMap}
          isDayDisabled={desktopDisabled}
          {...sharedPanelProps}
        />

        <MobileCalendarPanel
          layout="mobile"
          isLoading={mobileLoading}
          isError={mobileError}
          priceMap={mobilePriceMap}
          isDayDisabled={mobileDisabled}
          activeTab={activeTab}
          propertyName={propertyName}
          onTabChange={handleTabChange}
          {...sharedPanelProps}
        />
      </AccommodationDialog>

      {open && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[60] hidden md:block">
          <PaginationDots activeIndex={1} />
        </div>
      )}
    </div>
  );
}
