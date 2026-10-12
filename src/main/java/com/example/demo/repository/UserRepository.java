package com.example.demo.repository;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm người dùng theo Email (dùng cho đăng nhập, xác thực OTP)
    Optional<User> findByEmail(String email);

    // Kiểm tra email đã tồn tại hay chưa (dùng cho đăng ký)
    boolean existsByEmail(String email);

    // Tìm kiếm theo vai trò
    List<User> findByRole(Role role);

    // Tìm theo số điện thoại
    Optional<User> findByPhone(String phone);
}
