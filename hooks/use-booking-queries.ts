"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAvailability,
  getCalendar,
  listProperties,
  listUnits,
} from "@/lib/booking/api";

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
  end: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: ["calendar", propertyId, start, end],
    queryFn: () => getCalendar(propertyId!, start!, end!),
    enabled: enabled && Boolean(propertyId && start && end),
    staleTime: STALE_TIME,
  });
}

export function useAvailability(
  propertyId: string | null,
  checkin: string | null,
  nights: number | null
) {
  return useQuery({
    queryKey: ["availability", propertyId, checkin, nights],
    queryFn: () => getAvailability(propertyId!, checkin!, nights!),
    enabled: Boolean(propertyId && checkin && nights && nights > 0),
    staleTime: STALE_TIME,
  });
}
