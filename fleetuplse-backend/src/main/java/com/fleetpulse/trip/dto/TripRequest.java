package com.fleetpulse.trip.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class TripRequest {
	private Long driverId;
	private Long vehicleId;
	private String pickupLocation;
	private String destinationLocation;
	private LocalDate tripDate;
	private LocalTime tripTime;
}
