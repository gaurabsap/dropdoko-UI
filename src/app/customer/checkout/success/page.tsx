
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
  trackingId: string;
  orderId: string;
  orderDate: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  user?: User
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) return;

      try {
        const res = await api.get(`/order/getbyid/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };
    fetchOrder();
  }, [searchParams]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center border-b pb-6">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Thank you for your order!
          </h1>
          <p className="text-gray-500 mt-1">
            Your order has been successfully placed.
          </p>
        </div>

        {/* Tracking ID */}
        <div className="mt-6 text-center">
          <p className="bg-orange-100 text-orange-700 font-semibold py-3 px-5 rounded-lg inline-block">
            Tracking ID: {order.trackingId}
          </p>
        </div>

        {/* Order Info */}
        <div className="mt-6 space-y-2 text-gray-700">
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Order Date:</strong> {order.orderDate}
          </p>
          <div>
            <strong>Shipping Address:</strong>
            <p className="text-gray-600 mt-1">
              {order.shippingAddress.fullName} ({order.shippingAddress.phoneNumber})
              <br />
              {order.shippingAddress.addressLine}, {order.shippingAddress.zone},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.province}
              {order.shippingAddress.landmark && (
                <>
                  <br />
                  Landmark: {order.shippingAddress.landmark}
                </>
              )}
            </p>
          </div>
          <p>
            <strong>Email:</strong> {order.user?.email}
          </p>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Order Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-orange-100">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-700">Item</th>
                  <th className="py-2 px-4 text-left text-gray-700">Qty</th>
                  <th className="py-2 px-4 text-left text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">Rs. {item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-right text-lg font-bold text-orange-600 mt-4">
            Total: Rs. {order.totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Track Button */}
        <div className="mt-8 text-center">
          <Link
            href={`/track/${order.trackingId}`}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors duration-300"
          >
            Track My Order
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
          <p>We’ve also sent a confirmation email to {order.user?.email}</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} DropDoko. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
