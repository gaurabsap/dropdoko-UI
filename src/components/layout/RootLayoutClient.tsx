"use client";

import { ReactNode } from "react";
import EmailVerifyBanner from "@/components/EmailVerifyBanner";

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <EmailVerifyBanner />
      <main className="flex-1">{children}</main>
    </div>
  );
}
