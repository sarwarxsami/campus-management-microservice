package com.example.reservation_service.state;

import com.example.reservation_service.model.Reservation;

/**
 * State pattern: each concrete state decides what actions are legal
 * and what the next state is.
 */
public interface ReservationState {

    /** Numeric code persisted in reservation."currentState". */
    int code();

    /** Human label, e.g. "PENDING". */
    String label();

    /** Whether this state is terminal (no transitions out). */
    boolean isTerminal();

    /**
     * Perform a transition. Each state either returns the next state
     * or throws InvalidStateTransitionException.
     */
    ReservationState confirm(Reservation r);
    ReservationState cancel(Reservation r);
    ReservationState complete(Reservation r);
}