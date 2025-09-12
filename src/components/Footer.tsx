"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo + Review */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-orange-500 text-4xl">
                <Image
                    src="/logo.png"
                    alt="DropDoko Logo"
                    width={60}
                    height={30}
                />
                </span> 
                <h1 className="text-2xl mr-5">DropDoko</h1>
          </h2>
          <p className="text-sm text-center -mt-2 mr-4 text-gray-600">Your Digital Doko</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Leave a review"
              className="w-56 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg text-orange-600 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><Link href="#">Home</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-bold text-lg text-orange-600 mb-3">Customer Support</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Shipping & Delivery</Link></li>
            <li><Link href="#">Returns & Refunds</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="font-bold text-lg text-orange-600 mb-3">Connect With Us</h3>
          <p className="text-sm text-gray-700">dropdoko@gmail.com</p>
          <p className="text-sm text-gray-700 mb-3">+977 9845097315</p>
          
          <div className="flex space-x-4 mt-3">
            <Link href="#" className="text-orange-500 hover:text-orange-600">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-orange-500 hover:text-orange-600">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-orange-500 hover:text-orange-600">
              <Facebook className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t pt-5 text-center text-sm text-gray-600">
        ©2025 DropDoko. All rights reserved.
      </div>
    </footer>
  );
}
