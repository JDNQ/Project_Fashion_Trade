package com.example.fashion.controller;

// ===============================================
// ĐẢM BẢO BẠN CÓ ĐẦY ĐỦ CÁC DÒNG IMPORT NÀY
// ===============================================
import com.example.fashion.dto.ProductCreateRequestDTO;
import com.example.fashion.dto.ProductResponseDTO;
import com.example.fashion.dto.ProductUpdateRequestDTO;
import com.example.fashion.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/products") // <-- Đảm bảo đường dẫn này chính xác
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * API Tạo sản phẩm mới (CREATE)
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateRequestDTO request) {
        try {
            ProductResponseDTO createdProduct = productService.createProduct(request);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API Lấy danh sách sản phẩm (READ - LIST)
     * (Đây là API đang bị lỗi 404)
     */
    @GetMapping // <-- Đảm bảo bạn có @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        // Xử lý tham số sort
        Sort.Direction direction = sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        Page<ProductResponseDTO> productPage = productService.getAllProducts(pageable);
        return ResponseEntity.ok(productPage);
    }

    /**
     * API Lấy chi tiết một sản phẩm (READ - ONE)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductResponseDTO product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * API Cập nhật sản phẩm (UPDATE)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequestDTO request) {
        try {
            ProductResponseDTO updatedProduct = productService.updateProduct(id, request);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API Xóa (Lưu trữ) sản phẩm (DELETE)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}