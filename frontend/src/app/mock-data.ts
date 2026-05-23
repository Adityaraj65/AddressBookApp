import { AddressBook, Contact } from './models';

export const mockContacts: Contact[] = [
  {
    id: 1,
    addressBookId: 1,
    addressBookName: 'Family',
    firstName: 'Robert',
    lastName: 'Johnson',
    address: '123 Maple Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phoneNumber: '+1 202-555-0184',
    email: 'robert@example.com'
  },
  {
    id: 2,
    addressBookId: 2,
    addressBookName: 'Friends',
    firstName: 'Emma',
    lastName: 'Williams',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    phoneNumber: '+1 202-555-0185',
    email: 'emma@example.com'
  },
  {
    id: 3,
    addressBookId: 3,
    addressBookName: 'Office',
    firstName: 'Michael',
    lastName: 'Brown',
    address: '789 Pine Road',
    city: 'Chicago',
    state: 'IL',
    zip: '60607',
    phoneNumber: '+1 202-555-0186',
    email: 'michael@example.com'
  },
  {
    id: 4,
    addressBookId: 4,
    addressBookName: 'Business',
    firstName: 'Sophia',
    lastName: 'Davis',
    address: '321 Cedar Lane',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    phoneNumber: '+1 202-555-0187',
    email: 'sophia@example.com'
  },
  {
    id: 5,
    addressBookId: 1,
    addressBookName: 'Family',
    firstName: 'Daniel',
    lastName: 'Miller',
    address: '654 Elm Street',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85001',
    phoneNumber: '+1 202-555-0188',
    email: 'daniel@example.com'
  }
];

export const mockAddressBooks: AddressBook[] = [
  { id: 1, name: 'Family', contacts: mockContacts.filter((contact) => contact.addressBookId === 1) },
  { id: 2, name: 'Friends', contacts: mockContacts.filter((contact) => contact.addressBookId === 2) },
  { id: 3, name: 'Office', contacts: mockContacts.filter((contact) => contact.addressBookId === 3) },
  { id: 4, name: 'Business', contacts: mockContacts.filter((contact) => contact.addressBookId === 4) },
  { id: 5, name: 'Clients', contacts: [] },
  { id: 6, name: 'Relatives', contacts: [] },
  { id: 7, name: 'School', contacts: [] },
  { id: 8, name: 'Others', contacts: [] }
];
