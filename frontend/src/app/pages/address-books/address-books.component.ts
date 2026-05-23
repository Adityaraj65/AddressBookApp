import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AddressBook } from '../../models';
import { AddressBookApiService } from '../../services/address-book-api.service';

@Component({
  selector: 'app-address-book-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.addressBook ? 'Edit Address Book' : 'Create Address Book' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" autofocus />
          <mat-error>Address book name is required</mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `
})
export class AddressBookDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MAT_DIALOG_DATA) as { addressBook?: AddressBook };
  private readonly dialogRef = inject(MatDialogRef<AddressBookDialogComponent>);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.addressBook?.name ?? '', Validators.required]
  });

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}

@Component({
  selector: 'app-address-books',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatSnackBarModule],
  templateUrl: './address-books.component.html',
  styleUrl: './address-books.component.scss'
})
export class AddressBooksComponent implements OnInit {
  private readonly api = inject(AddressBookApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly addressBooks = signal<AddressBook[]>([]);

  ngOnInit(): void {
    this.loadAddressBooks();
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(AddressBookDialogComponent, { width: '420px', data: {} });
    ref.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.api.createAddressBook(result).subscribe({
        next: () => {
          this.snackBar.open('Address book created', 'Close', { duration: 2400 });
          this.loadAddressBooks();
        },
        error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3200 })
      });
    });
  }

  openEditDialog(addressBook: AddressBook): void {
    const ref = this.dialog.open(AddressBookDialogComponent, { width: '420px', data: { addressBook } });
    ref.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.api.updateAddressBook(addressBook.id, result).subscribe({
        next: () => {
          this.snackBar.open('Address book updated', 'Close', { duration: 2400 });
          this.loadAddressBooks();
        },
        error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3200 })
      });
    });
  }

  deleteAddressBook(addressBook: AddressBook): void {
    if (!confirm(`Delete "${addressBook.name}"?`)) {
      return;
    }
    this.api.deleteAddressBook(addressBook.id).subscribe({
      next: () => {
        this.snackBar.open('Address book deleted', 'Close', { duration: 2400 });
        this.loadAddressBooks();
      },
      error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3200 })
    });
  }

  private loadAddressBooks(): void {
    this.api.getAddressBooks().subscribe((addressBooks) => this.addressBooks.set(addressBooks));
  }
}
