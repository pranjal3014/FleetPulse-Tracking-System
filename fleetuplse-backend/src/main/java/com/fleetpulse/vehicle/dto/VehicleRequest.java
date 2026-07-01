package com.fleetpulse.vehicle.dto;

import com.fleetpulse.common.enums.VehicleStatus;

import com.fleetpulse.common.enums.VehicleType;
import lombok.Data;

@Data
public class VehicleRequest {
	
	private String vehicleNumber;
	private VehicleType vehicleType;
	private VehicleStatus vehicleStatus;
}
