package com.example.demo.config;

import com.example.demo.model.Appointment;
import com.example.demo.model.Nurse;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private NurseRepository nurseRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public void run(String... args) throws Exception {
        // Tự động khởi tạo 7 điều dưỡng mẫu nếu Database SQL Server chưa có dữ liệu
        if (nurseRepository.count() == 0) {
            Nurse n1 = new Nurse("minh", "DD01", "ĐD. Nguyễn Văn Minh", "Chuyên Khoa Ngoại & Vết Thương Mổ", "Hải Châu & Thanh Khê", "0905 111 222", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300", 4.9, 128, "ACTIVE");
            Nurse n2 = new Nurse("mai", "DD02", "ĐD. Trần Thị Mai", "Chăm Sóc Hậu Phẫu & Người Già Liệt Giường", "Hải Châu & Cẩm Lệ", "0905 222 333", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", 5.0, 95, "ACTIVE");
            Nurse n3 = new Nurse("lan", "DD03", "ĐD. Trần Thị Lan", "Nhi Khoa & Chăm Sóc Sơ Sinh Tại Nhà", "Hải Châu & Thanh Khê", "0905 333 444", "https://images.unsplash.com/photo-1594824813576-905ffeb52317?auto=format&fit=crop&q=80&w=300", 4.8, 87, "ACTIVE");
            Nurse n4 = new Nurse("quan", "DD04", "BS. Lê Hoàng Quân", "Phục Hồi Chức Năng & Vật Lý Trị Liệu", "Sơn Trà & Ngũ Hành Sơn", "0905 444 555", "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300", 4.9, 110, "ACTIVE");
            Nurse n5 = new Nurse("ha", "DD05", "ĐD. Phạm Thanh Hà", "Hồi Sức Cấp Cứu & Trực Đêm Oxy", "Liên Chiểu & Cẩm Lệ", "0905 555 666", "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300", 4.8, 82, "ACTIVE");
            Nurse n6 = new Nurse("thao", "DD06", "ĐD. Hoàng Thu Thảo", "Chăm Sóc Người Già & Hộ Lý Tại Chỗ", "Ngũ Hành Sơn & Sơn Trà", "0905 666 777", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300", 4.9, 78, "ACTIVE");
            Nurse n7 = new Nurse("bao", "DD07", "ĐD. Đặng Quốc Bảo", "Điều Dưỡng Ngoại Viện & Cấp Cứu Ban Đêm", "Cẩm Lệ & Hải Châu", "0905 777 888", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300", 4.8, 104, "ACTIVE");

            nurseRepository.saveAll(List.of(n1, n2, n3, n4, n5, n6, n7));
            System.out.println(">> Đã tự động tạo dữ liệu mẫu cho 7 Điều dưỡng vào SQL Server!");
        }

        // Tự động khởi tạo các ca hẹn mẫu nếu chưa có
        if (appointmentRepository.count() == 0) {
            Nurse quan = nurseRepository.findById("quan").orElse(null);
            Nurse mai = nurseRepository.findById("mai").orElse(null);

            Appointment a1 = new Appointment("#BK-8821", "Ông Vũ Đình Phúc (80 tuổi)", "0905 123 456", "124 Nguyễn Tri Phương, Thanh Khê, Đà Nẵng", "Chăm sóc phục hồi sau phẫu thuật", quan, "2026-10-11", "08:00 - 10:30 (Sáng)", "confirmed", "Bệnh nhân cần tập đi", 350000.0);
            Appointment a2 = new Appointment("#BK-8819", "Bà Trần Ánh Nguyệt (72 tuổi)", "0912 345 678", "88 Lê Lợi, Hải Châu, Đà Nẵng", "Rửa vết thương & Thay băng cắt chỉ", mai, "2026-10-11", "14:00 - 16:30 (Chiều)", "confirmed", "Chăm sóc định kỳ", 280000.0);
            Appointment a3 = new Appointment("#BK-8825", "Bé Lê Gia Huy (5 tuổi)", "0934 567 890", "45 Điện Biên Phủ, Thanh Khê, Đà Nẵng", "Tiêm thuốc & Theo dõi sốt co giật", null, "2026-10-11", "11:00 - 13:00 (Trưa)", "pending", "Chờ phân công điều dưỡng", 300000.0);

            appointmentRepository.saveAll(List.of(a1, a2, a3));
            System.out.println(">> Đã tự động tạo dữ liệu mẫu cho các Ca hẹn vào SQL Server!");
        }
    }
}
