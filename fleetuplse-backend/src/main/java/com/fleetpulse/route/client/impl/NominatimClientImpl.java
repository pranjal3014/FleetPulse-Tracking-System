package com.fleetpulse.route.client.impl;

import com.fleetpulse.route.client.NominatimClient;
import com.fleetpulse.route.dto.nominatim.NominatimResponse;
import com.fleetpulse.route.exception.RouteException;
import com.fleetpulse.route.model.Coordinate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class NominatimClientImpl implements NominatimClient {

    private final RestClient nominatimRestClient;
    @Override
    public Coordinate getCoordinates(String place) {

        NominatimResponse[] response =
                nominatimRestClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/search")
                                .queryParam("q", place)
                                .queryParam("format", "json")
                                .queryParam("limit", 1)
                                .build())
                        .retrieve()
                        .body(NominatimResponse[].class);

        if (response == null || response.length == 0) {
            throw new RouteException("Location not found : " + place);
        }

        return Coordinate.builder()
                .latitude(Double.parseDouble(response[0].getLatitude()))
                .longitude(Double.parseDouble(response[0].getLongitude()))
                .build();
    }
}
