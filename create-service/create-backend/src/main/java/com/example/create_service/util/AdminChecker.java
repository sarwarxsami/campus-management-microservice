package com.example.create_service.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class AdminChecker {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Check if the current request sender is an admin
     * @param request HttpServletRequest containing the Authorization header
     * @return true if admin, false otherwise
     */
    public boolean isAdmin(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        
        String token = authHeader.substring(7);
        return jwtUtil.isAdmin(token);
    }
}