package com.example.fashion.dto;

import com.example.fashion.entity.Brand;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandResponseDTO {
    private Long id;
    private String name;
    private String slug;

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    public static BrandResponseDTO fromBrand(Brand brand) {
        BrandResponseDTO dto = new BrandResponseDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setSlug(brand.getSlug());
        return dto;
    }
}