package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductImageRequestDTO {
    private String url;
    private String altText;
    private Integer order;
    // ID của variant (nếu ảnh này dành riêng cho variant), có thể null
    private Long variantId;
}