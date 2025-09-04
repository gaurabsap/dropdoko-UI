"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock order data
const orders = [
  { 
    id: "ORD-12345", 
    customer: "John Doe", 
    date: "2023-04-15", 
    amount: "$123.50", 
    status: "Delivered",
    items: 3,
    payment: "Credit Card"
  },
  { 
    id: "ORD-12346", 
    customer: "Jane Smith", 
    date: "2023-04-14", 
    amount: "$89.99", 
    status: "Processing",
    items: 2,
    payment: "PayPal"
  },
  { 
    id: "ORD-12347", 
    customer: "Robert Johnson", 
    date: "2023-04-14", 
    amount: "$245.00", 
    status: "Shipped",
    items: 5,
    payment: "Credit Card"
  },
  { 
    id: "ORD-12348", 
    customer: "Emily Davis", 
    date: "2023-04-13", 
    amount: "$67.50", 
    status: "Delivered",
    items: 1,
    payment: "Stripe"
  },
  { 
    id: "ORD-12349", 
    customer: "Michael Wilson", 
    date: "2023-04-12", 
    amount: "$189.99", 
    status: "Cancelled",
    items: 4,
    payment: "Credit Card"
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "all"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter("processing")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "processing"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter("shipped")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "shipped"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Shipped
        </button>
        <button
          onClick={() => setFilter("delivered")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "delivered"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Delivered
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "cancelled"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cancelled
        </button>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Payment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customer}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.amount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.payment}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          View<span className="sr-only">, {order.id}</span>
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