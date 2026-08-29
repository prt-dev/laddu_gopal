import { BASE_URL } from "@/app/services/authService";

export interface RemoteUploadedFile {
  image_url: string;
  file_url: string;
  relative_url: string;
  saved_name: string;
  original_name: string;
  size: number;
  extension: string;
  directory?: string;
  status?: string;
  message?: string;
}

export interface RemoteUploadResponse {
  status: string;
  directory: string;
  image_url?: string;
  file_url?: string;
  relative_url?: string;
  saved_name?: string;
  original_name?: string;
  size?: number;
  extension?: string;
  message?: string;
  uploaded_files?: RemoteUploadedFile[];
  failed_files?: Array<{ name: string; error?: string }>;
  count?: number;
}

export interface RemoteUploadOptions {
  directory?: string;
  token?: string;
}

/**
 * Universal Remote File Upload Utility Function
 * Handles uploading single or multiple files/images using:
 *  - Single file:   POST ${BASE_URL}/remote-upload/file
 *  - Multiple files: POST ${BASE_URL}/remote-upload/files
 *
 * @param files Single File or array/FileList of File objects
 * @param optionsOrToken Bearer authentication token or options object { token, directory }
 * @param directory Subdirectory name (e.g. 'categories', 'products', 'blogs', 'clients')
 * @returns RemoteUploadResponse containing uploaded file urls, paths, and metadata
 */
export async function uploadRemoteFiles(
  files: File | File[] | FileList,
  optionsOrToken?: string | RemoteUploadOptions,
  directory: string = "general"
): Promise<RemoteUploadResponse> {
  let token: string | undefined;
  let targetDir = directory;

  if (typeof optionsOrToken === "string") {
    token = optionsOrToken;
  } else if (optionsOrToken && typeof optionsOrToken === "object") {
    token = optionsOrToken.token;
    if (optionsOrToken.directory) {
      targetDir = optionsOrToken.directory;
    }
  }

  const isMultiple =
    Array.isArray(files) ||
    (typeof FileList !== "undefined" && files instanceof FileList);
  const fileArray = isMultiple
    ? Array.from(files as File[] | FileList)
    : [files as File];

  if (fileArray.length === 0) {
    throw new Error("No files provided for upload.");
  }

  const formData = new FormData();
  formData.append("directory", targetDir);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Single file: uses /remote-upload/file with 'file' field
  if (fileArray.length === 1 && !isMultiple) {
    formData.append("file", fileArray[0]);
    const url = `${BASE_URL}/remote-upload/file?directory=${encodeURIComponent(targetDir)}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Remote file upload failed with status ${response.status}`
      );
    }

    const data: RemoteUploadResponse = await response.json();
    return data;
  } else {
    // Multiple files: uses /remote-upload/files with 'files' field
    for (const f of fileArray) {
      formData.append("files", f);
    }
    const url = `${BASE_URL}/remote-upload/files?directory=${encodeURIComponent(targetDir)}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Remote multiple files upload failed with status ${response.status}`
      );
    }

    const data: RemoteUploadResponse = await response.json();
    return data;
  }
}

/**
 * Convenience helper to upload a single file/image and return its URL string
 */
export async function uploadRemoteFile(
  file: File,
  token?: string,
  directory: string = "general"
): Promise<string> {
  const result = await uploadRemoteFiles(file, token, directory);
  return result.image_url || result.file_url || result.relative_url || "";
}
