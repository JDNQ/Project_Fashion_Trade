package com.example.fashion.service;

import com.example.fashion.dto.OrderResponseDTO;
import com.example.fashion.dto.UpdateOrderStatusRequestDTO;
import com.example.fashion.entity.Order;
import com.example.fashion.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Lấy danh sách đơn hàng (có phân trang) cho Admin
     * (Chúng ta sẽ thêm Filter/Specification sau nếu cần)
     */
    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);

        // Chuyển đổi Page<Order> sang Page<OrderResponseDTO>
        return orderPage.map(OrderResponseDTO::fromOrder);
    }

    /**
     * Lấy chi tiết một đơn hàng
     */
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // Cần đảm bảo các lazy-loading (như User, Items) được tải
        // (Trong trường hợp này, việc convert sang DTO sẽ kích hoạt chúng)
        return OrderResponseDTO.fromOrder(order);
    }

    /**
     * Cập nhật trạng thái đơn hàng (Mục 4.5)
     */
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequestDTO request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // Cập nhật các trường nếu chúng được cung cấp trong request
        if (request.getOrderStatus() != null && !request.getOrderStatus().isEmpty()) {
            order.setOrderStatus(request.getOrderStatus());
            // TODO: Thêm logic nghiệp vụ (ví dụ: nếu chuyển sang "Shipped", trừ kho)
        }

        if (request.getPayStatus() != null && !request.getPayStatus().isEmpty()) {
            order.setPayStatus(request.getPayStatus());
            // TODO: Thêm logic (ví dụ: nếu "Paid", gửi email xác nhận)
        }

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isEmpty()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        Order updatedOrder = orderRepository.save(order);
        return OrderResponseDTO.fromOrder(updatedOrder);
    }
}