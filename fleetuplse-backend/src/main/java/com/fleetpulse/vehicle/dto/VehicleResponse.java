package com.fleetpulse.vehicle.dto;

import java.time.LocalDateTime;

import com.fleetpulse.common.enums.VehicleStatus;

import com.fleetpulse.common.enums.VehicleType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleResponse {
	private Long vehicleId;
	private String vehicleNumber;
	private VehicleType vehicleType;
	private VehicleStatus vehicleStatus;
	private LocalDateTime createdAt;
}
