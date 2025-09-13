/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  SearchIcon,
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { NavLink } from "./nav-link";
import { useUser } from "@/components/context/userContext";
import { useCart } from "./context/CartContext";
import api from "@/tools/axiosClient";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { user, logout, isAdmin } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { cart, cartCount, addToCart, removeFromCart } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCloseCart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCartOpen(false);
      setIsClosing(false);
    }, 300);
  };

const updateQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1) {
    // Remove item if quantity is 0
    removeFromCart(item.id);
  } else {
    const diff = newQuantity - item.quantity;
    addToCart({ ...item, quantity: diff });
  }
};

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Help & Support", href: "/help-support" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      api
        .get(`/products/search?query=${searchTerm}`)
        .then((res) => setSearchResults(res.data.data || []))
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <>
      <nav className="w-full border-b sticky top-0 z-40 !bg-[#F4EFEA]">
        <div className="relative flex items-center w-full h-14 px-4 md:px-10">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden absolute left-4 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo + Desktop Nav */}
          <div className="flex-1 flex items-center justify-center gap-3 md:gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/logo.png" alt="Logo" width={35} height={35} className="cursor-pointer" />
              <h1 className="font-bold text-base md:text-lg">Drop-doko</h1>
            </Link>

            <div className="hidden md:block ml-2 md:ml-6 relative">
              <nav className="hidden lg:flex items-center ml-5 text-sm font-medium">
                {links.map((link) => (
                  <NavLink key={link.name} href={link.href} label={link.name} />
                ))}
              </nav>
            </div>
          </div>

          {/* Desktop Search + Cart + User */}
          <div className="flex-1 hidden md:flex items-center justify-center gap-4">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 !bg-gray-50 text-black border rounded-full focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {(isSearching || searchResults.length > 0 || searchTerm) && (
                <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 flex flex-col items-center">
                  {isSearching ? (
                    <div className="py-4">
                      <div className="h-6 w-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product/${item.slug}`}
                            className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setSearchTerm("")}
                          >
                            {item.name}
                          </Link>
                        ))
                      ) : (
                        <p className="p-2 text-gray-500 text-sm">No results found</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              className="h-8 px-3 flex items-center gap-2 relative cursor-pointer transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-2 !cursor-pointer">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 rounded-full overflow-hidden !cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <Image
                      src={user.profile || "./dokoo.png"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  </Button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2 z-50">
                      <Link
                        href="/customer/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="!cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/customer/login">
                  <Button variant="outline" className="h-8 px-4 text-sm !cursor-pointer">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col gap-3 px-4 py-3 border-t bg-white animate-in slide-in-from-top duration-300">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-2 !bg-gray-50 text-black border rounded-full focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <div className="flex flex-col gap-2 mt-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartCount})</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
            onClick={handleCloseCart}
          ></div>

          <div
            className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isClosing ? "translate-x-full" : "translate-x-0"}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Your Cart ({cartCount} items)</h2>
                <button onClick={handleCloseCart} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">Your cart is empty</p>
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={handleCloseCart}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b animate-in fade-in duration-300">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{item.name}</h3>
                          <p className="mt-1 text-sm font-medium">${item.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <button onClick={() => updateQuantity(item, item.quantity - 1)} className="p-1 rounded-md hover:bg-gray-100">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item, item.quantity + 1)} className="p-1 rounded-md hover:bg-gray-100">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between text-lg font-medium mb-4">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md text-base font-medium">
                    Proceed to Checkout
                  </Button>
                  <div className="mt-3 text-center">
                    <button onClick={handleCloseCart} className="text-sm text-gray-500 hover:text-gray-700">
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
