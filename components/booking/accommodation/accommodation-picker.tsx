"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { clearBookingCompleted } from "@/lib/booking/booking-session";
import { usePropertySelection } from "@/lib/booking/search-params";
import { useProperties } from "@/hooks/use-booking-queries";

import { Button } from "@/components/ui/button";
import { AccommodationDialog } from "@/components/booking/accommodation/accommodation-dialog";
import { BackgroundVideo } from "@/components/booking/accommodation/background-video";
import { AccommodationSkeleton } from "@/components/booking/accommodation/accommodation-skeleton";
import { AccommodationTabs } from "@/components/booking/accommodation/accommodation-tabs";
import { HotelList } from "@/components/booking/hotel/hotel-list";
import { PaginationDots } from "@/components/booking/pagination-dots";

function PropertiesError({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-ink-muted max-md:p-4">{message}</div>
  );
}

export function AccommodationPicker() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"accommodation" | "dates">(
    "accommodation"
  );
  const { property: selectedPropertyId, selectProperty } =
    usePropertySelection();

  const { data, isLoading, isError, error } = useProperties();

  useEffect(() => {
    clearBookingCompleted();
  }, []);

  const handleSelectProperty = useCallback(
    async (propertyId: string) => {
      await selectProperty(propertyId);
      router.push(
        `/book/calendar?property=${encodeURIComponent(propertyId)}`
      );
    },
    [router, selectProperty]
  );

  const properties = data?.properties ?? [];
  const errorMessage =
    error instanceof Error ? error.message : "Failed to load properties.";

  const desktopList = isLoading ? (
    <AccommodationSkeleton layout="desktop" />
  ) : isError ? (
    <PropertiesError message={errorMessage} />
  ) : (
    <HotelList
      properties={properties}
      selectedPropertyId={selectedPropertyId}
      onSelectProperty={handleSelectProperty}
      layout="desktop"
    />
  );

  const mobileList = isLoading ? (
    <AccommodationSkeleton layout="mobile" />
  ) : isError ? (
    <PropertiesError message={errorMessage} />
  ) : (
    <HotelList
      properties={properties}
      selectedPropertyId={selectedPropertyId}
      onSelectProperty={handleSelectProperty}
      layout="mobile"
    />
  );

  return (
    <div className="relative min-h-screen flex-1">
      <BackgroundVideo />
      <AccommodationDialog
        open={open}
        onOpenChange={setOpen}
        desktopTitle="ACCOMMODATION"
        mobileTitle="SEARCH"
      >
        <div className="hidden md:block">{desktopList}</div>
        <div className="flex min-h-0 flex-1 flex-col md:hidden">
          <AccommodationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            accommodationContent={mobileList}
            datesContent={
              <p className="text-center text-ink-muted">
                Dates step coming soon
              </p>
            }
          />
        </div>
      </AccommodationDialog>

      {!open && (
        <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-6 px-4">
          <Button
            onClick={() => setOpen(true)}
            className="h-10 rounded-none bg-white px-8 text-sm font-semibold tracking-label text-ink hover:bg-white/90"
          >
            Choose Accommodation
          </Button>
          <PaginationDots activeIndex={0} />
        </div>
      )}

      {open && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[60] hidden md:block">
          <PaginationDots activeIndex={0} />
        </div>
      )}
    </div>
  );
}
