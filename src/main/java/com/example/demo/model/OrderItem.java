package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nhiều món hàng thuộc về một đơn hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Nhiều món hàng tham chiếu tới một sản phẩm
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity; // Số lượng đặt

    private Integer rentDays; // Số ngày thuê (null nếu là mua đứt)

    private Double price; // Đơn giá tại thời điểm đặt (giá mua hoặc giá thuê/ngày)

    private Double depositPrice; // Tiền cọc tương ứng của món đồ (nếu là thuê)

    public OrderItem() {
    }

    public OrderItem(Order order, Product product, Integer quantity, Integer rentDays, Double price, Double depositPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.rentDays = rentDays;
        this.price = price;
        this.depositPrice = depositPrice;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getRentDays() { return rentDays; }
    public void setRentDays(Integer rentDays) { this.rentDays = rentDays; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getDepositPrice() { return depositPrice; }
    public void setDepositPrice(Double depositPrice) { this.depositPrice = depositPrice; }
}
