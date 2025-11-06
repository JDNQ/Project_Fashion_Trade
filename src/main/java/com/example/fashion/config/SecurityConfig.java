package com.example.fashion.config;



import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // <-- Import mới
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- Import mới

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter; // <-- Tiêm Filter

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean 2: Cần thiết cho API Đăng nhập
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Bean 3: Chuỗi lọc bảo mật (CẬP NHẬT LỚN)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF
                .csrf(csrf -> csrf.disable())

                // 2. Chuyển sang STATELESS (Không dùng Session)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. Phân quyền truy cập (Authorization)
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập API Đăng nhập/Đăng ký
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Phân quyền cho Admin
                        .requestMatchers("/api/v1/admin/products/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/orders/**").hasAnyAuthority("ORDER_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/users/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasAuthority("SUPER_ADMIN")

                        // Tất cả các request khác đều yêu cầu phải xác thực
                        .anyRequest().authenticated()
                )

                // 4. Cấu hình UserDetailsService
                .userDetailsService(customUserDetailsService)

                // 5. Xóa httpBasic() và thêm JwtAuthenticationFilter
                // Bộ lọc này sẽ chạy TRƯỚC bộ lọc UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}