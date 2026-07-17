package com.fleetpulse.trip.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.driver.entity.Driver;
import com.fleetpulse.vehicle.entity.Vehicle;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="trips")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Trip {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long tripId;
	
	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(name = "driver_id", nullable = false)
	private Driver driver;
	
     @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(name = "vehicle_id", nullable = false)
	 private Vehicle vehicle;
	
	@Column(name="pickup_location")
	private String pickupLocation;
	
	@Column(name="destination")
	private String destinationLocation;

	@Column(name="trip_date")
	private LocalDate tripDate;
	
	@Column(name="trip_time")
	private LocalTime tripTime;
	
	@CreationTimestamp
	@Column(name="created_at")
	private LocalDateTime createdAt;
	
	@Enumerated(EnumType.STRING)
	private TripStatus tripStatus;
}
