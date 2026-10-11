package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính tự tăng

    @Column(nullable = false, length = 30)
    private String code; // Mã ca: '#BK-8821', '#BK-8819'...

    @Column(nullable = false, length = 100)
    private String patientName; // Tên bệnh nhân: Ông Vũ Đình Phúc (80 tuổi)

    @Column(length = 20)
    private String patientPhone; // SĐT bệnh nhân

    @Column(length = 255)
    private String patientAddress; // Địa chỉ nhà bệnh nhân

    @Column(length = 150)
    private String serviceName; // Tên gói dịch vụ: Chăm sóc vết mổ, Phục hồi chức năng...

    // 👉 KHÓA NGOẠI: Nhiều ca hẹn thuộc về một Điều dưỡng
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nurse_id")
    private Nurse nurse;

    @Column(nullable = false, length = 20)
    private String appointmentDate; // Ngày hẹn: '2026-10-11'

    @Column(nullable = false, length = 50)
    private String timeSlot; // Khung giờ: '08:00 - 10:30 (Sáng)', '14:00 - 16:30 (Chiều)'

    @Column(nullable = false, length = 30)
    private String status; // Trạng thái: 'pending', 'confirmed', 'completed', 'cancelled'

    @Column(length = 500)
    private String reason; // Ghi chú đặt ca / Lý do điều phối

    private Double price; // Giá tiền ca khám

    // 📋 CÁC TRƯỜNG KẾT QUẢ KHÁM (Dành cho Điều Dưỡng cập nhật & Đồng bộ sang HỒ SƠ ĐẶT CA EHR)
    @Column(length = 50)
    private String bloodPressure; // Huyết áp: vd '120/80 mmHg'

    @Column(length = 30)
    private String spo2; // Nồng độ oxy trong máu: vd '98%'

    @Column(length = 30)
    private String heartRate; // Nhịp tim: vd '78 bpm'

    @Column(length = 500)
    private String nurseNotes; // Nhật ký chăm sóc / Lời dặn của điều dưỡng

    public Appointment() {
    }

    public Appointment(String code, String patientName, String patientPhone, String patientAddress, String serviceName, Nurse nurse, String appointmentDate, String timeSlot, String status, String reason, Double price) {
        this.code = code;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.patientAddress = patientAddress;
        this.serviceName = serviceName;
        this.nurse = nurse;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.reason = reason;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getPatientAddress() { return patientAddress; }
    public void setPatientAddress(String patientAddress) { this.patientAddress = patientAddress; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public Nurse getNurse() { return nurse; }
    public void setNurse(Nurse nurse) { this.nurse = nurse; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getSpo2() { return spo2; }
    public void setSpo2(String spo2) { this.spo2 = spo2; }

    public String getHeartRate() { return heartRate; }
    public void setHeartRate(String heartRate) { this.heartRate = heartRate; }

    public String getNurseNotes() { return nurseNotes; }
    public void setNurseNotes(String nurseNotes) { this.nurseNotes = nurseNotes; }
}
