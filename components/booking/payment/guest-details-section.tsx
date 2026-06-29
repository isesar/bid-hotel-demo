"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  PaymentField,
  PaymentTextarea,
} from "@/components/booking/payment/payment-field";
import type { PaymentFormValues } from "@/lib/booking/payment-schema";

function SectionHeading({ children }: { children: string }) {
  return (
    <p className="text-caption leading-[18px] tracking-label text-ink-muted">
      {children}
    </p>
  );
}

type GuestDetailsSectionProps = {
  register: UseFormRegister<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
};

export function GuestDetailsSection({
  register,
  errors,
}: GuestDetailsSectionProps) {
  return (
    <section className="border-y border-line px-4 py-6 md:flex-1 md:border-y-0 md:px-0 md:py-0">
      <div className="flex flex-col gap-4">
        <SectionHeading>GUEST DETAILS</SectionHeading>

        <PaymentField
          label="E-MAIL"
          type="email"
          autoComplete="email"
          placeholder="Enter your e-mail address"
          error={errors.email?.message}
          hint="E-mail confirmation will be sent to this address"
          {...register("email")}
        />

        <div className="flex flex-col gap-4">
          <PaymentField
            label="FIRST NAME"
            autoComplete="given-name"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <PaymentField
            label="LAST NAME"
            autoComplete="family-name"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-caption font-semibold uppercase leading-4 tracking-label text-ink">
            CONTACT NUMBER
          </label>
          <div className="flex items-start">
            <div className="flex shrink-0 items-center gap-2.5 border border-line bg-white px-4 py-3 text-base leading-6 tracking-label text-ink-muted">
              HR +385
            </div>
            <PaymentField
              label=""
              aria-label="Phone number"
              type="tel"
              autoComplete="tel-national"
              placeholder="Enter mobile phone number"
              containerClassName="min-w-0 flex-1 [&>label]:sr-only"
              className="border-l-0"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        </div>

        <PaymentTextarea
          label="ADDITIONAL COMMENTS"
          placeholder="Enter any additional comments"
          error={errors.comments?.message}
          {...register("comments")}
        />
      </div>
    </section>
  );
}
