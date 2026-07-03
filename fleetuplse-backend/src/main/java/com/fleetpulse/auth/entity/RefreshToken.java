package com.fleetpulse.auth.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class RefreshToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long tokenId;
	
	@Column(name="token")
	private String token;
	
	@Column(name="expiry_date")
	private LocalDateTime expireDate;
	
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
}
