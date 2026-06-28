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
          "flex items-center justify-end gap-4 border-t border-line px-6 py-4",
          className
        )}
      >
        {hasRange ? (
          <div className="mr-auto text-left">
            <p className="text-mini font-semibold uppercase tracking-label text-ink-muted">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"}
            </p>
            <p className="text-base font-semibold tracking-label text-ink">
              {formatDateRange(from!, to!)}
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          onClick={onConfirm}
          disabled={disabled || !hasRange}
          className="h-12 min-w-[140px] rounded-none bg-ink px-8 text-sm font-semibold tracking-label text-white hover:bg-ink/90 disabled:bg-line"
        >
          CONFIRM
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-t border-line bg-white px-4 py-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {hasRange ? (
          <>
            <p className="text-mini font-semibold uppercase tracking-label text-ink-muted">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"}
            </p>
            <p className="truncate text-base font-semibold tracking-label text-ink">
              {formatDateRange(from!, to!)}
            </p>
          </>
        ) : (
          <p className="text-sm tracking-label text-ink-muted">
            Select check-in and check-out dates
          </p>
        )}
      </div>
      <Button
        type="button"
        onClick={onConfirm}
        disabled={disabled || !hasRange}
        className="h-12 shrink-0 rounded-none bg-ink px-8 text-sm font-semibold tracking-label text-white hover:bg-ink/90 disabled:bg-line"
      >
        CONFIRM
      </Button>
    </div>
  );
}
