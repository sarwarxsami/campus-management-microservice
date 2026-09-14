package com.example.reservation_service.state;

import com.example.reservation_service.model.Reservation;


public interface ReservationState {

    int code();

    String label();

    boolean isTerminal();

    ReservationState confirm(Reservation r);
    ReservationState cancel(Reservation r);
    ReservationState complete(Reservation r);
}