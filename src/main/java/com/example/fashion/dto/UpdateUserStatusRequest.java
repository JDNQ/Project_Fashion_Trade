package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {
    // Trạng thái mới, ví dụ: "active" hoặc "locked"
    private String status;
}