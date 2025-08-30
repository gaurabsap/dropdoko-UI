"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  exact?: boolean; // match exact or allow sub-paths
}

export function NavLink({ href, label, exact = true }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "ml-5 transition-colors hover:text-orange-500 text-black font-semibold text-[15px] mr-4",
        isActive ? "text-orange-600 font-semibold" : "text-gray-700"
      )}
    >
      {label}
    </Link>
  );
}
