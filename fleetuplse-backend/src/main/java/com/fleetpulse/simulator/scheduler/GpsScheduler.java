package com.fleetpulse.simulator.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fleetpulse.simulator.service.GPSSimulatorService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GpsScheduler {

	private final GPSSimulatorService gpsSimulatorService;

	@Scheduled(fixedRate = 10000)
	public void runSimulation() {

		gpsSimulatorService.simulateGpsPing();

	}
}