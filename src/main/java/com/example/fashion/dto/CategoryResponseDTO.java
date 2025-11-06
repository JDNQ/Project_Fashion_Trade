package com.example.fashion.dto;

import com.example.fashion.entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private Integer sortOrder;
    private boolean active;

    // Thông tin danh mục cha
    private Long parentId;
    private String parentName;

    // Danh sách ID các danh mục con
    private Set<Long> childrenIds;

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    public static CategoryResponseDTO fromCategory(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());
        dto.setSortOrder(category.getSortOrder());
        dto.setActive(category.isActive());

        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            dto.setChildrenIds(category.getChildren().stream()
                    .map(Category::getId)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}