package com.example.reservation_service.model;

import java.time.LocalDateTime;

import com.example.reservation_service.state.ReservationState;
import com.example.reservation_service.state.ReservationStates;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "resource_id", nullable = false)
    private int resourceId;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    @Column(name = "duration", nullable = false)
    private int duration;

    // ⚠️ Quoted camelCase column
    @Column(name = "`currentState`")
    private Integer currentState;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private String resourceName;

    @Transient
    private String userName;

    public Reservation() {}

    public Reservation(int id, int resourceId, int userId, LocalDateTime start,
                       int duration, Integer currentState) {
        this.id = id;
        this.resourceId = resourceId;
        this.userId = userId;
        this.start = start;
        this.duration = duration;
        this.currentState = currentState;
    }

    // ─────────────────────────────────────────────
    // State-pattern API — delegates to the state object
    // ─────────────────────────────────────────────

    /** Current state object (never null). */
    @Transient
    public ReservationState state() {
        return ReservationStates.fromCode(currentState);
    }

    /** Human label, e.g. "PENDING". */
    @Transient
    public String stateLabel() {
        return state().label();
    }

    /** Confirm this reservation. Throws if illegal. */
    public void confirm() {
        applyState(state().confirm(this));
    }

    /** Cancel this reservation. Throws if illegal. */
    public void cancel() {
        applyState(state().cancel(this));
    }

    /** Complete this reservation. Throws if illegal. */
    public void complete() {
        applyState(state().complete(this));
    }

    private void applyState(ReservationState next) {
        this.currentState = next.code();
    }

    // ─────────────────────────────────────────────
    // Getters / setters
    // ─────────────────────────────────────────────
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getResourceId() { return resourceId; }
    public void setResourceId(int resourceId) { this.resourceId = resourceId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public LocalDateTime getStart() { return start; }
    public void setStart(LocalDateTime start) { this.start = start; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public Integer getCurrentState() { return currentState; }
    public void setCurrentState(Integer currentState) { this.currentState = currentState; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    @Transient
    public LocalDateTime getEnd() {
        return start.plusMinutes(duration);
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentState == null) {
            currentState = ReservationStates.defaultCode();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}