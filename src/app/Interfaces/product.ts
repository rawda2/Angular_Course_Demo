export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt?: Date;
}
