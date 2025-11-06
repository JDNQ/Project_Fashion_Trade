package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ: Một Thanh toán thuộc 1 Đơn hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "provider", length = 100) // Ví dụ: "VNPay", "Momo", "COD"
    private String provider;

    @Column(name = "status", length = 50) // Ví dụ: "Pending", "Success", "Failed"
    private String status;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    // Mã giao dịch từ nhà cung cấp (VNPay, Momo...)
    @Column(name = "provider_txn_id")
    private String providerTransactionId;

    // Lưu trữ thông tin bổ sung, ví dụ: JSON phản hồi từ cổng thanh toán
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
