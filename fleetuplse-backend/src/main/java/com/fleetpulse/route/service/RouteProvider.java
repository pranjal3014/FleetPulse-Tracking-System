package com.fleetpulse.route.service;

import com.fleetpulse.route.model.RouteDetails;

public interface RouteProvider {
    RouteDetails getRoute(
            String origin,
            String destination
    );
}
