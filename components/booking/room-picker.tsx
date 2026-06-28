"use client";

import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { formatDateRange } from "@/lib/booking/calendar-utils";
import { useBookingParams } from "@/lib/booking/search-params";
import type { AvailabilityUnit, Rate, Unit } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import {
  useAvailability,
  useProperties,
  useUnits,
} from "@/hooks/use-booking-queries";

import { CartDrawer } from "@/components/booking/cart-drawer";
import { CartMobile } from "@/components/booking/cart-mobile";
import type { CartRoomLine } from "@/components/booking/cart-room-card";
import { RoomCard, type RoomCardData } from "@/components/booking/room-card";
import { RoomSearchSummary } from "@/components/booking/room-search-summary";
import { BOOKING_STEPS, Stepper } from "@/components/booking/stepper";
import { Skeleton } from "@/components/ui/skeleton";

function subscribeMediaQuery(query: string, onChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => subscribeMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  );
}

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

function buildRateLookup(
  availabilityUnits: AvailabilityUnit[],
  units: Unit[]
) {
  const unitMap = new Map(units.map((unit) => [unit.id, unit]));
  const lookup = new Map<
    string,
    {
      rate: Rate;
      unitId: string;
      name: string;
      occupancyMax: number;
    }
  >();

  for (const item of availabilityUnits) {
    const unit = unitMap.get(item.unitId);

    for (const rate of item.rates) {
      lookup.set(rate.rateId, {
        rate,
        unitId: item.unitId,
        name: unit?.name ?? item.unitId,
        occupancyMax: item.occupancy.max,
      });
    }
  }

  return lookup;
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [{ property, checkin, nights, adults, children, rooms }, setParams] =
    useBookingParams();
  const [cartOpen, setCartOpen] = useState(false);
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);

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

  const availableRooms = useMemo(
    () =>
      mergeRoomData(
        availabilityData?.units ?? [],
        unitsData?.units ?? []
      ),
    [availabilityData?.units, unitsData?.units]
  );

  const rateLookup = useMemo(
    () =>
      buildRateLookup(
        availabilityData?.units ?? [],
        unitsData?.units ?? []
      ),
    [availabilityData?.units, unitsData?.units]
  );

  const cartLines = useMemo((): CartRoomLine[] => {
    return rooms
      .map((selection) => {
        const resolved = rateLookup.get(selection.rateId);

        if (!resolved || resolved.unitId !== selection.unitId) {
          return null;
        }

        return {
          ...selection,
          name: resolved.name,
          rateName: resolved.rate.rateName,
          boardType: resolved.rate.boardType,
          total: resolved.rate.totalPrice,
          occupancyMax: resolved.occupancyMax,
        };
      })
      .filter((line): line is CartRoomLine => line !== null);
  }, [rateLookup, rooms]);

  const grandTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.total, 0),
    [cartLines]
  );

  const pendingUnitRates = useMemo(() => {
    if (!pendingUnitId) return null;
    return availableRooms.find((room) => room.unitId === pendingUnitId)?.rates ?? null;
  }, [availableRooms, pendingUnitId]);

  const pendingRateId = useMemo(() => {
    if (!pendingUnitId) return null;
    return rooms.find((room) => room.unitId === pendingUnitId)?.rateId ?? null;
  }, [pendingUnitId, rooms]);

  const nightsLabel = nights === 1 ? "1 night" : `${nights} nights`;

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

      setPendingUnitId(unitId);

      const nextRooms = isDesktop
        ? [...rooms, { unitId, rateId, adults, children }]
        : [
            ...rooms.filter((room) => room.unitId !== unitId),
            { unitId, rateId, adults, children },
          ];

      await setParams({ rooms: nextRooms });
      setCartOpen(true);
    },
    [adults, checkinParam, children, isDesktop, property, rooms, setParams]
  );

  const handleRateChange = useCallback(
    async (rateId: string) => {
      if (!pendingUnitId) return;

      const hasUnit = rooms.some((room) => room.unitId === pendingUnitId);
      const nextRooms = hasUnit
        ? rooms.map((room) =>
            room.unitId === pendingUnitId ? { ...room, rateId } : room
          )
        : [
            ...rooms,
            { unitId: pendingUnitId, rateId, adults, children },
          ];

      await setParams({ rooms: nextRooms });
    },
    [adults, children, pendingUnitId, rooms, setParams]
  );

  const handleRemoveRoom = useCallback(
    async (index: number) => {
      const nextRooms = rooms.filter((_, roomIndex) => roomIndex !== index);

      await setParams({ rooms: nextRooms });

      if (nextRooms.length === 0) {
        setCartOpen(false);
      }
    },
    [rooms, setParams]
  );

  const handleAdultsChange = useCallback(
    async (index: number, nextAdults: number) => {
      const nextRooms = rooms.map((room, roomIndex) =>
        roomIndex === index ? { ...room, adults: nextAdults } : room
      );

      await setParams({ rooms: nextRooms });
    },
    [rooms, setParams]
  );

  const handleChildrenChange = useCallback(
    async (index: number, nextChildren: number) => {
      const nextRooms = rooms.map((room, roomIndex) =>
        roomIndex === index ? { ...room, children: nextChildren } : room
      );

      await setParams({ rooms: nextRooms });
    },
    [rooms, setParams]
  );

  const handleAddMore = useCallback(() => {
    setPendingUnitId(null);
    setCartOpen(false);
  }, []);

  const handleOpenCart = useCallback(() => {
    setPendingUnitId(null);
    setCartOpen(true);
  }, []);

  const handleCloseCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const handleContinue = useCallback(() => {
    if (!property || !checkinParam || cartLines.length === 0) return;

    router.push(
      `/book/payment?property=${encodeURIComponent(property)}&checkin=${checkinParam}&nights=${nights}`
    );
  }, [cartLines.length, checkinParam, nights, property, router]);

  if (!property || !checkin || !checkout) {
    return null;
  }

  const roomCount = availableRooms.length;
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
          <p className="py-10 text-center text-ink-muted">
            Failed to load room availability.
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3">
              <p className="text-center text-base font-semibold text-ink">
                {availabilityLabel}
              </p>
              {cartLines.length > 0 ? (
                <button
                  type="button"
                  onClick={handleOpenCart}
                  className="border-b border-ink text-caption font-semibold tracking-label text-ink"
                >
                  VIEW CART ({cartLines.length})
                </button>
              ) : null}
            </div>
            <div
              className={cn(
                "flex flex-col gap-6",
                roomCount === 0 && "py-10"
              )}
            >
              {roomCount === 0 ? (
                <p className="text-center text-ink-muted">
                  No rooms available for the selected dates.
                </p>
              ) : (
                availableRooms.map((room) => (
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

      {isDesktop ? (
        <CartDrawer
          open={cartOpen}
          onOpenChange={setCartOpen}
          propertyName={propertyName}
          dateRange={formatDateRange(checkin, checkout)}
          lines={cartLines}
          grandTotal={grandTotal}
          onRemove={handleRemoveRoom}
          onAdultsChange={handleAdultsChange}
          onChildrenChange={handleChildrenChange}
          onAddMore={handleAddMore}
          onContinue={handleContinue}
        />
      ) : (
        <CartMobile
          open={cartOpen}
          onClose={handleCloseCart}
          propertyName={propertyName}
          dateRange={formatDateRange(checkin, checkout)}
          nightsLabel={nightsLabel}
          lines={cartLines}
          grandTotal={grandTotal}
          pendingUnitRates={pendingUnitRates}
          pendingRateId={pendingRateId}
          persons={persons}
          nights={nights}
          onRemove={handleRemoveRoom}
          onAdultsChange={handleAdultsChange}
          onChildrenChange={handleChildrenChange}
          onSelectRate={handleRateChange}
          onAddMore={handleAddMore}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
