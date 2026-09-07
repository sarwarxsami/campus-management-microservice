package com.example.reservation_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservation_service.model.Reservation;
import com.example.reservation_service.repository.ReservationRepo;

@RestController
public class SearchController {
    ReservationRepo repo;
    public SearchController(ReservationRepo repo) {
        this.repo=repo;
    }

    @GetMapping("/search")
    public List<Reservation> getAllReservation(){
        return repo.findAll();
    }
}
