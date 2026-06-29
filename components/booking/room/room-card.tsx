"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { formatBoardType, formatEuro, formatNightsLabel } from "@/lib/booking/format";
import type { Rate } from "@/lib/booking/types";

import { Button } from "@/components/ui/button";

const RATE_POLICY_LINES = [
  "Pay at the Property",
  "Free Cancellation 7 Days Prior to Arrival Date",
  "Rate Includes 50 euro credit for bars and restaurants",
] as const;

const INITIAL_RATES_VISIBLE = 2;

export type RoomCardData = {
  unitId: string;
  name: string;
  image: string;
  unitsAvailable: number;
  occupancyMax: number;
  rates: Rate[];
};

type RoomCardProps = {
  room: RoomCardData;
  persons: number;
  nights: number;
  onSelect: (unitId: string, rateId: string) => void;
};

function AvailabilityBadge({ unitsAvailable }: { unitsAvailable: number }) {
  const label =
    unitsAvailable === 1 ? "1 room left" : `${unitsAvailable} rooms left`;

  return (
    <div className="bg-surface p-2">
      <p className="text-caption font-normal uppercase tracking-label text-alert">
        {label}
      </p>
    </div>
  );
}

function RatePolicyText({ boardType }: { boardType: string }) {
  return (
    <div className="text-caption tracking-label text-ink-muted">
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

function DesktopRateRow({
  rate,
  persons,
  nights,
  onSelect,
}: {
  rate: Rate;
  persons: number;
  nights: number;
  onSelect: () => void;
}) {
  const nightLabel = formatNightsLabel(nights);
  const personLabel = persons === 1 ? "1 person" : `${persons} persons`;

  return (
    <div className="flex items-end gap-2 border border-line p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-base font-semibold leading-6 text-ink">
          {rate.rateName}
        </p>
        <RatePolicyText boardType={rate.boardType} />
      </div>
      <div className="flex h-full flex-col items-end justify-between self-stretch">
        <div className="text-right">
          <p className="text-base font-semibold leading-6 text-ink">
            {formatEuro(rate.totalPrice)}
          </p>
          <p className="text-caption tracking-label text-ink-muted">
            {personLabel}, {nightLabel}
          </p>
        </div>
        <Button
          type="button"
          onClick={onSelect}
          className="h-auto rounded-none bg-ink px-4 py-2 text-caption font-normal tracking-label text-surface hover:bg-ink/90"
        >
          SELECT
        </Button>
      </div>
    </div>
  );
}

function DesktopRoomCard({
  room,
  persons,
  nights,
  onSelect,
}: RoomCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleRates = expanded
    ? room.rates
    : room.rates.slice(0, INITIAL_RATES_VISIBLE);
  const hasMoreRates = room.rates.length > INITIAL_RATES_VISIBLE;

  return (
    <div className="hidden flex-col border border-line bg-white md:flex">
      <div className="flex w-full gap-4">
        <div className="relative h-[318px] min-w-0 flex-1">
          <Image
            src={room.image}
            alt={room.name}
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-4 py-6">
          <p className="font-serif text-title tracking-label text-ink">
            {room.name}
          </p>
          <AvailabilityBadge unitsAvailable={room.unitsAvailable} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {visibleRates.map((rate) => (
          <DesktopRateRow
            key={rate.rateId}
            rate={rate}
            persons={persons}
            nights={nights}
            onSelect={() => onSelect(room.unitId, rate.rateId)}
          />
        ))}
        {hasMoreRates && !expanded ? (
          <Button
            type="button"
            variant="link"
            onClick={() => setExpanded(true)}
            className="mx-auto h-auto rounded-none border-b border-ink p-2 text-caption font-semibold tracking-label text-ink no-underline hover:no-underline"
          >
            LOAD MORE
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function MobileRoomCard({ room, onSelect }: RoomCardProps) {
  const cheapestRate = useMemo(() => {
    if (room.rates.length === 0) return null;
    return room.rates.reduce((min, rate) =>
      rate.totalPrice < min.totalPrice ? rate : min
    );
  }, [room.rates]);

  return (
    <div className="flex flex-col border border-line bg-white md:hidden">
      <div className="relative h-[273px] w-full">
        <Image
          src={room.image}
          alt={room.name}
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-4">
        <AvailabilityBadge unitsAvailable={room.unitsAvailable} />
        <p className="font-serif text-title tracking-label text-ink">
          {room.name}
        </p>
        <div className="flex border border-line bg-surface">
          <div className="flex flex-1 flex-col justify-center px-4 py-2">
            <p className="text-micro tracking-label text-ink">
              TOTAL PRICE FROM
            </p>
            <p className="text-base font-semibold leading-6 text-ink">
              {cheapestRate ? formatEuro(cheapestRate.totalPrice) : "—"}
            </p>
          </div>
          <Button
            type="button"
            disabled={!cheapestRate}
            onClick={() =>
              cheapestRate && onSelect(room.unitId, cheapestRate.rateId)
            }
            className="h-auto shrink-0 rounded-none bg-ink p-4 text-base font-normal tracking-label text-surface hover:bg-ink/90 disabled:bg-line"
          >
            SELECT
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RoomCard(props: RoomCardProps) {
  return (
    <>
      <DesktopRoomCard {...props} />
      <MobileRoomCard {...props} />
    </>
  );
}
