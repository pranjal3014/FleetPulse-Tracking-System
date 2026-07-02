package com.fleetpulse.route.client;

import com.fleetpulse.route.model.Coordinate;

public interface  NominatimClient {


    Coordinate getCoordinates(String place);
}
