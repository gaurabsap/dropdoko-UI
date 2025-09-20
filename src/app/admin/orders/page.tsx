"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/tools/axiosClient"; // make sure axios instance is configured
import { useUser } from "@/components/context/userContext";
type OrderType = {
  _id: string;
  user: { _id: string; fullName: string };
  createdAt: string;
  totalAmount: string;
  status: string;
  items: { name: string; quantity: number }[];
  paymentMethod: string;
  deliveryStatus: string;
  paymentStatus: string;
};

export default function OrdersPage() {

  const router = useRouter();
  const { user, isAdmin, loading: userLoading } = useUser();
  console.log("user in orders page:", user, "isAdmin:", isAdmin);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filter, setFilter] = useState("all");

  // ✅ Redirect if not admin
  // useEffect(() => {
  //   if (!userLoading) {
  //     if (!user || !isAdmin) {
  //       router.push("/admin/login");
  //     }
  //   }
  // }, [user, isAdmin, userLoading, router]);

  // ✅ Fetch orders if admin
  useEffect(() => {

    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/order/getall"); // adjust endpoint
      // adjust if your API structure differs
      setOrders(data.data || data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter(o => o.deliveryStatus.toLowerCase() === filter?.toLowerCase());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (userLoading || loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );

  // If not admin
  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders in your store including order ID, customer, date, amount and status.
          </p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="mt-6 flex space-x-4">
        {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === status ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders && filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order._id}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.user.fullName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.createdAt}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.totalAmount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.items.length}
                      </td>


                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.paymentMethod}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.deliveryStatus)}`}>
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/admin/orders/${order._id}`} className="text-orange-600 hover:text-orange-900">
                          View<span className="sr-only">, {order._id}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
