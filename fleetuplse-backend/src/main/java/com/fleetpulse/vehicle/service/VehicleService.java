package com.fleetpulse.vehicle.service;

import java.util.List;

import com.fleetpulse.vehicle.dto.VehicleRequest;
import com.fleetpulse.vehicle.dto.VehicleResponse;

public interface VehicleService{
	
	//add vehicle
	VehicleResponse saveVehicle(VehicleRequest request);
	
	//get all vehicle
	List<VehicleResponse> getAllVehicle();
	
	//get by id
	VehicleResponse getByIdVehicle(Long id);
	
	//update 
	VehicleResponse updateVehicle(Long id,VehicleRequest request);
	
	//delete
	boolean deleteById(Long id);
}
