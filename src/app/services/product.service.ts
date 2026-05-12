import { Injectable } from '@angular/core';
import { Product, ProductFilters } from '../Interfaces/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private readonly ProductsApiUrl = 'http://localhost:3000/products';
  private readonly CATEGORIESApiUrl = 'http://localhost:3000/categories';

  constructor(private httpClient: HttpClient) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.httpClient.get<Product[]>(this.ProductsApiUrl).subscribe({
      next: (products) => {
        this.productsSubject.next(products);
      },
      error: (error) => console.error('Error loading products:', error),
    });
  }

  GetProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.ProductsApiUrl).pipe(
      tap((products) => {
        this.productsSubject.next(products);
      }),
    );
  }

  private getCurrentProducts(): Product[] {
    return this.productsSubject.getValue();
  }

  getCategories(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.CATEGORIESApiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.ProductsApiUrl}/${id}`);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.httpClient.post<Product>(this.ProductsApiUrl, newProduct).pipe(
      tap((addedProduct) => {
        const currentProducts = this.getCurrentProducts();
        this.productsSubject.next([...currentProducts, addedProduct]);
      }),
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const updateData = {
      ...product,
      updatedAt: new Date().toISOString(),
    };

    return this.httpClient.patch<Product>(`${this.ProductsApiUrl}/${id}`, updateData).pipe(
      tap((updatedProduct) => {
        const currentProducts = this.getCurrentProducts();
        const index = currentProducts.findIndex((p) => p.id === id);
        if (index !== -1) {
          currentProducts[index] = updatedProduct;
          this.productsSubject.next([...currentProducts]);
        }
      }),
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.ProductsApiUrl}/${id}`).pipe(
      tap(() => {
        const currentProducts = this.getCurrentProducts();
        const updatedProducts = currentProducts.filter((p) => p.id !== id);
        this.productsSubject.next(updatedProducts);
      }),
    );
  }

  filterProducts(filters: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.category && filters.category !== '') {
      params = params.set('category', filters.category);
    }
    return this.httpClient.get<Product[]>(this.ProductsApiUrl, { params });
  }

  getProductStats(): Observable<{
    total: number;
    inStock: number;
    outOfStock: number;
    averagePrice: number;
    totalValue: number;
  }> {
    return this.GetProducts().pipe(
      map((products) => {
        const total = products.length;
        const inStock = products.filter((p) => p.inStock).length;
        const outOfStock = total - inStock;
        const averagePrice = total > 0 ? products.reduce((sum, p) => sum + p.price, 0) / total : 0;
        const totalValue = products.reduce((sum, p) => sum + p.price, 0);

        return {
          total,
          inStock,
          outOfStock,
          averagePrice: Math.round(averagePrice * 100) / 100,
          totalValue: Math.round(totalValue * 100) / 100,
        };
      }),
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.ProductsApiUrl}?category=${category}`);
  }

  getTopRatedProducts(limit: number = 5): Observable<Product[]> {
    return this.GetProducts().pipe(
      map((products) =>
        products
          .filter((p) => p.rating && p.rating > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit),
      ),
    );
  }
}
