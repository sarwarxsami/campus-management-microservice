package com.example.reservation_service.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservation_service.model.Reservation;
import com.example.reservation_service.service.ReservationService;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }
public record CreateReservationRequest(
            int userId,
            int resourceId,
            LocalDateTime start,
            int durationMinutes) {}

    @PostMapping
    public Reservation create(@RequestBody CreateReservationRequest req) {
        return service.create(
                req.userId(),
                req.resourceId(),
                req.start(),
                req.durationMinutes());
    }
    @GetMapping
    public List<Reservation> all() {
        return service.findAll();
    }

    @PostMapping("/{id}/confirm")
    public Reservation confirm(@PathVariable int id) {
        return service.confirm(id);
    }

    @PostMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable int id) {
        return service.cancel(id);
    }

    @PostMapping("/{id}/complete")
    public Reservation complete(@PathVariable int id) {
        return service.complete(id);
    }
}