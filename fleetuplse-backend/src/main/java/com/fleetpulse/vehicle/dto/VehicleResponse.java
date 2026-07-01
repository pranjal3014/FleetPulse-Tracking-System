package com.fleetpulse.vehicle.dto;

import java.time.LocalDateTime;

import com.fleetpulse.common.enums.VehicleStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleResponse {
	private int id;
	private String vehicleNumber;
	private String vehicleType;
	private VehicleStatus vehicleStatus;
	private LocalDateTime createdAt;
}
