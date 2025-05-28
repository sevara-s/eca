"use client";
import { request } from "@/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Define types for our data structures
type Address = {
  id?: number;
  region: string;
  city: string;
  street: string;
  district?: string;
  home?: string;
  bookingProductId?: number;
};

type ProductFile = {
  id: number;
  originalName: string;
  contentUrl: string;
};

type Order = {
  id: number;
  productName: string;
  productSeriaNumber: string;
  employeeId: number;
  address: Address;
  productFileList: ProductFile[];
};

type OrderFormData = {
  productName: string;
  productSeriaNumber: string;
  region: string;
  city: string;
  district?: string;
  street: string;
  home?: string;
};

type DecodedToken = {
  sub?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default function UserOrderList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEmployeeIdFromToken = (): number | null => {
    const token = Cookies.get("token");
    if (!token) return null;

    try {
      const decoded = jwt.decode(token) as DecodedToken;
      const sub = decoded?.sub;

      if (!sub) return null;

      const parsedSub = JSON.parse(sub);
      return parsedSub?.employeeId ?? null;
    } catch (error) {
      console.error("Error decoding or parsing token:", error);
      return null;
    }
  };

  const employeeId = getEmployeeIdFromToken();

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<Order[], Error>({
    queryKey: ["user-orders", employeeId],
    queryFn: async () => {
      if (!employeeId) {
        throw new Error("Employee ID not available");
      }
      
      const res = await request.get("/booking-product/get-all-by-employee", {
        params: {
          employeeId: employeeId
        }
      });
      return res.data.content ?? [];
    },
    enabled: !!employeeId  
  });

  const { mutate: createOrder, isLoading: isCreating } = useMutation({
    mutationFn: async (orderData: {
      productName: string;
      productSeriaNumber: string;
      employeeId: number;
      address: Omit<Address, 'id' | 'bookingProductId'>;
    }) => {
      const response = await request.post("/booking-product", {
        id: 0, // Server will generate
        ...orderData,
        address: {
          id: 0, // Server will generate
          ...orderData.address,
          bookingProductId: 0 // Will be set by server
        },
        productFileList: []
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      return response.data.content;
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      console.error("Order creation failed:", error);
    }
  });

  if (isLoading) return <OrderListSkeleton />;
  if (isError) return <ErrorDisplay error={error} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Yangi buyurtmalar
        </button>
      </div>
      
      {(!data || data.length === 0) ? (
        <EmptyState onAddNew={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((order) => (
            <OrderCard key={order.id} order={order} onRefetch={refetch} />
          ))}
        </div>
      )}

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeId={employeeId}
        onSubmit={createOrder}
        isSubmitting={isCreating}
      />
    </div>
  );
}

function OrderCard({ order, onRefetch }: { order: Order; onRefetch: () => void }) {
  const mainImage = order.productFileList?.[0]?.contentUrl;
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await request.delete(`/booking-product/${order.id}`);
      onRefetch();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Actions dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        {isEditing && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <button
              onClick={() => {
                setIsEditing(false);
                console.log("Edit order", order.id);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="h-48 bg-gray-100 relative">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={order.productName}
            fill
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {order.productName}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            #{order.productSeriaNumber}
          </span>
        </div>

        {/* Address */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h3>
          <p className="text-gray-600 text-sm">
            {order.address ? (
              `${order.address.street}, ${order.address.city}, ${order.address.region}`
            ) : (
              <span className="text-gray-400">No address provided</span>
            )}
          </p>
        </div>

        {/* Files */}
        {order.productFileList?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Attachments</h3>
            <div className="flex flex-wrap gap-2">
              {order.productFileList.map((file) => (
                <a 
                  key={file.id} 
                  href={file.contentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {file.originalName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NewOrderModal({ 
  isOpen, 
  onClose, 
  employeeId,
  onSubmit,
  isSubmitting
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  employeeId: number | null;
  onSubmit: (data: {
    productName: string;
    productSeriaNumber: string;
    employeeId: number;
    address: Omit<Address, 'id' | 'bookingProductId'>;
  }) => void;
  isSubmitting: boolean;
}) {
  const productOptions = [
    "WT-150",
    "WT-125", 
    "WT-110",
    "WT-100",
    "WT-SS 65",
    "WT-SS 55",
    "WT-SS 45"
  ];

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<OrderFormData>();

  const submitHandler = (data: OrderFormData) => {
    if (!employeeId) return;
    
    onSubmit({
      productName: data.productName,
      productSeriaNumber: data.productSeriaNumber,
      employeeId,
      address: {
        region: data.region,
        city: data.city,
        district: data.district,
        street: data.street,
        home: data.home
      }
    });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="space-y-4">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <select
                    {...register("productName", { required: "Product name is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a product</option>
                    {productOptions.map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number *
                  </label>
                  <input
                    {...register("productSeriaNumber", { required: "Serial number is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter serial number"
                  />
                  {errors.productSeriaNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.productSeriaNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region *
                    </label>
                    <input
                      {...register("region", { required: "Region is required" })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter region"
                    />
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register("city", { required: "City is required" })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      {...register("district")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter district"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street *
                    </label>
                    <input
                      {...register("street", { required: "Street is required" })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter street"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Home
                    </label>
                    <input
                      {...register("home")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter home number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="p-6">
              <div className="flex justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-2/3 animate-pulse"></div>
              </div>
              
              <div className="space-y-2 mt-6">
                <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                <div className="flex gap-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error loading orders</h3>
            <div className="mt-2 text-sm text-red-700">
              {error?.message || "An unknown error occurred while fetching your orders."}
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven&apos;t placed any orders yet. When you do, they&apos;ll appear here.
        </p>
        <div className="mt-6">
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}