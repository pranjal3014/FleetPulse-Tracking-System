package com.fleetpulse.trip.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.trip.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
	boolean existsByDriverDriverIdAndTripStatusIn(Long driverId, List<TripStatus> statuses);

	boolean existsByVehicleVehicleIdAndTripStatusIn(Long vehicleId, List<TripStatus> statuses);
}
