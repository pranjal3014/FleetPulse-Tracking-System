package com.fleetpulse.schedular.service.impl;

import com.fleetpulse.common.enums.TripStatus;
import com.fleetpulse.schedular.service.TripSchedulerService;
import com.fleetpulse.trip.entity.Trip;
import com.fleetpulse.trip.repository.TripRepository;
import com.fleetpulse.trip.service.TripExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TripSchedulerServiceImpl implements TripSchedulerService {

    private final TripRepository tripRepository;
    private final TripExecutionService tripExecutionService;
    @Override
    public void startScheduledTrips() {

        List<Trip> scheduledTrips =
                tripRepository.findByTripStatusAndTripDateLessThanEqualAndTripTimeLessThanEqual(
                        TripStatus.SCHEDULED,
                        LocalDate.now(),
                        LocalTime.now()
                );

        for (Trip trip : scheduledTrips) {
            try {
                tripExecutionService.startTrip(trip.getTripId());
            } catch (Exception ex) {
                log.error("Failed to start trip {}", trip.getTripId(), ex);
            }
        }

    }
}
