package com.example.reservation_service.exception;

public class ReservationConflictException extends RuntimeException {

    private final int resourceId;
    private final java.time.LocalDateTime start;
    private final java.time.LocalDateTime end;

    public ReservationConflictException(int resourceId,
                                        java.time.LocalDateTime start,
                                        java.time.LocalDateTime end) {
        super("Resource " + resourceId + " is already reserved for the period "
              + start + " – " + end);
        this.resourceId = resourceId;
        this.start = start;
        this.end = end;
    }

    public int getResourceId() { return resourceId; }
    public java.time.LocalDateTime getStart() { return start; }
    public java.time.LocalDateTime getEnd()   { return end; }
}