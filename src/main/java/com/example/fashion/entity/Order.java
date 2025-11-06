package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter; // <-- Đảm bảo bạn có @Setter
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter // <-- LỖI SẼ BIẾN MẤT NẾU CÓ DÒNG NÀY
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no", unique = true, nullable = false, length = 50)
    private String orderNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "pay_status", length = 50)
    private String payStatus;

    @Column(name = "order_status", length = 50)
    private String orderStatus;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "shipping_name", length = 100)
    private String shippingName;

    @Column(name = "shipping_phone", length = 20)
    private String shippingPhone;

    @Column(name = "shipping_address_line")
    private String shippingAddressLine;

    @Column(name = "shipping_city")
    private String shippingCity;

    @Column(name = "shipping_district")
    private String shippingDistrict;

    @Column(name = "shipping_province")
    private String shippingProvince;

    // TRƯỜNG BỊ THIẾU NẰM Ở ĐÂY
    @Column(name = "tracking_number", length = 100)
    private String trackingNumber; // <-- @Setter sẽ tạo ra setTrackingNumber()

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}