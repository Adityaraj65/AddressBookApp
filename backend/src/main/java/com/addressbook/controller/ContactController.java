package com.addressbook.controller;

import com.addressbook.dto.BulkContactRequest;
import com.addressbook.dto.ContactRequest;
import com.addressbook.dto.ContactResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> addContact(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(request));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ContactResponse>> addMultipleContacts(@Valid @RequestBody BulkContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addMultipleContacts(request.getContacts()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.ok(contactService.updateContact(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContact(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContact(id));
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/search/city")
    public ResponseEntity<List<ContactResponse>> searchContactsByCity(@RequestParam String city) {
        return ResponseEntity.ok(contactService.searchByCity(city));
    }

    @GetMapping("/search/state")
    public ResponseEntity<List<ContactResponse>> searchContactsByState(@RequestParam String state) {
        return ResponseEntity.ok(contactService.searchByState(state));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactResponse>> searchContactsAcrossAddressBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(contactService.searchAcrossAddressBooks(keyword));
    }

    @GetMapping("/grouped/city")
    public ResponseEntity<Map<String, List<ContactResponse>>> viewContactsGroupedByCity() {
        return ResponseEntity.ok(contactService.groupByCity());
    }

    @GetMapping("/grouped/state")
    public ResponseEntity<Map<String, List<ContactResponse>>> viewContactsGroupedByState() {
        return ResponseEntity.ok(contactService.groupByState());
    }

    @GetMapping("/count/city")
    public ResponseEntity<Map<String, Long>> countContactsByCity() {
        return ResponseEntity.ok(contactService.countByCity());
    }

    @GetMapping("/count/state")
    public ResponseEntity<Map<String, Long>> countContactsByState() {
        return ResponseEntity.ok(contactService.countByState());
    }

    @GetMapping("/sort")
    public ResponseEntity<List<ContactResponse>> sortContacts(
            @RequestParam(defaultValue = "name") String by,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(contactService.sortContacts(by, direction));
    }
}
