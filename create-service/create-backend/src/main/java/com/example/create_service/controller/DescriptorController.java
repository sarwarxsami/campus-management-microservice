package com.example.create_service.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.DescriptorService;
import com.example.create_service.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class DescriptorController extends BaseController {

    public DescriptorController(DescriptorService service) {
        super(service);
    }

    @Autowired
    private CheckController checkController;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/descriptor")
    @Override
    public String trigger(HttpServletRequest request0, @RequestBody Map<String, String> request) {
        if (!checkController.isAdmin(request0)) {
            return "Access denied. Admin only.";
        }
        return this.create(request);
    }

}