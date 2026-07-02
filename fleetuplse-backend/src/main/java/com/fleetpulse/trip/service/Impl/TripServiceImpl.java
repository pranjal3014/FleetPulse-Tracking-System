package com.fleetpulse.trip.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.driver.entity.Driver;
import com.fleetpulse.driver.exception.DriverNotFoundException;
import com.fleetpulse.driver.repository.DriverRepository;
import com.fleetpulse.trip.dto.TripRequest;
import com.fleetpulse.trip.dto.TripResponse;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.exception.TripNotFoundException;
import com.fleetpulse.trip.repository.TripRepository;
import com.fleetpulse.trip.service.TripService;
import com.fleetpulse.vehicle.entity.Vehicle;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;
import com.fleetpulse.vehicle.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService{
	private final TripRepository tripRepository;
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;

	@Override
	public TripResponse saveTrip(TripRequest request) {
		Trip trip = new Trip();
		Driver driver = driverRepository.findById(request.getDriverId()).orElseThrow(()->new DriverNotFoundException("Driver Not Found"));
		Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow(()-> new VehicleNotFoundException("Vehicle Not Found"));
		
		trip.setDriver(driver);
		trip.setVehicle(vehicle);
		trip.setPickupLocation(request.getPickupLocation());
		trip.setDestinationLocation(request.getDestinationLocation());
		trip.setTripDate(request.getTripDate());
		trip.setTripTime(request.getTripTime());
		trip.setTripStatus(TripStatus.SCHEDULED);
		Trip saveTrip = tripRepository.save(trip);
		return convertToDto(saveTrip);
	}

	@Override
	public TripResponse findByIdTrip(Long id) {
		Trip trip = tripRepository.findById(id).orElseThrow(()->new TripNotFoundException("Trip Not Found"));
		return convertToDto(trip);
	}

	@Override
	public List<TripResponse> findAllTrip() {
		List<Trip> trips = tripRepository.findAll();
		return trips.stream()
				.map(this::convertToDto)
				.toList();
	}

	@Override
	public TripResponse updateTrip(Long id, TripRequest request) {
		Trip trip = tripRepository.findById(id).orElseThrow(()->new TripNotFoundException("Trip Not Found"));
		Driver driver = driverRepository.findById(request.getDriverId()).orElseThrow(()->new DriverNotFoundException("Driver Not Found"));
		Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow(()-> new VehicleNotFoundException("Vehicle Not Found"));
		trip.setDriver(driver);
		trip.setVehicle(vehicle);
		trip.setPickupLocation(request.getPickupLocation());
		trip.setDestinationLocation(request.getDestinationLocation());
		trip.setTripDate(request.getTripDate());
		trip.setTripTime(request.getTripTime());
		
		Trip updateTrip = tripRepository.save(trip);
		return convertToDto(updateTrip);
	}

	@Override
	public boolean deleteById(Long id) {
		Trip trip = tripRepository.findById(id).orElseThrow(()->new TripNotFoundException("Trip Not Found"));
		if(trip != null) {
			tripRepository.deleteById(id);
			return true;
		}
		return false;
	}
	
	private TripResponse convertToDto(Trip trip) {
		return TripResponse.builder()
				.tripId(trip.getTripId())
				.drivername(trip.getDriver().getDriverName())
				.vehicleNumber(trip.getVehicle().getVehicleNumber())
				.pickupLocation(trip.getPickupLocation())
				.destinationLocation(trip.getDestinationLocation())
				.tripDate(trip.getTripDate())
				.tripTime(trip.getTripTime())
				.tripStatus(trip.getTripStatus())
				.createdAt(trip.getCreatedAt())
				.build();
	}
}
