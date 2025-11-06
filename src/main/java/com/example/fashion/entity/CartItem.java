package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ: Nhiều Mục hàng thuộc 1 Giỏ hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Mối quan hệ: Mục hàng này tương ứng với biến thể sản phẩm nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // Lưu lại giá tại thời điểm thêm vào giỏ, phòng trường hợp giá sản phẩm thay đổi
    @Column(name = "price_at_add", precision = 10, scale = 2)
    private BigDecimal priceAtAdd;
}
