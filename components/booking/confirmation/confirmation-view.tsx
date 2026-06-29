"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useConfirmation } from "@/lib/booking/confirmation-context";

import { ConfirmationSuccess } from "@/components/booking/confirmation/confirmation-success";

export function ConfirmationView() {
  const router = useRouter();
  const { snapshot } = useConfirmation();

  useEffect(() => {
    if (!snapshot) {
      router.replace("/");
    }
  }, [router, snapshot]);

  if (!snapshot) {
    return null;
  }

  return <ConfirmationSuccess snapshot={snapshot} />;
}
