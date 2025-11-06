package com.example.fashion.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "carts")
@Getter
@Setter
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Có thể null nếu là giỏ hàng của khách (guest)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    // Dùng để theo dõi giỏ hàng của khách (chưa đăng nhập)
    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Mối quan hệ: Một Giỏ hàng có nhiều Mục hàng
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> items;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
