package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequestDTO {

    private String orderStatus; // Trạng thái đơn hàng mới
    private String payStatus; // Trạng thái thanh toán mới (nếu cần)
    private String trackingNumber; // Mã vận đơn (nếu có)
}