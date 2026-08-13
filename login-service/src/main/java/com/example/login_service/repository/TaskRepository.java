package com.example.login_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.login_service.model.Task;


public interface TaskRepository extends JpaRepository<Task, Integer> {

}