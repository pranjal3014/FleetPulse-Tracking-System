package com.fleetpulse.driver.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fleetpulse.driver.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long>{

}
