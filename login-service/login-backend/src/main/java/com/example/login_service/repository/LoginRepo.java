package com.example.login_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.login_service.model.User;

@Repository
public interface LoginRepo extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.user_name = :user_name")
    public User findByUser_name(@Param("user_name") String user_name);
}