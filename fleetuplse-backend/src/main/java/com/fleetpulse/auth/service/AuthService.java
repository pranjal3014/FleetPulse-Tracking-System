package com.fleetpulse.auth.service;

import java.util.List;

import com.fleetpulse.auth.dto.DriverRegisterRequest;
import com.fleetpulse.auth.dto.LoginRequest;
import com.fleetpulse.auth.dto.LoginResponse;
import com.fleetpulse.auth.dto.RefreshTokenRequest;
import com.fleetpulse.auth.dto.RefreshTokenResponse;
import com.fleetpulse.auth.dto.UserResponse;

public interface AuthService {

	UserResponse registerDriver(DriverRegisterRequest request);

	List<UserResponse> getPendingDrivers();

	UserResponse approveDriver(Long userId);

	UserResponse rejectDriver(Long userId);

	LoginResponse login(LoginRequest request);
	
	RefreshTokenResponse refreshToken(RefreshTokenRequest request);
	
	void logout(String refreshToken);
}