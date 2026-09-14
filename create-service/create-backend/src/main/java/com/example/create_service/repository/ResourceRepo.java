package com.example.create_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.create_service.model.Resource;

public interface ResourceRepo extends JpaRepository<Resource, Integer> {

}