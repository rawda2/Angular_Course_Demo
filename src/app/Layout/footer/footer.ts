import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  currentDate = new Date();
  showScrollTop = false;

  socialLinks = [
    { icon: '📘', name: 'Facebook', url: '#' },
    { icon: '🐦', name: 'Twitter', url: '#' },
    { icon: '💻', name: 'GitHub', url: '#' },
    { icon: '📧', name: 'Email', url: '#' },
  ];

  quickLinks = [
    { label: 'Products', route: '/products' },
    { label: 'Add Product', route: '/products/add' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ];

  learningResources = [
    { label: 'Angular Docs', url: 'https://angular.io/docs', external: true },
    { label: 'Tour of Heroes', url: 'https://angular.io/tutorial', external: true },
    { label: 'Angular CLI', url: 'https://angular.io/cli', external: true },
    { label: 'GitHub', url: 'https://github.com/angular/angular', external: true },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
