package com.fleetpulse.driver.dto;

import lombok.Data;

@Data
public class DriverRequest {

	private String driverName;
	private Long driverPhone;
	private Long vehicleId;
}
