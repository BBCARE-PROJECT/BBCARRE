package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentApiController {

    @Autowired
    private AppointmentService appointmentService;

    // Lấy toàn bộ danh sách lịch hẹn
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Lấy chi tiết lịch hẹn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> aptOpt = appointmentService.getAppointmentById(id);
        if (aptOpt.isPresent()) {
            return ResponseEntity.ok(aptOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy ca hẹn với ID: " + id
        ));
    }

    // Lấy lịch hẹn theo ngày
    @GetMapping("/by-date")
    public List<Appointment> getAppointmentsByDate(@RequestParam String date) {
        return appointmentService.getAppointmentsByDate(date);
    }

    // Lấy ca trực của 1 điều dưỡng theo ngày
    @GetMapping("/by-nurse")
    public List<Appointment> getAppointmentsByNurse(
            @RequestParam String nurseId,
            @RequestParam String date) {
        return appointmentService.getAppointmentsByNurseAndDate(nurseId, date);
    }

    // API Phân công / Điều phối ca hẹn (Được gọi khi bấm "Xác Nhận & Đồng Bộ Lịch" trên staff.html)
    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String nurseId = payload.get("nurseId");
            String newDate = payload.get("newDate");
            String newSlot = payload.get("newSlot");
            String reason = payload.get("reason");

            Appointment updated = appointmentService.assignOrUpdateAppointment(id, nurseId, newDate, newSlot, reason);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Đã phân công và đồng bộ ca trực thành công!",
                    "appointment", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}
