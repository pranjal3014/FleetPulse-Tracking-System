package com.fleetpulse.location.service;

import com.fleetpulse.location.dto.LocationRequest;
import com.fleetpulse.location.dto.LocationResponse;

import java.util.List;

public interface LocationService {

    LocationResponse saveLocation(LocationRequest request);

    LocationResponse getLatestLocation(Long vehicleId);

    List<LocationResponse> getVehicleLocationHistory(Long vehicleId);
}
