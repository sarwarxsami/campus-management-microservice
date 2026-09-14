package com.example.reservation_service.state;

import com.example.reservation_service.exception.InvalidStateTransitionException;
import com.example.reservation_service.model.Reservation;

public final class CancelledState implements ReservationState {

    public static final CancelledState INSTANCE = new CancelledState();

    private CancelledState() {}

    @Override public int code()    { return 2; }
    @Override public String label(){ return "CANCELLED"; }
    @Override public boolean isTerminal() { return true; }

    @Override
    public ReservationState confirm(Reservation r) {
        throw new InvalidStateTransitionException("Cannot confirm a CANCELLED reservation");
    }

    @Override
    public ReservationState cancel(Reservation r) {
        return this;  
    }

    @Override
    public ReservationState complete(Reservation r) {
        throw new InvalidStateTransitionException("Cannot complete a CANCELLED reservation");
    }
}