"use client";

import { formatBoardType, formatEuro } from "@/lib/booking/format";
import type { Rate } from "@/lib/booking/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const RATE_POLICY_LINES = [
  "Pay at the Property",
  "Free Cancellation 7 Days Prior to Arrival Date",
  "Rate Includes 50 euro credit for bars and restaurants",
] as const;

type CartRatePickerProps = {
  rates: Rate[];
  selectedRateId: string | null;
  persons: number;
  nights: number;
  onSelectRate: (rateId: string) => void;
};

function RatePolicyText({ boardType }: { boardType: string }) {
  return (
    <div className="pl-6 text-[13px] tracking-[0.2px] text-[#5e5e5e]">
      <p className="leading-[18px]">{formatBoardType(boardType)}</p>
      <p className="leading-[18px]">
        {RATE_POLICY_LINES.map((line, index) => (
          <span key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

function RateOption({
  rate,
  persons,
  nights,
  isFirst,
}: {
  rate: Rate;
  persons: number;
  nights: number;
  isFirst: boolean;
}) {
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  const personLabel = persons === 1 ? "1 person" : `${persons} persons`;

  return (
    <label
      htmlFor={rate.rateId}
      className="flex cursor-pointer flex-col gap-2 border border-[#c6c6c6] p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <RadioGroupItem
            id={rate.rateId}
            value={rate.rateId}
            className="size-4 shrink-0 rounded-full border-[#c6c6c6] data-checked:border-[#1f1f1f] data-checked:bg-[#1f1f1f] data-checked:text-white"
          />
          <p className="text-[16px] font-semibold leading-6 text-[#1f1f1f]">
            {rate.rateName}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[16px] font-semibold leading-6 text-[#1f1f1f]">
            {formatEuro(rate.totalPrice)}
          </p>
          <p className="text-[13px] tracking-[0.2px] text-[#5e5e5e]">
            {personLabel}, {nightLabel}
          </p>
        </div>
      </div>
      {isFirst ? (
        <RatePolicyText boardType={rate.boardType} />
      ) : (
        <div className="flex items-center gap-1 pl-6">
          <span className="text-[13px] tracking-[0.2px] text-[#1f1f1f]">
            Show rate details
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="size-4 text-[#1f1f1f]"
          />
        </div>
      )}
    </label>
  );
}

export function CartRatePicker({
  rates,
  selectedRateId,
  persons,
  nights,
  onSelectRate,
}: CartRatePickerProps) {
  if (rates.length === 0) return null;

  return (
    <section className="border-b border-t border-[#c6c6c6] px-4 py-6">
      <p className="mb-4 text-center text-[16px] font-semibold leading-6 text-[#1f1f1f]">
        CHOOSE RATE
      </p>
      <RadioGroup
        value={selectedRateId ?? undefined}
        onValueChange={onSelectRate}
        className="gap-4"
      >
        {rates.map((rate, index) => (
          <RateOption
            key={rate.rateId}
            rate={rate}
            persons={persons}
            nights={nights}
            isFirst={index === 0}
          />
        ))}
      </RadioGroup>
    </section>
  );
}
