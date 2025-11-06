package com.example.fashion.repository;


import com.example.fashion.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Tạm thời chưa cần phương thức tùy chỉnh
}
