"use client";

import { useCallback } from "react";
import {
  createParser,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  useQueryStates,
} from "nuqs";

export type RoomSelection = {
  unitId: string;
  rateId: string;
  adults: number;
  children: number;
};

const parseAsRoomSelections = createParser({
  parse(value) {
    if (!value) return null;

    const selections: RoomSelection[] = [];

    for (const segment of value.split(",")) {
      const [unitId, rateId, adultsRaw, childrenRaw] = segment.split(":");
      const adults = Number(adultsRaw);
      const children = Number(childrenRaw);

      if (
        !unitId ||
        !rateId ||
        !Number.isInteger(adults) ||
        adults < 1 ||
        !Number.isInteger(children) ||
        children < 0
      ) {
        return null;
      }

      selections.push({ unitId, rateId, adults, children });
    }

    return selections.length > 0 ? selections : null;
  },
  serialize(value) {
    return value
      .map(
        ({ unitId, rateId, adults, children }) =>
          `${unitId}:${rateId}:${adults}:${children}`
      )
      .join(",");
  },
});

const bookingParsers = {
  property: parseAsString.withDefault(""),
  checkin: parseAsIsoDate,
  nights: parseAsInteger,
  adults: parseAsInteger,
  children: parseAsInteger,
  rooms: parseAsRoomSelections,
};

const bookingDefaults = {
  nights: 1,
  adults: 2,
  children: 0,
  rooms: [] as RoomSelection[],
} as const;

const clearedBookingParams = {
  checkin: null,
  nights: null,
  adults: null,
  children: null,
  rooms: null,
} as const;

export function useBookingParams() {
  const [params, setParams] = useQueryStates(bookingParsers, {
    clearOnDefault: true,
  });

  return [
    {
      property: params.property,
      checkin: params.checkin,
      nights: params.nights ?? bookingDefaults.nights,
      adults: params.adults ?? bookingDefaults.adults,
      children: params.children ?? bookingDefaults.children,
      rooms: params.rooms ?? bookingDefaults.rooms,
    },
    setParams,
  ] as const;
}

export function usePropertySelection() {
  const [{ property }, setParams] = useBookingParams();

  const selectProperty = useCallback(
    (propertyId: string) =>
      setParams({
        property: propertyId,
        ...clearedBookingParams,
      }),
    [setParams]
  );

  return {
    property: property || null,
    selectProperty,
  };
}
