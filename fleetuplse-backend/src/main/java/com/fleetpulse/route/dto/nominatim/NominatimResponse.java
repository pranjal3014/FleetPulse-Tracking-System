package com.fleetpulse.route.dto.nominatim;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class NominatimResponse {

    @JsonProperty("lat")
    private String latitude;

    @JsonProperty("lon")
    private String longitude;
}
