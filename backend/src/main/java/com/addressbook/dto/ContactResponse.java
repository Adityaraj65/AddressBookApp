package com.addressbook.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContactResponse {
    private Long id;
    private Long addressBookId;
    private String addressBookName;
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String phoneNumber;
    private String email;
}
