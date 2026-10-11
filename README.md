# BBCARE - Nền Tảng Chăm Sóc Sức Khỏe & Điều Phối Ca Trực Tại Nhà

Dự án ứng dụng công nghệ thông tin y tế hỗ trợ đặt lịch hẹn, điều phối ca trực điều dưỡng và quản lý thiết bị y tế.

## 🛠️ Công Nghệ Sử Dụng
- **Ngôn ngữ & Nền tảng:** Java (JDK 21), Spring Boot 3.3.4
- **Cơ sở dữ liệu:** Microsoft SQL Server
- **ORM / Data Access:** Spring Data JPA (Hibernate)
- **Giao diện:** Thymeleaf, Vanilla HTML5 / CSS3 / JavaScript (Không dùng Bootstrap)
- **Công cụ phát triển:** IntelliJ IDEA Community / VS Code

## 📁 Cấu Trúc Dự Án
```text
src/main/
├── java/com/example/demo/
│   ├── DemoApplication.java
│   ├── config/              <- Cấu hình Web, Khởi tạo dữ liệu
│   ├── controller/          <- Web Controller & REST APIs
│   ├── model/               <- Các Entity JPA (Nurse, Appointment...)
│   ├── repository/          <- Spring Data JPA Repositories
│   └── service/             <- Tầng xử lý nghiệp vụ
└── resources/
    ├── static/              <- CSS, JS tĩnh
    ├── templates/           <- Giao diện HTML (staff.html, nurse.html...)
    └── application.properties
```

## 🚀 Khởi Chạy Dự Án
1. Mở SQL Server và tạo cơ sở dữ liệu:
   ```sql
   CREATE DATABASE bbcare_db;
   ```
2. Mở thư mục dự án trên IntelliJ IDEA Community.
3. Chạy file `DemoApplication.java`.
4. Truy cập cổng vận hành tại: `http://localhost:8080/staff`
