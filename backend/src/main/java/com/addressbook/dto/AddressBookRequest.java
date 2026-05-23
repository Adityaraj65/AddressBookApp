package com.addressbook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressBookRequest {

    @NotBlank(message = "Address book name is required")
    @Size(max = 100, message = "Address book name must not exceed 100 characters")
    private String name;
}
