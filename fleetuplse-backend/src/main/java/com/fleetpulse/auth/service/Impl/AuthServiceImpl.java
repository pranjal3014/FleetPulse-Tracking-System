package com.fleetpulse.auth.service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fleetpulse.auth.dto.DriverRegisterRequest;
import com.fleetpulse.auth.dto.LoginRequest;
import com.fleetpulse.auth.dto.LoginResponse;
import com.fleetpulse.auth.dto.RefreshTokenRequest;
import com.fleetpulse.auth.dto.RefreshTokenResponse;
import com.fleetpulse.auth.dto.UserResponse;
import com.fleetpulse.auth.entity.RefreshToken;
import com.fleetpulse.auth.entity.User;
import com.fleetpulse.auth.exception.ApprovalPendingException;
import com.fleetpulse.auth.exception.EmailAlreadyExistsException;
import com.fleetpulse.auth.exception.InvalidCredentialsException;
import com.fleetpulse.auth.exception.UserNotFoundException;
import com.fleetpulse.auth.repository.RefreshTokenRepository;
import com.fleetpulse.auth.repository.UserRepository;
import com.fleetpulse.auth.security.JwtService;
import com.fleetpulse.auth.service.AuthService;
import com.fleetpulse.common.enums.ApprovalStatus;
import com.fleetpulse.common.enums.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	public UserResponse registerDriver(DriverRegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new EmailAlreadyExistsException("Email is Already Exists");
		}

		User user = new User();

		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setApprovalStatus(ApprovalStatus.PENDING);
		user.setRole(Role.DRIVER);

		User saveUser = userRepository.save(user);
		return convertToDto(saveUser);
	}

	@Override
	public List<UserResponse> getPendingDrivers() {

		return userRepository.findAll().stream().filter(user -> user.getRole() == Role.DRIVER)
				.filter(user -> user.getApprovalStatus() == ApprovalStatus.PENDING).map(this::convertToDto).toList();
	}

	@Override
	public UserResponse approveDriver(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User Not Found"));

		user.setApprovalStatus(ApprovalStatus.APPROVED);

		User updatedUser = userRepository.save(user);

		return convertToDto(updatedUser);
	}

	@Override
	public UserResponse rejectDriver(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User Not Found"));

		user.setApprovalStatus(ApprovalStatus.REJECTED);

		User updatedUser = userRepository.save(user);

		return convertToDto(updatedUser);
	}

	@Override
	public LoginResponse login(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new UserNotFoundException("User Not Found"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

			throw new InvalidCredentialsException("Invalid Email or Password");
		}

		if (user.getApprovalStatus() == ApprovalStatus.PENDING) {

			throw new ApprovalPendingException("Admin Approval Pending");
		}

		String accessToken = jwtService.generateToken(user.getEmail());

		RefreshToken refreshToken = createRefreshToken(user);

		return LoginResponse.builder().userId(user.getUserId()).name(user.getName()).email(user.getEmail())
				.role(user.getRole()).accessToken(accessToken).refreshToken(refreshToken.getToken())
				.message("Login Successful").build();
	}

	private RefreshToken createRefreshToken(User user) {

	    refreshTokenRepository.deleteByUser(user);

	    RefreshToken refreshToken = new RefreshToken();

	    refreshToken.setUser(user);
	    refreshToken.setToken(UUID.randomUUID().toString());
	    refreshToken.setExpireDate(
	            LocalDateTime.now().plusDays(7)
	    );

	    return refreshTokenRepository.save(refreshToken);
	}

	private UserResponse convertToDto(User user) {
		return UserResponse.builder().userId(user.getUserId()).name(user.getName()).email(user.getEmail())
				.role(user.getRole()).approvalStatus(user.getApprovalStatus()).build();
	}

	@Override
	public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {

		RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
				.orElseThrow(() -> new RuntimeException("Invalid Refresh Token"));

		if (refreshToken.getExpireDate().isBefore(LocalDateTime.now())) {

			throw new RuntimeException("Refresh Token Expired");
		}

		String accessToken = jwtService.generateToken(refreshToken.getUser().getEmail());

		return RefreshTokenResponse.builder().accessToken(accessToken).build();
	}

	@Override
	public void logout(String refreshToken) {

		refreshTokenRepository.deleteByToken(refreshToken);
	}
}
