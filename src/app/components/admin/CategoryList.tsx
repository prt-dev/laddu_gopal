"use client";

import React, { useEffect, useState } from "react";
import CategoryTable from "@/app/components/admin/CategoryTable";
import {
  CategoryItem,
  getCategories,
  deleteCategoryApi,
  updateCategoryApi,
} from "@/app/services/categoryService";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/common/Loading";

export default function CategoryList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadCategories = async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategories({}, authToken);
      if (Array.isArray(data)) {
        setCategoriesList(data);
      } else if (data?.categories && Array.isArray(data.categories)) {
        setCategoriesList(data.categories);
      } else if (data?.items && Array.isArray(data.items)) {
        setCategoriesList(data.items);
      } else {
        setCategoriesList([]);
      }
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err?.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCategories(token);
    } else if (!isAuthLoading && !token) {
      setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  // Handle status toggle switch
  const handleToggleStatus = async (category: CategoryItem) => {
    if (!category.id || !token) return;
    const currentStatus =
      category.status === 1 ||
      category.status === "1" ||
      category.status === "active" ||
      category.status === "Active"
        ? 1
        : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      // Optimistic update
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c))
      );

      await updateCategoryApi(category.id, { status: newStatus }, token);
      setActionSuccess(`Category "${category.name}" status updated.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err?.message || "Failed to update category status.");
      // Rollback
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, status: currentStatus } : c))
      );
    }
  };

  // Trigger delete confirmation
  const handleDeletePrompt = (category: CategoryItem) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete?.id || !token) return;

    try {
      setIsDeleting(true);
      setError(null);
      await deleteCategoryApi(categoryToDelete.id, token);
      setCategoriesList((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setActionSuccess(`Category "${categoryToDelete.name}" deleted successfully.`);
      setTimeout(() => setActionSuccess(null), 3000);
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError(err?.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading variant="container" size="md" message="Loading categories..." />;
  }

  return (
    <>
      {/* Action Notification */}
      {actionSuccess && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-300 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-green-500 font-bold ml-2 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300 flex items-center justify-between">
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

      <CategoryTable
        data={categoriesList}
        onDelete={handleDeletePrompt}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Confirm Delete Category
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete category{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                &ldquo;{categoryToDelete.name}&rdquo;
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
              >
                {isDeleting && (
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
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
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
