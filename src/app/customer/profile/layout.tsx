"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Settings,
  LogOut,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@/components/context/userContext";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Account Details", href: "/customer/profile", icon: User },
  { name: "Shipping Address", href: "/customer/profile/shipping-address", icon: MapPin },
  { name: "Order History", href: "/customer/profile/order-history", icon: Package },
  { name: "Security", href: "/customer/profile/security", icon: Settings },
  { name: "Logout", href: "/customer/profile/logout", icon: LogOut },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout  } = useUser();
  const [open, setOpen] = useState(false);
  const [isOauthUser, setIsOauthUser] = useState<boolean>(false);


    useEffect(() => {
    if (user?.isSocialLogin) setIsOauthUser(true);
  }, [user]);


  const filteredLinks = isOauthUser
  ? links.filter((link) => link.name !== "Security")
  : links;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFCFB]">

      {/* ✅ MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <h2 className="text-lg font-bold">My Account</h2>

        {/* ✅ Menu button with text */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md"
        >
          <Menu className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Menu</span>
        </button>
      </div>

      {/* ✅ DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-64 border-r p-6 bg-white">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        <nav className="space-y-2">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
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
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold"
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

      {/* ✅ MOBILE DRAWER — FROM RIGHT TO LEFT */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Account</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="h-6 w-6 text-gray-700" />
                </button>
              </div>

              <nav className="space-y-3">
                {links.map((link) => {
                  const Icon = link.icon;
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
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "bg-red-50 text-red-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-red-600" : "text-gray-500"}`} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ PAGE CONTENT */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
