"use client";

import { useQuery } from "@tanstack/react-query";

import { listProperties, listUnits } from "@/lib/booking/api";

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
