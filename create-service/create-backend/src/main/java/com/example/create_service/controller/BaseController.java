package com.example.create_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.create_service.service.BaseService;

import jakarta.servlet.http.HttpServletRequest;


public abstract class BaseController {
    protected final BaseService service;

    public BaseController(BaseService service) {
        this.service = service;
    }

    public String create(Map<String, String> request) {
        if (this.service.create(request) != false) {
            return "Successfully created " + request.get("name");
        }
        return "Error creating "+request.get("name");
    }

    @SuppressWarnings("unused")
    abstract String trigger(HttpServletRequest request0, @RequestBody Map<String, String> request);
}
