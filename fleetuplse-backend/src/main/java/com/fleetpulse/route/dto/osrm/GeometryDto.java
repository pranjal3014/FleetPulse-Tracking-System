package com.fleetpulse.route.dto.osrm;

import lombok.Data;

import java.util.List;


@Data
public class GeometryDto {
    private List<List<Double>> coordinates;
}
