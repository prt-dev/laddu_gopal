import { BASE_URL } from "@/app/services/authService";
import { CategoryItem } from "@/app/services/categoryService";
import { allProducts } from "@/app/data/products";

export interface ProductItem {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock_quantity?: number;
  category_id?: number;
  image_url?: string;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  category_obj?: CategoryItem;

  // Frontend helper properties
  img?: string;
  desc?: string;
  oldPrice?: string;
  sizes?: string[];
  specs?: { label: string; value: string }[];
  variant?: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: number;
}

export interface GetProductsResponse {
  total: number;
  products: ProductItem[];
  items: ProductItem[];
}

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("web_customer_token") ||
    undefined
  );
}

/**
 * Normalizes backend product object to include all UI convenience fields
 */
export function normalizeProduct(p: any): ProductItem {
  let categoryName = "Poshak";
  if (typeof p.category === "string") {
    categoryName = p.category;
  } else if (p.category && typeof p.category.name === "string") {
    categoryName = p.category.name;
  } else if (p.category_id === 1 || p.category_id === 2) {
    categoryName = "Pagdi";
  } else if (p.category_id === 3) {
    categoryName = "Kundan Shringar";
  } else if (p.category_id === 4) {
    categoryName = "Special";
  } else if (p.category_id === 5) {
    categoryName = "Poshak";
  }

  const numPrice = typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0)) || 0;

  return {
    ...p,
    id: p.id,
    name: p.name,
    description: p.description,
    price: numPrice,
    sku: p.sku,
    stock_quantity: p.stock_quantity ?? 0,
    category_id: p.category_id,
    image_url: p.image_url || "/assets/best-selling.png",
    status: p.status ?? 1,
    img: p.image_url || "/assets/best-selling.png",
    desc: p.description,
    category: categoryName,
    category_obj: typeof p.category === "object" ? p.category : undefined,
    oldPrice: `₹${Math.round(numPrice * 1.4)}.00`,
    variant: p.variant || "",
    sizes:
      p.variant !== undefined && p.variant !== null
        ? String(p.variant)
            .split(/[,;]/)
            .map((s: string) => s.trim())
            .filter(Boolean)
        : Array.isArray(p.sizes) && p.sizes.length > 0
        ? p.sizes
        : ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"],
    specs: p.specs || [
      { label: "Craftsmanship", value: "100% Handcrafted by traditional Vrindavan Karigars" },
      { label: "Material", value: "Premium fabric with heavy embroidery & stone work" },
      { label: "Care Instructions", value: "Gentle dry wipe with soft cloth" },
    ],
  };
}

/**
 * Fetches products from backend API with automatic fallback
 */
export async function getProducts(
  { page = 1, limit = 50, search = "", category_id, status }: GetProductsParams = {},
  token?: string
): Promise<GetProductsResponse> {
  const authToken = token || getStoredToken();
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (category_id !== undefined && category_id !== null) {
    params.append("category_id", category_id.toString());
  }
  if (status !== undefined && status !== null) {
    params.append("status", status.toString());
  }

  const url = `${BASE_URL}/products/all?${params.toString()}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || "Failed to fetch products");
    }

    const data = await response.json();
    const rawList: any[] = data.products || data.items || data.data || (Array.isArray(data) ? data : []);
    const normalized = rawList.map(normalizeProduct);

    return {
      total: data.total ?? normalized.length,
      products: normalized,
      items: normalized,
    };
  } catch (err) {
    console.warn("getProducts API fallback to local data:", err);
    let fallback = allProducts.map(normalizeProduct);

    if (category_id !== undefined && category_id !== null) {
      fallback = fallback.filter((p) => p.category_id === category_id);
    }
    if (search?.trim()) {
      const q = search.toLowerCase().trim();
      fallback = fallback.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    return {
      total: fallback.length,
      products: fallback,
      items: fallback,
    };
  }
}

/**
 * Fetches single product by ID with fallback
 */
export async function getProductById(
  productId: number | string,
  token?: string
): Promise<ProductItem> {
  const numId = typeof productId === "string" ? parseInt(productId, 10) : productId;
  const authToken = token || getStoredToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${numId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${numId}`);
    }

    const raw = await response.json();
    return normalizeProduct(raw);
  } catch (err) {
    console.warn(`getProductById fallback for ID ${numId}:`, err);
    const found = allProducts.find((p) => p.id === numId) || allProducts[0];
    return normalizeProduct(found);
  }
}

export async function createProductApi(data: Partial<ProductItem>, token: string) {
  const response = await fetch(`${BASE_URL}/products/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create product"
    );
  }

  return response.json();
}

export async function updateProductApi(
  productId: number,
  data: Partial<ProductItem>,
  token: string
) {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to update product"
    );
  }

  return response.json();
}

export async function deleteProductApi(productId: number, token: string) {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete product"
    );
  }

  return response.json();
}
