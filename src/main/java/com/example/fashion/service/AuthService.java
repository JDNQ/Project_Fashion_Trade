package com.example.fashion.service;

import com.example.fashion.dto.CustomerRegisterRequestDTO; // <-- 1. Import mới
import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.RegisterAdminRequest;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Logic đăng nhập
     */
    public String loginUser(LoginRequest loginRequest) {
        // ... (Giữ nguyên code)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }


    // ========== 2. THÊM HÀM MỚI ==========
    /**
     * Logic đăng ký cho Khách hàng (Customer)
     */
    public User registerCustomer(CustomerRegisterRequestDTO request) {
        // 1. Kiểm tra email tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // 2. Tạo User mới
        User customer = new User();
        customer.setEmail(request.getEmail());
        customer.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());

        // 3. Gán vai trò CUSTOMER
        customer.setRoles(Set.of(Role.CUSTOMER));

        customer.setStatus("active");

        // Yêu cầu 3.1: Cần xác thực email (chúng ta tạm thời bỏ qua bước gửi mail)
        customer.setEmailVerified(false); // (Tạm thời đặt là false, khi nào làm
        // chức năng xác thực mail thì đổi)

        // 4. Lưu vào DB
        return userRepository.save(customer);
    }
    // ===================================


    /**
     * Logic đăng ký tài khoản SUPER_ADMIN
     */
    public User registerSuperAdmin(RegisterAdminRequest request) {
        // ... (Giữ nguyên code)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        User adminUser = new User();
        adminUser.setEmail(request.getEmail());
        adminUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        adminUser.setFullName(request.getFullName());
        adminUser.setRoles(Set.of(Role.SUPER_ADMIN));
        adminUser.setStatus("active");
        adminUser.setEmailVerified(true);
        return userRepository.save(adminUser);
    }
}