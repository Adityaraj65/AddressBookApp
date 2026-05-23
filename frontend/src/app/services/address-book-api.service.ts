import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AddressBook, AddressBookRequest, ChartItem, Contact, ContactRequest, DashboardMetrics } from '../models';
import { mockAddressBooks, mockContacts } from '../mock-data';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AddressBookApiService {
  private readonly http = inject(HttpClient);

  getAddressBooks(): Observable<AddressBook[]> {
    return this.http.get<AddressBook[]>(`${API_BASE}/address-books`).pipe(
      catchError(() => of(mockAddressBooks))
    );
  }

  createAddressBook(request: AddressBookRequest): Observable<AddressBook> {
    return this.http.post<AddressBook>(`${API_BASE}/address-books`, request).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateAddressBook(id: number, request: AddressBookRequest): Observable<AddressBook> {
    return this.http.put<AddressBook>(`${API_BASE}/address-books/${id}`, request).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteAddressBook(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/address-books/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${API_BASE}/contacts`).pipe(
      catchError(() => of(mockContacts))
    );
  }

  getContact(id: number): Observable<Contact | undefined> {
    return this.http.get<Contact>(`${API_BASE}/contacts/${id}`).pipe(
      catchError(() => of(mockContacts.find((contact) => contact.id === id)))
    );
  }

  createContact(request: ContactRequest): Observable<Contact> {
    return this.http.post<Contact>(`${API_BASE}/contacts`, request).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateContact(id: number, request: ContactRequest): Observable<Contact> {
    return this.http.put<Contact>(`${API_BASE}/contacts/${id}`, request).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/contacts/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  searchContacts(keyword: string): Observable<Contact[]> {
    if (!keyword.trim()) {
      return this.getContacts();
    }

    return this.http.get<Contact[]>(`${API_BASE}/contacts/search`, { params: { keyword } }).pipe(
      catchError(() => of(this.localSearch(keyword)))
    );
  }

  searchByCity(city: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${API_BASE}/contacts/search/city`, { params: { city } }).pipe(
      catchError(() => of(mockContacts.filter((contact) => contact.city.toLowerCase() === city.toLowerCase())))
    );
  }

  searchByState(state: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${API_BASE}/contacts/search/state`, { params: { state } }).pipe(
      catchError(() => of(mockContacts.filter((contact) => contact.state.toLowerCase() === state.toLowerCase())))
    );
  }

  getContactsByCityCount(): Observable<ChartItem[]> {
    return this.http.get<Record<string, number>>(`${API_BASE}/contacts/count/city`).pipe(
      map((data) => this.toChartItems(data)),
      catchError(() => of(this.countBy('city')))
    );
  }

  getContactsByStateCount(): Observable<ChartItem[]> {
    return this.http.get<Record<string, number>>(`${API_BASE}/contacts/count/state`).pipe(
      map((data) => this.toChartItems(data)),
      catchError(() => of(this.countBy('state')))
    );
  }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.getAddressBooks().pipe(
      map((addressBooks) => {
        const contacts = addressBooks.flatMap((book) => book.contacts ?? []);
        const sourceContacts = contacts.length ? contacts : mockContacts;
        return {
          totalAddressBooks: addressBooks.length,
          totalContacts: sourceContacts.length,
          citiesCovered: new Set(sourceContacts.map((contact) => contact.city)).size,
          statesCovered: new Set(sourceContacts.map((contact) => contact.state)).size
        };
      })
    );
  }

  private localSearch(keyword: string): Contact[] {
    const normalized = keyword.toLowerCase();
    return mockContacts.filter((contact) =>
      [
        contact.firstName,
        contact.lastName,
        contact.city,
        contact.state,
        contact.email,
        contact.phoneNumber,
        contact.addressBookName
      ].some((value) => value.toLowerCase().includes(normalized))
    );
  }

  private countBy(key: 'city' | 'state'): ChartItem[] {
    const result = mockContacts.reduce<Record<string, number>>((acc, contact) => {
      acc[contact[key]] = (acc[contact[key]] ?? 0) + 1;
      return acc;
    }, {});
    return this.toChartItems(result);
  }

  private toChartItems(data: Record<string, number>): ChartItem[] {
    return Object.entries(data)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message ?? 'Something went wrong. Please try again.';
    return throwError(() => new Error(message));
  }
}
