/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import api from "@/tools/axiosClient";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ 
    code: "", 
    discount: "", 
    usageLimit: "",
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/coupons/all");
        setCoupons(res.data.data);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = {
        code: form.code,
        discount: form.discount,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        isActive: form.isActive
      };

      if (editingId) {
        await api.put(`/coupons/${editingId}`, formData);
      } else {
        await api.post("/coupons/create", formData);
      }
      setForm({ code: "", discount: "", usageLimit: "", isActive: true });
      setEditingId(null);
      const res = await api.get("/coupons/all");
      setCoupons(res.data.data);
    } catch (error) {
      console.error("Failed to save coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (coupon: any) => {
    setForm({ 
      code: coupon.code, 
      discount: coupon.discount,
      usageLimit: coupon.usageLimit || "",
      isActive: coupon.isActive !== false // Default to true if undefined
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      await api.delete(`/coupons/delete/${id}`);
      setCoupons(coupons.filter((c: any) => c._id !== id));
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  const resetUsage = async (id: string) => {
    if (!confirm("Reset usage count to 0?")) return;
    
    try {
      await api.put(`/coupons/${id}`, { usedCount: 0 });
      const res = await api.get("/coupons/all");
      setCoupons(res.data.data);
    } catch (error) {
      console.error("Failed to reset usage:", error);
    }
  };

  const toggleActiveStatus = async (coupon: any) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      const res = await api.get("/coupons/all");
      setCoupons(res.data.data);
    } catch (error) {
      console.error("Failed to update coupon status:", error);
    }
  };

  const getUsagePercentage = (coupon: any) => {
    if (!coupon.usageLimit || coupon.usageLimit === 0) return 0;
    return Math.min(100, ((coupon.usedCount || 0) / coupon.usageLimit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Coupon Management
          </h1>
          <p className="text-gray-600 text-lg">Create and manage discount coupons with usage tracking</p>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-orange-100/50">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingId ? "Edit Coupon" : "Create New Coupon"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g., SUMMER25"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Discount Percentage</label>
                <input
                  type="number"
                  placeholder="e.g., 25"
                  min="1"
                  max="100"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Usage Limit</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  min="1"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited usage</p>
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm">
                <div>
                  <label className="text-sm font-medium text-gray-700">Active Status</label>
                  <p className="text-xs text-gray-500">Whether this coupon can be used</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isActive ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : editingId ? (
                  "Update Coupon"
                ) : (
                  "Create Coupon"
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ code: "", discount: "", usageLimit: "", isActive: true });
                    setEditingId(null);
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 rounded-xl transition-colors duration-200"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Coupons Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-orange-100/50">
          <div className="px-8 py-6 border-b border-orange-100/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Active Coupons</h2>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                {coupons.length} {coupons.length === 1 ? 'coupon' : 'coupons'}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-amber-50/50">
                    <th className="text-left px-8 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Coupon Code</th>
                    <th className="text-left px-8 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Discount</th>
                    <th className="text-left px-8 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Usage</th>
                    <th className="text-center px-8 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                    <th className="text-center px-8 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50">
                  {coupons.map((coupon: any) => {
                    const usagePercentage = getUsagePercentage(coupon);
                    const usageColor = getUsageColor(usagePercentage);
                    const isExpired = coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit;
                    const isActive = coupon.isActive !== false; // Default to true if undefined
                    
                    return (
                      <tr 
                        key={coupon._id} 
                        className={`hover:bg-orange-50/30 transition-all duration-200 group ${
                          !isActive ? 'bg-gray-100/50' : isExpired ? 'bg-red-50/50' : ''
                        }`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-lg font-bold px-3 py-1 rounded-lg ${
                              isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {coupon.code}
                            </span>
                            {!isActive && (
                              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                INACTIVE
                              </span>
                            )}
                            {isActive && isExpired && (
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                EXPIRED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-2xl font-bold text-gray-800">
                            {coupon.discount}%
                          </span>
                          <span className="text-gray-500 ml-2">off</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Used</span>
                              <span className="font-medium text-gray-800">
                                {coupon.usedCount || 0} 
                                {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (Unlimited)'}
                              </span>
                            </div>
                            {coupon.usageLimit && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${usageColor}`}
                                  style={{ width: `${usagePercentage}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleActiveStatus(coupon)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  isActive ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    isActive ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isActive 
                                  ? (isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {!isActive ? 'Inactive' : (isExpired ? 'Expired' : 'Active')}
                              </span>
                            </div>
                            {!isActive && (
                              <span className="text-xs text-gray-500">Coupon cannot be used</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => resetUsage(coupon._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
                            >
                              Reset Usage
                            </button>
                            <button
                              onClick={() => handleDelete(coupon._id)}
                              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <div className="text-gray-400 text-lg">
                          No coupons created yet
                        </div>
                        <div className="text-gray-500 mt-2">
                          Create your first coupon above to get started
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}