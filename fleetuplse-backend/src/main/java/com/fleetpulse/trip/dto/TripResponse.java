package com.fleetpulse.trip.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fleetpulse.common.enums.TripStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TripResponse {
	private Long tripId;
	private String drivername;
	private String vehicleNumber;
	private String pickupLocation;
	private String destinationLocation;
	private LocalDate tripDate;
	private LocalTime tripTime;
	private TripStatus tripStatus;
	private LocalDateTime createdAt;
}
