package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Lấy toàn bộ danh sách thiết bị và số lượng tồn kho
    public List<Product> getInventoryList() {
        return productRepository.findAll();
    }

    // Cập nhật số lượng tồn kho của một thiết bị
    public Product updateProductStock(String productId, Integer newStock) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setStockQuantity(newStock);
            if (newStock > 0 && "OUT_OF_STOCK".equalsIgnoreCase(product.getStatus())) {
                product.setStatus("AVAILABLE");
            } else if (newStock <= 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            return productRepository.save(product);
        }
        throw new RuntimeException("Không tìm thấy sản phẩm với mã: " + productId);
    }
}
