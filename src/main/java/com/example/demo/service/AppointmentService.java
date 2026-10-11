package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.Nurse;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NurseRepository nurseRepository;

    // Lấy tất cả lịch hẹn
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Lấy lịch hẹn theo ngày
    public List<Appointment> getAppointmentsByDate(String date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    // Lấy lịch hẹn theo Điều dưỡng và Ngày (Dành cho Nurse Portal)
    public List<Appointment> getAppointmentsByNurseAndDate(String nurseId, String date) {
        return appointmentRepository.findByNurseIdAndAppointmentDate(nurseId, date);
    }

    // Kiểm tra trùng ca
    public boolean isNurseBusy(String nurseId, String date, String timeSlot) {
        return appointmentRepository.existsByNurseIdAndAppointmentDateAndTimeSlot(nurseId, date, timeSlot);
    }

    // Phân công / Điều phối ca hẹn cho Điều dưỡng
    public Appointment assignOrUpdateAppointment(Long id, String nurseId, String newDate, String newSlot, String reason) {
        Optional<Appointment> optApt = appointmentRepository.findById(id);
        if (optApt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy ca hẹn với ID: " + id);
        }

        Appointment apt = optApt.get();

        // Kiểm tra xem điều dưỡng mới có bị trùng ca ở khung giờ đó không
        if (nurseId != null && !nurseId.isEmpty() && !nurseId.equals("none")) {
            boolean busy = appointmentRepository.existsByNurseIdAndAppointmentDateAndTimeSlot(nurseId, newDate, newSlot);
            // Nếu trùng ca khác (không phải chính ca này)
            if (busy && (!newSlot.equals(apt.getTimeSlot()) || !newDate.equals(apt.getAppointmentDate()) || apt.getNurse() == null || !nurseId.equals(apt.getNurse().getId()))) {
                throw new RuntimeException("Điều dưỡng đã có ca trực vào khung giờ này!");
            }

            Optional<Nurse> optNurse = nurseRepository.findById(nurseId);
            optNurse.ifPresent(apt::setNurse);
        }

        apt.setAppointmentDate(newDate);
        apt.setTimeSlot(newSlot);
        if (reason != null && !reason.trim().isEmpty()) {
            apt.setReason(reason);
        }
        apt.setStatus("confirmed");

        return appointmentRepository.save(apt);
    }
}
