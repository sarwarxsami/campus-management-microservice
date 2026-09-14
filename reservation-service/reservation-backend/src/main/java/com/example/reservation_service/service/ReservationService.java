package com.example.reservation_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.reservation_service.exception.ReservationConflictException;
import com.example.reservation_service.model.Reservation;
import com.example.reservation_service.repository.ReservationRepo;

@Service
public class ReservationService {

    protected final ReservationRepo repo;

    public ReservationService(ReservationRepo repo) {
        this.repo = repo;
    }

    /**
     * Create a reservation, rejecting if the time slot conflicts with an
     * existing PENDING or CONFIRMED reservation on the same resource.
     */
    @Transactional
    public Reservation create(int userId,
            int resourceId,
            LocalDateTime start,
            int durationMinutes) {

        if (durationMinutes <= 0) {
            throw new IllegalArgumentException("duration must be positive");
        }

        LocalDateTime end = start.plusMinutes(durationMinutes);

        if (repo.existsOverlap(resourceId, start, end)) {
            throw new ReservationConflictException(resourceId, start, end);
        }

        Reservation r = new Reservation();
        r.setUserId(userId);
        r.setResourceId(resourceId);
        r.setStart(start);
        r.setDuration(durationMinutes);
        // currentState defaults to PENDING via @PrePersist

        return repo.save(r);
    }

    @Transactional
    public Reservation confirm(int id) {
        Reservation r = load(id);
        r.confirm();
        return repo.save(r);
    }

    @Transactional
    public Reservation cancel(int id) {
        Reservation r = load(id);
        r.cancel();
        return repo.save(r);
    }

    @Transactional
    public Reservation complete(int id) {
        Reservation r = load(id);
        r.complete();
        return repo.save(r);
    }

    public Reservation load(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reservation " + id));
    }

    public List<Reservation> findAll() {
        return repo.findAll();
    }
}