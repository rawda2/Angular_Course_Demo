import { Injectable } from '@angular/core';
import { Product, ProductFilters } from '../Interfaces/product';
import { DUMMY_PRODUCTS } from '../Data/products-data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private nextId = 21; 

  constructor() {
    this.loadProducts();
  }

  private initDummyProducts() {
    if (this.products.length === 0) {
      this.products = [...DUMMY_PRODUCTS];
      this.saveProducts();
    }
  }

  private loadProducts(): void {
   
      this.initDummyProducts();
    
  }

  private saveProducts(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id: number, product: Partial<Product>): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...product,
        updatedAt: new Date(),
      };
      this.saveProducts();
      return this.products[index];
    }
    return undefined;
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }

  getCategories(): string[] {
    const categories = new Set(this.products.map((p) => p.category));
    return Array.from(categories).sort();
  }

  filterProducts(filters: ProductFilters): Product[] {
    let filtered = [...this.products];


    if (filters.category && filters.category !== '') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }


    return filtered;
  }

  getProductStats() {
    const total = this.products.length;
    const inStock = this.products.filter((p) => p.inStock).length;
    const outOfStock = total - inStock;
    const averagePrice = this.products.reduce((sum, p) => sum + p.price, 0) / total;
    const totalValue = this.products.reduce((sum, p) => sum + p.price, 0);

    return {
      total,
      inStock,
      outOfStock,
      averagePrice: Math.round(averagePrice * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
    };
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  getTopRatedProducts(limit: number = 5): Product[] {
    return [...this.products]
      .filter((p) => p.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
}
