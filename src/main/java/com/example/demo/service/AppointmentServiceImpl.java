package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.Nurse;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional(readOnly = true)
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NurseRepository nurseRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, NurseRepository nurseRepository) {
        this.appointmentRepository = appointmentRepository;
        this.nurseRepository = nurseRepository;
    }

    // ==========================================
    // 1. CÁC HÀM TRUY VẤN DỮ LIỆU (READ)
    // ==========================================

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public Appointment getAppointmentByIdOrThrow(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ca hẹn với ID: " + id));
    }

    @Override
    public Optional<Appointment> getAppointmentByCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        return appointmentRepository.findByCode(code.trim());
    }

    @Override
    public List<Appointment> getAppointmentsByDate(String date) {
        if (date == null || date.isBlank()) {
            return appointmentRepository.findAll();
        }
        return appointmentRepository.findByAppointmentDateOrderByTimeSlotAsc(date.trim());
    }

    @Override
    public List<Appointment> getAppointmentsByNurse(String nurseId) {
        if (nurseId == null || nurseId.isBlank()) {
            return List.of();
        }
        return appointmentRepository.findByNurseId(nurseId.trim());
    }

    @Override
    public List<Appointment> getAppointmentsByNurseAndDate(String nurseId, String date) {
        if (nurseId == null || nurseId.isBlank()) {
            return List.of();
        }
        return appointmentRepository.findByNurseIdAndAppointmentDateOrderByTimeSlotAsc(nurseId.trim(), date != null ? date.trim() : "");
    }

    @Override
    public List<Appointment> getAppointmentsByPatientPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return List.of();
        }
        return appointmentRepository.findByPatientPhoneOrderByAppointmentDateDesc(phone.trim());
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return appointmentRepository.findAll();
        }
        return appointmentRepository.findByStatusIgnoreCase(status.trim());
    }

    // ==========================================
    // 2. KIỂM TRA TRÙNG LỊCH (CONFLICT CHECK)
    // ==========================================

    @Override
    public boolean isNurseBusy(String nurseId, String date, String timeSlot) {
        if (nurseId == null || nurseId.isBlank() || "none".equalsIgnoreCase(nurseId)) {
            return false;
        }
        return appointmentRepository.isNurseBusy(nurseId.trim(), date.trim(), timeSlot.trim());
    }

    @Override
    public boolean isNurseBusyExcludingAppointment(String nurseId, String date, String timeSlot, Long excludeAppointmentId) {
        if (nurseId == null || nurseId.isBlank() || "none".equalsIgnoreCase(nurseId)) {
            return false;
        }
        if (excludeAppointmentId == null) {
            return isNurseBusy(nurseId, date, timeSlot);
        }
        return appointmentRepository.isNurseBusyExcludingAppointment(nurseId.trim(), date.trim(), timeSlot.trim(), excludeAppointmentId);
    }

    // ==========================================
    // 3. THAO TÁC NGHIỆP VỤ (WRITE)
    // ==========================================

    @Override
    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        if (appointment == null) {
            throw new IllegalArgumentException("Thông tin ca hẹn không được để trống!");
        }
        if (appointment.getPatientName() == null || appointment.getPatientName().isBlank()) {
            throw new IllegalArgumentException("Tên bệnh nhân không được để trống!");
        }
        if (appointment.getAppointmentDate() == null || appointment.getAppointmentDate().isBlank()) {
            throw new IllegalArgumentException("Ngày hẹn không được để trống!");
        }
        if (appointment.getTimeSlot() == null || appointment.getTimeSlot().isBlank()) {
            throw new IllegalArgumentException("Khung giờ khám không được để trống!");
        }

        // Tự động sinh mã ca (#BK-XXXX) nếu chưa có
        if (appointment.getCode() == null || appointment.getCode().isBlank()) {
            appointment.setCode(generateUniqueAppointmentCode());
        }

        // Trạng thái mặc định ban đầu là pending
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("pending");
        }

        // Nếu có chỉ định điều dưỡng từ trước, kiểm tra trùng lịch
        if (appointment.getNurse() != null && appointment.getNurse().getId() != null) {
            String nurseId = appointment.getNurse().getId();
            Nurse nurse = nurseRepository.findById(nurseId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy điều dưỡng với mã: " + nurseId));
            appointment.setNurse(nurse);

            if (isNurseBusy(nurseId, appointment.getAppointmentDate(), appointment.getTimeSlot())) {
                throw new IllegalStateException("Điều dưỡng " + nurse.getFullName() + " đã có ca trực vào khung giờ này!");
            }
        }

        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public Appointment assignOrUpdateAppointment(Long id, String nurseId, String newDate, String newSlot, String reason) {
        Appointment apt = getAppointmentByIdOrThrow(id);

        // Không cho phép điều phối lại ca đã hoàn thành hoặc đã bị hủy
        if ("completed".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalStateException("Ca hẹn đã hoàn thành khám, không thể điều phối lại!");
        }
        if ("cancelled".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalStateException("Ca hẹn đã bị hủy, không thể điều phối!");
        }

        String targetDate = (newDate != null && !newDate.isBlank()) ? newDate.trim() : apt.getAppointmentDate();
        String targetSlot = (newSlot != null && !newSlot.isBlank()) ? newSlot.trim() : apt.getTimeSlot();

        // Xử lý gán Điều dưỡng
        if (nurseId != null && !nurseId.isBlank() && !"none".equalsIgnoreCase(nurseId)) {
            String cleanNurseId = nurseId.trim();
            Nurse nurse = nurseRepository.findById(cleanNurseId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy điều dưỡng với mã: " + cleanNurseId));

            // Kiểm tra trùng lịch của điều dưỡng tại ngày và khung giờ mới (loại trừ chính ca này)
            boolean busy = isNurseBusyExcludingAppointment(cleanNurseId, targetDate, targetSlot, id);
            if (busy) {
                throw new IllegalStateException("Điều dưỡng " + nurse.getFullName() + " đã có ca trực vào khung giờ này (" + targetSlot + ")!");
            }

            apt.setNurse(nurse);
            apt.setStatus("confirmed");
        } else {
            // Hủy phân công điều dưỡng -> Quay về trạng thái chờ
            apt.setNurse(null);
            apt.setStatus("pending");
        }

        apt.setAppointmentDate(targetDate);
        apt.setTimeSlot(targetSlot);

        if (reason != null && !reason.trim().isEmpty()) {
            apt.setReason(reason.trim());
        }

        return appointmentRepository.save(apt);
    }

    @Override
    @Transactional
    public Appointment updateVitals(Long id, String bloodPressure, String spo2, String heartRate, String nurseNotes) {
        Appointment apt = getAppointmentByIdOrThrow(id);

        if (bloodPressure != null && !bloodPressure.isBlank()) {
            apt.setBloodPressure(bloodPressure.trim());
        }
        if (spo2 != null && !spo2.isBlank()) {
            apt.setSpo2(spo2.trim());
        }
        if (heartRate != null && !heartRate.isBlank()) {
            apt.setHeartRate(heartRate.trim());
        }
        if (nurseNotes != null && !nurseNotes.isBlank()) {
            apt.setNurseNotes(nurseNotes.trim());
        }

        return appointmentRepository.save(apt);
    }

    @Override
    @Transactional
    public Appointment completeAppointment(Long id, String bloodPressure, String spo2, String heartRate, String nurseNotes) {
        Appointment apt = getAppointmentByIdOrThrow(id);

        if ("cancelled".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalStateException("Ca hẹn đã bị hủy, không thể đánh dấu hoàn thành!");
        }

        if (bloodPressure != null && !bloodPressure.isBlank()) {
            apt.setBloodPressure(bloodPressure.trim());
        }
        if (spo2 != null && !spo2.isBlank()) {
            apt.setSpo2(spo2.trim());
        }
        if (heartRate != null && !heartRate.isBlank()) {
            apt.setHeartRate(heartRate.trim());
        }
        if (nurseNotes != null && !nurseNotes.isBlank()) {
            apt.setNurseNotes(nurseNotes.trim());
        }

        apt.setStatus("completed");
        return appointmentRepository.save(apt);
    }

    @Override
    @Transactional
    public Appointment cancelAppointment(Long id, String reason) {
        Appointment apt = getAppointmentByIdOrThrow(id);

        if ("completed".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalStateException("Ca khám đã hoàn thành, không thể hủy!");
        }

        apt.setStatus("cancelled");
        if (reason != null && !reason.isBlank()) {
            String currentReason = (apt.getReason() != null && !apt.getReason().isBlank()) ? apt.getReason() + " | " : "";
            apt.setReason(currentReason + "Lý do hủy: " + reason.trim());
        }

        return appointmentRepository.save(apt);
    }

    @Override
    @Transactional
    public Appointment updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái ca hẹn không được để trống!");
        }
        Appointment apt = getAppointmentByIdOrThrow(id);
        apt.setStatus(status.trim().toLowerCase());
        return appointmentRepository.save(apt);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        Appointment apt = getAppointmentByIdOrThrow(id);
        appointmentRepository.delete(apt);
    }

    // ==========================================
    // HELPER: SINH MÃ CA ĐỘC NHẤT
    // ==========================================
    private String generateUniqueAppointmentCode() {
        Random random = new Random();
        String code;
        do {
            int num = 1000 + random.nextInt(9000); // vd: 8821
            code = "#BK-" + num;
        } while (appointmentRepository.existsByCode(code));
        return code;
    }
}
