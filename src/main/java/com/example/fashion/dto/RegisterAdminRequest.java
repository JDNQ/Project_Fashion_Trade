package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

// Dùng @Getter @Setter của Lombok để lấy và gán dữ liệu
@Getter
@Setter
public class RegisterAdminRequest {

    // (Chúng ta sẽ thêm @Valid sau)
    private String email;
    private String password;
    private String fullName;
}