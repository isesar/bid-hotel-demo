"use client";

import { formatDateRange } from "@/lib/booking/calendar-utils";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type CalendarConfirmBarProps = {
  nights: number | null;
  from: Date | null;
  to: Date | null;
  onConfirm: () => void;
  disabled?: boolean;
  layout: "desktop" | "mobile";
  className?: string;
};

export function CalendarConfirmBar({
  nights,
  from,
  to,
  onConfirm,
  disabled = false,
  layout,
  className,
}: CalendarConfirmBarProps) {
  const hasRange = Boolean(from && to && nights);

  if (layout === "desktop") {
    return (
      <div
        className={cn(
          "flex items-center justify-end gap-4 border-t border-[#c6c6c6] px-6 py-4",
          className
        )}
      >
        {hasRange ? (
          <div className="mr-auto text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2px] text-[#5e5e5e]">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"}
            </p>
            <p className="text-base font-semibold tracking-[0.2px] text-[#1f1f1f]">
              {formatDateRange(from!, to!)}
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          onClick={onConfirm}
          disabled={disabled || !hasRange}
          className="h-12 min-w-[140px] rounded-none bg-[#1f1f1f] px-8 text-sm font-semibold tracking-[0.2px] text-white hover:bg-[#1f1f1f]/90 disabled:bg-[#c6c6c6]"
        >
          CONFIRM
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-t border-[#c6c6c6] bg-white px-4 py-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {hasRange ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2px] text-[#5e5e5e]">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"}
            </p>
            <p className="truncate text-base font-semibold tracking-[0.2px] text-[#1f1f1f]">
              {formatDateRange(from!, to!)}
            </p>
          </>
        ) : (
          <p className="text-sm tracking-[0.2px] text-[#5e5e5e]">
            Select check-in and check-out dates
          </p>
        )}
      </div>
      <Button
        type="button"
        onClick={onConfirm}
        disabled={disabled || !hasRange}
        className="h-12 shrink-0 rounded-none bg-[#1f1f1f] px-8 text-sm font-semibold tracking-[0.2px] text-white hover:bg-[#1f1f1f]/90 disabled:bg-[#c6c6c6]"
      >
        CONFIRM
      </Button>
    </div>
  );
}
