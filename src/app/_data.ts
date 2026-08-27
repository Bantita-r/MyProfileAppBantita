export interface Product {
  id: number;
  name: string;
  price: number | string;
  stock: number;
  category: string;
  status: string;
  sizes?: string | null;
  image?: string | null;
  brand?: string | null;
  productCode?: string | null;
  location?: string | null;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  icon: string;
}

export type ScreenName =
  | "Home"
  | "Add"
  | "AddProduct"
  | "EditProduct"
  | "Products"
  | "Favorites"
  | "Categories"
  | "Settings"
  | "ProductDetail"
  | "Cart"
  | "Menu";

export interface CartItem {
  productId: number;
  quantity: number;
}

export const vantaCategories: Category[] = [
  { id: "c1", name: "Bottoms", count: "49 items", icon: "👖" },
  { id: "c2", name: "Coats", count: "23 items", icon: "🧥" },
  { id: "c3", name: "Jeans", count: "11 items", icon: "🩳" },
  { id: "c4", name: "Tops", count: "7 items", icon: "👕" },
  { id: "c5", name: "T-shirts", count: "15 items", icon: "👚" },
  { id: "c6", name: "Accessories", count: "63 items", icon: "👓" },
];
