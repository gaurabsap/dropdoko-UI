"use client";

import { Suspense } from "react";
import CheckoutSuccessPage from "./CheckoutSuccessPage";

export default function CheckoutSuccessWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
