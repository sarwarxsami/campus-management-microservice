package com.example.reservation_service.model;

public class Task {
    private int id;
    private String studentId;

    private String task;

    public Task() {
    }

    public Task(int id, String studentId, String task) {
        this.id = id;
        this.studentId = studentId;
        this.task = task;
    }

    public int getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getTask() {
        return task;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void setTask(String task) {
        this.task = task;
    }
}