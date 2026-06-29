"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { createBooking } from "@/lib/booking/api";
import {
  aggregateBookingUnits,
  stripNonDigits,
  type PaymentFormValues,
} from "@/lib/booking/payment-schema";
import type { RoomSelection } from "@/lib/booking/search-params";

type UsePaymentSubmitOptions = {
  property: string;
  checkinParam: string;
  nights: number;
  rooms: RoomSelection[];
};

export function usePaymentSubmit({
  property,
  checkinParam,
  nights,
  rooms,
}: UsePaymentSubmitOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: PaymentFormValues) => {
      if (!property || !checkinParam || rooms.length === 0) return;

      setSubmitError(null);

      try {
        const response = await createBooking({
          propertyId: property,
          checkin: checkinParam,
          nights,
          units: aggregateBookingUnits(rooms),
          guest: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: `+385${stripNonDigits(values.phone)}`,
          },
          payment: {
            cardNumber: stripNonDigits(values.cardNumber),
            cvv: values.cvv,
            expiration: values.expiry,
            holderFirst: values.cardHolderFirstName,
            holderLast: values.cardHolderLastName,
          },
        });

        const bookingId =
          response.bookingId ?? response.reference ?? "confirmed";
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set("booking", String(bookingId));
        router.push(`/book/confirmation?${nextParams.toString()}`);
      } catch {
        setSubmitError(
          "Unable to confirm your reservation. Please check your details and try again."
        );
      }
    },
    [checkinParam, nights, property, rooms, router, searchParams]
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
