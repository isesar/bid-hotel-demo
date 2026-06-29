"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PaymentFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
} & ComponentProps<"input">;

export function PaymentField({
  label,
  error,
  hint,
  className,
  containerClassName,
  id,
  ...props
}: PaymentFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-2.5", containerClassName)}>
      <label
        htmlFor={fieldId}
        className="text-caption font-semibold uppercase leading-4 tracking-label text-ink"
      >
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full border border-line bg-white px-4 py-3 text-base leading-6 tracking-label text-ink outline-none placeholder:text-ink-muted focus-visible:border-ink aria-invalid:border-alert",
          className
        )}
        {...props}
      />
      {hint ? (
        <p className="text-caption leading-[18px] tracking-label text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-caption leading-[18px] tracking-label text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PaymentTextareaProps = {
  label: string;
  error?: string;
  containerClassName?: string;
} & ComponentProps<"textarea">;

export function PaymentTextarea({
  label,
  error,
  className,
  containerClassName,
  id,
  ...props
}: PaymentTextareaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-2.5", containerClassName)}>
      <label
        htmlFor={fieldId}
        className="text-caption font-semibold uppercase leading-4 tracking-label text-ink"
      >
        {label}
      </label>
      <textarea
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-[100px] w-full resize-none border border-line bg-white px-4 py-3 text-base leading-6 tracking-label text-ink outline-none placeholder:text-ink-muted focus-visible:border-ink aria-invalid:border-alert md:min-h-[160px]",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-caption leading-[18px] tracking-label text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
