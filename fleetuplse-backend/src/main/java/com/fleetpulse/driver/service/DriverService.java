package com.fleetpulse.driver.service;

import java.util.List;

import com.fleetpulse.driver.dto.DriverRequest;
import com.fleetpulse.driver.dto.DriverResponse;

public interface DriverService {

	//add vehicle
		DriverResponse saveVehicle(DriverRequest request);
		
		//get all vehicle
		List<DriverResponse> getAllVehicle();
		
		//get by id
		DriverResponse getByIdVehicle(Long id);
		
		//update 
		DriverResponse updateVehicle(Long id,DriverRequest request);
		
		//delete
		boolean deleteById(Long id);
}
