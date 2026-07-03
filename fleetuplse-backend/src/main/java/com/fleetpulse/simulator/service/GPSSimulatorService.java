package com.fleetpulse.simulator.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.fleetpulse.location.dto.LocationRequest;
import com.fleetpulse.location.service.LocationService;
import com.fleetpulse.simulator.cache.SimulatorCache;
import com.fleetpulse.simulator.model.SimulatorState;
import com.fleetpulse.trip.service.TripExecutionService;
import com.fleetpulse.route.model.Coordinate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GPSSimulatorService {

	private final SimulatorCache simulatorCache;

	private final LocationService locationService;
	private final TripExecutionService tripExecutionService;

	public void simulateGpsPing() {

		Map<Long, SimulatorState> states = simulatorCache.getAllStates();

		for (SimulatorState state : states.values()) {

			if (state.getCurrentIndex() >= state.getCoordinates().size()) {

				tripExecutionService.completeTrip(state.getTripId());

				simulatorCache.removeState(state.getTripId());

				continue;
			}

			Coordinate coordinate = state.getCoordinates().get(state.getCurrentIndex());

			LocationRequest request = LocationRequest.builder().vehicleId(state.getVehicleId())
					.latitude(coordinate.getLatitude()).longitude(coordinate.getLongitude()).speed(generateSpeed())
					.build();

			locationService.saveLocation(request);

			System.out.println("================================");

			System.out.println("Trip ID      : " + state.getTripId());

			System.out.println("Vehicle ID   : " + state.getVehicleId());

			System.out.println("Coordinate # : " + state.getCurrentIndex());

			System.out.println("Latitude     : " + coordinate.getLatitude());

			System.out.println("Longitude    : " + coordinate.getLongitude());

			System.out.println("Speed        : " + request.getSpeed() + " km/h ");

			System.out.println("================================");

			state.setCurrentIndex(state.getCurrentIndex() + 1);

			System.out.println("Trip : " + state.getTripId() + " Vehicle : " + state.getVehicleId() + " Coordinate : "
					+ state.getCurrentIndex());
		}
	}

	private double generateSpeed() {

		return Math.round((35 + (Math.random() * 25)) * 100.0) / 100.0;
	}
}