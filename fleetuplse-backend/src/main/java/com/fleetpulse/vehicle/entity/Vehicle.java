package com.fleetpulse.vehicle.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fleetpulse.common.enums.VehicleStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="vehicles")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int vehicleId;
	
	@Column(name="vehicle_number")
	private String vehicleNumber;
	
	@Column(name="vehicle_type")
	private String vehicleType;
	
	@Enumerated(EnumType.STRING)
	private VehicleStatus vehicleStatus;
	
	@CreationTimestamp
    @Column(updatable = false)
	private LocalDateTime createdAt;
}
