"use client";

import { ConfirmationProvider } from "@/lib/booking/confirmation-context";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfirmationProvider>{children}</ConfirmationProvider>;
}
