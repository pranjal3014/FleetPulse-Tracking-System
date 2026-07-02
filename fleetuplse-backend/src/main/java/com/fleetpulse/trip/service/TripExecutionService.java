package com.fleetpulse.trip.service;

public interface TripExecutionService {

    void startTrip(Long tripId);
    void completeTrip(Long tripId);
}
