package com.addressbook.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AddressBookResponse {
    private Long id;
    private String name;
    private List<ContactResponse> contacts;
}
