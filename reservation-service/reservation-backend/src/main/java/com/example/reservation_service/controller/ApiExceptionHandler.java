package com.example.reservation_service.controller;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.reservation_service.exception.InvalidStateTransitionException;
import com.example.reservation_service.exception.ReservationConflictException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTransition(
            InvalidStateTransitionException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "error", "invalid_state_transition",
                "message", ex.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "not_found",
                "message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "bad_request",
                "message", ex.getMessage()));
    }

    @ExceptionHandler(ReservationConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ReservationConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "error", "reservation_conflict",
                "message", ex.getMessage(),
                "resourceId", ex.getResourceId(),
                "start", ex.getStart().toString(),
                "end", ex.getEnd().toString()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleIntegrity(DataIntegrityViolationException ex) {
        Throwable cause = ex.getMostSpecificCause();
        String msg = cause.getMessage() == null ? "" : cause.getMessage();

        if (msg.contains("no_overlapping_active_reservation")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "reservation_conflict",
                    "message", "Resource already reserved for an overlapping period"));
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "error", "integrity_violation",
                "message", msg));
    }
}