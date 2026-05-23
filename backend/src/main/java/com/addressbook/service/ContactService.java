package com.addressbook.service;

import com.addressbook.dto.ContactRequest;
import com.addressbook.dto.ContactResponse;
import com.addressbook.entity.AddressBook;
import com.addressbook.entity.Contact;
import com.addressbook.exception.DuplicateContactException;
import com.addressbook.exception.ResourceNotFoundException;
import com.addressbook.exception.ValidationException;
import com.addressbook.repository.ContactRepository;
import com.addressbook.util.ContactMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final AddressBookService addressBookService;

    @Transactional
    public ContactResponse addContact(ContactRequest request) {
        AddressBook addressBook = addressBookService.findAddressBook(request.getAddressBookId());
        validateDuplicate(request, null);
        Contact contact = ContactMapper.toContact(request, addressBook);
        return ContactMapper.toContactResponse(contactRepository.save(contact));
    }

    @Transactional
    public List<ContactResponse> addMultipleContacts(List<ContactRequest> requests) {
        validateDuplicateContactsInRequest(requests);
        return requests.stream()
                .map(this::addContact)
                .toList();
    }

    @Transactional
    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact contact = findContact(id);
        AddressBook addressBook = addressBookService.findAddressBook(request.getAddressBookId());
        validateDuplicate(request, id);
        ContactMapper.updateContact(contact, request, addressBook);
        return ContactMapper.toContactResponse(contactRepository.save(contact));
    }

    @Transactional
    public void deleteContact(Long id) {
        Contact contact = findContact(id);
        contactRepository.delete(contact);
    }

    @Transactional(readOnly = true)
    public ContactResponse getContact(Long id) {
        return ContactMapper.toContactResponse(findContact(id));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> getAllContacts() {
        return toResponses(contactRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> getContactsByAddressBook(Long addressBookId) {
        addressBookService.findAddressBook(addressBookId);
        return toResponses(contactRepository.findByAddressBookId(addressBookId));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> searchByCity(String city) {
        return toResponses(contactRepository.findByCityIgnoreCase(city));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> searchByState(String state) {
        return toResponses(contactRepository.findByStateIgnoreCase(state));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> searchAcrossAddressBooks(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            throw new ValidationException("Search keyword is required");
        }
        return toResponses(contactRepository.searchAcrossAddressBooks(keyword.trim()));
    }

    @Transactional(readOnly = true)
    public Map<String, List<ContactResponse>> groupByCity() {
        return contactRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Contact::getCity, Collectors.mapping(ContactMapper::toContactResponse, Collectors.toList())));
    }

    @Transactional(readOnly = true)
    public Map<String, List<ContactResponse>> groupByState() {
        return contactRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Contact::getState, Collectors.mapping(ContactMapper::toContactResponse, Collectors.toList())));
    }

    @Transactional(readOnly = true)
    public Map<String, Long> countByCity() {
        return contactRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Contact::getCity, Collectors.counting()));
    }

    @Transactional(readOnly = true)
    public Map<String, Long> countByState() {
        return contactRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Contact::getState, Collectors.counting()));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> sortContacts(String sortBy, String direction) {
        Comparator<Contact> comparator = comparatorFor(sortBy);
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }
        return contactRepository.findAll()
                .stream()
                .sorted(comparator)
                .map(ContactMapper::toContactResponse)
                .toList();
    }

    private Contact findContact(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    private void validateDuplicate(ContactRequest request, Long currentContactId) {
        boolean duplicateExists = contactRepository.existsByAddressBookIdAndFirstNameIgnoreCaseAndLastNameIgnoreCase(
                request.getAddressBookId(),
                request.getFirstName().trim(),
                request.getLastName().trim()
        );

        if (!duplicateExists) {
            return;
        }

        if (currentContactId != null) {
            Contact existing = findContact(currentContactId);
            boolean sameContact = existing.getAddressBook().getId().equals(request.getAddressBookId())
                    && existing.getFirstName().equalsIgnoreCase(request.getFirstName().trim())
                    && existing.getLastName().equalsIgnoreCase(request.getLastName().trim());
            if (sameContact) {
                return;
            }
        }

        throw new DuplicateContactException("Contact already exists in this address book: "
                + request.getFirstName() + " " + request.getLastName());
    }

    private void validateDuplicateContactsInRequest(List<ContactRequest> requests) {
        Map<String, Long> duplicateKeys = requests.stream()
                .map(this::duplicateKey)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        duplicateKeys.entrySet()
                .stream()
                .filter(entry -> entry.getValue() > 1)
                .findFirst()
                .ifPresent(entry -> {
                    throw new DuplicateContactException("Duplicate contact found in request: " + entry.getKey());
                });
    }

    private String duplicateKey(ContactRequest request) {
        return request.getAddressBookId() + ":"
                + request.getFirstName().trim().toLowerCase(Locale.ROOT) + ":"
                + request.getLastName().trim().toLowerCase(Locale.ROOT);
    }

    private Comparator<Contact> comparatorFor(String sortBy) {
        String key = sortBy == null ? "name" : sortBy.toLowerCase(Locale.ROOT);
        return switch (key) {
            case "name" -> Comparator
                    .comparing(Contact::getFirstName, String.CASE_INSENSITIVE_ORDER)
                    .thenComparing(Contact::getLastName, String.CASE_INSENSITIVE_ORDER);
            case "city" -> Comparator.comparing(Contact::getCity, String.CASE_INSENSITIVE_ORDER);
            case "state" -> Comparator.comparing(Contact::getState, String.CASE_INSENSITIVE_ORDER);
            case "zip" -> Comparator.comparing(Contact::getZip, String.CASE_INSENSITIVE_ORDER);
            default -> throw new ValidationException("Unsupported sort field: " + sortBy);
        };
    }

    private List<ContactResponse> toResponses(List<Contact> contacts) {
        return contacts.stream()
                .map(ContactMapper::toContactResponse)
                .toList();
    }
}
