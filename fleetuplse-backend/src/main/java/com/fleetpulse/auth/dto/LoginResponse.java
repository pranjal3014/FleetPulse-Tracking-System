package com.fleetpulse.auth.dto;

import com.fleetpulse.common.enums.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
	private Long userId;
	private String name;
	private String email;
	private Role role;
	private String message;
	private String accessToken;
	private String refreshToken;
}
