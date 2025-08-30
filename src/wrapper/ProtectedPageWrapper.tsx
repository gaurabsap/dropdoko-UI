"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useUser } from "@/components/context/userContext";

type Props = { children: ReactNode };

export default function ProtectedPageWrapper({ children }: Props) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const protectedPrefixes = ["/profile", "/dashboard", "/orders", "/admin"];

  useEffect(() => {
    if (!loading) {
      const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
      if (isProtected && !user) {
        router.replace("/"); // redirect immediately
      }
    }
  }, [pathname, router, user, loading]);

  // While loading, or if protected and user not available, render nothing
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
  if (loading || (isProtected && !user)) return null;

  return <>{children}</>;
}
