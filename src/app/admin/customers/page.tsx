"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock customer data
const customers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john.doe@example.com", 
    phone: "+1 (555) 123-4567", 
    orders: 5, 
    joined: "2023-01-15",
    status: "Active" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    phone: "+1 (555) 987-6543", 
    orders: 12, 
    joined: "2022-11-08",
    status: "Active" 
  },
  { 
    id: 3, 
    name: "Robert Johnson", 
    email: "robert.j@example.com", 
    phone: "+1 (555) 456-7890", 
    orders: 3, 
    joined: "2023-03-22",
    status: "Active" 
  },
  { 
    id: 4, 
    name: "Emily Davis", 
    email: "emily.davis@example.com", 
    phone: "+1 (555) 234-5678", 
    orders: 8, 
    joined: "2022-09-14",
    status: "Inactive" 
  },
  { 
    id: 5, 
    name: "Michael Wilson", 
    email: "michael.w@example.com", 
    phone: "+1 (555) 876-5432", 
    orders: 2, 
    joined: "2023-04-05",
    status: "Active" 
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
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
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all customers in your store including their name, email, and order history.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search customers by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Orders
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Joined
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
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {customer.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">{customer.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.orders}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.joined}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="text-orange-600 hover:text-orange-900 mr-4"
                        >
                          View
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
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