package com.example.reservation_service.state;


public final class ReservationStates {

    private ReservationStates() {}

    public static ReservationState fromCode(Integer code) {
        if (code == null) return PendingState.INSTANCE;  
        return switch (code) {
            case 0 -> PendingState.INSTANCE;
            case 1 -> ConfirmedState.INSTANCE;
            case 2 -> CancelledState.INSTANCE;
            case 3 -> CompletedState.INSTANCE;
            default -> throw new IllegalArgumentException(
                    "Unknown reservation state code: " + code);
        };
    }

    public static int defaultCode() {
        return PendingState.INSTANCE.code();
    }
}