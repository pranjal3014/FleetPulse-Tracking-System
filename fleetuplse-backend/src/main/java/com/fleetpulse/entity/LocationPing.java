package com.fleetpulse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "location_pings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class LocationPing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long vehicleId;

    @Column(nullable = false)
    private Double Latitude;

    @Column(nullable = false)
    private Double Longitude;

    @Column(nullable = false)
    private Double speed;

    @Column(nullable = false)
    private LocalDateTime timestamp;

}
