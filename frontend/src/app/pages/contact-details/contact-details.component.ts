import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Contact } from '../../models';
import { AddressBookApiService } from '../../services/address-book-api.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit {
  private readonly api = inject(AddressBookApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly contact = signal<Contact | undefined>(undefined);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getContact(id).subscribe((contact) => this.contact.set(contact));
  }

  deleteContact(): void {
    const contact = this.contact();
    if (!contact || !confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
      return;
    }

    this.api.deleteContact(contact.id).subscribe({
      next: () => {
        this.snackBar.open('Contact deleted', 'Close', { duration: 2400 });
        this.router.navigate(['/contacts']);
      },
      error: (error) => this.snackBar.open(error.message, 'Close', { duration: 3200 })
    });
  }
}
