package com.example.fashion.dto;

import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserResponseDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private Set<String> roles; // Trả về tên các vai trò
    private String status;
    private boolean emailVerified;
    private LocalDateTime createdAt;

    /**
     * Phương thức chuyển đổi (Converter)
     * Chuyển từ Entity (User) sang DTO (UserResponseDTO)
     */
    public static UserResponseDTO fromUser(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setCreatedAt(user.getCreatedAt());

        // Chuyển Set<Role> (Enum) thành Set<String>
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::name)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}