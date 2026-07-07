package com.fleetpulse.driver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverResponse {

	private Long driverId;
	private String driverName;
	private Long driverPhone;
	private Long vehicleId;
	private String vehicleNumber;
}
