package com.fleetpulse.route.client.impl;

import com.fleetpulse.route.client.OsrmRouteClient;
import com.fleetpulse.route.dto.osrm.OsrmResponse;
import com.fleetpulse.route.model.Coordinate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
@RequiredArgsConstructor
public class OsrmRouteClientImpl implements OsrmRouteClient {
    private final RestClient osrmRestClient;

    @Override
    public OsrmResponse getRoute(Coordinate origin, Coordinate destination) {
        String originCoordinate =
                buildCoordinate(origin);

        String destinationCoordinate =
                buildCoordinate(destination);

        System.out.println(originCoordinate);
        System.out.println(destinationCoordinate);

        return osrmRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/route/v1/driving/{origin};{destination}")
                        .queryParam("overview", "full")
                        .queryParam("geometries", "geojson")
                        .build(originCoordinate, destinationCoordinate))
                .retrieve()
                .body(OsrmResponse.class);
    }




    private String buildCoordinate(Coordinate coordinate){

        return coordinate.getLongitude()
                + ","
                + coordinate.getLatitude();

    }
}
