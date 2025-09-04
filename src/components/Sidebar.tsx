"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiBox, FiClipboard, FiUser, FiHome } from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", href: "/", icon: <FiHome /> },
    { name: "Categories", href: "/categories", icon: <FiClipboard /> },
    { name: "Products", href: "/products", icon: <FiBox /> },
    { name: "Orders", href: "/orders", icon: <FiClipboard /> },
    { name: "Users", href: "/users", icon: <FiUser /> },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${open ? "w-64" : "w-16"} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        {open && <span className="font-bold text-lg">Admin Panel</span>}
        <button onClick={() => setOpen(!open)} className="text-white text-xl">
          <FiMenu />
        </button>
      </div>
      <nav className="mt-4 flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-3 hover:bg-gray-700 rounded flex items-center gap-2"
          >
            {item.icon} {open && item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
