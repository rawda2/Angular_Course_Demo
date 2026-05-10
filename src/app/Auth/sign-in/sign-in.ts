import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignInComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    setTimeout(() => {
      const result = this.authService.login(this.email, this.password);

      if (result.success) {
        this.successMessage = result.message;
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1000);
      } else {
        this.errorMessage = result.message;
        this.isLoading = false;
      }
    }, 500);
  }
}
