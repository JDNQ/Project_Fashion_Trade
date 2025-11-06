package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDTO {
    private String name;
    private String slug;
    private String description;

    // ID của danh mục cha (nếu có, có thể null)
    private Long parentId;

    private Integer sortOrder;
    private boolean active;
}