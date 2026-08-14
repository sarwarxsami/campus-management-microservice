package com.example.create_service.service;

import org.springframework.stereotype.Service;

import com.example.create_service.repository.UserRepo;

@Service
public class AdminService extends UserService{

    public AdminService(UserRepo repo){
        super(repo);
    }

    @Override
    public void setType() {
        this.type=1;
    }

}