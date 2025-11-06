package com.example.fashion.repository;


import com.example.fashion.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Tìm tất cả địa chỉ của một người dùng
    List<Address> findByUserId(Long userId);
}
