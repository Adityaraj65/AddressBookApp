import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly collapsed = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly currentUrl = signal('/dashboard');

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Address Books', icon: 'auto_stories', path: '/address-books' },
    { label: 'Contacts', icon: 'group', path: '/contacts' },
    { label: 'Search', icon: 'search', path: '/search' },
    { label: 'Analytics', icon: 'bar_chart', path: '/analytics' },
    { label: 'Settings', icon: 'settings', path: '/settings' }
  ];

  readonly pageTitle = computed(() => {
    const path = this.currentUrl().split('?')[0];
    if (path.startsWith('/contacts/new')) {
      return 'Add Contact';
    }
    if (path.includes('/edit')) {
      return 'Edit Contact';
    }
    if (/^\/contacts\/\d+/.test(path)) {
      return 'Contact Details';
    }
    return this.navItems.find((item) => path.startsWith(item.path))?.label ?? 'Dashboard';
  });

  constructor(private readonly router: Router) {
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.mobileMenuOpen.set(false);
      });
  }

  toggleSidebar(): void {
    this.collapsed.update((value) => !value);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }
}
