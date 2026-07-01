package com.fleetpulse.vehicle.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fleetpulse.common.enums.VehicleType;
import org.hibernate.annotations.CreationTimestamp;

import com.fleetpulse.common.enums.VehicleStatus;
import com.fleetpulse.driver.entity.Driver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
	private Long vehicleId;
	
	@Column(name="vehicle_number")
	private String vehicleNumber;
	
	@Column(name="vehicle_type")
    @Enumerated(EnumType.STRING)
	private VehicleType vehicleType;
	
	@Enumerated(EnumType.STRING)
	private VehicleStatus vehicleStatus;
	
	@CreationTimestamp
    @Column(updatable = false)
	private LocalDateTime createdAt;
	
	@OneToMany(mappedBy = "vehicle")
	private List<Driver> drivers;
}
