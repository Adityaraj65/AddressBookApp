package com.addressbook.util;

import com.addressbook.dto.AddressBookResponse;
import com.addressbook.dto.ContactRequest;
import com.addressbook.dto.ContactResponse;
import com.addressbook.entity.AddressBook;
import com.addressbook.entity.Contact;

import java.util.List;

public final class ContactMapper {

    private ContactMapper() {
    }

    public static Contact toContact(ContactRequest request, AddressBook addressBook) {
        return Contact.builder()
                .addressBook(addressBook)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .zip(request.getZip().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .email(request.getEmail().trim())
                .build();
    }

    public static void updateContact(Contact contact, ContactRequest request, AddressBook addressBook) {
        contact.setAddressBook(addressBook);
        contact.setFirstName(request.getFirstName().trim());
        contact.setLastName(request.getLastName().trim());
        contact.setAddress(request.getAddress().trim());
        contact.setCity(request.getCity().trim());
        contact.setState(request.getState().trim());
        contact.setZip(request.getZip().trim());
        contact.setPhoneNumber(request.getPhoneNumber().trim());
        contact.setEmail(request.getEmail().trim());
    }

    public static ContactResponse toContactResponse(Contact contact) {
        AddressBook addressBook = contact.getAddressBook();
        return ContactResponse.builder()
                .id(contact.getId())
                .addressBookId(addressBook.getId())
                .addressBookName(addressBook.getName())
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .address(contact.getAddress())
                .city(contact.getCity())
                .state(contact.getState())
                .zip(contact.getZip())
                .phoneNumber(contact.getPhoneNumber())
                .email(contact.getEmail())
                .build();
    }

    public static AddressBookResponse toAddressBookResponse(AddressBook addressBook) {
        List<ContactResponse> contacts = addressBook.getContacts()
                .stream()
                .map(ContactMapper::toContactResponse)
                .toList();

        return AddressBookResponse.builder()
                .id(addressBook.getId())
                .name(addressBook.getName())
                .contacts(contacts)
                .build();
    }
}
