import React from "react";
import Link from "next/link";
import { BlogItem } from "@/app/services/blogService";
import { ClientItem } from "@/app/services/clientService";
import { getFullImageUrl } from "@/app/utils/utils";

interface BlogTableProps {
  data: BlogItem[];
  clients?: ClientItem[];
  onEdit?: (blog: BlogItem) => void;
  onDelete?: (blog: BlogItem) => void;
}

export default function BlogTable({ data, clients = [], onEdit, onDelete }: BlogTableProps) {
  const getClientName = (clientId?: number) => {
    if (!clientId) return "Unassigned";
    const found = clients.find((c) => c.id === clientId);
    return found ? found.name : `Client #${clientId}`;
  };

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th className="px-4 py-3">S. No.</th>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Published Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No blog articles found.
                </td>
              </tr>
            ) : (
              data.map((blog, idx) => {
                const isActive =
                  blog.status === 1 ||
                  blog.status === "1" ||
                  blog.status === "active" ||
                  blog.status === "Active" ||
                  blog.status === "Approved";

                return (
                  <tr key={blog.id || idx} className="text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3 text-sm">{data.length - idx}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-10 h-10 mr-3 rounded-md md:block overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          {blog.featured_image ? (
                            <img
                              className="object-cover w-full h-full"
                              src={getFullImageUrl(blog.featured_image)}
                              alt={blog.title || "Blog"}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 max-w-xs">{blog.title || "Untitled Blog"}</p>
                          {blog.excerpt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{blog.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        {getClientName(blog.client_id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-xs truncate">
                      /{blog.slug}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {/* Slider Toggle Switch for Status */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        title={isActive ? "Active / Published" : "Inactive / Draft"}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive
                          ? "bg-purple-600 dark:bg-purple-500"
                          : "bg-gray-200 dark:bg-gray-700"
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-3">
                        {/* Preview Action Button */}
                        <Link
                          href={`/admin/blog/preview/${blog.id}`}
                          className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-blue-400 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Preview"
                          title="Preview Blog Article"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        {/* Edit Action Button */}
                        <Link
                          href={`/admin/blog/edit/${blog.id}`}
                          className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Edit"
                          title="Edit Blog"
                        >
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </Link>
                        {/* Delete Action Button */}
                        <button
                          onClick={() => onDelete && onDelete(blog)}
                          className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Delete"
                          title="Delete Blog"
                        >
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
        <span className="flex items-center col-span-3">Showing {data.length} items</span>
        <span className="col-span-2"></span>
        <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
          <nav aria-label="Table navigation">
            <ul className="inline-flex items-center">
              <li>
                <button className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                  <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                </button>
              </li>
              <li><button className="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple">1</button></li>
              <li>
                <button className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
                  <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </span>
      </div>
    </div>
  );
}
