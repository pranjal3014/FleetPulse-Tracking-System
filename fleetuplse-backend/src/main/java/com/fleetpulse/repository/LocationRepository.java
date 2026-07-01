package com.fleetpulse.repository;

import com.fleetpulse.entity.LocationPing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationPing , Long> {

    List<LocationPing> findByVehicleId(Long vehicleId);
    Optional<LocationPing> findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);

}
