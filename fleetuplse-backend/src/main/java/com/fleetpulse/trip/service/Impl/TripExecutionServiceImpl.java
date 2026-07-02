package com.fleetpulse.trip.service.Impl;

import org.springframework.stereotype.Service;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.exception.TripNotFoundException;
import com.fleetpulse.trip.repository.TripRepository;
import com.fleetpulse.trip.service.TripExecutionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripExecutionServiceImpl implements TripExecutionService {

	private final TripRepository tripRepository;

	@Override
	public void startTrip(Long tripId) {

		Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new TripNotFoundException("Trip Not Found"));

		trip.setTripStatus(TripStatus.IN_PROGRESS);

		tripRepository.save(trip);

		System.out.println("Trip Started : " + tripId);
	}

	@Override
	public void completeTrip(Long tripId) {

		Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new TripNotFoundException("Trip Not Found"));

		trip.setTripStatus(TripStatus.COMPLETED);

		tripRepository.save(trip);
	}

}