"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/context/userContext";

export default function LogoutPage() {
  const { logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push("/customer/login");
    };

    performLogout();
  }, [logout, router]);

  return <p>Logging out...</p>;
}
