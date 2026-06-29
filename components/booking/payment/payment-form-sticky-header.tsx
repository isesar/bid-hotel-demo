"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { OrderSummary } from "@/components/booking/payment/order-summary";
import { BOOKING_STEPS, Stepper } from "@/components/booking/stepper";
import { Button } from "@/components/ui/button";

type PaymentFormStickyHeaderProps = {
  onBack: () => void;
  propertyName: string;
  dateRange: string;
  nightsLabel: string;
  roomCount: number;
  grandTotal: number;
};

export function PaymentFormStickyHeader({
  onBack,
  propertyName,
  dateRange,
  nightsLabel,
  roomCount,
  grandTotal,
}: PaymentFormStickyHeaderProps) {
  return (
    <div className="sticky top-0 z-30 flex flex-col bg-white">
      <div className="flex h-[72px] items-center justify-between bg-ink px-4 pt-6 pb-2 md:hidden">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-auto gap-1 rounded-none p-2 text-white hover:bg-transparent hover:text-white"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-6"
          />
          <span className="border-b border-white text-caption font-semibold tracking-label">
            BACK
          </span>
        </Button>
      </div>

      <Stepper steps={[...BOOKING_STEPS]} activeStep={1} />

      <OrderSummary
        variant="banner"
        propertyName={propertyName}
        dateRange={dateRange}
        nightsLabel={nightsLabel}
        roomCount={roomCount}
        grandTotal={grandTotal}
      />

      <div className="hidden bg-surface p-4 md:block">
        <p className="text-base font-semibold leading-6 tracking-label text-ink">
          {propertyName}
        </p>
        <p className="text-base leading-6 tracking-label text-ink-muted">
          {dateRange}{" "}
          <span className="text-ink-muted">({nightsLabel})</span>
        </p>
      </div>
    </div>
  );
}
