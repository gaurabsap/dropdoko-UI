/* eslint-disable */


"use client";

import Image from "next/image";
import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, Wallet, MapPin, PlusCircle, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-10">
          <div className="h-10 bg-orange-200 rounded-full w-60 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-orange-200 rounded-full w-80 mx-auto animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:w-2/3 space-y-6">
            {/* Shipping Address Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200">
              <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="h-6 bg-orange-200 rounded-full w-48 animate-pulse"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-5 bg-orange-200 rounded-full w-40 animate-pulse"></div>
                {[1, 2].map((item) => (
                  <div key={item} className="p-4 rounded-xl border-2 border-orange-100">
                    <div className="flex items-start">
                      <div className="h-5 w-5 bg-orange-200 rounded-full mr-3 mt-0.5 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-5 bg-orange-200 rounded-full w-32 animate-pulse"></div>
                          <div className="h-6 bg-orange-200 rounded-full w-16 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-orange-200 rounded-full w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-orange-200 rounded-full w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-orange-200 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="h-12 bg-orange-200 rounded-xl w-full mt-4 animate-pulse"></div>
              </div>
            </div>

            {/* Cart Items Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200">
              <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="h-6 bg-orange-200 rounded-full w-48 animate-pulse"></div>
              </div>
              <div className="divide-y divide-orange-100">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-6 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-20 h-20 bg-orange-200 rounded-xl animate-pulse"></div>
                    <div className="flex-grow">
                      <div className="h-5 bg-orange-200 rounded-full w-40 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-orange-200 rounded-full w-24 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center border border-orange-200 rounded-full bg-white">
                        <div className="h-8 w-8 bg-orange-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-8 bg-orange-200 rounded-full mx-2 animate-pulse"></div>
                        <div className="h-8 w-8 bg-orange-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-orange-200 rounded-full w-16 animate-pulse"></div>
                      <div className="h-8 w-8 bg-orange-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
              <div className="h-6 bg-orange-200 rounded-full w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="p-4 rounded-xl border-2 border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-orange-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-5 bg-orange-200 rounded-full w-32 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-orange-200 rounded-full w-40 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column Skeleton - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-orange-200">
              <div className="h-6 bg-orange-200 rounded-full w-40 mb-6 pb-3 border-b border-orange-200 animate-pulse"></div>
              
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 bg-orange-200 rounded-full w-24 animate-pulse"></div>
                    <div className="h-4 bg-orange-200 rounded-full w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-orange-200">
                <div className="h-5 bg-orange-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-5 bg-orange-200 rounded-full w-20 animate-pulse"></div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="h-12 bg-orange-200 rounded-xl w-full animate-pulse"></div>
                <div className="h-12 bg-orange-200 rounded-xl w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Checkout() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    landmark: "",
    province: { id: "", name: "" },
    city: { id: "", name: "" },
    zone: { id: "", name: "" },
    address: "",
    isDefault: false
  });

  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [zoneList, setZoneList] = useState<any[]>([]);

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await api.get("/shipping-address/getAll");
        if (res.data && Array.isArray(res.data.data)) {
          setAddresses(res.data.data);
          // Select the default address if available
          const defaultAddress = res.data.data.find((addr: any) => addr.isDefault);
          if (defaultAddress) setSelectedAddress(defaultAddress._id);
        } else if (Array.isArray(res.data)) {
          setAddresses(res.data);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error(err);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  // Fetch provinces
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await api.get("/user/location");
        setProvinceList(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load provinces");
      }
    }
    
    if (showAddressForm) {
      fetchProvinces();
    }
  }, [showAddressForm]);

  // Fetch cities when province changes
  useEffect(() => {
    if (!formData.province.id) {
      setCityList([]);
      setZoneList([]);
      return;
    }
    
    async function fetchCities() {
      try {
        const res = await api.get(`/user/location?addressId=${formData.province.id}`);
        setCityList(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cities");
      }
    }
    
    fetchCities();
  }, [formData.province]);

  // Fetch zones when city changes
  useEffect(() => {
    if (!formData.city.id) {
      setZoneList([]);
      return;
    }
    
    async function fetchZones() {
      try {
        const res = await api.get(`/user/location?addressId=${formData.city.id}`);
        setZoneList(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load zones");
      }
    }
    
    fetchZones();
  }, [formData.city]);

  const updateQuantity = (item: typeof cart[0], newQty: number) => {
    if (newQty < 1) {
      removeFromCart(item.id);
    } else {
      addToCart({ ...item, quantity: newQty - item.quantity });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: string) => {
    const value = e.target.value;
    
    if (field === 'province') {
      const selected = provinceList.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        province: selected ? { id: selected.id, name: selected.name } : { id: "", name: "" },
        city: { id: "", name: "" },
        zone: { id: "", name: "" }
      }));
    } else if (field === 'city') {
      const selected = cityList.find(c => c.id === value);
      setFormData(prev => ({
        ...prev,
        city: selected ? { id: selected.id, name: selected.name } : { id: "", name: "" },
        zone: { id: "", name: "" }
      }));
    } else if (field === 'zone') {
      const selected = zoneList.find(z => z.id === value);
      setFormData(prev => ({
        ...prev,
        zone: selected ? { id: selected.id, name: selected.name } : { id: "", name: "" }
      }));
    }
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addressData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        landmark: formData.landmark,
        province: formData.province.name,
        city: formData.city.name,
        zone: formData.zone.name,
        address: formData.address,
        isDefault: formData.isDefault
      };
      
      const res = await api.post("/shipping-address/create", addressData);
      const newAddress = res.data?.data || res.data;
      setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: formData.isDefault ? false : addr.isDefault
      })).concat(newAddress)
    );
      setSelectedAddress(newAddress._id);
      setShowAddressForm(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        landmark: "",
        province: { id: "", name: "" },
        city: { id: "", name: "" },
        zone: { id: "", name: "" },
        address: "",
        isDefault: false
      });
      toast.success("Address added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address.");
    }
  };

  const checkout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Prepare payload for the backend
      const payload = {
        items: cart.map(item => ({
          name: item.name,
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl
        })),
        paymentMethod: selectedPayment, // 'cod' or 'fonepay'
        shippingAddressId: selectedAddress,
        totalAmount: total
      };

      // Hit your backend API to create the order
      const res = await api.post("/order/create", payload);
      if (res.data.data && res.data.data._id) {
        clearCart();
        toast.success("Order placed successfully!");
        router.replace(`/customer/checkout/success?orderId=${res.data.data._id}`);
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Checkout failed. Please try again.");
    }
  };


  if (loading) {
    return <CheckoutSkeleton />;
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-orange-200">
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-orange-900 mb-4">Your Cart is Empty</h1>
          <p className="text-orange-700 mb-6">Looks like you havent added anything to your cart yet.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all">
              <ArrowLeft size={18} />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-black">Review your items and complete your purchase</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Address & Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200">
              <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <h2 className="text-xl font-semibold text-orange-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {addresses.length > 0 ? (
                  <>
                    <h3 className="font-medium text-orange-900">Select a saved address</h3>
                    
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div 
                          key={address._id}
                          className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === address._id ? "border-orange-500 bg-orange-50" : "border-orange-100 hover:border-orange-300"}`}
                          onClick={() => setSelectedAddress(address._id)}
                        >
                          <div className={`h-5 w-5 mt-0.5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedAddress === address._id ? "border-orange-500 bg-orange-500" : "border-orange-300"}`}>
                            {selectedAddress === address._id && <div className="h-2 w-2 rounded-full bg-white"></div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-orange-900">{address.fullName}</h4>
                              {address.isDefault && (
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-orange-700 mt-1 text-sm">📞 {address.phoneNumber}</p>
                            <p className="text-orange-700 text-sm">🏠 {address.address}, {address.zone}</p>
                            <p className="text-orange-700 text-sm">🌆 {address.city}, {address.province}</p>
                            {address.landmark && (
                              <p className="text-orange-700 text-sm">📍 {address.landmark}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-orange-700 text-center py-4">No saved addresses found.</p>
                )}
                
                <Button 
                  onClick={() => setShowAddressForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  Add New Address
                </Button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200">
              <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <h2 className="text-xl font-semibold text-orange-900 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Cart Items ({cart.length})
                </h2>
              </div>
              
              <div className="divide-y divide-orange-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start gap-4 hover:bg-orange-50/50 transition-colors">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl shadow-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-orange-900 text-[17px]">{item.name}</h3>
                      <p className="text-orange-700 mt-1">Rs {item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center border border-orange-200 rounded-full bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-l-full transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 text-orange-900 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-r-full transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-orange-900 font-semibold text-[16px]">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <Button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-sm transition-all"
                        size="icon"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delete All Button */}
            {cart.length > 0 && (
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete all items from the cart?")) {
                      clearCart();
                    }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-full font-medium shadow-sm transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete All Items
                </Button>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
              <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <div 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === "cod" ? "border-orange-500 bg-orange-50" : "border-orange-100 hover:border-orange-300"}`}
                  onClick={() => setSelectedPayment("cod")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === "cod" ? "border-orange-500 bg-orange-500" : "border-orange-300"}`}>
                      {selectedPayment === "cod" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <h3 className="font-medium text-orange-900">Cash on Delivery</h3>
                      <p className="text-sm text-orange-700">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                
                <div 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === "fonepay" ? "border-orange-500 bg-orange-50" : "border-orange-100 hover:border-orange-300"}`}
                  onClick={() => setSelectedPayment("fonepay")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === "fonepay" ? "border-orange-500 bg-orange-500" : "border-orange-300"}`}>
                      {selectedPayment === "fonepay" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <h3 className="font-medium text-orange-900">Fonepay</h3>
                      <p className="text-sm text-orange-700">Secure online payment</p>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-orange-200">
              <h2 className="text-xl font-semibold text-orange-900 mb-6 pb-3 border-b border-orange-200">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-orange-700">Subtotal</span>
                  <span className="text-orange-900 font-medium">Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Shipping</span>
                  <span className="text-orange-900 font-medium">Rs {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Tax (10%)</span>
                  <span className="text-orange-900 font-medium">Rs {tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-orange-200">
                <span className="text-orange-900">Total</span>
                <span className="text-orange-600">Rs {total.toFixed(2)}</span>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  onClick={checkout}
                  disabled={!selectedAddress}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedAddress ? "Proceed to Checkout" : "Select Address First"}
                </Button>
                
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 py-3 rounded-xl font-medium transition-all"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-12">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[100vh] overflow-y-auto">
            <div className="p-6 border-b border-orange-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-900">Add New Address</h2>
              <button onClick={() => setShowAddressForm(false)} className="text-orange-500 hover:text-orange-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-900 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-900 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-900 mb-1">Landmark (optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Eg: Beside Birendra Campus"
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Province / Region</label>
                  <select
                    value={formData.province.id}
                    onChange={(e) => handleSelectChange(e, 'province')}
                    required
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select province</option>
                    {provinceList.map((province: any) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">City</label>
                  <select
                    value={formData.city.id}
                    onChange={(e) => handleSelectChange(e, 'city')}
                    required
                    disabled={!formData.province.id}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select city</option>
                    {cityList.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Zone</label>
                  <select
                    value={formData.zone.id}
                    onChange={(e) => handleSelectChange(e, 'zone')}
                    required
                    disabled={!formData.city.id}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select zone</option>
                    {zoneList.map((zone: any) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Manocranti tol"
                    required
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-orange-300 rounded"
                />
                <label className="ml-2 text-sm text-orange-900">Set as default address</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 bg-orange-100 text-orange-700 hover:bg-orange-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}