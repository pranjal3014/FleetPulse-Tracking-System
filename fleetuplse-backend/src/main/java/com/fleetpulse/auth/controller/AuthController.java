package com.fleetpulse.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fleetpulse.auth.dto.DriverRegisterRequest;
import com.fleetpulse.auth.dto.LoginRequest;
import com.fleetpulse.auth.dto.LoginResponse;
import com.fleetpulse.auth.dto.RefreshTokenRequest;
import com.fleetpulse.auth.dto.RefreshTokenResponse;
import com.fleetpulse.auth.dto.UserResponse;
import com.fleetpulse.auth.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register-driver")
	public ResponseEntity<UserResponse> registerDriver(@RequestBody DriverRegisterRequest request) {

		return new ResponseEntity<>(authService.registerDriver(request), HttpStatus.CREATED);
	}

	@GetMapping("/pending-drivers")
	public ResponseEntity<?> getPendingDrivers() {

		return ResponseEntity.ok(authService.getPendingDrivers());
	}

	@PutMapping("/approve-driver/{id}")
	public ResponseEntity<UserResponse> approveDriver(@PathVariable Long id) {

		return ResponseEntity.ok(authService.approveDriver(id));
	}

	@PutMapping("/reject-driver/{id}")
	public ResponseEntity<UserResponse> rejectDriver(@PathVariable Long id) {

		return ResponseEntity.ok(authService.rejectDriver(id));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

		return ResponseEntity.ok(authService.login(request));
	}

	@PostMapping("/refresh")
	public ResponseEntity<RefreshTokenResponse> refresh(@RequestBody RefreshTokenRequest request) {
		return ResponseEntity.ok(authService.refreshToken(request));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(@RequestBody RefreshTokenRequest request) {
		authService.logout(request.getRefreshToken());
		return ResponseEntity.noContent().build();
	}
}
