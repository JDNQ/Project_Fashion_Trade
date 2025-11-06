package com.example.fashion.service;



import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.RegisterAdminRequest;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager; // <-- Import mới
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // <-- Import mới
import org.springframework.security.core.Authentication; // <-- Import mới
import org.springframework.security.core.context.SecurityContextHolder; // <-- Import mới
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager; // <-- Thêm mới
    private final JwtTokenProvider jwtTokenProvider; // <-- Thêm mới

    // Cập nhật constructor
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, // <-- Thêm mới
                       JwtTokenProvider jwtTokenProvider) { // <-- Thêm mới
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager; // <-- Thêm mới
        this.jwtTokenProvider = jwtTokenProvider; // <-- Thêm mới
    }

    /**
     * Logic đăng nhập
     * Trả về JWT nếu thành công
     */
    public String loginUser(LoginRequest loginRequest) {
        // 1. Tạo đối tượng xác thực
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // 2. Nếu xác thực thành công, thiết lập cho SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Tạo JWT và trả về
        return jwtTokenProvider.generateToken(authentication);
    }


    /**
     * Logic đăng ký tài khoản SUPER_ADMIN
     */
    public User registerSuperAdmin(RegisterAdminRequest request) {

        // 1. Kiểm tra xem email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // 2. Tạo đối tượng User mới
        User adminUser = new User();
        adminUser.setEmail(request.getEmail());

        // 3. Mã hóa mật khẩu
        adminUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        adminUser.setFullName(request.getFullName());

        // 4. Gán vai trò SUPER_ADMIN
        adminUser.setRoles(Set.of(Role.SUPER_ADMIN));

        adminUser.setStatus("active");
        adminUser.setEmailVerified(true);

        // 5. Lưu vào cơ sở dữ liệu
        return userRepository.save(adminUser);
    }
}