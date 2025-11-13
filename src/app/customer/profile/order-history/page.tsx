/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/tools/axiosClient";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const statuses = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All Orders");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order/user/orders");
        const result = Array.isArray(res.data?.data) ? res.data.data : [];
        setOrders(result);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const normalizeStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
      case "canceled":
        return "Cancelled";
      default:
        return "Processing";
    }
  };

  const filteredOrders =
    filter === "All Orders"
      ? orders
      : orders.filter((o) => normalizeStatus(o.deliveryStatus) === filter);

  return (
    <div className="p-4 sm:p-8 bg-[#fff9f5] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-orange-800">Orders</h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-full border border-orange-400 text-sm font-medium transition-all",
              filter === status
                ? "bg-orange-500 text-white shadow-lg"
                : "text-orange-500 hover:bg-orange-100"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-orange-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-orange-50">
            <tr className="border-b">
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Items</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-b animate-pulse">
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <td key={i} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                    ))}
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: any) => {
                const statusLabel = normalizeStatus(order.deliveryStatus);
                const itemCount = order.items?.reduce(
                  (acc: number, i: any) => acc + i.quantity,
                  0
                );
                return (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">Rs. {order.totalAmount}</td>
                    <td className="px-6 py-4">{itemCount}</td>
                    <td className="px-6 py-4 capitalize">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">{statusLabel}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => router.push(`/customer/tracking/${order.trackingId}`)}
                          className="text-sm text-orange-600 font-medium hover:text-orange-700 hover:underline transition"
                        >
                          Track
                        </button>
                        <div className="w-[1px] h-4 bg-gray-300"></div>
                        <button
                          onClick={() =>
                            router.push(`/customer/profile/order-history/${order._id}`)
                          }
                          className="text-sm text-gray-700 font-medium hover:text-gray-900 hover:underline transition"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {loading
          ? [...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-2xl shadow animate-pulse space-y-2"
              ></div>
            ))
          : filteredOrders.length === 0
          ? (
            <p className="text-center text-gray-500 mt-8">No orders found.</p>
          )
          : filteredOrders.map((order) => {
              const statusLabel = normalizeStatus(order.deliveryStatus);
              const itemCount = order.items?.reduce(
                (acc: number, i: any) => acc + i.quantity,
                0
              );
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col space-y-2 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {order._id}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        statusLabel === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : statusLabel === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : statusLabel === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-800 font-medium">
                    Rs. {order.totalAmount}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {itemCount} Items
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() =>
                        router.push(`/customer/tracking/${order.trackingId}`)
                      }
                      className="text-orange-500 text-sm font-medium hover:underline"
                    >
                      Track
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/customer/profile/order-history/${order._id}`
                        )
                      }
                      className="text-gray-600 text-sm font-medium hover:underline"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
