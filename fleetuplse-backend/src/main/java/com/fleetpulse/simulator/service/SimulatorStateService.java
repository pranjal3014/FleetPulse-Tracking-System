package com.fleetpulse.simulator.service;

import org.springframework.stereotype.Service;

import com.fleetpulse.route.model.RouteDetails;
import com.fleetpulse.route.service.RouteProvider;
import com.fleetpulse.simulator.cache.SimulatorCache;
import com.fleetpulse.simulator.model.SimulatorState;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.repository.TripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SimulatorStateService {

	private final TripRepository tripRepository;

	private final RouteProvider routeProvider;

	private final SimulatorCache simulatorCache;

	public void initializeTrip(Long tripId) {

		if (simulatorCache.exists(tripId)) {
			return;
		}

		Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip Not Found"));

		RouteDetails routeDetails = routeProvider.getRoute(trip.getPickupLocation(), trip.getDestinationLocation());

		SimulatorState state = SimulatorState.builder().tripId(trip.getTripId())
				.vehicleId(trip.getVehicle().getVehicleId()).coordinates(routeDetails.getCoordinates())
				.currentIndex(0).build();

		simulatorCache.addState(tripId, state);
	}
}