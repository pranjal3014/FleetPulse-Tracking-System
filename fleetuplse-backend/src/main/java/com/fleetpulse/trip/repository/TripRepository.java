package com.fleetpulse.trip.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fleetpulse.trip.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long>{

}
