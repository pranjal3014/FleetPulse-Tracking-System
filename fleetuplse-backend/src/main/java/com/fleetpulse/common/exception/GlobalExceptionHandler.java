package com.fleetpulse.common.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fleetpulse.driver.exception.DriverNotFoundException;
import com.fleetpulse.location.exception.LocationNotFoundException;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(VehicleNotFoundException.class)
	public ResponseEntity<Map<String, String>> vehicleCustomException(VehicleNotFoundException ex){
		Map<String, String> error = new HashMap<String, String>();
		error.put("message", "Vehicle Not Found");
		return new ResponseEntity<Map<String,String>>(error,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(DriverNotFoundException.class)
	public ResponseEntity<Map<String, String>> driverCustomException(DriverNotFoundException ex){
		Map<String, String> error = new HashMap<String, String>();
		error.put("message", "Driver Not Found");
		return new ResponseEntity<Map<String,String>>(error,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(LocationNotFoundException.class)
	public ResponseEntity<Map<String, String>> locationCustomException(LocationNotFoundException ex){
		Map<String, String> error = new HashMap<String, String>();
		error.put("message", "Location Not Found");
		return new ResponseEntity<Map<String,String>>(error,HttpStatus.BAD_REQUEST);
	}
}
