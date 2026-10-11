package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        System.out.println("=================================================");
        System.out.println("   BBCare Homecare Server started successfully!  ");
        System.out.println("   Access Web at: http://localhost:8080          ");
        System.out.println("   Staff Portal:  http://localhost:8080/staff    ");
        System.out.println("   Nurse Portal:  http://localhost:8080/nurse    ");
        System.out.println("=================================================");
    }
}
