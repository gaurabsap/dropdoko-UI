"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/tools/axiosClient";
import { useUser } from "@/components/context/userContext";

type OrderType = {
  _id: string;
  user: { _id: string; fullName: string; email: string; phoneNumber?: string; address?: string };
  createdAt: string;
  totalAmount: string;
  status: string;
  items: { name: string; price?: string; quantity: number; totalAmount?: string }[];
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  transactionId?: string;
  shippingMethod?: string;
  trackingId?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress?: { addressLine: string; city: string; landmark: string; province: string; zone: string, country: "NP", phoneNumber: string};
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.slug;

  const { user, isAdmin, loading: userLoading } = useUser();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!userLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, userLoading, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/order/getbyid/${orderId}`);
        setOrder(data.data || data); // adjust depending on API structure
      } catch (err) {
        console.error("Failed to fetch order:", err);
        alert("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) fetchOrder();
  }, [user, isAdmin, orderId]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      setUpdatingStatus(true);
      const { data } = await api.put(`/order/${order._id}/status`, {
        deliveryStatus: newStatus,
      });
      setOrder({ ...order, deliveryStatus: newStatus });
      alert(`Order status updated to: ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">You are not authorized to view this page.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link href="/admin/orders" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Orders
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-orange-600">
                  Order {order._id}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Order {order._id}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.deliveryStatus)}`}>
                {order.deliveryStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Print Invoice
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
            Edit Order
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Order & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order._id}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.createdAt}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.paymentMethod}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Payment status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.paymentStatus}</dd>
                </div>
                {order.transactionId && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.transactionId}</dd>
                  </div>
                )}
                {order.shippingMethod && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Shipping method</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shippingMethod}</dd>
                  </div>
                )}
                {order.trackingId && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tracking number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.trackingId}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <li key={idx} className="px-4 py-4 sm:px-6 flex justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">Rs. {item.totalAmount || "—"}</div>
                      <div className="text-gray-500">Rs. {item.price || "—"} each</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between text-lg font-medium text-gray-900">
                <div>Total</div>
                <div>Rs. {order.totalAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Actions */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.user.fullName}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.user.email}</dd>
                </div>
                {order.user.phoneNumber || order.shippingAddress?.phoneNumber && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.user.phoneNumber || order.shippingAddress?.phoneNumber}</dd>
                  </div>
                )}
                {order.shippingAddress && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shippingAddress.addressLine}, {order.shippingAddress.zone}, {order.shippingAddress.city}, NP</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Update Status</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-4">
              {["Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  disabled={updatingStatus || order.deliveryStatus.toLowerCase() === status.toLowerCase()}
                  onClick={() => updateOrderStatus(status)}
                  className={`w-full flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    status === "Delivered"
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Mark as {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
