package com.fleetpulse.vehicle.dto;

import com.fleetpulse.common.enums.VehicleStatus;

import lombok.Data;

@Data
public class VehicleRequest {
	
	private String vehicleNumber;
	private String vehicleType;
	private VehicleStatus vehicleStatus;
}
