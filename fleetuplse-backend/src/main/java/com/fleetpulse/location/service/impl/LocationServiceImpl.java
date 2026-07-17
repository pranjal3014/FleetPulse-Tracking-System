package com.fleetpulse.location.service.impl;

import com.fleetpulse.location.dto.LocationRequest;
import com.fleetpulse.location.dto.LocationResponse;
import com.fleetpulse.location.entity.LocationPing;
import com.fleetpulse.location.exception.LocationNotFoundException;
import com.fleetpulse.location.repository.LocationRepository;
import com.fleetpulse.location.service.LocationService;
import com.fleetpulse.vehicle.entity.Vehicle;
import com.fleetpulse.vehicle.exception.VehicleNotFoundException;
import com.fleetpulse.vehicle.repository.VehicleRepository;
import com.fleetpulse.websocket.publisher.LocationPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;
    private final LocationPublisher locationPublisher;


    @Override
    public LocationResponse saveLocation(LocationRequest request) {
       Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
               .orElseThrow(()->new VehicleNotFoundException("Vehicle Not Found"));

       LocationPing locationPing = LocationPing.builder()
               .vehicle(vehicle)
               .longitude(request.getLongitude())
               .latitude(request.getLatitude())
               .speed(request.getSpeed())
               .timestamp(LocalDateTime.now())
               .build();

       LocationPing savedLocation = locationRepository.save(locationPing);

       LocationResponse response = convertToDto(savedLocation);
       locationPublisher.publish(response);


       return convertToDto(savedLocation);

    }


    @Override
    public LocationResponse getLatestLocation(Long vehicleId) {

        LocationPing locationPing = locationRepository
                .findTopByVehicle_VehicleIdOrderByTimestampDesc(vehicleId)
                .orElseThrow(() -> new LocationNotFoundException("Location Not Found"));

        return convertToDto(locationPing);
    }

    @Override
    public List<LocationResponse> getVehicleLocationHistory(Long vehicleId) {
        List<LocationPing> locations =
                locationRepository.findByVehicle_VehicleId(vehicleId);

        if (locations.isEmpty()) {
            throw new LocationNotFoundException("No Location History Found");
        }

        return locations.stream()
                .map(this::convertToDto)
                .toList();
    }


    private LocationResponse convertToDto(LocationPing locationPing) {
        return LocationResponse.builder()
                .id(locationPing.getId())
                .vehicleId(locationPing.getVehicle().getVehicleId())
                .longitude(locationPing.getLongitude())
                .latitude(locationPing.getLatitude())
                .speed(locationPing.getSpeed())
                .timestamp(locationPing.getTimestamp())
                .build();

    }

}
