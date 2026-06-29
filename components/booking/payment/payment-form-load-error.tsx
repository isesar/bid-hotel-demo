"use client";

import { Button } from "@/components/ui/button";

type PaymentFormLoadErrorProps = {
  onBack: () => void;
};

export function PaymentFormLoadError({ onBack }: PaymentFormLoadErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-10">
      <p className="text-center text-ink-muted">
        Unable to load your reservation. Please return to room selection.
      </p>
      <Button
        type="button"
        variant="link"
        onClick={onBack}
        className="mt-4 rounded-none text-caption font-semibold tracking-label text-ink"
      >
        BACK TO ROOMS
      </Button>
    </div>
  );
}
