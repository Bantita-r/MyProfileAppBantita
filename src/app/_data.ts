export interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
  status: string;
  size: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  icon: string;
}

export type ScreenName =
  | 'Home'
  | 'Add'
  | 'Products'
  | 'Categories'
  | 'Settings'
  | 'ProductDetail'
  | 'Menu';

// คลังข้อมูลสินค้าคอลเลกชันแบรนด์ VANTA ของดรีมมี่
export const vantaInventory: Product[] = [
  { id: '1', name: 'VANTA Denim Dress', price: '฿790', stock: 12, category: 'Dresses', status: 'Active', size: 'S, M, L', imageUrl: 'https://i.pinimg.com/736x/e4/33/9e/e4339e0d1429c4e026e90fad88ed978e.jpg' },
  { id: '2', name: 'VANTA Stripe Maxi', price: '฿650', stock: 10, category: 'Dresses', status: 'Active', size: 'M, L', imageUrl: 'https://i.pinimg.com/1200x/c0/18/71/c01871e6da2cacfeafe01662046fddda.jpg' },
  { id: '3', name: 'Pleated Minimal Dress', price: '฿590', stock: 1, category: 'Dresses', status: 'Low in stock', size: 'Free Size', imageUrl: 'https://i.pinimg.com/1200x/ef/2c/4a/ef2c4a38ffb2519f14845e247d9439a4.jpg' },
  { id: '4', name: 'Smocked Crop Top', price: '฿390', stock: 22, category: 'Tops', status: 'Active', size: 'S, M', imageUrl: 'https://i.pinimg.com/736x/a4/81/c1/a481c1179080938392d459285b7ee8dc.jpg' },
];

export const vantaCategories: Category[] = [
  { id: 'c1', name: 'Bottoms', count: '49 items', icon: '👖' },
  { id: 'c2', name: 'Coats', count: '23 items', icon: '🧥' },
  { id: 'c3', name: 'Jeans', count: '11 items', icon: '🩳' },
  { id: 'c4', name: 'Tops', count: '7 items', icon: '👕' },
  { id: 'c5', name: 'T-shirts', count: '15 items', icon: '👚' },
  { id: 'c6', name: 'Accessories', count: '63 items', icon: '👓' },
];