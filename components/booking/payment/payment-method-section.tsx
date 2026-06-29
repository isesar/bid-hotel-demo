"use client";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { AcceptedCards } from "@/components/booking/payment/accepted-cards";
import {
  PaymentField,
} from "@/components/booking/payment/payment-field";
import {
  formatCardNumber,
  formatExpiry,
  stripNonDigits,
  type PaymentFormValues,
} from "@/lib/booking/payment-schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function SectionHeading({ children }: { children: string }) {
  return (
    <p className="text-caption leading-[18px] tracking-label text-ink-muted">
      {children}
    </p>
  );
}

type PaymentMethodSectionProps = {
  register: UseFormRegister<PaymentFormValues>;
  control: Control<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
  submitError: string | null;
  isSubmitting: boolean;
};

export function PaymentMethodSection({
  register,
  control,
  errors,
  submitError,
  isSubmitting,
}: PaymentMethodSectionProps) {
  return (
    <section className="border-b border-line px-4 py-6 md:flex-1 md:border-b-0 md:px-0 md:py-0">
      <div className="flex flex-col gap-4">
        <SectionHeading>PAYMENT METHOD</SectionHeading>

        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <PaymentField
              label="CARD NUMBER"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Enter your credit card number"
              value={field.value}
              onChange={(event) =>
                field.onChange(formatCardNumber(event.target.value))
              }
              onBlur={field.onBlur}
              error={errors.cardNumber?.message}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="expiry"
            control={control}
            render={({ field }) => (
              <PaymentField
                label="EXPIRATION DATE"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={field.value}
                onChange={(event) =>
                  field.onChange(formatExpiry(event.target.value))
                }
                onBlur={field.onBlur}
                error={errors.expiry?.message}
              />
            )}
          />
          <Controller
            name="cvv"
            control={control}
            render={({ field }) => (
              <PaymentField
                label="CVV"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="---"
                maxLength={3}
                value={field.value}
                onChange={(event) =>
                  field.onChange(stripNonDigits(event.target.value).slice(0, 3))
                }
                onBlur={field.onBlur}
                error={errors.cvv?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <PaymentField
            label="CARD HOLDER FIRST NAME"
            autoComplete="cc-given-name"
            placeholder="Enter your card holder first name"
            error={errors.cardHolderFirstName?.message}
            {...register("cardHolderFirstName")}
          />
          <PaymentField
            label="CARD HOLDER LAST NAME"
            autoComplete="cc-family-name"
            placeholder="Enter your card holder last name"
            error={errors.cardHolderLastName?.message}
            {...register("cardHolderLastName")}
          />
        </div>

        <div className="flex flex-col gap-6 py-6">
          <Controller
            name="newsletter"
            control={control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-4">
                <Checkbox
                  checked={field.value ?? false}

                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="mt-1 size-6 rounded-none border-line data-checked:border-ink data-checked:bg-ink"
                />
                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-6 text-ink">
                    Newsletter/promo
                  </span>
                  <span className="mt-1 block text-caption leading-[18px] tracking-label text-ink">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean tincidunt odio a velit luctus, ut egestas lacus
                    porttitor.
                  </span>
                </span>
              </label>
            )}
          />

          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <div>
                <label className="flex cursor-pointer items-start gap-4">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className="mt-1 size-6 rounded-none border-line data-checked:border-ink data-checked:bg-ink"
                  />
                  <span className="text-base leading-6 tracking-label text-ink">
                    I have read and agree to the{" "}
                    <span className="underline">terms of use</span>
                  </span>
                </label>
                {errors.acceptTerms?.message ? (
                  <p className="mt-2 text-caption leading-[18px] tracking-label text-alert">
                    {errors.acceptTerms.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>

        {submitError ? (
          <p className="text-caption leading-[18px] tracking-label text-alert">
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full rounded-none cursor-pointer bg-ink px-4 text-base font-normal tracking-label text-surface hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
        >
          {isSubmitting ? "CONFIRMING..." : "CONFIRM RESERVATION"}
        </Button>

        <AcceptedCards />
      </div>
    </section>
  );
}
