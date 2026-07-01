package com.fleetpulse.vehicle.Controller;

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

import com.fleetpulse.vehicle.dto.VehicleRequest;
import com.fleetpulse.vehicle.dto.VehicleResponse;
import com.fleetpulse.vehicle.service.VehicleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
	private VehicleService vehicleService;

	public VehicleController(VehicleService vehicleService) {
		super();
		this.vehicleService = vehicleService;
	}
	
	@PostMapping("/add")
	public ResponseEntity<VehicleResponse> addTrip(@Valid @RequestBody VehicleRequest vehicle){
		return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.saveVehicle(vehicle));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<VehicleResponse> getById(@PathVariable int id){
		return ResponseEntity.ok(vehicleService.getByIdVehicle(id));
	}
	
	@GetMapping("/")
	public ResponseEntity<List<VehicleResponse>> getAll(){
		return ResponseEntity.ok(vehicleService.getAllVehicle());
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<VehicleResponse> updateById(@PathVariable int id, @Valid @RequestBody VehicleRequest request){
		return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
	}
	
	@DeleteMapping("/{id}")
	public String delete(@PathVariable int id) {
		boolean status = vehicleService.deleteById(id);
		if(status)
			return "Data Deleted Successfully";
		return "Data Not Found";
	}
}
