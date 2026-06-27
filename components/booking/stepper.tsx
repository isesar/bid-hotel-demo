import { cn } from "@/lib/utils";

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
        <div key={label} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="h-px w-8 shrink-0 bg-[#c6c6c6]" aria-hidden />
          ) : null}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-[22px] shrink-0 items-center justify-center rounded-full p-1 text-[9px] font-semibold leading-[14px] tracking-[0.2px]",
                index <= activeStep
                  ? "bg-[#1f1f1f] text-white"
                  : "border border-[#1f1f1f] text-[#1f1f1f]"
              )}
            >
              {index + 1}
            </span>
            <span className="whitespace-nowrap text-[9px] font-semibold leading-[14px] tracking-[0.2px] text-[#1f1f1f]">
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
