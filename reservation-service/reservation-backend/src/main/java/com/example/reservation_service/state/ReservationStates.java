package com.example.reservation_service.state;

/**
 * Stateless factory + registry for ReservationState implementations.
 * Keeps the int<->object mapping in one place.
 */
public final class ReservationStates {

    private ReservationStates() {}

    public static ReservationState fromCode(Integer code) {
        if (code == null) return PendingState.INSTANCE;   // default
        return switch (code) {
            case 0 -> PendingState.INSTANCE;
            case 1 -> ConfirmedState.INSTANCE;
            case 2 -> CancelledState.INSTANCE;
            case 3 -> CompletedState.INSTANCE;
            default -> throw new IllegalArgumentException(
                    "Unknown reservation state code: " + code);
        };
    }

    /** Convenience for @PrePersist default. */
    public static int defaultCode() {
        return PendingState.INSTANCE.code();
    }
}