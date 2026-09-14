package com.example.reservation_service.state;

import com.example.reservation_service.exception.InvalidStateTransitionException;
import com.example.reservation_service.model.Reservation;

public final class ConfirmedState implements ReservationState {

    public static final ConfirmedState INSTANCE = new ConfirmedState();

    private ConfirmedState() {}

    @Override public int code()    { return 1; }
    @Override public String label(){ return "CONFIRMED"; }
    @Override public boolean isTerminal() { return false; }

    @Override
    public ReservationState confirm(Reservation r) {
        // already confirmed — idempotent no-op
        return this;
    }

    @Override
    public ReservationState cancel(Reservation r) {
        return CancelledState.INSTANCE;
    }

    @Override
    public ReservationState complete(Reservation r) {
        return CompletedState.INSTANCE;
    }
}