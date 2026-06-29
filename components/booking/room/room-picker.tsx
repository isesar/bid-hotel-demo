"use client";

import { addDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { formatDateRange } from "@/lib/booking/calendar-utils";
import { formatNightsLabel } from "@/lib/booking/format";
import { mergeRoomData } from "@/lib/booking/reservation-utils";
import { useBookingParams } from "@/lib/booking/search-params";
import { useBookingRouteGuard } from "@/hooks/use-booking-route-guard";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReservation } from "@/hooks/use-reservation";

import { CartDrawer } from "@/components/booking/cart/cart-drawer";
import { CartMobile } from "@/components/booking/cart/cart-mobile";
import { RoomAvailabilityHeader } from "@/components/booking/room/room-availability-header";
import { RoomListContent } from "@/components/booking/room/room-list-content";
import { RoomSearchSummary } from "@/components/booking/room/room-search-summary";
import { BOOKING_STEPS, Stepper } from "@/components/booking/stepper";
import { Skeleton } from "@/components/ui/skeleton";

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
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [{ property, checkin, nights, adults, children, rooms }, setParams] =
    useBookingParams();
  const { isReady } = useBookingRouteGuard({ requireCheckin: true });
  const [cartOpen, setCartOpen] = useState(false);
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);

  const {
    checkinParam,
    propertyName,
    cartLines,
    grandTotal,
    availabilityLoading,
    availabilityError,
    availabilityUnits,
    units,
  } = useReservation();

  const checkout = checkin ? addDays(checkin, nights) : null;
  const persons = adults + children;

  const availableRooms = useMemo(
    () => mergeRoomData(availabilityUnits, units),
    [availabilityUnits, units]
  );

  const pendingUnitRates = useMemo(() => {
    if (!pendingUnitId) return null;
    return availableRooms.find((room) => room.unitId === pendingUnitId)?.rates ?? null;
  }, [availableRooms, pendingUnitId]);

  const pendingRateId = useMemo(() => {
    if (!pendingUnitId) return null;
    return rooms.find((room) => room.unitId === pendingUnitId)?.rateId ?? null;
  }, [pendingUnitId, rooms]);

  const nightsLabel = formatNightsLabel(nights);

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

    const query = searchParams.toString();
    router.push(query ? `/book/payment?${query}` : "/book/payment");
  }, [cartLines.length, checkinParam, property, router, searchParams]);

  if (!isReady || !property || !checkin || !checkout) {
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
            <RoomAvailabilityHeader
              availabilityLabel={availabilityLabel}
              cartCount={cartLines.length}
              onOpenCart={handleOpenCart}
            />
            <RoomListContent
              availableRooms={availableRooms}
              persons={persons}
              nights={nights}
              onSelect={handleSelect}
            />
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
