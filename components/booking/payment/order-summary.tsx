"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import type { CartRoomLine } from "@/components/booking/cart/cart-room-card";
import { formatBoardType, formatEuro } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

type OrderSummaryProps = {
  propertyName: string;
  dateRange: string;
  nightsLabel: string;
  lines: CartRoomLine[];
  grandTotal: number;
  variant?: "sidebar" | "footer" | "banner";
  className?: string;
};

function RoomSummaryCard({
  line,
  index,
}: {
  line: CartRoomLine;
  index: number;
}) {
  return (
    <div className="flex w-full flex-col bg-white">
      <div className="flex flex-col gap-2 border border-line px-4 py-2">
        <div className="flex flex-col gap-1">
          <p className="text-base leading-6 tracking-label text-ink">
            <span className="font-normal">Room {index + 1}: </span>
            <span className="font-semibold">{line.name}</span>
          </p>
          <p className="text-caption font-semibold leading-4 tracking-label text-ink-muted">
            {line.rateName}
          </p>
          <p className="text-caption leading-[18px] tracking-label text-ink">
            {formatBoardType(line.boardType)}
          </p>
        </div>
        <div className="flex gap-4 text-base leading-6 tracking-label text-ink">
          <span>Adults: {line.adults}</span>
          <span>Children: {line.children}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-line p-4">
        <div className="flex items-start justify-between text-caption leading-[18px] tracking-label text-ink">
          <span>Room Price</span>
          <span>{formatEuro(line.total)}</span>
        </div>
        <div className="flex items-center justify-between text-base leading-6 tracking-label text-ink">
          <span className="font-semibold">Total</span>
          <span>{formatEuro(line.total)}</span>
        </div>
      </div>
    </div>
  );
}

function ReservationHeader({
  propertyName,
  dateRange,
  nightsLabel,
  showTitle = false,
}: {
  propertyName: string;
  dateRange: string;
  nightsLabel: string;
  showTitle?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {showTitle ? (
        <p className="text-caption font-semibold leading-4 tracking-label text-ink-muted">
          RESERVATION SUMMARY
        </p>
      ) : null}
      <p className="font-serif text-title leading-[31px] tracking-label text-ink">
        {propertyName}
      </p>
      <p className="text-base leading-6 tracking-label text-ink-muted">
        {dateRange} ({nightsLabel})
      </p>
    </div>
  );
}

function RoomSummaryList({ lines }: { lines: CartRoomLine[] }) {
  return (
    <div className="flex flex-col gap-4">
      {lines.map((line, index) => (
        <RoomSummaryCard
          key={`${line.unitId}-${line.rateId}-${index}`}
          line={line}
          index={index}
        />
      ))}
    </div>
  );
}

function GrandTotalRow({ grandTotal }: { grandTotal: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-serif text-title leading-[31px] tracking-label text-ink">
        Total
      </span>
      <span className="text-title font-semibold leading-[31px] tracking-label text-ink">
        {formatEuro(grandTotal)}
      </span>
    </div>
  );
}

export function OrderSummary({
  propertyName,
  dateRange,
  nightsLabel,
  lines,
  grandTotal,
  variant = "sidebar",
  className,
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const roomCount = lines.length;
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
          <div className="mt-4 flex max-h-[50vh] flex-col gap-4 overflow-y-auto border-t border-line pt-4">
            <RoomSummaryList lines={lines} />
            <GrandTotalRow grandTotal={grandTotal} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "hidden w-full max-w-[332px] shrink-0 flex-col gap-4 bg-surface py-4 md:flex",
        className
      )}
    >
      <div className="px-4">
        <ReservationHeader
          propertyName={propertyName}
          dateRange={dateRange}
          nightsLabel={nightsLabel}
          showTitle
        />
      </div>
      <div className="flex max-h-[calc(100vh-16rem)] flex-col gap-4 overflow-y-auto px-4">
        <RoomSummaryList lines={lines} />
      </div>
      <div className="border-t border-line px-4 pt-4">
        <GrandTotalRow grandTotal={grandTotal} />
      </div>
    </aside>
  );
}
