"use client";

import { RoomCard, type RoomCardData } from "@/components/booking/room/room-card";
import { cn } from "@/lib/utils";

type RoomListContentProps = {
  availableRooms: RoomCardData[];
  persons: number;
  nights: number;
  onSelect: (unitId: string, rateId: string) => void;
};

export function RoomListContent({
  availableRooms,
  persons,
  nights,
  onSelect,
}: RoomListContentProps) {
  const roomCount = availableRooms.length;

  return (
    <div
      className={cn("flex flex-col gap-6", roomCount === 0 && "py-10")}
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
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}
