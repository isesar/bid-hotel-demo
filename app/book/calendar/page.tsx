import { CalendarPicker } from "@/components/booking/calendar-picker";
import { Suspense } from "react";

export default function CalendarPage() {
  return (
    <Suspense>
      <CalendarPicker />
    </Suspense>
  );
}
