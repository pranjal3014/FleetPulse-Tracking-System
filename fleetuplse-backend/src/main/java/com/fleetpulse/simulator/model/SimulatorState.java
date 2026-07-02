package com.fleetpulse.simulator.model;

import java.util.List;

import com.fleetpulse.route.model.Coordinate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulatorState {

	private Long tripId;
	private Long vehicleId;
	private List<Coordinate> coordinates;
	private Integer currentIndex;
}