package com.example.fashion.repository;


import com.example.fashion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA sẽ tự động hiểu phương thức này
    // và tạo câu lệnh SQL "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);
}