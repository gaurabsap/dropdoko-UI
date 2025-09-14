"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import EmailVerifyBanner from "@/components/EmailVerifyBanner"; // import banner

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin"); // Detect admin routes

  return (
    <>
      {!isAdmin && <EmailVerifyBanner />}
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
