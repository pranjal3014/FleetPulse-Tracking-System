package com.fleetpulse.service;

import com.fleetpulse.dto.LocationRequest;
import com.fleetpulse.dto.LocationResponse;

import java.util.List;

public interface LocationService {

    LocationResponse saveLocation(LocationRequest request);

    LocationResponse getLatestLocation(Long vehicleId);

    List<LocationResponse> getVehicleLocationHistory(Long vehicleId);
}
