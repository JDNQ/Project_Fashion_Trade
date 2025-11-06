package com.example.fashion.service;

import com.example.fashion.dto.CategoryRequestDTO;
import com.example.fashion.dto.CategoryResponseDTO;
import com.example.fashion.entity.Category;
import com.example.fashion.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Gán dữ liệu từ DTO vào Entity
     */
    private void mapDtoToEntity(CategoryRequestDTO dto, Category category) {
        category.setName(dto.getName());
        category.setSlug(dto.getSlug());
        category.setDescription(dto.getDescription());
        category.setSortOrder(dto.getSortOrder());
        category.setActive(dto.isActive());

        // Xử lý danh mục cha
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha ID: " + dto.getParentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
    }

    /**
     * Tạo Category
     */
    @Transactional
    public CategoryResponseDTO createCategory(CategoryRequestDTO request) {
        Category category = new Category();
        mapDtoToEntity(request, category);

        Category savedCategory = categoryRepository.save(category);
        return CategoryResponseDTO.fromCategory(savedCategory);
    }

    /**
     * Lấy tất cả Category
     */
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponseDTO::fromCategory)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật Category
     */
    @Transactional
    public CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + categoryId));

        mapDtoToEntity(request, category);

        Category updatedCategory = categoryRepository.save(category);
        return CategoryResponseDTO.fromCategory(updatedCategory);
    }

    /**
     * Xóa Category
     */
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + categoryId));

        // Cần xử lý logic (ví dụ: không cho xóa nếu có sản phẩm, hoặc chuyển sản phẩm sang danh mục khác)
        // Tạm thời: Xóa

        // Trước khi xóa, phải ngắt kết nối cha-con
        category.setParent(null);
        if (category.getChildren() != null) {
            category.getChildren().forEach(child -> child.setParent(null));
        }

        categoryRepository.delete(category);
    }
}