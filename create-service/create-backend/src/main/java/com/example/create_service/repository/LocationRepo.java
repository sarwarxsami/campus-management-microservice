package com.example.create_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.create_service.model.Location;

public interface LocationRepo extends JpaRepository<Location, Integer> {

}