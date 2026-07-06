package com.fleetpulse.auth.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final String SECRET_KEY = "fleetpulsefleetpulsefleetpulsefleetpulsefleetpulse";

	private Key getSigningKey() {

		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(String email) {

		return Jwts.builder().subject(email).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)).signWith((SecretKey) getSigningKey())
				.compact();
	}

	public String extractEmail(String token) {

		return extractClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, String email) {

		String extractedEmail = extractEmail(token);

		return extractedEmail.equals(email) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {

		return extractClaims(token).getExpiration().before(new Date());
	}

	private Claims extractClaims(String token) {

		return Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(token).getPayload();
	}
}