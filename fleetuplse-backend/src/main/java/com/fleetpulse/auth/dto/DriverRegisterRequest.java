package com.fleetpulse.auth.dto;

import lombok.Data;

@Data
public class DriverRegisterRequest {
	private String name;
	private String email;
	private String password;
}
