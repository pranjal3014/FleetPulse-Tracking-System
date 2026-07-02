package com.fleetpulse.trip.service.Impl;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.route.model.RouteDetails;
import com.fleetpulse.route.service.RouteProvider;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.exception.TripNotFoundException;
import com.fleetpulse.trip.repository.TripRepository;
import com.fleetpulse.trip.service.TripExecutionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class TripExecutionServiceImpl implements TripExecutionService {

    private final TripRepository tripRepository;
    private final RouteProvider routeProvider;

    @Override
    public void startTrip(Long tripId) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new TripNotFoundException("Trip Not Found"));

        if (trip.getTripStatus() != TripStatus.SCHEDULED) {
            throw new IllegalStateException(
                    "Only scheduled trips can be started."
            );
        }
        RouteDetails route =
                routeProvider.getRoute(
                        trip.getPickupLocation(),
                        trip.getDestinationLocation()
                );


        trip.setTripStatus(TripStatus.IN_PROGRESS);

        tripRepository.save(trip);



        System.out.println("Distance : " + route.getDistanceKm());
        System.out.println("Duration : " + route.getDurationHours());
        System.out.println("Points : " + route.getCoordinates().size());

    }
}
