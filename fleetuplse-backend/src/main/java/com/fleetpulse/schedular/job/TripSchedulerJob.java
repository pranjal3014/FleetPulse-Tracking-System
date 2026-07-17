package com.fleetpulse.schedular.job;


import com.fleetpulse.schedular.service.TripSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TripSchedulerJob {
    private final TripSchedulerService tripSchedulerService;



    @Scheduled(fixedRate = 60000)
    public void run(){
        tripSchedulerService.startScheduledTrips();
    }

}
