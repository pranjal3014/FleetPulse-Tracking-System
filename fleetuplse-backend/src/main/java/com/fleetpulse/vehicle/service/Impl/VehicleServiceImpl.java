package com.fleetpulse.vehicle.service.Impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fleetpulse.vehicle.dto.VehicleRequest;
import com.fleetpulse.vehicle.dto.VehicleResponse;
import com.fleetpulse.vehicle.entity.Vehicle;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;
import com.fleetpulse.vehicle.repository.VehicleRepository;
import com.fleetpulse.vehicle.service.VehicleService;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService{
	
	private final VehicleRepository vehicleRepository;
	

	@Override
	public VehicleResponse saveVehicle(VehicleRequest request) {
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
		vehicle.setVehicleNumber(request.getVehicleNumber());
		vehicle.setVehicleStatus(request.getVehicleStatus());
		vehicle.setVehicleType(request.getVehicleType());
		
		Vehicle updateVehicle = vehicleRepository.save(vehicle);
		return convertToDto(updateVehicle);
	}

	@Override
	public boolean deleteById(Long id) {
		boolean status = false;
		Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->new VehicleNotFoundException("Vehicle Not Found"));
		if(vehicle != null) {
			vehicleRepository.deleteById(id);
			return true;
		}
		return false;
	}

	private VehicleResponse convertToDto(Vehicle vehicle) {
		return VehicleResponse.builder()
				.id(vehicle.getVehicleId())
				.vehicleNumber(vehicle.getVehicleNumber())
				.vehicleType(vehicle.getVehicleType())
				.vehicleStatus(vehicle.getVehicleStatus())
				.createdAt(vehicle.getCreatedAt())
				.build();
	}
}
