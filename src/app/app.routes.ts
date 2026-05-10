import { Routes } from '@angular/router';
import { Products } from './Products/products/products';
import { SignupComponent } from './Auth/sign-up/sign-up';
import { SignInComponent } from './Auth/sign-in/sign-in';

export const routes: Routes = [
  {
    path: 'products',
    component: Products,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SignInComponent,
  },
];
