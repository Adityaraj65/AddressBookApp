package com.addressbook.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkContactRequest {

    @NotEmpty(message = "Contacts list is required")
    private List<@Valid ContactRequest> contacts;
}
