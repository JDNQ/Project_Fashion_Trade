package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter // <-- Đảm bảo bạn có @Getter
@Setter // <-- Đảm bảo bạn có @Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant productVariant;

    // ========== THÊM 2 TRƯỜNG BỊ THIẾU ==========

    // Lưu lại tên sản phẩm (từ productVariant.getProduct().getName())
    @Column(name = "product_name")
    private String productName; // <-- @Getter sẽ tạo getProductName()

    // Lưu lại SKU (từ productVariant.getSku())
    @Column(name = "variant_sku")
    private String variantSku; // <-- @Getter sẽ tạo getVariantSku()

    // ===========================================

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal; // (unitPrice * quantity)
}