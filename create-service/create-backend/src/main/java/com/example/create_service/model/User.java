package com.example.create_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "base_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_id_seq", initialValue = 1000, // Starting value
            allocationSize = 1
    )
    private int id;
    private String name;
    private String user_name;
    private String email;
    private String password;
    private int user_type;

    public void setuser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getuser_name() {
        return user_name;
    }

    public int getType() {
        return user_type;
    }

    public User() {
        // Required by JPA
    }

    public User(String name, String email, String password, String user_name, int type) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.user_type = type;
        this.user_name = user_name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int isType() {
        return user_type;
    }

    public void setType(int type) {
        this.user_type = type;
    }

}
