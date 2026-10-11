package com.example.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "nurses")
public class Nurse {

    @Id
    @Column(length = 50)
    private String id; // Mã định danh: 'minh', 'mai', 'lan', 'quan', 'ha', 'thao', 'bao'

    @Column(nullable = false, length = 20)
    private String code; // Mã ĐD: 'DD01', 'DD02'...

    @Column(nullable = false, length = 100)
    private String fullName; // Họ và tên: ĐD. Nguyễn Văn Minh, BS. Lê Hoàng Quân

    @Column(length = 150)
    private String specialty; // Chuyên môn: Ngoại khoa & Vết thương mổ, Nhi khoa...

    @Column(length = 100)
    private String district; // Quận huyện phụ trách: Hải Châu & Thanh Khê...

    @Column(length = 20)
    private String phone; // Số điện thoại liên hệ

    @Column(length = 500)
    private String avatar; // Link URL hình ảnh đại diện (Unsplash hoặc /uploads/...)

    private Double ratingAvg; // Đánh giá sao trung bình (vd: 4.9, 5.0)

    private Integer reviewsCount; // Số lượt đánh giá từ khách hàng

    @Column(length = 30)
    private String status; // Trạng thái: 'ACTIVE' (đang làm việc), 'OFF' (nghỉ phép)

    @OneToMany(mappedBy = "nurse", cascade = CascadeType.ALL)
    private List<Appointment> AppoinmentList;

    public Nurse() {
    }

    public Nurse(String id, String code, String fullName, String specialty, String district, String phone, String avatar, Double ratingAvg, Integer reviewsCount, String status) {
        this.id = id;
        this.code = code;
        this.fullName = fullName;
        this.specialty = specialty;
        this.district = district;
        this.phone = phone;
        this.avatar = avatar;
        this.ratingAvg = ratingAvg;
        this.reviewsCount = reviewsCount;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Appointment> getAppoinmentList() {
        return AppoinmentList;
    }

    public void setAppoinmentList(List<Appointment> appoinmentList) {
        AppoinmentList = appoinmentList;
    }
}
