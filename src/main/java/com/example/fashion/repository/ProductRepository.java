package com.example.fashion.repository;


import com.example.fashion.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Chúng ta sẽ thêm các phương thức tìm kiếm/lọc phức tạp hơn sau
}