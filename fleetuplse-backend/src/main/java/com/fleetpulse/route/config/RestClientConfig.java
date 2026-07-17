package com.fleetpulse.route.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;



@Configuration
public class RestClientConfig {

    @Bean
    RestClient osrmRestClient(
            @Value("${osrm.base-url}") String baseUrl
    ) {

        return RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @Bean
    RestClient nominatimRestClient(
            @Value("${nominatim.base-url}") String baseUrl
    ) {

        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("User-Agent", "FleetPulse")
                .build();
    }
}
