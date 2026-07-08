"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  accommodationPath,
  useBookingParams,
} from "@/lib/booking/search-params";

type BookingRouteGuardOptions = {
  requireCheckin?: boolean;
  requireRooms?: boolean;
};

export function useBookingRouteGuard({
  requireCheckin = false,
  requireRooms = false,
}: BookingRouteGuardOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [{ property, checkin, rooms }] = useBookingParams();

  useEffect(() => {
    if (!property) {
      router.replace(accommodationPath());
      return;
    }

    if (requireCheckin && !checkin) {
      router.replace(
        `/book/calendar?property=${encodeURIComponent(property)}`
      );
      return;
    }

    if (requireRooms && rooms.length === 0) {
      const query = searchParams.toString();
      router.replace(query ? `/book/rooms?${query}` : "/book/rooms");
    }
  }, [
    checkin,
    property,
    requireCheckin,
    requireRooms,
    rooms.length,
    router,
    searchParams,
  ]);

  const isReady =
    Boolean(property) &&
    (!requireCheckin || Boolean(checkin)) &&
    (!requireRooms || rooms.length > 0);

  return { property, checkin, rooms, isReady };
}
