/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";

export default function ShippingAddressListPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await api.get("/shipping-address/getAll");
        if (res.data && Array.isArray(res.data.data)) setAddresses(res.data.data);
        else if (Array.isArray(res.data)) setAddresses(res.data);
        else setAddresses([]);
      } catch (err) {
        console.error(err);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  // Delete address
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/shipping-address/delete/${deleteId}`);
      setAddresses(addresses.filter((a) => a._id !== deleteId));
      toast.success("Address deleted successfully!");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address.");
      setDeleteId(null);
    }
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="relative border border-orange-200 bg-white p-5 rounded-2xl shadow-lg flex justify-between animate-pulse">
      <div className="space-y-2 flex-1">
        <div className="w-40 h-5 bg-gray-300 rounded"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
        <div className="w-48 h-4 bg-gray-200 rounded"></div>
        <div className="w-36 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="w-20 h-5 bg-gray-300 rounded"></div> {/* Default badge */}
        <div className="flex space-x-2 mt-2">
          <div className="w-12 h-6 bg-gray-300 rounded"></div> {/* Edit */}
          <div className="w-12 h-6 bg-gray-300 rounded"></div> {/* Delete */}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-orange-50 flex flex-col items-center gap-5">
        {/* Skeleton for heading */}
        <div className="w-64 h-8 bg-gray-300 rounded animate-pulse mb-6"></div>

        {/* Skeleton cards */}
        <div className="space-y-5 w-full max-w-3xl">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Skeleton for add button */}
        <div className="flex justify-center mt-8 w-full max-w-3xl">
          <div className="w-48 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-6 text-orange-700">
          Your Shipping Addresses
        </h1>

        {addresses.length === 0 ? (
          <p className="text-orange-400 text-center mt-10 text-lg">
            No addresses found.
          </p>
        ) : (
          <div className="space-y-5">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="relative border border-orange-200 bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform flex justify-between cursor-pointer"
                onClick={() =>
                  router.push(`/customer/profile/shipping-address/${address._id}`)
                }
              >
                <div>
                  <p className="font-semibold text-lg text-orange-700 mb-1">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    📞 {address.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    🏠 {address.address}, {address.zone}
                  </p>
                  <p className="text-sm text-gray-700">
                    🌆 {address.city}, {address.province}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {address.isDefault && (
                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full shadow-md">
                      Default
                    </span>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/customer/profile/shipping-address/${address._id}`);
                      }}
                      className="px-3 py-1 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(address._id);
                      }}
                      className="px-3 py-1 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/customer/profile/shipping-address/create")}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            + Add New Address
          </button>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold text-orange-700 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
