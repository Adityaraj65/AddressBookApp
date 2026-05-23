import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Contact } from '../../models';
import { AddressBookApiService } from '../../services/address-book-api.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, AfterViewInit {
  private readonly api = inject(AddressBookApiService);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['avatar', 'name', 'address', 'city', 'state', 'zip', 'phone', 'email', 'actions'];
  readonly dataSource = new MatTableDataSource<Contact>([]);
  readonly search = new FormControl('', { nonNullable: true });
  readonly city = new FormControl('all', { nonNullable: true });
  readonly state = new FormControl('all', { nonNullable: true });
  readonly sortBy = new FormControl('name', { nonNullable: true });

  cities: string[] = [];
  states: string[] = [];
  private allContacts: Contact[] = [];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngOnInit(): void {
    this.loadContacts();
    this.search.valueChanges.subscribe(() => this.applyFilters());
    this.city.valueChanges.subscribe(() => this.applyFilters());
    this.state.valueChanges.subscribe(() => this.applyFilters());
    this.sortBy.valueChanges.subscribe(() => this.applyFilters());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator ?? null;
  }

  deleteContact(contact: Contact): void {
    if (!confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
      return;
    }

    this.api.deleteContact(contact.id).subscribe({
      next: () => {
        this.snackBar.open('Contact deleted', 'Close', { duration: 2400 });
        this.loadContacts();
      },
      error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3200 })
    });
  }

  private loadContacts(): void {
    this.api.getContacts().subscribe((contacts) => {
      this.allContacts = contacts;
      this.cities = [...new Set(contacts.map((contact) => contact.city))].sort();
      this.states = [...new Set(contacts.map((contact) => contact.state))].sort();
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const term = this.search.value.toLowerCase();
    const city = this.city.value;
    const state = this.state.value;
    const sortBy = this.sortBy.value;

    const filtered = this.allContacts
      .filter((contact) => {
        const haystack = `${contact.firstName} ${contact.lastName} ${contact.address} ${contact.city} ${contact.state} ${contact.zip} ${contact.phoneNumber} ${contact.email}`.toLowerCase();
        return haystack.includes(term);
      })
      .filter((contact) => city === 'all' || contact.city === city)
      .filter((contact) => state === 'all' || contact.state === state)
      .sort((a, b) => this.sortContacts(a, b, sortBy));

    this.dataSource.data = filtered;
    this.paginator?.firstPage();
  }

  private sortContacts(a: Contact, b: Contact, sortBy: string): number {
    const fullNameA = `${a.firstName} ${a.lastName}`;
    const fullNameB = `${b.firstName} ${b.lastName}`;
    const fieldMap: Record<string, [string, string]> = {
      name: [fullNameA, fullNameB],
      city: [a.city, b.city],
      state: [a.state, b.state],
      zip: [a.zip, b.zip]
    };
    const [left, right] = fieldMap[sortBy] ?? fieldMap['name'];
    return left.localeCompare(right);
  }
}
