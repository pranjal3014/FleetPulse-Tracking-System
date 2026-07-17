package com.fleetpulse.trip.service;

import java.util.List;

import com.fleetpulse.trip.dto.TripResponse;

public interface TripExecutionService {

    void startTrip(Long tripId);
    void completeTrip(Long tripId);
    List<TripResponse> getActiveTrips();
}
