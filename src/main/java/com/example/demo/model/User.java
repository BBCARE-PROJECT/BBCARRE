package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity User đại diện cho bảng users trong cơ sở dữ liệu.
 * Phục vụ: Đăng ký, đăng nhập, phân quyền, gửi Gmail OTP xác thực.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính (Long, Identity)

    @Column(nullable = false, unique = true, length = 100)
    private String email; // Email người dùng (Unique, dùng để đăng nhập)

    @Column(nullable = false, length = 255)
    private String password; // Mật khẩu đã mã hóa (BCrypt)

    @Column(nullable = false, length = 100)
    private String fullName; // Họ và tên

    @Column(length = 20)
    private String phone; // Số điện thoại (10 chữ số)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // Phân quyền (CUSTOMER, STAFF, NURSE, ADMIN)

    @Column(nullable = false)
    private Boolean isVerified = false; // Trạng thái kích hoạt (true/false)

    @Column(length = 6)
    private String otpCode; // Mã OTP 6 số gửi qua Gmail

    private LocalDateTime otpExpiry; // Thời hạn mã OTP

    public User() {
    }

    public User(String email, String password, String fullName, String phone, Role role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.isVerified = false;
    }

    public User(Long id, String email, String password, String fullName, String phone, Role role, Boolean isVerified, String otpCode, LocalDateTime otpExpiry) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.isVerified = isVerified;
        this.otpCode = otpCode;
        this.otpExpiry = otpExpiry;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public boolean isVerified() {
        return Boolean.TRUE.equals(isVerified);
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public void setVerified(boolean verified) {
        this.isVerified = verified;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    /**
     * Kiểm tra mã OTP đã hết hạn hay chưa
     */
    public boolean isOtpExpired() {
        return otpExpiry == null || LocalDateTime.now().isAfter(otpExpiry);
    }

    /**
     * Kiểm tra mã OTP nhập vào có khớp và còn hiệu lực không
     */
    public boolean isValidOtp(String inputOtp) {
        if (inputOtp == null || this.otpCode == null) {
            return false;
        }
        return this.otpCode.equals(inputOtp.trim()) && !isOtpExpired();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phone='" + phone + '\'' +
                ", role=" + role +
                ", isVerified=" + isVerified +
                ", otpExpiry=" + otpExpiry +
                '}';
    }
}
