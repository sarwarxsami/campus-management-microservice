package com.example.create_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.create_service.model.Task;


public interface TaskRepository extends JpaRepository<Task, Integer> {

}