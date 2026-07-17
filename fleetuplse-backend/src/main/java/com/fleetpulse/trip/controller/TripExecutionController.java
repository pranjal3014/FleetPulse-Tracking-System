package com.fleetpulse.trip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fleetpulse.simulator.service.SimulatorStateService;
import com.fleetpulse.trip.dto.TripResponse;
import com.fleetpulse.trip.service.TripExecutionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripExecutionController {
	private final SimulatorStateService simulatorStateService;
	private final TripExecutionService tripExecutionService;

	@PostMapping("/{tripId}/start")
	public ResponseEntity<String> startTrip(@PathVariable Long tripId) {

		tripExecutionService.startTrip(tripId);

		simulatorStateService.initializeTrip(tripId);

		return ResponseEntity.ok("Trip Started Successfully");
	}

	@GetMapping("/active")
	public ResponseEntity<List<TripResponse>> getActiveTrips() {

		return ResponseEntity.ok(tripExecutionService.getActiveTrips());
	}
}