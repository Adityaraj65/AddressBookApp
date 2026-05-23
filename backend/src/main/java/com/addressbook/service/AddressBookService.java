package com.addressbook.service;

import com.addressbook.dto.AddressBookRequest;
import com.addressbook.dto.AddressBookResponse;
import com.addressbook.entity.AddressBook;
import com.addressbook.exception.ResourceNotFoundException;
import com.addressbook.repository.AddressBookRepository;
import com.addressbook.util.ContactMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressBookService {

    private final AddressBookRepository addressBookRepository;

    @Transactional
    public AddressBookResponse createAddressBook(AddressBookRequest request) {
        AddressBook addressBook = AddressBook.builder()
                .name(request.getName().trim())
                .build();
        return ContactMapper.toAddressBookResponse(addressBookRepository.save(addressBook));
    }

    @Transactional(readOnly = true)
    public AddressBookResponse getAddressBook(Long id) {
        return ContactMapper.toAddressBookResponse(findAddressBook(id));
    }

    @Transactional(readOnly = true)
    public List<AddressBookResponse> getAllAddressBooks() {
        return addressBookRepository.findAll()
                .stream()
                .map(ContactMapper::toAddressBookResponse)
                .toList();
    }

    @Transactional
    public AddressBookResponse updateAddressBook(Long id, AddressBookRequest request) {
        AddressBook addressBook = findAddressBook(id);
        addressBook.setName(request.getName().trim());
        return ContactMapper.toAddressBookResponse(addressBookRepository.save(addressBook));
    }

    @Transactional
    public void deleteAddressBook(Long id) {
        AddressBook addressBook = findAddressBook(id);
        addressBookRepository.delete(addressBook);
    }

    public AddressBook findAddressBook(Long id) {
        return addressBookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address book not found with id: " + id));
    }
}
