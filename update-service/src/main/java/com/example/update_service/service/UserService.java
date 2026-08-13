package com.example.update_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.update_service.model.Task;
import com.example.update_service.repository.TaskRepository;

@Service
public class UserService {

    private final TaskRepository repository;

    public UserService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getTasks() {
        return repository.findAll();
    }

}