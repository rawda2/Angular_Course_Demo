import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin, User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  isEmailTaken(email: string): boolean {
    return this.dummyUsers.some((u) => u.email === email);
  }
  private dummyUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@demo.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      username: 'user',
      email: 'user@demo.com',
      password: 'user123',
      firstName: 'Regular',
      lastName: 'User',
      createdAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      username: 'testuser',
      email: 'test@demo.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'Account',
      createdAt: new Date('2024-01-03'),
    },
    {
      id: 4,
      username: 'john_doe',
      email: 'john@example.com',
      password: 'john123',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date('2024-01-04'),
    },
    {
      id: 5,
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'jane123',
      firstName: 'Jane',
      lastName: 'Smith',
      createdAt: new Date('2024-01-05'),
    },
  ];
  constructor(private router: Router) {}

  signup(user: User): { success: boolean; message: string } {
    const userExists = this.dummyUsers.some((u) => u.email === user.email);

    if (userExists) {
      return { success: false, message: 'User already exists! Please login.' };
    }

    this.dummyUsers.push(user);
    console.log('New user registered:', user.email);
    console.log('All users:', this.dummyUsers);

    this.router.navigate(['/products']);
    return { success: true, message: 'Signup successful! Please login.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const user = this.dummyUsers.find((u) => u.email === email && u.password === password);

    if (user) {
      this.isLoggedIn = true;
      return { success: true, message: 'Login successful!' };
    } else {
      this.router.navigate(['/signup']);
      return { success: false, message: 'Invalid email or password!' };
    }
  }
}
