import { Routes } from '@angular/router';
import { ProductLayout } from './Products/product-layout/product-layout';
import { ProductsComponent } from './Products/products/products';
import { SignupComponent } from './Auth/sign-up/sign-up';
import { SignInComponent } from './Auth/sign-in/sign-in';
import { ProductFormComponent } from './Products/product-form/product-form';
import { ProductDetailComponent } from './Products/product-detail/product-detail';

export const routes: Routes = [
  {
    path: '',
    component: ProductLayout,
    children: [
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products/add',
        component: ProductFormComponent,
      },
      {
        path: 'products/edit/:id',
        component: ProductFormComponent,
      },
      {
        path: 'products/:id',
        component: ProductDetailComponent,
      },
      {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SignInComponent,
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
