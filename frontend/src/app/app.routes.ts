import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddressBooksComponent } from './pages/address-books/address-books.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { SearchComponent } from './pages/search/search.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'address-books', component: AddressBooksComponent, title: 'Address Books' },
  { path: 'contacts', component: ContactsComponent, title: 'Contacts' },
  { path: 'contacts/new', component: ContactFormComponent, title: 'Add Contact' },
  { path: 'contacts/:id/edit', component: ContactFormComponent, title: 'Edit Contact' },
  { path: 'contacts/:id', component: ContactDetailsComponent, title: 'Contact Details' },
  { path: 'search', component: SearchComponent, title: 'Search' },
  { path: 'analytics', component: AnalyticsComponent, title: 'Analytics' },
  { path: 'settings', component: SettingsComponent, title: 'Settings' },
  { path: '**', redirectTo: 'dashboard' }
];
