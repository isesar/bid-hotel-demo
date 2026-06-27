"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

import { formatEuro } from "@/lib/booking/format";

import {
  CartRoomCard,
  type CartRoomLine,
} from "@/components/booking/cart-room-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
  dateRange: string;
  lines: CartRoomLine[];
  grandTotal: number;
  onRemove: (index: number) => void;
  onAdultsChange: (index: number, adults: number) => void;
  onChildrenChange: (index: number, children: number) => void;
  onAddMore: () => void;
  onContinue: () => void;
};

export function CartDrawer({
  open,
  onOpenChange,
  propertyName,
  dateRange,
  lines,
  grandTotal,
  onRemove,
  onAdultsChange,
  onChildrenChange,
  onAddMore,
  onContinue,
}: CartDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="bg-[rgba(31,31,31,0.2)] backdrop-blur-[10px] supports-backdrop-filter:backdrop-blur-[10px]"
        className="flex w-full flex-col gap-0 rounded-none border-l border-[#c6c6c6] bg-[#f3f3f3] p-0 sm:max-w-[332px]"
      >
        <SheetTitle className="sr-only">Booking cart</SheetTitle>
        <SheetDescription className="sr-only">
          Selected rooms for {propertyName}
        </SheetDescription>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <p className="font-serif text-[23px] leading-[31px] tracking-[0.2px] text-[#1f1f1f]">
                  {propertyName}
                </p>
                <button
                  type="button"
                  aria-label="Property information"
                  className="mt-1 shrink-0 text-[#1f1f1f]"
                >
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    strokeWidth={2}
                    className="size-6"
                  />
                </button>
              </div>
              <p className="text-[13px] leading-[18px] tracking-[0.2px] text-[#5e5e5e]">
                {dateRange}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {lines.map((line, index) => (
                <CartRoomCard
                  key={`${line.unitId}:${line.rateId}:${index}`}
                  line={line}
                  onRemove={() => onRemove(index)}
                  onAdultsChange={(adults) => onAdultsChange(index, adults)}
                  onChildrenChange={(children) =>
                    onChildrenChange(index, children)
                  }
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-[#c6c6c6] bg-[#f3f3f3] px-4 pb-4 pt-4">
            <button
              type="button"
              onClick={onAddMore}
              className="mb-4 w-full text-center text-[13px] font-semibold tracking-[0.2px] text-[#1f1f1f]"
            >
              ADD MORE ROOMS +
            </button>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
                Total
              </p>
              <p className="text-[16px] font-semibold leading-6 tracking-[0.2px] text-[#1f1f1f]">
                {formatEuro(grandTotal)}
              </p>
            </div>

            <button
              type="button"
              onClick={onContinue}
              disabled={lines.length === 0}
              className="flex h-14 w-full items-center justify-between bg-[#1f1f1f] px-6 text-white disabled:cursor-not-allowed disabled:bg-[#c6c6c6]"
            >
              <span className="text-[16px] font-semibold leading-6 tracking-[0.2px]">
                Total: {formatEuro(grandTotal)}
              </span>
              <span className="text-[16px] font-semibold leading-6 tracking-[0.2px]">
                CONTINUE
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
