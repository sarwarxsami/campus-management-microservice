package com.example.update_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.update_service.model.Task;


public interface TaskRepository extends JpaRepository<Task, Integer> {

}