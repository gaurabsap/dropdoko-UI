"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, CreditCard, Settings, LogOut, MapPin } from "lucide-react";
import { ReactNode } from "react";
import { useUser } from "@/components/context/userContext";

const links = [
  { name: "Account Details", href: "/customer/profile", icon: User },
  { name: "Shipping Address", href: "/customer/profile/shipping-address", icon: MapPin },
  { name: "Order History", href: "/customer/profile/order-history", icon: Package },
  { name: "Payment Methods", href: "/customer/profile/payment-methods", icon: CreditCard },
  { name: "Settings", href: "/customer/profile/settings", icon: Settings },
  { name: "Logout", href: "/customer/profile/logout", icon: LogOut },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useUser();

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <aside className="w-64 border-r p-6 bg-white">
        <h2 className="text-lg font-bold mb-6">My Account</h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            // ✅ Only highlight if pathname exactly matches the link
            const isActive = pathname === link.href;

            if (link.name === "Logout") {
              return (
                <button
                  key={link.name}
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  {link.name}
                </button>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold" // Active styles
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-red-600" : "text-gray-500"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
