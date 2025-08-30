"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ShoppingCart, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useUser } from "@/components/context/userContext";
// import { NavLink } from "./nav-link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="w-full px-4 py-3 flex items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-orange-600"
        >
          <Image src="/logo.png" alt="DropDoko Logo" width={50} height={50} />
          <p className="text-black text-[20px]">Drop-Doko</p>
        </Link>

        {/* Desktop Nav
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium ml-10">
          {links.map((link) => (
            <NavLink key={link.name} href={link.href} label={link.name} />
          ))}
        </nav> */}

        {/* Spacer */}
          <div className="hidden lg:flex items-center w-56 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search"
              className="h-9 pl-9 !bg-white w-full"
            />
          </div>
        <div className="flex-grow" />

        <div className="flex items-center gap-4 lg:gap-6">

          <Button variant="ghost" className="!h-12 !w-12">
            <ShoppingCart className="h-10 w-10" />
          </Button>

          {/* User Icon */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile & Tablet Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-gray-500">
              <div className="mt-10 space-y-4 !bg-transparent">
                {/* Mobile Search Bar */}
                <div className="flex items-center w-full relative p-2 !bg-transparent">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 !bg-transparent" />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="h-9 pl-9 !bg-white w-full"
                  />
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-4 rounded-lg mt-4 !bg-transparent">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-800 text-[17px] font-bold mt-5 p-3 text-center bg-orange-300 hover:text-orange-500"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}






















"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, SearchIcon, ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <nav className="w-full border-b-2 sticky top-0 z-50 bg-white px-4 py-2">
      <div className="flex items-center justify-around w-full">
        <div className="flex items-center w-full md:w-[60%] gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 p-2 md:p-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="cursor-pointer w-10 h-8 md:w-12 md:h-10 lg:w-14 lg:h-10"
              />
              <h1 className="font-bold text-lg md:text-xl">Drop-doko</h1>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-grow relative ml-2 md:ml-5">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1 md:py-2 !bg-gray-100 text-black border rounded-full focus:outline-none text-sm md:text-base"
            />
            <SearchIcon className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-500" />
          </div>

          {/* Category dropdown (hide on mobile) */}
          <select className="hidden md:block rounded-full px-2 md:px-4 py-1 md:py-2 bg-sky-50 focus:outline-none cursor-pointer text-sm md:text-base">
            <option value="">Category</option>
            <option value="option1">Electrical appliance</option>
            <option value="option2">Mobile appliance</option>
          </select>
        </div>

        {/* Right: Desktop icons */}
        <div className="hidden md:flex items-center justify-end gap-2 lg:gap-4 w-[40%] mr-4 lg:mr-20">
          <div className="flex items-center justify-center gap-1 lg:gap-2 px-2 lg:px-4">
            <Button variant="ghost" className="!h-10 !w-10 lg:!h-12 lg:!w-12">
              <Heart className="!h-4 !w-8 lg:!h-5 lg:!w-10" />
            </Button>

            <Button variant="ghost" className="!h-10 !w-10 lg:!h-12 lg:!w-12">
              <ShoppingCart className="!h-5 !w-8 lg:!h-6 lg:!w-10" />
            </Button>

            <Button variant="ghost" size="icon" className="!h-10 !w-10 lg:!h-12 lg:!w-12">
              <User className="!h-5 !w-5 lg:!h-6 lg:!w-5" />
            </Button>
          </div>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="!h-10 !w-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 mt-16 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 right-0 h-full w-3/4 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col p-6 gap-6">
              <div className="flex flex-col gap-4 border-b pb-4">
                <div className="flex items-center gap-3 text-lg font-medium">
                  <User className="h-5 w-5" />
                  <span>My Account</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-medium">
                  <Heart className="h-5 w-5" />
                  <span>Favorites</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-medium">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-gray-700">Categories</h3>
                <select className="w-full rounded-full px-4 py-2 bg-sky-50 focus:outline-none cursor-pointer">
                  <option value="">All Categories</option>
                  <option value="option1">Electrical appliance</option>
                  <option value="option2">Mobile appliance</option>
                </select>
                
                <Link href="#" className="text-gray-700 hover:text-blue-600">Deals</Link>
                <Link href="#" className="text-gray-700 hover:text-blue-600">Best Sellers</Link>
                <Link href="#" className="text-gray-700 hover:text-blue-600">New Arrivals</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}