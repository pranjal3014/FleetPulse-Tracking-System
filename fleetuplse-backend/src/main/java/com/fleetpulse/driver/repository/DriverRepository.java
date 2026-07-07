package com.fleetpulse.driver.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fleetpulse.driver.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long>{

	boolean existsByUserId(Long userId);

	List<Driver> findByVehicleVehicleId(Long vehicleId);
}
