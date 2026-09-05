"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  createProductApi,
  updateProductApi,
  getProductById,
  ProductItem,
} from "@/app/services/productService";
import { getCategories, CategoryItem } from "@/app/services/categoryService";
import { BASE_URL } from "@/app/services/authService";
import { getFullImageUrl, uploadRemoteFile } from "@/app/utils/utils";
import Loading from "@/app/components/common/Loading";

interface ProductFormProps {
  productId?: number | string;
  mode?: "add" | "edit";
}

const DEFAULT_VARIANT_OPTIONS: string[] = [
  "Size 0",
  "Size 1",
  "Size 2",
  "Size 3",
  "Size 4",
  "Size 5",
  "Size 6",
  "Size 7",
  "Size 8",
  "Size 9",
  "Size 10",
  "Size 11",
  "Size 12",
  "Yellow",
  "Red",
  "Pink",
  "Green",
  "Sky Blue",
  "Orange",
  "White",
  "Maroon",
  "Golden Zari",
  "Peacock Multi-Color",
];

export default function ProductForm({ productId, mode }: ProductFormProps) {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit" || Boolean(productId);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "0",
    category_id: "",
    image_url: "",
    status: 1,
    description: "",
  });

  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>(DEFAULT_VARIANT_OPTIONS);
  const [customVariantInput, setCustomVariantInput] = useState<string>("");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const [isFetching, setIsFetching] = useState<boolean>(isEdit);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCats = async () => {
      if (!token) return;
      try {
        const data = await getCategories({ limit: 100 }, token);
        const list = Array.isArray(data) ? data : data?.categories || data?.items || [];
        setCategories(list);
      } catch (e) {
        console.warn("Failed to load categories for product form", e);
      }
    };
    if (token) {
      fetchCats();
    }
  }, [token]);

  // Fetch existing product data in edit mode
  useEffect(() => {
    if (!isEdit || !productId || !token) return;

    const fetchProduct = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await getProductById(Number(productId), token);
        if (data) {
          setFormData({
            name: data.name || "",
            sku: data.sku || "",
            price: data.price !== undefined ? String(data.price) : "",
            stock_quantity:
              data.stock_quantity !== undefined ? String(data.stock_quantity) : "0",
            category_id:
              data.category_id !== undefined && data.category_id !== null
                ? String(data.category_id)
                : "",
            image_url: data.image_url || "",
            status:
              data.status === 1 ||
                data.status === "1" ||
                data.status === "active" ||
                data.status === "Active"
                ? 1
                : 0,
            description: data.description || "",
          });

          const rawVariant = typeof data.variant === "string" ? data.variant.trim() : "";

          let parsedVariants: string[] = [];
          if (rawVariant) {
            if (rawVariant.startsWith("[") && rawVariant.endsWith("]")) {
              try {
                parsedVariants = JSON.parse(rawVariant);
              } catch {
                parsedVariants = rawVariant.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean);
              }
            } else {
              parsedVariants = rawVariant.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean);
            }
          }

          setSelectedVariants(parsedVariants);
          if (parsedVariants.length > 0) {
            setAvailableVariants((prev) => Array.from(new Set([...prev, ...parsedVariants])));
          }

          if (data.image_url) {
            setPreviewUrl(getFullImageUrl(data.image_url));
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err?.message || "Failed to load product details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [isEdit, productId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image_url") {
      setPreviewUrl(getFullImageUrl(value));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 1 ? 0 : 1,
    }));
  };

  const toggleVariant = (variant: string) => {
    setSelectedVariants((prev) =>
      prev.includes(variant) ? prev.filter((v) => v !== variant) : [...prev, variant]
    );
  };

  const handleRemoveVariant = (variantToRemove: string) => {
    setSelectedVariants((prev) => prev.filter((v) => v !== variantToRemove));
  };
  const handleSelectPreset = (preset: "common_sizes" | "all_sizes" | "clear") => {
    if (preset === "common_sizes") {
      const common = ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"];
      setSelectedVariants((prev) => Array.from(new Set([...prev, ...common])));
    } else if (preset === "all_sizes") {
      const allSizes = [
        "Size 0",
        "Size 1",
        "Size 2",
        "Size 3",
        "Size 4",
        "Size 5",
        "Size 6",
        "Size 7",
        "Size 8",
        "Size 9",
        "Size 10",
        "Size 11",
        "Size 12",
      ];
      setSelectedVariants((prev) => Array.from(new Set([...prev, ...allSizes])));
    } else if (preset === "clear") {
      setSelectedVariants([]);
    }
  };

  const handleAddCustomVariant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customVariantInput.trim();
    if (!trimmed) return;
    const newItems = trimmed
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (newItems.length > 0) {
      setAvailableVariants((prev) => Array.from(new Set([...prev, ...newItems])));
      setSelectedVariants((prev) => Array.from(new Set([...prev, ...newItems])));
      setCustomVariantInput("");
    }
  };

  // Handle local file selection for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WEBP, GIF, SVG).");
      return;
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid price (greater than or equal to 0).");
      return;
    }

    const stockNum = parseInt(formData.stock_quantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let finalImageUrl = formData.image_url.trim();

      if (selectedFile) {
        setUploadProgress("Uploading product image...");
        finalImageUrl = await uploadRemoteFile(selectedFile, token, "products");
      }

      setUploadProgress(isEdit ? "Updating product..." : "Creating product...");

      const variantString = selectedVariants.join(", ");

      const payload: Partial<ProductItem> = {
        name: formData.name.trim(),
        sku: formData.sku.trim() || undefined,
        price: priceNum,
        stock_quantity: stockNum,
        category_id: formData.category_id
          ? parseInt(formData.category_id, 10)
          : undefined,
        image_url: finalImageUrl || undefined,
        status: formData.status,
        description: formData.description.trim() || undefined,
        variant: variantString,
      };

      if (isEdit && productId) {
        await updateProductApi(Number(productId), payload, token);
      } else {
        await createProductApi(payload, token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err: any) {
      console.error(isEdit ? "Failed to update product:" : "Failed to create product:", err);
      setError(
        err?.message ||
        (isEdit ? "Failed to update product." : "Failed to create product.")
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  if (isFetching) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 flex items-center justify-center p-12">
        <Loading variant="container" size="md" message="Loading product data..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between my-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link
              href="/admin/products"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200">
              {isEdit ? "Edit Product" : "Add New"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          ← Back to Products
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 font-bold ml-2 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-300 flex items-center">
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {isEdit
              ? "Product updated successfully! Redirecting to products list..."
              : "Product created successfully! Redirecting to products list..."}
          </span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Product Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Ergonomic Garden Shovel"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                SKU / Product Code
              </span>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. GRD-SHV-001"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Price ($ USD) <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                min="0"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                placeholder="0"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Category
              </span>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select py-2.5 px-3 border border-gray-300 rounded-md"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.slug ? `(${cat.slug})` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Status (Slider Toggle Switch) */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Status
              </span>
              <div className="flex items-center space-x-3 mt-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.status === 1}
                  onClick={handleStatusToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.status === 1
                    ? "bg-purple-600 dark:bg-purple-500"
                    : "bg-gray-200 dark:bg-gray-700"
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.status === 1 ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.status === 1
                    ? "Active (Visible in store)"
                    : "Inactive (Draft)"}
                </span>
              </div>
            </label>
          </div>

          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/40 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  Product Variants / Sizes
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    {selectedVariants.length} selected
                  </span>
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Select Deity sizes and variants available for this item
                </p>
              </div>

              {/* Quick Presets Toolbar */}
              <div className="flex items-center flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectPreset("common_sizes")}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-xs"
                >
                  + Common Sizes (0–6)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset("all_sizes")}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-xs"
                >
                  + All Sizes (0–12)
                </button>
                {selectedVariants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("clear")}
                    className="px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Selected Variant Tags Display */}
            <div>
              <span className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Currently Selected:
              </span>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 min-h-[46px] flex flex-wrap items-center gap-1.5">
                {selectedVariants.length === 0 ? (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    No variants selected yet. Click any of the Quick Toggle options below or use the quick buttons.
                  </span>
                ) : (
                  selectedVariants.map((variant) => (
                    <span
                      key={variant}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-700/50 shadow-xs"
                    >
                      {variant}
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant)}
                        className="ml-1.5 text-purple-600 hover:text-purple-900 dark:text-purple-300 dark:hover:text-white font-bold focus:outline-none"
                        title={`Remove ${variant}`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Quick Toggle Options for Multiple Selection */}
            <div>
              <span className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Toggle Options (click to select or deselect multiple):
              </span>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
                {availableVariants.map((variant) => {
                  const isSelected = selectedVariants.includes(variant);
                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => toggleVariant(variant)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-all cursor-pointer ${isSelected
                        ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-500 shadow-xs"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
                        }`}
                    >
                      {isSelected ? `✓ ${variant}` : `+ ${variant}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Variant Adder */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Add Custom Variant:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customVariantInput}
                  onChange={(e) => setCustomVariantInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomVariant();
                    }
                  }}
                  placeholder="e.g. Size 00, Heavy Embroidery, Yellow & Green Silk (comma-separated)..."
                  className="flex-1 text-xs dark:border-gray-600 dark:bg-gray-800 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:text-gray-300 py-2 px-3 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomVariant()}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors whitespace-nowrap shadow-xs"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>

          {/* Product Image Upload & Preview */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                Product Image
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`px-3 py-1 rounded-md transition-colors ${uploadMode === "file"
                    ? "bg-purple-600 text-white font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-3 py-1 rounded-md transition-colors ${uploadMode === "url"
                    ? "bg-purple-600 text-white font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              <div>
                {/* Drag and Drop / Click Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 bg-gray-50 dark:bg-gray-700/40 transition-colors"
                >
                  <svg
                    className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-purple-600 dark:text-purple-400 underline">
                      Click to choose an image
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP, GIF, SVG (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/images/product.jpg or /uploads/products/..."
                  className="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {/* Live Image Preview Card */}
            {previewUrl && (
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedFile ? selectedFile.name : "Current Image"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                        : formData.image_url || "Loaded from server"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Description
              </span>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description of the product..."
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="flex items-center px-5 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting
              ? uploadProgress || (isEdit ? "Updating Product..." : "Saving Product...")
              : isEdit
                ? "Update Product"
                : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
