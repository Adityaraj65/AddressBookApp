package com.addressbook.repository;

import com.addressbook.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    boolean existsByAddressBookIdAndFirstNameIgnoreCaseAndLastNameIgnoreCase(
            Long addressBookId,
            String firstName,
            String lastName
    );

    List<Contact> findByAddressBookId(Long addressBookId);

    List<Contact> findByCityIgnoreCase(String city);

    List<Contact> findByStateIgnoreCase(String state);

    @Query("""
            select c from Contact c
            join fetch c.addressBook ab
            where lower(c.firstName) like lower(concat('%', :keyword, '%'))
               or lower(c.lastName) like lower(concat('%', :keyword, '%'))
               or lower(c.email) like lower(concat('%', :keyword, '%'))
               or lower(c.phoneNumber) like lower(concat('%', :keyword, '%'))
               or lower(c.city) like lower(concat('%', :keyword, '%'))
               or lower(c.state) like lower(concat('%', :keyword, '%'))
               or lower(c.zip) like lower(concat('%', :keyword, '%'))
               or lower(ab.name) like lower(concat('%', :keyword, '%'))
            """)
    List<Contact> searchAcrossAddressBooks(@Param("keyword") String keyword);
}
