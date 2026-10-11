package com.example.demo.controller;

import com.example.demo.model.Nurse;
import com.example.demo.service.NurseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nurses")
@CrossOrigin(origins = "*")
public class NurseApiController {

    @Autowired
    private NurseService nurseService;

    // Lấy toàn bộ danh sách điều dưỡng
    @GetMapping
    public List<Nurse> getAllNurses() {
        return nurseService.getAllNurses();
    }

    // Tìm kiếm điều dưỡng theo tên
    @GetMapping("/search")
    public List<Nurse> searchNurses(@RequestParam(required = false) String q) {
        return nurseService.searchNursesByName(q);
    }

    // Lấy chi tiết hồ sơ điều dưỡng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Nurse> getNurseById(@PathVariable String id) {
        return nurseService.getNurseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
