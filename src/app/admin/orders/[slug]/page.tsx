/* eslint-disable @typescript-eslint/no-explicit-any */

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
  shippingAddress?: { 
    addressLine: string; 
    city: string; 
    landmark: string; 
    province: string; 
    zone: string; 
    country: "NP"; 
    phoneNumber: string;
    fullName: string;
  };
};

// Status options with relevant actions
const STATUS_API_MAP: Record<string, string> = {
  "Pending": "Pending",
  "Processing": "Processing", 
  "Shipped": "Shipped",
  "Out for Delivery": "out_for_delivery",
  "Delivered": "Delivered",
  "Cancelled": "Cancelled"
};

const STATUS_DISPLAY_MAP: Record<string, string> = {
  "Pending": "Pending",
  "Processing": "Processing",
  "Shipped": "Shipped", 
  "out_for_delivery": "Out for Delivery",
  "Delivered": "Delivered",
  "Cancelled": "Cancelled"
};

const STATUS_OPTIONS = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: []
};

const PAYMENT_STATUS_OPTIONS = {
  Pending: ["Paid", "Failed"],
  Paid: ["Refunded"],
  Failed: ["Pending"],
  Refunded: []
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.slug;

  const { user, isAdmin, loading: userLoading } = useUser();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState("");

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
        const orderData = data.data || data;
        
        // Transform delivery status for display if needed
        if (orderData.deliveryStatus && STATUS_DISPLAY_MAP[orderData.deliveryStatus]) {
          orderData.deliveryStatus = STATUS_DISPLAY_MAP[orderData.deliveryStatus];
        }
        
        setOrder(orderData);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        alert("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) fetchOrder();
  }, [user, isAdmin, orderId]);

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempStatus(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempStatus("");
  };

  const updateOrderStatus = async (field: string, newStatus: string) => {
    if (!order) return;
    try {
      setUpdatingStatus(true);
      
      const updateData: any = {};
      
      if (field === 'deliveryStatus') {
        // Map human-readable status to API-friendly format
        updateData.deliveryStatus = STATUS_API_MAP[newStatus] || newStatus;

        // Auto-update payment status for COD orders when delivered
        if (updateData.deliveryStatus === 'Delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'Pending') {
          updateData.paymentStatus = 'Paid';
        }
      } else if (field === 'paymentStatus') {
        updateData.paymentStatus = newStatus;
      }

      const { data } = await api.put(`/order/update/status/${order._id}`, updateData);
      
      // Update local state with the new statuses
      const updatedOrder = { 
        ...order, 
        deliveryStatus: field === 'deliveryStatus' ? newStatus : order.deliveryStatus,
        paymentStatus: updateData.paymentStatus || order.paymentStatus
      };
      
      setOrder(updatedOrder);
      setEditingField(null);
      setTempStatus("");
      alert(`${field === 'deliveryStatus' ? 'Delivery' : 'Payment'} status updated to: ${newStatus}`);
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "delivered":
      case "paid":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "out for delivery":
      case "out_for_delivery":
        return "bg-indigo-100 text-indigo-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableStatusOptions = (currentStatus: string, field: string) => {
    if (field === 'deliveryStatus') {
      // Map API status back to display format for options
      const displayStatus = STATUS_DISPLAY_MAP[currentStatus] || currentStatus;
      return STATUS_OPTIONS[displayStatus as keyof typeof STATUS_OPTIONS] || [];
    } else {
      return PAYMENT_STATUS_OPTIONS[currentStatus as keyof typeof PAYMENT_STATUS_OPTIONS] || [];
    }
  };

  const formatDisplayStatus = (status: string) => {
    return STATUS_DISPLAY_MAP[status] || status;
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

  const displayDeliveryStatus = formatDisplayStatus(order.deliveryStatus);

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
                  Order {order._id.slice(-8)}
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
            Order {order._id.slice(-8)}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.deliveryStatus)}`}>
                {displayDeliveryStatus}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Print Invoice
          </button>
          {order.trackingId && (
            <Link 
              href={`/customer/tracking/${order.trackingId}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              View Tracking
            </Link>
          )}
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
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{order._id}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">
                    {order.paymentMethod}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Payment status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editingField === 'paymentStatus' ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value)}
                          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                          disabled={updatingStatus}
                        >
                          {getAvailableStatusOptions(order.paymentStatus, 'paymentStatus').map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateOrderStatus('paymentStatus', tempStatus)}
                          disabled={updatingStatus}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updatingStatus}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <button
                          onClick={() => startEditing('paymentStatus', order.paymentStatus)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                          title="Edit status"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Delivery status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editingField === 'deliveryStatus' ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value)}
                          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                          disabled={updatingStatus}
                        >
                          {getAvailableStatusOptions(order.deliveryStatus, 'deliveryStatus').map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateOrderStatus('deliveryStatus', tempStatus)}
                          disabled={updatingStatus}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updatingStatus}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.deliveryStatus)}`}>
                          {displayDeliveryStatus}
                        </span>
                        <button
                          onClick={() => startEditing('deliveryStatus', displayDeliveryStatus)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                          title="Edit status"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </dd>
                </div>
                {order.transactionId && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{order.transactionId}</dd>
                  </div>
                )}
                {order.trackingId && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tracking number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{order.trackingId}</dd>
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
                    <div className="flex-1">
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
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.shippingAddress?.fullName || order.user.fullName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.user.email}</dd>
                </div>
                {(order.user.phoneNumber || order.shippingAddress?.phoneNumber) && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.shippingAddress?.phoneNumber || order.user.phoneNumber}
                    </dd>
                  </div>
                )}
                {order.shippingAddress && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="space-y-1">
                        <div>{order.shippingAddress.addressLine}</div>
                        <div>{order.shippingAddress.zone}, {order.shippingAddress.city}</div>
                        <div>{order.shippingAddress.province}, Nepal</div>
                        {order.shippingAddress.landmark && (
                          <div className="text-gray-500">Landmark: {order.shippingAddress.landmark}</div>
                        )}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-3">
              {/* Show relevant next status options */}
              {getAvailableStatusOptions(order.deliveryStatus, 'deliveryStatus').map((status) => (
                <button
                  key={status}
                  disabled={updatingStatus}
                  onClick={() => updateOrderStatus('deliveryStatus', status)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Mark as {status}
                </button>
              ))}
              
              {/* Additional actions */}
              <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                Send Tracking Info
              </button>
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Contact Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}