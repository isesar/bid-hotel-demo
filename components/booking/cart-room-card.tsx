"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { formatBoardType, formatEuro } from "@/lib/booking/format";
import type { RoomSelection } from "@/lib/booking/search-params";
import { cn } from "@/lib/utils";

import { OccupancyStepper } from "@/components/booking/occupancy-stepper";

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
    <div className="border border-[#c6c6c6] bg-white">
      <div className="flex items-start justify-between gap-2 px-4 py-2">
        <div className="min-w-0 flex-1">
          {isMobile && propertyName ? (
            <p className="text-[13px] leading-[18px] tracking-[0.2px] text-[#5e5e5e]">
              {propertyName}
            </p>
          ) : null}
          <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
            {line.name}
          </p>
          <p
            className={cn(
              "text-[13px] tracking-[0.2px] text-[#5e5e5e]",
              isMobile ? "leading-[18px]" : "leading-4"
            )}
          >
            {line.rateName}
          </p>
          <p className="text-[13px] leading-[18px] tracking-[0.2px] text-[#5e5e5e]">
            {formatBoardType(line.boardType)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${line.name}`}
          className="shrink-0 p-1 text-[#1f1f1f]"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-6" />
        </button>
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
            <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
              Total
            </p>
            <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
              {formatEuro(line.total)}
            </p>
          </div>
        ) : (
          <>
            <div className="h-px w-full bg-[#c6c6c6]" />

            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
                Total
              </p>
              <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
                {formatEuro(line.total)}
              </p>
            </div>

            <button
              type="button"
              className="self-end border-b border-[#1f1f1f] text-[13px] tracking-[0.2px] text-[#1f1f1f]"
            >
              Rate details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
