package com.example.fashion.controller;


import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.LoginResponse;
import com.example.fashion.dto.RegisterAdminRequest;
import com.example.fashion.entity.User;
import com.example.fashion.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException; // <-- Import mới
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth") // Tiền tố chung
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * API để Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Gọi service để xác thực và tạo token
            String jwt = authService.loginUser(loginRequest);

            // 2. Trả về token cho client
            return ResponseEntity.ok(new LoginResponse(jwt));

        } catch (AuthenticationException e) {
            // 3. Bắt lỗi nếu sai email hoặc mật khẩu
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu");
        }
    }


    /**
     * API để đăng ký tài khoản SUPER_ADMIN
     */
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerSuperAdmin(@RequestBody RegisterAdminRequest request) {
        try {
            User adminUser = authService.registerSuperAdmin(request);
            return ResponseEntity.ok("Tạo SUPER_ADMIN thành công cho: " + adminUser.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}