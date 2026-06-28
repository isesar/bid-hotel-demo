"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { formatEuro } from "@/lib/booking/format";
import type { Rate } from "@/lib/booking/types";

import { CartRatePicker } from "@/components/booking/cart/cart-rate-picker";
import {
  CartRoomCard,
  type CartRoomLine,
} from "@/components/booking/cart/cart-room-card";

type CartMobileProps = {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  dateRange: string;
  nightsLabel: string;
  lines: CartRoomLine[];
  grandTotal: number;
  pendingUnitRates: Rate[] | null;
  pendingRateId: string | null;
  persons: number;
  nights: number;
  onRemove: (index: number) => void;
  onAdultsChange: (index: number, adults: number) => void;
  onChildrenChange: (index: number, children: number) => void;
  onSelectRate: (rateId: string) => void;
  onAddMore: () => void;
  onContinue: () => void;
};

export function CartMobile({
  open,
  onClose,
  propertyName,
  dateRange,
  nightsLabel,
  lines,
  grandTotal,
  pendingUnitRates,
  pendingRateId,
  persons,
  nights,
  onRemove,
  onAdultsChange,
  onChildrenChange,
  onSelectRate,
  onAddMore,
  onContinue,
}: CartMobileProps) {
  if (!open) return null;

  const showRatePicker = pendingUnitRates && pendingUnitRates.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
      <div className="sticky top-0 z-10 shrink-0 shadow-[0px_4px_9.5px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-end bg-ink p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-white"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-6" />
          </button>
        </div>
        <div className="bg-surface p-4">
          <p className="text-base font-semibold leading-6 tracking-label text-ink">
            {propertyName}
          </p>
          <p className="text-base leading-6 tracking-label text-ink-muted">
            {dateRange}{" "}
            <span className="text-ink-muted">({nightsLabel})</span>
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-28">
        {showRatePicker ? (
          <CartRatePicker
            rates={pendingUnitRates}
            selectedRateId={pendingRateId}
            persons={persons}
            nights={nights}
            onSelectRate={onSelectRate}
          />
        ) : null}

        <section className="px-4 py-6">
          <p className="mb-4 text-center text-base font-semibold leading-6 text-ink">
            SELECTED ROOM(S)
          </p>
          {lines.length === 0 ? (
            <p className="py-6 text-center text-caption tracking-label text-ink-muted">
              No rooms selected yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {lines.map((line, index) => (
                <CartRoomCard
                  key={`${line.unitId}:${line.rateId}:${index}`}
                  line={line}
                  layout="mobile"
                  propertyName={index > 0 ? propertyName : undefined}
                  onRemove={() => onRemove(index)}
                  onAdultsChange={(adults) => onAdultsChange(index, adults)}
                  onChildrenChange={(children) =>
                    onChildrenChange(index, children)
                  }
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onAddMore}
            className="mt-6 flex w-full items-center justify-center gap-1"
          >
            <span className="border-b border-ink text-caption font-semibold tracking-label text-ink">
              ADD MORE ROOMS
            </span>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="size-4 text-ink"
            />
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white px-4 pb-6 pt-6 md:hidden">
        <button
          type="button"
          onClick={onContinue}
          disabled={lines.length === 0}
          className="flex h-14 w-full items-center justify-between bg-ink px-6 text-white disabled:cursor-not-allowed disabled:bg-line"
        >
          <span className="text-base font-semibold leading-6 tracking-label">
            Total: {formatEuro(grandTotal)}
          </span>
          <span className="text-base font-semibold leading-6 tracking-label">
            CONTINUE
          </span>
        </button>
      </div>
    </div>
  );
}
