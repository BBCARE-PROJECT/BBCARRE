package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/inventory")
@CrossOrigin(origins = "*")
public class InventoryApiController {

    private final InventoryService inventoryService;

    public InventoryApiController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Lấy toàn bộ danh sách kho
    @GetMapping
    public ResponseEntity<List<Product>> getInventory() {
        return ResponseEntity.ok(inventoryService.getInventoryList());
    }

    // Cập nhật số lượng tồn kho
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(@PathVariable("id") String productId,
                                         @RequestBody Map<String, Integer> payload) {
        Integer newStock = payload.get("stockQuantity");
        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body("Số lượng tồn kho không hợp lệ!");
        }
        Product updated = inventoryService.updateProductStock(productId, newStock);
        return ResponseEntity.ok(updated);
    }
}
