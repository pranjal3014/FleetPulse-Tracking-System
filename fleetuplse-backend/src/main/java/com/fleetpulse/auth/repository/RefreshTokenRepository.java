package com.fleetpulse.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fleetpulse.auth.entity.RefreshToken;
import com.fleetpulse.auth.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByToken(String token);

	void deleteByToken(String token);

	void deleteByUser(User user);
}
