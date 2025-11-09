package com.example.fashion.controller;

import com.example.fashion.dto.BrandRequestDTO;
import com.example.fashion.dto.BrandResponseDTO;
import com.example.fashion.service.BrandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/brands")
public class AdminBrandController {

    private final BrandService brandService;

    public AdminBrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    /**
     * API Tạo Brand
     */
    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody BrandRequestDTO request) {
        BrandResponseDTO brand = brandService.createBrand(request);
        return new ResponseEntity<>(brand, HttpStatus.CREATED);
    }

    /**
     * API Lấy tất cả Brand
     */
    @GetMapping
    public ResponseEntity<List<BrandResponseDTO>> getAllBrands() {
        List<BrandResponseDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    /**
     * API Cập nhật Brand
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Long id, @RequestBody BrandRequestDTO request) {
        try {
            BrandResponseDTO brand = brandService.updateBrand(id, request);
            return ResponseEntity.ok(brand);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * API Xóa Brand
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        try {
            brandService.deleteBrand(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable Long id) {
        try {
            BrandResponseDTO brand = brandService.getBrandById(id);
            return ResponseEntity.ok(brand);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}