package com.fleetpulse.trip.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
	private LocalDateTime tripTime;
	private TripStatus tripStatus;
	private LocalDateTime createdAt;
}
