"use client";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingCloseButton } from "@/components/booking/accommodation/booking-close-button";

type AccommodationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  desktopTitle: string;
  mobileTitle: string;
  children: React.ReactNode;
  contentClassName?: string;
  preventOutsideClose?: boolean;
};

export function AccommodationDialog({
  open,
  onOpenChange,
  desktopTitle,
  mobileTitle,
  children,
  contentClassName,
  preventOutsideClose = false,
}: AccommodationDialogProps) {
  const preventClose = preventOutsideClose
    ? (event: Event) => event.preventDefault()
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 max-md:bg-white/95"
        onPointerDownOutside={preventClose}
        onInteractOutside={preventClose}
        className={cn(
          "gap-0 overflow-hidden rounded-none border-0 bg-white p-0 text-ink ring-0",
          "max-md:fixed max-md:inset-0 max-md:flex max-md:h-full max-md:w-full max-md:max-w-full max-md:translate-x-0 max-md:translate-y-0 max-md:top-0 max-md:left-0 max-md:flex-col max-md:shadow-none",
          "sm:max-w-none",
          "md:max-w-[900px] md:shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]",
          contentClassName
        )}
      >
        <div className="flex shrink-0 items-center border-b border-line py-6 pl-12 pr-4 max-md:pb-2 max-md:pt-6 max-md:pl-6">
          <DialogTitle className="flex-1 text-center text-caption font-semibold tracking-label text-ink-muted">
            <span className="md:hidden">{mobileTitle}</span>
            <span className="hidden md:inline">{desktopTitle}</span>
          </DialogTitle>
          <BookingCloseButton />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
