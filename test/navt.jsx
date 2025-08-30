"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, SearchIcon, ShoppingCart, UserCircle, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  const [cartCount] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full border-b sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between w-full h-14 px-4 md:px-10">
        
        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={35}
              height={35}
              className="cursor-pointer"
            />
            <h1 className="font-bold text-base md:text-lg">Drop-doko</h1>
          </Link>

          {/* Search bar - hidden on sm, shown on md and larger */}
          <div className="hidden md:block ml-2 md:ml-6 relative w-40 sm:w-60 md:w-[28rem] lg:w-[32rem]">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 !bg-gray-50 text-black border rounded-full focus:outline-none text-sm"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* RIGHT: Desktop menu - hidden on sm, shown on md and larger */}
        <div className="hidden md:flex items-center gap-4">
          <select className="hidden lg:block rounded-full px-3 py-1 bg-sky-50 focus:outline-none cursor-pointer text-sm">
            <option value="">Category</option>
            <option value="option1">Electrical appliance</option>
            <option value="option2">Mobile appliance</option>
          </select>

          <Button
            variant="ghost"
            className="h-8 px-3 flex items-center gap-2 relative cursor-pointer transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden lg:block text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 !bg-orange-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" className="cursor-pointer hidden h-8 px-3 lg:flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            <span className="text-sm">Account</span>
          </Button>

          <div className="hidden lg:flex h-6 w-px !bg-gray-600" />

          <Button variant="ghost" className="cursor-pointer hidden h-8 px-3 lg:flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span className="text-sm">Saved</span>
          </Button>
          
          {/* Menu button for md screens - hidden on lg and larger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu button - visible only on sm screens */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown (for sm screens) */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 py-3 border-t bg-white animate-in slide-in-from-top duration-300">
          {/* Search visible only in mobile menu */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 !bg-gray-50 text-black border rounded-full focus:outline-none text-sm"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <select className="rounded-full px-3 py-1 bg-sky-50 focus:outline-none cursor-pointer text-sm">
            <option value="">Category</option>
            <option value="option1">Electrical appliance</option>
            <option value="option2">Mobile appliance</option>
          </select>

          <Button variant="ghost" className="!cursor-pointer flex items-center gap-2 justify-start">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">Cart ({cartCount})</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2 justify-start">
            <UserCircle className="h-5 w-5" />
            <span className="text-sm">Account</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2 justify-start">
            <Heart className="h-5 w-5" />
            <span className="text-sm">Saved</span>
          </Button>
        </div>
      )}

      {/* Medium screen dropdown (for md screens) */}
      {mobileOpen && (
        <div className="hidden md:flex lg:hidden flex-col gap-3 px-4 py-3 border-t bg-white animate-in slide-in-from-top duration-300 absolute w-full left-0">
          <Button variant="ghost" className="flex items-center gap-2 justify-start">
            <UserCircle className="h-5 w-5" />
            <span className="text-sm">Account</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2 justify-start">
            <Heart className="h-5 w-5" />
            <span className="text-sm">Saved</span>
          </Button>
        </div>
      )}
    </nav>
  );
}