import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../../Layout/header/header";
import { FooterComponent } from '../../Layout/footer/footer';

@Component({
  selector: 'app-product-layout',
  imports: [RouterModule, HeaderComponent,FooterComponent],
  templateUrl: './product-layout.html',
  styleUrl: './product-layout.css',
})
export class ProductLayout {}
