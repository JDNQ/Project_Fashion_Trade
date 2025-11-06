package com.example.fashion.repository;


import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Tìm đơn hàng theo mã đơn
    Optional<Order> findByOrderNo(String orderNo);

    // Tìm tất cả đơn hàng của một người dùng
    List<Order> findByUserId(Long userId);
}