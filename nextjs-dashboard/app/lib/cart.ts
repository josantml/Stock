
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
  selectedOptions?: Record<string, string>;
  notes?: string;
};