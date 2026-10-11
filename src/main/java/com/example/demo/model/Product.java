package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 50)
    private String id; // Mã sản phẩm: 'p_oxy_machine', 'p_wheelchair', 'p_cpap'...

    @Column(nullable = false, length = 150)
    private String name; // Tên: Máy Tạo Oxy (5L / 10L), Xe Lăn Y Tế Đa Năng...

    @Column(length = 50)
    private String category; // Phân loại: 'RENTAL' (Cho thuê), 'SALE' (Bán đứt), 'SUPPLEMENT' (Thuốc & TPCN)

    private Double buyPrice; // Giá bán mua đứt (vd: 12.500.000đ)

    private Double rentPrice; // Giá thuê theo ngày/tháng (vd: 350.000đ/ngày)

    private Double depositPrice; // Tiền đặt cọc bảo chứng khi thuê (vd: 3.000.000đ)

    @Column(length = 500)
    private String imageUrl; // Link ảnh sản phẩm (Unsplash online hoặc /uploads/...)

    private Integer stockQuantity; // Số lượng máy móc/sản phẩm còn trong kho

    @Column(length = 30)
    private String status; // 'AVAILABLE' (Còn hàng), 'OUT_OF_STOCK' (Hết hàng)

    @Column(length = 500)
    private String description; // Mô tả vắn tắt tính năng y tế của thiết bị

    public Product() {
    }

    public Product(String id, String name, String category, Double buyPrice, Double rentPrice, Double depositPrice, String imageUrl, Integer stockQuantity, String status) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.buyPrice = buyPrice;
        this.rentPrice = rentPrice;
        this.depositPrice = depositPrice;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getBuyPrice() { return buyPrice; }
    public void setBuyPrice(Double buyPrice) { this.buyPrice = buyPrice; }

    public Double getRentPrice() { return rentPrice; }
    public void setRentPrice(Double rentPrice) { this.rentPrice = rentPrice; }

    public Double getDepositPrice() { return depositPrice; }
    public void setDepositPrice(Double depositPrice) { this.depositPrice = depositPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
