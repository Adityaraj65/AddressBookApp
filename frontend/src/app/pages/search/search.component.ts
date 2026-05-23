import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Contact } from '../../models';
import { AddressBookApiService } from '../../services/address-book-api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTabsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  private readonly api = inject(AddressBookApiService);
  readonly query = new FormControl('', { nonNullable: true });
  readonly results = signal<Contact[]>([]);

  ngOnInit(): void {
    this.query.valueChanges
      .pipe(
        startWith(''),
        debounceTime(180),
        distinctUntilChanged(),
        switchMap((query) => this.api.searchContacts(query))
      )
      .subscribe((contacts) => this.results.set(contacts));
  }
}
