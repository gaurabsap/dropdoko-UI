/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/tools/axiosClient";

type ProductType = {
  _id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  slug: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products/list");
      setProducts(data.products || data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await api.delete(`/products/delete/${selectedProduct._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      setModalOpen(false);
      setSelectedProduct(null);
    }
  };

  if (!isAuthenticated) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products in your account including their name, price, category and stock.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/add"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto"
          >
            Add product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No products found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        ID
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {product._id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Rs. {product.price}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex gap-3">
                          <Link
                            href={`/admin/products/edit/${product.slug}`}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => confirmDelete(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Product</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{selectedProduct.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
