"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PaymentFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Skeleton className="h-[72px] w-full rounded-none md:hidden" />
      <Skeleton className="mx-auto mt-6 h-10 w-full max-w-[640px] rounded-none" />
      <Skeleton className="mx-auto mt-6 h-[480px] w-full max-w-[1040px] rounded-none px-4" />
    </div>
  );
}
