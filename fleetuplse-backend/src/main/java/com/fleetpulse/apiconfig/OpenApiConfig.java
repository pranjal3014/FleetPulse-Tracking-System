package com.fleetpulse.apiconfig;


import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {


    @Bean
    public OpenAPI fleetPulseOpenAPI(){

        return new OpenAPI()
                .info(
                        new Info()
                                .title("FleetPulse Tracking System API")
                                .description("""
                                        
                                           FleetPulse is a real-time fleet tracking system.
                                        
                                                                        Features:
                                                                        • Vehicle Management
                                                                        • Driver Management
                                                                        • Trip Management
                                                                        • Route Engine (OSRM)
                                                                        • GPS Simulator
                                                                        • Automatic Trip Scheduler
                                                                        • Live Tracking using WebSocket
                                        """)
                                .version("v1.0.0")
                                .contact(new Contact()
                                        .name("fleetPulse Team")
                                        .email("support@fleetpulse.com"))
                                .license(new License()
                                        .name("MIT License")))
                .externalDocs(new ExternalDocumentation()
                        .description("FleetPulse Documentation "));



    }

}
