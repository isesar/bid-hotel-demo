import { Suspense } from "react";

import { RoomPicker } from "@/components/booking/room/room-picker";

export default function RoomsPage() {
  return (
    <Suspense>
      <RoomPicker />
    </Suspense>
  );
}
