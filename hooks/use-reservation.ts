"use client";

import { format } from "date-fns";
import { useMemo } from "react";

import {
  buildCartLines,
  buildRateLookup,
  computeGrandTotal,
} from "@/lib/booking/reservation-utils";
import { useBookingParams } from "@/lib/booking/search-params";
import {
  useAvailability,
  useProperties,
  useUnits,
} from "@/hooks/use-booking-queries";

export function useReservation() {
  const [{ property, checkin, nights, rooms }] = useBookingParams();

  const checkinParam = checkin ? format(checkin, "yyyy-MM-dd") : null;

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

  const rateLookup = useMemo(
    () =>
      buildRateLookup(
        availabilityData?.units ?? [],
        unitsData?.units ?? []
      ),
    [availabilityData?.units, unitsData?.units]
  );

  const cartLines = useMemo(
    () => buildCartLines(rooms, rateLookup),
    [rateLookup, rooms]
  );

  const grandTotal = useMemo(
    () => computeGrandTotal(cartLines),
    [cartLines]
  );

  return {
    property,
    checkin,
    nights,
    rooms,
    checkinParam,
    propertyName,
    cartLines,
    grandTotal,
    availabilityLoading,
    availabilityError,
    availabilityUnits: availabilityData?.units ?? [],
    units: unitsData?.units ?? [],
  };
}
