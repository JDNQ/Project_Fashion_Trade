package com.example.fashion.config;

import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- Import dòng này
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 1. Kích hoạt cấu hình CORS (để nó đọc WebConfig.java)
                .cors(cors -> cors.configure(http))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Phân quyền truy cập
                .authorizeHttpRequests(auth -> auth

                        // 2. Cho phép TẤT CẢ các yêu cầu OPTIONS (để fix lỗi CORS 403)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 3. Các quy tắc chuẩn
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/admin/products/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/categories/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/brands/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")

                        // 4. Đây là dòng gây lỗi 403
                        .requestMatchers("/api/v1/admin/orders/**").hasAnyAuthority("ORDER_MANAGER", "SUPER_ADMIN")

                        .requestMatchers("/api/v1/admin/users/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasAnyAuthority("PRODUCT_MANAGER", "ORDER_MANAGER", "SUPER_ADMIN")

                        .anyRequest().authenticated()
                )

                .userDetailsService(customUserDetailsService)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}