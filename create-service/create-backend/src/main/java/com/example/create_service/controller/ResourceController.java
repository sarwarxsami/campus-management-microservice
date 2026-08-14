package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.ResourceService;

@RestController
public class ResourceController extends BaseController{

    public ResourceController(ResourceService service) {
        super(service);
    }

    @PostMapping("/resource")
    @Override
    public String trigger(@RequestBody Map<String, String> request) {
        return this.create(request);
    }

}