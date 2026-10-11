package com.example.demo.repository;

import com.example.demo.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Tìm theo mã ca (#BK-8821)
    Optional<Appointment> findByCode(String code);

    // Lấy tất cả ca của 1 điều dưỡng trong ngày cụ thể (Dùng cho cổng Điều Dưỡng xem lịch trực)
    List<Appointment> findByNurseIdAndAppointmentDate(String nurseId, String appointmentDate);

    // Lấy tất cả ca theo ngày cụ thể (Dùng cho Staff điều phối)
    List<Appointment> findByAppointmentDate(String appointmentDate);

    // Kiểm tra xem điều dưỡng đó đã bị trùng ca ở khung giờ và ngày đó hay chưa
    boolean existsByNurseIdAndAppointmentDateAndTimeSlot(String nurseId, String appointmentDate, String timeSlot);
}
