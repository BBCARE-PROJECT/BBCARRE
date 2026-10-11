package com.example.demo.service;

import com.example.demo.model.Appointment;

import java.util.List;
import java.util.Optional;

/**
 * Interface nghiệp vụ quản lý ca hẹn & điều phối điều dưỡng tại nhà BBCare.
 */
public interface AppointmentService {

    // ==========================================
    // 1. CÁC HÀM TRUY VẤN DỮ LIỆU (READ)
    // ==========================================

    /**
     * Lấy toàn bộ danh sách ca hẹn trong hệ thống.
     */
    List<Appointment> getAllAppointments();

    /**
     * Tìm ca hẹn theo ID khóa chính.
     */
    Optional<Appointment> getAppointmentById(Long id);

    /**
     * Tìm ca hẹn theo ID, nếu không có ném ngoại lệ nghiệp vụ.
     */
    Appointment getAppointmentByIdOrThrow(Long id);

    /**
     * Tìm ca hẹn theo mã ca (vd: '#BK-8821').
     */
    Optional<Appointment> getAppointmentByCode(String code);

    /**
     * Lấy danh sách ca hẹn theo một ngày cụ thể (định dạng 'YYYY-MM-DD').
     */
    List<Appointment> getAppointmentsByDate(String date);

    /**
     * Lấy tất cả ca hẹn được phân công cho một Điều dưỡng.
     */
    List<Appointment> getAppointmentsByNurse(String nurseId);

    /**
     * Lấy ca hẹn của 1 Điều dưỡng trong 1 ngày cụ thể (Dành cho Nurse Portal xem lịch trực).
     */
    List<Appointment> getAppointmentsByNurseAndDate(String nurseId, String date);

    /**
     * Lấy lịch sử ca hẹn theo số điện thoại bệnh nhân (Dành cho Hồ sơ đặt ca EHR của khách).
     */
    List<Appointment> getAppointmentsByPatientPhone(String phone);

    /**
     * Lọc ca hẹn theo trạng thái ('pending', 'confirmed', 'completed', 'cancelled').
     */
    List<Appointment> getAppointmentsByStatus(String status);


    // ==========================================
    // 2. NGHIỆP VỤ KIỂM TRA TRÙNG LỊCH (CONFLICT CHECK)
    // ==========================================

    /**
     * Kiểm tra điều dưỡng đã có ca vào ngày và khung giờ đó hay chưa.
     */
    boolean isNurseBusy(String nurseId, String date, String timeSlot);

    /**
     * Kiểm tra điều dưỡng có bị trùng ca hay không (loại trừ chính ca đang được cập nhật).
     */
    boolean isNurseBusyExcludingAppointment(String nurseId, String date, String timeSlot, Long excludeAppointmentId);


    // ==========================================
    // 3. NGHIỆP VỤ THAO TÁC CA HẸN (WRITE)
    // ==========================================

    /**
     * Khách hàng đặt ca mới hoặc Staff tạo ca mới.
     * Tự động sinh mã ca, gán trạng thái 'pending', validate thông tin bắt buộc.
     */
    Appointment createAppointment(Appointment appointment);

    /**
     * Staff phân công / điều phối ca trực cho Điều dưỡng.
     * Kiểm tra trùng lịch, cập nhật trạng thái 'confirmed', lưu lý do điều phối.
     */
    Appointment assignOrUpdateAppointment(Long id, String nurseId, String newDate, String newSlot, String reason);

    /**
     * Điều dưỡng cập nhật chỉ số sinh hiệu (Huyết áp, SpO2, Nhịp tim, Nhật ký chăm sóc).
     * Dữ liệu đồng bộ sang Hồ sơ bệnh án điện tử EHR của khách.
     */
    Appointment updateVitals(Long id, String bloodPressure, String spo2, String heartRate, String nurseNotes);

    /**
     * Hoàn thành ca trực: Điều dưỡng cập nhật sinh hiệu và chuyển trạng thái ca sang 'completed'.
     */
    Appointment completeAppointment(Long id, String bloodPressure, String spo2, String heartRate, String nurseNotes);

    /**
     * Hủy ca hẹn (kèm lý do hủy), chuyển trạng thái sang 'cancelled'.
     */
    Appointment cancelAppointment(Long id, String reason);

    /**
     * Cập nhật trạng thái ca hẹn ('pending', 'confirmed', 'completed', 'cancelled').
     */
    Appointment updateStatus(Long id, String status);

    /**
     * Xóa ca hẹn khỏi cơ sở dữ liệu.
     */
    void deleteAppointment(Long id);
}
