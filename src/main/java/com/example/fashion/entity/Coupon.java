package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code; // Mã giảm giá

    // Loại: "percent" (phần trăm), "fixed" (tiền cố định), "free_shipping"
    @Column(name = "type", length = 50, nullable = false)
    private String type;

    // Giá trị (ví dụ: 10 cho 10%, hoặc 100000 cho 100.000 VNĐ)
    @Column(name = "value", precision = 10, scale = 2, nullable = false)
    private BigDecimal value;

    // Đơn hàng tối thiểu để áp dụng
    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    // Giới hạn số lần sử dụng
    @Column(name = "usage_limit")
    private Integer usageLimit;

    // Số lần đã sử dụng
    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(name = "starts_at")
    private LocalDateTime startsAt; // Ngày bắt đầu

    @Column(name = "ends_at")
    private LocalDateTime endsAt; // Ngày kết thúc

    @Column(name = "active", nullable = false)
    private boolean active = true;
}