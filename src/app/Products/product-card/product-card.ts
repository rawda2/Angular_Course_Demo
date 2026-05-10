import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../Interfaces/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./product-card.html',
  styles: [
  
  ],
})
export class ProductCardComponent {
  product = input.required<Product>();
  viewDetails = output<Product>();
  edit = output<Product>();
  delete = output<Product>();

  onViewDetails() {
    this.viewDetails.emit(this.product());
  }

  onEdit() {
    this.edit.emit(this.product());
  }

  onDelete() {
    this.delete.emit(this.product());
  }
}
