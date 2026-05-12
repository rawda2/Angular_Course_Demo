import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../Interfaces/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.html',
})
export class ProductFormComponent implements OnInit {
  product = signal<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    inStock: true,
    rating: 0,
    createdAt: new Date(),
  });

  isEditMode = signal(false);
  isSubmitting = signal(false);
  productId = signal<number | null>(null);

  categories = signal<{ id: string; name: string; icon: string }[]>([]);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(parseInt(id));
      this.loadProduct();
    }
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: ((data) => {
        this.categories.set(data)
        console.log('Categories loaded:', data)
      }),
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  loadProduct() {
    const product = this.productService.getProductById(this.productId()!);
    if (product) {
      this.product.set({
        ...product,
        id: 0,
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        inStock: false,
        rating: 0,
        createdAt: new Date(),
      });
    } else {
      alert('Product not found!');
      this.router.navigate(['/products']);
    }
  }

  onSubmit() {
    this.isSubmitting.set(true);

    setTimeout(() => {
      if (this.isEditMode()) {
        const updated = this.productService.updateProduct(this.productId()!, this.product());
        if (updated) {
          alert('Product updated successfully!');
          this.router.navigate(['/products']);
        } else {
          alert('Error updating product');
        }
      } else {
        const { id, createdAt, ...newProduct } = this.product();
        this.productService.addProduct(newProduct as Omit<Product, 'id' | 'createdAt'>);
        alert('Product created successfully!');
        this.router.navigate(['/products']);
      }
      this.isSubmitting.set(false);
    }, 500);
  }

  onCancel() {
    this.router.navigate(['/products']);
  }
}
