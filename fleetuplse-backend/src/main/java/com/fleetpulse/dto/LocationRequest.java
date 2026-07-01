package com.fleetpulse.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class LocationRequest {
    @NotNull(message = "Vehicle Id is required")
    private Long vehicleId;

    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Latitude must be greater than or equal to -90")
    @Max(value = 90, message = "Latitude must be less than or equal to 90")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Longitude must be greater than or equal to -180")
    @Max(value = 180, message = "Longitude must be less than or equal to 180")
    private Double longitude;

    @NotNull(message = "Speed is required")
    private Double speed;
}

