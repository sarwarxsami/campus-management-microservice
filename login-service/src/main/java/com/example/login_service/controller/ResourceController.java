package com.example.login_service.controller;

import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login_service.model.Task;
import com.example.login_service.service.UserService;

@RestController
public class ResourceController {
    private final UserService service;

    public ResourceController(UserService service) {
        this.service = service;
    }

    @GetMapping("/debug")
public String debug(@Autowired DataSource dataSource) throws Exception {
    var conn = dataSource.getConnection();

    return 
        "Database: " + conn.getCatalog() +
        "\nUser: " + conn.getMetaData().getUserName() +
        "\nURL: " + conn.getMetaData().getURL();
}

    @GetMapping("/service/task-service/show/task")
    public List<Task> getTasks() {
        return service.getTasks();
    }

}