"use client";

import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { createBooking } from "@/lib/booking/api";
import { markBookingCompleted } from "@/lib/booking/booking-session";
import { useConfirmation } from "@/lib/booking/confirmation-context";
import {
  aggregateBookingUnits,
  formatPhoneForSubmit,
  stripNonDigits,
  type PaymentFormValues,
} from "@/lib/booking/payment-schema";
import type { RoomSelection } from "@/lib/booking/search-params";
import type { Unit } from "@/lib/booking/types";
import type { CartRoomLine } from "@/components/booking/cart/cart-room-card";

type UsePaymentSubmitOptions = {
  property: string;
  checkinParam: string;
  checkin: Date | null;
  nights: number;
  rooms: RoomSelection[];
  propertyName: string;
  cartLines: CartRoomLine[];
  grandTotal: number;
  units: Unit[];
};

export function usePaymentSubmit({
  property,
  checkinParam,
  checkin,
  nights,
  rooms,
  propertyName,
  cartLines,
  grandTotal,
  units,
}: UsePaymentSubmitOptions) {
  const router = useRouter();
  const { setSnapshot } = useConfirmation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: PaymentFormValues) => {
      if (!property || !checkinParam || !checkin || rooms.length === 0) return;

      setSubmitError(null);

      try {
        const phone = formatPhoneForSubmit(values.phone);

        const response = await createBooking({
          propertyId: property,
          checkin: checkinParam,
          nights,
          units: aggregateBookingUnits(rooms),
          guest: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone,
          },
          payment: {
            cardNumber: stripNonDigits(values.cardNumber),
            cvv: values.cvv,
            expiration: values.expiry,
            holderFirst: values.cardHolderFirstName,
            holderLast: values.cardHolderLastName,
          },
        });

        const reservationNumber = String(
          response.reference ?? response.bookingId ?? "confirmed"
        );
        const checkout = addDays(checkin, nights);
        const firstUnitId = cartLines[0]?.unitId;
        const heroImage =
          units.find((unit) => unit.id === firstUnitId)?.image ?? "";
        const totalAdults = cartLines.reduce((sum, line) => sum + line.adults, 0);
        const totalChildren = cartLines.reduce(
          (sum, line) => sum + line.children,
          0
        );

        setSnapshot({
          reservationNumber,
          guest: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone,
          },
          propertyName,
          checkin,
          checkout,
          nights,
          rooms: cartLines.map((line) => ({
            name: line.name,
            rateName: line.rateName,
          })),
          totalAdults,
          totalChildren,
          grandTotal,
          heroImage,
          daysUntilArrival: Math.max(
            differenceInCalendarDays(startOfDay(checkin), startOfDay(new Date())),
            0
          ),
        });

        markBookingCompleted();
        router.push("/book/confirmation");
      } catch {
        setSubmitError(
          "Unable to confirm your reservation. Please check your details and try again."
        );
      }
    },
    [
      cartLines,
      checkin,
      checkinParam,
      grandTotal,
      nights,
      property,
      propertyName,
      rooms,
      router,
      setSnapshot,
      units,
    ]
  );

  return { submitError, onSubmit };
}

export function usePaymentNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = useCallback(() => {
    const query = searchParams.toString();
    router.push(query ? `/book/rooms?${query}` : "/book/rooms");
  }, [router, searchParams]);

  return { handleBack };
}
