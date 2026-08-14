package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.create_service.service.ResourceDescriptorService;

@RestController
public class ResourceDescriptorController extends BaseController {
    
    public ResourceDescriptorController(ResourceDescriptorService service) {
        super(service);
    }

    @Override
    @PostMapping("/resource-descriptor")
    public String trigger(@RequestBody Map<String, String> request) {
        return this.create(request);
    }
}