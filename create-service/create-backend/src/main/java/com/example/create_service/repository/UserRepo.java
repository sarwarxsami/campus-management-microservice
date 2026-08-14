package com.example.create_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.create_service.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {

}