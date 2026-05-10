import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card';
import { Product, ProductFilters } from '../../Interfaces/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<string[]>([]);
  isLoading = signal(false);

  filters: ProductFilters = {
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStockOnly: false,
  };

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);

    setTimeout(() => {
      const products = this.productService.getProducts();
      this.products.set(products);
      this.categories.set(this.productService.getCategories());
      this.applyFilters();
      this.isLoading.set(false);
    }, 500);
  }

  applyFilters() {
    const filtered = this.productService.filterProducts(this.filters);
    this.filteredProducts.set(filtered);
  }

  clearFilters() {
    this.filters = {
      search: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
    };
    this.applyFilters();
  }

  viewProductDetails(product: Product) {
    console.log('Viewing product:', product);
    this.router.navigate(['/products', product.id]);
  }

  editProduct(product: Product) {
    console.log('Editing product:', product);
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const success = this.productService.deleteProduct(product.id);
      if (success) {
        this.loadProducts();
        alert('Product deleted successfully!');
      }
    }
  }
}
