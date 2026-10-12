-- ===================================================================================
-- SCRIPT THIẾT LẬP TÀI KHOẢN MẶC ĐỊNH CHO CÁC ĐIỀU DƯỠNG (HỆ THỐNG BBCARE HOMECARE)
-- Database: bbcaredb (Microsoft SQL Server)
-- Bảng: users (Role: 'NURSE') & nurses (Danh sách hồ sơ điều dưỡng)
-- ===================================================================================

USE bbcaredb;
GO

-- 1. Đảm bảo bảng 'users' đã tồn tại với các trường cần thiết
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name NVARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) NOT NULL,
        is_verified BIT NOT NULL DEFAULT 1,
        otp_code VARCHAR(6) NULL,
        otp_expiry DATETIME2 NULL
    );
END
GO

-- 2. Đảm bảo bảng 'nurses' đã tồn tại (nếu dùng chung với hệ sinh thái phân công ca trực)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nurses')
BEGIN
    CREATE TABLE nurses (
        id VARCHAR(50) PRIMARY KEY,
        code VARCHAR(20) NOT NULL,
        full_name NVARCHAR(100) NOT NULL,
        specialty NVARCHAR(150),
        district NVARCHAR(100),
        phone VARCHAR(20),
        avatar VARCHAR(500),
        rating_avg FLOAT,
        reviews_count INT,
        status VARCHAR(30)
    );
END
GO

-- ===================================================================================
-- 3. CHÈN TÀI KHOẢN MẶC ĐỊNH CHO 7 ĐIỀU DƯỠNG VÀO BẢNG 'users'
-- Mật khẩu mặc định: 'BBCare@2026' (hoặc bạn có thể dùng mã hóa BCrypt tương ứng)
-- Trạng thái: is_verified = 1 (Đã xác thực, sẵn sàng đăng nhập)
-- ===================================================================================

-- Điều dưỡng 1: Nguyễn Văn Minh
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'minh.nguyen@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('minh.nguyen@bbcare.vn', 'BBCare@2026', N'ĐD. Nguyễn Văn Minh', '0905111222', 'NURSE', 1);
END;

-- Điều dưỡng 2: Trần Thị Mai
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'mai.tran@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('mai.tran@bbcare.vn', 'BBCare@2026', N'ĐD. Trần Thị Mai', '0905222333', 'NURSE', 1);
END;

-- Điều dưỡng 3: Trần Thị Lan
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'lan.tran@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('lan.tran@bbcare.vn', 'BBCare@2026', N'ĐD. Trần Thị Lan', '0905333444', 'NURSE', 1);
END;

-- Điều dưỡng 4: Lê Hoàng Quân
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'quan.le@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('quan.le@bbcare.vn', 'BBCare@2026', N'BS. Lê Hoàng Quân', '0905444555', 'NURSE', 1);
END;

-- Điều dưỡng 5: Phạm Thanh Hà
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'ha.pham@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('ha.pham@bbcare.vn', 'BBCare@2026', N'ĐD. Phạm Thanh Hà', '0905555666', 'NURSE', 1);
END;

-- Điều dưỡng 6: Hoàng Thu Thảo
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'thao.hoang@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('thao.hoang@bbcare.vn', 'BBCare@2026', N'ĐD. Hoàng Thu Thảo', '0905666777', 'NURSE', 1);
END;

-- Điều dưỡng 7: Đặng Quốc Bảo
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'bao.dang@bbcare.vn')
BEGIN
    INSERT INTO users (email, password, full_name, phone, role, is_verified)
    VALUES ('bao.dang@bbcare.vn', 'BBCare@2026', N'ĐD. Đặng Quốc Bảo', '0905777888', 'NURSE', 1);
END;
GO

-- ===================================================================================
-- 4. ĐỒNG BỘ DỮ LIỆU HỒ SƠ VÀO BẢNG 'nurses' (NẾU CHƯA CÓ)
-- ===================================================================================
IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'minh')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('minh', 'DD01', N'ĐD. Nguyễn Văn Minh', N'Chuyên Khoa Ngoại & Vết Thương Mổ', N'Hải Châu & Thanh Khê', '0905 111 222', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', 4.9, 128, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'mai')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('mai', 'DD02', N'ĐD. Trần Thị Mai', N'Chăm Sóc Hậu Phẫu & Người Già Liệt Giường', N'Hải Châu & Cẩm Lệ', '0905 222 333', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 5.0, 95, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'lan')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('lan', 'DD03', N'ĐD. Trần Thị Lan', N'Nhi Khoa & Chăm Sóc Sơ Sinh Tại Nhà', N'Hải Châu & Thanh Khê', '0905 333 444', 'https://images.unsplash.com/photo-1594824813576-905ffeb52317?auto=format&fit=crop&q=80&w=300', 4.8, 87, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'quan')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('quan', 'DD04', N'BS. Lê Hoàng Quân', N'Phục Hồi Chức Năng & Vật Lý Trị Liệu', N'Sơn Trà & Ngũ Hành Sơn', '0905 444 555', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300', 4.9, 110, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'ha')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('ha', 'DD05', N'ĐD. Phạm Thanh Hà', N'Hồi Sức Cấp Cứu & Trực Đêm Oxy', N'Liên Chiểu & Cẩm Lệ', '0905 555 666', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300', 4.8, 82, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'thao')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('thao', 'DD06', N'ĐD. Hoàng Thu Thảo', N'Chăm Sóc Người Già & Hộ Lý Tại Chỗ', N'Ngũ Hành Sơn & Sơn Trà', '0905 666 777', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300', 4.9, 78, 'ACTIVE');
END;

IF NOT EXISTS (SELECT 1 FROM nurses WHERE id = 'bao')
BEGIN
    INSERT INTO nurses (id, code, full_name, specialty, district, phone, avatar, rating_avg, reviews_count, status)
    VALUES ('bao', 'DD07', N'ĐD. Đặng Quốc Bảo', N'Điều Dưỡng Ngoại Viện & Cấp Cứu Ban Đêm', N'Cẩm Lệ & Hải Châu', '0905 777 888', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300', 4.8, 104, 'ACTIVE');
END;
GO

-- ===================================================================================
-- 5. KIỂM TRA LẠI DỮ LIỆU ĐÃ TẠO
-- ===================================================================================
SELECT id, email, full_name, phone, role, is_verified 
FROM users 
WHERE role = 'NURSE';
GO
