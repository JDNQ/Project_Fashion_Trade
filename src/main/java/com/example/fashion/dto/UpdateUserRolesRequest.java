package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class UpdateUserRolesRequest {
    // Nhận một tập hợp tên các vai trò, ví dụ: ["CUSTOMER", "ORDER_MANAGER"]
    private Set<String> roles;
}