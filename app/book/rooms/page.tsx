import { Suspense } from "react";

import { RoomPicker } from "@/components/booking/room-picker";

export default function RoomsPage() {
  return (
    <Suspense>
      <RoomPicker />
    </Suspense>
  );
}
