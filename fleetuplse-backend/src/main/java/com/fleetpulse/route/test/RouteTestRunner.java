package com.fleetpulse.route.test;


import com.fleetpulse.route.client.NominatimClient;
import com.fleetpulse.route.client.OsrmRouteClient;
import com.fleetpulse.route.dto.osrm.OsrmResponse;
import com.fleetpulse.route.model.Coordinate;
import com.fleetpulse.route.model.RouteDetails;
import com.fleetpulse.route.service.RouteProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RouteTestRunner implements CommandLineRunner {
//    private final NominatimClient nominatimClient;
//    private final OsrmRouteClient osrmRouteClient;
    private final RouteProvider routeProvider;

    @Override
    public void run(String... args) {

        RouteDetails route =
                routeProvider.getRoute(
                        "Kolkata",
                        "Bhopal"
                );

        System.out.println("--------------------------------");
        System.out.println("Distance : " + route.getDistanceKm() + " KM");
        System.out.printf("Duration : %.2f Hrs\n", route.getDurationHours());
        System.out.println("Total Points : " + route.getCoordinates().size());
        System.out.println("First Point : " + route.getCoordinates().get(0));
        System.out.println("Last Point : "
                + route.getCoordinates()
                .get(route.getCoordinates().size() - 1));
        System.out.println("--------------------------------");
    }
    }
