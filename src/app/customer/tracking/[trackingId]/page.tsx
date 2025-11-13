/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams, useRouter } from "next/navigation";
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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface StatusHistory {
  status: string;
  timestamp: string;
  description?: string;
}

interface TrackingData {
  _id: string;
  trackingId: string;
  orderId: string;
  orderDate: string;
  createdAt: string;
  currentStatus: string;
  estimatedDelivery?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  statusHistory: StatusHistory[];
  user?: {
    email: string;
    fullName?: string;
  };
}

// Define our status stages in order
const STATUS_STAGES = [
  { key: "ordered", label: "Order Placed", description: "Your order has been confirmed" },
  { key: "processing", label: "Processing", description: "Preparing your order" },
  { key: "shipped", label: "Shipped", description: "Your order is on the way" },
  { key: "out_for_delivery", label: "Out for Delivery", description: "Getting close to you" },
  { key: "delivered", label: "Delivered", description: "Order delivered successfully" }
];

const STATUS_COLORS: { [key: string]: string } = {
  ordered: "bg-orange-500",
  processing: "bg-amber-500",
  shipped: "bg-orange-400",
  out_for_delivery: "bg-amber-400",
  delivered: "bg-green-500",
  cancelled: "bg-red-500"
};

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = params.trackingId as string;
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!trackingId) {
        setError("No tracking ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/order/track/${trackingId}`);
        console.log(res.data.order)
        if (res.data.order) {
          setTrackingData(res.data.order);
        } else {
          setError("Order not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch tracking details", err);
        setError(err.response?.data?.message || "Failed to load tracking information");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [trackingId]);

  const getStatusIndex = (status: string) => {
    return STATUS_STAGES.findIndex(stage => stage.key === status);
  };

  const getCurrentStatusIndex = () => {
    if (!trackingData) return -1;
    const lastStatus = trackingData.statusHistory[trackingData.statusHistory.length - 1].status;
    return getStatusIndex(lastStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mx-auto animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg w-1/3 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg w-1/4 mx-auto animate-pulse"></div>
            </div>
          </div>

          {/* Progress Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-orange-100 p-8">
            <div className="h-6 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-1/4 mb-8 animate-pulse"></div>
            <div className="space-y-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Tracking Not Found</h2>
            <p className="text-gray-600">
              {error || "We couldn't find any tracking information for this ID."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className={`w-24 h-24 ${getStatusColor(trackingData.currentStatus)} rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-500`}>
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Order Tracking
            </h1>
            <p className="text-gray-600 text-lg">
              Tracking ID: <span className="font-mono font-semibold text-orange-600">{trackingData.trackingId}</span>
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-orange-100 font-medium">Current Status</p>
                <p className="text-3xl font-bold capitalize">
                  {trackingData.currentStatus?.replace(/_/g, ' ')}
                </p>
                {trackingData.estimatedDelivery && (
                  <p className="text-orange-100 mt-1">
                    Estimated Delivery: {formatDate(trackingData.estimatedDelivery)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-orange-100 font-medium">Order Total</p>
                <p className="text-3xl font-bold">Rs. {trackingData.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Progress Tracking - Horizontal Layout */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Order Progress
              </h3>

              <div className="relative">
                {/* Progress Line - Horizontal */}
                <div className="hidden lg:block absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -z-10">
                  <div 
                    className={`bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: currentStatusIndex >= 0 ? `${Math.max(0, (currentStatusIndex / (STATUS_STAGES.length - 1)) * 100)}%` : '0%' 
                    }}
                  ></div>
                </div>

                {/* Progress Line - Vertical for mobile */}
                <div className="lg:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10">
                  <div 
                    className={`bg-gradient-to-b from-orange-500 to-amber-500 transition-all duration-1000 ease-out`}
                    style={{ 
                      height: currentStatusIndex >= 0 ? `${Math.max(0, (currentStatusIndex / (STATUS_STAGES.length - 1)) * 100)}%` : '0%' 
                    }}
                  ></div>
                </div>

                {/* Status Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-0 relative z-10">
                  {STATUS_STAGES.map((stage, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const statusHistoryItem = trackingData.statusHistory.find(
                      item => item.status === stage.key
                    );

                    return (
                      <div key={stage.key} className={`flex lg:flex-col items-start lg:items-center gap-3 lg:gap-2 ${index < STATUS_STAGES.length - 1 ? 'lg:pr-4' : ''}`}>
                        {/* Status Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                          isCompleted 
                            ? getStatusColor(stage.key) 
                            : 'bg-gray-200'
                        } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}>
                          {isCompleted ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          )}
                        </div>

                        {/* Status Content */}
                        <div className="flex-1 lg:text-center min-w-0">
                          <div className="flex flex-col lg:items-center gap-1">
                            <h4 className={`font-semibold text-lg lg:text-base transition-colors duration-300 ${
                              isCompleted ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {stage.label}
                            </h4>
                            {statusHistoryItem && (
                              <span className="text-sm text-gray-500 hidden lg:block">
                                {formatDate(statusHistoryItem.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className={`mt-1 text-sm transition-colors duration-300 hidden lg:block ${
                            isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {statusHistoryItem?.description || stage.description}
                          </p>
                          
                          {/* Mobile only - show date and description on click/hover */}
                          <div className="lg:hidden mt-1">
                            {statusHistoryItem && (
                              <span className="text-xs text-gray-500 block">
                                {formatDate(statusHistoryItem.timestamp)}
                              </span>
                            )}
                            <p className={`text-xs transition-colors duration-300 ${
                              isCompleted ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {statusHistoryItem?.description || stage.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Shipping Address
                </h3>

                {trackingData?.shippingAddress ? (
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    {trackingData.shippingAddress.fullName ? (
                      <p className="font-semibold text-gray-800 text-lg mb-2">
                        {trackingData.shippingAddress.fullName}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic mb-2">No name provided</p>
                    )}

                    <p className="text-gray-600 leading-relaxed">
                      {trackingData.shippingAddress.addressLine
                        ? trackingData.shippingAddress.addressLine
                        : "No address line"}
                      {trackingData.shippingAddress.zone && `, ${trackingData.shippingAddress.zone}`}
                      {trackingData.shippingAddress.city && <><br />{trackingData.shippingAddress.city}</>}
                      {trackingData.shippingAddress.province && `, ${trackingData.shippingAddress.province}`}

                      {trackingData.shippingAddress.landmark && (
                        <>
                          <br />
                          <span className="text-sm text-gray-500">
                            Landmark: {trackingData.shippingAddress.landmark}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="text-gray-600 mt-3">
                      📞{" "}
                      {trackingData.shippingAddress.phoneNumber
                        ? trackingData.shippingAddress.phoneNumber
                        : "No phone number"}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-gray-500 italic">
                    Shipping address not available.
                  </div>
                )}
              </div>


              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Summary
                </h3>
                <div className="grid gap-3">
                  {trackingData.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_auto] items-center py-2 border-b border-orange-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-[220px]">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-right whitespace-nowrap">
                        Rs. {item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-orange-200 grid grid-cols-[1fr_auto] items-center text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-right">Rs. {trackingData.totalAmount.toFixed(2)}</span>
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
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:shadow-lg"
              >
                Print Details
              </button>
              <Link
                href="/support"
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Help
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Need help with your order? <Link href="/support" className="font-semibold text-orange-600 hover:text-orange-700">Contact our support team</Link>
          </p>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} DropDoko. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}