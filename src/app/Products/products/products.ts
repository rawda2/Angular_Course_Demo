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
  categories = signal<{ id: string; name: string; icon: string }[]>([]);
  isLoading = signal(false);
  selectedCategory = signal<string>(''); 
  filters: ProductFilters = {
    category: '',
  };

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.GetProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.applyFilters(); 
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        console.log('Categories loaded:', data);
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  // Apply category filter
  applyFilters() {
    let filtered = [...this.products()];

    // Apply category filter if selected
    if (this.filters.category && this.filters.category !== '') {
      filtered = filtered.filter((product) => product.category === this.filters.category);
    }

    this.filteredProducts.set(filtered);
  }

  // Handle category selection
  onCategoryChange(categoryId: string) {
    this.filters.category = categoryId;
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  // Clear category filter
  clearFilters() {
    this.filters.category = '';
    this.selectedCategory.set('');
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
      } else {
        alert('Error deleting product');
      }
    }
  }
}
