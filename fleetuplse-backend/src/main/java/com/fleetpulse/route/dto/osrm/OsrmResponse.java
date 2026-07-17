package com.fleetpulse.route.dto.osrm;

import lombok.Data;

import java.util.List;



@Data
public class OsrmResponse {
    private List<RouteDto> routes;
}
