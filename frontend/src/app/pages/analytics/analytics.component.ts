import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AddressBookApiService } from '../../services/address-book-api.service';
import { ChartItem, DashboardMetrics } from '../../models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  private readonly api = inject(AddressBookApiService);
  readonly metrics = signal<DashboardMetrics>({ totalAddressBooks: 0, totalContacts: 0, citiesCovered: 0, statesCovered: 0 });
  readonly cityChart = signal<ChartItem[]>([]);
  readonly stateChart = signal<ChartItem[]>([]);

  ngOnInit(): void {
    this.api.getDashboardMetrics().subscribe((metrics) => this.metrics.set(metrics));
    this.api.getContactsByCityCount().subscribe((items) => this.cityChart.set(items));
    this.api.getContactsByStateCount().subscribe((items) => this.stateChart.set(items));
  }

  percentage(value: number, items: ChartItem[]): number {
    const max = Math.max(...items.map((item) => item.value), 1);
    return Math.max(8, Math.round((value / max) * 100));
  }
}
