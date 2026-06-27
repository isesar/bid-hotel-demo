"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

type BookingCloseButtonProps = {
  className?: string;
};

export function BookingCloseButton({ className }: BookingCloseButtonProps) {
  return (
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-6 shrink-0 text-[#1f1f1f] hover:bg-transparent", className)}
      >
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-6" />
        <span className="sr-only">Close</span>
      </Button>
    </DialogClose>
  );
}
