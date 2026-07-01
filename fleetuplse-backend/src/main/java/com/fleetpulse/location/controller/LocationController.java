package com.fleetpulse.location.controller;


import com.fleetpulse.location.dto.LocationRequest;
import com.fleetpulse.location.dto.LocationResponse;
import com.fleetpulse.location.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationResponse> saveLocation(
            @Valid @RequestBody LocationRequest request
            ){
       return ResponseEntity.ok(locationService.saveLocation(request));
    }
    @GetMapping("/latest/{vehicleId}")
    public ResponseEntity<LocationResponse> getLatestLocation(@Valid @PathVariable  Long vehicleId){
        return ResponseEntity.ok(locationService.getLatestLocation(vehicleId));
    }


    @GetMapping("/history/{vehicleId}")
    public ResponseEntity<List<LocationResponse>> getLocationHistory(@Valid @PathVariable Long vehicleId){
        return ResponseEntity.ok(locationService.getVehicleLocationHistory(vehicleId));
    }


}
