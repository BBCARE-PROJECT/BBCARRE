package com.example.demo.repository;

import com.example.demo.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // 1. Tìm theo mã ca (#BK-8821, #APT-1001)
    Optional<Appointment> findByCode(String code);

    // Kiểm tra mã ca đã tồn tại chưa (dùng khi sinh mã tự động)
    boolean existsByCode(String code);

    // 2. Tra cứu theo SĐT bệnh nhân (Dùng cho khách hàng xem lịch sử đặt ca & Sổ EHR)
    List<Appointment> findByPatientPhone(String patientPhone);

    List<Appointment> findByPatientPhoneOrderByAppointmentDateDesc(String patientPhone);

    // 3. Lấy tất cả ca theo ngày cụ thể (Dùng cho Staff điều phối ca trực)
    List<Appointment> findByAppointmentDate(String appointmentDate);

    List<Appointment> findByAppointmentDateOrderByTimeSlotAsc(String appointmentDate);

    // 4. Lấy tất cả ca theo điều dưỡng
    List<Appointment> findByNurseId(String nurseId);

    // Lấy ca của 1 điều dưỡng trong ngày cụ thể (Dành cho Nurse Portal xem lịch trực hôm nay)
    List<Appointment> findByNurseIdAndAppointmentDate(String nurseId, String appointmentDate);

    List<Appointment> findByNurseIdAndAppointmentDateOrderByTimeSlotAsc(String nurseId, String appointmentDate);

    // 5. Lọc ca theo trạng thái (pending, confirmed, completed, cancelled)
    List<Appointment> findByStatus(String status);

    List<Appointment> findByStatusIgnoreCase(String status);

    List<Appointment> findByAppointmentDateAndStatusIgnoreCase(String appointmentDate, String status);

    // 6. Kiểm tra trùng ca cơ bản
    boolean existsByNurseIdAndAppointmentDateAndTimeSlot(String nurseId, String appointmentDate, String timeSlot);

    // Kiểm tra trùng ca khi cập nhật (loại trừ chính ca đang cập nhật)
    boolean existsByNurseIdAndAppointmentDateAndTimeSlotAndIdNot(String nurseId, String appointmentDate, String timeSlot, Long id);

    // 7. Kiểm tra trùng ca nghiệp vụ nâng cao (Bỏ qua các ca đã hủy 'cancelled')
    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
           "WHERE a.nurse.id = :nurseId " +
           "AND a.appointmentDate = :appointmentDate " +
           "AND a.timeSlot = :timeSlot " +
           "AND LOWER(a.status) != 'cancelled'")
    boolean isNurseBusy(@Param("nurseId") String nurseId,
                        @Param("appointmentDate") String appointmentDate,
                        @Param("timeSlot") String timeSlot);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
           "WHERE a.nurse.id = :nurseId " +
           "AND a.appointmentDate = :appointmentDate " +
           "AND a.timeSlot = :timeSlot " +
           "AND a.id != :excludeId " +
           "AND LOWER(a.status) != 'cancelled'")
    boolean isNurseBusyExcludingAppointment(@Param("nurseId") String nurseId,
                                            @Param("appointmentDate") String appointmentDate,
                                            @Param("timeSlot") String timeSlot,
                                            @Param("excludeId") Long excludeId);
}
