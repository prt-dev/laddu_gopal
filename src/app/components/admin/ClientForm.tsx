"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  createClientApi,
  updateClientApi,
  getClientById,
  ClientItem,
} from "@/app/services/clientService";
import { BASE_URL } from "@/app/services/authService";
import { getFullImageUrl } from "@/app/utils/utils";

interface ClientFormProps {
  clientId?: number | string;
  mode?: "add" | "edit";
}

export default function ClientForm({ clientId, mode }: ClientFormProps) {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit" || Boolean(clientId);

  const [formData, setFormData] = useState({
    name: "",
    website_name: "",
    website_url: "",
    domain: "",
    logo: "",
    default_meta_title: "",
    default_meta_description: "",
    status: 1,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const [isFetching, setIsFetching] = useState<boolean>(isEdit);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch existing client data in edit mode
  useEffect(() => {
    if (!isEdit || !clientId || !token) return;

    const fetchClient = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await getClientById(Number(clientId), token);
        if (data) {
          setFormData({
            name: data.name || "",
            website_name: data.website_name || "",
            website_url: data.website_url || "",
            domain: data.domain || "",
            logo: data.logo || "",
            default_meta_title: data.default_meta_title || "",
            default_meta_description: data.default_meta_description || "",
            status:
              data.status === 1 ||
              data.status === "1" ||
              data.status === "active" ||
              data.status === "Active"
                ? 1
                : 0,
          });

          if (data.logo) {
            setPreviewUrl(getFullImageUrl(data.logo));
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch client:", err);
        setError(err?.message || "Failed to load client details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchClient();
  }, [isEdit, clientId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "logo") {
      setPreviewUrl(getFullImageUrl(value));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 1 ? 0 : 1,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
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
    setFormData((prev) => ({ ...prev, logo: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToServer = async (file: File, authToken: string): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const uploadUrl = `${BASE_URL}/upload/image?folder=clients`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || "Failed to upload logo.");
    }

    const result = await response.json();
    return result.image_url || result.file_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Client name is required.");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let finalLogoUrl = formData.logo.trim();

      if (selectedFile) {
        setUploadProgress("Uploading client logo...");
        finalLogoUrl = await uploadImageToServer(selectedFile, token);
      }

      setUploadProgress(isEdit ? "Updating client..." : "Creating client...");

      const payload: Partial<ClientItem> = {
        name: formData.name.trim(),
        website_name: formData.website_name.trim() || undefined,
        website_url: formData.website_url.trim() || undefined,
        domain: formData.domain.trim() || undefined,
        logo: finalLogoUrl || undefined,
        default_meta_title: formData.default_meta_title.trim() || undefined,
        default_meta_description: formData.default_meta_description.trim() || undefined,
        status: formData.status,
      };

      if (isEdit && clientId) {
        await updateClientApi(Number(clientId), payload, token);
      } else {
        await createClientApi(payload, token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/clients");
      }, 1200);
    } catch (err: any) {
      console.error(isEdit ? "Failed to update client:" : "Failed to create client:", err);
      setError(
        err?.message ||
        (isEdit ? "Failed to update client." : "Failed to create client.")
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
        <span className="text-base font-medium">Loading client details...</span>
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
              href="/admin/clients"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Clients
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200">
              {isEdit ? "Edit Client" : "Add New"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {isEdit ? "Edit Client" : "Add New Client"}
          </h2>
        </div>
        <Link
          href="/admin/clients"
          className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          ← Back to Clients
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
              ? "Client updated successfully! Redirecting to clients list..."
              : "Client created successfully! Redirecting to clients list..."}
          </span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Client Name */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Client / Brand Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. TechSphere Insights"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Domain
              </span>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g. techsphere.io"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Website Name */}
          <div>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Website Name
              </span>
              <input
                type="text"
                name="website_name"
                value={formData.website_name}
                onChange={handleChange}
                placeholder="e.g. TechSphere Official Blog"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Website URL */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Website URL
              </span>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://www.techsphere.io"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
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
                  {formData.status === 1 ? "Active" : "Inactive"}
                </span>
              </div>
            </label>
          </div>

          {/* Client Logo Upload & Preview */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                Client Logo
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
                      Click to choose a logo
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, SVG, WEBP (Max 10MB)
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
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png or /uploads/clients/..."
                  className="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {/* Live Logo Preview Card */}
            {previewUrl && (
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedFile ? selectedFile.name : "Current Logo"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                        : formData.logo || "Loaded from server"}
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

          {/* Default Meta Title */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Default Meta Title
              </span>
              <input
                type="text"
                name="default_meta_title"
                value={formData.default_meta_title}
                onChange={handleChange}
                placeholder="e.g. TechSphere Insights - Modern Web & AI Architecture"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          {/* Default Meta Description */}
          <div className="md:col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Default Meta Description
              </span>
              <textarea
                name="default_meta_description"
                rows={3}
                value={formData.default_meta_description}
                onChange={handleChange}
                placeholder="Enter default meta description for client blog pages and SEO snippets..."
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/admin/clients"
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
              ? uploadProgress || (isEdit ? "Updating Client..." : "Saving Client...")
              : isEdit
                ? "Update Client"
                : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
