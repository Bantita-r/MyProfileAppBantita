import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { CartItem, Product } from "./_data";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://119.59.102.161:3026/api";

type Credentials = { username: string; password: string };
export type UserProfile = {
  id: number;
  username: string;
  role: string;
  displayName: string;
  email: string;
  store: string;
  employeeCode: string;
};
export type AuthResponse = { token: string; user: UserProfile };
export type ProductInput = Omit<Product, "id">;
export type ClusteredProduct = Pick<
  Product,
  "id" | "name" | "category" | "price" | "stock" | "location"
> & { cluster: number };
export type ProductCluster = {
  id: number;
  label: string;
  averagePrice: number;
  averageStock: number;
  products: ClusteredProduct[];
};
export type ProductClusterAnalysis = {
  algorithm: "K-Means";
  features: ["price", "stock"];
  normalization: "StandardScaler";
  clusterCount: number;
  clusters: ProductCluster[];
};

let token: string | null = null;
const TOKEN_KEY = "vanta_auth_token";
const FAVORITES_KEY_PREFIX = "vanta_favorite_products_";
const CART_KEY_PREFIX = "vanta_cart_";
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function readToken(): Promise<string | null> {
  if (Platform.OS === "web")
    return typeof globalThis.localStorage === "undefined"
      ? null
      : globalThis.localStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function persistToken(value: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(TOKEN_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, value);
}

export async function restoreSession(): Promise<string | null> {
  token = await readToken();
  return token;
}

export async function clearSession(): Promise<void> {
  token = null;
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function loadFavoriteProductIds(
  userId: number,
): Promise<number[]> {
  const key = `${FAVORITES_KEY_PREFIX}${userId}`;
  const value =
    Platform.OS === "web"
      ? (globalThis.localStorage?.getItem(key) ?? null)
      : await SecureStore.getItemAsync(key);

  try {
    const ids: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(ids)
      ? ids.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteProductIds(
  userId: number,
  productIds: number[],
): Promise<void> {
  const key = `${FAVORITES_KEY_PREFIX}${userId}`;
  const value = JSON.stringify(productIds);
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function loadCart(userId: number): Promise<CartItem[]> {
  const key = `${CART_KEY_PREFIX}${userId}`;
  const value =
    Platform.OS === "web"
      ? (globalThis.localStorage?.getItem(key) ?? null)
      : await SecureStore.getItemAsync(key);
  try {
    const items: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(items)
      ? items.filter(
          (item): item is CartItem =>
            Boolean(item) &&
            Number.isInteger((item as CartItem).productId) &&
            Number.isInteger((item as CartItem).quantity) &&
            (item as CartItem).quantity > 0,
        )
      : [];
  } catch {
    return [];
  }
}

export async function saveCart(
  userId: number,
  items: CartItem[],
): Promise<void> {
  const key = `${CART_KEY_PREFIX}${userId}`;
  const value = JSON.stringify(items);
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hadSession = Boolean(token);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && hadSession) {
    await clearSession();
    onUnauthorized?.();
  }
  if (!response.ok)
    throw new Error(body.error ?? "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
  return body as T;
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  token = result.token;
  await persistToken(token);
  return result;
}

export async function register(credentials: {
  username: string;
  password: string;
  displayName: string;
  email: string;
}): Promise<{
  id: number;
  username: string;
  role: string;
  displayName: string;
  email: string;
}> {
  return request<{
    id: number;
    username: string;
    role: string;
    displayName: string;
    email: string;
  }>("/auth/register", { method: "POST", body: JSON.stringify(credentials) });
}

export const getMyProfile = () => request<UserProfile>("/auth/me");
export const updateMyProfile = (
  profile: Pick<
    UserProfile,
    "displayName" | "email" | "store" | "employeeCode"
  > & { password?: string },
) =>
  request<UserProfile>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
export const getProducts = () => request<Product[]>("/products");
export const getProductClusters = () =>
  request<ProductClusterAnalysis>("/analytics/product-clusters");
export async function uploadProductImage(asset: {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  file?: File;
}): Promise<string> {
  const formData = new FormData();
  if (Platform.OS === "web" && asset.file) {
    // Expo ImagePicker returns the browser File on web. A blob: preview URL
    // cannot be uploaded directly, but this File can be sent via FormData.
    formData.append("image", asset.file, asset.file.name);
  } else {
    formData.append(
      "image",
      {
        uri: asset.uri,
        name: asset.fileName || `product-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      } as unknown as Blob,
    );
  }
  const response = await fetch(`${API_BASE_URL}/uploads/products`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.error ??
        (response.status === 404
          ? "เซิร์ฟเวอร์ยังไม่ได้อัปเดตระบบอัปโหลดรูปภาพ"
          : "ไม่สามารถอัปโหลดรูปภาพได้"),
    );
  return String(body.imageUrl);
}
export const createProduct = (product: ProductInput) =>
  request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
export const updateProduct = (id: number, product: ProductInput) =>
  request<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
export const deleteProduct = (id: number) =>
  request<void>(`/products/${id}`, { method: "DELETE" });
