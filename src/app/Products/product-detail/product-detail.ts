import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../Interfaces/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = this.productService.getProductById(parseInt(id)) || null;
    }
  }

  editProduct() {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  deleteProduct() {
    if (this.product && confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.productService.deleteProduct(this.product.id);
      alert('Product deleted successfully!');
      this.router.navigate(['/products']);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
