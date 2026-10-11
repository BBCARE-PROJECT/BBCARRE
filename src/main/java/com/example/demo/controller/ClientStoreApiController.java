package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.OrderDTO;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.service.ClientStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Hỗ trợ dev call API nếu khác origin
public class ClientStoreApiController {

    private final ClientStoreService clientStoreService;

    public ClientStoreApiController(ClientStoreService clientStoreService) {
        this.clientStoreService = clientStoreService;
    }

    /**
     * GET /api/products
     * Trả về danh sách sản phẩm kèm link ảnh và 2 mức giá thuê/bán
     */
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = clientStoreService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm thành công", products));
    }

    /**
     * POST /api/orders/checkout
     * Nhận giỏ hàng và thông tin khách hàng để tạo đơn hàng PENDING
     */
    @PostMapping("/orders/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(@RequestBody OrderDTO orderDTO) {
        try {
            Order savedOrder = clientStoreService.createOrder(orderDTO);
            return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công! Mã đơn: " + savedOrder.getOrderCode(), savedOrder));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi hệ thống khi xử lý đơn hàng: " + e.getMessage()));
        }
    }
}