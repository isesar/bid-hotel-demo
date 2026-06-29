"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";

import { formatDateRange } from "@/lib/booking/calendar-utils";
import { formatNightsLabel } from "@/lib/booking/format";
import {
  paymentFormSchema,
  type PaymentFormValues,
} from "@/lib/booking/payment-schema";
import { useBookingParams } from "@/lib/booking/search-params";
import { useBookingRouteGuard } from "@/hooks/use-booking-route-guard";
import {
  usePaymentNavigation,
  usePaymentSubmit,
} from "@/hooks/use-payment-submit";
import { useReservation } from "@/hooks/use-reservation";

import { GuestDetailsSection } from "@/components/booking/payment/guest-details-section";
import { OrderSummary } from "@/components/booking/payment/order-summary";
import { PaymentFormLoadError } from "@/components/booking/payment/payment-form-load-error";
import { PaymentFormSkeleton } from "@/components/booking/payment/payment-form-skeleton";
import { PaymentFormStickyHeader } from "@/components/booking/payment/payment-form-sticky-header";
import { PaymentMethodSection } from "@/components/booking/payment/payment-method-section";

const defaultValues: PaymentFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  comments: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardHolderFirstName: "",
  cardHolderLastName: "",
  newsletter: false,
  acceptTerms: false,
};

export function PaymentForm() {
  const [{ property, checkin, nights, rooms }] = useBookingParams();
  const { isReady } = useBookingRouteGuard({
    requireCheckin: true,
    requireRooms: true,
  });
  const {
    propertyName,
    cartLines,
    grandTotal,
    checkinParam,
    availabilityLoading,
    availabilityError,
    units,
  } = useReservation();
  const { handleBack } = usePaymentNavigation();
  const { submitError, onSubmit } = usePaymentSubmit({
    property: property ?? "",
    checkinParam: checkinParam ?? "",
    checkin,
    nights,
    rooms,
    propertyName,
    cartLines,
    grandTotal,
    units,
  });

  const checkout = checkin ? addDays(checkin, nights) : null;
  const nightsLabel = formatNightsLabel(nights);
  const dateRange =
    checkin && checkout ? formatDateRange(checkin, checkout) : "";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  if (!isReady || !checkin || !checkout) {
    return null;
  }

  if (availabilityLoading) {
    return <PaymentFormSkeleton />;
  }

  if (availabilityError || cartLines.length === 0) {
    return <PaymentFormLoadError onBack={handleBack} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-32 md:pb-0">
      <PaymentFormStickyHeader
        onBack={handleBack}
        propertyName={propertyName}
        dateRange={dateRange}
        nightsLabel={nightsLabel}
        lines={cartLines}
        grandTotal={grandTotal}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-0 md:flex-row md:items-start md:gap-10 md:px-4 md:py-6 lg:px-0"
      >
        <div className="flex min-w-0 flex-1 flex-col md:flex-row md:gap-10 md:border-y md:border-line md:py-6">
          <GuestDetailsSection register={register} errors={errors} />
          <PaymentMethodSection
            register={register}
            control={control}
            errors={errors}
            submitError={submitError}
            isSubmitting={isSubmitting}
          />
        </div>

        <OrderSummary
          variant="sidebar"
          propertyName={propertyName}
          dateRange={dateRange}
          nightsLabel={nightsLabel}
          lines={cartLines}
          grandTotal={grandTotal}
          className="sticky top-24"
        />
      </form>

      <OrderSummary
        variant="footer"
        propertyName={propertyName}
        dateRange={dateRange}
        nightsLabel={nightsLabel}
        lines={cartLines}
        grandTotal={grandTotal}
      />
    </div>
  );
}
