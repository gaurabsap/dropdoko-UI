/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/tools/axiosClient";

export default function ShippingAddressPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const isCreate = slug === "create";

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [province, setProvince] = useState({ id: "", name: "" });
  const [city, setCity] = useState({ id: "", name: "" });
  const [zone, setZone] = useState({ id: "", name: "" });
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [saving, setSaving] = useState(false);

  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [zoneList, setZoneList] = useState<any[]>([]);

  // fetch provinces
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

  // fetch address if editing
  useEffect(() => {
    if (isCreate) return;
    if (provinceList.length === 0) return; // wait for provinces

    async function fetchAddress() {
      try {
        const res = await api.get(`/shipping-address/getbyid/${slug}`);
        const a = res.data?.data || res.data;

        setFullName(a.fullName || "");
        setPhoneNumber(a.phoneNumber || "");
        setLandmark(a.landmark || "");
        setAddress(a.addressLine || "");
        setIsDefault(a.isDefault || false);

        const pObj = provinceList.find((p) => p.name === a.province);
        if (pObj) setProvince({ id: pObj.id, name: pObj.name });
        else setProvince({ id: "", name: a.province || "" });

        setCity({ id: "", name: a.city || "" });
         const zObj = zoneList.find((z) => z.name === a.zone);
          if (zObj) setZone({ id: zObj.id, name: zObj.name });
          else setZone({ id: "", name: a.zone || "" });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load address");
      }
    }

    fetchAddress();
  }, [isCreate, slug, provinceList.length,]);

  
  // fetch cities when province changes
  useEffect(() => {
    if (!province.id) {
      setCityList([]);
      setCity({ id: "", name: "" });
      setZoneList([]);
      setZone({ id: "", name: "" });
      return;
    }
    async function fetchCities() {
      try {
        const res = await api.get(`/user/location?addressId=${province.id}`);
        setCityList(res.data || []);

        // if editing, try pre-select city
        if (!isCreate) {
          const cObj = res.data.find((c: any) => c.name === city.name);
          if (cObj) setCity({ id: cObj.id, name: cObj.name });
        } else {
          setCity({ id: "", name: "" });
        }

        setZoneList([]);
        setZone({ id: "", name: "" });
      } catch (err) {
        console.error(err);
      }
    }
    fetchCities();
  }, [province]);

  // fetch zones when city changes
  useEffect(() => {
    if (!city.id) {
      setZoneList([]);
      if (isCreate) {
        setZone({ id: "", name: "" });
      }
      return;
    }
    async function fetchZones() {
      try {
        const res = await api.get(`/user/location?addressId=${city.id}`);
        setZoneList(res.data || []);

        if (!isCreate) {
          const zObj = res.data.find((z: any) => z.name === zone.name);
          if (zObj) setZone({ id: zObj.id, name: zObj.name });
        } else {
          setZone({ id: "", name: "" });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchZones();
  }, [city]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreate) {
        await api.post("/shipping-address/create", {
          fullName,
          phoneNumber,
          landmark,
          province: province.name,
          city: city.name,
          zone: zone.name,
          address,
          isDefault,
        });
        toast.success("Shipping address saved");
      } else {
        await api.put(`/shipping-address/update/${slug}`, {
          fullName,
          phoneNumber,
          landmark,
          province: province.name,
          city: city.name,
          zone: zone.name,
          address,
          isDefault,
        });
        toast.success("Shipping address updated");
      }
      router.push("/customer/profile/shipping-address");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save shipping address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fffdfb] p-6">
      <div className="w-full max-w-3xl mx-auto bg-[#fcf8f4] border border-orange-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          {isCreate ? "Add New Shipping Address" : "Edit Shipping Address"}
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contact info.</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Landmark (optional)</label>
            <input
              type="text"
              placeholder="Eg: Beside Birendra Campus"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Province / City */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-1">Province / Region</label>
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
                {provinceList.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">City</label>
              <select
                value={city.id}
                onChange={(e) =>
                  setCity(
                    cityList.find((c: any) => c.id === e.target.value) || { id: "", name: "" }
                  )
                }
                disabled={!province.id}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select city</option>
                {cityList.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone / Address */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-1">Zone</label>
              <select
                value={zone.id}
                onChange={(e) =>
                  setZone(
                    zoneList.find((z: any) => z.id === e.target.value) || { id: "", name: "" }
                  )
                }
                disabled={!city.id}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select zone</option>
                {zoneList.map((z: any) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Address</label>
              <input
                type="text"
                placeholder="Manocranti tol"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Set as default address</span>
          </label>
                
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
