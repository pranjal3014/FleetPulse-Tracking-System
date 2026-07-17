package com.fleetpulse.vehicle.service.Impl;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.driver.entity.Driver;
import com.fleetpulse.driver.repository.DriverRepository;
import com.fleetpulse.location.repository.LocationRepository;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.repository.TripRepository;
import com.fleetpulse.vehicle.dto.VehicleRequest;
import com.fleetpulse.vehicle.dto.VehicleResponse;
import com.fleetpulse.vehicle.entity.Vehicle;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;
import com.fleetpulse.vehicle.repository.VehicleRepository;
import com.fleetpulse.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService{
	
	private final VehicleRepository vehicleRepository;
	private final DriverRepository driverRepository;
	private final TripRepository tripRepository;
	private final LocationRepository locationRepository;

	@Override
	public VehicleResponse saveVehicle(VehicleRequest request) {
		if (vehicleRepository.existsByVehicleNumberIgnoreCase(request.getVehicleNumber())) {
			throw new IllegalArgumentException("Vehicle number already exists");
		}

		Vehicle vehicle = new Vehicle();
		vehicle.setVehicleNumber(request.getVehicleNumber());
		vehicle.setVehicleStatus(request.getVehicleStatus());
		vehicle.setVehicleType(request.getVehicleType());
		
		Vehicle saveVehicle = vehicleRepository.save(vehicle);
		return convertToDto(saveVehicle);
	}

	@Override
	public List<VehicleResponse> getAllVehicle() {
		List<Vehicle> vehicles = vehicleRepository.findAll();
		return vehicles.stream()
				.map(this::convertToDto).toList();
	}

	@Override
	public VehicleResponse getByIdVehicle(Long id) {
		Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->new VehicleNotFoundException("Vehicle Not Found"));
		return convertToDto(vehicle);
	}

	@Override
	public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
		Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->new VehicleNotFoundException("Vehicle Not Found"));
		if (vehicleRepository.existsByVehicleNumberIgnoreCaseAndVehicleIdNot(request.getVehicleNumber(), id)) {
			throw new IllegalArgumentException("Vehicle number already exists");
		}

		vehicle.setVehicleNumber(request.getVehicleNumber());
		vehicle.setVehicleStatus(request.getVehicleStatus());
		vehicle.setVehicleType(request.getVehicleType());
		
		Vehicle updateVehicle = vehicleRepository.save(vehicle);
		return convertToDto(updateVehicle);
	}

	@Override
	@Transactional
	public boolean deleteById(Long id) {
		boolean status = false;
		Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->new VehicleNotFoundException("Vehicle Not Found"));
		if(vehicle != null) {
			List<TripStatus> activeStatuses = List.of(TripStatus.SCHEDULED, TripStatus.IN_PROGRESS);
			if (tripRepository.existsByVehicleVehicleIdAndTripStatusIn(id, activeStatuses)) {
				throw new IllegalArgumentException("Cancel active trips before removing this vehicle");
			}

			List<Driver> assignedDrivers = driverRepository.findByVehicleVehicleId(id);
			assignedDrivers.forEach(driver -> driver.setVehicle(null));
			driverRepository.saveAll(assignedDrivers);

			List<Trip> cancelledTrips = tripRepository.findByVehicleVehicleIdAndTripStatus(id, TripStatus.CANCELLED);
			tripRepository.deleteAll(cancelledTrips);

			locationRepository.deleteByVehicleVehicleId(id);

			try {
				vehicleRepository.deleteById(id);
				vehicleRepository.flush();
			} catch (DataIntegrityViolationException ex) {
				throw new IllegalArgumentException("Cannot remove vehicle because it is still referenced by another record");
			}
			return true;
		}
		return false;
	}

	private VehicleResponse convertToDto(Vehicle vehicle) {
		return VehicleResponse.builder()
				.vehicleId(vehicle.getVehicleId())
				.vehicleNumber(vehicle.getVehicleNumber())
				.vehicleType(vehicle.getVehicleType())
				.vehicleStatus(vehicle.getVehicleStatus())
				.createdAt(vehicle.getCreatedAt())
				.build();
	}
}
