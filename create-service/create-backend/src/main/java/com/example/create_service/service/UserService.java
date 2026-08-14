package com.example.create_service.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.create_service.model.User;
import com.example.create_service.repository.UserRepo;

@Service
abstract public class UserService implements BaseService {
    UserRepo repo;
    int type;

    public UserService(UserRepo repo) {
        this.repo = repo;
    }

    @Override
    public boolean create(Map<String, String> request) {
        this.setType();
        return repo.save(new User(request.get("name"), request.get("email"), request.get("password"),
                request.get("user_name"), type)) != null;
    }

    abstract void setType();
}
