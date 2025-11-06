package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_images")
@Getter
@Setter
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ: Nhiều Ảnh thuộc 1 Sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Có thể null, nếu ảnh này dành riêng cho 1 biến thể
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = true)
    private ProductVariant productVariant;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "alt_text")
    private String altText; // Văn bản thay thế (tốt cho SEO)

    @Column(name = "sort_order")
    private Integer order;
}
