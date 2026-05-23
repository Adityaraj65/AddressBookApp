package com.addressbook.controller;

import com.addressbook.dto.AddressBookRequest;
import com.addressbook.dto.AddressBookResponse;
import com.addressbook.dto.BulkContactRequest;
import com.addressbook.dto.ContactRequest;
import com.addressbook.dto.ContactResponse;
import com.addressbook.service.AddressBookService;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/address-books")
@RequiredArgsConstructor
public class AddressBookController {

    private final AddressBookService addressBookService;
    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<AddressBookResponse> createAddressBook(@Valid @RequestBody AddressBookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressBookService.createAddressBook(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressBookResponse> getAddressBook(@PathVariable Long id) {
        return ResponseEntity.ok(addressBookService.getAddressBook(id));
    }

    @GetMapping
    public ResponseEntity<List<AddressBookResponse>> getAllAddressBooks() {
        return ResponseEntity.ok(addressBookService.getAllAddressBooks());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressBookResponse> updateAddressBook(
            @PathVariable Long id,
            @Valid @RequestBody AddressBookRequest request
    ) {
        return ResponseEntity.ok(addressBookService.updateAddressBook(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddressBook(@PathVariable Long id) {
        addressBookService.deleteAddressBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/contacts")
    public ResponseEntity<List<ContactResponse>> getContactsByAddressBook(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactsByAddressBook(id));
    }

    @PostMapping("/{id}/contacts")
    public ResponseEntity<ContactResponse> addContactToAddressBook(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request
    ) {
        request.setAddressBookId(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(request));
    }

    @PostMapping("/{id}/contacts/bulk")
    public ResponseEntity<List<ContactResponse>> addMultipleContactsToAddressBook(
            @PathVariable Long id,
            @Valid @RequestBody BulkContactRequest request
    ) {
        request.getContacts().forEach(contact -> contact.setAddressBookId(id));
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addMultipleContacts(request.getContacts()));
    }
}
