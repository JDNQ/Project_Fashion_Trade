package com.example.fashion.dto;

import com.example.fashion.entity.ProductVariant;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantResponseDTO {
    private Long id;
    private String sku;
    private String attributes;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Double weight;

    public static ProductVariantResponseDTO fromProductVariant(ProductVariant variant) {
        ProductVariantResponseDTO dto = new ProductVariantResponseDTO();
        dto.setId(variant.getId());
        dto.setSku(variant.getSku());
        dto.setAttributes(variant.getAttributes());
        dto.setPrice(variant.getPrice());
        dto.setSalePrice(variant.getSalePrice());
        dto.setStockQuantity(variant.getStockQuantity());
        dto.setWeight(variant.getWeight());
        return dto;
    }
}