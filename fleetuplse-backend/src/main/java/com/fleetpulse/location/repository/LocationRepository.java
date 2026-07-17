package com.fleetpulse.location.repository;

import com.fleetpulse.location.entity.LocationPing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationPing , Long> {

    List<LocationPing> findByVehicle_VehicleId(Long vehicleId);
    Optional<LocationPing> findTopByVehicle_VehicleIdOrderByTimestampDesc(Long vehicleId);
    void deleteByVehicleVehicleId(Long vehicleId);

}
