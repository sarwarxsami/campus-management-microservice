package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.LocationService;

@RestController
public class LocationController extends BaseController {
    
    public LocationController(LocationService service) {
        super(service);
    }

    @Override
    @PostMapping("/location")
    public String trigger(@RequestBody Map<String, String> request) {
        return this.create(request);
    }
}