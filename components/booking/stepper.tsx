import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

type StepperProps = {
  steps: string[];
  activeStep: number;
  className?: string;
};

export function Stepper({ steps, activeStep, className }: StepperProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-4",
        className
      )}
    >
      {steps.map((label, index) => (
        <div key={label} className="flex items-center gap-6">
          {index > 0 ? (
            <>
              <Separator className="w-6 shrink-0 bg-line" />
            </>

          ) : null}
          <div className="flex items-center gap-2">
            {index < activeStep ? (
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-6 shrink-0 text-ink"
              />
            ) : (
              <span
                className={cn(
                  "flex size-[22px] shrink-0 items-center justify-center rounded-full p-1 text-micro font-semibold leading-[14px] tracking-label",
                  index === activeStep
                    ? "bg-ink text-white"
                    : "border border-ink text-ink"
                )}
              >
                {index + 1}
              </span>
            )}
            <span className="whitespace-nowrap text-micro font-semibold leading-[14px] tracking-label text-ink">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const BOOKING_STEPS = [
  "ACCOMMODATION",
  "PAYMENT",
  "CONFIRMATION",
] as const;
