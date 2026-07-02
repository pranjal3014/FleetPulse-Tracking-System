package com.fleetpulse.route.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDetails {
    private Double distanceKm;

    private Double durationHours;

    private List<Coordinate> coordinates;
}
