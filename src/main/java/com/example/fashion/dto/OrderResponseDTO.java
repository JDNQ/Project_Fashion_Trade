package com.example.fashion.dto;

import com.example.fashion.entity.Order;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderResponseDTO {
    private Long id;
    private String orderNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin User
    private Long userId;
    private String userEmail;

    // Thông tin tiền tệ
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;

    // Trạng thái
    private String payStatus;
    private String orderStatus;
    private String paymentMethod;
    private String trackingNumber;

    // Địa chỉ giao hàng
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;

    // Các mục trong đơn hàng
    private Set<OrderItemResponseDTO> items;

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    public static OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNo(order.getOrderNo());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());
        }

        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setPayStatus(order.getPayStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTrackingNumber(order.getTrackingNumber());

        dto.setShippingName(order.getShippingName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddressLine(order.getShippingAddressLine());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingDistrict(order.getShippingDistrict());
        dto.setShippingProvince(order.getShippingProvince());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemResponseDTO::fromOrderItem)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}