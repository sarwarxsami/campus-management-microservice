package com.example.login_service.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.login_service.model.User;
import com.example.login_service.repository.LoginRepo;
import com.example.login_service.util.JwtUtil;

@Service
public class LoginService {
    LoginRepo repo;
    JwtUtil jwtUtil;

    public LoginService(LoginRepo repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    public String checkUser(Map<String, String> request) {
        String user_name = request.get("user_name");
        String password = request.get("password");
        
        if (user_name == null || password == null) {
            return null;
        }
        
        User user = repo.findByUser_name(user_name);
        
        if (user != null && user.getPassword().equals(password)) {
            return jwtUtil.generateToken(user.getuser_name(), user.getId(), String.valueOf(user.getType()));
        }
        
        return null;
    }
}