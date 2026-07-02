package com.fleetpulse.trip.controller;

import java.util.List;

import com.fleetpulse.route.model.RouteDetails;
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

import com.fleetpulse.trip.dto.TripRequest;
import com.fleetpulse.trip.dto.TripResponse;
import com.fleetpulse.trip.service.TripService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
public class TripController {
	private final TripService tripService;
	
	@PostMapping("/add")
	public ResponseEntity<TripResponse> addTrip(@Valid @RequestBody TripRequest request){
		return ResponseEntity.status(HttpStatus.CREATED).body(tripService.saveTrip(request));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<TripResponse> getTripById(@PathVariable Long id){
		return ResponseEntity.ok(tripService.findByIdTrip(id));
	}
	
	@GetMapping
	public ResponseEntity<List<TripResponse>> getAllTrip(){
		return ResponseEntity.ok(tripService.findAllTrip());
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<TripResponse> updateTripById(@PathVariable Long id, @Valid @RequestBody TripRequest request){
		return ResponseEntity.ok(tripService.updateTrip(id, request));
	}
	
	@DeleteMapping("/{id}")
	public String deleteTripById(@PathVariable Long id) {
		boolean status = tripService.deleteById(id);
		if(status)
			return "Data Deleted Successfully";
		return "Data Not Found";
	}

    @GetMapping("/{id}/route")
    public ResponseEntity<RouteDetails> getTripRoute(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tripService.getTripRoute(id)
        );
    }
}
