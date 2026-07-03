package com.fleetpulse.trip.service;

import java.util.List;

import com.fleetpulse.route.model.RouteDetails;
import com.fleetpulse.trip.dto.TripRequest;
import com.fleetpulse.trip.dto.TripResponse;

public interface TripService {
	//add
		TripResponse saveTrip(TripRequest request);
		
		//get
		TripResponse findByIdTrip(Long id);
		
		//get All
		List<TripResponse> findAllTrip();
		
		//update
		TripResponse updateTrip(Long id,TripRequest request);
		
		//delete
		boolean deleteById(Long id);

    RouteDetails getTripRoute(Long tripId);
    List<TripResponse> getActiveTrips();
}
