package com.example.demo.service;

import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.OrderDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ClientStoreService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ClientStoreService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Lấy toàn bộ danh sách sản phẩm hiển thị trên Cửa hàng
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Tạo đơn hàng: tính tiền mua/thuê, tính tiền cọc, trừ tồn kho và lưu PENDING
     */
    @Transactional
    public Order createOrder(OrderDTO dto) {
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng không có sản phẩm nào!");
        }
        if (dto.getCustomerName() == null || dto.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ tên khách hàng không được để trống!");
        }
        if (dto.getCustomerPhone() == null || dto.getCustomerPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Số điện thoại không được để trống!");
        }
        if (dto.getAddress() == null || dto.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Địa chỉ giao hàng không được để trống!");
        }

        Order order = new Order();
        // Sinh mã đơn ngẫu nhiên theo format #ORD + 6 chữ số
        order.setOrderCode("#ORD" + (100000 + new Random().nextInt(900000)));
        order.setCustomerName(dto.getCustomerName().trim());
        order.setCustomerPhone(dto.getCustomerPhone().trim());
        order.setAddress(dto.getAddress().trim());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        double totalAmount = 0.0;
        double totalDeposit = 0.0;
        boolean hasRent = false;
        boolean hasBuy = false;

        for (CartItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm có ID: " + itemDto.getProductId()));

            int qty = (itemDto.getQuantity() != null && itemDto.getQuantity() > 0) ? itemDto.getQuantity() : 1;

            // Kiểm tra tồn kho
            if (product.getStockQuantity() < qty) {
                throw new IllegalStateException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho (còn " + product.getStockQuantity() + ")!");
            }

            // Trừ tồn kho tạm thời
            product.setStockQuantity(product.getStockQuantity() - qty);
            if (product.getStockQuantity() == 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(qty);

            if ("RENT".equalsIgnoreCase(itemDto.getActionType())) {
                hasRent = true;
                int rentDays = (itemDto.getRentDays() != null && itemDto.getRentDays() > 0) ? itemDto.getRentDays() : 1;
                orderItem.setRentDays(rentDays);

                double rentPrice = (product.getRentPricePerDay() != null) ? product.getRentPricePerDay() : 0.0;
                double depositPrice = (product.getDepositPrice() != null) ? product.getDepositPrice() : 0.0;

                orderItem.setPrice(rentPrice);
                orderItem.setDepositPrice(depositPrice);

                totalAmount += (rentPrice * rentDays * qty);
                totalDeposit += (depositPrice * qty);
            } else {
                hasBuy = true;
                orderItem.setRentDays(null);

                double buyPrice = (product.getBuyPrice() != null) ? product.getBuyPrice() : 0.0;
                orderItem.setPrice(buyPrice);
                orderItem.setDepositPrice(0.0);

                totalAmount += (buyPrice * qty);
            }

            order.addItem(orderItem);
        }

        // Xác định loại đơn
        if (hasRent && hasBuy) {
            order.setOrderType("MIXED");
        } else if (hasRent) {
            order.setOrderType("RENT");
        } else {
            order.setOrderType("BUY");
        }

        order.setTotalAmount(totalAmount);
        order.setDepositAmount(totalDeposit);

        return orderRepository.save(order);
    }
}