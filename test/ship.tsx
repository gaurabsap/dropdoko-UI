"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";

export default function ShippingAddressPage() {
  const router = useRouter();
  const pathname = usePathname();
  const addressId = pathname.split("/").pop(); // get id if editing

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [province, setProvince] = useState({ id: "", name: "" });
  const [city, setCity] = useState({ id: "", name: "" });
  const [zone, setZone] = useState({ id: "", name: "" });
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [zoneList, setZoneList] = useState<any[]>([]);

  // Fetch provinces
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await api.get("/user/location");
        setProvinceList(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProvinces();
  }, []);

  // Fetch address if editing
  useEffect(() => {
    if (!addressId) return;
    async function fetchAddress() {
      try {
        const res = await api.get(`/shipping-address/get/${addressId}`);
        const data = res.data;
        setFullName(data.fullName);
        setPhoneNumber(data.phoneNumber);
        setLandmark(data.landmark || "");
        setProvince({ id: data.provinceId || "", name: data.province });
        setCity({ id: data.cityId || "", name: data.city });
        setZone({ id: data.zoneId || "", name: data.zone });
        setAddress(data.address);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load address data");
      }
    }
    fetchAddress();
  }, [addressId]);

  // Fetch cities and zones on province/city change
  useEffect(() => {
    if (!province.id) return setCityList([]);
    async function fetchCities() {
      const res = await api.get(`/user/location?addressId=${province.id}`);
      setCityList(res.data || []);
    }
    fetchCities();
  }, [province]);

  useEffect(() => {
    if (!city.id) return setZoneList([]);
    async function fetchZones() {
      const res = await api.get(`/user/location?addressId=${city.id}`);
      setZoneList(res.data || []);
    }
    fetchZones();
  }, [city]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (addressId) {
        await api.put(`/shipping-address/update/${addressId}`, {
          fullName,
          phoneNumber,
          landmark,
          province: province.name,
          city: city.name,
          zone: zone.name,
          address,
        });
        toast.success("Address updated!");
      } else {
        await api.post("/shipping-address/create", {
          fullName,
          phoneNumber,
          landmark,
          province: province.name,
          city: city.name,
          zone: zone.name,
          address,
        });
        toast.success("Address added!");
        // optional: clear form
        setFullName("");
        setPhoneNumber("");
        setLandmark("");
        setProvince({ id: "", name: "" });
        setCity({ id: "", name: "" });
        setZone({ id: "", name: "" });
        setAddress("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fffdfb] p-6 justify-center items-start">
      <div className="w-full max-w-3xl bg-[#fcf8f4] border border-orange-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          {addressId ? "Edit Shipping Address" : "Add New Shipping Address"}
        </h1>

        {/* Form fields */}
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Landmark (optional)"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <div className="grid md:grid-cols-2 gap-5">
            <select
              value={province.id}
              onChange={(e) =>
                setProvince(
                  provinceList.find((p: any) => p.id === e.target.value) || { id: "", name: "" }
                )
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select province</option>
              {provinceList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={city.id}
              onChange={(e) =>
                setCity(cityList.find((c) => c.id === e.target.value) || { id: "", name: "" })
              }
              disabled={!province.id}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select city</option>
              {cityList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <select
              value={zone.id}
              onChange={(e) =>
                setZone(zoneList.find((z) => z.id === e.target.value) || { id: "", name: "" })
              }
              disabled={!city.id}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select zone</option>
              {zoneList.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
