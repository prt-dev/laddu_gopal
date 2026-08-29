"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  createCategoryApi,
  updateCategoryApi,
  getCategoryById,
  getCategories,
  CategoryItem,
} from "@/app/services/categoryService";
import { getFullImageUrl, uploadRemoteFile } from "@/app/utils/utils";

interface CategoryFormProps {
  categoryId?: number | string;
  mode?: "add" | "edit";
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryForm({ categoryId, mode }: CategoryFormProps) {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit" || Boolean(categoryId);

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    image_url: string;
    parent_id: string;
    status: number;
  }>({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    parent_id: "",
    status: 1,
  });

  const [parentCategories, setParentCategories] = useState<CategoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const [isFetching, setIsFetching] = useState<boolean>(isEdit);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Load existing categories for parent dropdown
  useEffect(() => {
    const fetchParents = async () => {
      if (!token) return;
      try {
        const data = await getCategories({ limit: 100 }, token);
        const list: CategoryItem[] = Array.isArray(data)
          ? data
          : data?.categories || data?.items || [];
        setParentCategories(list);
      } catch (e) {
        console.warn("Failed to load parent categories list", e);
      }
    };
    if (token) {
      fetchParents();
    }
  }, [token]);

  // Fetch existing category in edit mode
  useEffect(() => {
    if (!isEdit || !categoryId || !token) return;

    const fetchCategory = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await getCategoryById(Number(categoryId), token);
        if (data) {
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            image_url: data.image_url || "",
            parent_id:
              data.parent_id !== undefined && data.parent_id !== null
                ? String(data.parent_id)
                : "",
            status:
              data.status === 1 ||
              data.status === "1" ||
              data.status === "active" ||
              data.status === "Active"
                ? 1
                : 0,
          });

          if (data.image_url) {
            setPreviewUrl(getFullImageUrl(data.image_url));
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch category:", err);
        setError(err?.message || "Failed to load category details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [isEdit, categoryId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-generate slug on name change if not manually changed or in add mode
      if (name === "name" && (!prev.slug || prev.slug === generateSlug(prev.name))) {
        next.slug = generateSlug(value);
      }
      return next;
    });

    if (name === "image_url") {
      setPreviewUrl(getFullImageUrl(value));
    }
  };

  const handleSlugRegenerate = () => {
    if (formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 1 ? 0 : 1,
    }));
  };

  // Handle local file selection for category image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WEBP, GIF, SVG).");
      return;
    }

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
      setError("Category name is required.");
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

      // Step 1: Upload to remote PHP storage via FastAPI /remote-upload/file
      if (selectedFile) {
        setUploadProgress("Uploading category image to remote storage...");
        finalImageUrl = await uploadRemoteFile(selectedFile, token, "categories");
      }

      setUploadProgress(isEdit ? "Updating category..." : "Creating category...");

      // Step 2: Build Category payload matching required keys:
      // id, name, slug, description, image_url, parent_id, status
      const payload: Partial<CategoryItem> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        description: formData.description.trim() || undefined,
        image_url: finalImageUrl || undefined,
        parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        status: formData.status,
      };

      if (isEdit && categoryId) {
        await updateCategoryApi(Number(categoryId), payload, token);
      } else {
        await createCategoryApi(payload, token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/categories");
      }, 1200);
    } catch (err: any) {
      console.error(isEdit ? "Failed to update category:" : "Failed to create category:", err);
      setError(
        err?.message ||
          (isEdit ? "Failed to update category." : "Failed to create category.")
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  if (isFetching) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 flex items-center justify-center p-12 text-gray-500 dark:text-gray-400">
        <svg
          className="w-8 h-8 mr-3 animate-spin text-purple-600"
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
        <span className="text-base font-medium">Loading category details...</span>
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
              href="/admin/categories"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200">
              {isEdit ? "Edit Category" : "Add New"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
        </div>
        <Link
          href="/admin/categories"
          className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          ← Back to Categories
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
              ? "Category updated successfully! Redirecting to categories list..."
              : "Category created successfully! Redirecting to categories list..."}
          </span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Category Name */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Category Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Poshak, Pagdi, Kundan Shringar"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Category Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Slug (URL identifier)
                </span>
                <button
                  type="button"
                  onClick={handleSlugRegenerate}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Generate from Name
                </button>
              </div>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md py-2.5">
                  /category/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. poshak"
                  className="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-r-md"
                />
              </div>
            </label>
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Parent Category (Optional)
              </span>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select py-2.5 px-3 border border-gray-300 rounded-md"
              >
                <option value="">None (Top-level / Root Category)</option>
                {parentCategories
                  .filter((p) => !categoryId || p.id !== Number(categoryId))
                  .map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} {parent.slug ? `(${parent.slug})` : ""}
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
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.status === 1
                      ? "bg-purple-600 dark:bg-purple-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.status === 1 ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.status === 1
                    ? "Active (Visible in catalog)"
                    : "Inactive (Hidden)"}
                </span>
              </div>
            </label>
          </div>

          {/* Remote Category Image Upload & Preview */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                Category Image (Remote Storage)
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    uploadMode === "file"
                      ? "bg-purple-600 text-white font-medium"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    uploadMode === "url"
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
                      Click to upload category banner/icon
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP, GIF, SVG (Max 10MB) • Uploads to remote storage (/remote-upload/image)
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
                  placeholder="https://example.com/category.png or /uploads/categories/..."
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
                      alt="Category preview"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-sm">
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
                placeholder="Enter detailed description of this category..."
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/admin/categories"
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
              ? uploadProgress || (isEdit ? "Updating Category..." : "Saving Category...")
              : isEdit
              ? "Update Category"
              : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
