package com.example.create_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.create_service.model.Descriptor;

public interface DescriptorRepo extends JpaRepository<Descriptor, Integer> {

}