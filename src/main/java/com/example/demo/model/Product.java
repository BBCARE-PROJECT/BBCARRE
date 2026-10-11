package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id; // vd: 'p_oxy_5l'

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", length = 50, nullable = false)
    private String category; // 'RENTAL', 'SALE', 'SUPPLEMENT'

    @Column(name = "buy_price")
    private Double buyPrice;

    @Column(name = "rent_price_per_day")
    private Double rentPricePerDay;

    @Column(name = "deposit_price")
    private Double depositPrice;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "status", length = 50, nullable = false)
    private String status; // 'AVAILABLE', 'OUT_OF_STOCK'

    public Product() {
    }

    public Product(String id, String name, String category, Double buyPrice, Double rentPricePerDay,
                   Double depositPrice, String imageUrl, Integer stockQuantity, String status) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.buyPrice = buyPrice;
        this.rentPricePerDay = rentPricePerDay;
        this.depositPrice = depositPrice;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(Double buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Double getRentPricePerDay() {
        return rentPricePerDay;
    }

    public void setRentPricePerDay(Double rentPricePerDay) {
        this.rentPricePerDay = rentPricePerDay;
    }

    public Double getDepositPrice() {
        return depositPrice;
    }

    public void setDepositPrice(Double depositPrice) {
        this.depositPrice = depositPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}