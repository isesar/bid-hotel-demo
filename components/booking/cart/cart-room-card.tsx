"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { formatBoardType, formatEuro } from "@/lib/booking/format";
import type { RoomSelection } from "@/lib/booking/search-params";
import { cn } from "@/lib/utils";

import { OccupancyStepper } from "@/components/booking/cart/occupancy-stepper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type CartRoomLine = RoomSelection & {
  name: string;
  rateName: string;
  boardType: string;
  total: number;
  occupancyMax: number;
};

type CartRoomCardProps = {
  line: CartRoomLine;
  onRemove: () => void;
  onAdultsChange: (adults: number) => void;
  onChildrenChange: (children: number) => void;
  layout?: "desktop" | "mobile";
  propertyName?: string;
};

export function CartRoomCard({
  line,
  onRemove,
  onAdultsChange,
  onChildrenChange,
  layout = "desktop",
  propertyName,
}: CartRoomCardProps) {
  const maxOccupancy = line.occupancyMax;
  const isMobile = layout === "mobile";

  return (
    <div className="border border-line bg-white">
      <div className="flex items-start justify-between gap-2 px-4 py-2">
        <div className="min-w-0 flex-1">
          {isMobile && propertyName ? (
            <p className="text-caption leading-[18px] tracking-label text-ink-muted">
              {propertyName}
            </p>
          ) : null}
          <p className="text-base font-semibold leading-6 tracking-label text-ink">
            {line.name}
          </p>
          <p
            className={cn(
              "text-caption tracking-label text-ink-muted",
              isMobile ? "leading-[18px]" : "leading-4"
            )}
          >
            {line.rateName}
          </p>
          <p className="text-caption leading-[18px] tracking-label text-ink-muted">
            {formatBoardType(line.boardType)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove ${line.name}`}
          className="shrink-0 text-ink hover:bg-transparent"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-6" />
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        <OccupancyStepper
          label="Adults"
          value={line.adults}
          min={1}
          max={maxOccupancy - line.children}
          onChange={onAdultsChange}
        />
        <OccupancyStepper
          label="Children"
          sublabel="less than 18 y.o."
          value={line.children}
          min={0}
          max={maxOccupancy - line.adults}
          onChange={onChildrenChange}
        />

        {isMobile ? (
          <div className="flex justify-end gap-1">
            <p className="text-base font-semibold leading-6 tracking-label text-ink">
              Total
            </p>
            <p className="text-base font-semibold leading-6 tracking-label text-ink">
              {formatEuro(line.total)}
            </p>
          </div>
        ) : (
          <>
            <Separator className="bg-line" />

            <div className="flex items-center justify-between">
              <p className="text-base font-semibold leading-6 tracking-label text-ink">
                Total
              </p>
              <p className="text-base font-semibold leading-6 tracking-label text-ink">
                {formatEuro(line.total)}
              </p>
            </div>

            <Button
              type="button"
              variant="link"
              className="h-auto self-end  rounded-none p-2 text-caption tracking-label text-ink underline hover:pointer"
            >
              Rate details
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
