package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StaffOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public StaffOrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Lấy toàn bộ danh sách đơn thuê và mua thiết bị
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Cập nhật trạng thái duyệt đơn xuất kho (DELIVERING hoặc ACTIVE_RENTING)
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> optOrder = orderRepository.findById(orderId);
        if (optOrder.isPresent()) {
            Order order = optOrder.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId);
    }

    // Quy trình Nghiệm thu trả thiết bị & Hoàn cọc
    @Transactional
    public Order processReturnDeposit(Long orderId, Double refundAmount, String conditionNote) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ID: " + orderId));

        // 1. Kiểm tra đơn thuê
        if (!"RENT".equalsIgnoreCase(order.getOrderType())) {
            throw new RuntimeException("Đơn hàng này không phải là đơn thuê máy, không thể hoàn cọc!");
        }

        // 2. Cập nhật tiền cọc thực hoàn và ghi chú tình trạng máy
        order.setStatus("COMPLETED");

        // 3. Tự động cộng lại số lượng máy vào kho (Product.stockQuantity += item.quantity)
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    Product prod = item.getProduct();
                    int currentStock = (prod.getStockQuantity() != null) ? prod.getStockQuantity() : 0;
                    int rentQty = (item.getQuantity() != null) ? item.getQuantity() : 1;
                    prod.setStockQuantity(currentStock + rentQty);
                    prod.setStatus("AVAILABLE");
                    productRepository.save(prod);
                }
            }
        }

        return orderRepository.save(order);
    }
}
