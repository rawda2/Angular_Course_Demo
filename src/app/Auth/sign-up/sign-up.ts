import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../Interfaces/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})
export class SignupComponent {
  // Form fields
  email = '';
  username = '';
  firstName = '';
  lastName = '';
  password = '';
  confirmPassword = '';
  
  // Validation flags
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  
  // Error and success messages
  errorMessage = '';
  successMessage = '';
  
  // Validation errors object
  validationErrors = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  };

  constructor(private authService: AuthService, private router: Router) {
   
  }

  // Real-time email validation
  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email) {
      this.validationErrors.email = '';
    } else if (!emailRegex.test(this.email)) {
      this.validationErrors.email = 'Please enter a valid email address';
    } else if (this.authService.isEmailTaken(this.email)) {
      this.validationErrors.email = 'Email already exists. Please use another email';
    } else {
      this.validationErrors.email = '';
    }
  }

  // Real-time username validation
  validateUsername() {
    if (!this.username) {
      this.validationErrors.username = '';
    } else if (this.username.length < 3) {
      this.validationErrors.username = 'Username must be at least 3 characters';
    } else if (this.username.length > 20) {
      this.validationErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
      this.validationErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else {
      this.validationErrors.username = '';
    }
  }

  // Real-time password validation
  validatePassword() {
    if (!this.password) {
      this.validationErrors.password = '';
    } else if (this.password.length < 6) {
      this.validationErrors.password = 'Password must be at least 6 characters';
    } else if (this.password.length > 20) {
      this.validationErrors.password = 'Password must be less than 20 characters';
    } else if (!/[A-Z]/.test(this.password)) {
      this.validationErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(this.password)) {
      this.validationErrors.password = 'Password must contain at least one lowercase letter';
    } else if (/[0-9]/.test(this.password)) {
      this.validationErrors.password = '';
    } else {
      this.validationErrors.password = 'Password must contain at least one number';
    }
    
    // Re-validate confirm password if it has a value
    if (this.confirmPassword) {
      this.validateConfirmPassword();
    }
  }

  // Real-time confirm password validation
  validateConfirmPassword() {
    if (!this.confirmPassword) {
      this.validationErrors.confirmPassword = '';
    } else if (this.password !== this.confirmPassword) {
      this.validationErrors.confirmPassword = 'Passwords do not match';
    } else {
      this.validationErrors.confirmPassword = '';
    }
  }

  // Optional: First name validation
  validateFirstName() {
    if (this.firstName && this.firstName.length < 2) {
      this.validationErrors.firstName = 'First name must be at least 2 characters';
    } else if (this.firstName && this.firstName.length > 50) {
      this.validationErrors.firstName = 'First name must be less than 50 characters';
    } else {
      this.validationErrors.firstName = '';
    }
  }

  // Optional: Last name validation
  validateLastName() {
    if (this.lastName && this.lastName.length < 2) {
      this.validationErrors.lastName = 'Last name must be at least 2 characters';
    } else if (this.lastName && this.lastName.length > 50) {
      this.validationErrors.lastName = 'Last name must be less than 50 characters';
    } else {
      this.validationErrors.lastName = '';
    }
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.email !== '' &&
           this.validationErrors.email === '' &&
           this.username !== '' &&
           this.validationErrors.username === '' &&
           this.password !== '' &&
           this.validationErrors.password === '' &&
           this.validationErrors.confirmPassword === '' &&
           this.password === this.confirmPassword;
  }

  // Generate username from email if not provided
  generateUsernameFromEmail() {
    if (!this.username && this.email) {
      const generatedUsername = this.email.split('@')[0];
      // Remove special characters and limit length
      this.username = generatedUsername.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 20);
      this.validateUsername();
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.validateEmail();
    this.validateUsername();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validateFirstName();
    this.validateLastName();
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix all validation errors before submitting';
      return;
    }
    
    this.isSubmitting = true;
    
    const newUser: User = {
      id: 0, 
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName || undefined,
      lastName: this.lastName || undefined,
      createdAt: new Date()
    };
    
    setTimeout(() => {
      const result = this.authService.signup(newUser);
      
      if (result.success) {
        this.successMessage = result.message;
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      } else {
        this.errorMessage = result.message;
        this.isSubmitting = false;
      }
    }, 800);
  }

  resetForm() {
    this.email = '';
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.confirmPassword = '';
    this.validationErrors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}