"use client";

import { Button } from "@/components/ui/button";

type RoomAvailabilityHeaderProps = {
  availabilityLabel: string;
  cartCount: number;
  onOpenCart: () => void;
};

export function RoomAvailabilityHeader({
  availabilityLabel,
  cartCount,
  onOpenCart,
}: RoomAvailabilityHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-base font-semibold text-ink">
        {availabilityLabel}
      </p>
      {cartCount > 0 ? (
        <Button
          type="button"
          variant="link"
          onClick={onOpenCart}
          className="h-auto rounded-none border-b border-ink p-0 text-caption font-semibold tracking-label text-ink no-underline hover:no-underline"
        >
          VIEW CART ({cartCount})
        </Button>
      ) : null}
    </div>
  );
}
