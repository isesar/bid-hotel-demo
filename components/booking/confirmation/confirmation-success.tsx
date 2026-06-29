"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { ConfirmationSnapshot } from "@/lib/booking/confirmation-context";
import {
  formatConfirmationDate,
  formatEuro,
  formatGuestsLabel,
  formatNightsLabel,
} from "@/lib/booking/format";
import { useConfirmation } from "@/lib/booking/confirmation-context";
import { cn } from "@/lib/utils";

import { BOOKING_STEPS, Stepper } from "@/components/booking/stepper";
import { Button } from "@/components/ui/button";

type DetailFieldProps = {
  label: string;
  value: string;
  className?: string;
};

function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-caption leading-[18px] tracking-label text-ink-muted">
        {label}
      </p>
      <p className="text-base leading-6 tracking-label text-ink">{value}</p>
    </div>
  );
}

type ConfirmationSuccessProps = {
  snapshot: ConfirmationSnapshot;
};

export function ConfirmationSuccess({ snapshot }: ConfirmationSuccessProps) {
  const router = useRouter();
  const { clearSnapshot } = useConfirmation();

  const guestName = `${snapshot.guest.firstName} ${snapshot.guest.lastName}`;
  const nightsLabel = formatNightsLabel(snapshot.nights);
  const guestsLabel = formatGuestsLabel(
    snapshot.totalAdults,
    snapshot.totalChildren
  );
  const arrivalMessage =
    snapshot.daysUntilArrival === 0
      ? "Congratulations on your choice, your arrival is today."
      : snapshot.daysUntilArrival === 1
        ? "Congratulations on your choice, 1 day until your arrival."
        : `Congratulations on your choice, ${snapshot.daysUntilArrival} days until your arrival.`;

  const handleGoHome = () => {
    clearSnapshot();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Stepper steps={[...BOOKING_STEPS]} activeStep={2} />

      <div className="flex flex-1 items-start justify-center px-2.5 py-10 md:px-4">
        <div className="w-full max-w-[640px] border border-line bg-white">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-[214px] w-full shrink-0 md:w-[233px]">
              {snapshot.heroImage ? (
                <Image
                  src={snapshot.heroImage}
                  alt={snapshot.propertyName}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 233px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-surface" />
              )}
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 bg-success-light px-4 py-6">
              <div className="flex max-w-[346px] flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center gap-4">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="size-6 shrink-0 text-success"
                  />
                  <p className="text-base leading-6 tracking-label text-success">
                    Your reservation is confirmed!
                  </p>
                </div>
                <p className="font-serif text-title leading-normal tracking-label text-success">
                  {arrivalMessage}
                </p>
              </div>

              <div className="flex flex-col items-center text-center text-base leading-6 text-success">
                <p className="tracking-label">Reservation number</p>
                <p className="font-semibold">{snapshot.reservationNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <section className="flex flex-col gap-4 border-y border-line p-6 md:gap-6">
              <p className="text-caption font-semibold leading-4 tracking-label text-ink-muted">
                GUEST DETAILS
              </p>

              <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                <DetailField label="GUEST" value={guestName} />
                <DetailField label="E-Mail" value={snapshot.guest.email} />
                <DetailField
                  label="CONTACT NUMBER"
                  value={snapshot.guest.phone}
                />
              </div>
            </section>

            <section className="flex flex-col gap-4 border-b border-line p-6 md:gap-6">
              <p className="text-caption font-semibold leading-4 tracking-label text-ink-muted">
                RESERVATION DETAILS
              </p>

              <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                <DetailField
                  label="CHECK-IN"
                  value={formatConfirmationDate(snapshot.checkin)}
                />
                <DetailField
                  label="CHECK-OUT"
                  value={formatConfirmationDate(snapshot.checkout)}
                />
                <DetailField
                  label="NUMBER OF NIGHTS"
                  value={nightsLabel}
                />
              </div>

              <DetailField label="HOTEL" value={snapshot.propertyName} />

              {snapshot.rooms.map((room, index) => (
                <DetailField
                  key={`${room.name}-${index}`}
                  label={`ROOM ${index + 1}`}
                  value={`${room.name}, ${room.rateName}`}
                />
              ))}

              <DetailField
                label="NUMBER OF GUESTS"
                value={guestsLabel}
              />

              <DetailField
                label="TOTAL"
                value={formatEuro(snapshot.grandTotal)}
              />
            </section>
          </div>

          <div className="flex flex-col items-center px-4 py-6 md:items-center">
            <Button
              type="button"
              onClick={handleGoHome}
              className="h-14 w-full rounded-none bg-ink px-4 text-base leading-6 tracking-label text-surface hover:bg-ink/90 md:w-auto"
            >
              GO BACK TO HOMEPAGE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
