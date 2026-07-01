package com.fleetpulse.driver.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetpulse.driver.dto.DriverRequest;
import com.fleetpulse.driver.dto.DriverResponse;
import com.fleetpulse.driver.service.DriverService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/drivers")
public class DriverController {
	private final DriverService driverService;
	
	@PostMapping("/add")
	public ResponseEntity<DriverResponse> addDriver(@Valid @RequestBody DriverRequest vehicle){
		return ResponseEntity.status(HttpStatus.CREATED).body(driverService.saveVehicle(vehicle));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<DriverResponse> getById(@PathVariable Long id){
		return ResponseEntity.ok(driverService.getByIdVehicle(id));
	}
	
	@GetMapping("/")
	public ResponseEntity<List<DriverResponse>> getAll(){
		return ResponseEntity.ok(driverService.getAllVehicle());
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<DriverResponse> updateById(@PathVariable Long id, @Valid @RequestBody DriverRequest request){
		return ResponseEntity.ok(driverService.updateVehicle(id, request));
	}
	
	@DeleteMapping("/{id}")
	public String delete(@PathVariable Long id) {
		boolean status = driverService.deleteById(id);
		if(status)
			return "Data Deleted Successfully";
		return "Data Not Found";
	}
}
