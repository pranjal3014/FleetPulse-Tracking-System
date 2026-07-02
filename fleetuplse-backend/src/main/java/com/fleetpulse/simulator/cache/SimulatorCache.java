package com.fleetpulse.simulator.cache;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.fleetpulse.simulator.model.SimulatorState;

@Component
public class SimulatorCache {

	private final Map<Long, SimulatorState> activeTrips = new ConcurrentHashMap<>();

	public void addState(Long tripId, SimulatorState state) {
		activeTrips.put(tripId, state);
	}

	public SimulatorState getState(Long tripId) {
		return activeTrips.get(tripId);
	}

	public Map<Long, SimulatorState> getAllStates() {
		return activeTrips;
	}

	public void removeState(Long tripId) {
		activeTrips.remove(tripId);
	}

	public boolean exists(Long tripId) {
		return activeTrips.containsKey(tripId);
	}
}