"use client";

import { useQuery } from "@tanstack/react-query";

import { getCalendar, listProperties, listUnits } from "@/lib/booking/api";

const STALE_TIME = 5 * 60_000;

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: listProperties,
    staleTime: STALE_TIME,
  });
}

export function useUnits(propertyId: string | null) {
  return useQuery({
    queryKey: ["units", propertyId],
    queryFn: () => listUnits(propertyId!),
    enabled: Boolean(propertyId),
    staleTime: STALE_TIME,
  });
}

export function useCalendar(
  propertyId: string | null,
  start: string | null,
  end: string | null
) {
  return useQuery({
    queryKey: ["calendar", propertyId, start, end],
    queryFn: () => getCalendar(propertyId!, start!, end!),
    enabled: Boolean(propertyId && start && end),
    staleTime: STALE_TIME,
  });
}
