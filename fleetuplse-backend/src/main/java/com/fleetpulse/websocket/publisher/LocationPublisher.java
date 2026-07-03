package com.fleetpulse.websocket.publisher;


import com.fleetpulse.location.dto.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LocationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publish(LocationResponse response){
        messagingTemplate.convertAndSend("/topic/location" , response);
    }


}
