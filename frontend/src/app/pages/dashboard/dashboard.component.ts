import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AddressBookApiService } from '../../services/address-book-api.service';
import { ChartItem, Contact, DashboardMetrics } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(AddressBookApiService);

  readonly metrics = signal<DashboardMetrics>({
    totalAddressBooks: 0,
    totalContacts: 0,
    citiesCovered: 0,
    statesCovered: 0
  });
  readonly recentContacts = signal<Contact[]>([]);
  readonly cityChart = signal<ChartItem[]>([]);
  readonly stateChart = signal<ChartItem[]>([]);

  ngOnInit(): void {
    this.api.getDashboardMetrics().subscribe((metrics) => this.metrics.set(metrics));
    this.api.getContacts().subscribe((contacts) => this.recentContacts.set(contacts.slice(0, 5)));
    this.api.getContactsByCityCount().subscribe((items) => this.cityChart.set(items.slice(0, 6)));
    this.api.getContactsByStateCount().subscribe((items) => this.stateChart.set(items.slice(0, 6)));
  }

  percentage(value: number, items: ChartItem[]): number {
    const max = Math.max(...items.map((item) => item.value), 1);
    return Math.max(8, Math.round((value / max) * 100));
  }
}
