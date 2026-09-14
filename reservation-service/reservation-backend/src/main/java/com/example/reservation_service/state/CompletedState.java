package com.example.reservation_service.state;

import com.example.reservation_service.exception.InvalidStateTransitionException;
import com.example.reservation_service.model.Reservation;

public final class CompletedState implements ReservationState {

    public static final CompletedState INSTANCE = new CompletedState();

    private CompletedState() {}

    @Override public int code()    { return 3; }
    @Override public String label(){ return "COMPLETED"; }
    @Override public boolean isTerminal() { return true; }

    @Override
    public ReservationState confirm(Reservation r) {
        throw new InvalidStateTransitionException("Cannot confirm a COMPLETED reservation");
    }

    @Override
    public ReservationState cancel(Reservation r) {
        throw new InvalidStateTransitionException("Cannot cancel a COMPLETED reservation");
    }

    @Override
    public ReservationState complete(Reservation r) {
        return this;  
    }
}