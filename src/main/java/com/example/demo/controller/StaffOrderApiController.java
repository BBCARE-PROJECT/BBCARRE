package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.service.StaffOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/orders")
@CrossOrigin(origins = "*")
public class StaffOrderApiController {

    private final StaffOrderService staffOrderService;

    public StaffOrderApiController(StaffOrderService staffOrderService) {
        this.staffOrderService = staffOrderService;
    }

    // Lấy danh sách đơn hàng mua / thuê cho Staff
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(staffOrderService.getAllOrders());
    }

    // Cập nhật trạng thái duyệt đơn (DELIVERING, ACTIVE_RENTING...)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable("id") Long orderId,
                                               @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Order order = staffOrderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(order);
    }

    // Nghiệm thu thiết bị trả & hoàn cọc
    @PostMapping("/{id}/return-deposit")
    public ResponseEntity<?> processReturnDeposit(@PathVariable("id") Long orderId,
                                                  @RequestBody Map<String, Object> payload) {
        Double refundAmount = Double.valueOf(payload.getOrDefault("refundAmount", 0).toString());
        String conditionNote = (String) payload.getOrDefault("conditionNote", "Máy nguyên vẹn");

        Order completedOrder = staffOrderService.processReturnDeposit(orderId, refundAmount, conditionNote);
        return ResponseEntity.ok(Map.of(
                "message", "Nghiệm thu thành công! Tiền cọc đã hoàn và thiết bị đã tự động nhập kho.",
                "order", completedOrder
        ));
    }
}
