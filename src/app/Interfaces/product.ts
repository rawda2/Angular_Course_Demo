// In your product.ts interface file
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  createdAt: Date;
  updatedAt?: Date; 
}

export interface ProductFilters {
  category?: string;
  
}