/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/tools/axiosClient";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/order/getbyid/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded mt-3 sm:mt-0"></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 h-4 bg-gray-200 rounded"></th>
                    <th className="px-4 py-3 h-4 bg-gray-200 rounded"></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 h-12 bg-gray-200 rounded"></td>
                      <td className="px-4 py-3 h-4 bg-gray-200 rounded"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Order not found.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 mb-4 transition"
      >
        <ArrowLeft size={18} /> Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Order #{order.trackingId}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                order.deliveryStatus === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.deliveryStatus === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.deliveryStatus}
            </span>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-orange-500" size={20} />
              <h2 className="font-medium text-gray-800">Shipping Address</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {order.shippingAddress?.fullName}
              <br />
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.zone}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.province}
              <br />
              📞 {order.shippingAddress?.phoneNumber}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-orange-500" size={20} />
              <h2 className="font-medium text-gray-800">Payment</h2>
            </div>
            {/* Track Order */}
            {order.trackingId && (
              <div className="flex justify-end">
                <button
                  onClick={() => router.push(`/customer/tracking/${order.trackingId}`)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                >
                  Track Order
                </button>
              </div>
            )}

            <p className="text-gray-700 text-sm">
              Method: {order.paymentMethod.toUpperCase()}
              <br />
              Status:{" "}
              <span
                className={`${
                  order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                } font-medium`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-orange-500" size={20} />
            <h2 className="font-medium text-gray-800">Ordered Items</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any) => (
                  <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative w-12 h-12">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">Rs. {item.price}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      Rs. {item.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {order.items?.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col sm:hidden space-y-2"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: Rs. {item.price}</p>
                    <p className="text-sm font-medium text-gray-800">
                      Total: Rs. {item.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
          </div>

          <div className="mt-3 sm:mt-0 text-right space-y-1">
            <p className="text-sm text-gray-600">
              Shipping Fee: Rs. {order.shippingFee.toFixed(2)}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Total: Rs. {order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
