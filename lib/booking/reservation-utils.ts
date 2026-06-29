import type { CartRoomLine } from "@/components/booking/cart/cart-room-card";
import type { RoomCardData } from "@/components/booking/room/room-card";
import type { AvailabilityUnit, Rate, Unit } from "@/lib/booking/types";
import type { RoomSelection } from "@/lib/booking/search-params";

export function buildRateLookup(
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

export function buildCartLines(
  rooms: RoomSelection[],
  rateLookup: ReturnType<typeof buildRateLookup>
): CartRoomLine[] {
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
}

export function computeGrandTotal(cartLines: CartRoomLine[]) {
  return cartLines.reduce((sum, line) => sum + line.total, 0);
}

export function mergeRoomData(
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
