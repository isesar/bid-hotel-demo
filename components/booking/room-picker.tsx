"use client";

import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { useBookingParams } from "@/lib/booking/search-params";
import type { AvailabilityUnit, Unit } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import {
  useAvailability,
  useProperties,
  useUnits,
} from "@/hooks/use-booking-queries";

import { RoomCard, type RoomCardData } from "@/components/booking/room-card";
import { RoomSearchSummary } from "@/components/booking/room-search-summary";
import { BOOKING_STEPS, Stepper } from "@/components/booking/stepper";
import { Skeleton } from "@/components/ui/skeleton";

function mergeRoomData(
  availabilityUnits: AvailabilityUnit[],
  units: Unit[]
): RoomCardData[] {
  const unitMap = new Map(units.map((unit) => [unit.id, unit]));

  return availabilityUnits
    .filter((item) => item.unitsAvailable > 0 && item.rates.length > 0)
    .map((item) => {
      const unit = unitMap.get(item.unitId);

      return {
        unitId: item.unitId,
        name: unit?.name ?? item.unitId,
        image: unit?.image ?? "",
        unitsAvailable: item.unitsAvailable,
        occupancyMax: item.occupancy.max,
        rates: item.rates,
      };
    });
}

function RoomListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-[420px] w-full rounded-none" />
      ))}
    </div>
  );
}

export function RoomPicker() {
  const router = useRouter();
  const [{ property, checkin, nights, adults, children }, setParams] =
    useBookingParams();

  const checkinParam = checkin ? format(checkin, "yyyy-MM-dd") : null;
  const checkout = checkin ? addDays(checkin, nights) : null;
  const persons = adults + children;

  const { data: propertiesData } = useProperties();
  const {
    data: availabilityData,
    isLoading: availabilityLoading,
    isError: availabilityError,
  } = useAvailability(property || null, checkinParam, nights);
  const { data: unitsData } = useUnits(property || null);

  const propertyName =
    propertiesData?.properties.find((item) => item.id === property)?.name ??
    "Selected property";

  const rooms = useMemo(
    () =>
      mergeRoomData(
        availabilityData?.units ?? [],
        unitsData?.units ?? []
      ),
    [availabilityData?.units, unitsData?.units]
  );

  useEffect(() => {
    if (!property) {
      router.replace("/book/hotels");
      return;
    }

    if (!checkin) {
      router.replace(
        `/book/calendar?property=${encodeURIComponent(property)}`
      );
    }
  }, [property, checkin, router]);

  const handleSelect = useCallback(
    async (unitId: string, rateId: string) => {
      if (!property || !checkinParam) return;

      await setParams({
        rooms: [{ unitId, rateId, qty: 1 }],
      });

      router.push(
        `/book/payment?property=${encodeURIComponent(property)}&checkin=${checkinParam}&nights=${nights}`
      );
    },
    [checkinParam, nights, property, router, setParams]
  );

  if (!property || !checkin || !checkout) {
    return null;
  }

  const roomCount = rooms.length;
  const availabilityLabel =
    roomCount === 1 ? "1 ROOM AVAILABLE" : `${roomCount} ROOMS AVAILABLE`;

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white">
      <Stepper steps={[...BOOKING_STEPS]} activeStep={0} />

      <RoomSearchSummary
        propertyName={propertyName}
        checkin={checkin}
        checkout={checkout}
        nights={nights}
        propertyId={property}
      />

      <div className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-6 px-4 py-6 md:px-[200px]">
        {availabilityLoading ? (
          <RoomListSkeleton />
        ) : availabilityError ? (
          <p className="py-10 text-center text-[#5e5e5e]">
            Failed to load room availability.
          </p>
        ) : (
          <>
            <p className="text-center text-[16px] font-semibold text-[#1f1f1f]">
              {availabilityLabel}
            </p>
            <div className={cn("flex flex-col gap-6", roomCount === 0 && "py-10")}>
              {roomCount === 0 ? (
                <p className="text-center text-[#5e5e5e]">
                  No rooms available for the selected dates.
                </p>
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.unitId}
                    room={room}
                    persons={persons}
                    nights={nights}
                    onSelect={handleSelect}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
