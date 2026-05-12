import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../Interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = true;
  errorMessage = '';
  private subscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID from route:', id);

    if (id) {
      this.isLoading = true;
      this.subscription = this.productService.getProductById(parseInt(id)).subscribe({
        next: (product) => {
          console.log('Product received:', product);
          this.product = product;
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.errorMessage = 'Failed to load product details';
          this.isLoading = false;
          this.product = null;
        },
      });
    } else {
      console.log('No product ID provided');
      this.isLoading = false;
      this.errorMessage = 'No product ID provided';
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editProduct() {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  deleteProduct() {
    if (this.product && confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.isLoading = true;
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
          this.isLoading = false;
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
