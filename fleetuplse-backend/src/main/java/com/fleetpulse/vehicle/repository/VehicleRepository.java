    package com.fleetpulse.vehicle.repository;

    import org.springframework.data.jpa.repository.JpaRepository;

    import com.fleetpulse.vehicle.entity.Vehicle;

    public interface VehicleRepository extends JpaRepository<Vehicle, Long>{

    }
