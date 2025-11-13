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

  // Skeleton card
  const SkeletonCard = () => (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 animate-pulse">
      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-52 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-40 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-gray-300 rounded-md animate-pulse mx-auto"></div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          <div className="w-48 h-12 bg-gray-300 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl text-center font-semibold mb-6 text-gray-800">
          Your Shipping Addresses
        </h1>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-lg">
            No addresses found.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
                onClick={() =>
                  router.push(`/customer/profile/shipping-address/${address._id}`)
                }
              >
                <div className="flex justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[60%]">
                    <p className="font-semibold text-lg text-gray-800">
                      {address.fullName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📞 {address.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      🏠 {address.address}, {address.zone}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      🌆 {address.city}, {address.province}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {address.isDefault && (
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full shadow">
                        Default
                      </span>
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/customer/profile/shipping-address/${address._id}`
                          );
                        }}
                        className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(address._id);
                        }}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() =>
              router.push("/customer/profile/shipping-address/create")
            }
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-full shadow-md hover:bg-orange-500 hover:scale-105 transition"
          >
            + Add New Address
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
