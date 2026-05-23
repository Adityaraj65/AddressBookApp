package com.addressbook.service;

import com.addressbook.dto.AddressBookRequest;
import com.addressbook.dto.ContactRequest;
import com.addressbook.dto.ContactResponse;
import com.addressbook.exception.DuplicateContactException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ContactServiceTest {

    @Autowired
    private AddressBookService addressBookService;

    @Autowired
    private ContactService contactService;

    @Test
    void addContactPreventsDuplicateNameInsideAddressBook() {
        Long addressBookId = createAddressBook("Family");
        ContactRequest request = contactRequest(addressBookId, "Alex", "Morgan", "Austin", "Texas", "78701");

        contactService.addContact(request);

        assertThatThrownBy(() -> contactService.addContact(contactRequest(addressBookId, "alex", "morgan", "Dallas", "Texas", "75201")))
                .isInstanceOf(DuplicateContactException.class);
    }

    @Test
    void sameContactNameCanExistInDifferentAddressBooks() {
        Long familyBookId = createAddressBook("Family");
        Long workBookId = createAddressBook("Work");

        contactService.addContact(contactRequest(familyBookId, "Sam", "Lee", "Seattle", "Washington", "98101"));
        ContactResponse response = contactService.addContact(contactRequest(workBookId, "Sam", "Lee", "Boston", "Massachusetts", "02108"));

        assertThat(response.getAddressBookId()).isEqualTo(workBookId);
    }

    @Test
    void groupsCountsAndSortsContactsWithStreams() {
        Long addressBookId = createAddressBook("Friends");
        contactService.addContact(contactRequest(addressBookId, "Zara", "Patel", "Denver", "Colorado", "80202"));
        contactService.addContact(contactRequest(addressBookId, "Ava", "Chen", "Austin", "Texas", "78701"));

        Map<String, Long> countByCity = contactService.countByCity();
        List<ContactResponse> sortedByName = contactService.sortContacts("name", "asc");

        assertThat(countByCity).containsEntry("Denver", 1L).containsEntry("Austin", 1L);
        assertThat(sortedByName).extracting(ContactResponse::getFirstName).containsExactly("Ava", "Zara");
    }

    private Long createAddressBook(String name) {
        AddressBookRequest request = new AddressBookRequest();
        request.setName(name);
        return addressBookService.createAddressBook(request).getId();
    }

    private ContactRequest contactRequest(
            Long addressBookId,
            String firstName,
            String lastName,
            String city,
            String state,
            String zip
    ) {
        ContactRequest request = new ContactRequest();
        request.setAddressBookId(addressBookId);
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setAddress("123 Main Street");
        request.setCity(city);
        request.setState(state);
        request.setZip(zip);
        request.setPhoneNumber("+1 555 123 4567");
        request.setEmail(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com");
        return request;
    }
}
