package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebViewController {

    @GetMapping("/")
    public String index() {
        return "trang-chu";
    }

    @GetMapping("/staff")
    public String staffPortal() {
        return "staff";
    }

    @GetMapping("/nurse")
    public String nursePortal() {
        return "nurse";
    }

    @GetMapping("/admin")
    public String adminPortal() {
        return "admin";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
}
