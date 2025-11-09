package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRegisterRequestDTO {
    // (Sau này chúng ta sẽ thêm @NotBlank, @Email, @Size để validation)
    private String email;
    private String password;
    private String fullName;
    private String phone;
}