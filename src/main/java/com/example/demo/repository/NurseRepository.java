package com.example.demo.repository;

import com.example.demo.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, String> {

    // Tìm kiếm điều dưỡng theo họ tên (không phân biệt hoa thường)
    List<Nurse> findByFullNameContainingIgnoreCase(String name);

    // Tìm kiếm điều dưỡng theo quận huyện
    List<Nurse> findByDistrictContainingIgnoreCase(String district);

    // Lọc điều dưỡng đang hoạt động
    List<Nurse> findByStatus(String status);
}
