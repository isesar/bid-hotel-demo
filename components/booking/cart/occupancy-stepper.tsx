"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "size-8 shrink-0 rounded-none border border-line bg-white text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      {children}
    </Button>
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
        <p className="text-base leading-6 tracking-label text-ink">
          {label}
        </p>
        {sublabel ? (
          <p className="text-micro leading-[11px] tracking-label text-ink-muted">
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
        <div className="flex h-8 w-10 items-center justify-center border-y border-line bg-white text-caption font-semibold leading-4 tracking-label text-ink">
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
