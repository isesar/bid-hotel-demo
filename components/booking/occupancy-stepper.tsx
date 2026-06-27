"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

type OccupancyStepperProps = {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
};

function StepperButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center border border-[#c6c6c6] bg-white text-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      {children}
    </button>
  );
}

export function OccupancyStepper({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
  className,
}: OccupancyStepperProps) {
  const canDecrement = value > min;
  const canIncrement = max === undefined || value < max;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-[16px] leading-6 tracking-[0.2px] text-[#1f1f1f]">
          {label}
        </p>
        {sublabel ? (
          <p className="text-[9px] leading-[11px] tracking-[0.2px] text-[#5e5e5e]">
            {sublabel}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center">
        <StepperButton
          disabled={!canDecrement}
          onClick={() => onChange(value - 1)}
        >
          <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} className="size-6" />
        </StepperButton>
        <div className="flex h-8 w-10 items-center justify-center border-y border-[#c6c6c6] bg-white text-[13px] font-semibold leading-4 tracking-[0.2px] text-[#1f1f1f]">
          {value}
        </div>
        <StepperButton
          disabled={!canIncrement}
          onClick={() => onChange(value + 1)}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-6" />
        </StepperButton>
      </div>
    </div>
  );
}
