# 📋 KẾ HOẠCH PHÂN CHIA CÔNG VIỆC 5 THÀNH VIÊN (CHIA THEO 3 CHỨC NĂNG CHÍNH)
### DỰ ÁN: BBCare Homecare - Nền Tảng Chăm Sóc Sức Khỏe & Quản Lý Ca Trực Tại Nhà
* **Repository GitHub:** [https://github.com/BBCARE-PROJECT/BBCARRE](https://github.com/BBCARE-PROJECT/BBCARRE)
* **Công nghệ:** Spring Boot 3.3.4 (JDK 21) • Microsoft SQL Server • Spring Data JPA • Thymeleaf • Modular Vanilla CSS/JS
* **Quy tắc Git:** Mỗi người làm trên 1 nhánh tính năng riêng (**Feature Branch**), không commit đè file của nhau.

---

## 🧭 MA TRẬN PHÂN CHIA 5 THÀNH VIÊN VÀ TRÁCH NHIỆM

| STT | Thành viên | Nhánh Git | Chức năng phụ trách | Phạm vi cụ thể |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Thành viên 1** | `feature/auth-account` | **TÀI KHOẢN & XÁC THỰC** (1 người) | Check validation, Gửi Gmail OTP xác thực, Phân quyền DB (Admin/Staff/Nurse/Customer), Session/Cookie đăng nhập. |
| **2** | **Thành viên 2** | `feature/booking-client-ehr` | **ĐẶT CA (Phần 1): KHÁCH ĐẶT & HỒ SƠ EHR** | Luồng Wizard đặt ca 5 bước, Lưu ca hẹn DB (`PENDING`), Màn hình "HỒ SƠ ĐẶT CA" (Sổ theo dõi sinh hiệu & tiến độ khám). |
| **3** | **Thành viên 3** | `feature/dispatch-and-nurse` | **ĐẶT CA (Phần 2): STAFF ĐIỀU PHỐI & ĐIỀU DƯỠNG** | Staff check trùng giờ & gán Điều dưỡng (`CONFIRMED`), Điều dưỡng nhận lịch trực & cập nhật sinh hiệu (huyết áp, SpO2, vết thương). |
| **4** | **Thành viên 4** | `feature/store-client-orders` | **CỬA HÀNG (Phần 1): KHÁCH MUA/THUÊ & GIỎ HÀNG** | Cửa hàng thiết bị & thuốc, Thuê máy Oxy (tính tiền cọc) vs Mua đứt, Giỏ hàng, Gửi đơn hàng thuê/mua vào DB (`PENDING`). |
| **5** | **Thành viên 5** | `feature/store-inventory-management` | **CỬA HÀNG (Phần 2): STAFF KHO & NGHIỆM THU TRẢ CỌC** | Staff quản lý kho thiết bị, duyệt xuất kho đơn thuê, Nghiệm thu kiểm tra máy khi khách trả và hoàn tiền cọc cho khách. |

---

## 🌿 QUY TRÌNH TÁCH NHÁNH GIT CHO TỪNG BẠN

Cả 5 bạn mở terminal trong thư mục dự án và chạy:

1. **Kéo code mới nhất từ nhánh `main`:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Mỗi bạn tự tạo nhánh của mình (CHỌN ĐÚNG LỆNH CỦA BẠN):**
   * **Bạn 1:** `git checkout -b feature/auth-account`
   * **Bạn 2:** `git checkout -b feature/booking-client-ehr`
   * **Bạn 3:** `git checkout -b feature/dispatch-and-nurse`
   * **Bạn 4:** `git checkout -b feature/store-client-orders`
   * **Bạn 5:** `git checkout -b feature/store-inventory-management`

3. **Nguyên tắc khi làm xong việc:**
   * Chỉ `git add` đúng file mình viết: `git add src/main/java/.../FileCuaBan.java`
   * Commit và đẩy lên nhánh của mình: `git commit -m "feat: mo ta cong viec" && git push -u origin ten-nhanh-cua-ban`
   * Lên GitHub tạo Pull Request để nhóm trưởng gộp vào `main`.

---

# 📖 CHI TIẾT CÔNG VIỆC & BỘ PROMPT AI CHO TỪNG THÀNH VIÊN

---

## 👤 THÀNH VIÊN 1: TÀI KHOẢN, GỬI GMAIL XÁC THỰC & PHÂN QUYỀN
* **Nhánh Git:** `feature/auth-account`
* **Nhiệm vụ chính:**
  1. **Validation form:** Kiểm tra định dạng Email, SĐT (đúng 10 số bắt đầu bằng 0), Mật khẩu (tối thiểu 8 ký tự, có chữ và số).
  2. **Gửi Gmail xác thực:** Sử dụng `JavaMailSender` (SMTP Gmail) gửi mã OTP 6 số qua email khi người dùng Đăng ký tài khoản hoặc Quên mật khẩu.
  3. **Phân quyền trên Database:**
     - Bảng `users`: `id`, `email`, `password` (mã hóa BCrypt), `full_name`, `phone`, `role` (`CUSTOMER`, `STAFF`, `NURSE`, `ADMIN`), `is_active`, `otp_code`, `otp_expiry`.
     - Phân luồng đăng nhập:
       - Role `CUSTOMER` -> Vào trang chủ `index.html` (hiển thị tên người dùng ở Header).
       - Role `STAFF` -> Tự động chuyển hướng sang `/staff`.
       - Role `NURSE` -> Tự động chuyển hướng sang `/nurse`.
       - Role `ADMIN` -> Tự động chuyển hướng sang `/admin`.
* **Các file code phụ trách:**
  - `model/User.java`, `enums/Role.java`
  - `repository/UserRepository.java`
  - `service/UserService.java`, `service/EmailService.java`
  - `controller/AuthApiController.java`, `controller/WebViewController.java` (phần kiểm tra login)
  - `src/main/resources/static/js/login.js`, `login.html`

> ### 🤖 PROMPT DÀNH CHO THÀNH VIÊN 1 (Copy dán cho AI):
> ```text
> Tôi đang làm dự án Spring Boot 3 (JDK 21, SQL Server, Spring Data JPA) quản lý y tế BBCare.
> Package chính: com.example.demo
> 
> Tôi phụ trách: CHỨC NĂNG TÀI KHOẢN, GỬI GMAIL OTP XÁC THỰC VÀ PHÂN QUYỀN TRÊN DATABASE.
> Yêu cầu:
> 1. model/User.java: id (Long), email (String, unique), password (String), fullName (String), phone (String), role (String: 'CUSTOMER', 'STAFF', 'NURSE', 'ADMIN'), isVerified (Boolean), otpCode (String), otpExpiry (LocalDateTime).
> 2. repository/UserRepository.java: findByEmail(String email), existsByEmail(String email).
> 3. service/EmailService.java: Sử dụng JavaMailSender để gửi email chứa mã OTP 6 số kích hoạt tài khoản.
> 4. service/UserService.java:
>    - registerUser(email, password, fullName, phone): Validate email regex, phone 10 số, băm mật khẩu BCrypt, tạo OTP và gọi EmailService gửi mail, lưu trạng thái isVerified=false.
>    - verifyOtp(email, otpCode): Kiểm tra mã OTP còn hạn không, nếu đúng chuyển isVerified=true.
>    - loginUser(email, password, HttpSession session): Kiểm tra mật khẩu, nếu đúng lưu User vào Session và trả về role để Frontend redirect (STAFF -> /staff, NURSE -> /nurse, ADMIN -> /admin, CUSTOMER -> /index.html).
> 5. controller/AuthApiController.java:
>    - POST /api/auth/register (nhận JSON email, password, fullName, phone)
>    - POST /api/auth/verify-otp (nhận email, otp)
>    - POST /api/auth/login (nhận email, password)
>    - POST /api/auth/logout
> 6. Viết kèm cấu hình spring.mail trong application.properties và đoạn Javascript Fetch API để gửi form đăng nhập/đăng ký từ login.html.
> Viết code chuẩn Java 21, không dùng Lombok (dùng Getter/Setter đầy đủ).
> ```

---

## 👤 THÀNH VIÊN 2: ĐẶT CA Y TÁ (PHẦN 1) - KHÁCH ĐẶT & HỒ SƠ ĐẶT CA (EHR)
* **Nhánh Git:** `feature/booking-client-ehr`
* **Nhiệm vụ chính:**
  1. **Luồng Wizard đặt ca 5 bước (`index.html`):** Khách chọn dịch vụ (Chăm sóc mẹ bé, Phục hồi sau tai biến, Thay băng cắt chỉ...) -> Chọn khung giờ & ngày khám -> Điền thông tin bệnh nhân -> Lưu vào bảng `appointments` với trạng thái `PENDING`.
  2. **Mục "HỒ SƠ ĐẶT CA" trên Header `index.html` (`profilePage`):**
     - Đọc dữ liệu từ bảng `appointments` theo số điện thoại hoặc tài khoản khách.
     - Hiển thị cuốn sổ bệnh án điện tử (EHR): Danh sách ca hẹn của khách, trạng thái xử lý (Chờ điều phối -> Đã duyệt -> Đang khám -> Hoàn thành).
     - Xem lại các chỉ số sinh hiệu (Huyết áp, SpO2, nhịp tim) và nhật ký phục hồi do Điều dưỡng đã cập nhật sau mỗi ca khám.
* **Các file code phụ trách:**
  - `model/Appointment.java` (id, code, patientName, patientPhone, address, serviceName, appointmentDate, timeSlot, status, price, notes, bloodPressure, spo2, heartRate, nurseNotes...)
  - `repository/AppointmentRepository.java` (`findByPatientPhone`, `findByStatus`)
  - `service/ClientBookingService.java`
  - `controller/ClientBookingApiController.java` (`POST /api/appointments/book`, `GET /api/appointments/my-history`)
  - Frontend: `src/main/resources/static/js/customer/booking.js`, `src/main/resources/static/css/customer/profile.css`, hàm `renderProfilePage()` trong `app.js`.

> ### 🤖 PROMPT DÀNH CHO THÀNH VIÊN 2 (Copy dán cho AI):
> ```text
> Tôi đang làm dự án Spring Boot 3 (JDK 21, SQL Server, Spring Data JPA) quản lý y tế BBCare.
> Package chính: com.example.demo
> 
> Tôi phụ trách: CHỨC NĂNG ĐẶT CA PHÍA KHÁCH HÀNG & MÀN HÌNH "HỒ SƠ ĐẶT CA" (EHR).
> Yêu cầu:
> 1. model/Appointment.java:
>    - id (Long), code (String, sinh tự động dạng #APT1001), patientName (String), patientPhone (String), patientAddress (String), serviceName (String), appointmentDate (String), timeSlot (String), status (String: 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'), price (Double), notes (String).
>    - Các trường kết quả khám (Điều dưỡng cập nhật sau): bloodPressure (String), spo2 (String), heartRate (String), nurseCareNotes (String).
> 2. repository/AppointmentRepository.java:
>    - findByPatientPhoneOrderByAppointmentDateDesc(String phone)
>    - findById(Long id)
> 3. service/ClientBookingService.java:
>    - createBooking(Appointment appointment): Sinh mã code, gán status='PENDING', lưu vào SQL Server.
>    - getPatientAppointmentHistory(String phone): Lấy toàn bộ lịch sử ca đặt và chỉ số sinh hiệu của bệnh nhân theo số điện thoại.
> 4. controller/ClientBookingApiController.java:
>    - POST /api/appointments/book: Tiếp nhận dữ liệu đặt ca từ Wizard 5 bước.
>    - GET /api/appointments/my-history?phone=...: Trả về danh sách ca khám và hồ sơ bệnh án để hiển thị lên mục "HỒ SƠ ĐẶT CA".
> 5. Viết đoạn JavaScript Fetch API để:
>    - Khi khách bấm xác nhận đặt ca trên booking.js thì gửi POST xuống /api/appointments/book.
>    - Khi khách vào tab "HỒ SƠ ĐẶT CA", gọi GET /api/appointments/my-history để vẽ lại danh sách ca hẹn và nhật ký sinh hiệu.
> Viết code chuẩn Java 21, không dùng Lombok.
> ```

---

## 👤 THÀNH VIÊN 3: ĐẶT CA Y TÁ (PHẦN 2) - STAFF ĐIỀU PHỐI & ĐIỀU DƯỠNG NHẬN LỊCH
* **Nhánh Git:** `feature/dispatch-and-nurse`
* **Nhiệm vụ chính:**
  1. **Nhân viên điều phối (`staff.html`):**
     - Đọc toàn bộ ca hẹn từ bảng `appointments`.
     - Chức năng gán ca: Bấm "Đổi ca / Gán ca" -> Chọn Điều dưỡng viên từ bảng `nurses` và khung giờ -> Kiểm tra không được trùng lịch của Điều dưỡng đó (`checkConflict`).
     - Bấm nút **"Xác Nhận & Đồng Bộ Lịch"** -> Cập nhật `nurse_id` và chuyển trạng thái ca hẹn sang `CONFIRMED`.
  2. **Điều dưỡng viên (`nurse.html`):**
     - Tra cứu lịch trực: Đọc các ca hẹn thuộc về Điều dưỡng đó theo ngày được Staff phân công.
     - Cập nhật nhật ký chăm sóc: Điều dưỡng khám xong, mở modal cập nhật chỉ số (Huyết áp, SpO2, vết thương) và chuyển trạng thái ca sang `COMPLETED`. Dữ liệu này tự động đồng bộ sang màn hình "HỒ SƠ ĐẶT CA" của Khách hàng.
* **Các file code phụ trách:**
  - `model/Nurse.java` (id, code, fullName, specialty, district, phone, avatar, ratingAvg, status)
  - `repository/NurseRepository.java`, `repository/AppointmentRepository.java` (các hàm cập nhật điều phối)
  - `service/DispatchService.java` (nghiệp vụ check trùng lịch & gán ca)
  - `service/NursePortalService.java` (lấy lịch trực & lưu kết quả khám)
  - `controller/DispatchApiController.java`, `controller/NurseApiController.java`
  - Frontend: `src/main/resources/static/js/staff/staff.js`, `src/main/resources/static/js/nurse/nurse.js`, `portal.js`.

> ### 🤖 PROMPT DÀNH CHO THÀNH VIÊN 3 (Copy dán cho AI):
> ```text
> Tôi đang làm dự án Spring Boot 3 (JDK 21, SQL Server, Spring Data JPA) quản lý y tế BBCare.
> Package chính: com.example.demo
> 
> Tôi phụ trách: CHỨC NĂNG STAFF ĐIỀU PHỐI CA TRỰC VÀ ĐIỀU DƯỠNG NHẬN LỊCH / GHI SỔ SINH HIỆU.
> Yêu cầu:
> 1. model/Nurse.java: id (String, vd 'quan'), code (String, 'DD01'), fullName (String), specialty (String), district (String), phone (String), avatar (String), ratingAvg (Double), status (String).
> 2. Cập nhật quan hệ @ManyToOne trong Appointment.java với Nurse (khóa ngoại nurse_id).
> 3. repository/AppointmentRepository.java:
>    - boolean existsByNurseIdAndAppointmentDateAndTimeSlotAndIdNot(String nurseId, String date, String slot, Long id)
>    - findByNurseIdAndAppointmentDate(String nurseId, String date)
> 4. service/DispatchService.java:
>    - assignNurseToAppointment(Long appointmentId, String nurseId, String newDate, String newSlot, String reason): Kiểm tra nếu trùng giờ của ĐD đó thì ném IllegalArgumentException("Điều dưỡng đã có ca vào khung giờ này!"), ngược lại gán nurseId, status='CONFIRMED' và lưu DB.
> 5. service/NursePortalService.java:
>    - getNurseSchedule(String nurseId, String date): Lấy ca trực trong ngày của ĐD.
>    - completeAppointmentWithVitals(Long appointmentId, String bloodPressure, String spo2, String heartRate, String notes): Cập nhật kết quả sinh hiệu và đổi status='COMPLETED'.
> 6. controller/DispatchApiController.java:
>    - GET /api/dispatch/appointments: Staff xem tất cả ca cần xử lý
>    - POST /api/dispatch/assign/{id}: Nút "Xác Nhận & Đồng Bộ Lịch" của Staff
> 7. controller/NurseApiController.java:
>    - GET /api/nurse/schedule?nurseId=...&date=...: Lịch trực của ĐD
>    - POST /api/nurse/vitals/{id}: ĐD gửi sinh hiệu sau khi khám
> 8. Viết Javascript Fetch API cho staff.js (nút Xác nhận & Đồng bộ) và nurse.js (tải lịch trực).
> Viết code chuẩn Java 21, không dùng Lombok.
> ```

---

## 👤 THÀNH VIÊN 4: CỬA HÀNG Y TẾ (PHẦN 1) - KHÁCH MUA / THUÊ & GIỎ HÀNG
* **Nhánh Git:** `feature/store-client-orders`
* **Nhiệm vụ chính:**
  1. **Hiển thị sản phẩm trên Cửa hàng Y tế (`index.html` -> `storePage`):**
     - Đọc danh sách thiết bị y tế, thuốc, thực phẩm chức năng từ bảng `products`.
     - Phân loại rõ ràng 2 cơ chế giá: **Giá Bán Mua Đứt** và **Giá Thuê Theo Ngày/Tháng** (kèm số tiền cọc bảo chứng).
  2. **Giỏ hàng & Đặt hàng (`cartPage`):**
     - Khách hàng thêm món hàng vào giỏ hàng: Có thể chọn số lượng mua hoặc chọn số ngày muốn thuê máy (ví dụ thuê Máy tạo Oxy 5 ngày, tiền cọc 3.000.000đ).
     - Form thông tin nhận hàng: Khách nhập họ tên, SĐT, địa chỉ giao máy -> Bấm **"Xác Nhận Đặt Đơn"**.
     - Lưu đơn hàng vào bảng `orders` và bảng chi tiết `order_items` với trạng thái `PENDING`.
* **Các file code phụ trách:**
  - `model/Product.java` (id, name, category, buyPrice, rentPricePerDay, depositPrice, imageUrl, stockQuantity, status)
  - `model/Order.java` (id, orderCode, customerName, customerPhone, address, orderType 'BUY'/'RENT', totalAmount, depositAmount, status 'PENDING', createdAt)
  - `model/OrderItem.java` (id, order_id, product_id, quantity, rentDays, price, deposit)
  - `repository/ProductRepository.java`, `repository/OrderRepository.java`
  - `service/ClientStoreService.java`
  - `controller/ClientStoreApiController.java` (`GET /api/products`, `POST /api/orders/checkout`)
  - Frontend: `src/main/resources/static/css/customer/store.css`, phần render store và giỏ hàng trong `src/main/resources/static/js/customer/app.js`.

> ### 🤖 PROMPT DÀNH CHO THÀNH VIÊN 4 (Copy dán cho AI):
> ```text
> Tôi đang làm dự án Spring Boot 3 (JDK 21, SQL Server, Spring Data JPA) quản lý y tế BBCare.
> Package chính: com.example.demo
> 
> Tôi phụ trách: CHỨC NĂNG CỬA HÀNG Y TẾ PHÍA KHÁCH HÀNG (Duyệt Sản Phẩm, Thuê Máy Kèm Cọc, Mua Hàng, Giỏ Hàng & Checkout).
> Yêu cầu:
> 1. model/Product.java: id (String, vd 'p_oxy_5l'), name (String), category (String: 'RENTAL', 'SALE', 'SUPPLEMENT'), buyPrice (Double), rentPricePerDay (Double), depositPrice (Double), imageUrl (String), stockQuantity (Integer), status (String: 'AVAILABLE').
> 2. model/Order.java: id (Long), orderCode (String, vd '#ORD2001'), customerName (String), customerPhone (String), address (String), orderType (String: 'BUY' hoặc 'RENT'), totalAmount (Double), depositAmount (Double), status (String: 'PENDING', 'DELIVERING', 'ACTIVE_RENTING', 'COMPLETED'), createdAt (LocalDateTime).
> 3. model/OrderItem.java: id (Long), quan hệ @ManyToOne với Order và @ManyToOne với Product, quantity (Integer), rentDays (Integer, null nếu mua), price (Double), depositPrice (Double).
> 4. service/ClientStoreService.java:
>    - getAllProducts(): Lấy danh sách sản phẩm hiển thị trên Cửa hàng.
>    - createOrder(OrderDTO dto): Tính tổng tiền (tiền mua hoặc tiền thuê + tiền cọc), trừ tồn kho tạm thời, lưu Order và OrderItem vào SQL Server với status='PENDING'.
> 5. controller/ClientStoreApiController.java:
>    - GET /api/products: Trả về danh sách sản phẩm kèm link ảnh CDN và 2 mức giá thuê/bán.
>    - POST /api/orders/checkout: Nhận giỏ hàng và thông tin khách hàng để tạo đơn.
> 6. Viết code JavaScript Fetch API để:
>    - Tải sản phẩm từ /api/products đổ vào giao diện Cửa hàng trên index.html.
>    - Khi bấm "Đặt đơn", gửi JSON giỏ hàng xuống /api/orders/checkout và hiển thị thông báo đặt đơn thành công.
> Viết code chuẩn Java 21, không dùng Lombok.
> ```

---

## 👤 THÀNH VIÊN 5: CỬA HÀNG Y TẾ (PHẦN 2) - STAFF QUẢN LÝ KHO & NGHIỆM THU TRẢ CỌC
* **Nhánh Git:** `feature/store-inventory-management`
* **Nhiệm vụ chính:**
  1. **Quản lý kho thiết bị & thuốc (`staff.html` -> Tab "Kho thuốc & Thiết bị"):**
     - Đọc dữ liệu tồn kho từ bảng `products`.
     - Cho phép Staff cập nhật số lượng tồn kho (nhập thêm máy tạo oxy, bình oxy, xe lăn...) hoặc cập nhật đơn giá.
  2. **Quản lý đơn hàng & xuất kho máy móc (`staff.html` -> Tab "Mua, Thuê thiết bị"):**
     - Hiển thị danh sách các đơn hàng khách vừa đặt từ Thành viên 4.
     - Nút "Duyệt đơn & Giao máy" -> Cập nhật trạng thái đơn sang `DELIVERING` hoặc `ACTIVE_RENTING` (Đang thuê).
  3. **Quy trình Nghiệm thu trả thiết bị & Hoàn tiền cọc (Tab "Nghiệm thu trả cọc"):**
     - Khi khách dùng xong mang máy đến trả -> Staff mở modal **"Nghiệm thu trả cọc"**.
     - Nhập tình trạng máy (Nguyên vẹn hoạt động tốt -> Hoàn 100% tiền cọc; Hỏng hóc phụ kiện -> Trừ tiền phụ kiện và hoàn phần còn lại).
     - Bấm **"Xác Nhận Trả Cọc & Nhập Kho"** -> Cập nhật đơn hàng sang `COMPLETED`, tự động cộng lại `stockQuantity` vào bảng `products`.
* **Các file code phụ trách:**
  - `service/InventoryService.java` (quản lý tồn kho)
  - `service/StaffOrderService.java` (duyệt đơn và xử lý hoàn cọc)
  - `controller/InventoryApiController.java` (`GET /api/inventory`, `PUT /api/inventory/{id}/stock`)
  - `controller/StaffOrderApiController.java` (`GET /api/staff/orders`, `PUT /api/staff/orders/{id}/status`, `POST /api/staff/orders/{id}/return-deposit`)
  - Frontend: `staff.html` (các bảng Kho thiết bị, Quản lý đơn thuê/mua, modal `returnDepositModal`), `src/main/resources/static/js/staff/staff.js`.

> ### 🤖 PROMPT DÀNH CHO THÀNH VIÊN 5 (Copy dán cho AI):
> ```text
> Tôi đang làm dự án Spring Boot 3 (JDK 21, SQL Server, Spring Data JPA) quản lý y tế BBCare.
> Package chính: com.example.demo
> 
> Tôi phụ trách: CHỨC NĂNG STAFF QUẢN LÝ KHO THIẾT BỊ, DUYỆT ĐƠN VÀ NGHIỆM THU HOÀN TIỀN CỌC.
> Yêu cầu:
> 1. service/InventoryService.java:
>    - getInventoryList(): Lấy danh sách sản phẩm và số lượng tồn kho.
>    - updateProductStock(String productId, Integer newStock): Cập nhật số lượng máy trong kho.
> 2. service/StaffOrderService.java:
>    - getAllOrders(): Lấy danh sách đơn thuê và mua thiết bị của khách hàng.
>    - updateOrderStatus(Long orderId, String newStatus): Duyệt đơn xuất kho (DELIVERING / ACTIVE_RENTING).
>    - processReturnDeposit(Long orderId, Double refundAmount, String conditionNote):
>      + Kiểm tra đơn hàng có đúng là đơn thuê không.
>      + Ghi nhận số tiền cọc hoàn trả thực tế sau khi kiểm tra máy.
>      + Đổi trạng thái đơn sang 'COMPLETED' (hoặc 'RETURNED_REFUNDED').
>      + Tự động cộng lại số lượng thiết bị vào kho (Product.stockQuantity += item.quantity).
> 3. controller/StaffOrderApiController.java:
>    - GET /api/staff/orders: Lấy danh sách đơn hàng cho Staff
>    - PUT /api/staff/orders/{id}/status: Cập nhật trạng thái duyệt đơn
>    - POST /api/staff/orders/{id}/return-deposit: API Nghiệm thu trả máy & hoàn cọc
> 4. controller/InventoryApiController.java:
>    - GET /api/staff/inventory: Danh sách kho
>    - PUT /api/staff/inventory/{id}: Cập nhật kho
> 5. Viết JavaScript Fetch API trên staff.html để kết nối bảng danh sách đơn hàng và modal Nghiệm thu trả cọc.
> Viết code chuẩn Java 21, không dùng Lombok.
> ```

---

## 🔒 CAM KẾT KIỂM SOÁT CODE & KHÔNG XUNG ĐỘT (ZERO CONFLICT)

* **Nhóm 1 (Tài khoản):** Chỉ làm việc trên bảng `users` -> 0% ảnh hưởng đến các bạn khác.
* **Nhóm 2 (Đặt ca Y tá):**
  - Bạn 2 (Khách): Chuyên tạo ca hẹn và hiển thị Hồ sơ đặt ca.
  - Bạn 3 (Staff/ĐD): Chuyên gán ca và cập nhật chỉ số sinh hiệu.
  - Cả 2 bạn phối hợp thông suốt trên bảng `appointments` và `nurses`.
* **Nhóm 3 (Cửa hàng Y tế):**
  - Bạn 4 (Khách): Chuyên bán/cho thuê, giỏ hàng và tạo đơn hàng.
  - Bạn 5 (Staff/Kho): Chuyên duyệt đơn, quản lý kho và nghiệm thu trả cọc máy.
  - Cả 2 bạn phối hợp thông suốt trên bảng `products` và `orders`.

*Tài liệu này được tạo trực tiếp tại `KE_HOACH_PHAN_CONG_5_NGUOI.md` trên máy của bạn. Tuyệt đối chưa push lên GitHub để bạn duyệt trước khi họp nhóm!*
