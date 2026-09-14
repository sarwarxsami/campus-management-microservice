package com.example.reservation_service.state;

import com.example.reservation_service.exception.InvalidStateTransitionException;
import com.example.reservation_service.model.Reservation;

public final class PendingState implements ReservationState {

    public static final PendingState INSTANCE = new PendingState();

    private PendingState() {}

    @Override public int code()    { return 0; }
    @Override public String label(){ return "PENDING"; }
    @Override public boolean isTerminal() { return false; }

    @Override
    public ReservationState confirm(Reservation r) {
        // side effects allowed here
        return ConfirmedState.INSTANCE;
    }

    @Override
    public ReservationState cancel(Reservation r) {
        return CancelledState.INSTANCE;
    }

    @Override
    public ReservationState complete(Reservation r) {
        throw new InvalidStateTransitionException(
                "Cannot complete a PENDING reservation; confirm it first");
    }
}