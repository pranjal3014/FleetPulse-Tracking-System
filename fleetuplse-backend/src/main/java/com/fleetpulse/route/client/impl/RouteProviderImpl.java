package com.fleetpulse.route.client.impl;

import com.fleetpulse.route.client.NominatimClient;
import com.fleetpulse.route.client.OsrmRouteClient;
import com.fleetpulse.route.dto.osrm.OsrmResponse;
import com.fleetpulse.route.dto.osrm.RouteDto;
import com.fleetpulse.route.model.Coordinate;
import com.fleetpulse.route.model.RouteDetails;
import com.fleetpulse.route.service.RouteProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RouteProviderImpl implements RouteProvider {

    private final NominatimClient nominatimClient;
    private final OsrmRouteClient osrmRouteClient;

    @Override
    public RouteDetails getRoute(String origin, String destination) {

        Coordinate originCoordinate =
                nominatimClient.getCoordinates(origin);

        Coordinate destinationCoordinate =
                nominatimClient.getCoordinates(destination);

        OsrmResponse response =
                osrmRouteClient.getRoute(
                        originCoordinate,
                        destinationCoordinate
                );
        RouteDto route =
                response.getRoutes().get(0);

        double distanceKm = route.getDistance() / 1000;
        double durationHours = (route.getDuration()/60)/60;

        List<Coordinate> coordinates =
                route.getGeometry()
                        .getCoordinates()
                        .stream()
                        .map(point -> Coordinate.builder()
                                .latitude(point.get(1))
                                .longitude(point.get(0))
                                .build())
                        .toList();


        return RouteDetails.builder()
                .distanceKm(distanceKm)
                .durationHours(durationHours)
                .coordinates(coordinates)
                .build();

    }
}
