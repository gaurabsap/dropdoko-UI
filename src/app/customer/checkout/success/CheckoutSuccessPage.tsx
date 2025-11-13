/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/tools/axiosClient";

interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  zone: string;
  landmark?: string;
  addressLine: string;
}

interface User {
  email: string;
  fullName?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  _id: string;
  trackingId: string;
  orderId: string;
  orderDate: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  user?: User;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/order/getbyid/${orderId}`);
        setOrder(res.data.data || null);
      } catch (error) {
        console.error("Failed to fetch order details", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mx-auto animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-orange-100 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-6 bg-gradient-to-r from-orange-200 to-amber-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
          <p className="text-gray-600">We couldnt find the order youre looking for.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Your order has been successfully placed and is being processed.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          
          {/* Tracking Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-orange-100 font-medium">Tracking Number</p>
                <p className="text-2xl font-bold tracking-wider">{order.trackingId}</p>
              </div>
              <Link
                href={`/customer/tracking/${order.trackingId}`}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Track Order
              </Link>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Order Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order ID</p>
                <p className="text-lg font-mono text-gray-800 truncate">{order._id}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order Date</p>
                <p className="text-lg text-gray-800">{formatDate(order.createdAt)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Customer Email</p>
                <p className="text-lg text-gray-800 truncate">{order.user?.email ?? "N/A"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-lg text-gray-800">{order.shippingAddress.phoneNumber}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Address
              </h3>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <p className="font-semibold text-gray-800 text-lg mb-2">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 leading-relaxed">
                  {order.shippingAddress.addressLine}, {order.shippingAddress.zone}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.province}
                  {order.shippingAddress.landmark && (
                    <>
                      <br />
                      <span className="text-sm text-gray-500">Landmark: {order.shippingAddress.landmark}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h3>
              
              <div className="rounded-2xl overflow-hidden border border-orange-100">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-4 border-b border-orange-100">
                  <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    <div className="col-span-6 md:col-span-7 lg:col-span-8">Item</div>
                    <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center">Qty</div>
                    <div className="col-span-3 md:col-span-3 lg:col-span-2 text-right">Price</div>
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-orange-50">
                  {order.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 px-4 py-4 hover:bg-orange-50/50 transition-colors">
                      <div className="col-span-6 md:col-span-7 lg:col-span-8 font-medium text-gray-800 text-sm md:text-base">
                        <div className="line-clamp-2 md:line-clamp-1">{item.name}</div>
                      </div>
                      <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center text-gray-600 text-sm md:text-base">
                        {item.quantity}
                      </div>
                      <div className="col-span-3 md:col-span-3 lg:col-span-2 text-right font-semibold text-gray-800 text-sm md:text-base">
                        Rs. {item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Amount */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-xl font-bold">Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/"
                className="flex-1 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:shadow-lg"
              >
                Continue Shopping
              </Link>
              <Link
                href={`/customer/tracking/${order.trackingId}`}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-gray-500 text-sm">
            A confirmation email has been sent to <span className="font-semibold text-orange-600">{order.user?.email ?? "N/A"}</span>
          </p>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} DropDoko. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}