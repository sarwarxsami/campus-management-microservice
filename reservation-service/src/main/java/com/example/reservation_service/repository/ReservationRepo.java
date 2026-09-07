package com.example.reservation_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reservation_service.model.Reservation;

public interface ReservationRepo extends JpaRepository<Reservation, Integer> {
    
}
    