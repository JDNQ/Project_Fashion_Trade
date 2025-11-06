package com.example.fashion.service;

import com.example.fashion.dto.BrandRequestDTO;
import com.example.fashion.dto.BrandResponseDTO;
import com.example.fashion.entity.Brand;
import com.example.fashion.repository.BrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    /**
     * Tạo Brand
     */
    @Transactional
    public BrandResponseDTO createBrand(BrandRequestDTO request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(request.getSlug());

        Brand savedBrand = brandRepository.save(brand);
        return BrandResponseDTO.fromBrand(savedBrand);
    }

    /**
     * Lấy tất cả Brand
     */
    public List<BrandResponseDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(BrandResponseDTO::fromBrand)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật Brand
     */
    @Transactional
    public BrandResponseDTO updateBrand(Long brandId, BrandRequestDTO request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + brandId));

        brand.setName(request.getName());
        brand.setSlug(request.getSlug());

        Brand updatedBrand = brandRepository.save(brand);
        return BrandResponseDTO.fromBrand(updatedBrand);
    }

    /**
     * Xóa Brand
     */
    @Transactional
    public void deleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + brandId));

        // TODO: Cần kiểm tra xem Brand này có đang được sử dụng bởi Product nào không
        // Nếu có, nên cấm xóa hoặc gán sản phẩm sang "No Brand"

        brandRepository.delete(brand);
    }
}