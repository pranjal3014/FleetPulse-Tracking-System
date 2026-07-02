package com.fleetpulse.route.client;

import com.fleetpulse.route.dto.osrm.OsrmResponse;
import com.fleetpulse.route.model.Coordinate;

public interface OsrmRouteClient {

    OsrmResponse getRoute(Coordinate origin , Coordinate destination);
}
