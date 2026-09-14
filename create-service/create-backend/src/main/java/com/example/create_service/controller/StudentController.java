package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.StudentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class StudentController extends BaseController{

    public StudentController(StudentService service) {
        super(service);
    }

    @PostMapping("/student")
    @Override
    public String trigger(HttpServletRequest request0, @RequestBody Map<String, String> request) {
        return this.create(request);
    }

}