package com.example.demo.dto;

public class CartItemDTO {
    private String productId;
    private String actionType; // 'BUY' hoặc 'RENT'
    private Integer quantity;
    private Integer rentDays; // bắt buộc nếu là 'RENT'

    public CartItemDTO() {
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getRentDays() {
        return rentDays;
    }

    public void setRentDays(Integer rentDays) {
        this.rentDays = rentDays;
    }
}