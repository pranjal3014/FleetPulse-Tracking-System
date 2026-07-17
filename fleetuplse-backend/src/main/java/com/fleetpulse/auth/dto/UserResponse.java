package com.fleetpulse.auth.dto;

import com.fleetpulse.common.enums.ApprovalStatus;
import com.fleetpulse.common.enums.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

	private Long userId;
	private String name;
	private String email;
	private Role role;
	private ApprovalStatus approvalStatus;
}
