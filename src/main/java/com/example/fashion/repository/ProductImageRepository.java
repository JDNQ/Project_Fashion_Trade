package com.example.fashion.repository;

import com.example.fashion.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    // Kế thừa JpaRepository đã cung cấp đủ các phương thức
    // cơ bản (save, findById, findAll, delete)
    // Chúng ta có thể thêm các phương thức tùy chỉnh sau nếu cần
}