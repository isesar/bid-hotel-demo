"use client";

import { useRouter } from "next/navigation";

import { formatDateRange } from "@/lib/booking/calendar-utils";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type RoomSearchSummaryProps = {
  propertyName: string;
  checkin: Date;
  checkout: Date;
  nights: number;
  propertyId: string;
  className?: string;
};

export function RoomSearchSummary({
  propertyName,
  checkin,
  checkout,
  nights,
  propertyId,
  className,
}: RoomSearchSummaryProps) {
  const router = useRouter();
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-center justify-between bg-white p-4 md:hidden",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="size-8 shrink-0 text-[#1f1f1f]"
        />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-[0.2px] text-[#1f1f1f]">
            {propertyName}
          </p>
          <p className="truncate text-[13px] tracking-[0.2px] text-[#5e5e5e]">
            {formatDateRange(checkin, checkout)} ({nightLabel})
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          router.push(
            `/book/calendar?property=${encodeURIComponent(propertyId)}`
          )
        }
        className="shrink-0 border-b border-[#1f1f1f] p-2 text-[13px] font-semibold tracking-[0.2px] text-[#1f1f1f]"
      >
        EDIT
      </button>
    </div>
  );
}
