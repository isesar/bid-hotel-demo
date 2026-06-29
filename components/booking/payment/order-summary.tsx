"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { formatEuro } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

type OrderSummaryProps = {
  propertyName: string;
  dateRange: string;
  nightsLabel: string;
  roomCount: number;
  grandTotal: number;
  variant?: "sidebar" | "footer" | "banner";
  className?: string;
};

export function OrderSummary({
  propertyName,
  dateRange,
  nightsLabel,
  roomCount,
  grandTotal,
  variant = "sidebar",
  className,
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const roomLabel = roomCount === 1 ? "1 Room" : `${roomCount} Rooms`;

  if (variant === "banner") {
    return (
      <div className={cn("bg-surface p-4 md:hidden", className)}>
        <p className="text-base font-semibold leading-6 tracking-label text-ink">
          {propertyName}
        </p>
        <p className="text-base leading-6 tracking-label text-ink-muted">
          {dateRange}{" "}
          <span className="text-ink-muted">({nightsLabel})</span>
        </p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-4 py-6 md:hidden",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center gap-4 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="text-caption font-semibold leading-4 tracking-label text-ink">
              {propertyName} • {roomLabel}
            </p>
            <p className="text-caption leading-[18px] tracking-label text-ink">
              {dateRange} ({nightsLabel})
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-caption leading-[18px] tracking-label text-ink">
              TOTAL
            </p>
            <p className="text-title font-semibold leading-none tracking-label text-ink">
              {formatEuro(grandTotal)}
            </p>
          </div>
          <HugeiconsIcon
            icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
            strokeWidth={2}
            className="size-6 shrink-0 text-ink"
          />
        </button>
        {expanded ? (
          <div className="mt-4 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <span className="text-caption tracking-label text-ink-muted">
                Reservation total
              </span>
              <span className="text-base font-semibold tracking-label text-ink">
                {formatEuro(grandTotal)}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "hidden w-full max-w-[332px] shrink-0 flex-col gap-4 border border-line bg-surface p-4 md:flex",
        className
      )}
    >
      <div>
        <p className="font-serif text-title leading-[31px] tracking-label text-ink">
          {propertyName}
        </p>
        <p className="text-caption leading-[18px] tracking-label text-ink-muted">
          {dateRange} ({nightsLabel})
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="text-base font-semibold leading-6 tracking-label text-ink">
          Total
        </span>
        <span className="text-base font-semibold leading-6 tracking-label text-ink">
          {formatEuro(grandTotal)}
        </span>
      </div>
      <p className="text-caption tracking-label text-ink-muted">
        {roomLabel}
      </p>
    </aside>
  );
}
