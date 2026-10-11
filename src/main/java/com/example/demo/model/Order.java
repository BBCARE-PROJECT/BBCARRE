package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính tự tăng

    @Column(nullable = false, length = 30)
    private String orderCode; // Mã đơn hàng: '#ORD-2001', '#ORD-2002'...

    @Column(nullable = false, length = 100)
    private String customerName; // Họ tên người đặt / người bệnh

    @Column(nullable = false, length = 20)
    private String customerPhone; // SĐT người nhận hàng

    @Column(length = 255)
    private String address; // Địa chỉ nhận thiết bị / giao hàng

    @Column(nullable = false, length = 20)
    private String orderType; // Loại đơn: 'BUY' (Mua đứt), 'RENT' (Thuê máy móc thiết bị)

    private Double totalAmount; // Tổng giá trị đơn hàng (Tiền mua hoặc Tiền thuê + Tiền cọc)

    private Double depositAmount; // Tiền đặt cọc thiết bị (dành riêng cho đơn thuê, dùng để hoàn cọc)

    private Double refundAmount; // Số tiền cọc thực tế hoàn trả sau khi Staff nghiệm thu máy

    @Column(nullable = false, length = 30)
    private String status; // 'PENDING' (Chờ duyệt), 'DELIVERING' (Đang giao), 'ACTIVE_RENTING' (Đang thuê), 'COMPLETED' (Hoàn tất/Đã trả cọc)

    @Column(length = 500)
    private String note; // Ghi chú của khách hoặc đánh giá tình trạng máy lúc trả cọc

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {
    }

    public Order(String orderCode, String customerName, String customerPhone, String address, String orderType, Double totalAmount, Double depositAmount, String status) {
        this.orderCode = orderCode;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.address = address;
        this.orderType = orderType;
        this.totalAmount = totalAmount;
        this.depositAmount = depositAmount;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
