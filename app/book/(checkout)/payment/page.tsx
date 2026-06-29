import { Suspense } from "react";

import { PaymentForm } from "@/components/booking/payment/payment-form";

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentForm />
    </Suspense>
  );
}
