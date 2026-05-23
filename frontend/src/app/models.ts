export interface Contact {
  id: number;
  addressBookId: number;
  addressBookName: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  email: string;
}

export interface ContactRequest {
  addressBookId: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  email: string;
}

export interface AddressBook {
  id: number;
  name: string;
  contacts: Contact[];
}

export interface AddressBookRequest {
  name: string;
}

export interface DashboardMetrics {
  totalAddressBooks: number;
  totalContacts: number;
  citiesCovered: number;
  statesCovered: number;
}

export interface ChartItem {
  label: string;
  value: number;
}
