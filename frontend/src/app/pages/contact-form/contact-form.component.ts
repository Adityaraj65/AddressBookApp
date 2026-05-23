import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddressBook } from '../../models';
import { AddressBookApiService } from '../../services/address-book-api.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AddressBookApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly contactId = signal<number | null>(null);
  readonly addressBooks = signal<AddressBook[]>([]);

  readonly form = this.fb.nonNullable.group({
    addressBookId: [0, [Validators.required, Validators.min(1)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z -]{3,20}$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9][0-9 -]{7,18}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contactId.set(Number.isFinite(id) && id > 0 ? id : null);
    this.api.getAddressBooks().subscribe((books) => {
      this.addressBooks.set(books);
      if (!this.contactId() && books[0]) {
        this.form.patchValue({ addressBookId: books[0].id });
      }
    });

    if (this.contactId()) {
      this.api.getContact(this.contactId()!).subscribe((contact) => {
        if (!contact) {
          return;
        }
        this.form.patchValue(contact);
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue();
    const action = this.contactId()
      ? this.api.updateContact(this.contactId()!, request)
      : this.api.createContact(request);

    action.subscribe({
      next: (contact) => {
        this.snackBar.open(this.contactId() ? 'Contact updated' : 'Contact created', 'Close', { duration: 2400 });
        this.router.navigate(['/contacts', contact.id]);
      },
      error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3600 })
    });
  }

  cancel(): void {
    this.router.navigate(['/contacts']);
  }
}
