package com.fleetpulse.trip.controller;

import com.fleetpulse.trip.service.TripExecutionService;
import com.fleetpulse.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
public class TripExecutionController {

    private final TripExecutionService tripExecutionService;



    @PostMapping("/{id}/start")
    public ResponseEntity<String> startTrip(@PathVariable Long id){
        tripExecutionService.startTrip(id);
        return ResponseEntity.ok("Trip Started Successfully");
    }
}
