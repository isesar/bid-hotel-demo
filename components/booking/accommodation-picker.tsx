"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { listUnits } from "@/lib/booking/api";
import { cn } from "@/lib/utils";
import { useProperties, useUnits } from "@/hooks/use-booking-queries";

import { Button } from "@/components/ui/button";
import { AccommodationDialog } from "@/components/booking/accommodation-dialog";
import { AccommodationSkeleton } from "@/components/booking/accommodation-skeleton";
import { AccommodationTabs } from "@/components/booking/accommodation-tabs";
import { HotelList } from "@/components/booking/hotel-list";
import { PaginationDots } from "@/components/booking/pagination-dots";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555992336-03a23c7b10cb?auto=format&fit=crop&w=1920&q=80";

function PropertiesError({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-[#5e5e5e] max-md:p-4">{message}</div>
  );
}

export function AccommodationPicker() {
  const [open, setOpen] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"accommodation" | "dates">(
    "accommodation"
  );

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useProperties();
  useUnits(selectedPropertyId);

  const handleSelectProperty = useCallback(
    (propertyId: string) => {
      setSelectedPropertyId(propertyId);
      void queryClient.prefetchQuery({
        queryKey: ["units", propertyId],
        queryFn: () => listUnits(propertyId),
      });
    },
    [queryClient]
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
              <p className="text-center text-[#5e5e5e]">
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
            className="h-10 rounded-none bg-white px-8 text-sm font-semibold tracking-[0.2px] text-[#1f1f1f] hover:bg-white/90"
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
