package com.fleetpulse.route.dto.osrm;


import lombok.Data;

@Data
public class RouteDto {
    private Double distance;

    private Double duration;

    private GeometryDto geometry;
}
