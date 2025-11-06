package com.example.fashion.security;


import com.example.fashion.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. Lấy JWT từ request
            String jwt = getJwtFromRequest(request);

            // 2. Xác thực token
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                // 3. Lấy email (username) từ token
                String email = tokenProvider.getEmailFromJWT(jwt);

                // 4. Tải thông tin user (bao gồm cả roles)
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                // 5. Tạo đối tượng xác thực
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Thiết lập xác thực cho SecurityContext
                // (Báo cho Spring Security biết user này đã đăng nhập)
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Ghi log (ví dụ: logger.error("...", ex))
            System.out.println("Không thể thiết lập xác thực người dùng: " + ex.getMessage());
        }

        // 7. Chuyển request/response cho filter tiếp theo
        filterChain.doFilter(request, response);
    }

    /**
     * Tiện ích trích xuất Token từ "Authorization: Bearer <token>"
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Bỏ "Bearer "
        }
        return null;
    }
}