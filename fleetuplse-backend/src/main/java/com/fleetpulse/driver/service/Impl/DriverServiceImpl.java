package com.fleetpulse.driver.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fleetpulse.driver.dto.DriverRequest;
import com.fleetpulse.driver.dto.DriverResponse;
import com.fleetpulse.driver.entity.Driver;
import com.fleetpulse.driver.exception.DriverNotFoundException;
import com.fleetpulse.driver.repository.DriverRepository;
import com.fleetpulse.driver.service.DriverService;
import com.fleetpulse.vehicle.entity.Vehicle;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;
import com.fleetpulse.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService{
	
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;
	
	@Override
	public DriverResponse saveVehicle(DriverRequest request) {
		Driver driver = new Driver();
		Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
		        .orElseThrow(() ->
		            new VehicleNotFoundException("Vehicle Not Found"));
		
		driver.setDriverName(request.getDriverName());
		driver.setDriverPhone(request.getDriverPhone());
		driver.setVehicle(vehicle);
		Driver saveDriver = driverRepository.save(driver);
		return convertToDto(saveDriver);
	}

	@Override
	public List<DriverResponse> getAllVehicle() {
		List<Driver> drivers = driverRepository.findAll();
		return drivers.stream()
				.map(this::convertToDto).toList();
	}

	@Override
	public DriverResponse getByIdVehicle(Long id) {
		Driver driver = driverRepository.findById(id).orElseThrow(()->new DriverNotFoundException("Driver Not Found"));
		return convertToDto(driver);
	}

	@Override
	public DriverResponse updateVehicle(Long id, DriverRequest request) {
		Driver driver = driverRepository.findById(id).orElseThrow(()->new DriverNotFoundException("Driver Not Found"));
		Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
		        .orElseThrow(() ->
		            new VehicleNotFoundException("Vehicle Not Found"));
		driver.setDriverName(request.getDriverName());
		driver.setDriverPhone(request.getDriverPhone());
		driver.setVehicle(vehicle);
		Driver updateDriver = driverRepository.save(driver);
		return convertToDto(updateDriver);
	}

	@Override
	public boolean deleteById(Long id) {
		boolean status = false;
		Driver driver = driverRepository.findById(id).orElseThrow(()->new DriverNotFoundException("Driver Not Found"));
		if(driver != null) {
			driverRepository.deleteById(id);
			return true;
		}
		return false;
	}
	
	private DriverResponse convertToDto(Driver driver) {
		return DriverResponse.builder()
				.driverId(driver.getDriverId())
				.driverName(driver.getDriverName())
				.driverPhone(driver.getDriverPhone())
				.vehicleId(driver.getVehicle() != null ? driver.getVehicle().getVehicleId() : null)
				.vehicleNumber(driver.getVehicle() != null ? driver.getVehicle().getVehicleNumber() : null)
				.build();
	}
	
}
