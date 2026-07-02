package com.fleetpulse.route.dto.heyyy;


import com.fleetpulse.route.client.NominatimClient;
import com.fleetpulse.route.model.Coordinate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RouteTestRunner implements CommandLineRunner {
    private final NominatimClient nominatimClient;

    @Override
    public void run(String... args) {

        Coordinate coordinate =
                nominatimClient.getCoordinates("Seoni");

        System.out.println(coordinate);
    }
    }
