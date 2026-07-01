package com.fleetpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {
    private Long id;

    private Long vehicleId;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private LocalDateTime timestamp;

}
