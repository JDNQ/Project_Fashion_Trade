package com.example.fashion.dto;

import com.example.fashion.entity.ProductImage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductImageResponseDTO {
    private Long id;
    private String url;
    private String altText;
    private Integer order;

    public static ProductImageResponseDTO fromProductImage(ProductImage image) {
        ProductImageResponseDTO dto = new ProductImageResponseDTO();
        dto.setId(image.getId());
        dto.setUrl(image.getUrl());
        dto.setAltText(image.getAltText());
        dto.setOrder(image.getOrder());
        return dto;
    }
}