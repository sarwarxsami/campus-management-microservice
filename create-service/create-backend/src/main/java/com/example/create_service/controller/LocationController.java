package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.LocationService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class LocationController extends BaseController {

    public LocationController(LocationService service) {
        super(service);
    }

    @Override
    @PostMapping("/location")
    public String trigger(HttpServletRequest request0, @RequestBody Map<String, String> request) throws Exception {
        if (!adminChecker.isAdmin(request0)) {
            response.setStatus(401);
            response.getWriter().write("Access Denied, Admin only");
        }
        return this.create(request);
    }
}